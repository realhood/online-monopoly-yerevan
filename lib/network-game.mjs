import {Game} from '../public/game/engine.js';
const alphabet='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const random=()=>crypto.getRandomValues(new Uint32Array(1))[0]/4294967296;
const secret=()=>Array.from(crypto.getRandomValues(new Uint8Array(24)),n=>n.toString(16).padStart(2,'0')).join('');
const hash=async s=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s))),n=>n.toString(16).padStart(2,'0')).join('');
const fail=(text,status=400)=>{throw Object.assign(new Error(text),{status});};
const name=v=>{if(typeof v!=='string'||!v.trim()||v.trim().length>22)fail('Enter a name with 1–22 characters.');return v.trim();};
const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
export function actingSeat(s){return s.phase==='auction'?s.auction.bidder:s.phase==='debt'?s.debt.from:s.phase==='transfer'?s.transfer.owner:s.turn;}
export function publicRoom(room,seat){const state=room.state?structuredClone(room.state):null;if(state)state.decks={chance:[],chest:[]};return {code:room.code,revision:room.revision,seat,capacity:room.capacity,players:room.players.map((p,i)=>({id:i,name:p.name,host:i===0})),state,pendingTrade:room.trade&&[room.trade.args[0],room.trade.args[1]].includes(seat)?room.trade:null,tradeWaiting:!!room.trade,claimsSubmitted:Object.keys(room.claims||{}).map(Number),expiresAt:room.expiresAt};}
function validateArgs(command,args){if(!Array.isArray(args)||args.length>10)fail('Invalid action.');const noArgs=['roll','buy','beginAuction','endTurn','jailPay','jailCard','continueCard','pass','settleDebt','bankrupt'];if(noArgs.includes(command)&&args.length)fail('This action takes no arguments.');if(['manage','requestBuilding'].includes(command)){if(!Number.isInteger(args[0])||args[0]<0||args[0]>39)fail('Invalid deed.');if(command==='manage'&&(args.length!==3||!['sell','mortgage','redeem','liquidate'].includes(args[1])))fail('Invalid property action.');if(command==='requestBuilding'&&args.length!==2)fail('Invalid building request.');}if(command==='bid'&&(args.length!==1||!Number.isInteger(args[0])))fail('Enter a whole bid.');if(command==='transferMortgage'&&(args.length!==1||typeof args[0]!=='boolean'))fail('Invalid mortgage choice.');}
export function applyAction(room,seat,command,args,rng=random){
 const g=new Game([],rng,structuredClone(room.state));if(!g.s)fail('The host has not started yet.');validateArgs(command,args);if(room.trade)fail('Accept, decline or cancel the pending trade first.');
 if(['manage','requestBuilding'].includes(command)){const owner=command==='manage'?args[2]:args[1];if(owner!==seat)fail('You can only manage your own properties.',403);}
 else if(command==='buildingClaims'){
  if(g.s.phase!=='buildingClaims'||args.length!==1||!args[0]||typeof args[0]!=='object')fail('No building claim is available.');const candidate=g.s.buildRequest.candidates.find(c=>c.id===seat);if(!candidate)fail('You are not eligible for this building.',403);const entries=Object.entries(args[0]);if(entries.some(([id])=>Number(id)!==seat))fail('Submit only your own building choice.',403);const choice=entries.length?entries[0][1]:null;if(choice!==null&&!candidate.deeds.includes(choice))fail('Choose an eligible deed.');room.claims??={};if(Object.hasOwn(room.claims,seat))fail('Your choice has already been submitted.');room.claims[seat]=choice;
  if(g.s.buildRequest.candidates.every(c=>Object.hasOwn(room.claims,c.id))){g.buildingClaims(Object.fromEntries(Object.entries(room.claims).filter(([,v])=>v!==null)));room.claims={};}room.state=g.s;return;
 }else{const expected=['bid','pass'].includes(command)?g.s.auction?.bidder:['settleDebt','bankrupt'].includes(command)?g.s.debt?.from:command==='transferMortgage'?g.s.transfer?.owner:g.s.turn;if(expected!==seat)fail('Wait for your turn.',403);}
 const allowed=['roll','buy','beginAuction','endTurn','jailPay','jailCard','continueCard','bid','pass','settleDebt','bankrupt','transferMortgage','manage','requestBuilding'];if(!allowed.includes(command))fail('Unknown game action.');if(g.s.players[seat]?.out)fail('This player is out of the game.');g[command](...args);room.state=g.s;
}
export async function handleRooms(request,db,options={}){
 try{
  if(!db)return json({error:'Online rooms are temporarily unavailable.'},503);const url=new URL(request.url),code=url.pathname.split('/').filter(Boolean)[2]?.toUpperCase();if(request.headers.get('Origin')&&request.headers.get('Origin')!==url.origin)fail('Use this game’s own website.',403);
  const now=options.now??Date.now(),rng=options.rng??random;let body={};if(request.method==='POST'){if(!request.headers.get('Content-Type')?.includes('application/json'))fail('Send JSON.',415);const raw=await request.text();if(raw.length>16000)fail('Request is too large.',413);try{body=JSON.parse(raw);}catch{fail('Invalid request.');}}
  if(!code&&request.method==='POST'){
   if(body.operation!=='create')fail('Choose Create room.');const capacity=Number(body.capacity);if(![2,3,4].includes(capacity))fail('Choose 2–4 players.');const token=secret(),player={name:name(body.name),key:await hash(token)};
   // Bound room creation per network without retaining raw IP addresses.
   const client=request.headers.get('CF-Connecting-IP');if(client){const bucket=await hash(client+'|'+Math.floor(now/3600000)),count=await db.prepare('SELECT COUNT(*) AS n FROM network_rooms WHERE creator_bucket = ? AND expires_at > ?').bind(bucket,now).first();if(count.n>=12)fail('Too many new rooms. Reuse a room or try again later.',429);body.bucket=bucket;}
   for(let attempt=0;attempt<4;attempt++){const roomCode=Array.from({length:8},()=>alphabet[Math.floor(rng()*alphabet.length)]).join(''),room={code:roomCode,capacity,players:[player],state:null,revision:1,expiresAt:now+7*86400000,claims:{},trade:null,recent:[]};try{await db.prepare('INSERT INTO network_rooms (code, revision, payload, expires_at, creator_bucket) VALUES (?, ?, ?, ?, ?)').bind(roomCode,1,JSON.stringify(room),room.expiresAt,body.bucket??'local').run();return json({...publicRoom(room,0),token},201);}catch(e){if(!String(e).includes('UNIQUE'))throw e;}}
   fail('Could not create a room. Please try again.',503);
  }
  if(!code||!/^[A-Z2-9]{8}$/.test(code))fail('Enter an eight-character room code.',404);const record=await db.prepare('SELECT payload, revision FROM network_rooms WHERE code = ? AND expires_at > ?').bind(code,now).first();if(!record)fail('Room not found or expired. Check the code.',404);const room=JSON.parse(record.payload),bearer=request.headers.get('Authorization')?.replace(/^Bearer /,'')??'',key=bearer?await hash(bearer):'',seat=room.players.findIndex(p=>p.key===key);
  if(request.method==='GET'){if(seat<0)fail('Join this room first.',401);return json(publicRoom(room,seat));}
  if(request.method!=='POST')fail('Method not allowed.',405);
  if(body.operation==='join'){
   if(seat>=0)return json(publicRoom(room,seat));if(room.state)fail('This game has started. Rejoin using the original browser.');if(room.players.length>=room.capacity)fail('This room is full.');const token=/^[a-f0-9]{48}$/.test(bearer)?bearer:secret();room.players.push({name:name(body.name),key:await hash(token)});await persist(room,record.revision,db,now);return json({...publicRoom(room,room.players.length-1),token});
  }
  if(seat<0)fail('Your seat could not be verified. Rejoin in the original browser.',401);
  if(typeof body.requestId!=='string'||!/^[a-zA-Z0-9-]{12,80}$/.test(body.requestId))fail('Missing action identifier.');if(room.recent.some(x=>x.id===body.requestId&&x.seat===seat))return json(publicRoom(room,seat));if(body.revision!==record.revision)fail('The table changed. Review the latest board and try again.',409);
  if(body.operation==='start'){if(seat!==0)fail('Only the host can start.',403);if(room.state)fail('This game has already started.');if(room.players.length<2)fail('Wait for at least one other player.');room.state=new Game(room.players.map(p=>p.name),rng).s;}
  else if(body.operation==='action'){if(!room.state)fail('The host has not started yet.');applyAction(room,seat,body.command,body.args,rng);}
  else if(body.operation==='proposeTrade'){
   if(!room.state||room.trade)fail('Another trade is pending, or the game has not started.');const a=body.args;if(!Array.isArray(a)||a.length!==9||a[0]!==seat||!Number.isInteger(a[1])||a[1]===seat||!room.players[a[1]])fail('Invalid trade.');const trial=new Game([],rng,structuredClone(room.state));trial.trade(...a);room.trade={id:body.requestId,args:a};
  }else if(body.operation==='respondTrade'){
   const t=room.trade;if(!t||body.tradeId!==t.id)fail('This proposal is no longer available.');if(body.accept===true){if(seat!==t.args[1])fail('Only the recipient may accept.',403);const g=new Game([],rng,structuredClone(room.state));g.trade(...t.args);room.state=g.s;}else if(![t.args[0],t.args[1]].includes(seat))fail('This proposal belongs to other players.',403);room.trade=null;
  }else fail('Unknown room action.');
  room.recent.push({id:body.requestId,seat});room.recent=room.recent.slice(-24);await persist(room,record.revision,db,now);return json(publicRoom(room,seat));
 }catch(e){return json({error:e.status?e.message: /D1|SQLITE|database/i.test(e.message)?'Online rooms are temporarily unavailable. Please retry.':e.message},e.status??400);}
}
async function persist(room,revision,db,now){room.revision=revision+1;room.expiresAt=now+7*86400000;const r=await db.prepare('UPDATE network_rooms SET revision = ?, payload = ?, expires_at = ? WHERE code = ? AND revision = ?').bind(room.revision,JSON.stringify(room),room.expiresAt,room.code,revision).run();if(r.meta.changes!==1)fail('The table changed. Review the latest board and try again.',409);}

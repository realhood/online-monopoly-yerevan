const socialError=(message,status=400)=>{throw Object.assign(new Error(message),{status});};
const socialJson=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
const socialHash=async value=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value))),n=>n.toString(16).padStart(2,'0')).join('');
export async function voiceIceConfig(env,code,seat,now){
 const iceServers=[{urls:['stun:stun.l.google.com:19302','stun:stun1.l.google.com:19302']}],urls=String(env.VOICE_TURN_URLS||'').split(',').map(s=>s.trim()).filter(s=>/^turns?:/.test(s));
 if(urls.length&&env.VOICE_TURN_SECRET){const username=`${Math.floor(now/1000)+3600}:${code}-${seat}`,key=await crypto.subtle.importKey('raw',new TextEncoder().encode(env.VOICE_TURN_SECRET),{name:'HMAC',hash:'SHA-1'},false,['sign']),signature=await crypto.subtle.sign('HMAC',key,new TextEncoder().encode(username));iceServers.push({urls,username,credential:btoa(String.fromCharCode(...new Uint8Array(signature)))});}
 return {iceServers,relayAvailable:iceServers.length>1};
}
async function members(db,code,now){return (await db.prepare('SELECT seat, session, muted FROM network_voice_members WHERE room_code = ? AND expires_at > ? ORDER BY seat').bind(code,now).all()).results.map(m=>({...m,muted:!!m.muted}));}
async function socialSnapshot(db,code,now){return {messages:(await db.prepare('SELECT id, seat, text, created_at AS at FROM network_messages WHERE room_code = ? ORDER BY created_at DESC, id DESC LIMIT 100').bind(code).all()).results.reverse(),voiceMembers:await members(db,code,now),serverTime:now};}
export async function handleSocial(request,db,env={},options={}){
 try{
  if(!db)socialError('Room chat is temporarily unavailable.',503);const url=new URL(request.url),code=url.pathname.split('/')[3]?.toUpperCase(),now=options.now??Date.now();
  if(request.headers.get('Origin')&&request.headers.get('Origin')!==url.origin)socialError('Use this game’s own website.',403);
  if(!/^[A-Z2-9]{8}$/.test(code||''))socialError('Room not found.',404);
  const record=await db.prepare('SELECT payload FROM network_rooms WHERE code = ? AND expires_at > ?').bind(code,now).first();if(!record)socialError('This room has expired.',404);
  const room=JSON.parse(record.payload),key=await socialHash(request.headers.get('Authorization')?.replace(/^Bearer /,'')||''),seat=room.players.findIndex(p=>p.key===key);if(seat<0)socialError('Rejoin your seat to use room chat or voice.',401);
  let body={};if(request.method==='POST'){if(!request.headers.get('Content-Type')?.includes('application/json'))socialError('Send JSON.',415);const raw=await request.text();if(raw.length>40000)socialError('Message is too large.',413);try{body=JSON.parse(raw);}catch{socialError('Invalid message.');}}
  else if(request.method!=='GET')socialError('Method not allowed.',405);
  if(body.operation==='chat'){
   if(!/^[a-zA-Z0-9-]{12,80}$/.test(body.requestId||''))socialError('Missing message identifier.');const text=typeof body.text==='string'?body.text.trim():'';if(!text||text.length>500)socialError('Write a message of 1–500 characters.');
   const previous=await db.prepare('SELECT seat FROM network_messages WHERE room_code = ? AND id = ?').bind(code,body.requestId).first();if(previous&&previous.seat!==seat)socialError('Invalid message identifier.',403);
   if(!previous){const count=await db.prepare('SELECT COUNT(*) AS n FROM network_messages WHERE room_code = ? AND seat = ? AND created_at > ?').bind(code,seat,now-10000).first();if(count.n>=8)socialError('A few too many messages. Wait a moment.',429);await db.prepare('INSERT OR IGNORE INTO network_messages (room_code, id, seat, text, created_at) VALUES (?, ?, ?, ?, ?)').bind(code,body.requestId,seat,text,now).run();}
   return socialJson(await socialSnapshot(db,code,now));
  }
  const session=body.session||url.searchParams.get('voiceSession'),after=Number(body.after??url.searchParams.get('after')??0);
  if(body.operation?.startsWith('voice')||session){
   if(!/^[a-zA-Z0-9-]{12,80}$/.test(session||''))socialError('Invalid voice session.');
   if(body.operation==='voiceJoin'){
    await db.prepare('INSERT INTO network_voice_members (room_code, seat, session, muted, expires_at) VALUES (?, ?, ?, ?, ?) ON CONFLICT(room_code, seat) DO UPDATE SET session = excluded.session, muted = excluded.muted, expires_at = excluded.expires_at').bind(code,seat,session,body.muted?1:0,now+35000).run();
    await db.prepare('DELETE FROM network_voice_signals WHERE expires_at < ?').bind(now).run();
    return socialJson({voiceMembers:await members(db,code,now),config:await voiceIceConfig(env,code,seat,now),serverTime:now});
   }
   if(body.operation==='voiceLeave'){await db.prepare('DELETE FROM network_voice_members WHERE room_code = ? AND seat = ? AND session = ?').bind(code,seat,session).run();return socialJson({voiceMembers:await members(db,code,now)});}
   const own=await db.prepare('SELECT session FROM network_voice_members WHERE room_code = ? AND seat = ? AND expires_at > ?').bind(code,seat,now).first();if(own?.session!==session)socialError('Voice session ended. Join voice again.',409);
   if(body.operation==='voiceHeartbeat')await db.prepare('UPDATE network_voice_members SET muted = ?, expires_at = ? WHERE room_code = ? AND seat = ? AND session = ?').bind(body.muted?1:0,now+35000,code,seat,session).run();
   else if(body.operation==='voiceSignal'){
    if(!Number.isInteger(body.to)||body.to===seat||!room.players[body.to])socialError('Invalid voice recipient.');const peer=await db.prepare('SELECT session FROM network_voice_members WHERE room_code = ? AND seat = ? AND expires_at > ?').bind(code,body.to,now).first();if(peer?.session!==body.toSession)socialError('The other player left voice.',409);
    const signals=body.signals;if(!Array.isArray(signals)||!signals.length||signals.length>20)socialError('Invalid voice signal.');
    for(const signal of signals){if(!signal||typeof signal!=='object'||!(signal.description&&['offer','answer'].includes(signal.description.type)&&typeof signal.description.sdp==='string'&&signal.description.sdp.length<25000||signal.candidate&&typeof signal.candidate.candidate==='string'&&signal.candidate.candidate.length<2500))socialError('Invalid voice signal.');}
    const count=await db.prepare('SELECT COUNT(*) AS n FROM network_voice_signals WHERE room_code = ? AND sender = ? AND expires_at > ?').bind(code,seat,now+50000).first();if(count.n>=40)socialError('Voice is reconnecting. Try again shortly.',429);
    await db.prepare('INSERT INTO network_voice_signals (room_code, sender, sender_session, recipient, recipient_session, payload, expires_at) VALUES (?, ?, ?, ?, ?, ?, ?)').bind(code,seat,session,body.to,body.toSession,JSON.stringify(signals),now+60000).run();return socialJson({ok:true});
   }else if(body.operation)socialError('Unknown voice action.');
   if(!Number.isSafeInteger(after)||after<0)socialError('Invalid voice cursor.');
   const signals=(await db.prepare('SELECT id, sender, sender_session AS session, payload FROM network_voice_signals WHERE room_code = ? AND recipient = ? AND recipient_session = ? AND id > ? AND expires_at > ? ORDER BY id LIMIT 100').bind(code,seat,session,after,now).all()).results.map(s=>({...s,signals:JSON.parse(s.payload),payload:undefined}));
   return socialJson({voiceMembers:await members(db,code,now),signals,serverTime:now});
  }
  if(body.operation)socialError('Unknown room message.');return socialJson(await socialSnapshot(db,code,now));
 }catch(e){if(!e.status)console.error('Room social error:',e.message);return socialJson({error:e.status?e.message:'Room communication is temporarily unavailable. Please retry.'},e.status??503);}
}

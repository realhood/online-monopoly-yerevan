// Classic property-trading rules. Money is stored in classic units; the UI uses ֏1,000 per unit.
export const GROUPS = [
  {name:'Old Yerevan',color:'#93634c',house:50}, {name:'City Gardens',color:'#77bac8',house:50},
  {name:'Arts Quarter',color:'#c87899',house:100}, {name:'The Heart of Town',color:'#dc934d',house:100},
  {name:'City Landmarks',color:'#c65c50',house:150}, {name:'Culture & Heritage',color:'#d2b94c',house:150},
  {name:'The Grand Avenues',color:'#43876d',house:200}, {name:'Yerevan Icons',color:'#5579ae',house:200}
];
const p=(name,group,price,rents,fact)=>({name,type:'property',group,price,rents,fact});
const s=(name,type,fact,price)=>({name,type,fact,price});
export const BOARD = [
 s('START · ԲԱՐԻ ԳԱԼՈՒՍՏ','go','Bari galust! Welcome to Yerevan. Collect ֏200,000 when you pass.'),
 p('Kond',0,60,[2,10,30,90,160,250],'Winding lanes and courtyards of one of Yerevan’s oldest neighborhoods.'),
 s('Community Chest','chest','A little help from the community.'),
 p('Dzoragyugh',0,60,[4,20,60,180,320,450],'An old quarter above the Hrazdan gorge.'),
 s('Income Tax','tax','Pay ֏200,000 to the bank.'),
 s('Sasuntsi Davit','station','A transport deed inspired by Yerevan’s metro.',200),
 p('English Park',1,100,[6,30,90,270,400,550],'A green retreat in the center of the city.'),
 s('Chance · ՇԱՆՍ','chance','An unexpected turn in the Pink City.'),
 p('Children’s Park',1,100,[6,30,90,270,400,550],'A neighborhood afternoon of paths, play and shade.'),
 p('Lovers’ Park',1,120,[8,40,100,300,450,600],'Quiet paths and water features beside Baghramyan Avenue.'),
 s('JAIL · JUST VISITING','jail','Just visiting unless you have been sent here.'),
 p('Tumanyan Street',2,140,[10,50,150,450,625,750],'A lively street named for the Armenian poet Hovhannes Tumanyan.'),
 s('Yerevan Electric','utility','Rent: 4× the dice, or 10× if both utilities are owned.',150),
 p('Saryan Street',2,140,[10,50,150,450,625,750],'Wine bars, galleries and an evening stroll.'),
 p('Parpetsi Street',2,160,[12,60,180,500,700,900],'Small cafés and city life in Kentron.'),
 s('Barekamutyun','station','A transport deed inspired by Yerevan’s metro.',200),
 p('Vernissage',3,180,[14,70,200,550,750,950],'Crafts, carpets and handmade treasures at the open-air market.'),
 s('Community Chest','chest','A little help from the community.'),
 p('GUM Market',3,180,[14,70,200,550,750,950],'Dried fruit, lavash and the colors of an Armenian market.'),
 p('Mashtots Avenue',3,200,[16,80,220,600,800,1000],'A central avenue named for the creator of the Armenian alphabet.'),
 s('FREE PARKING','parking','Take a break. No payment or jackpot.'),
 p('Victory Park',4,220,[18,90,250,700,875,1050],'A hilltop park overlooking the city.'),
 s('Chance · ՇԱՆՍ','chance','An unexpected turn in the Pink City.'),
 p('Mother Armenia',4,220,[18,90,250,700,875,1050],'The monumental figure watching over Yerevan.'),
 p('Opera Theatre',4,240,[20,100,300,750,925,1100],'Music and performance at the heart of the city.'),
 s('Yeritasardakan','station','A transport deed inspired by Yerevan’s metro.',200),
 p('Matenadaran',5,260,[22,110,330,800,975,1150],'A landmark repository of Armenian manuscripts.'),
 p('Erebuni Fortress',5,260,[22,110,330,800,975,1150],'Ancient Erebuni connects the city to its Urartian past.'),
 s('Yerevan Water','utility','Rent: 4× the dice, or 10× if both utilities are owned.',150),
 p('Tsitsernakaberd',5,280,[24,120,360,850,1025,1200],'The Armenian Genocide memorial, a place of remembrance.'),
 s('GO TO JAIL','gotojail','Go directly to jail. Do not collect a START salary.'),
 p('Abovyan Street',6,300,[26,130,390,900,1100,1275],'Historic façades along one of Yerevan’s best-loved streets.'),
 p('Baghramyan Avenue',6,300,[26,130,390,900,1100,1275],'A grand avenue lined with civic buildings and gardens.'),
 s('Community Chest','chest','A little help from the community.'),
 p('Northern Avenue',6,320,[28,150,450,1000,1200,1400],'The pedestrian avenue between the Opera and Republic Square.'),
 s('Republic Square Metro','station','A transport deed inspired by Yerevan’s metro.',200),
 s('Chance · ՇԱՆՍ','chance','An unexpected turn in the Pink City.'),
 p('Cascade',7,350,[35,175,500,1100,1300,1500],'Terraced steps, art and sweeping views of Yerevan.'),
 s('Luxury Tax','luxury','Pay ֏100,000 to the bank.'),
 p('Republic Square',7,400,[50,200,600,1400,1700,2000],'Pink tuff, grand arches and the city’s singing fountains.')
];
export const TOKENS=[{name:'Pomegranate',armenian:'Նուռ',description:'Ruby fruit with a sculpted crown.',icon:'✿',color:'#b84944'},{name:'Apricot',armenian:'Ծիրան',description:'Golden fruit with a bronze stem and leaf.',icon:'●',color:'#eaa14d'},{name:'Ararat',armenian:'Արարատ',description:'Twin peaks with an irregular snowy ridge.',icon:'▲',color:'#448d83'},{name:'Duduk',armenian:'Դուդուկ',description:'Apricot-wood instrument with brass bands.',icon:'♫',color:'#687dc2'},{name:'Khachkar',armenian:'Խաչքար',description:'Carved tuff cross-stone with a rosette.',icon:'✚',color:'#ae7bba'},{name:'Carpet',armenian:'Գորգ',description:'Woven diamond motifs and tasseled edges.',icon:'◆',color:'#72a5ba'},{name:'Gata',armenian:'Գաթա',description:'Golden pastry with a scored sun pattern.',icon:'☀',color:'#a58b58'},{name:'Chess knight',armenian:'Ձի',description:'A sculpted knight celebrating Armenian chess.',icon:'♞',color:'#96a66e'}];
export function pieceIndex(player,seat=0){return Number.isInteger(player?.token)&&player.token>=0&&player.token<TOKENS.length?player.token:seat%TOKENS.length;}
export function selectedPieces(players){return players.map((p,i)=>pieceIndex(p,i));}
const move=to=>({type:'moveTo',to});
const pay=amount=>({type:'pay',amount,to:null});
const gain=amount=>({type:'gain',amount});
export const CARDS={chance:[
 {title:'The city welcomes you',text:'Advance to START. Collect ֏200,000.',effects:[move(0)]},
 {title:'A night at the Opera',text:'Advance to Opera Theatre. Collect your salary if you pass START.',effects:[move(24)]},
 {title:'A walk along Tumanyan',text:'Advance to Tumanyan Street. Collect your salary if you pass START.',effects:[move(11)]},
 {title:'Keep the city running',text:'Advance to the nearest utility. If owned, roll fresh dice and pay 10× the result.',effects:[{type:'nearest',kind:'utility',special:true}]},
 {title:'Catch the metro',text:'Advance to the nearest metro. If owned, pay double the usual rent.',effects:[{type:'nearest',kind:'station',special:true}]},
 {title:'Next train, please',text:'Advance to the nearest metro. If owned, pay double the usual rent.',effects:[{type:'nearest',kind:'station',special:true}]},
 {title:'A good harvest',text:'Your apricot investment pays a dividend. Collect ֏50,000.',effects:[gain(50)]},
 {title:'Get Out of Jail Free',text:'Keep this card until needed, or trade it to another player.',effects:[{type:'jailcard',deck:'chance'}]},
 {title:'A wrong turn in Kond',text:'Go back three spaces and resolve your new space.',effects:[{type:'back',steps:3}]},
 {title:'Go directly to Jail',text:'Do not pass START. Do not collect your salary.',effects:[{type:'jail'}]},
 {title:'Restore the tuff façades',text:'Pay ֏25,000 per house and ֏100,000 per hotel you own.',effects:[{type:'repairs',house:25,hotel:100}]},
 {title:'A traffic fine',text:'Pay ֏15,000 to the bank.',effects:[pay(15)]},
 {title:'Sasuntsi Davit is calling',text:'Advance to Sasuntsi Davit metro. Collect your salary if you pass START.',effects:[move(5)]},
 {title:'The singing fountains',text:'Advance to Republic Square.',effects:[move(39)]},
 {title:'Host a neighborhood feast',text:'Pay every other player ֏50,000.',effects:[{type:'each',amount:50,direction:'pay'}]},
 {title:'Your savings mature',text:'Collect ֏150,000 from the bank.',effects:[gain(150)]}
],chest:[
 {title:'Bari galust!',text:'Advance to START. Collect ֏200,000.',effects:[move(0)]},
 {title:'A bank correction',text:'A bank error is in your favor. Collect ֏200,000.',effects:[gain(200)]},
 {title:'A doctor’s visit',text:'Pay ֏50,000.',effects:[pay(50)]},
 {title:'Your craft stall succeeds',text:'Collect ֏50,000 from a sale at Vernissage.',effects:[gain(50)]},
 {title:'Get Out of Jail Free',text:'Keep this card until needed, or trade it to another player.',effects:[{type:'jailcard',deck:'chest'}]},
 {title:'Go directly to Jail',text:'Do not pass START. Do not collect your salary.',effects:[{type:'jail'}]},
 {title:'Holiday savings',text:'Your holiday fund matures. Collect ֏100,000.',effects:[gain(100)]},
 {title:'Tax refund',text:'Collect ֏20,000 from the bank.',effects:[gain(20)]},
 {title:'Happy birthday · ԾՆՈՒՆԴԴ ՇՆՈՐՀԱՎՈՐ',text:'Collect ֏10,000 from every other player.',effects:[{type:'each',amount:10,direction:'collect'}]},
 {title:'Life insurance matures',text:'Collect ֏100,000 from the bank.',effects:[gain(100)]},
 {title:'Hospital fees',text:'Pay ֏100,000 to the bank.',effects:[pay(100)]},
 {title:'School fees',text:'Pay ֏50,000 to the bank.',effects:[pay(50)]},
 {title:'Help a local artist',text:'Collect a ֏25,000 consultancy fee.',effects:[gain(25)]},
 {title:'Street improvements',text:'Pay ֏40,000 per house and ֏115,000 per hotel you own.',effects:[{type:'repairs',house:40,hotel:115}]},
 {title:'The best gata in town',text:'You win a baking prize. Collect ֏10,000.',effects:[gain(10)]},
 {title:'A family inheritance',text:'Collect ֏100,000 from the bank.',effects:[gain(100)]}
]};
const shuffle=(a,rng)=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
export class Game {
 constructor(names=['Player 1','Player 2'],rng=Math.random,saved=null,clock=Date.now){
  this.rng=rng;this.clock=clock;
  if(!saved){if(names.length<2||names.length>6)throw Error('Choose 2–6 players.');const tokens=selectedPieces(names.map(n=>typeof n==='object'?n:{}));if(new Set(tokens).size!==tokens.length)throw Error('Each player needs a different piece.');}
  this.s=saved||{version:1,players:names.map((n,i)=>({id:i,name:(typeof n==='object'?n.name:n)||`Player ${i+1}`,token:pieceIndex(typeof n==='object'?n:null,i),cash:1500,pos:0,jailed:false,jailTurns:0,cards:[],out:false})),props:BOARD.map(()=>({owner:null,houses:0,mortgaged:false})),turn:0,round:1,phase:'roll',dice:[1,1],doubles:0,extra:false,queue:[],decks:{chance:shuffle([...Array(16).keys()],rng),chest:shuffle([...Array(16).keys()],rng)},log:[],auction:null,debt:null,pendingCard:null,transfer:null};
  if(!saved){let candidates=this.s.players.map(p=>p.id);let attempts=0;while(candidates.length>1){const rolls=candidates.map(id=>({id,n:this.die()+this.die()}));const high=Math.max(...rolls.map(r=>r.n));this.log(`Opening ${attempts?'tie-break ':''}rolls — ${rolls.map(r=>`${this.s.players[r.id].name}: ${r.n}`).join(' · ')}.`);candidates=rolls.filter(r=>r.n===high).map(r=>r.id);if(++attempts>1000)throw Error('The dice source is not producing distinct opening rolls.');}this.s.turn=candidates[0];this.log(`${this.current.name} won the opening roll and starts.`);}
 }
 get current(){return this.s.players[this.s.turn];}
 die(){return 1+Math.floor(this.rng()*6);}
 log(text,meta={}){this.s.log.unshift(text);this.s.log=this.s.log.slice(0,100);this.s.events??=[];const player=meta.player??this.s.players.find(p=>text.startsWith(p.name+' ')||text.startsWith(p.name+':')||text.startsWith(p.name+'’'))?.id??null;this.s.eventSequence=(this.s.eventSequence||0)+1;this.s.events.unshift({id:this.s.eventSequence,at:this.clock(),round:this.s.round,action:this.s.presentation?.action||'setup',actionPlayer:this.s.presentation?.player??null,group:this.s.presentation?.id||0,player,text,...meta});this.s.events=this.s.events.slice(0,300);}
 prepend(...tasks){this.s.queue.unshift(...tasks);}
 group(i){return BOARD.map((b,j)=>b.type==='property'&&b.group===BOARD[i].group?j:-1).filter(j=>j>=0);}
 ownsGroup(i,id){return this.group(i).every(j=>this.s.props[j].owner===id);}
 stock(){let houses=32,hotels=12;this.s.props.forEach(p=>{if(p.houses===5)hotels--;else houses-=p.houses;});return {houses,hotels};}
 rent(i,roll=this.s.dice[0]+this.s.dice[1],special=false){
  const b=BOARD[i],p=this.s.props[i];if(p.mortgaged||p.owner===null)return 0;
  if(b.type==='property')return b.rents[p.houses]*(p.houses===0&&this.ownsGroup(i,p.owner)?2:1);
  const n=BOARD.filter((b,j)=>b.type===BOARD[i].type&&this.s.props[j].owner===p.owner).length;
  return b.type==='station'?25*2**(n-1)*(special?2:1):roll*(special||n===2?10:4);
 }
 roll(dice){
  if(this.s.phase!=='roll')throw Error('Finish the current action first.');
  const a=dice||[this.die(),this.die()];this.s.dice=a;this.s.phase='resolving';const dbl=a[0]===a[1];const p=this.current;this.log(`${p.name} rolled ${a[0]} + ${a[1]}${dbl?" · Doubles":""}.`,{player:p.id,type:"roll",dice:[...a]});
  if(p.jailed){this.s.extra=false;p.jailTurns++;
   if(dbl){p.jailed=false;p.jailTurns=0;this.log(`${p.name} rolled doubles and left jail.`);this.prepend({type:'steps',steps:a[0]+a[1]},{type:'finish'});}
   else if(p.jailTurns>=3){this.prepend({type:'pay',amount:50,to:null,reason:'Third jail turn'},{type:'release'},{type:'steps',steps:a[0]+a[1]},{type:'finish'});}
   else {this.log(`${p.name} stays in jail (${p.jailTurns}/3 attempts).`);this.prepend({type:'finish'});}
  }else{this.s.doubles=dbl?this.s.doubles+1:0;this.s.extra=dbl;
   if(this.s.doubles===3)this.prepend({type:'jail'},{type:'finish'});
   else this.prepend({type:'steps',steps:a[0]+a[1]},{type:'finish'});
  }this.resolve();
 }
 resolve(){
  this.s.phase='resolving';
  while(this.s.queue.length){const t=this.s.queue.shift(),p=this.s.players[t.from??this.s.turn];
   if(p?.out&&t.type!=='bankAuction')continue;
   switch(t.type){
    case 'steps':{const from=p.pos,to=(p.pos+t.steps)%40;this.s.presentation?.moves.push({player:p.id,from,to,kind:'walk',spaces:Array.from({length:t.steps},(_,n)=>(from+n+1)%40)});if(p.pos+t.steps>=40){p.cash+=200;this.log(`${p.name} passed START: +֏200,000.`,{player:p.id,type:"income",amount:200,balance:p.cash});}p.pos=to;this.prepend({type:'land',special:t.special});break;}
    case 'moveTo':{let steps=(t.to-p.pos+40)%40;if(t.to===0&&steps===0)steps=40;this.prepend({type:'steps',steps,special:t.special});break;}
    case 'back':{const from=p.pos,to=(from-t.steps+40)%40;this.s.presentation?.moves.push({player:p.id,from,to,kind:'back',spaces:Array.from({length:t.steps},(_,n)=>(from-n-1+40)%40)});p.pos=to;this.prepend({type:'land'});break;}
    case 'nearest':{let n=(p.pos+1)%40;while(BOARD[n].type!==t.kind)n=(n+1)%40;this.prepend({type:'moveTo',to:n,special:t.special});break;}
    case 'land':{const i=p.pos,b=BOARD[i],prop=this.s.props[i];this.log(`${p.name} arrived at ${b.name}.`,{player:p.id,type:"arrival",space:i});
     if(b.price){if(prop.owner===null){this.s.phase='buy';return;}if(prop.owner!==p.id&&!prop.mortgaged){let roll=this.s.dice[0]+this.s.dice[1];if(b.type==='utility'&&t.special){const d=[this.die(),this.die()];roll=d[0]+d[1];this.log(`Utility card roll: ${d.join(' + ')} = ${roll}.`);}this.prepend({type:'pay',amount:this.rent(i,roll,t.special),to:prop.owner,reason:`Rent · ${b.name}`});}}
     else if(b.type==='tax'||b.type==='luxury')this.prepend({type:'pay',amount:b.type==='tax'?200:100,to:null,reason:b.name});
     else if(b.type==='gotojail')this.prepend({type:'jail'});
     else if(b.type==='chest'||b.type==='chance')this.prepend({type:'draw',deck:b.type});break;
    }
    case 'draw':{const id=this.s.decks[t.deck].shift();const c=CARDS[t.deck][id];if(!c.effects.some(e=>e.type==='jailcard'))this.s.decks[t.deck].push(id);this.s.pendingCard={deck:t.deck,id};this.s.phase='card';this.log(`${p.name} drew “${c.title}”.`);return;}
    case 'gain':p.cash+=t.amount;this.log(`${p.name} received ֏${(t.amount*1000).toLocaleString()}.`,{player:p.id,type:"income",amount:t.amount,balance:p.cash});break;
    case 'pay':{
     if(t.to!==null&&this.s.players[t.to].out)break;
     if(!t.amount)break;
     if(p.cash<t.amount){this.s.debt={...t,from:p.id};this.s.phase='debt';this.log(`${p.name} owes ֏${(t.amount*1000).toLocaleString()} to ${t.to===null?'the bank':this.s.players[t.to].name} · ${t.reason||'Payment'}. Shortfall: ֏${((t.amount-p.cash)*1000).toLocaleString()}.`,{player:p.id,type:'debt',amount:-t.amount,balance:p.cash});return;}
     p.cash-=t.amount;if(t.to!==null)this.s.players[t.to].cash+=t.amount;this.log(`${p.name} paid ֏${(t.amount*1000).toLocaleString()} to ${t.to===null?'the bank':this.s.players[t.to].name}${t.reason?` (${t.reason})`:''}.`,{player:p.id,type:'payment',amount:-t.amount,to:t.to,balance:p.cash});break;
    }
    case 'each':{const others=this.s.players.filter(x=>!x.out&&x.id!==p.id);this.prepend(...others.map(x=>({type:'pay',amount:t.amount,from:t.direction==='collect'?x.id:p.id,to:t.direction==='collect'?p.id:x.id,reason:'Community card'})));break;}
    case 'repairs':{let cost=0;this.s.props.forEach(x=>{if(x.owner===p.id)cost+=x.houses===5?t.hotel:x.houses*t.house;});this.prepend({type:'pay',amount:cost,to:null,reason:'Repairs'});break;}
    case 'jailcard':p.cards.push(this.s.pendingCard);break;
    case 'jail':this.s.presentation?.moves.push({player:p.id,from:p.pos,to:10,kind:'jail',spaces:[10]});p.pos=10;p.jailed=true;p.jailTurns=0;this.s.extra=false;this.s.doubles=0;this.log(`${p.name} was sent to jail.`);break;
    case 'release':p.jailed=false;p.jailTurns=0;break;
   case 'ready':this.s.phase='roll';return;
   case 'redeemTransfer':this.s.props[t.i].mortgaged=false;break;
    case 'finish':this.s.phase=this.s.extra&&!p.jailed?'roll':'end';return;
    case 'bankAuction':this.beginAuction(t.i,true);return;
    case 'transferInterest':{const prop=this.s.props[t.i];if(prop.owner===p.id&&prop.mortgaged){this.s.transfer={i:t.i,owner:p.id};this.s.phase='transfer';return;}break;}
   }
  }
  if(this.s.players.filter(x=>!x.out).length===1){this.s.phase='won';return;}
  // An eliminated turn can finish with an empty queue.
  this.s.phase='end';
 }
 continueCard(){if(this.s.phase!=='card')throw Error('No card to resolve.');const c=this.s.pendingCard;this.prepend(...CARDS[c.deck][c.id].effects);this.resolve();}
 buy(){if(this.s.phase!=='buy')throw Error('No property to buy.');const i=this.current.pos,b=BOARD[i];if(this.current.cash<b.price)throw Error('Not enough cash. Mortgage or trade, or send this deed to auction.');this.current.cash-=b.price;this.s.props[i].owner=this.current.id;this.log(`${this.current.name} bought ${b.name} for ֏${(b.price*1000).toLocaleString()}.`,{player:this.current.id,type:"purchase",amount:-b.price,space:i,balance:this.current.cash});this.resolve();}
 beginAuction(i=this.current.pos,bankruptcy=false){if(!bankruptcy&&this.s.phase!=='buy')throw Error('No auction available.');this.s.auction={i,bid:0,leader:null,passed:[],bidder:this.s.players.find(x=>!x.out).id,bankruptcy};this.s.phase='auction';}
 buildCandidates(kind){return this.s.players.filter(p=>!p.out).map(p=>({id:p.id,deeds:BOARD.map((b,i)=>{const q=this.s.props[i];return b.type==='property'&&q.owner===p.id&&this.ownsGroup(i,p.id)&&!this.group(i).some(j=>this.s.props[j].mortgaged||this.s.props[j].houses<q.houses)&&(kind==='house'?q.houses<4:q.houses===4)?i:-1;}).filter(i=>i>=0)})).filter(x=>x.deeds.length);}
 requestBuilding(i,id){const b=BOARD[i],q=this.s.props[i],kind=q.houses===4?'hotel':'house';
  if(!this.canManage(id)||this.s.phase==='debt'||q.owner!==id||!this.buildCandidates(kind).some(c=>c.id===id&&c.deeds.includes(i)))throw Error('This property is not eligible to build.');
  const stock=this.stock()[kind==='house'?'houses':'hotels'];if(!stock)throw Error('The bank has none of these buildings available.');
  const candidates=this.buildCandidates(kind);if(stock===1&&candidates.length>1){this.s.buildRequest={kind,requested:i,requester:id,candidates,returnPhase:this.s.phase};this.s.phase='buildingClaims';}else this.manage(i,'build',id);
 }
 buildingClaims(claims){if(this.s.phase!=='buildingClaims')throw Error('No building claims to resolve.');const r=this.s.buildRequest;
  const entries=Object.entries(claims).map(([id,i])=>({id:+id,i:+i}));for(const e of entries)if(!r.candidates.some(c=>c.id===e.id&&c.deeds.includes(e.i)))throw Error('Choose an eligible placement for every claimant.');
  if(!entries.length){this.s.phase=r.returnPhase;this.s.buildRequest=null;return;}
  if(entries.length===1){const e=entries[0];this.s.phase=r.returnPhase;this.manage(e.i,'build',e.id);this.s.buildRequest=null;return;}
  this.s.auction={kind:r.kind,i:r.requested,bid:0,leader:null,passed:[],bidder:entries[0].id,placements:entries,returnPhase:r.returnPhase};this.s.buildRequest=null;this.s.phase='auction';
 }
 bid(amount){const a=this.s.auction;if(this.s.phase!=='auction')throw Error('No auction.');const p=this.s.players[a.bidder];if(!Number.isInteger(amount)||amount<=a.bid||amount>p.cash)throw Error('Bid a whole amount above the current bid, within your cash.');a.bid=amount;a.leader=p.id;this.log(`${p.name} bid ֏${(amount*1000).toLocaleString()} for ${BOARD[a.i].name}.`);this.advanceAuction();}
 pass(){if(this.s.phase!=='auction')throw Error('No auction.');const a=this.s.auction;a.passed.push(a.bidder);this.advanceAuction();}
 advanceAuction(){const a=this.s.auction;const bidders=this.s.players.filter(p=>!p.out&&!a.passed.includes(p.id)&&p.id!==a.leader&&(!a.placements||a.placements.some(e=>e.id===p.id)));if(!bidders.length){
   if(a.leader!==null){this.s.players[a.leader].cash-=a.bid;if(a.kind){const e=a.placements.find(e=>e.id===a.leader);this.s.props[e.i].houses++;this.log(`${this.s.players[a.leader].name} won the last ${a.kind} at auction and built on ${BOARD[e.i].name}.`);}else{this.s.props[a.i].owner=a.leader;this.log(`${this.s.players[a.leader].name} won ${BOARD[a.i].name} at auction for ֏${(a.bid*1000).toLocaleString()}.`,{player:a.leader,type:"auction",amount:-a.bid,balance:this.s.players[a.leader].cash,space:a.i});}}else this.log(`No bids; ${a.kind?`the last ${a.kind}`:BOARD[a.i].name} remains with the bank.`);
   this.s.auction=null;if(a.kind){this.s.phase=a.returnPhase;}else this.resolve();return;
  }let id=a.bidder;do{id=(id+1)%this.s.players.length;}while(!bidders.some(p=>p.id===id));a.bidder=id;
 }
 endTurn(){if(this.s.phase!=='end')throw Error('Resolve the turn first.');if(this.s.players.filter(p=>!p.out).length===1){this.s.phase='won';return;}const old=this.s.turn;do{this.s.turn=(this.s.turn+1)%this.s.players.length;}while(this.current.out);if(this.s.turn<=old)this.s.round++;this.s.doubles=0;this.s.extra=false;this.s.phase='roll';this.log(`${this.current.name}’s turn.`);}
 jailPay(){if(this.s.phase!=='roll'||!this.current.jailed)throw Error('Not available.');this.prepend({type:'pay',amount:50,to:null,reason:'Jail release'},{type:'release'},{type:'ready'});this.resolve();}
 jailCard(){if(this.s.phase!=='roll'||!this.current.jailed||!this.current.cards.length)throw Error('No jail card to use.');const c=this.current.cards.shift();this.s.decks[c.deck].push(c.id);this.current.jailed=false;this.current.jailTurns=0;this.log(`${this.current.name} used a Get Out of Jail Free card.`);}
 canManage(id){return !this.s.players[id]?.out&&!['auction','buildingClaims','card','transfer','resolving','won'].includes(this.s.phase)&&(this.s.phase!=='debt'||this.s.debt.from===id);}
 manage(i,action,id){if(!this.canManage(id))throw Error('Finish the current action before managing these deeds.');const b=BOARD[i],p=this.s.props[i],player=this.s.players[id];if(p.owner!==id)throw Error('This deed belongs to another player.');const g=b.type==='property'?this.group(i):[i];const stock=this.stock(),cashBefore=player.cash;
  if(action==='build'){
   if(b.type!=='property'||!this.ownsGroup(i,id)||g.some(j=>this.s.props[j].mortgaged))throw Error('Own the full color set with no mortgages to build.');
   if(p.houses>=5||g.some(j=>this.s.props[j].houses<p.houses))throw Error('Build evenly across the color set.');
   if(player.cash<GROUPS[b.group].house)throw Error('Not enough cash to build.');
   if(this.s.phase==='debt')throw Error('Settle your debt before building.');
   if(p.houses<4&&stock.houses<1||p.houses===4&&stock.hotels<1)throw Error('The bank has no available buildings of this type.');
   player.cash-=GROUPS[b.group].house;p.houses++;
  }else if(action==='sell'){
   if(!p.houses||g.some(j=>this.s.props[j].houses>p.houses))throw Error('Sell buildings evenly across the color set.');
   if(p.houses===5&&stock.houses<4)throw Error('The bank needs four houses to replace this hotel. Sell the whole set using “Liquidate set” instead.');
   p.houses--;player.cash+=GROUPS[b.group].house/2;
  }else if(action==='liquidate'){
   if(b.type!=='property')throw Error('No buildings on this deed.');
   let n=0;g.forEach(j=>{n+=this.s.props[j].houses;this.s.props[j].houses=0;});if(!n)throw Error('This set has no buildings.');player.cash+=n*GROUPS[b.group].house/2;
  }else if(action==='mortgage'){
   if(p.mortgaged||g.some(j=>this.s.props[j].houses))throw Error('Sell all buildings in this set before mortgaging.');p.mortgaged=true;player.cash+=b.price/2;
  }else if(action==='redeem'){
   const cost=Math.ceil(b.price*55/100);if(!p.mortgaged||player.cash<cost)throw Error('Not enough cash to redeem this mortgage.');if(this.s.phase==='debt')throw Error('Settle your debt before redeeming mortgages.');player.cash-=cost;p.mortgaged=false;
  }else throw Error('Unknown property action.');
  this.log(`${player.name}: ${({build:p.houses===5?"built a hotel":"built a house",sell:"sold a building",liquidate:"liquidated the color set",mortgage:"mortgaged",redeem:"redeemed"})[action]} · ${b.name}.`,{player:id,type:action,amount:player.cash-cashBefore,balance:player.cash,space:i});
 }
 settleDebt(){if(this.s.phase!=='debt')throw Error('No debt to pay.');const d=this.s.debt;if(this.s.players[d.from].cash<d.amount)throw Error('Raise enough cash first.');this.s.debt=null;this.prepend(d);this.resolve();}
 bankrupt(){
  if(this.s.phase!=='debt')throw Error('Bankruptcy is only available for an unpaid debt.');const d=this.s.debt,p=this.s.players[d.from];
  // Bankruptcy is allowed only after cash, all mortgages and all building returns cannot cover the debt.
  let capacity=p.cash;this.s.props.forEach((x,i)=>{if(x.owner===p.id){if(!x.mortgaged)capacity+=BOARD[i].price/2;if(x.houses)capacity+=x.houses*GROUPS[BOARD[i].group].house/2;}});
  if(capacity>=d.amount)throw Error('Your assets cover this debt. Sell buildings and mortgage deeds first, or negotiate a trade.');
  let returned=0;const deeds=[];this.s.props.forEach((x,i)=>{if(x.owner!==p.id)return;deeds.push(i);if(x.houses){returned+=x.houses*GROUPS[BOARD[i].group].house/2;x.houses=0;}x.owner=d.to;if(d.to===null)x.mortgaged=false;});
  p.cash+=returned;p.out=true;p.jailed=false;this.s.debt=null;
  if(d.to!==null){this.s.players[d.to].cash+=p.cash;this.s.players[d.to].cards.push(...p.cards);this.prepend(...deeds.map(i=>({type:'transferInterest',from:d.to,i})));}else{p.cards.forEach(c=>this.s.decks[c.deck].push(c.id));this.prepend(...deeds.map(i=>({type:'bankAuction',i})));}p.cash=0;p.cards=[];this.log(`${p.name} is bankrupt. Assets transferred to ${d.to===null?'the bank':this.s.players[d.to].name}.`);
  // Finish the current player's turn after elimination; preserve other players' card obligations.
  if(p.id===this.s.turn){this.s.extra=false;this.s.queue=this.s.queue.filter(t=>t.type==='bankAuction'||t.type==='transferInterest');}
  if(this.s.players.filter(x=>!x.out).length===1){this.s.phase='won';this.s.queue=[];}else this.resolve();
 }
 trade(a,b,give,take,cashA=0,cashB=0,cardsA=0,cardsB=0,redemptions=[]){
  if(a===b||!this.canManage(a)||this.s.players[b]?.out)throw Error('Trading is not available now.');
  if(![cashA,cashB,cardsA,cardsB].every(n=>Number.isInteger(n)&&n>=0))throw Error('Use nonnegative whole amounts.');
  const pa=this.s.players[a],pb=this.s.players[b];if(cashA>pa.cash||cashB>pb.cash||cardsA>pa.cards.length||cardsB>pb.cards.length)throw Error('The offered cash or cards are unavailable.');
  if(new Set([...give,...take]).size!==give.length+take.length)throw Error('Duplicate deeds.');
  for(const [ids,owner] of [[give,a],[take,b]])for(const i of ids){if(this.s.props[i].owner!==owner||BOARD[i].type==='property'&&this.group(i).some(j=>this.s.props[j].houses))throw Error('Sell every building in a color set before trading one of its deeds.');}
  if(new Set(redemptions).size!==redemptions.length||redemptions.some(i=>![...give,...take].includes(i)||!this.s.props[i].mortgaged))throw Error('Invalid mortgage redemption selection.');
  // Each recipient chooses to redeem immediately or pay interest and keep the mortgage.
  const fee=ids=>ids.reduce((n,i)=>n+(this.s.props[i].mortgaged?Math.ceil(BOARD[i].price*(redemptions.includes(i)?55:5)/100):0),0);
  if(pa.cash-cashA+cashB<fee(take)||pb.cash-cashB+cashA<fee(give))throw Error('A recipient needs cash for the immediate 10% mortgage transfer fee.');
  pa.cash+=cashB-cashA-fee(take);pb.cash+=cashA-cashB-fee(give);give.forEach(i=>this.s.props[i].owner=b);take.forEach(i=>this.s.props[i].owner=a);redemptions.forEach(i=>this.s.props[i].mortgaged=false);
  const ca=pa.cards.splice(0,cardsA),cb=pb.cards.splice(0,cardsB);pa.cards.push(...cb);pb.cards.push(...ca);this.log(`${pa.name} and ${pb.name} completed a trade. Mortgage interest or immediate redemptions, if any, were paid to the bank.`);
 }
 transferMortgage(redeem=false){if(this.s.phase!=='transfer')throw Error('No mortgage transfer.');const {i,owner}=this.s.transfer,b=BOARD[i];const amount=redeem?Math.ceil(b.price*55/100):Math.ceil(b.price*.05);this.s.transfer=null;
  this.prepend({type:'pay',from:owner,amount,to:null,reason:`Inherited mortgage · ${b.name}`},...(redeem?[{type:'redeemTransfer',i}]:[]));this.resolve();
 }
}

// A small, saved presentation trace lets every client animate the actual route,
// including card movement and Go to Jail, without reconstructing it from dice.
const presentationActions=['roll','continueCard','buy','beginAuction','requestBuilding','buildingClaims','bid','pass','endTurn','jailPay','jailCard','manage','settleDebt','bankrupt','trade','transferMortgage'];
for(const method of presentationActions){const implementation=Game.prototype[method];Game.prototype[method]=function(...args){if(this.presentationDepth)return implementation.apply(this,args);const previous=this.s.presentation,eventsBefore=this.s.eventSequence||0;this.s.presentation={id:(previous?.id??0)+1,action:method,player:method==='manage'?args[2]:method==='trade'?args[0]:['bid','pass'].includes(method)?this.s.auction?.bidder:['settleDebt','bankrupt'].includes(method)?this.s.debt?.from:this.s.turn,moves:[]};this.presentationDepth=1;try{const result=implementation.apply(this,args);if((this.s.eventSequence||0)===eventsBefore&&!['roll','continueCard'].includes(method))this.log(({beginAuction:'Auction opened',pass:'Passed the auction bid',buildingClaims:'Building choice recorded',jailPay:'Paid for release from jail',transferMortgage:'Mortgage transfer resolved',settleDebt:'Debt settled',requestBuilding:'Building requested'})[method]||'Action completed',{player:method==='pass'?null:this.s.turn,type:method});return result;}catch(error){if(previous===undefined)delete this.s.presentation;else this.s.presentation=previous;throw error;}finally{this.presentationDepth=0;}};}

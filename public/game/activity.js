import {BOARD} from './engine.js';
import {TRADE_STATUS_LABELS} from './trade-offers.js';
export function activityGroups(state,player='all'){
 const events=[...(state.events||[])],known=new Map();for(const e of events)known.set(e.text,(known.get(e.text)||0)+1);
 for(const [i,text] of (state.log||[]).entries()){if(known.get(text)){known.set(text,known.get(text)-1);continue;}events.push({id:'earlier-'+i,at:null,round:null,action:'earlier',group:'earlier-'+i,player:state.players.find(p=>text.startsWith(p.name+' ')||text.startsWith(p.name+':')||text.startsWith(p.name+'’'))?.id??null,text});}
 const groups=[],lookup=new Map();for(const e of events){if(e.tradeId)continue;const key=e.action==='earlier'?e.group:`${e.group}:${e.action}`;let g=lookup.get(key);if(!g){g={id:key,at:e.at,round:e.round,action:e.action,player:e.actionPlayer??e.player,events:[]};lookup.set(key,g);groups.push(g);}g.events.push(e);}
 for(const offer of state.tradeOffers||[])groups.push({id:'offer-'+offer.id,tradeId:offer.id,trade:offer,at:offer.updatedAt??offer.createdAt,round:offer.round,action:'tradeOffer',player:offer.args[0],events:[]});
 return groups.filter(g=>player==='all'||g.events.some(e=>e.player===Number(player))||g.player===Number(player)||g.trade?.args[1]===Number(player)).sort((a,b)=>(b.at??0)-(a.at??0));
}
export function activityTitle(group){const e=group.events.find(e=>e.type==='roll')||group.events.find(e=>e.type==='purchase')||group.events.at(-1);if(e?.type==='roll')return `Rolled ${e.dice.join(' + ')}${e.dice[0]===e.dice[1]?' · Doubles':''}`;return ({buy:'Property purchased',endTurn:'Turn passed',manage:'Property updated',requestBuilding:'Building action',buildingClaims:'Building choice',beginAuction:'Auction opened',bid:'Auction bid',pass:'Auction passed',continueCard:'Card resolved',jailPay:'Jail release',jailCard:'Jail card used',settleDebt:'Payment settled',bankrupt:'Bankruptcy',trade:'Trade completed',transferMortgage:'Mortgage transferred',undo:'Action undone',setup:'Opening rolls'})[group.action]||'Table activity';}
export function activityTime(at){return at===null||!Number.isFinite(at)?'Earlier':new Date(at).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit',second:'2-digit'});}
export function activityMatchesType(group,type){
 if(type==='all')return true;if(type==='trades')return !!group.trade||group.action==='trade';
 const text=group.events.map(e=>e.text).join(' ').toLowerCase(),action=group.action;
 if(type==='rolls')return action==='roll'||group.events.some(e=>['roll','arrival'].includes(e.type))||/rolled|arrived at|passed start/.test(text);
 if(type==='purchases')return ['buy','beginAuction','bid','pass'].includes(action)||/bought |auction/.test(text);
 if(type==='payments')return group.events.some(e=>['payment','debt','income'].includes(e.type))||/paid ֏|received ֏|shortfall|passed start/.test(text);
 if(type==='buildings')return ['manage','requestBuilding','buildingClaims','transferMortgage'].includes(action)||/mortgag|built a |sold a building|liquidat/.test(text);
 if(type==='cards')return ['continueCard','jailPay','jailCard'].includes(action)||/drew |jail/.test(text);
 if(type==='turns')return action==='endTurn'||action==='setup'||/’s turn|opening roll/.test(text);
 return type==='undo'&&action==='undo';
}
export function filterActivityGroups(state,{player='all',type='all',query=''}={}){
 const tokens=query.normalize('NFKC').toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
 return activityGroups(state,player).filter(g=>{if(!activityMatchesType(g,type))return false;if(!tokens.length)return true;const offer=g.trade,names=offer?[state.players[offer.args[0]]?.name,state.players[offer.args[1]]?.name]:[state.players[g.player]?.name],values=offer?[...offer.args.slice(4,6).flatMap(n=>[n*1000,(n*1000).toLocaleString('en-US'),'֏'+(n*1000).toLocaleString('en-US')]),...offer.args[2].concat(offer.args[3]).map(i=>BOARD[i]?.name)]:g.events.flatMap(e=>e.amount===undefined?[]:[Math.abs(e.amount)*1000,(Math.abs(e.amount)*1000).toLocaleString('en-US')]);const text=[...names,activityTitle(g),...g.events.map(e=>e.text),...values,offer?'trade offer '+(TRADE_STATUS_LABELS[offer.status]||'')+' '+(offer.reason||''):''].join(' ').normalize('NFKC').toLocaleLowerCase();return tokens.every(t=>text.includes(t));});
}

import {Game,BOARD} from './engine.js';
export const TRADE_STATUS_LABELS={pending:'Open offer',accepted:'Accepted',rejected:'Rejected',cancelled:'Cancelled',unavailable:'No longer available'};
function tradeFailure(message,status=400){throw Object.assign(new Error(message),{status});}
function checkTradeArgs(game,args){
 if(!Array.isArray(args)||args.length!==9)tradeFailure('Invalid trade.');const [a,b,give,take,cashA,cashB,cardsA,cardsB,redeem]=args;
 if(!Number.isInteger(a)||!Number.isInteger(b)||a===b||!game.s.players[a]||!game.s.players[b])tradeFailure('Choose two different players.');
 if([give,take,redeem].some(ids=>!Array.isArray(ids)||ids.length>28||ids.some(i=>!Number.isInteger(i)||i<0||i>=40||!BOARD[i].price)))tradeFailure('Choose valid title deeds.');
 if(![cashA,cashB,cardsA,cardsB].every(n=>Number.isSafeInteger(n)&&n>=0))tradeFailure('Use nonnegative whole amounts.');
 if(!give.length&&!take.length&&!cashA&&!cashB&&!cardsA&&!cardsB)tradeFailure('Include at least one deed, cash amount or jail card.');
}
export function tradeTerms(game,args){const [a,b,give,take]=args,redeem=args[8];return [...give.map(i=>({i,from:a,to:b})),...take.map(i=>({i,from:b,to:a}))].map(d=>({...d,mortgaged:game.s.props[d.i].mortgaged,redeem:redeem.includes(d.i),fee:game.s.props[d.i].mortgaged?Math.ceil(BOARD[d.i].price*(redeem.includes(d.i)?55:5)/100):0}));}
export function tradeOfferReason(game,offer){
 const [a,b]=offer.args;if(game.s.phase==='won')return 'The game has ended.';
 if(game.s.players[a]?.out||game.s.players[b]?.out)return 'A player in this offer has left the game through bankruptcy.';
 for(const d of offer.terms||[]){const p=game.s.props[d.i];if(p.owner!==d.from)return `${BOARD[d.i].name} now belongs to a different owner.`;if(p.mortgaged!==d.mortgaged)return `The mortgage terms of ${BOARD[d.i].name} have changed.`;}
 const state=structuredClone(game.s);state.phase='end';const trial=new Game([],game.rng,state,game.clock);try{trial.trade(...offer.args);}catch(e){return e.message;}return null;
}
function tradeRecord(game,offer,status,by,now,reason=null){offer.status=status;offer.updatedAt=now;offer.resolvedAt=status==='pending'?null:now;offer.resolvedBy=by;offer.reason=reason;offer.updates??=[];offer.updates.push({status,by,at:now,reason});const [a,b]=offer.args,labels={pending:`${game.s.players[a].name} offered a trade to ${game.s.players[b].name}.`,accepted:`${game.s.players[b].name} accepted ${game.s.players[a].name}’s trade offer.`,rejected:`${game.s.players[b].name} rejected ${game.s.players[a].name}’s trade offer.`,cancelled:`${game.s.players[a].name} cancelled the trade offer to ${game.s.players[b].name}.`,unavailable:`The trade offer from ${game.s.players[a].name} to ${game.s.players[b].name} is no longer available: ${reason}`};game.log(labels[status],{player:by??a,actionPlayer:a,type:'tradeOffer',action:'tradeOffer',group:'offer-'+offer.id,tradeId:offer.id,status});}
export function createTradeOffer(game,args,{id,now=game.clock()}={}){
 checkTradeArgs(game,args);if(typeof id!=='string'||!/^[a-zA-Z0-9-]{12,80}$/.test(id))tradeFailure('Missing trade identifier.');
 game.s.tradeOffers??=[];if(game.s.tradeOffers.some(t=>t.id===id))tradeFailure('This offer already exists.');
 if(game.s.tradeOffers.filter(t=>t.status==='pending'&&t.args[0]===args[0]).length>=8)tradeFailure('You have eight open offers. Cancel an old offer before sending another.');
 const trial=new Game([],game.rng,structuredClone(game.s),game.clock);try{trial.trade(...args);}catch(e){tradeFailure(e.message);}
 const offer={id,args:structuredClone(args),terms:tradeTerms(game,args),createdAt:now,updatedAt:now,round:game.s.round,status:'pending',updates:[]};game.s.tradeOffers.unshift(offer);tradeRecord(game,offer,'pending',args[0],now);return offer;
}
export function reconcileTradeOffers(game,now=game.clock()){
 for(const offer of game.s.tradeOffers||[]){if(offer.status!=='pending')continue;const reason=tradeOfferReason(game,offer);if(reason)tradeRecord(game,offer,'unavailable',null,now,reason);}
}
export function respondToTradeOffer(game,id,seat,decision,now=game.clock()){
 const offer=game.s.tradeOffers?.find(t=>t.id===id);if(!offer)tradeFailure('This trade offer was not found.',404);
 const [a,b]=offer.args;if(!['accept','reject','cancel'].includes(decision))tradeFailure('Choose accept, reject or cancel.');
 if(decision==='cancel'?seat!==a:seat!==b)tradeFailure(decision==='cancel'?'Only the sender may cancel this offer.':'Only the recipient may accept or reject this offer.',403);
 if(offer.status!=='pending')tradeFailure(`This offer is ${TRADE_STATUS_LABELS[offer.status].toLowerCase()} and cannot be used again.`,409);
 if(decision==='accept'){
  const reason=tradeOfferReason(game,offer);if(reason){tradeRecord(game,offer,'unavailable',null,now,reason);return offer;}
  if(!game.canManage(a))tradeFailure('Resolve the current card, auction or payment first. This offer stays open for later.');
  const previousSequence=game.s.eventSequence||0;try{game.trade(...offer.args);}catch(e){tradeFailure(e.message);}
  for(const e of game.s.events||[])if(e.id>previousSequence)e.tradeId=offer.id;
 }
 tradeRecord(game,offer,decision==='accept'?'accepted':decision==='reject'?'rejected':'cancelled',seat,now);return offer;
}
export function migrateLegacyTrade(room){
 if(!room.trade||!room.state)return;room.state.tradeOffers??=[];
 if(!room.state.tradeOffers.some(t=>t.id===room.trade.id)){const g=new Game([],Math.random,room.state);room.state.tradeOffers.unshift({id:room.trade.id,args:structuredClone(room.trade.args),terms:tradeTerms(g,room.trade.args),createdAt:null,updatedAt:null,round:room.state.round,status:'pending',updates:[{status:'pending',by:room.trade.args[0],at:null}],legacy:true});}
 room.trade=null;
}

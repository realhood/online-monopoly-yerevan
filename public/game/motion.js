// One coordinate system for the print, pieces, hit testing and active-piece marker.
export function tilePosition(i){
 if(i===0)return {x:7.3,z:7.3};if(i<10)return {x:7-i*1.4,z:7.3};
 if(i===10)return {x:-7.3,z:7.3};if(i<20)return {x:-7.3,z:7-(i-10)*1.4};
 if(i===20)return {x:-7.3,z:-7.3};if(i<30)return {x:-7+(i-20)*1.4,z:-7.3};
 if(i===30)return {x:7.3,z:-7.3};return {x:7.3,z:-7+(i-30)*1.4};
}
export function pawnStyle(count=6){const size=count===2?1.04:count===4?1:.8;return {x:size,y:size*1.32,z:size,baseRadius:.26*size,markerRadius:.288*size};}
export function pawnAnchor(space,seat,count=6){const p=tilePosition(space),angle=Math.floor(space/10)*Math.PI/2,columns=count===2||count===4?2:3,dx=(seat%columns-(columns-1)/2)*(columns===2?.60:.42),dz=count<=3?.14:seat<columns?.43:-.14;return {x:p.x+dx*Math.cos(angle)-dz*Math.sin(angle),y:.18,z:p.z+dx*Math.sin(angle)+dz*Math.cos(angle)};}
const mix=(a,b,t)=>({x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t,z:a.z+(b.z-a.z)*t});
export class PawnMotion {
 constructor(){this.positions=[];this.tracks=[];this.targets=[];this.action=null;this.initialized=false;this.reduced=false;}
 get moving(){return this.tracks.some(t=>t.length);}
 reset(state){this.tracks=state.players.map(()=>[]);this.targets=state.players.map(p=>pawnAnchor(p.pos,p.id,state.players.length));this.positions=this.targets.map(p=>({...p}));this.action=state.presentation?.id??null;this.initialized=true;}
 sync(state,now=0){
  if(!this.initialized||this.positions.length!==state.players.length){this.reset(state);return;}
  const count=state.players.length,action=state.presentation,fresh=action&&action.id!==this.action;this.targets=state.players.map(p=>pawnAnchor(p.pos,p.id,count));
  if(fresh){this.action=action.id;for(const m of action.moves||[]){if(!this.positions[m.player]||state.players[m.player].out)continue;const q=this.tracks[m.player],anchor=pawnAnchor(m.from,m.player,count),tail=q.at(-1)?.points.at(-1)??this.positions[m.player];
    if(Math.hypot(tail.x-anchor.x,tail.z-anchor.z)>.02){q.length=0;this.positions[m.player]={...anchor};}
    const points=[anchor,...m.spaces.map(i=>pawnAnchor(i,m.player,count))];if(points.length<2)continue;q.push({points,kind:m.kind,start:null,duration:this.reduced?0:m.kind==='jail'?.65:Math.min(4.2,Math.max(.24,m.spaces.length*.16))});
  }}
  state.players.forEach((p,i)=>{if(p.out){this.tracks[i]=[];this.positions[i]={...this.targets[i]};}else if(!this.tracks[i].length)this.positions[i]={...this.targets[i]};});
  this.update(now);
 }
 update(now){
  this.tracks.forEach((queue,i)=>{let available=now;while(queue.length){const t=queue[0];if(t.start===null)t.start=available;const progress=t.duration===0?1:Math.min(1,Math.max(0,(now-t.start)/1000/t.duration));
    if(progress>=1){this.positions[i]={...t.points.at(-1)};available=t.start+t.duration*1000;queue.shift();if(queue.length&&queue[0].start===null)queue[0].start=available;continue;}
    const eased=progress*progress*(3-2*progress),along=eased*(t.points.length-1),at=Math.min(t.points.length-2,Math.floor(along)),u=along-at;this.positions[i]=mix(t.points[at],t.points[at+1],u);this.positions[i].y+=(t.kind==='jail'?.6:.10)*Math.sin(Math.PI*(t.kind==='jail'?progress:u));break;
   }if(!queue.length&&this.targets[i])this.positions[i]={...this.targets[i]};});
 }
}
export class PresentationGate {
 constructor(){this.epoch=0;}
 cancel(){this.epoch++;}
 async run(wait,finish){const epoch=++this.epoch;await wait();if(epoch!==this.epoch)return false;await finish();return true;}
}

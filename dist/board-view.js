import * as THREE from './three.module.js';
import { BOARD, GROUPS, TOKENS } from './engine.js';
export function tilePosition(i){
 if(i===0)return {x:7.3,z:7.3};if(i<10)return {x:7-i*1.4,z:7.3};
 if(i===10)return {x:-7.3,z:7.3};if(i<20)return {x:-7.3,z:7-(i-10)*1.4};
 if(i===20)return {x:-7.3,z:-7.3};if(i<30)return {x:-7+(i-20)*1.4,z:-7.3};
 if(i===30)return {x:7.3,z:-7.3};return {x:7.3,z:-7+(i-30)*1.4};
}
const mat=(color,roughness=.8)=>new THREE.MeshStandardMaterial({color,roughness});
function box(w,h,d,m,x=0,y=0,z=0){const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;return o;}
function wrap(ctx,text,x,y,max,line){let rows=[],r='';for(const word of text.split(' ')){const test=r?`${r} ${word}`:word;if(ctx.measureText(test).width>max&&r){rows.push(r);r=word;}else r=test;}if(r)rows.push(r);rows.forEach((s,j)=>ctx.fillText(s,x,y+(j-(rows.length-1)/2)*line));}
function textureBoard(){
 const cv=document.createElement('canvas');cv.width=cv.height=3072;const c=cv.getContext('2d');const scale=3072/16.6;c.scale(scale,scale);c.translate(8.3,8.3);c.fillStyle='#f6f0dd';c.fillRect(-8.3,-8.3,16.6,16.6);
 c.strokeStyle='#6b7963';c.lineWidth=.035;c.strokeRect(-8.25,-8.25,16.5,16.5);c.fillStyle='#e2e4d1';c.fillRect(-6.3,-6.3,12.6,12.6);c.strokeStyle='#8c987d';c.lineWidth=.045;c.strokeRect(-6.3,-6.3,12.6,12.6);
 c.strokeStyle='#b6bd9f';c.lineWidth=.013;c.strokeRect(-6.05,-6.05,12.1,12.1);
 for(let i=0;i<40;i++){
  const b=BOARD[i],pos=tilePosition(i),corner=i%10===0;c.save();c.translate(pos.x,pos.z);
  if(i>0&&i<10){}else if(i>10&&i<20)c.rotate(Math.PI/2);else if(i>20&&i<30)c.rotate(Math.PI);else if(i>30)c.rotate(-Math.PI/2);
  const w=corner?2:1.4;c.fillStyle=corner?'#e9e5ce':'#f9f3df';c.fillRect(-w/2,-1,w,2);c.strokeStyle='#8a9275';c.lineWidth=.018;c.strokeRect(-w/2,-1,w,2);
  if(b.type==='property'){c.fillStyle=GROUPS[b.group].color;c.fillRect(-w/2,-1,w,.34);c.strokeStyle='#6b796350';c.strokeRect(-w/2,-1,w,.34);}
  c.textAlign='center';c.textBaseline='middle';c.fillStyle='#274337';
  if(corner){
   if(i===0){c.font='bold .42px Georgia';c.fillText('START',0,-.35);c.font='.65px Arial';c.fillText('←',0,.23);c.font='.12px Arial';c.fillText('COLLECT ֏200,000',0,.75);}
   if(i===10){c.fillStyle='#c18a59';c.fillRect(-.68,-.65,1.36,1.1);c.fillStyle='#294132';c.font='bold .23px Arial';c.fillText('JAIL',0,-.35);c.font='.5px Arial';c.fillText('▥',0,.03);c.font='bold .13px Arial';c.fillText('JUST VISITING',0,.72);}
   if(i===20){c.font='.66px Arial';c.fillText('P',0,-.12);c.font='bold .15px Arial';c.fillText('FREE PARKING',0,.61);}
   if(i===30){c.font='.68px Arial';c.fillText('↪',0,-.16);c.font='bold .18px Arial';c.fillText('GO TO JAIL',0,.61);}
  }else{
   c.font=`600 ${b.type==='property'?'.18':'.155'}px Arial`;wrap(c,b.name.replace(' · ՇԱՆՍ',''),0,b.type==='property'?-.25:-.42,1.21,.21);
   if(b.price){if(b.type==='station'||b.type==='utility'){c.font='.47px Arial';c.fillStyle=b.type==='station'?'#4c6a5c':'#96814a';c.fillText(b.type==='station'?'▣':i===12?'ϟ':'◉',0,.15);}c.font='.16px Arial';c.fillStyle='#6e7962';c.fillText(`֏${b.price}k`,0,.76);}
   else if(b.type==='chance'){c.font='bold .75px Georgia';c.fillStyle='#b67a42';c.fillText('?',0,.24);}else if(b.type==='chest'){c.font='.48px Arial';c.fillStyle='#a68445';c.fillText('✦',0,.25);}else {c.font='.42px Arial';c.fillStyle='#91794f';c.fillText(b.type==='tax'?'▤':'◇',0,.15);c.font='.13px Arial';c.fillStyle='#6e7962';c.fillText(b.type==='tax'?'֏200k':'֏100k',0,.76);}
  }c.restore();
 }
 // A soft illustration under the 3D miniature also serves the canvas fallback.
 c.fillStyle='#c3c9ad';c.beginPath();c.moveTo(-4.7,-2.6);c.lineTo(-1,-5.1);c.lineTo(.45,-3.8);c.lineTo(1.5,-4.5);c.lineTo(4.6,-2.6);c.closePath();c.fill();
 c.fillStyle='#f1edd7';c.beginPath();c.moveTo(-1,-5.1);c.lineTo(-2,-4.43);c.lineTo(-1.15,-4.63);c.lineTo(-.65,-4.4);c.lineTo(-.3,-4.47);c.closePath();c.fill();
 c.strokeStyle='#b5bd9e';c.lineWidth=.018;c.beginPath();c.moveTo(-4.7,-2.45);c.lineTo(4.7,-2.45);c.stroke();
 for(let j=0;j<5;j++){c.fillStyle=j%2?'#c69c80':'#d1af91';c.fillRect(-4.4+j*.13,-2.2-j*.13,1.8-j*.26,.15);}
 c.fillStyle='#cca78a';c.fillRect(-1.6,-2.6,3.2,.7);c.beginPath();c.ellipse(0,-2.61,1.6,.22,0,Math.PI,0);c.fill();c.fillStyle='#ac8f75';for(let j=0;j<12;j++)c.fillRect(-1.43+j*.25,-2.47,.055,.46);c.fillStyle='#d7b49a';c.fillRect(-1.7,-1.98,3.4,.12);
 for(let j=0;j<4;j++){const h=.55+j%2*.23;c.fillStyle=j%2?'#c69e83':'#d1ac8c';c.fillRect(2.2+j*.57,-1.95-h,.52,h);c.fillStyle='#a48d73';for(let k=0;k<3;k++)c.fillRect(2.27+j*.57+k*.13,-2.2,.055,.13);}
 c.textAlign='center';c.textBaseline='middle';c.fillStyle='#7c8b6e';c.font='.18px Arial';c.fillText('THE PINK CITY EDITION',0,-.55);
 c.fillStyle='#244a3c';c.font='bold 1.02px Georgia';c.fillText('YEREVAN',0,.33);
 c.fillStyle='#b8785e';c.fillRect(-2.55,1.07,5.1,.66);c.fillStyle='#faf0da';c.font='bold .45px Georgia';c.fillText('M O N O P O L Y',0,1.43);
 c.fillStyle='#7c8b6e';c.font='.24px Arial';c.fillText('ԵՐԵՎԱՆ · ԱՐԻ ԽԱՂԱՆՔ',0,2.12);c.font='.13px Arial';c.fillText('BUY A LITTLE HISTORY. BUILD YOUR OWN STORY.',0,2.6);
 for(const x of [-5.68,5.68])for(let z=-5.5;z<6;z+=.45){c.fillStyle='#9fa98b';c.save();c.translate(x,z);c.rotate(Math.PI/4);c.fillRect(-.035,-.035,.07,.07);c.restore();}
 c.strokeStyle='#b5bd9b';c.lineWidth=.012;c.beginPath();c.moveTo(-4.5,5.25);c.lineTo(4.5,5.25);c.stroke();c.fillStyle='#839271';c.font='.15px Arial';c.fillText('KOND  ·  KENTRON  ·  CASCADE  ·  REPUBLIC SQUARE',0,5.6);
 const tex=new THREE.CanvasTexture(cv);tex.colorSpace=THREE.SRGBColorSpace;tex.anisotropy=8;return tex;
}
function diceTexture(n){const cv=document.createElement('canvas');cv.width=cv.height=128;const c=cv.getContext('2d');c.fillStyle='#fff8e8';c.fillRect(0,0,128,128);c.fillStyle='#29493c';let pts=[];if(n%2)pts.push([64,64]);if(n>=2)pts.push([32,32],[96,96]);if(n>=4)pts.push([96,32],[32,96]);if(n===6)pts.push([32,64],[96,64]);pts.forEach(([x,y])=>{c.beginPath();c.arc(x,y,9,0,Math.PI*2);c.fill();});const t=new THREE.CanvasTexture(cv);t.colorSpace=THREE.SRGBColorSpace;return t;}
export class BoardView{
 constructor(el,onTile){
  this.el=el;this.onTile=onTile;this.scene=new THREE.Scene();this.camera=new THREE.OrthographicCamera(-12,12,12,-12,.1,100);this.camera.position.set(0,25,13);this.camera.lookAt(0,0,0);this.zoom=1;this.mode='3d';this.tokenObjects=[];this.dest=[];this.ownerObjects=[];this.buildings=new THREE.Group();this.scene.add(this.buildings);this.clock=new THREE.Clock();this.rollUntil=0;this.focus=null;
  this.renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=THREE.PCFSoftShadowMap;this.renderer.outputColorSpace=THREE.SRGBColorSpace;this.renderer.setClearColor(0,0);el.appendChild(this.renderer.domElement);el.querySelector('#loading')?.remove();
  this.scene.add(new THREE.HemisphereLight('#fff8e7','#7c8a6a',3));const sun=new THREE.DirectionalLight('#fff1d6',4);sun.position.set(-8,18,9);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-12;sun.shadow.camera.right=12;sun.shadow.camera.top=12;sun.shadow.camera.bottom=-12;sun.shadow.normalBias=.04;this.scene.add(sun);
  const ground=new THREE.Mesh(new THREE.PlaneGeometry(200,200),new THREE.ShadowMaterial({opacity:.13}));ground.rotation.x=-Math.PI/2;ground.position.y=-.5;ground.receiveShadow=true;this.scene.add(ground);
  this.scene.add(box(16.95,.43,16.95,mat('#244d3b'),0,-.22,0));this.scene.add(box(16.72,.1,16.72,mat('#c8a66b'),0,.025,0));
  this.board=new THREE.Mesh(new THREE.PlaneGeometry(16.6,16.6),new THREE.MeshStandardMaterial({map:textureBoard(),roughness:.93}));this.board.rotation.x=-Math.PI/2;this.board.position.y=.085;this.board.receiveShadow=true;this.scene.add(this.board);
  const brass=mat('#bca066'),pink=mat('#c99b87'),lightPink=mat('#dbb09b'),darkPink=mat('#b98675'),green=mat('#7c966f');
  // A miniature, stylized city: Ararat, Cascade steps, tuff façades and the Opera colonnade.
  const mountains=new THREE.Group();const mountain=(x,z,r,h)=>{const m=new THREE.Mesh(new THREE.ConeGeometry(r,h,5),mat('#c2c8b1'));m.position.set(x,h/2+.09,z);m.rotation.y=.4;mountains.add(m);const cap=new THREE.Mesh(new THREE.ConeGeometry(r*.3,h*.3,5),mat('#f5f0d9'));cap.position.set(x,h*.85+.09,z);cap.rotation.y=.4;mountains.add(cap);};mountain(-.5,-4.25,1.25,1.6);mountain(1.1,-4.25,.8,1.07);this.scene.add(mountains);
  for(let j=0;j<6;j++){const step=box(2.05-j*.12,.13,1.7-j*.2,lightPink,-3.65,.15+j*.13,-3.45-j*.1);this.scene.add(step);}for(const x of [-4.5,-2.8]){this.scene.add(box(.15,.75,.15,brass,x,.49,-3.9));}
  const opera=new THREE.Group();opera.position.set(0,.1,-2.65);opera.add(box(2.75,.55,.75,pink,0,.28,0));opera.add(box(3.05,.11,.95,lightPink,0,.64,0));opera.add(box(3.2,.12,1.1,darkPink,0,.06,0));for(let j=0;j<11;j++){const col=new THREE.Mesh(new THREE.CylinderGeometry(.055,.06,.48,8),lightPink);col.position.set(-1.27+j*.254,.33,.45);col.castShadow=true;opera.add(col);}this.scene.add(opera);
  for(let i=0;i<4;i++){const x=2.6+i*.62,h=.65+(i%3)*.18;const b=box(.58,h,.85,i%2?pink:lightPink,x,h/2+.1,-3.3);this.scene.add(b);this.scene.add(box(.66,.1,.93,darkPink,x,h+.14,-3.3));for(let j=0;j<3;j++){this.scene.add(box(.08,.17,.012,mat('#766f5d'),x-.18+j*.18,.38,-2.868));}}
  for(const [x,z] of [[-5,-4.8],[-4.8,-2.1],[4.9,-4.6],[4.7,-1.8],[-5.1,3.6],[5.1,3.6]]){const tr=new THREE.Mesh(new THREE.CylinderGeometry(.035,.05,.24,6),darkPink);tr.position.set(x,.2,z);this.scene.add(tr);const leaf=new THREE.Mesh(new THREE.IcosahedronGeometry(.22,1),green);leaf.position.set(x,.47,z);leaf.castShadow=true;this.scene.add(leaf);}
  this.decks=[];for(const [x,label,col] of [[-3.25,'CHANCE','#b67d4c'],[3.25,'COMMUNITY','#829175']]){
   const cv=document.createElement('canvas');cv.width=512;cv.height=320;const c=cv.getContext('2d');c.fillStyle=col;c.fillRect(0,0,512,320);c.strokeStyle='#e7dbc0';c.lineWidth=2;c.strokeRect(17,17,478,286);c.textAlign='center';c.fillStyle='#f8efd6';c.font='62px Georgia';c.fillText(label==='CHANCE'?'?':'✦',256,160);c.font='21px Arial';c.fillText(label,256,248);const t=new THREE.CanvasTexture(cv);t.colorSpace=THREE.SRGBColorSpace;
   const d=box(2,.13,1.27,mat(col),x,.18,3.5);this.scene.add(d);const top=new THREE.Mesh(new THREE.PlaneGeometry(2,1.27),new THREE.MeshStandardMaterial({map:t}));top.rotation.x=-Math.PI/2;top.position.set(x,.25,3.5);this.scene.add(top);this.decks.push(d);
  }
  this.dice=[];for(let i=0;i<2;i++){const maps=[3,4,1,6,2,5].map(n=>new THREE.MeshStandardMaterial({map:diceTexture(n),roughness:.55}));const d=new THREE.Mesh(new THREE.BoxGeometry(.53,.53,.53),maps);d.position.set(-.45+i*.9,.38,3.8);d.castShadow=true;this.scene.add(d);this.dice.push(d);}
  const ringGeom=new THREE.RingGeometry(.4,.44,40);this.ring=new THREE.Mesh(ringGeom,new THREE.MeshBasicMaterial({color:'#c5a25b',transparent:true,opacity:.9,side:THREE.DoubleSide}));this.ring.rotation.x=-Math.PI/2;this.ring.position.y=.105;this.scene.add(this.ring);
  this.ray=new THREE.Raycaster();this.pointer=new THREE.Vector2();let down=null;el.addEventListener('pointerdown',e=>{down={x:e.clientX,y:e.clientY};});el.addEventListener('pointerup',e=>{if(!down||Math.hypot(e.clientX-down.x,e.clientY-down.y)>8)return;const rect=el.getBoundingClientRect();this.pointer.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);this.ray.setFromCamera(this.pointer,this.camera);const hit=this.ray.intersectObject(this.board)[0];if(!hit)return;const p=hit.point;let nearest=-1,d=Infinity;for(let i=0;i<40;i++){const t=tilePosition(i);const dd=(t.x-p.x)**2+(t.z-p.z)**2;if(dd<d){d=dd;nearest=i;}}if(d<2)this.onTile(nearest);});
  this.resizeObserver=new ResizeObserver(()=>this.resize());this.resizeObserver.observe(el);this.resize();this.animate();
 }
 resize(){const w=this.el.clientWidth,h=this.el.clientHeight;if(!w||!h)return;this.renderer.setSize(w,h);const aspect=w/h,vertical=Math.max(10.1,10.1/aspect);this.camera.left=-vertical*aspect;this.camera.right=vertical*aspect;this.camera.top=vertical;this.camera.bottom=-vertical;this.camera.zoom=this.zoom;this.camera.updateProjectionMatrix();}
 setView(mode){this.mode=mode;this.camera.position.set(0,mode==='top'?28:25,mode==='top'?.001:13);this.camera.lookAt(0,0,0);this.resize();}
 setZoom(delta){this.zoom=THREE.MathUtils.clamp(this.zoom+delta,.7,1.65);this.resize();}
 token(i){const g=new THREE.Group(),m=mat(TOKENS[i].color,.4),gold=mat('#e7c98d');const base=new THREE.Mesh(new THREE.CylinderGeometry(.24,.29,.13,24),gold);base.position.y=.065;g.add(base);
  if(i===0||i===1){const fruit=new THREE.Mesh(new THREE.SphereGeometry(.22,20,16),m);fruit.position.y=.32;fruit.scale.y=i===0?1.08:.9;g.add(fruit);if(i===0){for(let j=0;j<5;j++){const crown=new THREE.Mesh(new THREE.ConeGeometry(.037,.12,4),m);crown.position.set(Math.cos(j*Math.PI*2/5)*.07,.57,Math.sin(j*Math.PI*2/5)*.07);g.add(crown);}}else{const leaf=new THREE.Mesh(new THREE.SphereGeometry(.08,8,8),mat('#477a4d'));leaf.scale.set(1.5,.3,.7);leaf.position.set(.08,.52,0);g.add(leaf);}}
  if(i===2){const mountain=new THREE.Mesh(new THREE.ConeGeometry(.25,.43,4),m);mountain.position.y=.33;g.add(mountain);const snow=new THREE.Mesh(new THREE.ConeGeometry(.09,.15,4),mat('#f8f1df'));snow.position.y=.48;g.add(snow);}
  if(i===3){const pipe=new THREE.Mesh(new THREE.CylinderGeometry(.07,.09,.64,14),m);pipe.position.y=.43;pipe.rotation.z=-.18;g.add(pipe);for(let j=0;j<4;j++){const hole=new THREE.Mesh(new THREE.SphereGeometry(.026,8,8),gold);hole.position.set(.025-j*.02,.22+j*.12,.075);g.add(hole);}}
  g.traverse(o=>{if(o.isMesh)o.castShadow=true;});return g;
 }
 sync(game){const s=game.s;while(this.tokenObjects.length<s.players.length){const i=this.tokenObjects.length,t=this.token(i);this.tokenObjects.push(t);this.scene.add(t);t.position.set(7.3,.12,7.3);}
  s.players.forEach((p,i)=>{const t=this.tokenObjects[i];t.visible=!p.out;const at=tilePosition(p.pos);this.dest[i]=new THREE.Vector3(at.x+(i%2? .27:-.27),.12,at.z+(i<2? .28:-.28));});
  const clear=group=>{while(group.children.length){const o=group.children.pop();o.parent=null;o.geometry?.dispose();if(o.material&&!Array.isArray(o.material))o.material.dispose();}};clear(this.buildings);
  s.props.forEach((p,i)=>{if(p.owner===null)return;const at=tilePosition(i),side=Math.floor(i/10);const inward=new THREE.Vector3(side===1?.9:side===3?-.9:0,0,side===0?-.88:side===2?.88:0);const badge=box(side%2?.09:.65,.035,side%2?.65:.09,mat(TOKENS[p.owner].color),at.x+(side===1?-.87:side===3?.87:0),.12,at.z+(side===0?.87:side===2?-.87:0));if(p.mortgaged){badge.material.color.set('#8c8a82');badge.material.transparent=true;badge.material.opacity=.5;}this.buildings.add(badge);
   for(let n=0;n<(p.houses===5?1:p.houses);n++){const h=p.houses===5,spread=(n-(p.houses-1)/2)*.28;const x=at.x+inward.x+(side%2?0:spread),z=at.z+inward.z+(side%2?spread:0);const b=box(h?.55:.22,h?.4:.21,h?.32:.22,mat(h?'#b35d50':'#517b56'),x,h?.32:.22,z);this.buildings.add(b);const roof=new THREE.Mesh(new THREE.ConeGeometry(h?.38:.18,h?.2:.12,4),mat(h?'#814334':'#365b43'));roof.rotation.y=Math.PI/4;roof.position.set(x,h?.61:.38,z);this.buildings.add(roof);}
  });const at=tilePosition(s.players[s.turn].pos);this.ring.position.set(at.x,.106,at.z);this.setDice(s.dice);
 }
 setDice(values){const angles={1:[0,0,0],6:[Math.PI,0,0],3:[0,0,Math.PI/2],4:[0,0,-Math.PI/2],2:[Math.PI/2,0,0],5:[-Math.PI/2,0,0]};this.diceValues=values;this.dice.forEach((d,i)=>{d.userData.final=angles[values[i]];});}
 roll(){this.rollUntil=performance.now()+800;}
 animate(){requestAnimationFrame(()=>this.animate());const dt=Math.min(this.clock.getDelta(),.1),time=performance.now();this.tokenObjects.forEach((t,i)=>{if(this.dest[i])t.position.lerp(this.dest[i],Math.min(1,dt*6));});this.dice.forEach((d,i)=>{if(time<this.rollUntil){d.rotation.x+=dt*16;d.rotation.z+=dt*12;d.position.y=.45+Math.abs(Math.sin(time*.012+i))*1;}else{const f=d.userData.final||[0,0,0];d.rotation.set(...f);d.position.y=.38;}});this.ring.material.opacity=.6+Math.sin(time*.002)*.25;this.renderer.render(this.scene,this.camera);}
}
// Keep the entire game playable on machines and embedded browsers without WebGL.
export class CanvasBoardView {
 constructor(el,onTile){
  this.el=el;this.onTile=onTile;this.zoom=1;this.cv=document.createElement('canvas');this.ctx=this.cv.getContext('2d');this.image=textureBoard().image;this.s=null;el.querySelector('#loading')?.remove();el.appendChild(this.cv);
  this.cv.addEventListener('click',e=>{const rect=this.cv.getBoundingClientRect(),x=(e.clientX-rect.left-this.ox)/this.scale-8.3,z=(e.clientY-rect.top-this.oy)/this.scale-8.3;let i=-1,dist=Infinity;BOARD.forEach((_,j)=>{const p=tilePosition(j),d=(p.x-x)**2+(p.z-z)**2;if(d<dist){dist=d;i=j;}});if(dist<2)this.onTile(i);});
  this.obs=new ResizeObserver(()=>this.resize());this.obs.observe(el);this.resize();
 }
 resize(){const dpr=Math.min(window.devicePixelRatio,2);this.w=this.el.clientWidth;this.h=this.el.clientHeight;this.cv.width=this.w*dpr;this.cv.height=this.h*dpr;this.ctx.setTransform(dpr,0,0,dpr,0,0);this.scale=Math.min((this.w-40)/17.2,(this.h-15)/17.2)*this.zoom;this.ox=(this.w-16.6*this.scale)/2;this.oy=(this.h-16.6*this.scale)/2;this.draw();}
 setView(){this.resize();}
 setZoom(d){this.zoom=THREE.MathUtils.clamp(this.zoom+d,.7,1.65);this.resize();}
 sync(g){this.s=g.s;this.draw();}
 roll(){}
 draw(){const c=this.ctx;if(!c||!this.w)return;c.clearRect(0,0,this.w,this.h);c.save();c.translate(this.ox,this.oy);c.scale(this.scale,this.scale);c.shadowColor='#1a3d3544';c.shadowBlur=20;c.shadowOffsetY=8;c.fillStyle='#234a39';c.fillRect(-.13,-.13,16.86,16.86);c.shadowBlur=0;c.shadowOffsetY=0;c.drawImage(this.image,0,0,16.6,16.6);c.translate(8.3,8.3);
  // The fallback still uses Three.js geometry coordinates for all 40 spaces.
  if(this.s){this.s.props.forEach((p,i)=>{if(p.owner===null)return;const at=tilePosition(i),side=Math.floor(i/10);c.fillStyle=p.mortgaged?'#939382':TOKENS[p.owner].color;if(side%2)c.fillRect(at.x+(side===1?-.96:.85),at.z-.45,.1,.9);else c.fillRect(at.x-.45,at.z+(side===0?.85:-.96),.9,.1);for(let n=0;n<(p.houses===5?1:p.houses);n++){c.fillStyle=p.houses===5?'#b4584e':'#487348';const k=(n-(p.houses-1)/2)*.26;c.fillRect(at.x+(side===1?.7:side===3?-.9:k-.1),at.z+(side===0?-.9:side===2?.7:k-.1),p.houses===5?.5:.2,.2);}});
   this.s.players.forEach((p,i)=>{if(p.out)return;const at=tilePosition(p.pos),x=at.x+(i%2?.3:-.3),z=at.z+(i<2?.35:-.15);c.fillStyle=TOKENS[i].color;c.strokeStyle='#faf0d6';c.lineWidth=.045;c.beginPath();c.arc(x,z,.23,0,Math.PI*2);c.fill();c.stroke();c.fillStyle='#fff7e8';c.font='bold .23px Arial';c.textAlign='center';c.textBaseline='middle';c.fillText(TOKENS[i].icon,x,z+.01);if(i===this.s.turn){c.strokeStyle='#c7a45c';c.lineWidth=.035;c.beginPath();c.arc(x,z,.29,0,Math.PI*2);c.stroke();}});
   c.textAlign='center';c.textBaseline='middle';c.font='.8px Arial';c.fillStyle='#2b4b3b';c.fillText(['','⚀','⚁','⚂','⚃','⚄','⚅'][this.s.dice[0]],-.45,4.15);c.fillText(['','⚀','⚁','⚂','⚃','⚄','⚅'][this.s.dice[1]],.45,4.15);
  }
  c.restore();c.fillStyle='#89927c';c.font='9px Arial';c.textAlign='center';c.fillText('TOP VIEW · WEBGL UNAVAILABLE IN THIS BROWSER',this.w/2,this.h-3);
 }
}

import * as THREE from './three.module.js';
import { BOARD, GROUPS, TOKENS } from './engine.js';
import {icon,tokenArt,cityArt} from './ui-art.js';
import {roundedBlock,finishMaterial,createApartment,createOwnershipFlag,createLuxuryDie,createCityLandmarks} from './scene-assets.js';
import {SoftwareRenderer} from './software-renderer.js';
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
 const cv=document.createElement('canvas');cv.width=cv.height=4096;const c=cv.getContext('2d');const scale=cv.width/16.6;c.scale(scale,scale);c.translate(8.3,8.3);
 c.fillStyle='#f3ecd5';c.fillRect(-8.3,-8.3,16.6,16.6);c.fillStyle='#dce3cc';c.fillRect(-6.3,-6.3,12.6,12.6);
 // Subtle paper grain is deterministic and never interferes with the live text.
 let seed=127;for(let n=0;n<11000;n++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const x=seed/4294967296*16.6-8.3;seed=(Math.imul(seed,1664525)+1013904223)>>>0;const z=seed/4294967296*16.6-8.3;c.fillStyle=n%2?'#766b4010':'#ffffff20';c.fillRect(x,z,.012,.012);}
 c.lineWidth=.02;c.strokeStyle='#64745e';c.strokeRect(-8.27,-8.27,16.54,16.54);c.strokeRect(-6.3,-6.3,12.6,12.6);
 for(let i=0;i<40;i++){const b=BOARD[i],p=tilePosition(i),side=Math.floor(i/10),corner=i%10===0;const w=corner||side%2?2:1.4,h=corner||!(side%2)?2:1.4;
  c.fillStyle=corner?'#e2dec1':'#f7f0dc';c.fillRect(p.x-w/2,p.z-h/2,w,h);c.strokeStyle='#839171';c.lineWidth=.014;c.strokeRect(p.x-w/2,p.z-h/2,w,h);
  if(b.type==='property'){c.fillStyle=GROUPS[b.group].color;const t=.23;if(side===0)c.fillRect(p.x-w/2,p.z-h/2,w,t);if(side===1)c.fillRect(p.x+w/2-t,p.z-h/2,t,h);if(side===2)c.fillRect(p.x-w/2,p.z+h/2-t,w,t);if(side===3)c.fillRect(p.x-w/2,p.z-h/2,t,h);}
 }
 c.strokeStyle='#ad97654d';c.lineWidth=.016;c.strokeRect(-6.08,-6.08,12.16,12.16);c.strokeRect(-5.98,-5.98,11.96,11.96);
 for(let j=0;j<4;j++){c.save();c.rotate(j*Math.PI/2);c.translate(-5.7,-5.7);c.strokeStyle='#a68c574d';c.lineWidth=.025;c.beginPath();c.moveTo(0,.8);c.lineTo(0,0);c.lineTo(.8,0);c.moveTo(.12,.6);c.lineTo(.12,.12);c.lineTo(.6,.12);c.stroke();c.restore();}
 const tex=new THREE.CanvasTexture(cv);tex.colorSpace=THREE.SRGBColorSpace;tex.anisotropy=16;return tex;
}
class BoardTypography {
 constructor(el,select,hover,project){this.el=el;this.project=project;this.layer=document.createElement('div');this.layer.className='board-labels';el.appendChild(this.layer);this.buttons=[];
  BOARD.forEach((b,i)=>{const corner=i%10===0,side=Math.floor(i/10);const bt=document.createElement('button');bt.className='board-space';bt.dataset.side=side;bt.dataset.type=b.type;bt.dataset.corner=corner;bt.setAttribute('aria-label',`${b.name}${b.price?` — ֏${b.price},000`:''}. View details`);bt.title=b.name;
   let name=b.name.replace(' · ՇԱՆՍ','').replace('Tsitsernakaberd','Tsitserna\u00adkaberd').replace('Yeritasardakan','Yerita\u00adsardakan').replace('Barekamutyun','Bareka\u00admutyun').replace('Dzoragyugh','Dzora\u00adgyugh');if(i===0)name='START';if(i===10)name='Jail';if(i===35)name='Republic Sq. Metro';
   const type=b.type==='property'?'landmark':b.type==='luxury'?'tax':b.type==='utility'?(i===28?'water':'utility'):b.type;
   bt.innerHTML=`${icon(type,'space-icon')}<span class="space-name">${name}</span><span class="space-price">${b.price?`֏${b.price}k`:i===0?'+ ֏200k':i===10?'JUST VISITING':b.type==='tax'?'֏200k':b.type==='luxury'?'֏100k':''}</span>`;
   bt.onclick=e=>{e.stopPropagation();select(i);};bt.onpointerenter=()=>hover?.(i);bt.onfocus=()=>hover?.(i);this.layer.appendChild(bt);this.buttons.push(bt);
  });
  this.center=document.createElement('div');this.center.className='board-center';this.center.innerHTML=`${cityArt('table-city')}<span class="board-city-kicker">THE PINK CITY EDITION</span><strong class="board-title">YEREVAN</strong><span class="board-subtitle">MONOPOLY</span><span class="board-armenian">ԵՐԵՎԱՆ · ԱՐԻ ԽԱՂԱՆՔ</span><div class="center-decks"><div class="mini-deck">${icon('chance')}<span>CHANCE</span></div><div class="mini-deck community">${icon('chest')}<span>COMMUNITY</span></div></div><span class="center-ornament">✦ &nbsp; A CITY WORTH PLAYING FOR &nbsp; ✦</span>`;this.layer.prepend(this.center);
 }
 rect(x,z,w,h){const pts=[[x-w/2,z-h/2],[x+w/2,z-h/2],[x-w/2,z+h/2],[x+w/2,z+h/2]].map(([a,b])=>this.project(a,b));const xs=pts.map(p=>p.x),ys=pts.map(p=>p.y);return {x:(Math.min(...xs)+Math.max(...xs))/2,y:(Math.min(...ys)+Math.max(...ys))/2,w:Math.max(...xs)-Math.min(...xs),h:Math.max(...ys)-Math.min(...ys)};}
 layout(){this.buttons.forEach((bt,i)=>{const p=tilePosition(i),side=Math.floor(i/10),corner=i%10===0;const r=this.rect(p.x,p.z,corner||side%2?1.98:1.38,corner||!(side%2)?1.98:1.38);const font=Math.max(8,Math.min(24,r.w*(side%2?.125:.16)));const ownerColor=bt.style.getPropertyValue('--owner');bt.style.cssText=`--owner:${ownerColor||'transparent'};left:${r.x}px;top:${r.y}px;width:${r.w}px;height:${r.h}px;--tile-font:${font}px;--tile-pad:${Math.max(3,r.w*.055)}px;--tile-top:${Math.max(7,r.h*.2)}px;--pawn-size:${Math.max(10,r.w*.19)}px`;
  });const r=this.rect(0,0,12.3,12.3);this.center.style.cssText=`left:${r.x}px;top:${r.y}px;width:${r.w}px;height:${r.h}px;--center-title:${r.w*.115}px;--center-sub:${r.w*.044}px;--center-kicker:${r.w*.018}px;--center-arm:${r.w*.025}px;--center-small:${r.w*.0175}px`;}
 focusOwner(id){this.ownerFocus=id;this.buttons.forEach(bt=>bt.classList.toggle('portfolio-muted',id!==null&&bt.dataset.owner!==String(id)));}
 sync(s){this.buttons.forEach((bt,i)=>{const p=s.props[i],owner=p.owner===null?null:s.players[p.owner];bt.classList.toggle('current-space',s.players[s.turn].pos===i);bt.classList.toggle('occupied',s.players.some(pl=>!pl.out&&pl.pos===i));bt.classList.toggle('owned-deed',!!owner);bt.classList.toggle('mortgaged-deed',p.mortgaged);bt.dataset.owner=p.owner??'';bt.style.setProperty('--owner',owner?TOKENS[owner.id].color:'transparent');bt.querySelector('.owner-ribbon')?.remove();bt.querySelector('.space-owner')?.remove();
  if(owner){const badge=document.createElement('span');badge.className='owner-ribbon';badge.innerHTML=`${tokenArt(owner.id)}<span></span>${p.mortgaged?'<b>M</b>':''}`;badge.querySelector('span').textContent=owner.name;badge.title=`Owned by ${owner.name}${p.mortgaged?' · Mortgaged':''}`;bt.appendChild(badge);bt.setAttribute('aria-label',`${BOARD[i].name}. Owned by ${owner.name}${p.mortgaged?', mortgaged':''}. View details`);if(this.lastOwners&&this.lastOwners[i]!==p.owner){bt.classList.remove('just-purchased');requestAnimationFrame(()=>bt.classList.add('just-purchased'));setTimeout(()=>bt.classList.remove('just-purchased'),5000);}}
 });this.lastOwners=s.props.map(p=>p.owner);if(this.ownerFocus!==undefined)this.focusOwner(this.ownerFocus);}

}
function diceTexture(n){const cv=document.createElement('canvas');cv.width=cv.height=128;const c=cv.getContext('2d');c.fillStyle='#fff8e8';c.fillRect(0,0,128,128);c.fillStyle='#29493c';let pts=[];if(n%2)pts.push([64,64]);if(n>=2)pts.push([32,32],[96,96]);if(n>=4)pts.push([96,32],[32,96]);if(n===6)pts.push([32,64],[96,64]);pts.forEach(([x,y])=>{c.beginPath();c.arc(x,y,9,0,Math.PI*2);c.fill();});const t=new THREE.CanvasTexture(cv);t.colorSpace=THREE.SRGBColorSpace;return t;}
export class BoardView{
 constructor(el,onTile,onHover){
  this.el=el;this.onTile=onTile;this.scene=new THREE.Scene();this.camera=new THREE.OrthographicCamera(-12,12,12,-12,.1,100);this.camera.position.set(0,26,17);this.camera.lookAt(0,0,0);this.zoom=1;this.mode='3d';this.tokenObjects=[];this.dest=[];this.ownerObjects=[];this.buildings=new THREE.Group();this.scene.add(this.buildings);this.clock=new THREE.Clock();this.rollUntil=0;this.focus=null;
  try{this.renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});}catch{this.renderer=new SoftwareRenderer();}this.el.dataset.renderer=this.renderer.isSoftwareRenderer?'compatibility':'webgl';this.paths=[];this.ownerGroups=[];this.dirty=true;this.lastPaint=0;this.renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,3));this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=THREE.PCFSoftShadowMap;this.renderer.outputColorSpace=THREE.SRGBColorSpace;this.renderer.toneMapping=THREE.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.1;this.renderer.setClearColor(0,0);el.appendChild(this.renderer.domElement);el.querySelector('#loading')?.remove();
  this.scene.add(new THREE.HemisphereLight('#fff8e7','#506a57',2));const sun=new THREE.DirectionalLight('#fff1d6',2.5);sun.position.set(-8,18,9);sun.castShadow=true;sun.shadow.mapSize.set(4096,4096);this.sun=sun;sun.shadow.camera.left=-12;sun.shadow.camera.right=12;sun.shadow.camera.top=12;sun.shadow.camera.bottom=-12;sun.shadow.normalBias=.04;this.scene.add(sun);const fill=new THREE.DirectionalLight('#bcd9e3',1.1);fill.position.set(8,10,-5);this.scene.add(fill);const rim=new THREE.DirectionalLight('#ffe1a3',1.3);rim.position.set(3,7,-10);this.scene.add(rim);
  if(!this.renderer.isSoftwareRenderer){const ec=document.createElement('canvas');ec.width=512;ec.height=256;const cx=ec.getContext('2d');const gradient=cx.createLinearGradient(0,0,0,256);gradient.addColorStop(0,'#cedacf');gradient.addColorStop(.55,'#788d84');gradient.addColorStop(1,'#344c43');cx.fillStyle=gradient;cx.fillRect(0,0,512,256);cx.fillStyle='#fff5e0';cx.fillRect(32,30,90,100);cx.fillStyle='#d9f2ff';cx.fillRect(300,40,120,80);const et=new THREE.CanvasTexture(ec);et.mapping=THREE.EquirectangularReflectionMapping;et.colorSpace=THREE.SRGBColorSpace;const pm=new THREE.PMREMGenerator(this.renderer);this.scene.environment=pm.fromEquirectangular(et).texture;pm.dispose();et.dispose();}
  const ground=new THREE.Mesh(new THREE.PlaneGeometry(200,200),new THREE.ShadowMaterial({opacity:.13}));ground.rotation.x=-Math.PI/2;ground.position.y=-.5;ground.receiveShadow=true;this.scene.add(ground);
  const plinth=roundedBlock(17.15,.5,17.15,finishMaterial('#183b32',.18,.42),.12);plinth.position.y=-.2;this.scene.add(plinth);const gold=roundedBlock(16.86,.08,16.86,finishMaterial('#c5a469',.72,.3),.04);gold.position.y=.04;this.scene.add(gold);
  this.board=new THREE.Mesh(new THREE.PlaneGeometry(16.6,16.6),new THREE.MeshStandardMaterial({map:textureBoard(),roughness:.93}));this.board.rotation.x=-Math.PI/2;this.board.position.y=.085;this.board.receiveShadow=true;this.board.userData.softwareSurface=true;this.scene.add(this.board);
  const tiles=new THREE.Group();tiles.userData.skipSoftware=true;const cap=this.board.material,edge=finishMaterial('#d5cbae');for(let i=0;i<40;i++){const p=tilePosition(i),side=Math.floor(i/10),corner=i%10===0;const tile=roundedBlock(corner||side%2?1.98:1.38,.065,corner||!(side%2)?1.98:1.38,[cap,edge],.025);tile.position.set(p.x,.125,p.z);const uv=tile.geometry.getAttribute('uv'),pos=tile.geometry.getAttribute('position');for(let n=0;n<uv.count;n++)uv.setXY(n,(p.x+pos.getX(n)+8.3)/16.6,(8.3-p.z-pos.getZ(n))/16.6);uv.needsUpdate=true;tiles.add(tile);}this.scene.add(tiles);
  this.scene.add(createCityLandmarks());
  this.dice=[];for(let i=0;i<2;i++){const d=createLuxuryDie();d.position.set(-.45+i*.9,.48,4.65);this.scene.add(d);this.dice.push(d);}
  const ringGeom=new THREE.RingGeometry(.4,.44,40);this.ring=new THREE.Mesh(ringGeom,new THREE.MeshBasicMaterial({color:'#c5a25b',transparent:true,opacity:.9,side:THREE.DoubleSide}));this.ring.rotation.x=-Math.PI/2;this.ring.position.y=.105;this.scene.add(this.ring);
  this.ray=new THREE.Raycaster();this.pointer=new THREE.Vector2();let down=null;el.addEventListener('pointerdown',e=>{if(e.target!==this.renderer.domElement)return;down={x:e.clientX,y:e.clientY};});el.addEventListener('pointerup',e=>{if(e.target!==this.renderer.domElement)return;if(!down||Math.hypot(e.clientX-down.x,e.clientY-down.y)>8)return;const rect=el.getBoundingClientRect();this.pointer.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);this.ray.setFromCamera(this.pointer,this.camera);const hit=this.ray.intersectObject(this.board)[0];if(!hit)return;const p=hit.point;let nearest=-1,d=Infinity;for(let i=0;i<40;i++){const t=tilePosition(i);const dd=(t.x-p.x)**2+(t.z-p.z)**2;if(dd<d){d=dd;nearest=i;}}if(d<2)this.onTile(nearest);});
  this.labels=new BoardTypography(el,onTile,onHover,(x,z)=>{const p=new THREE.Vector3(x,.18,z).project(this.camera);return {x:(p.x+1)*el.clientWidth/2,y:(1-p.y)*el.clientHeight/2};});
  this.labels.center.classList.add('webgl-city');this.labels.center.querySelector('.city-art').style.visibility='hidden';
  this.resizeObserver=new ResizeObserver(()=>this.resize());this.resizeObserver.observe(el);this.resize();this.animate();
 }
 resize(){const w=this.el.clientWidth,h=this.el.clientHeight;if(!w||!h)return;this.renderer.setPixelRatio(Math.min(this.quality==='balanced'?1.5:3,window.devicePixelRatio||1,Math.sqrt(14000000/(w*h))));this.renderer.setSize(w,h);const aspect=w/h,vertical=Math.max(9.25,9.25/aspect);this.camera.left=-vertical*aspect;this.camera.right=vertical*aspect;this.camera.top=vertical;this.camera.bottom=-vertical;this.camera.zoom=this.zoom;this.camera.updateProjectionMatrix();this.camera.updateMatrixWorld(true);this.labels?.layout();this.dirty=true;}
 setView(mode){this.mode=mode;this.camera.position.set(0,26,mode==='top'?.001:17);this.camera.lookAt(0,0,0);this.resize();}
 setQuality(q){this.quality=q;if(this.sun&&!this.renderer.isSoftwareRenderer){this.sun.shadow.mapSize.set(q==='balanced'?2048:4096,q==='balanced'?2048:4096);this.sun.shadow.map?.dispose();this.sun.shadow.map=null;}this.resize();}
 setZoom(delta){this.zoom=THREE.MathUtils.clamp(this.zoom+delta,.7,1.65);this.resize();}
 token(i){const g=new THREE.Group(),m=mat(TOKENS[i].color,.4),gold=mat('#e7c98d');const base=new THREE.Mesh(new THREE.CylinderGeometry(.24,.29,.13,24),gold);base.position.y=.065;g.add(base);
  if(i===0||i===1){const fruit=new THREE.Mesh(new THREE.SphereGeometry(.22,20,16),m);fruit.position.y=.32;fruit.scale.y=i===0?1.08:.9;g.add(fruit);if(i===0){for(let j=0;j<5;j++){const crown=new THREE.Mesh(new THREE.ConeGeometry(.037,.12,4),m);crown.position.set(Math.cos(j*Math.PI*2/5)*.07,.57,Math.sin(j*Math.PI*2/5)*.07);g.add(crown);}}else{const leaf=new THREE.Mesh(new THREE.SphereGeometry(.08,8,8),mat('#477a4d'));leaf.scale.set(1.5,.3,.7);leaf.position.set(.08,.52,0);g.add(leaf);}}
  if(i===2){const mountain=new THREE.Mesh(new THREE.ConeGeometry(.25,.43,4),m);mountain.position.y=.33;g.add(mountain);const snow=new THREE.Mesh(new THREE.ConeGeometry(.09,.15,4),mat('#f8f1df'));snow.position.y=.48;g.add(snow);}
  if(i===3){const pipe=new THREE.Mesh(new THREE.CylinderGeometry(.07,.09,.64,14),m);pipe.position.y=.43;pipe.rotation.z=-.18;g.add(pipe);for(let j=0;j<4;j++){const hole=new THREE.Mesh(new THREE.SphereGeometry(.026,8,8),gold);hole.position.set(.025-j*.02,.22+j*.12,.075);g.add(hole);}}
  g.traverse(o=>{if(o.isMesh)o.castShadow=true;});return g;
 }
 sync(game){const s=game.s;while(this.tokenObjects.length<s.players.length){const i=this.tokenObjects.length,t=this.token(i);this.tokenObjects.push(t);this.scene.add(t);t.position.set(7.3,.12,7.3);t.scale.setScalar(.72);}
  s.players.forEach((p,i)=>{const t=this.tokenObjects[i];t.visible=!p.out;const at=tilePosition(p.pos);this.dest[i]=new THREE.Vector3(at.x+(i%2?.22:-.22),.19,at.z+(i<2?.62:.27));});
  const clear=group=>{for(const o of [...group.children]){o.traverse(child=>{child.geometry?.dispose();const mats=Array.isArray(child.material)?child.material:[child.material];mats.forEach(m=>m?.dispose());});group.remove(o);}};clear(this.buildings);this.ownerGroups=[];
  s.props.forEach((p,i)=>{if(p.owner===null)return;const at=tilePosition(i),side=Math.floor(i/10),inward=new THREE.Vector3(side===1?.85:side===3?-.85:0,0,side===0?-.83:side===2?.83:0);const root=new THREE.Group();const col=p.mortgaged?'#888b7e':TOKENS[p.owner].color;
   const plaque=roundedBlock(side%2?.13:1.17,.035,side%2?1.17:.13,finishMaterial(col,.35,.4),.015);plaque.position.set(at.x+(side===1?-.85:side===3?.85:0),.19,at.z+(side===0?.85:side===2?-.85:0));root.add(plaque);
   const flag=createOwnershipFlag(col);flag.position.set(at.x+inward.x,.18,at.z+inward.z);flag.scale.setScalar(p.houses?.65:1);if(p.mortgaged)flag.rotation.z=-.2;root.add(flag);
   for(let n=0;n<(p.houses===5?1:p.houses);n++){const hotel=p.houses===5,spread=(n-(p.houses-1)/2)*.32;const apartment=createApartment(col,hotel);apartment.position.set(at.x+inward.x+(side%2?0:spread),.18,at.z+inward.z+(side%2?spread:0));root.add(apartment);}
   if(this.lastOwners&&this.lastOwners[i]!==p.owner){root.userData.recent=performance.now();this.effectsUntil=performance.now()+1800;}this.ownerGroups.push(root);this.buildings.add(root);
  });
  if(this.lastPositions)s.players.forEach((p,i)=>{const old=this.lastPositions[i];if(old!==p.pos){const distance=(p.pos-old+40)%40;this.paths[i]=[];if(!p.jailed&&distance>0&&distance<=16)for(let step=1;step<=distance;step++){const t=tilePosition((old+step)%40);this.paths[i].push(new THREE.Vector3(t.x+(i%2?.22:-.22),.19,t.z+(i<2?.62:.27)));}}});
  this.lastPositions=s.players.map(p=>p.pos);this.lastOwners=s.props.map(p=>p.owner);const at=tilePosition(s.players[s.turn].pos);this.ring.position.set(at.x,.19,at.z);this.setDice(s.dice);this.labels?.sync(s);this.dirty=true;
 }
 focusOwner(id){this.labels.focusOwner(id);this.dirty=true;}
 setDice(values){const angles={1:[0,0,0],6:[Math.PI,0,0],3:[0,0,Math.PI/2],4:[0,0,-Math.PI/2],2:[Math.PI/2,0,0],5:[-Math.PI/2,0,0]};this.diceValues=values;this.dice.forEach((d,i)=>{d.userData.final=angles[values[i]];});}
 roll(){this.rollUntil=performance.now()+800;this.dirty=true;}
 animate(){requestAnimationFrame(()=>this.animate());const dt=Math.min(this.clock.getDelta(),.1),time=performance.now();let moving=false;
  this.tokenObjects.forEach((t,i)=>{const path=this.paths[i],target=path?.length?path[0]:this.dest[i];if(target){const distance=t.position.distanceTo(target);if(distance>.005){moving=true;t.position.lerp(target,Math.min(1,dt*(path?.length?17:7)));if(path?.length&&distance<.12)path.shift();}}});
  this.dice.forEach((d,i)=>{if(time<this.rollUntil){d.rotation.x+=dt*16;d.rotation.z+=dt*12;d.position.y=.5+Math.abs(Math.sin(time*.012+i))*.85;}else{d.rotation.set(...(d.userData.final||[0,0,0]));d.position.y=.48;}});
  this.ownerGroups.forEach(g=>{if(g.userData.recent){const age=(time-g.userData.recent)/650;g.scale.y=age<1?.65+.35*Math.min(1,age):1;}});
  const animating=moving||time<this.rollUntil+100||time<(this.effectsUntil||0);this.ring.material.opacity=.7;
  if(!this.renderer.isSoftwareRenderer||((this.dirty||animating)&&time-this.lastPaint>75)){this.renderer.render(this.scene,this.camera);this.lastPaint=time;this.dirty=false;}
 }

}
// Keep the entire game playable on machines and embedded browsers without WebGL.
export class CanvasBoardView {
 constructor(el,onTile,onHover){
  this.el=el;this.onTile=onTile;this.zoom=1;this.cv=document.createElement('canvas');this.ctx=this.cv.getContext('2d');this.image=textureBoard().image;this.s=null;el.querySelector('#loading')?.remove();el.appendChild(this.cv);
  this.cv.addEventListener('click',e=>{const rect=this.cv.getBoundingClientRect(),x=(e.clientX-rect.left-this.ox)/this.scale-8.3,z=(e.clientY-rect.top-this.oy)/this.scale-8.3;let i=-1,dist=Infinity;BOARD.forEach((_,j)=>{const p=tilePosition(j),d=(p.x-x)**2+(p.z-z)**2;if(d<dist){dist=d;i=j;}});if(dist<2)this.onTile(i);});
  this.labels=new BoardTypography(el,onTile,onHover,(x,z)=>({x:this.ox+(x+8.3)*this.scale,y:this.oy+(z+8.3)*this.scale}));
  this.obs=new ResizeObserver(()=>this.resize());this.obs.observe(el);this.resize();
 }
 resize(){const dpr=Math.min(window.devicePixelRatio||1,this.quality==='balanced'?1.5:3);this.w=this.el.clientWidth;this.h=this.el.clientHeight;this.cv.width=this.w*dpr;this.cv.height=this.h*dpr;this.ctx.setTransform(dpr,0,0,dpr,0,0);this.scale=Math.min((this.w-40)/17.1,(this.h-45)/17.1)*this.zoom;this.ox=(this.w-16.6*this.scale)/2;this.oy=(this.h-16.6*this.scale)/2-10;this.draw();this.labels?.layout();}
 setView(){this.resize();}
 setZoom(d){this.zoom=THREE.MathUtils.clamp(this.zoom+d,.7,1.65);this.resize();}
 setQuality(q){this.quality=q;this.resize();}
 focusOwner(id){this.labels.focusOwner(id);}
 sync(g){this.s=g.s;this.draw();this.labels?.sync(g.s);}
 roll(){}
 draw(){const c=this.ctx;if(!c||!this.w)return;c.clearRect(0,0,this.w,this.h);c.save();c.translate(this.ox,this.oy);c.scale(this.scale,this.scale);c.shadowColor='#1a3d3544';c.shadowBlur=20;c.shadowOffsetY=8;c.fillStyle='#234a39';c.fillRect(-.13,-.13,16.86,16.86);c.shadowBlur=0;c.shadowOffsetY=0;c.drawImage(this.image,0,0,16.6,16.6);c.translate(8.3,8.3);
  // The fallback still uses Three.js geometry coordinates for all 40 spaces.
  if(this.s){this.s.props.forEach((p,i)=>{if(p.owner===null)return;const at=tilePosition(i),side=Math.floor(i/10);c.fillStyle=p.mortgaged?'#939382':TOKENS[p.owner].color;if(side%2)c.fillRect(at.x+(side===1?-.96:.85),at.z-.45,.1,.9);else c.fillRect(at.x-.45,at.z+(side===0?.85:-.96),.9,.1);for(let n=0;n<(p.houses===5?1:p.houses);n++){c.fillStyle=p.houses===5?'#b4584e':'#487348';const k=(n-(p.houses-1)/2)*.26;c.fillRect(at.x+(side===1?.7:side===3?-.9:k-.1),at.z+(side===0?-.9:side===2?.7:k-.1),p.houses===5?.5:.2,.2);}});
   this.s.players.forEach((p,i)=>{if(p.out)return;const at=tilePosition(p.pos),x=at.x+(i%2?.22:-.22),z=at.z+(i<2?.62:.27);c.fillStyle=TOKENS[i].color;c.strokeStyle='#faf0d6';c.lineWidth=.045;c.beginPath();c.arc(x,z,.16,0,Math.PI*2);c.fill();c.stroke();c.fillStyle='#fff7e8';c.font='bold .17px Arial';c.textAlign='center';c.textBaseline='middle';c.fillText(TOKENS[i].icon,x,z+.01);if(i===this.s.turn){c.strokeStyle='#c7a45c';c.lineWidth=.035;c.beginPath();c.arc(x,z,.2,0,Math.PI*2);c.stroke();}});
   
  }
  c.restore();c.fillStyle='#89927c';c.font='9px Arial';c.textAlign='center';
 }
}

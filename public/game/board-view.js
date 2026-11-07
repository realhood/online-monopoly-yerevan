import {DICE_REST_Y,diePose,faceQuaternion,flutterFlag} from './table-effects.js';
import {tilePosition,pawnAnchor,PawnMotion} from './motion.js';
import * as THREE from './three.module.js';
import { BOARD, GROUPS, TOKENS } from './engine.js';
import {icon,tokenArt,cityArt} from './ui-art.js';
import {roundedBlock,finishMaterial,createApartment,createOwnershipFlag,createLuxuryDie,createCityLandmarks,createDiceTray,orientToBoardSide} from './scene-assets.js';
import {SoftwareRenderer} from './software-renderer.js';
const mat=(color,roughness=.8)=>new THREE.MeshStandardMaterial({color,roughness});
function box(w,h,d,m,x=0,y=0,z=0){const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;return o;}
function wrap(ctx,text,x,y,max,line){let rows=[],r='';for(const word of text.split(' ')){const test=r?`${r} ${word}`:word;if(ctx.measureText(test).width>max&&r){rows.push(r);r=word;}else r=test;}if(r)rows.push(r);rows.forEach((s,j)=>ctx.fillText(s,x,y+(j-(rows.length-1)/2)*line));}
function textureBoard(state=null,focus=null,top=false){
 const cv=document.createElement('canvas');cv.width=cv.height=4096;const c=cv.getContext('2d'),scale=4096/16.6;c.scale(scale,scale);c.translate(8.3,8.3);
 c.fillStyle='#eee9de';c.fillRect(-8.3,-8.3,16.6,16.6);c.fillStyle='#c9d4ce';c.fillRect(-6.3,-6.3,12.6,12.6);
 c.strokeStyle='#9eaca3';c.lineWidth=.018;c.strokeRect(-6.08,-6.08,12.16,12.16);
 c.textAlign='center';c.textBaseline='middle';const print=(value,x,y)=>{c.save();const font=c.font;c.scale(1/scale,1/scale);c.font=font.replace(/([\d.]+)px/,(_,n)=>(Number(n)*scale)+'px');c.fillText(value,x*scale,y*scale);c.restore();};const width=value=>{c.save();c.font=c.font.replace(/([\d.]+)px/,(_,n)=>(Number(n)*scale)+'px');const w=c.measureText(value).width/scale;c.restore();return w;};const label=(value,x,y,max,line)=>{let rows=[],r='';for(const word of value.split(' ')){const chunks=[];let chunk='';for(const ch of word){if(width(chunk+ch)>max&&chunk){chunks.push(chunk);chunk=ch;}else chunk+=ch;}if(chunk)chunks.push(chunk);for(const part of chunks){const t=r?r+' '+part:part;if(width(t)>max&&r){rows.push(r);r=part;}else r=t;}}if(r)rows.push(r);rows.forEach((v,j)=>print(v,x,y+(j-(rows.length-1)/2)*line));};c.fillStyle='#344b43';c.font='700 .8px Manrope,Arial';print('YEREVAN',0,.05);c.font='600 .32px Manrope,Arial';print('M O N O P O L Y',0,.73);c.fillStyle='#5b7468';c.font='.19px Arial';print('ԵՐԵՎԱՆ  ·  THE PINK CITY EDITION',0,1.35);
 c.strokeStyle='#7b9484';c.lineWidth=.015;c.beginPath();c.moveTo(-2.5,1.85);c.lineTo(2.5,1.85);c.stroke();
 // Print each label into the surface of its physical tile. The text follows the camera.
 BOARD.forEach((b,i)=>{const p=tilePosition(i),side=Math.floor(i/10),corner=i%10===0,prop=state?.props[i],owner=prop?.owner==null?null:state.players[prop.owner];c.save();c.translate(p.x,p.z);c.rotate(top?0:side*Math.PI/2);const w=corner?2:top&&side%2?2:1.4,h=top&&side%2?1.4:2;
 c.globalAlpha=focus!==null&&prop?.owner!==focus ? .42:1;
 c.fillStyle=corner?'#e0ded1':'#f8f4eb';c.fillRect(-w/2+.018,-h/2+.018,w-.036,h-.036);c.strokeStyle=owner?TOKENS[owner.id].color:'#b4b8a9';c.lineWidth=owner?.045:.018;c.strokeRect(-w/2+.025,-h/2+.025,w-.05,h-.05);
 if(b.type==='property'){c.fillStyle=GROUPS[b.group].color;if(top&&side===1)c.fillRect(w/2-.25,-h/2+.03,.22,h-.06);else if(top&&side===2)c.fillRect(-w/2+.03,h/2-.25,w-.06,.22);else if(top&&side===3)c.fillRect(-w/2+.03,-h/2+.03,.22,h-.06);else c.fillRect(-w/2+.03,-h/2+.03,w-.06,.22);}
 c.fillStyle='#30443c';c.font='700 '+(corner?'.28':top?'.26':'.225')+'px Manrope,Arial';let name=i===0?'START':i===10?'JAIL':i===20?'FREE PARKING':i===30?'GO TO JAIL':b.name.replace(' · ՇԱՆՍ','');label(name,top&&side===1?-.08:top&&side===3?.08:0,corner?-.14:h===1.4?-.23:-.19,w-(top&&side%2?.42:.16),top?.26:.24);
 c.fillStyle='#6c7b70';c.font=top?'500 .15px Manrope,Arial':'500 .175px Manrope,Arial';print(b.price?'֏'+b.price+'k':i===0?'+ ֏200k':i===10?'JUST VISITING':b.type==='tax'?'֏200k':b.type==='luxury'?'֏100k':b.type==='chance'?'?':b.type==='chest'?'COMMUNITY':'',0,h/2-.55);
 if(owner){c.fillStyle=prop.mortgaged?'#777b76':TOKENS[owner.id].color;c.fillRect(-w/2+.035,h/2-.31,w-.07,.27);c.fillStyle='#fff';c.font='700 .145px Manrope,Arial';let n=owner.name;while(width(n)>w-.17)n=n.slice(0,-2)+'…';print((prop.mortgaged?'M · ':'')+n,0,h/2-.175);}
 c.restore();});
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
 sync(s){this.buttons.forEach((bt,i)=>{const p=s.props[i],owner=p.owner===null?null:s.players[p.owner];bt.classList.toggle('current-space',s.players[s.turn].pos===i);bt.classList.toggle('occupied',s.players.some(pl=>!pl.out&&pl.pos===i));bt.classList.toggle('owned-deed',!!owner);bt.classList.toggle('mortgaged-deed',p.mortgaged);bt.dataset.owner=p.owner??'';bt.style.setProperty('--owner',owner?TOKENS[owner.id].color:'transparent');bt.querySelector('.owner-ribbon')?.remove();bt.querySelector('.space-owner')?.remove();bt.setAttribute('aria-label',`${BOARD[i].name}. ${BOARD[i].price?'Available from the bank. ':''}View details`);
  if(owner){const badge=document.createElement('span');badge.className='owner-ribbon';badge.innerHTML=`${tokenArt(owner.id)}<span></span>${p.mortgaged?'<b>M</b>':''}`;badge.querySelector('span').textContent=owner.name;badge.title=`Owned by ${owner.name}${p.mortgaged?' · Mortgaged':''}`;bt.appendChild(badge);bt.setAttribute('aria-label',`${BOARD[i].name}. Owned by ${owner.name}${p.mortgaged?', mortgaged':''}. View details`);if(this.lastOwners&&this.lastOwners[i]!==p.owner){bt.classList.remove('just-purchased');requestAnimationFrame(()=>bt.classList.add('just-purchased'));setTimeout(()=>bt.classList.remove('just-purchased'),5000);}}
 });this.lastOwners=s.props.map(p=>p.owner);if(this.ownerFocus!==undefined)this.focusOwner(this.ownerFocus);}

}
function diceTexture(n){const cv=document.createElement('canvas');cv.width=cv.height=128;const c=cv.getContext('2d');c.fillStyle='#fff8e8';c.fillRect(0,0,128,128);c.fillStyle='#29493c';let pts=[];if(n%2)pts.push([64,64]);if(n>=2)pts.push([32,32],[96,96]);if(n>=4)pts.push([96,32],[32,96]);if(n===6)pts.push([32,64],[96,64]);pts.forEach(([x,y])=>{c.beginPath();c.arc(x,y,9,0,Math.PI*2);c.fill();});const t=new THREE.CanvasTexture(cv);t.colorSpace=THREE.SRGBColorSpace;return t;}
export class BoardView{
 constructor(el,onTile,onHover){
  this.el=el;this.onTile=onTile;this.scene=new THREE.Scene();this.camera=new THREE.PerspectiveCamera(39,1,.1,160);this.yaw=.32;this.tilt=.66;this.zoom=1;this.mode='3d';this.tokenObjects=[];this.dest=[];this.ownerObjects=[];this.buildings=new THREE.Group();this.scene.add(this.buildings);this.clock=new THREE.Clock();this.rollUntil=0;this.focus=null;
  try{this.renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});}catch{this.renderer=new SoftwareRenderer();}this.el.dataset.renderer=this.renderer.isSoftwareRenderer?'compatibility':'webgl';this.motion=new PawnMotion();this.motion.reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches??false;this.settleWaiters=[];this.ownerGroups=[];this.dirty=true;this.lastPaint=0;this.renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,3));this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=THREE.PCFSoftShadowMap;this.renderer.outputColorSpace=THREE.SRGBColorSpace;this.renderer.toneMapping=THREE.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.1;this.renderer.setClearColor(0,0);el.appendChild(this.renderer.domElement);el.querySelector('#loading')?.remove();
  this.scene.add(new THREE.HemisphereLight('#fff8e7','#506a57',2));const sun=new THREE.DirectionalLight('#fff1d6',2.5);sun.position.set(-8,18,9);sun.castShadow=true;sun.shadow.mapSize.set(4096,4096);this.sun=sun;sun.shadow.camera.left=-12;sun.shadow.camera.right=12;sun.shadow.camera.top=12;sun.shadow.camera.bottom=-12;sun.shadow.normalBias=.04;this.scene.add(sun);const fill=new THREE.DirectionalLight('#bcd9e3',1.1);fill.position.set(8,10,-5);this.scene.add(fill);const rim=new THREE.DirectionalLight('#ffe1a3',1.3);rim.position.set(3,7,-10);this.scene.add(rim);
  if(!this.renderer.isSoftwareRenderer){const ec=document.createElement('canvas');ec.width=512;ec.height=256;const cx=ec.getContext('2d');const gradient=cx.createLinearGradient(0,0,0,256);gradient.addColorStop(0,'#cedacf');gradient.addColorStop(.55,'#788d84');gradient.addColorStop(1,'#344c43');cx.fillStyle=gradient;cx.fillRect(0,0,512,256);cx.fillStyle='#fff5e0';cx.fillRect(32,30,90,100);cx.fillStyle='#d9f2ff';cx.fillRect(300,40,120,80);const et=new THREE.CanvasTexture(ec);et.mapping=THREE.EquirectangularReflectionMapping;et.colorSpace=THREE.SRGBColorSpace;const pm=new THREE.PMREMGenerator(this.renderer);this.scene.environment=pm.fromEquirectangular(et).texture;pm.dispose();et.dispose();}
  const ground=new THREE.Mesh(new THREE.PlaneGeometry(200,200),new THREE.ShadowMaterial({opacity:.13}));ground.rotation.x=-Math.PI/2;ground.position.y=-.8;ground.receiveShadow=true;this.scene.add(ground);
  const plinth=roundedBlock(17.15,.8,17.15,finishMaterial('#263c39',.22,.3),.12);plinth.position.y=-.35;this.scene.add(plinth);const gold=roundedBlock(16.86,.08,16.86,finishMaterial('#c5a469',.72,.3),.04);gold.position.y=.04;this.scene.add(gold);
  this.board=new THREE.Mesh(new THREE.PlaneGeometry(16.6,16.6),new THREE.MeshStandardMaterial({map:textureBoard(),roughness:.93}));this.board.rotation.x=-Math.PI/2;this.board.position.y=.085;this.board.receiveShadow=true;this.board.userData.softwareSurface=true;this.scene.add(this.board);
  const tiles=new THREE.Group();tiles.userData.skipSoftware=true;const cap=this.board.material,edge=finishMaterial('#d5cbae');for(let i=0;i<40;i++){const p=tilePosition(i),side=Math.floor(i/10),corner=i%10===0;const tile=roundedBlock(corner||side%2?1.98:1.38,.065,corner||!(side%2)?1.98:1.38,[cap,edge],.025);tile.position.set(p.x,.125,p.z);const uv=tile.geometry.getAttribute('uv'),pos=tile.geometry.getAttribute('position');for(let n=0;n<uv.count;n++)uv.setXY(n,(p.x+pos.getX(n)+8.3)/16.6,(8.3-p.z-pos.getZ(n))/16.6);uv.needsUpdate=true;tiles.add(tile);}this.scene.add(tiles);
  const city=createCityLandmarks();city.scale.set(.85,1.15,.85);city.position.z=-.45;this.scene.add(city);
  this.tray=createDiceTray();this.tray.position.set(0,.09,3.5);this.scene.add(this.tray);
  this.dice=[];for(let i=0;i<2;i++){const d=createLuxuryDie();d.userData.dynamic=true;d.scale.setScalar(1.18);d.userData.home={x:-.76+i*1.52,y:DICE_REST_Y,z:3.5};d.position.set(d.userData.home.x,d.userData.home.y,d.userData.home.z);this.scene.add(d);this.dice.push(d);}
  const ringGeom=new THREE.RingGeometry(.4,.44,40);this.ring=new THREE.Mesh(ringGeom,new THREE.MeshBasicMaterial({color:'#c5a25b',transparent:true,opacity:.9,side:THREE.DoubleSide}));this.ring.userData.dynamic=true;this.ring.rotation.x=-Math.PI/2;this.ring.position.y=.105;this.scene.add(this.ring);
  this.ray=new THREE.Raycaster();this.pointer=new THREE.Vector2();let down=null,lastHover=-1;
  const pick=e=>{const r=el.getBoundingClientRect();this.pointer.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);this.ray.setFromCamera(this.pointer,this.camera);const hit=this.ray.intersectObject(this.board)[0];if(!hit)return -1;let nearest=-1,d=Infinity;BOARD.forEach((_,i)=>{const p=tilePosition(i),v=(p.x-hit.point.x)**2+(p.z-hit.point.z)**2;if(v<d){d=v;nearest=i;}});return d<1.4?nearest:-1;};
  const canvas=this.renderer.domElement;canvas.style.touchAction='none';canvas.addEventListener('pointerdown',e=>{down={x:e.clientX,y:e.clientY,yaw:this.yaw,tilt:this.tilt,dragged:false};canvas.setPointerCapture(e.pointerId);});
  canvas.addEventListener('pointermove',e=>{if(down){const dx=e.clientX-down.x,dy=e.clientY-down.y;if(Math.hypot(dx,dy)>5)down.dragged=true;if(down.dragged){this.mode='3d';this.yaw=down.yaw-dx*.006;this.tilt=THREE.MathUtils.clamp(down.tilt+dy*.004,.18,1.12);this.resize();}return;}const i=pick(e);canvas.style.cursor=i<0?'grab':'pointer';if(i>=0&&i!==lastHover){lastHover=i;onHover?.(i);}});
  canvas.addEventListener('pointerup',e=>{if(down&&!down.dragged){const i=pick(e);if(i>=0)this.onTile(i);}down=null;});canvas.addEventListener('pointercancel',()=>down=null);canvas.addEventListener('wheel',e=>{e.preventDefault();this.setZoom(e.deltaY>0?-.06:.06);},{passive:false});
  this.labels=new BoardTypography(el,onTile,onHover,()=>({x:0,y:0}));this.labels.layer.classList.add('physical-label-access');this.labels.center.hidden=true;
  this.resizeObserver=new ResizeObserver(()=>this.resize());this.resizeObserver.observe(el);this.resize();this.animate();document.fonts?.ready.then(()=>{this.printSignature=null;this.paintBoard();this.dirty=true;});
 }
 resize(){const w=this.el.clientWidth,h=this.el.clientHeight;if(!w||!h)return;this.renderer.setPixelRatio(Math.min(this.quality==='balanced'?1.5:3,window.devicePixelRatio||1,Math.sqrt(16000000/(w*h))));this.renderer.setSize(w,h);this.camera.aspect=w/h;this.camera.zoom=1;const tilt=this.mode==='top'?.001:this.tilt,yaw=this.mode==='top'?0:this.yaw;this.camera.position.set(34*Math.sin(tilt)*Math.sin(yaw),34*Math.cos(tilt),34*Math.sin(tilt)*Math.cos(yaw));this.camera.lookAt(0,0,0);this.camera.updateProjectionMatrix();this.camera.updateMatrixWorld(true);
  let mx=0,my=0;const bounds=[];for(const x of [-8.6,8.6])for(const z of [-8.6,8.6])bounds.push([x,.5,z]);for(const x of [-4,4])bounds.push([x,2,-4]);for(const [x,y,z] of bounds){const p=new THREE.Vector3(x,y,z).project(this.camera);mx=Math.max(mx,Math.abs(p.x));my=Math.max(my,Math.abs(p.y));}this.camera.zoom=this.zoom/Math.max(mx/.96,my/.96);this.camera.updateProjectionMatrix();this.dirty=true;}
 setView(mode){this.mode=mode;this.paintBoard();if(mode==='3d'){this.yaw=.32;this.tilt=.66;}this.resize();}
 rotate(delta){this.mode='3d';this.yaw+=delta;this.resize();}
 setQuality(q){this.quality=q;if(this.sun&&!this.renderer.isSoftwareRenderer){this.sun.shadow.mapSize.set(q==='balanced'?2048:4096,q==='balanced'?2048:4096);this.sun.shadow.map?.dispose();this.sun.shadow.map=null;}this.resize();}
 setZoom(delta){this.zoom=THREE.MathUtils.clamp(this.zoom+delta,.7,1.65);this.resize();}
 token(i){const g=new THREE.Group();g.userData.dynamic=true;const m=mat(TOKENS[i].color,.4),gold=mat('#e7c98d');const base=new THREE.Mesh(new THREE.CylinderGeometry(.24,.29,.13,24),gold);base.position.y=.065;g.add(base);
  if(i===0||i===1){const fruit=new THREE.Mesh(new THREE.SphereGeometry(.22,20,16),m);fruit.position.y=.32;fruit.scale.y=i===0?1.08:.9;g.add(fruit);if(i===0){for(let j=0;j<5;j++){const crown=new THREE.Mesh(new THREE.ConeGeometry(.037,.12,4),m);crown.position.set(Math.cos(j*Math.PI*2/5)*.07,.57,Math.sin(j*Math.PI*2/5)*.07);g.add(crown);}}else{const leaf=new THREE.Mesh(new THREE.SphereGeometry(.08,8,8),mat('#477a4d'));leaf.scale.set(1.5,.3,.7);leaf.position.set(.08,.52,0);g.add(leaf);}}
  if(i===2){const mountain=new THREE.Mesh(new THREE.ConeGeometry(.25,.43,4),m);mountain.position.y=.33;g.add(mountain);const snow=new THREE.Mesh(new THREE.ConeGeometry(.09,.15,4),mat('#f8f1df'));snow.position.y=.48;g.add(snow);}
  if(i===3){const pipe=new THREE.Mesh(new THREE.CylinderGeometry(.07,.09,.64,14),m);pipe.position.y=.43;pipe.rotation.z=-.18;g.add(pipe);for(let j=0;j<4;j++){const hole=new THREE.Mesh(new THREE.SphereGeometry(.026,8,8),gold);hole.position.set(.025-j*.02,.22+j*.12,.075);g.add(hole);}}
  g.traverse(o=>{if(o.isMesh)o.castShadow=true;});return g;
 }
 sync(game){const s=game.s;while(this.tokenObjects.length<s.players.length){const i=this.tokenObjects.length,t=this.token(i);this.tokenObjects.push(t);this.scene.add(t);t.position.set(7.3,.18,7.3);t.scale.setScalar(.72);}
  this.motion.sync(s,Math.max(performance.now(),this.rollUntil));s.players.forEach((p,i)=>{this.tokenObjects[i].visible=!p.out;this.tokenObjects[i].position.set(...Object.values(this.motion.positions[i]));});
  const signature=JSON.stringify(s.props);if(signature!==this.buildSignature){this.buildSignature=signature;
  const clear=group=>{for(const o of [...group.children]){o.traverse(child=>{child.geometry?.dispose();const mats=Array.isArray(child.material)?child.material:[child.material];mats.forEach(m=>m?.dispose());});group.remove(o);}};clear(this.buildings);this.ownerGroups=[];
  s.props.forEach((p,i)=>{if(p.owner===null)return;const at=tilePosition(i),side=Math.floor(i/10),inward=new THREE.Vector3(side===1?.85:side===3?-.85:0,0,side===0?-.83:side===2?.83:0);const root=new THREE.Group();const col=p.mortgaged?'#888b7e':TOKENS[p.owner].color;
   const plaque=roundedBlock(side%2?.13:1.17,.035,side%2?1.17:.13,finishMaterial(col,.35,.4),.015);plaque.position.set(at.x+(side===1?-.85:side===3?.85:0),.19,at.z+(side===0?.85:side===2?-.85:0));root.add(plaque);
   const flag=orientToBoardSide(createOwnershipFlag(col),i);flag.position.set(at.x+inward.x,.18,at.z+inward.z);flag.scale.setScalar(p.houses?.65:1);if(p.mortgaged)flag.rotation.z=-.2;root.add(flag);
   for(let n=0;n<(p.houses===5?1:p.houses);n++){const hotel=p.houses===5,spread=(n-(p.houses-1)/2)*.32;const apartment=orientToBoardSide(createApartment(col,hotel),i);apartment.position.set(at.x+inward.x+(side%2?0:spread),.18,at.z+inward.z+(side%2?spread:0));root.add(apartment);}
   if(this.lastOwners&&this.lastOwners[i]!==p.owner){root.userData.recent=performance.now();this.effectsUntil=performance.now()+1800;}this.ownerGroups.push(root);this.buildings.add(root);
  });
  }
  this.flagCloths=[];this.buildings.traverse(o=>{if(o.userData.flagCloth)this.flagCloths.push(o);});this.lastOwners=s.props.map(p=>p.owner);this.state=s;this.followRing();this.setDice(s.dice);this.labels?.sync(s);this.paintBoard();this.tokenObjects.forEach((t,i)=>{if(i>=s.players.length)t.visible=false;});this.dirty=true;
 }
 resetMotion(state){this.rollUntil=0;this.motion.reset(state);this.state=state;this.followRing();this.finishWaiters();this.dirty=true;}
 get isMoving(){return this.motion.moving||performance.now()<this.rollUntil;}
 whenSettled(){return this.isMoving||this.dirty?new Promise(resolve=>this.settleWaiters.push(resolve)):Promise.resolve();}
 finishWaiters(){this.settleWaiters.splice(0).forEach(resolve=>resolve());}
 followRing(){const p=this.motion.positions[this.state?.turn??0];if(p)this.ring.position.set(p.x,.172,p.z);}
 paintBoard(){const signature=JSON.stringify([this.state?.props.map(p=>[p.owner,p.mortgaged]),this.state?.players.map(p=>p.name),this.ownerFocus??null,this.mode==='top']);if(signature===this.printSignature)return;this.printSignature=signature;const old=this.board.material.map,tex=textureBoard(this.state,this.ownerFocus??null,this.mode==='top');old.image=tex.image;old.needsUpdate=true;tex.dispose();this.dirty=true;}
 focusOwner(id){this.ownerFocus=id;this.labels.focusOwner(id);this.paintBoard();this.dirty=true;}
 setDice(values){this.diceValues=values;}
 roll(){this.rollStart=performance.now();const duration=this.motion.reduced?180:850;this.rollUntil=this.rollStart+duration;this.rollNumber=(this.rollNumber||0)+1;this.dice.forEach((d,i)=>{d.userData.rollFrom=d.position.clone();d.userData.rollInitial=d.quaternion.clone();d.userData.home={x:(i?1:-1)*(.74+((this.rollNumber+i)%3-1)*.045),y:DICE_REST_Y,z:3.5+(this.rollNumber%2?1:-1)*(i?-.22:.28)};});this.dirty=true;return duration;}
 animate(){requestAnimationFrame(()=>this.animate());const dt=Math.min(this.clock.getDelta(),.1),time=performance.now();let moving=false;
  const wasMoving=this.motion.moving;this.motion.update(time);moving=wasMoving||this.motion.moving;this.tokenObjects.forEach((t,i)=>{const p=this.motion.positions[i];if(p)t.position.set(p.x,p.y,p.z);});this.followRing();
  const rolling=time<this.rollUntil;if(this.wasRolling&&!rolling){this.dirty=true;requestAnimationFrame(()=>this.el.dispatchEvent(new CustomEvent('dice-settled')));}this.wasRolling=rolling;const progress=Math.max(0,Math.min(1,(time-(this.rollStart||0))/Math.max(1,this.rollUntil-(this.rollStart||0))));
  this.dice.forEach((d,i)=>{const h=d.userData.home;if(rolling){const pose=diePose(progress,d.userData.rollFrom||d.position,new THREE.Vector3(h.x,h.y,h.z),d.userData.rollInitial||d.quaternion,this.diceValues?.[i]||1,i,this.motion.reduced);d.position.copy(pose.position);d.quaternion.copy(pose.quaternion);}else{d.position.set(h.x,h.y,h.z);d.quaternion.copy(faceQuaternion(this.diceValues?.[i]||1,i));}});
  if(!this.renderer.isSoftwareRenderer)this.ownerGroups.forEach(g=>{if(g.userData.recent){const age=(time-g.userData.recent)/650;g.scale.y=age<1?.65+.35*Math.min(1,age):1;}});
  if(!this.motion.reduced&&!this.decorationsPaused)this.flagCloths?.forEach((cloth,i)=>flutterFlag(cloth,time/1000,i*.65));
  const animating=(this.flagCloths?.length&&!this.motion.reduced&&!this.decorationsPaused)||moving||time<this.rollUntil+100||time<(this.effectsUntil||0);this.ring.material.opacity=.7;
  if(!this.renderer.isSoftwareRenderer||((this.dirty||animating)&&time-this.lastPaint>(moving||rolling?32:250))){this.renderer.render(this.scene,this.camera);this.lastPaint=performance.now();this.dirty=false;if(!this.isMoving)this.finishWaiters();}
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
 resetMotion(){}
 get isMoving(){return false;}
 whenSettled(){return Promise.resolve();}
 sync(g){this.s=g.s;this.draw();this.labels?.sync(g.s);}
 roll(){}
 draw(){const c=this.ctx;if(!c||!this.w)return;c.clearRect(0,0,this.w,this.h);c.save();c.translate(this.ox,this.oy);c.scale(this.scale,this.scale);c.shadowColor='#1a3d3544';c.shadowBlur=20;c.shadowOffsetY=8;c.fillStyle='#234a39';c.fillRect(-.13,-.13,16.86,16.86);c.shadowBlur=0;c.shadowOffsetY=0;c.drawImage(this.image,0,0,16.6,16.6);c.translate(8.3,8.3);
  // The fallback still uses Three.js geometry coordinates for all 40 spaces.
  if(this.s){this.s.props.forEach((p,i)=>{if(p.owner===null)return;const at=tilePosition(i),side=Math.floor(i/10);c.fillStyle=p.mortgaged?'#939382':TOKENS[p.owner].color;if(side%2)c.fillRect(at.x+(side===1?-.96:.85),at.z-.45,.1,.9);else c.fillRect(at.x-.45,at.z+(side===0?.85:-.96),.9,.1);for(let n=0;n<(p.houses===5?1:p.houses);n++){c.fillStyle=p.houses===5?'#b4584e':'#487348';const k=(n-(p.houses-1)/2)*.26;c.fillRect(at.x+(side===1?.7:side===3?-.9:k-.1),at.z+(side===0?-.9:side===2?.7:k-.1),p.houses===5?.5:.2,.2);}});
   this.s.players.forEach((p,i)=>{if(p.out)return;const at=pawnAnchor(p.pos,i),x=at.x,z=at.z;c.fillStyle=TOKENS[i].color;c.strokeStyle='#faf0d6';c.lineWidth=.045;c.beginPath();c.arc(x,z,.16,0,Math.PI*2);c.fill();c.stroke();c.fillStyle='#fff7e8';c.font='bold .17px Arial';c.textAlign='center';c.textBaseline='middle';c.fillText(TOKENS[i].icon,x,z+.01);if(i===this.s.turn){c.strokeStyle='#c7a45c';c.lineWidth=.035;c.beginPath();c.arc(x,z,.2,0,Math.PI*2);c.stroke();}});
   
  }
  c.restore();c.fillStyle='#89927c';c.font='9px Arial';c.textAlign='center';
 }
}

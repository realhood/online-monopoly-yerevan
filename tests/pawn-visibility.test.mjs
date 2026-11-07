import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from '../public/game/three.module.js';
import {BOARD} from '../public/game/engine.js';
import {pawnAnchor,pawnStyle,tilePosition,PawnMotion} from '../public/game/motion.js';
import {createPlayerPiece,createPawnMarker} from '../public/game/pieces.js';
import {propertyLayout} from '../public/game/property-layout.js';
import {createApartment,createOwnershipFlag,orientToBoardSide} from '../public/game/scene-assets.js';
test('all eight enlarged pieces and their actual selection circles fit every tile for 2–6 players',()=>{
 const models=Array.from({length:8},(_,i)=>createPlayerPiece(i,'#b84944'));
 for(let count=2;count<=6;count++){const style=pawnStyle(count),marker=createPawnMarker();marker.scale.setScalar(style.x);const circleBox=new THREE.Box3().setFromObject(marker),radius=Math.max(circleBox.max.x,circleBox.max.z);assert.ok(radius>style.baseRadius);
  for(let space=0;space<40;space++){const center=tilePosition(space),side=Math.floor(space/10),corner=space%10===0,halfX=corner||side%2?.99:.69,halfZ=corner||!(side%2)?.99:.69;
   for(let seat=0;seat<count;seat++){const a=pawnAnchor(space,seat,count);assert.ok(Math.abs(a.x-center.x)+radius<halfX,`circle x: ${space}/${seat}/${count}`);assert.ok(Math.abs(a.z-center.z)+radius<halfZ,`circle z: ${space}/${seat}/${count}`);
    for(const model of models){model.scale.set(style.x,style.y,style.z);model.position.set(a.x,a.y,a.z);const b=new THREE.Box3().setFromObject(model);assert.ok(b.min.x>=center.x-halfX&&b.max.x<=center.x+halfX);assert.ok(b.min.z>=center.z-halfZ&&b.max.z<=center.z+halfZ);}
   }
   for(let a=0;a<count;a++)for(let b=a+1;b<count;b++){const x=pawnAnchor(space,a,count),y=pawnAnchor(space,b,count);assert.ok(Math.hypot(x.x-y.x,x.z-y.z)>2*style.baseRadius,`overlapping bases: ${space}/${count}`);}
  }
 }
});
test('selection circles and enlarged bases stay clear of four apartments, hotels and flags',()=>{
 for(let count=2;count<=6;count++){const r=pawnStyle(count).markerRadius;
  for(const space of [1,11,21,31])for(const houses of [4,5]){const layout=propertyLayout(space,houses),flag=orientToBoardSide(createOwnershipFlag('#b84944'),space);flag.scale.setScalar(layout.flag.scale);flag.position.set(layout.flag.x,layout.flag.y,layout.flag.z);const bounds=[new THREE.Box3().setFromObject(flag),...layout.buildings.map(p=>{const o=orientToBoardSide(createApartment('#b84944',p.hotel),space);o.position.set(p.x,p.y,p.z);return new THREE.Box3().setFromObject(o);})];
   for(let seat=0;seat<count;seat++){const a=pawnAnchor(space,seat,count);for(const b of bounds)assert.ok(a.x+r<b.min.x||a.x-r>b.max.x||a.z+r<b.min.z||a.z-r>b.max.z,`marker overlaps development: ${space}/${count}/${seat}`);}
  }
 }
});
test('all player counts keep animation arrival, logical space and marker anchor in agreement',async()=>{
 const {BoardView}=await import('../public/game/board-view.js');
 for(let count=2;count<=6;count++)for(let seat=0;seat<count;seat++){const s={players:Array.from({length:count},(_,id)=>({id,pos:3,out:false})),turn:seat},m=new PawnMotion();m.reset(s);const next=structuredClone(s);next.players[seat].pos=4;next.presentation={id:1,moves:[{player:seat,from:3,to:4,kind:'walk',spaces:[4]}]};m.sync(next,0);m.update(100);const ring=createPawnMarker();BoardView.prototype.followRing.call({motion:m,state:next,ring});assert.equal(ring.position.x,m.positions[seat].x);assert.equal(ring.position.z,m.positions[seat].z);assert.equal(ring.scale.x,pawnStyle(count).x);m.update(5000);assert.deepEqual(m.positions[seat],pawnAnchor(4,seat,count));BoardView.prototype.followRing.call({motion:m,state:next,ring});const center=tilePosition(4),r=pawnStyle(count).markerRadius;assert.ok(Math.abs(ring.position.x-center.x)+r<.69);}
});

test('Find piece centers the active model, Reset frames the board, and Ultra supersamples at DPR 1',async()=>{
 const {BoardView}=await import('../public/game/board-view.js'),previousWindow=globalThis.window;let ratio=0;
 globalThis.window={devicePixelRatio:1};try{const s={players:Array.from({length:6},(_,id)=>({id,pos:4,out:false})),turn:0},motion=new PawnMotion();motion.reset(s);const view={el:{clientWidth:980,clientHeight:630},renderer:{setPixelRatio(n){ratio=n;},setSize(){}},camera:new THREE.PerspectiveCamera(39,1,.1,160),quality:'ultra',mode:'3d',tilt:.66,yaw:.32,zoom:1,state:s,motion,paintBoard(){},resize(){BoardView.prototype.resize.call(this);}};BoardView.prototype.focusPiece.call(view);assert.equal(ratio,2);assert.equal(view.camera.zoom,3.2);const focus=new THREE.Vector3(view.pieceFocus.x,view.pieceFocus.y,view.pieceFocus.z).project(view.camera);assert.ok(Math.abs(focus.x)<.0001&&Math.abs(focus.y)<.0001);BoardView.prototype.setView.call(view,'3d');assert.equal(view.pieceFocus,null);for(const x of [-8.6,8.6])for(const z of [-8.6,8.6]){const p=new THREE.Vector3(x,.5,z).project(view.camera);assert.ok(Math.abs(p.x)<=.961&&Math.abs(p.y)<=.961);}}
 finally{if(previousWindow===undefined)delete globalThis.window;else globalThis.window=previousWindow;}
});

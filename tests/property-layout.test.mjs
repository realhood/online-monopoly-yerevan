import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from '../public/game/three.module.js';
import {BOARD} from '../public/game/engine.js';
import {propertyLayout} from '../public/game/property-layout.js';
import {tilePosition,pawnAnchor} from '../public/game/motion.js';
import {createApartment,createOwnershipFlag,orientToBoardSide} from '../public/game/scene-assets.js';
test('all buildings and flags fit their own property on every board side',()=>{
 for(let space=0;space<40;space++){if(!BOARD[space].price)continue;const center=tilePosition(space),side=Math.floor(space/10),halfX=side%2?.99:.69,halfZ=side%2?.69:.99;
  for(let count=0;count<=5;count++){const layout=propertyLayout(space,count),flag=orientToBoardSide(createOwnershipFlag('#b84944'),space);flag.position.set(layout.flag.x,layout.flag.y,layout.flag.z);flag.scale.setScalar(layout.flag.scale);const objects=[flag,...layout.buildings.map(p=>{const o=orientToBoardSide(createApartment('#b84944',p.hotel),space);o.position.set(p.x,p.y,p.z);return o;})],boxes=objects.map(o=>new THREE.Box3().setFromObject(o));
   for(const b of boxes){assert.ok(b.min.x>=center.x-halfX-.001&&b.max.x<=center.x+halfX+.001,`x footprint: space ${space}, ${count}`);assert.ok(b.min.z>=center.z-halfZ-.001&&b.max.z<=center.z+halfZ+.001,`z footprint: space ${space}, ${count}`);}
   for(let i=0;i<boxes.length;i++)for(let j=i+1;j<boxes.length;j++){const a=boxes[i],b=boxes[j];assert.ok(a.max.x<=b.min.x||b.max.x<=a.min.x||a.max.z<=b.min.z||b.max.z<=a.min.z,`overlapping buildings/flag at ${space}`);}
  }
 }
});
test('hotel stays centered on Kond rather than using four-house spacing',()=>{const p=propertyLayout(1,5);assert.equal(p.buildings.length,1);assert.equal(p.buildings[0].x,tilePosition(1).x);assert.equal(p.buildings[0].hotel,true);});
test('all six pawn bases have their own room, clear of the building row',()=>{for(let space=0;space<40;space++){const anchors=Array.from({length:6},(_,i)=>pawnAnchor(space,i));for(let i=0;i<6;i++)for(let j=i+1;j<6;j++)assert.ok(Math.hypot(anchors[i].x-anchors[j].x,anchors[i].z-anchors[j].z)>.34);if(BOARD[space].type!=='property')continue;for(const p of propertyLayout(space,4).buildings){const o=orientToBoardSide(createApartment('#fff'),space);o.position.set(p.x,p.y,p.z);const b=new THREE.Box3().setFromObject(o);for(const a of anchors)assert.ok(a.x+.17<b.min.x||a.x-.17>b.max.x||a.z+.17<b.min.z||a.z-.17>b.max.z);}}});

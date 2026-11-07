import {tilePosition} from './motion.js';
// All positions start in one tile's local coordinates: +z faces the player edge.
export function propertyPoint(space,x,z,y=.18){const at=tilePosition(space),angle=-Math.floor(space/10)*Math.PI/2;return {x:at.x+x*Math.cos(angle)+z*Math.sin(angle),y,z:at.z-x*Math.sin(angle)+z*Math.cos(angle)};}
export function propertyLayout(space,houses=0){const hotel=houses===5,count=hotel?1:houses;return {buildings:Array.from({length:count},(_,n)=>({...propertyPoint(space,(n-(count-1)/2)*.32,-.68),hotel})),flag:{...propertyPoint(space,.50,.80),scale:.58},plaque:propertyPoint(space,0,.85,.19)};}

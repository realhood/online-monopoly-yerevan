import * as THREE from './three.module.js';
export const DIE_HALF=.337;
export const DICE_FLOOR=.343;
export const DICE_REST_Y=DICE_FLOOR+DIE_HALF;
export function faceQuaternion(value,index=0){
 const a={1:[0,0,0],6:[Math.PI,0,0],3:[0,0,Math.PI/2],4:[0,0,-Math.PI/2],2:[-Math.PI/2,0,0],5:[Math.PI/2,0,0]}[value]||[0,0,0];
 return new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0),index? .09:-.09).multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(...a)));
}
// A short toss with diminishing contacts. The floor support follows the cube's
// orientation, so corners meet the felt instead of passing through it.
export function diePose(progress,from,to,initial,value,index=0,reduced=false){
 const t=THREE.MathUtils.clamp((progress-index*.035)/(1-index*.035),0,1),final=faceQuaternion(value,index);
 if(t>=1||reduced)return {position:new THREE.Vector3(to.x,DICE_REST_Y,to.z),quaternion:final};
 const u=Math.min(1,t/.6),angle=(1-(1-u)**2)*Math.PI*2.1,axis=new THREE.Vector3(1,.2,index?-.45:.45).normalize(),q=initial.clone().multiply(new THREE.Quaternion().setFromAxisAngle(axis,angle));
 if(t>.6){const s=(t-.6)/.4;q.slerp(final,s*s*(3-2*s));}
 const travel=1-(1-t)**3,position=new THREE.Vector3().lerpVectors(from,to,travel);position.x+=Math.sin(Math.PI*t)*.035*(index?-1:1);
 let bounce=0;if(t<.42){const s=t/.42;bounce=.13*4*s*(1-s);}else if(t<.7)bounce=.04*Math.sin(Math.PI*(t-.42)/.28);else if(t<.88)bounce=.009*Math.sin(Math.PI*(t-.7)/.18);
 const e=new THREE.Matrix4().makeRotationFromQuaternion(q).elements;position.y=DICE_FLOOR+DIE_HALF*(Math.abs(e[1])+Math.abs(e[5])+Math.abs(e[9]))+bounce;
 return {position,quaternion:q};
}
export function flutterFlag(cloth,seconds,phase=0){
 const attribute=cloth.geometry.getAttribute('position'),rest=cloth.userData.restPositions,width=cloth.userData.clothWidth||.30;
 for(let i=0;i<attribute.count;i++){const x=rest[i*3],y=rest[i*3+1],u=THREE.MathUtils.clamp((x+width/2)/width,0,1),envelope=u*u;
  const wave=Math.sin(seconds*2.25-u*5.8+phase)+.28*Math.sin(seconds*3.4-u*10+phase*.7);
  attribute.setXYZ(i,x,y-.009*envelope+.0025*Math.sin(seconds*2.1-u*4+phase)*u,rest[i*3+2]+.018*wave*envelope);
 }
 attribute.needsUpdate=true;cloth.geometry.computeVertexNormals();
}

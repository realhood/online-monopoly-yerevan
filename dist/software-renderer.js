import * as THREE from './three.module.js';

// Three.js scene geometry can still be viewed in 3D when a browser has no WebGL.
// Native WebGL uses the same models, with PBR materials and shadow maps.
export class SoftwareRenderer {
 constructor(){this.isSoftwareRenderer=true;this.domElement=document.createElement('canvas');this.ctx=this.domElement.getContext('2d');this.shadowMap={};this.pixelRatio=1;this.width=1;this.height=1;this.cache=new WeakMap();this.light=new THREE.Vector3(-.45,.85,.5).normalize();}
 setClearColor(){}
 setPixelRatio(n){this.pixelRatio=Math.min(n,2);}
 setSize(w,h){this.width=w;this.height=h;this.domElement.width=Math.round(w*this.pixelRatio);this.domElement.height=Math.round(h*this.pixelRatio);this.ctx.setTransform(this.pixelRatio,0,0,this.pixelRatio,0,0);}
 render(scene,camera){
  const c=this.ctx,w=this.width,h=this.height;c.clearRect(0,0,w,h);scene.updateMatrixWorld(true);camera.updateMatrixWorld(true);const vp=new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse),faces=[],shadows=[];let surface=null;
  const project=v=>{const p=v.clone().applyMatrix4(vp);return {x:(p.x+1)*w/2,y:(1-p.y)*h/2,z:p.z};};
  scene.traverse(o=>{if(!o.visible)return;if(o.userData.softwareSurface){surface=o;return;}if(o.userData.skipSoftware)return;if(o.userData.softwareShadow){const s=o.userData.softwareShadow,p=new THREE.Vector3().setFromMatrixPosition(o.matrixWorld);shadows.push({p:project(p),r:s.w*w/35,d:s.d*h/45});}if(!o.isMesh||!o.geometry||o.material?.isShadowMaterial)return;
   let hidden=false;for(let a=o.parent;a;a=a.parent)if(!a.visible||a.userData.skipSoftware)hidden=true;if(hidden)return;
   const geo=o.geometry,attribute=geo.getAttribute('position');if(!attribute)return;let cached=this.cache.get(geo);if(!cached){cached={positions:attribute.array,indices:geo.index?.array};this.cache.set(geo,cached);}const {positions,indices}=cached;const vertices=[],world=[];
   for(let i=0;i<positions.length;i+=3){const v=new THREE.Vector3(positions[i],positions[i+1],positions[i+2]).applyMatrix4(o.matrixWorld);world.push(v);vertices.push(project(v));}
   const mats=Array.isArray(o.material)?o.material:[o.material];const count=indices?.length??world.length;for(let i=0;i<count;i+=3){const ia=indices?indices[i]:i,ib=indices?indices[i+1]:i+1,ic=indices?indices[i+2]:i+2;const a=vertices[ia],b=vertices[ib],d=vertices[ic];if(!a||!b||!d)continue;
    if((b.x-a.x)*(d.y-a.y)-(b.y-a.y)*(d.x-a.x)>0)continue;
    const group=geo.groups.find(g=>i>=g.start&&i<g.start+g.count),m=mats[group?.materialIndex||0]||mats[0];if(!m||m.visible===false||m.opacity===0)continue;
    const normal=new THREE.Vector3().subVectors(world[ib],world[ia]).cross(new THREE.Vector3().subVectors(world[ic],world[ia])).normalize();const shade=.55+Math.max(0,normal.dot(this.light))*.5;const col=(m.color||new THREE.Color('#ddd')).clone().multiplyScalar(shade);faces.push({a,b,d,above:Math.max(world[ia].y,world[ib].y,world[ic].y)>.095,z:(a.z+b.z+d.z)/3,color:col.getStyle(THREE.SRGBColorSpace),alpha:m.transparent?m.opacity:1});
   }
  });
  faces.sort((a,b)=>b.z-a.z);
  // Board bodies first; models are sorted by depth against the printed board plane.
  let boardZ=0;if(surface){const p=project(new THREE.Vector3(0,.09,0));boardZ=p.z;}
  const paint=f=>{c.globalAlpha=f.alpha;c.fillStyle=f.color;c.beginPath();c.moveTo(f.a.x,f.a.y);c.lineTo(f.b.x,f.b.y);c.lineTo(f.d.x,f.d.y);c.closePath();c.fill();};
  const under=faces.filter(f=>!f.above),over=faces.filter(f=>f.above);under.forEach(paint);c.globalAlpha=1;
  if(surface){const image=surface.material.map.image;const p=project(new THREE.Vector3(-8.3,.09,-8.3)),px=project(new THREE.Vector3(8.3,.09,-8.3)),py=project(new THREE.Vector3(-8.3,.09,8.3));c.save();c.transform((px.x-p.x)/image.width,(px.y-p.y)/image.width,(py.x-p.x)/image.height,(py.y-p.y)/image.height,p.x,p.y);c.drawImage(image,0,0);c.restore();}
  c.save();c.fillStyle='#0a241b28';c.filter='blur(3px)';shadows.forEach(s=>{c.beginPath();c.ellipse(s.p.x+2,s.p.y+3,Math.max(2,s.r),Math.max(1,s.d),0,0,Math.PI*2);c.fill();});c.restore();over.forEach(paint);c.globalAlpha=1;
 }
}

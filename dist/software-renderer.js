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
  if(surface){const original=surface.material.map.image,extent=Math.max(...[[-8.3,-8.3],[8.3,-8.3],[-8.3,8.3],[8.3,8.3]].map(([x,z])=>project(new THREE.Vector3(x,.09,z))).flatMap(p=>[Math.abs(p.x-w/2)*2,Math.abs(p.y-h/2)*2])),size=Math.min(4096,2**Math.ceil(Math.log2(Math.max(512,extent))));if(this.printSource!==original||this.printSize!==size){this.printSource=original;this.printSize=size;this.printImage=document.createElement('canvas');this.printImage.width=this.printImage.height=size;const pc=this.printImage.getContext('2d');pc.imageSmoothingQuality='high';pc.drawImage(original,0,0,size,size);}const image=this.printImage,N=12;c.imageSmoothingQuality='high';
   const triangle=(src,dst)=>{const [a,b,d]=src,[p,q,r]=dst;const det=(b.x-a.x)*(d.y-a.y)-(d.x-a.x)*(b.y-a.y);const aa=((q.x-p.x)*(d.y-a.y)-(r.x-p.x)*(b.y-a.y))/det,cc=((r.x-p.x)*(b.x-a.x)-(q.x-p.x)*(d.x-a.x))/det,bb=((q.y-p.y)*(d.y-a.y)-(r.y-p.y)*(b.y-a.y))/det,dd=((r.y-p.y)*(b.x-a.x)-(q.y-p.y)*(d.x-a.x))/det;c.save();const cx=(p.x+q.x+r.x)/3,cy=(p.y+q.y+r.y)/3,expand=v=>{const dx=v.x-cx,dy=v.y-cy,l=Math.hypot(dx,dy);return {x:v.x+dx/l*.8,y:v.y+dy/l*.8};},ep=expand(p),eq=expand(q),er=expand(r);c.beginPath();c.moveTo(ep.x,ep.y);c.lineTo(eq.x,eq.y);c.lineTo(er.x,er.y);c.closePath();c.clip();c.transform(aa,bb,cc,dd,p.x-aa*a.x-cc*a.y,p.y-bb*a.x-dd*a.y);c.drawImage(image,0,0);c.restore();};
   for(let y=0;y<N;y++)for(let x=0;x<N;x++){const uv=[[x/N,y/N],[(x+1)/N,y/N],[(x+1)/N,(y+1)/N],[x/N,(y+1)/N]],src=uv.map(([u,v])=>({x:u*image.width,y:v*image.height})),dst=uv.map(([u,v])=>project(new THREE.Vector3(u*16.6-8.3,.09,v*16.6-8.3)));triangle([src[0],src[1],src[2]],[dst[0],dst[1],dst[2]]);triangle([src[0],src[2],src[3]],[dst[0],dst[2],dst[3]]);}
  }
  c.save();c.fillStyle='#0a241b28';c.filter='blur(3px)';shadows.forEach(s=>{c.beginPath();c.ellipse(s.p.x+2,s.p.y+3,Math.max(2,s.r),Math.max(1,s.d),0,0,Math.PI*2);c.fill();});c.restore();over.forEach(paint);c.globalAlpha=1;
 }
}

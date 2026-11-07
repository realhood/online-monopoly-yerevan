import * as THREE from './three.module.js';

export function finishMaterial(color,metalness=0,roughness=.55){return new THREE.MeshStandardMaterial({color,metalness,roughness});}
export function roundedBlock(w,h,d,material,r=.04){
 const radius=Math.min(r,w*.2,d*.2,h*.3);w-=radius*1.1;d-=radius*1.1;const x=-w/2,z=-d/2,shape=new THREE.Shape();
 shape.moveTo(x+radius,z);shape.lineTo(x+w-radius,z);shape.quadraticCurveTo(x+w,z,x+w,z+radius);shape.lineTo(x+w,z+d-radius);shape.quadraticCurveTo(x+w,z+d,x+w-radius,z+d);shape.lineTo(x+radius,z+d);shape.quadraticCurveTo(x,z+d,x,z+d-radius);shape.lineTo(x,z+radius);shape.quadraticCurveTo(x,z,x+radius,z);
 const geometry=new THREE.ExtrudeGeometry(shape,{depth:Math.max(.005,h-radius*2),bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:radius*.55,bevelThickness:radius,curveSegments:4});geometry.rotateX(-Math.PI/2);geometry.translate(0,-h/2+radius,0);
 const mesh=new THREE.Mesh(geometry,material);mesh.castShadow=true;mesh.receiveShadow=true;return mesh;
}
function part(g,w,h,d,m,x,y,z,r=.02){const o=roundedBlock(w,h,d,m,r);o.position.set(x,y,z);g.add(o);return o;}
export function createApartment(ownerColor,hotel=false){
 const g=new THREE.Group(),stone=finishMaterial(hotel?'#dcb79a':'#d4a58d'),trim=finishMaterial('#f3ddbb'),glass=finishMaterial('#294d54',.28,.18),accent=finishMaterial(ownerColor,.25,.35),brass=finishMaterial('#c9a968',.7,.28);
 const w=hotel?.56:.28,d=hotel?.4:.27,h=hotel?.87:.35;part(g,w+.08,.055,d+.08,trim,0,.027,0);part(g,w,h,d,stone,0,h/2+.05,0);part(g,w+.05,.045,d+.04,trim,0,h+.055,0);part(g,w+.025,.04,d+.015,accent,0,h-.015,0);
 const floors=hotel?4:2,cols=hotel?3:2;for(let floor=0;floor<floors;floor++)for(let col=0;col<cols;col++){
  const x=(col-(cols-1)/2)*(w/(cols+.5)),y=.13+floor*((h-.1)/floors);part(g,w/(cols*2.5),hotel?.09:.065,.018,glass,x,y,d/2+.008,.003);part(g,w/(cols*2.5)+.015,.012,.026,trim,x,y-.048,d/2+.018,.003);
 }
 part(g,hotel?.11:.065,.12,.02,glass,0,.11,d/2+.015,.003);part(g,w*.7,.03,d*.4,stone,0,h+.092,-d*.1);part(g,.025,hotel?.2:.11,.025,brass,w*.3,h+.14,-d*.3,.005);
 g.userData.softwareShadow={w:w+.12,d:d+.12};g.userData.buildingType=hotel?'hotel':'house';return g;
}
export function createOwnershipFlag(color){
 const g=new THREE.Group(),gold=finishMaterial('#dfc18a',.7,.25),m=finishMaterial(color,.15,.38),base=finishMaterial('#f0ddad');
 part(g,.34,.035,.2,base,0,.018,0);part(g,.28,.025,.15,m,0,.048,0);const pole=new THREE.Mesh(new THREE.CylinderGeometry(.012,.016,.42,8),gold);pole.position.set(-.12,.25,0);g.add(pole);const cloth=part(g,.27,.17,.022,m,.015,.36,0,.01);cloth.userData.flagCloth=true;cloth.userData.dynamic=true;cloth.userData.restPositions=cloth.geometry.getAttribute('position').array.slice();part(g,.025,.11,.025,gold,.105,.36,.018,.003);
 g.userData.softwareShadow={w:.35,d:.2};return g;
}
export function createLuxuryDie(){
 const g=new THREE.Group(),body=new THREE.MeshPhysicalMaterial({color:'#fff4dc',metalness:.04,roughness:.18,clearcoat:.85,clearcoatRoughness:.12}),pip=finishMaterial('#214237',.2,.36);const cube=roundedBlock(.55,.55,.55,body,.055);g.add(cube);
 const coords={1:[[0,0]],2:[[-1,-1],[1,1]],3:[[-1,-1],[0,0],[1,1]],4:[[-1,-1],[1,-1],[-1,1],[1,1]],5:[[-1,-1],[1,-1],[0,0],[-1,1],[1,1]],6:[[-1,-1],[1,-1],[-1,0],[1,0],[-1,1],[1,1]]};
 for(const [normal,n] of [[[0,1,0],1],[[0,-1,0],6],[[1,0,0],3],[[-1,0,0],4],[[0,0,1],2],[[0,0,-1],5]])for(const [a,b] of coords[n]){
  const sphere=new THREE.Mesh(new THREE.SphereGeometry(.036,8,6),pip),u=a*.145,v=b*.145;const [x,y,z]=normal;sphere.position.set(x*.277+(y||z?u:0),y*.277+(x||z?v:0),z*.277+(x||y?(y?v:u):0));sphere.scale.set(x?.22:1,y?.22:1,z?.22:1);g.add(sphere);
 }
 g.userData.softwareShadow={w:.65,d:.65};return g;
}
export function createCityLandmarks(){
 const g=new THREE.Group(),tuff=finishMaterial('#c9957e'),cream=finishMaterial('#e4c4a1'),roof=finishMaterial('#a97462'),glass=finishMaterial('#4a6667',.2,.2),bronze=finishMaterial('#bfa26e',.6,.28),leaf=finishMaterial('#63866c');
 // The Opera: curved tuff facade, colonnade, cornices and a layered roof.
 const opera=new THREE.Group();opera.position.set(0,.1,-3.2);for(const [r,h,y,m] of [[1.48,.12,.06,cream],[1.34,.52,.38,tuff],[1.42,.07,.68,cream],[1.23,.13,.78,roof],[1.08,.08,.89,cream]]){const o=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,48),m);o.scale.z=.55;o.position.y=y;o.castShadow=true;opera.add(o);}
 for(let j=0;j<19;j++){const a=j/18*Math.PI,x=Math.cos(a)*1.35,z=Math.sin(a)*.74;const col=new THREE.Mesh(new THREE.CylinderGeometry(.035,.05,.48,8),cream);col.position.set(x,.4,z);opera.add(col);if(j<18){const arch=part(opera,.11,.25,.025,glass,Math.cos(a+.08)*1.31,.37,Math.sin(a+.08)*.73,.025);arch.rotation.y=-a;}}
 g.add(opera);
 // Cascade terraces, balustrades, garden strips and sculpture plinths.
 const cascade=new THREE.Group();cascade.position.set(-3.55,.1,-3.2);for(let j=0;j<7;j++){const w=1.9-j*.13,z=-j*.17,y=j*.1;part(cascade,w,.1,1.35-j*.13,cream,0,y,z);for(const side of [-1,1]){part(cascade,.09,.11,1.3-j*.13,tuff,side*(w/2-.08),y+.1,z);}}
 for(const x of [-.75,.75]){part(cascade,.25,.2,.25,tuff,x,.15,.9);const sculpture=new THREE.Mesh(new THREE.SphereGeometry(.12,12,8),bronze);sculpture.position.set(x,.38,.9);cascade.add(sculpture);}g.add(cascade);
 // A miniature row of Yerevan's pink-tuff buildings.
 for(let i=0;i<4;i++){const b=new THREE.Group(),h=.55+(i%3)*.17;b.position.set(2.5+i*.6,.1,-3.3);part(b,.51,h,.7,i%2?cream:tuff,0,h/2,0);part(b,.57,.07,.77,roof,0,h+.02,0);for(let floor=0;floor<3;floor++)for(let col=0;col<3;col++)part(b,.065,.085,.018,glass,-.15+col*.15,.12+floor*.16,.36,.005);part(b,.57,.04,.78,cream,0,.04,0);g.add(b);}
 // A low-poly Ararat ridge with separate snow geometry.
 for(const [x,z,r,h] of [[-.6,-4.75,1.25,1.65],[1.15,-4.7,.77,.96]]){const mount=new THREE.Mesh(new THREE.ConeGeometry(r,h,7),finishMaterial('#829f94'));mount.position.set(x,h/2+.09,z);mount.rotation.y=.18;g.add(mount);const snow=new THREE.Mesh(new THREE.ConeGeometry(r*.28,h*.28,7),finishMaterial('#f0eee0'));snow.position.set(x,h*.86+.09,z);snow.rotation.y=.18;g.add(snow);}
 for(const [x,z] of [[-4.8,-4.4],[-4.8,-1.8],[4.8,-4.3],[4.9,-1.9]]){const tr=new THREE.Mesh(new THREE.CylinderGeometry(.03,.04,.3,7),roof);tr.position.set(x,.25,z);g.add(tr);const top=new THREE.Mesh(new THREE.IcosahedronGeometry(.23,1),leaf);top.position.set(x,.54,z);top.castShadow=true;g.add(top);}
 return g;
}

export function createArcaneDiceTray(){
 const g=new THREE.Group(),frame=finishMaterial('#8a7350',.75,.24),velvet=finishMaterial('#203f3a',.05,.9),stone=finishMaterial('#c5a58a',.12,.42);
 part(g,4.55,.16,2.45,stone,0,.08,0,.06);part(g,4.28,.08,2.18,frame,0,.18,0,.04);part(g,4.04,.035,1.94,velvet,0,.235,0,.05);
 for(const x of [-2.13,2.13])part(g,.11,.23,2.2,frame,x,.29,0,.035);for(const z of [-1.05,1.05])part(g,4.3,.23,.11,frame,0,.29,z,.035);
 const glow=new THREE.MeshStandardMaterial({color:'#79ccb8',emissive:'#41bba1',emissiveIntensity:.5,metalness:.4,roughness:.25});
 for(const x of [-.76,.76]){const ring=new THREE.Mesh(new THREE.TorusGeometry(.58,.014,6,48),glow);ring.rotation.x=-Math.PI/2;ring.position.set(x,.263,0);g.add(ring);}
 for(let i=0;i<12;i++){const a=i/12*Math.PI*2,gem=new THREE.Mesh(new THREE.OctahedronGeometry(.055),i%2?frame:glow);gem.position.set(Math.cos(a)*1.83,.31,Math.sin(a)*.82);g.add(gem);}
 g.children.forEach((part,i)=>{part.userData.softwareOrder=i<3?i+1:i<7?4:5;});g.userData.softwareShadow={w:2.4,d:1.1};return g;
}

export function orientToBoardSide(object,space){object.rotation.y=-Math.floor(space/10)*Math.PI/2;return object;}

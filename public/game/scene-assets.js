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
 const g=new THREE.Group(),stone=finishMaterial(hotel?'#c79983':'#d6b49c',0,.83),cream=finishMaterial('#eee0c6',0,.76),darkStone=finishMaterial('#8b7364',0,.9),glass=finishMaterial('#24454b',.18,.21),accent=finishMaterial(ownerColor,.15,.5),brass=finishMaterial('#b59b61',.65,.32),leaf=finishMaterial('#647e69',0,.94);
 const w=hotel?.60:.25,d=hotel?.38:.29,h=hotel?.64:.32;
 part(g,w+.055,.035,d+.075,darkStone,0,.018,0,.008);part(g,w+.035,.025,d+.055,cream,0,.047,0,.008);
 part(g,w,h,d,stone,0,h/2+.06,0,.01);
 const floors=hotel?3:2,cols=hotel?4:2,windowW=hotel?.065:.047,windowH=hotel?.10:.064;
 for(let f=0;f<floors;f++){const y=.18+f*(hotel?.17:.125);for(let c=0;c<cols;c++){const x=(c-(cols-1)/2)*(w/(cols+.55));part(g,windowW+.012,windowH+.014,.012,cream,x,y,d/2+.006,.002);part(g,windowW,windowH,.014,glass,x,y+.003,d/2+.014,.002);part(g,windowW+.022,.012,.035,cream,x,y-windowH/2-.014,d/2+.018,.002);}
  for(const side of [-1,1])for(let c=0;c<2;c++){const sideWindow=part(g,.014,windowH,.05,glass,side*(w/2+.005),y,-.055+c*.115,.002);sideWindow.userData.window=true;}
 }
 // A recessed entrance, projecting canopy and slim balcony cornices.
 part(g,hotel?.13:.06,.13,.015,glass,0,.125,d/2+.01,.002);part(g,hotel?.23:.14,.018,.065,accent,0,.208,d/2+.019,.003);
 part(g,w+.025,.027,d+.03,cream,0,h+.064,0,.006);part(g,w*.78,.065,d*.74,stone,0,h+.103,-d*.055,.006);part(g,w*.84,.018,d*.80,cream,0,h+.143,-d*.055,.004);
 if(hotel){
  for(const x of [-.25,.25])part(g,.022,h+.03,.024,cream,x,h/2+.07,d/2+.02,.002);
  for(const x of [-.085,.085])part(g,.01,.115,.01,brass,x,.132,d/2+.046,.002);
  part(g,.21,.015,.055,cream,0,.335,d/2+.025,.003);part(g,.21,.015,.055,cream,0,.486,d/2+.025,.003);
  // A small architectural H monogram and planted roof terraces.
  for(const x of [-.018,.018])part(g,.008,.047,.006,brass,x,h+.10,d*.38,.001);part(g,.036,.008,.006,brass,0,h+.10,d*.38,.001);
  for(const x of [-.24,.24]){part(g,.055,.025,.15,darkStone,x,h+.087,0,.004);part(g,.047,.025,.13,leaf,x,h+.11,0,.006);}
 }else{part(g,.016,.16,.02,accent,-w/2+.018,.16,d/2+.012,.002);part(g,.07,.02,.07,leaf,w*.21,h+.165,-d*.14,.005);}
 g.userData.softwareShadow={w:w+.06,d:d+.09};g.userData.buildingType=hotel?'hotel':'house';g.userData.architecture=hotel?'tuff-boutique-hotel':'terraced-tuff-apartment';return g;
}
export function createOwnershipFlag(color){
 const g=new THREE.Group(),gold=finishMaterial('#dfc18a',.7,.25),m=finishMaterial(color,.15,.38),base=finishMaterial('#f0ddad');
 part(g,.34,.035,.2,base,0,.018,0);part(g,.28,.025,.15,m,0,.048,0);const pole=new THREE.Mesh(new THREE.CylinderGeometry(.012,.016,.42,8),gold);pole.position.set(-.12,.25,0);g.add(pole);const cloth=new THREE.Mesh(new THREE.PlaneGeometry(.30,.19,12,6),new THREE.MeshStandardMaterial({color,roughness:.9,side:THREE.DoubleSide}));cloth.position.set(.03,.355,.006);cloth.castShadow=true;cloth.receiveShadow=true;cloth.userData.flagCloth=true;cloth.userData.dynamic=true;cloth.userData.clothWidth=.30;cloth.userData.restPositions=cloth.geometry.getAttribute('position').array.slice();g.add(cloth);
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
 // A continuous terrain surface: the irregular snow line shares its vertices
 // with the volcanic slopes, rather than sitting on a second cone.
 for(const [x,z,r,h,seed] of [[-.6,-4.75,1.25,1.65,.3],[1.15,-4.7,.77,.96,2.1]]){const mount=createAraratPeak(r,h,seed);mount.position.set(x,.09,z);mount.rotation.y=.18;g.add(mount);}
 for(const [x,z] of [[-4.8,-4.4],[-4.8,-1.8],[4.8,-4.3],[4.9,-1.9]]){const tr=new THREE.Mesh(new THREE.CylinderGeometry(.03,.04,.3,7),roof);tr.position.set(x,.25,z);g.add(tr);const top=new THREE.Mesh(new THREE.IcosahedronGeometry(.23,1),leaf);top.position.set(x,.54,z);top.castShadow=true;g.add(top);}
 return g;
}

export function createDiceTray(){
 const g=new THREE.Group(),frame=finishMaterial('#9a835c',.65,.38),felt=finishMaterial('#29433d',0,.98),stone=finishMaterial('#b99c83',.04,.6);
 part(g,4.55,.16,2.45,stone,0,.08,0,.06);part(g,4.28,.05,2.18,frame,0,.18,0,.035);part(g,4.04,.035,1.94,felt,0,.235,0,.05);
 for(const x of [-2.13,2.13])part(g,.10,.15,2.2,frame,x,.26,0,.025);for(const z of [-1.05,1.05])part(g,4.3,.15,.10,frame,0,.26,z,.025);
 g.children.forEach((part,i)=>{part.userData.softwareOrder=i<3?i+1:4;});g.userData.softwareShadow={w:2.4,d:1.1};return g;
}

export function orientToBoardSide(object,space){object.rotation.y=-Math.floor(space/10)*Math.PI/2;return object;}

export function createAraratPeak(radius=1.25,height=1.65,seed=.3){
 const sectors=40,levels=[0,.13,.28,.42,.56,.68,.81,.92],positions=[],indices=[],geometry=new THREE.BufferGeometry(),materials=['#919c91','#87958d','#9ea598','#d8e3e1','#eaf0ec','#faf9f1'].map(c=>finishMaterial(c,0,.96));
 for(let ring=0;ring<levels.length;ring++)for(let j=0;j<sectors;j++){const a=j/sectors*Math.PI*2,base=levels[ring],snowLine=.56+.065*Math.sin(a*5+seed)+.028*Math.cos(a*9-seed),t=ring===4?snowLine:base,relief=1+.10*Math.sin(a*5+seed)*Math.sin(Math.PI*t)+.045*Math.cos(a*11-seed),r=radius*Math.pow(1-t,.84)*relief*(1+.035*Math.sin(a*3+seed)),shiftX=radius*.12*t,shiftZ=-radius*.07*t;positions.push(Math.cos(a)*r+shiftX,height*t,Math.sin(a)*r+shiftZ);}
 const tip=positions.length/3;positions.push(radius*.12,height,-radius*.07);
 function triangle(a,b,c,material){const start=indices.length;indices.push(a,b,c);geometry.addGroup(start,3,material);}
 for(let ring=0;ring<levels.length-1;ring++)for(let j=0;j<sectors;j++){const next=(j+1)%sectors,a=ring*sectors+j,b=ring*sectors+next,c=(ring+1)*sectors+j,d=(ring+1)*sectors+next,shade=(Math.floor(j/4)+ring)%3,m=ring>=4?3+shade:shade;triangle(a,c,b,m);triangle(b,c,d,m);}
 for(let j=0;j<sectors;j++)triangle((levels.length-1)*sectors+j,tip,(levels.length-1)*sectors+(j+1)%sectors,3+j%3);
 geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geometry.setIndex(indices);geometry.computeVertexNormals();geometry.computeBoundingSphere();const mesh=new THREE.Mesh(geometry,materials);mesh.castShadow=true;mesh.receiveShadow=true;mesh.userData.araratPeak=true;mesh.userData.snowBoundary={start:4*sectors,count:sectors};return mesh;
}

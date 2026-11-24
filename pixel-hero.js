import * as THREE from './vendor/three/build/three.module.js';
const root=document.querySelector('#quest'), stage=document.querySelector('.quest-stage'), canvas=document.querySelector('#quest-canvas');
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const smooth=t=>{t=clamp(t);return t*t*(3-2*t)};
const ranks=['小白','初级工程师','中级工程师','高级工程师','卓越工程师'];
const titles=[['每个工程师，','都曾是<em>小白。</em>'],['带着好奇，','迈出<em>第一步。</em>'],['从理解原理，','到<em>亲手实现。</em>'],['把复杂问题，','拆成<em>新的可能。</em>'],['从工程实践，','走向<em>创新创业。</em>']];
const desc=['凡有所学，皆成性格。<br>与你一同走过成为卓越工程师的路。','从第一块电路开始。<br>在电路设计、编程与单片机实践中建立基础。','让技术读懂生命信号。<br>从医学电子学到多参数监护系统。','把想法变成可以验证的设计。<br>走完研发，承担团队责任。','让医工创新走向真实世界。<br>在工程实践中探索创新，持续成长。'];
const equipment=['主动学习 · 问题发现','电路设计 · 编程基础','信号处理 · 系统开发','产品研发 · 团队协作','创新决策 · 创业管理'];
const heading=document.querySelector('#quest-title'), description=document.querySelector('#quest-desc'), name=document.querySelector('#quest-rank'), eq=document.querySelector('#quest-equipment'), xp=document.querySelector('#quest-xp'), number=document.querySelector('#quest-level'), prog=document.querySelector('#quest-progress');
let renderer;
try{renderer=new THREE.WebGLRenderer({canvas,antialias:false,powerPreference:'high-performance'});}catch(e){document.querySelector('.quest-fallback').hidden=false;throw e;}
renderer.setPixelRatio(1);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.setClearColor(0xeef0fc);renderer.shadowMap.enabled=false;
const scene=new THREE.Scene();scene.fog=new THREE.FogExp2(0xeef0fc,.009);
const camera=new THREE.OrthographicCamera(-20,20,12,-12,.1,170);
scene.add(new THREE.HemisphereLight(0xffffff,0xcbd0ef,1.8));const sun=new THREE.DirectionalLight(0xfff5df,2.2);sun.position.set(-5,15,12);scene.add(sun);
const point=new THREE.PointLight(0xaaa2ef,35,14);point.position.set(-8,3,2);scene.add(point);
const materials=new Map();const mat=(c,em=false)=>{const k=c+':'+em;if(!materials.has(k))materials.set(k,new THREE.MeshLambertMaterial({color:c,...(em?{emissive:c,emissiveIntensity:.65}:{})}));return materials.get(k)};
const boxGeo=new THREE.BoxGeometry(1,1,1);
function box(w,h,d,c,x=0,y=0,z=0,parent=scene,em=false){const m=new THREE.Mesh(boxGeo,mat(c,em));m.scale.set(w,h,d);m.position.set(x,y,z);parent.add(m);return m;}
let seed=3874;function rnd(){seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;}
const nodes=Array.from({length:5},(_,i)=>new THREE.Vector3(-8+i*4,i*1.45,-i*1.5));
const platforms=[],runes=[];
for(let i=0;i<5;i++){
 const g=new THREE.Group();scene.add(g);const pos=nodes[i];g.position.copy(pos);platforms.push(g);
 box(3.65,.5,3.5,'#dfd9c7',0,-.25,0,g);box(3.8,.16,3.65,'#fff6df',0,.03,0,g);
 for(let x=0;x<5;x++)for(let z=0;z<5;z++)box(.69,.035,.67,(x+z)%3===0?'#e5e3d5':'#f8f3e5',-1.44+x*.72,.125,-1.4+z*.7,g);
 box(3.75,.10,.11,'#d5b56c',0,.19,1.78,g);box(.1,.1,3.6,'#9ba9dd',-1.84,.19,0,g);
 for(let j=0;j<14;j++){const x=(rnd()-.5)*2.9,z=(rnd()-.5)*2.8,dy=.6+rnd()*1.9;box(.6+rnd()*.7,dy,.5+rnd()*.6,j%2?'#d9dfdf':'#e5e9e6',x,-dy/2-.35,z,g);}
 for(let j=0;j<7;j++){const q=new THREE.Group();q.position.set((rnd()-.5)*3.3,.2,(rnd()-.5)*3.3);g.add(q);box(.09,.16+rnd()*.2,.08,'#bdac70',0,.1,0,q);box(.2,.08,.08,'#b9afe3',.05,.16,0,q);}
 const p=new THREE.Group();p.position.set(-1.28,.2,-1.1);g.add(p);box(.28,1.45,.28,'#e0dfd3',0,.72,0,p);box(.48,.16,.48,'#d7bb77',0,1.46,0,p);const r=box(.28,.38,.28,i===4?'#f4d28a':'#aaa2ef',0,1.7,0,p,true);runes.push(r);
 if(i<4){for(let j=1;j<=5;j++){const f=j/6;const next=nodes[i+1];box(.52,.18,.95,j%2?'#e4d4ab':'#f5ecd6',THREE.MathUtils.lerp(pos.x,next.x,f),THREE.MathUtils.lerp(pos.y,next.y,f)-.08,THREE.MathUtils.lerp(pos.z,next.z,f));}}
}
// The final laboratory bench is built from blocks, not a remote model.
const lab=new THREE.Group();lab.position.set(8.3,6.05,-7);scene.add(lab);
box(1.6,.15,.65,'#e0e1f1',0,1.02,0,lab);box(.12,1,.12,'#777b9e',-.62,.5,0,lab);box(.12,1,.12,'#777b9e',.62,.5,0,lab);
box(.55,.37,.08,'#263c43',-.27,1.3,0,lab);box(.45,.25,.025,'#a5b5ef',-.27,1.31,.05,lab,true);box(.24,.3,.21,'#d4cef0',.5,1.28,0,lab);box(.25,.12,.23,'#9387d4',.5,1.2,0,lab,true);
// Small suspended stone debris gives the ascent genuine depth.
const debris=[];for(let i=0;i<95;i++){const m=box(.1+rnd()*.34,.1+rnd()*.35,.1+rnd()*.3,i%4===0?'#d4c18d':'#dae5e9',(rnd()-.5)*37,-3+rnd()*13,(rnd()-.5)*22-4);m.rotation.set(rnd(),rnd(),rnd());debris.push({mesh:m,y:m.position.y,phase:rnd()*6});}
// Star field, rendered as hard square points.
const starGeo=new THREE.BufferGeometry(), starData=[];for(let i=0;i<240;i++)starData.push((rnd()-.5)*100,(rnd()-.2)*45,-18-rnd()*40);starGeo.setAttribute('position',new THREE.Float32BufferAttribute(starData,3));scene.add(new THREE.Points(starGeo,new THREE.PointsMaterial({color:0xffffff,size:.065,transparent:true,opacity:.6})));
// Pixel vortex: four broken spiral arms, stepped cubes and a dark centre.
const portal=new THREE.Group();portal.position.set(-8,1.5,-.8);scene.add(portal);
box(1.5,2.5,.05,'#fff4ce',0,0,-.1,portal);
const portalBits=[];for(let a=0;a<4;a++)for(let j=0;j<22;j++){const t=j/21,ang=a*Math.PI/2+t*4.5,r=.26+t*1.32;const m=box(.14+.07*t,.14+.07*t,.12,j%3===0?'#f2d995':j%2?'#a9bdf4':'#8b70cc',Math.cos(ang)*r,Math.sin(ang)*r*1.14,0,portal,true);portalBits.push({m,a:ang,r});}
const portalFrame=new THREE.Group();portal.add(portalFrame);for(let i=0;i<10;i++){const a=i/10*Math.PI*2;box(.22,.22,.22,'#a09bc8',Math.cos(a)*1.7,Math.sin(a)*1.95,-.1,portalFrame);}
// Airy voxel cloud banks, kept behind the ascending stone path.
const cloudMat=new THREE.MeshLambertMaterial({color:0xffffff,transparent:true,opacity:.76,depthWrite:false});
const flowingClouds=[];
for(let i=0;i<22;i++){const group=new THREE.Group();group.position.set((rnd()-.5)*65,-4+rnd()*7,-12-rnd()*16);flowingClouds.push({group,x:group.position.x,y:group.position.y,z:group.position.z,phase:rnd()*Math.PI*2,speed:.35+rnd()*.45});scene.add(group);for(let j=0;j<6;j++){const m=new THREE.Mesh(boxGeo,cloudMat);m.scale.set(2+rnd()*4,.35+rnd()*.6,1+rnd()*2);m.position.set(j*1.2,Math.sin(j)*.5,rnd()*2);group.add(m);}}
// Original voxel student sprite: every coloured pixel becomes a small 3D block.
function sprite(rank,frame=0){const c=document.createElement('canvas');c.width=20;c.height=30;const g=c.getContext('2d');g.imageSmoothingEnabled=false;const rect=(x,y,w,h,col)=>{g.fillStyle=col;g.fillRect(x,y,w,h)};
 const ink='#162c36',hair='#28333a',skin='#edc79f',shade='#cca178',pants=rank>2?'#40566a':'#284b66',coat=rank>1?'#e8eee5':rank===1?'#7d83b6':'#97bfc7';
 // dark silhouette and backpack
 rect(3,13,14,11,ink);rect(2,14,4,8,rank===0?'#c39b65':'#777ba6');rect(2,15,2,5,'#8a704f');
 rect(6,23,3,5,pants);rect(11,23,3,5,pants);rect(5,27,5,2,ink);rect(11,27,5,2,ink);
 if(frame){g.clearRect(5,27,5,2);rect(5,26,5,2,ink);}
 rect(5,13,10,11,coat);rect(6,15,2,8,rank===0?'#e4eee5':'#d2dfd4');rect(9,14,3,10,rank>1?'#bed1cb':'#325d74');
 rect(4,15,2,7,coat);rect(14,15,2,7,coat);rect(4,21,2,3,skin);rect(14,21,2,3,skin);
 rect(6,3,9,10,ink);rect(5,4,11,7,hair);rect(6,6,9,6,skin);rect(6,10,1,2,shade);rect(8,11,5,2,skin);
 rect(5,3,10,3,hair);rect(6,2,8,2,hair);rect(5,6,2,3,hair);rect(13,5,2,2,hair);rect(8,8,1,2,ink);rect(12,8,1,2,ink);rect(10,11,2,1,'#bd8069');
 if(rank===0){rect(5,14,1,8,'#805e41');rect(14,14,1,8,'#805e41');rect(9,14,2,2,'#eeeee0');}
 if(rank>=1){rect(6,18,2,2,'#c6c4ef');rect(11,18,3,2,'#557779');rect(9,14,1,2,'#efc577');}
 if(rank>=2 && rank<4){rect(6,7,8,3,'#afbcf0');rect(7,8,2,1,'#d3f6eb');rect(11,8,2,1,'#d3f6eb');rect(9,7,1,3,ink);rect(8,15,1,9,'#adc6bf');rect(12,15,1,9,'#f8fff0');}
 if(rank>=3){rect(5,22,4,4,'#e8eee5');rect(11,22,4,4,'#e8eee5');rect(15,18,4,6,'#253b43');rect(16,19,2,4,'#bcd4ba');rect(16,20,2,1,'#8c78b2');}
 if(rank===4){
  // Final outfit: tailored navy suit, white shirt, tie and briefcase.
  g.clearRect(0,13,20,17);
  rect(6,23,3,5,'#243345');rect(11,23,3,5,'#243345');
  rect(5,27,5,2,'#101b28');rect(11,27,5,2,'#101b28');
  rect(5,13,10,11,'#283d54');rect(4,15,2,7,'#283d54');rect(14,15,2,7,'#283d54');
  rect(5,14,2,8,'#354d66');rect(13,14,2,8,'#1d2e43');
  rect(8,13,5,3,'#f3f1df');rect(9,16,3,4,'#e1e6de');
  rect(8,15,1,3,'#8194a0');rect(12,15,1,3,'#8194a0');
  rect(10,14,1,2,'#bfa05d');rect(10,16,1,5,'#c6a35d');rect(9,19,2,2,'#c6a35d');
  rect(9,22,1,1,'#b6c3c4');rect(6,16,1,2,'#efd58b');
  rect(4,21,2,2,'#f1f0df');rect(14,21,2,2,'#f1f0df');
  rect(4,22,2,2,skin);rect(14,22,2,2,skin);
  rect(15,23,3,1,'#c3a16a');rect(15,22,1,2,'#b89561');rect(17,22,1,2,'#b89561');
  rect(14,24,6,4,'#543e31');rect(15,24,4,1,'#8c6d48');rect(16,25,1,2,'#e0bd75');
  rect(6,2,8,2,'#28333a');rect(7,2,5,1,'#58606a');
 }
 const data=g.getImageData(0,0,20,30).data;const group=new THREE.Group();const bins=new Map();for(let y=0;y<30;y++)for(let x=0;x<20;x++){const n=(y*20+x)*4;if(data[n+3]<100)continue;const color=(data[n]<<16)|(data[n+1]<<8)|data[n+2];if(!bins.has(color))bins.set(color,[]);bins.get(color).push([x,y]);}
 const dummy=new THREE.Object3D();for(const [color,pixels] of bins){const m=new THREE.InstancedMesh(boxGeo,mat(color),pixels.length);pixels.forEach(([x,y],i)=>{dummy.position.set((x-10)*.105,(29-y)*.105,0);dummy.scale.set(.105,.105,.32);dummy.updateMatrix();m.setMatrixAt(i,dummy.matrix)});group.add(m);}return group;
}
const hero=new THREE.Group();scene.add(hero);const outfits=[];for(let i=0;i<5;i++){const model=sprite(i);model.visible=i===0;hero.add(model);outfits.push(model);}
const shadow=new THREE.Mesh(new THREE.CircleGeometry(.65,12),new THREE.MeshBasicMaterial({color:0x071c23,transparent:true,opacity:.45,depthWrite:false}));shadow.rotation.x=-Math.PI/2;scene.add(shadow);
// Transform particles are tied to scroll progress, so rewinding also rewinds the effect.
const sparks=[];for(let i=0;i<36;i++){const m=box(.07,.07,.07,i%2?'#e7d490':'#b9aceb',0,0,0,scene,true);sparks.push(m);}
const landmarkElements=nodes.map((_,i)=>{const el=document.createElement('span');el.className='quest-landmark';el.textContent=String(i+1).padStart(2,'0')+' / '+ranks[i];stage.append(el);return el;});
let width=0,height=0,mobile=false,p=0,target=0,lastRank=-1,visible=true;
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const entryStarted=performance.now();
function resize(){width=stage.clientWidth;height=stage.clientHeight;mobile=width<760;const res=mobile?1:Math.min(1,1000/width);renderer.setSize(Math.round(width*res),Math.round(height*res),false);canvas.style.width=width+'px';canvas.style.height=height+'px';const hh=mobile?13.7:10.3;camera.left=-hh*width/height;camera.right=hh*width/height;camera.top=hh;camera.bottom=-hh;camera.updateProjectionMatrix();}
function updateTarget(){target=clamp((scrollY-root.offsetTop)/(root.offsetHeight-innerHeight));}
addEventListener('resize',()=>{resize();updateTarget()});addEventListener('scroll',updateTarget,{passive:true});
const skip=()=>window.scrollTo({top:document.querySelector('#quest-bridge').offsetTop,behavior:reduce?'instant':'smooth'});
document.querySelector('#quest-skip').addEventListener('click',skip);
document.querySelectorAll('.quest-stop').forEach((el,i)=>el.addEventListener('click',()=>{window.scrollTo({top:root.offsetTop+(.13+i*.18)*(root.offsetHeight-innerHeight),behavior:reduce?'instant':'smooth'})}));
document.querySelector('#replay')?.addEventListener('click',()=>window.scrollTo({top:0,behavior:reduce?'instant':'smooth'}));
new IntersectionObserver(([e])=>{visible=e.isIntersecting},{rootMargin:'150px'}).observe(root);
const focus=new THREE.Vector3(),look=new THREE.Vector3(),camOffset=new THREE.Vector3(12,12,22),v=new THREE.Vector3();
let lastTime=0;function animate(now){requestAnimationFrame(animate);if(!visible||document.hidden)return;const dt=Math.min((now-lastTime)/1000,.05)||.016;lastTime=now;p=reduce?target:THREE.MathUtils.lerp(p,target,1-Math.exp(-dt*8));const q=clamp((p-.12)/.72)*4,leg=Math.min(3,Math.floor(q)),u=q-leg;const idx=Math.min(4,Math.floor(q+.08));
 if(idx!==lastRank){lastRank=idx;heading.innerHTML=titles[idx].join('<br>');description.innerHTML=desc[idx];name.textContent=ranks[idx];eq.textContent=equipment[idx];number.textContent='LEVEL '+String(idx+1).padStart(2,'0')+' / 05';outfits.forEach((m,i)=>m.visible=i===idx);document.querySelectorAll('.quest-stop').forEach((el,i)=>{el.classList.toggle('active',i<=idx);el.setAttribute('aria-current',i===idx?'step':'false')});document.querySelectorAll('.quest-slot').forEach((el,i)=>el.classList.toggle('on',i<=idx));}
 hero.position.copy(nodes[leg]).lerp(nodes[leg+1],smooth(u));hero.position.y+=.23+Math.sin(u*Math.PI)*.8;hero.position.z+=.28;
 const arrival=reduce?1:Math.max(smooth(p/.10),smooth((now-entryStarted-200)/1500));hero.scale.setScalar(.18+.82*arrival);hero.position.y+=(1-arrival)*.6;hero.rotation.y=Math.atan2(camOffset.x,camOffset.z);
 // Entry emerges out of the spiral in depth, rather than just fading in.
 hero.position.z-=1.1*(1-arrival);portal.visible=p<.28;portal.scale.setScalar(1-.7*smooth((p-.10)/.18));portal.rotation.z=reduce?0:now*.0003;portalFrame.rotation.z=reduce?0:-now*.00015;
 shadow.position.set(hero.position.x,nodes[leg].y+(nodes[leg+1].y-nodes[leg].y)*smooth(u)+.22,hero.position.z);shadow.scale.setScalar(1-Math.sin(u*Math.PI)*.25);
 const transformation=Math.max(0,1-Math.abs(q-Math.round(q))/.18);sparks.forEach((m,i)=>{const a=i*2.399+q*2,r=.8+((i%6)/6)*.8;const burst=transformation*(idx>0?1:0);m.visible=burst>.01;m.position.set(hero.position.x+Math.cos(a)*r*burst,hero.position.y+.5+(i%8)*.35,hero.position.z+Math.sin(a)*r*burst);m.scale.setScalar(.05*burst);});
 // Layered world-space flow: nearby clouds travel faster than distant banks.
 const flowTime=reduce?0:now*.001;
 flowingClouds.forEach(({group,x,y,z,phase,speed})=>{group.position.x=((x+flowTime*speed+45)%90+90)%90-45;group.position.y=y+Math.sin(flowTime*.24+phase)*.45;group.position.z=z+Math.sin(flowTime*.15+phase)*1.1;group.rotation.y=reduce?0:Math.sin(flowTime*.12+phase)*.035;});
 debris.forEach(({mesh,y,phase},i)=>{if(!reduce){mesh.position.y=y+Math.sin(flowTime*.55+phase)*.4;mesh.rotation.x+=dt*.06;mesh.rotation.z+=dt*.09;}});runes.forEach((m,i)=>{m.material.emissiveIntensity=i<=idx?1:.15});
 // Wide isometric overview subtly tracks the student; mobile uses a closer portrait camera.
 focus.copy(hero.position);if(mobile){look.set(focus.x+.9,focus.y+3.2,focus.z-.8);camOffset.set(12,13,23);}else{look.set(-2.6+focus.x*.32,2.6+focus.y*.35,-2.3+focus.z*.25);camOffset.set(13,12,24);}
 camera.position.copy(look).add(camOffset);camera.lookAt(look);camera.updateMatrixWorld();
 landmarkElements.forEach((el,i)=>{v.copy(nodes[i]);v.y+=.45;v.z+=1.8;v.project(camera);el.style.left=((v.x*.5+.5)*width)+'px';el.style.top=((-v.y*.5+.5)*height)+'px';el.style.transform='translate(-50%,0)';el.style.display=Math.abs(v.x)<.94&&Math.abs(v.y)<.72?'block':'none';el.classList.toggle('active',i===idx)});
 xp.style.width=(clamp(q/4)*100)+'%';prog.textContent=String(Math.round(p*100)).padStart(3,'0')+'%';document.querySelector('.quest-scroll-exit').style.transform='scaleX('+p+')';
 // The pinned scene releases naturally into the retained content, no wheel interception.
 renderer.render(scene,camera);window.__questState={progress:p,rank:idx,rankName:ranks[idx],outfit:equipment[idx],character:hero.position.toArray(),camera:camera.position.toArray(),reducedMotion:reduce};
}
resize();updateTarget();requestAnimationFrame(animate);

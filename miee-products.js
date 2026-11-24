(() => {
 const root=document.querySelector('#product-showcase');if(!root)return;
 const products=[['STM32核心板开发套件','电子技术基础类','p1'],['医疗电子DSP基础开发系统','生物医学信号处理类','p2'],['医学信号采集平台','生物医学信号处理类','p2'],['监护仪嵌入式开发系统','嵌入式技术类','p4'],['液面检测与移液实验平台','医学体外诊断仪器类','p6']];
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');
 const desktop=matchMedia('(min-width: 900px)');
 root.innerHTML=`<div class="story-pin"><div class="story-heading"><p class="label">(05) ENGINEERING / PRODUCTS</p><h2 id="product-title">让工程实践<br>走进真实系统</h2><span class="story-hint">向下滚动 · 探索产品平台 ↓</span></div><div class="story-stage"><div class="story-grid" aria-hidden="true"></div><span class="story-ghost" aria-hidden="true">01</span><div class="story-slides"></div><button class="story-prev" aria-label="上一个产品">←</button><button class="story-next" aria-label="下一个产品">→</button></div><div class="story-bottom"><span class="story-count"></span><div class="story-progress"><span></span></div><span>工程实践 · 产品平台</span></div></div>`;
 const slides=root.querySelector('.story-slides');
 products.forEach(([name,category,path],i)=>{const card=document.createElement('article');card.className='story-slide';card.innerHTML=`<div class="story-image"><img src="assets/miee/products/product-${i+1}.png" alt="${name}"></div><div class="story-copy"><p class="label">${category}</p><h3>${name}</h3><p class="story-caption">从基础开发到系统集成<br>探索医工融合的工程实践平台</p><a href="http://www.leyutek.com/Product/${path}/" target="_blank" rel="noopener">查看产品分类 ↗</a></div>`;slides.append(card);});
 const cards=[...slides.children];let active=-1,frame=0;
 function pinned(){return desktop.matches&&!reduce.matches;}
 function render(index,progress){index=Math.max(0,Math.min(4,index));if(index!==active){active=index;cards.forEach((card,i)=>{card.classList.toggle('is-active',i===index);card.classList.toggle('is-past',i<index);card.inert=pinned()&&i!==index;card.setAttribute('aria-hidden',String(pinned()&&i!==index));});root.querySelector('.story-ghost').textContent=`0${index+1}`;root.querySelector('.story-count').textContent=`0${index+1} / 05`;}
 root.querySelector('.story-progress span').style.transform=`scaleX(${progress})`;root.querySelector('.story-grid').style.transform=`translate3d(${progress*-32}px,${progress*36}px,0)`;
 }
 function measure(){frame=0;root.classList.toggle('story-desktop',pinned());if(!pinned()){cards.forEach(c=>{c.inert=false;c.setAttribute('aria-hidden','false');});active=-1;return;}
 const r=root.getBoundingClientRect();const distance=root.offsetHeight-innerHeight;const p=Math.max(0,Math.min(1,-r.top/distance));render(Math.min(4,Math.floor(p*5)),p);}
 function schedule(){if(!frame)frame=requestAnimationFrame(measure);}
 function go(delta){if(!pinned()){const next=Math.max(0,Math.min(4,active+delta));cards[next].scrollIntoView({behavior:reduce.matches?'instant':'smooth',block:'center'});active=next;return;}
 const next=Math.max(0,Math.min(4,active+delta));const top=scrollY+root.getBoundingClientRect().top+(root.offsetHeight-innerHeight)*((next+.35)/5);window.scrollTo({top,behavior:'smooth'});}
 root.querySelector('.story-prev').addEventListener('click',()=>go(-1));root.querySelector('.story-next').addEventListener('click',()=>go(1));
 addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);reduce.addEventListener('change',measure);desktop.addEventListener('change',measure);measure();
 if(!reduce.matches&&'IntersectionObserver' in window){const targets=document.querySelectorAll('.courses h2,.courses-hint,.courses .features li');const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('motion-visible');observer.unobserve(e.target);}}),{threshold:.12});targets.forEach((el,i)=>{el.classList.add('motion-reveal');el.style.setProperty('--reveal-delay',`${i<2?0:(i%2)*120}ms`);observer.observe(el);});}
})();

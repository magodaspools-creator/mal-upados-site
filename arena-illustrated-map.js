(()=>{
  if(window.__arenaIllustratedMap)return;
  window.__arenaIllustratedMap=true;

  const CSS=`
    .arena-world-modal{position:fixed;inset:0;z-index:11000;display:grid;place-items:center;padding:14px;background:rgba(2,3,4,.9);backdrop-filter:blur(8px)}
    .arena-world-box{width:min(1280px,100%);max-height:96vh;overflow:auto;border:1px solid #665333;background:#080b0d;box-shadow:0 30px 120px rgba(0,0,0,.85);padding:14px}
    .arena-world-head{display:flex;align-items:flex-start;justify-content:space-between;gap:18px;margin-bottom:10px}
    .arena-world-head h2{font-family:Cinzel,serif;color:#eadfca;margin:2px 0 4px;font-size:1.35rem}
    .arena-world-head p{margin:0;color:#899096;font-size:.65rem;line-height:1.5}
    .arena-world-close{border:1px solid #383c3f;background:#111417;color:#b8bec2;padding:8px 12px;cursor:pointer}
    .arena-world-close:hover{border-color:#c29b52;color:#e3c77f}
    .arena-world-art{position:relative;isolation:isolate;overflow:hidden;border:1px solid #4a3d28;background:#050708;box-shadow:inset 0 0 60px rgba(0,0,0,.5)}
    .arena-world-art img{display:block;width:100%;height:auto;aspect-ratio:16/9;object-fit:cover}
    .arena-map-loading{position:absolute;inset:0;display:grid;place-items:center;color:#c7b17c;background:rgba(5,7,8,.9);font-size:.7rem;letter-spacing:.08em}
    .arena-map-hotspot{position:absolute;z-index:3;transform:translate(-50%,-50%);min-width:104px;padding:7px 9px;border:1px solid rgba(224,194,126,.45);border-radius:7px;background:rgba(8,10,11,.78);box-shadow:0 5px 20px rgba(0,0,0,.55);color:#eee3ca;text-align:center;cursor:pointer;backdrop-filter:blur(3px);transition:.18s}
    .arena-map-hotspot:hover{transform:translate(-50%,-50%) scale(1.06);border-color:#e2bd70;background:rgba(28,24,16,.9);box-shadow:0 0 22px rgba(214,173,89,.3)}
    .arena-map-hotspot.current{border-color:#e6bf70;box-shadow:0 0 0 2px rgba(230,191,112,.18),0 0 28px rgba(230,191,112,.35)}
    .arena-map-hotspot.locked{opacity:.48;filter:grayscale(.6)}
    .arena-map-hotspot strong{display:block;font-family:Cinzel,serif;font-size:.66rem;line-height:1.15;text-shadow:0 2px 5px #000}
    .arena-map-hotspot span{display:block;margin-top:3px;font-size:.5rem;color:#d0c3a8}
    .arena-map-hotspot .map-lock{font-size:.58rem}
    .arena-map-hotspot.current:after{content:'VOCÊ ESTÁ AQUI';display:block;margin-top:4px;color:#e9c979;font-size:.42rem;letter-spacing:.07em}
    .arena-world-hotspots{display:grid;grid-template-columns:repeat(5,1fr);gap:6px;margin-top:8px}
    .arena-world-hotspot{border:1px solid #292d30;background:#0d1012;color:#9ca2a7;padding:9px 8px;text-align:left;cursor:pointer;transition:.18s}
    .arena-world-hotspot:hover,.arena-world-hotspot.current{border-color:#b7934c;background:#17150f;color:#dfc47f}
    .arena-world-hotspot.locked{opacity:.42;cursor:not-allowed}
    .arena-world-hotspot strong{display:block;font-family:Cinzel,serif;font-size:.62rem;color:#d9d0c0}
    .arena-world-hotspot span{display:block;margin-top:3px;font-size:.49rem;color:#777e84}
    .arena-world-info{margin-top:8px;padding:11px 13px;border:1px solid #2d302f;background:#0d1012;display:flex;align-items:center;justify-content:space-between;gap:15px}
    .arena-world-info strong{display:block;color:#dfceaa;font-size:.68rem}
    .arena-world-info span{display:block;margin-top:3px;color:#7f878d;font-size:.55rem}
    .arena-world-go{border:1px solid #69552d;background:#211b11;color:#d6b56b;padding:8px 12px;cursor:pointer;font-size:.55rem;font-weight:700;white-space:nowrap}
    .arena-world-go:disabled{opacity:.35;cursor:not-allowed}
    @media(max-width:760px){.arena-world-modal{padding:6px}.arena-world-box{padding:9px}.arena-world-head h2{font-size:1.05rem}.arena-world-hotspots{grid-template-columns:1fr 1fr}.arena-map-hotspot{min-width:82px;padding:5px 6px}.arena-map-hotspot strong{font-size:.49rem}.arena-map-hotspot span{font-size:.4rem}.arena-map-hotspot.current:after{font-size:.34rem}.arena-world-info{align-items:flex-start;flex-direction:column}.arena-world-go{width:100%}}
  `;
  const style=document.createElement('style');style.id='arenaIllustratedMapStyle';style.textContent=CSS;document.head.appendChild(style);

  const zones=[
    {name:'Floresta Sombria',meta:'Level 1+ · criaturas iniciais',min:1,x:22,y:43},
    {name:'Acampamento Orc',meta:'Level 10+ · caçada intermediária',min:10,x:36,y:49},
    {name:'Deserto Perdido',meta:'Level 20+ · ruínas e escorpiões',min:20,x:56,y:31},
    {name:'Covil dos Dragões',meta:'Level 35+ · dragões e fogo',min:35,x:72,y:24},
    {name:'Abismo Demoníaco',meta:'Level 50+ · conteúdo extremo',min:50,x:88,y:31}
  ];

  const gameLevel=()=>Number(document.getElementById('arenaLevel')?.textContent||1);
  const currentZone=()=>Number(document.querySelector('.zone.selected')?.dataset.zone||0);

  async function loadMapImage(img,loading){
    try{
      const parts=await Promise.all([1,2,3,4].map(n=>fetch('/assets/arena-map/'+String(n).padStart(2,'0')+'.txt').then(r=>{if(!r.ok)throw new Error('asset '+n);return r.text()})));
      const b64=parts.join('');
      const raw=atob(b64),bytes=new Uint8Array(raw.length);
      for(let i=0;i<raw.length;i++)bytes[i]=raw.charCodeAt(i);
      const url=URL.createObjectURL(new Blob([bytes],{type:'image/jpeg'}));
      img.onload=()=>{loading?.remove();setTimeout(()=>URL.revokeObjectURL(url),1000)};
      img.src=url;
    }catch(err){console.error('[Arena Map] Falha ao carregar mapa:',err);loading.textContent='MAPA INDISPONÍVEL';}
  }

  function open(){
    if(document.getElementById('arenaWorldModal'))return;
    const level=gameLevel(),current=currentZone();
    const modal=document.createElement('div');
    modal.id='arenaWorldModal';modal.className='arena-world-modal';
    modal.innerHTML=`<div class="arena-world-box">
      <div class="arena-world-head"><div><div class="eyebrow">MUNDO DA ARENA</div><h2>As Terras dos Mal Upados</h2><p>Explore o mapa e clique nas regiões para ver o nível necessário.</p></div><button class="arena-world-close" type="button">Fechar</button></div>
      <div class="arena-world-art"><img id="arenaWorldMapImage" src="arena-map.svg?v=map-fallback-20260916" alt="Mapa ilustrado do mundo da Arena"><div class="arena-map-loading">CARREGANDO MAPA...</div>
        ${zones.map((z,i)=>{const locked=level<z.min;return `<button type="button" class="arena-map-hotspot ${i===current?'current ':''}${locked?'locked':''}" data-zone="${i}" style="left:${z.x}%;top:${z.y}%" ${locked?'disabled':''}><strong>${z.name}</strong><span class="${locked?'map-lock':''}">${locked?'🔒 Level '+z.min+' necessário':'Level '+z.min+'+'}</span></button>`}).join('')}
      </div>
      <div class="arena-world-hotspots">${zones.map((z,i)=>{const locked=level<z.min;return `<button type="button" class="arena-world-hotspot ${i===current?'current ':''}${locked?'locked':''}" data-zone="${i}" ${locked?'disabled':''}><strong>${z.name}</strong><span>${locked?'🔒 Level '+z.min+' necessário':z.meta}</span></button>`}).join('')}</div>
      <div class="arena-world-info"><div><strong id="arenaWorldInfoTitle">${zones[current].name}</strong><span id="arenaWorldInfoMeta">${zones[current].meta} · Level mínimo ${zones[current].min}</span></div><button type="button" class="arena-world-go" id="arenaWorldGo">IR PARA ESTA ÁREA</button></div>
    </div>`;
    document.body.appendChild(modal);
    loadMapImage(modal.querySelector('#arenaWorldMapImage'),modal.querySelector('.arena-map-loading'));

    let selected=current;
    const select=i=>{
      selected=i;
      modal.querySelectorAll('[data-zone]').forEach(b=>b.classList.toggle('current',Number(b.dataset.zone)===i));
      modal.querySelector('#arenaWorldInfoTitle').textContent=zones[i].name;
      modal.querySelector('#arenaWorldInfoMeta').textContent=`${zones[i].meta} · Level mínimo ${zones[i].min}`;
      modal.querySelector('#arenaWorldGo').disabled=level<zones[i].min;
    };
    modal.querySelectorAll('[data-zone]:not(:disabled)').forEach(b=>b.addEventListener('click',()=>select(Number(b.dataset.zone))));
    modal.querySelector('#arenaWorldGo').onclick=()=>{
      const homeZone=document.querySelector(`.zone[data-zone="${selected}"]`);
      if(homeZone){homeZone.click();modal.remove();document.querySelector('.game-shell')?.scrollIntoView({behavior:'smooth',block:'start'})}
    };
    modal.querySelector('.arena-world-close').onclick=()=>modal.remove();
    modal.addEventListener('click',e=>{if(e.target===modal)modal.remove()});
  }

  function bind(){
    const nav=document.getElementById('arenaSubnav');
    if(!nav)return false;
    if(nav.dataset.illustratedMapBound==='1')return true;
    nav.dataset.illustratedMapBound='1';
    nav.addEventListener('click',e=>{
      const btn=e.target.closest('button[data-target="arenaMap"]');
      if(!btn)return;
      e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
      open();
    },true);
    return true;
  }
  const timer=setInterval(()=>{if(bind())clearInterval(timer)},100);
  setTimeout(()=>clearInterval(timer),30000);
})();
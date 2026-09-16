(()=>{
  if(window.__arenaIllustratedMap)return;
  window.__arenaIllustratedMap=true;

  const CSS=`
    .arena-world-modal{position:fixed;inset:0;z-index:11000;display:grid;place-items:center;padding:12px;background:rgba(2,3,4,.92);backdrop-filter:blur(8px)}
    .arena-world-box{width:min(1320px,100%);max-height:97vh;overflow:auto;border:1px solid #665333;background:#080b0d;box-shadow:0 30px 120px rgba(0,0,0,.9);padding:12px}
    .arena-world-head{display:flex;align-items:flex-start;justify-content:space-between;gap:18px;margin-bottom:9px}
    .arena-world-head h2{font-family:Cinzel,serif;color:#eadfca;margin:2px 0 3px;font-size:1.25rem}
    .arena-world-head p{margin:0;color:#899096;font-size:.63rem;line-height:1.45}
    .arena-world-close{border:1px solid #383c3f;background:#111417;color:#b8bec2;padding:8px 12px;cursor:pointer}
    .arena-world-close:hover{border-color:#c29b52;color:#e3c77f}
    .arena-world-art{position:relative;isolation:isolate;overflow:hidden;border:1px solid #4a3d28;background:#050708;box-shadow:inset 0 0 60px rgba(0,0,0,.55)}
    .arena-world-art img{display:block;width:100%;height:auto;aspect-ratio:500/213;object-fit:cover}
    .arena-map-hotspot{position:absolute;z-index:4;transform:translate(-50%,-50%);width:13%;height:18%;min-width:90px;border:1px solid transparent;border-radius:10px;background:rgba(0,0,0,0);color:transparent;cursor:pointer;transition:.18s;outline:none}
    .arena-map-hotspot:hover{background:rgba(232,193,105,.10);border-color:rgba(232,193,105,.72);box-shadow:0 0 30px rgba(232,193,105,.24),inset 0 0 25px rgba(232,193,105,.08)}
    .arena-map-hotspot.current{background:rgba(49,137,255,.08);border-color:rgba(65,155,255,.85);box-shadow:0 0 28px rgba(65,155,255,.28),inset 0 0 22px rgba(65,155,255,.08)}
    .arena-map-hotspot.locked{opacity:.45;cursor:not-allowed}
    .arena-map-tooltip{position:absolute;z-index:5;pointer-events:none;transform:translate(-50%,0);padding:6px 9px;border:1px solid #6d5832;background:rgba(7,9,10,.94);box-shadow:0 8px 25px rgba(0,0,0,.65);color:#eadfca;font-family:Cinzel,serif;font-size:.55rem;white-space:nowrap;opacity:0;transition:.14s}
    .arena-map-tooltip small{display:block;margin-top:2px;color:#c8a85e;font-family:inherit;font-size:.45rem}
    .arena-map-hotspot:hover + .arena-map-tooltip{opacity:1}
    .arena-world-hotspots{display:grid;grid-template-columns:repeat(5,1fr);gap:6px;margin-top:8px}
    .arena-world-hotspot{border:1px solid #292d30;background:#0d1012;color:#9ca2a7;padding:9px 8px;text-align:left;cursor:pointer;transition:.18s}
    .arena-world-hotspot:hover,.arena-world-hotspot.current{border-color:#b7934c;background:#17150f;color:#dfc47f}
    .arena-world-hotspot.locked{opacity:.42;cursor:not-allowed}
    .arena-world-hotspot strong{display:block;font-family:Cinzel,serif;font-size:.62rem;color:#d9d0c0}
    .arena-world-hotspot span{display:block;margin-top:3px;font-size:.49rem;color:#777e84}
    .arena-world-info{margin-top:8px;padding:10px 12px;border:1px solid #2d302f;background:#0d1012;display:flex;align-items:center;justify-content:space-between;gap:15px}
    .arena-world-info strong{display:block;color:#dfceaa;font-size:.68rem}
    .arena-world-info span{display:block;margin-top:3px;color:#7f878d;font-size:.55rem}
    .arena-world-go{border:1px solid #69552d;background:#211b11;color:#d6b56b;padding:9px 13px;cursor:pointer;font-size:.55rem;font-weight:700;white-space:nowrap}
    .arena-world-go:hover:not(:disabled){border-color:#c79c50;background:#2b2213;color:#f0d28b}
    .arena-world-go:disabled{opacity:.35;cursor:not-allowed}
    @media(max-width:760px){.arena-world-modal{padding:5px}.arena-world-box{padding:8px}.arena-world-head h2{font-size:1rem}.arena-world-head p{font-size:.54rem}.arena-map-hotspot{min-width:54px;width:16%;height:20%}.arena-map-tooltip{display:none}.arena-world-hotspots{grid-template-columns:1fr 1fr}.arena-world-info{align-items:flex-start;flex-direction:column}.arena-world-go{width:100%}}
  `;
  const style=document.createElement('style');style.id='arenaIllustratedMapStyle';style.textContent=CSS;document.head.appendChild(style);

  const zones=[
    {name:'Floresta Sombria',meta:'Level 1+ · criaturas iniciais',min:1,x:25,y:20},
    {name:'Acampamento Orc',meta:'Level 10+ · caçada intermediária',min:10,x:37,y:47},
    {name:'Deserto Perdido',meta:'Level 20+ · ruínas e escorpiões',min:52,y:25},
    {name:'Covil dos Dragões',meta:'Level 35+ · dragões e fogo',min:71,x:25},
    {name:'Abismo Demoníaco',meta:'Level 50+ · conteúdo extremo',min:88,x:31}
  ];
  zones[2].x=52;
  zones[3].y=25;

  const gameLevel=()=>Number(document.getElementById('arenaLevel')?.textContent||1);
  const currentZone=()=>Number(document.querySelector('.zone.selected')?.dataset.zone||0);

  function open(){
    if(document.getElementById('arenaWorldModal'))return;
    const level=gameLevel(),current=currentZone();
    const modal=document.createElement('div');
    modal.id='arenaWorldModal';modal.className='arena-world-modal';
    modal.innerHTML=`<div class="arena-world-box">
      <div class="arena-world-head"><div><div class="eyebrow">MUNDO DA ARENA</div><h2>As Terras dos Mal Upados</h2><p>Explore o mapa e clique diretamente nas regiões para selecioná-las.</p></div><button class="arena-world-close" type="button">Fechar</button></div>
      <div class="arena-world-art">
        <img src="arena-world-map.jpg?v=map-final-20260916" alt="Mapa ilustrado das Terras dos Mal Upados">
        ${zones.map((z,i)=>{const locked=level<z.min;return `<button type="button" aria-label="${z.name} — Level ${z.min}+" class="arena-map-hotspot ${i===current?'current ':''}${locked?'locked':''}" data-zone="${i}" style="left:${z.x}%;top:${z.y}%" ${locked?'disabled':''}></button><div class="arena-map-tooltip" style="left:${z.x}%;top:${Math.min(z.y+11,90)}%">${z.name}<small>${locked?'🔒 Level '+z.min+' necessário':'Level '+z.min+'+'}</small></div>`}).join('')}
      </div>
      <div class="arena-world-hotspots">${zones.map((z,i)=>{const locked=level<z.min;return `<button type="button" class="arena-world-hotspot ${i===current?'current ':''}${locked?'locked':''}" data-zone="${i}" ${locked?'disabled':''}><strong>${z.name}</strong><span>${locked?'🔒 Level '+z.min+' necessário':z.meta}</span></button>`}).join('')}</div>
      <div class="arena-world-info"><div><strong id="arenaWorldInfoTitle">${zones[current].name}</strong><span id="arenaWorldInfoMeta">${zones[current].meta} · Level mínimo ${zones[current].min}</span></div><button type="button" class="arena-world-go" id="arenaWorldGo">IR PARA ESTA ÁREA</button></div>
    </div>`;
    document.body.appendChild(modal);

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
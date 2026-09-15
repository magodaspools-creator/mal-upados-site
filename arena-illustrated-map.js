(()=>{
  if(window.__arenaIllustratedMap)return;
  window.__arenaIllustratedMap=true;

  const CSS=`
    .arena-world-modal{position:fixed;inset:0;z-index:11000;display:grid;place-items:center;padding:18px;background:rgba(2,3,4,.88);backdrop-filter:blur(7px)}
    .arena-world-box{width:min(1220px,100%);max-height:94vh;overflow:auto;border:1px solid #5f4f2f;background:linear-gradient(145deg,#121412,#090b0d);box-shadow:0 35px 120px rgba(0,0,0,.8);padding:18px}
    .arena-world-head{display:flex;align-items:flex-start;justify-content:space-between;gap:18px;margin-bottom:14px}
    .arena-world-head h2{font-family:Cinzel,serif;color:#e8ddc8;margin:3px 0 5px;font-size:1.45rem}
    .arena-world-head p{margin:0;color:#81878c;font-size:.67rem;line-height:1.5}
    .arena-world-close{border:1px solid #363a3d;background:#111417;color:#b6bbc0;padding:8px 12px;cursor:pointer}
    .arena-world-close:hover{border-color:#b9954d;color:#e1c477}
    .arena-world-art{position:relative;border:1px solid #35332d;background:#050708;overflow:hidden;box-shadow:inset 0 0 50px rgba(0,0,0,.45)}
    .arena-world-art img{display:block;width:100%;height:auto;min-height:360px;object-fit:cover}
    .arena-world-path{position:absolute;left:6%;right:6%;bottom:7%;height:2px;background:linear-gradient(90deg,transparent,#c19b51,transparent);opacity:.65;pointer-events:none}
    .arena-world-hotspots{display:grid;grid-template-columns:repeat(5,1fr);gap:7px;margin-top:10px}
    .arena-world-hotspot{border:1px solid #292d30;background:#0d1012;color:#9ca2a7;padding:10px 8px;text-align:left;cursor:pointer;transition:.18s}
    .arena-world-hotspot:hover,.arena-world-hotspot.current{border-color:#b7934c;background:#17150f;color:#dfc47f}
    .arena-world-hotspot.locked{opacity:.42;cursor:not-allowed}
    .arena-world-hotspot strong{display:block;font-family:Cinzel,serif;font-size:.64rem;color:#d9d0c0}
    .arena-world-hotspot span{display:block;margin-top:3px;font-size:.5rem;color:#777e84}
    .arena-world-info{margin-top:10px;padding:12px 14px;border:1px solid #2d302f;background:#0d1012;display:flex;align-items:center;justify-content:space-between;gap:15px}
    .arena-world-info strong{color:#d9c99e;font-size:.68rem}
    .arena-world-info span{color:#777e84;font-size:.57rem}
    .arena-world-go{border:1px solid #69552d;background:#211b11;color:#d6b56b;padding:8px 12px;cursor:pointer;font-size:.55rem;font-weight:700;white-space:nowrap}
    @media(max-width:760px){.arena-world-modal{padding:7px}.arena-world-box{padding:10px}.arena-world-head h2{font-size:1.1rem}.arena-world-art img{min-height:220px;object-fit:cover}.arena-world-hotspots{grid-template-columns:1fr 1fr}.arena-world-info{align-items:flex-start;flex-direction:column}.arena-world-go{width:100%}}
  `;
  const style=document.createElement('style');style.id='arenaIllustratedMapStyle';style.textContent=CSS;document.head.appendChild(style);

  const zones=[
    {name:'Floresta Sombria',meta:'Level 1+ · criaturas iniciais',icon:'🌲'},
    {name:'Acampamento Orc',meta:'Level 5+ · caçada intermediária',icon:'🏕️'},
    {name:'Deserto Perdido',meta:'Level 12+ · ruínas e escorpiões',icon:'🏜️'},
    {name:'Covil dos Dragões',meta:'Level 20+ · dragões e fogo',icon:'🐉'},
    {name:'Abismo Demoníaco',meta:'Level 35+ · conteúdo extremo',icon:'😈'}
  ];

  const gameLevel=()=>Number(document.getElementById('arenaLevel')?.textContent||1);
  const currentZone=()=>Number(document.querySelector('.zone.selected')?.dataset.zone||0);

  function open(){
    if(document.getElementById('arenaWorldModal'))return;
    const level=gameLevel(),current=currentZone();
    const modal=document.createElement('div');
    modal.id='arenaWorldModal';modal.className='arena-world-modal';
    modal.innerHTML=`<div class="arena-world-box">
      <div class="arena-world-head"><div><div class="eyebrow">MUNDO DA ARENA</div><h2>As Terras dos Mal Upados</h2><p>Explore visualmente o mundo da Arena. As regiões ficam disponíveis conforme seu personagem evolui.</p></div><button class="arena-world-close" type="button">Fechar</button></div>
      <div class="arena-world-art"><img src="arena-map.svg?v=illustrated-map-20260915" alt="Mapa ilustrado do mundo da Arena Mal Upados"><div class="arena-world-path"></div></div>
      <div class="arena-world-hotspots">${zones.map((z,i)=>{const min=[1,5,12,20,35][i],locked=level<min;return `<button type="button" class="arena-world-hotspot ${i===current?'current ':''}${locked?'locked':''}" data-zone="${i}" ${locked?'disabled':''}><strong>${z.icon} ${z.name}</strong><span>${locked?'🔒 Level '+min+' necessário':z.meta}</span></button>`}).join('')}</div>
      <div class="arena-world-info"><div><strong id="arenaWorldInfoTitle">${zones[current].icon} ${zones[current].name}</strong><span id="arenaWorldInfoMeta">${zones[current].meta}</span></div><button type="button" class="arena-world-go" id="arenaWorldGo">IR PARA ESTA ÁREA</button></div>
    </div>`;
    document.body.appendChild(modal);

    let selected=current;
    const select=i=>{
      selected=i;
      modal.querySelectorAll('.arena-world-hotspot').forEach(b=>b.classList.toggle('current',Number(b.dataset.zone)===i));
      modal.querySelector('#arenaWorldInfoTitle').textContent=`${zones[i].icon} ${zones[i].name}`;
      modal.querySelector('#arenaWorldInfoMeta').textContent=zones[i].meta;
      modal.querySelector('#arenaWorldGo').disabled=level<[1,5,12,20,35][i];
    };
    modal.querySelectorAll('.arena-world-hotspot:not(.locked)').forEach(b=>b.addEventListener('click',()=>select(Number(b.dataset.zone))));
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

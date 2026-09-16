(()=>{
  if(window.__arenaMapTabV1)return;
  window.__arenaMapTabV1=true;

  const CSS=`
    /* Mapa é uma aba real: enquanto ativa, o conteúdo de Combate some por completo. */
    main.arena-view-map > *:not(.arena-map-tab-page){display:none!important}
    main.arena-map-tab-active > *:not(.arena-map-tab-page){display:none!important}
    .arena-map-tab-page{margin-top:10px;border:1px solid #665333;background:#080b0d;box-shadow:0 20px 70px rgba(0,0,0,.45);padding:14px}
    .arena-map-tab-head{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:10px}
    .arena-map-tab-head h2{font-family:Cinzel,serif;color:#eadfca;margin:2px 0 4px;font-size:1.35rem}
    .arena-map-tab-head p{margin:0;color:#899096;font-size:.63rem;line-height:1.45}
    .arena-map-tab-close{border:1px solid #383c3f;background:#111417;color:#b8bec2;padding:8px 12px;cursor:pointer}
    .arena-map-tab-close:hover{border-color:#c29b52;color:#e3c77f}
    .arena-map-tab-art{position:relative;isolation:isolate;overflow:hidden;border:1px solid #4a3d28;background:#050708;box-shadow:inset 0 0 60px rgba(0,0,0,.55);width:100%}
    .arena-map-tab-art img{display:block;width:100%;height:auto;aspect-ratio:auto;object-fit:contain}
    .arena-map-tab-loading{position:absolute;inset:0;display:grid;place-items:center;color:#c7b17c;background:rgba(5,7,8,.9);font-size:.7rem;letter-spacing:.08em}
    .arena-map-tab-hotspot{position:absolute;z-index:4;transform:translate(-50%,-50%);width:13%;height:18%;min-width:90px;border:1px solid transparent;border-radius:10px;background:rgba(0,0,0,0);color:transparent;cursor:pointer;transition:.18s;outline:none}
    .arena-map-tab-hotspot:hover{background:rgba(232,193,105,.10);border-color:rgba(232,193,105,.72);box-shadow:0 0 30px rgba(232,193,105,.24),inset 0 0 25px rgba(232,193,105,.08)}
    .arena-map-tab-hotspot.current{background:rgba(49,137,255,.08);border-color:rgba(65,155,255,.85);box-shadow:0 0 28px rgba(65,155,255,.28),inset 0 0 22px rgba(65,155,255,.08)}
    .arena-map-tab-hotspot.locked{opacity:.45;cursor:not-allowed}
    .arena-map-tab-hotspots{display:grid;grid-template-columns:repeat(5,1fr);gap:6px;margin-top:8px}
    .arena-map-tab-hotspot-card{border:1px solid #292d30;background:#0d1012;color:#9ca2a7;padding:9px 8px;text-align:left;cursor:pointer;transition:.18s}
    .arena-map-tab-hotspot-card:hover,.arena-map-tab-hotspot-card.current{border-color:#b7934c;background:#17150f;color:#dfc47f}
    .arena-map-tab-hotspot-card.locked{opacity:.42;cursor:not-allowed}
    .arena-map-tab-hotspot-card strong{display:block;font-family:Cinzel,serif;font-size:.62rem;color:#d9d0c0}
    .arena-map-tab-hotspot-card span{display:block;margin-top:3px;font-size:.49rem;color:#777e84}
    .arena-map-tab-info{margin-top:8px;padding:10px 12px;border:1px solid #2d302f;background:#0d1012;display:flex;align-items:center;justify-content:space-between;gap:15px}
    .arena-map-tab-info strong{display:block;color:#dfceaa;font-size:.68rem}
    .arena-map-tab-info span{display:block;margin-top:3px;color:#7f878d;font-size:.55rem}
    .arena-map-tab-go{border:1px solid #69552d;background:#211b11;color:#d6b56b;padding:9px 13px;cursor:pointer;font-size:.55rem;font-weight:700;white-space:nowrap}
    .arena-map-tab-go:hover:not(:disabled){border-color:#c79c50;background:#2b2213;color:#f0d28b}
    .arena-map-tab-go:disabled{opacity:.35;cursor:not-allowed}
    @media(max-width:760px){.arena-map-tab-page{padding:8px}.arena-map-tab-head h2{font-size:1rem}.arena-map-tab-head p{font-size:.54rem}.arena-map-tab-hotspot{min-width:54px;width:16%;height:20%}.arena-map-tab-hotspots{grid-template-columns:1fr 1fr}.arena-map-tab-info{align-items:flex-start;flex-direction:column}.arena-map-tab-go{width:100%}}
  `;
  const style=document.createElement('style');style.id='arenaMapTabStyle';style.textContent=CSS;document.head.appendChild(style);

  const zones=[
    {name:'Floresta Sombria',meta:'Level 1+ · criaturas iniciais',min:1,x:25,y:20},
    {name:'Acampamento Orc',meta:'Level 10+ · caçada intermediária',min:10,x:37,y:47},
    {name:'Deserto Perdido',meta:'Level 20+ · ruínas e escorpiões',min:20,x:52,y:25},
    {name:'Covil dos Dragões',meta:'Level 35+ · dragões e fogo',min:35,x:71,y:25},
    {name:'Abismo Demoníaco',meta:'Level 50+ · conteúdo extremo',min:50,x:88,y:31}
  ];

  const gameLevel=()=>Number(document.getElementById('arenaLevel')?.textContent||1);
  const currentZone=()=>Number(document.querySelector('.zone.selected')?.dataset.zone||0);

  async function loadMapImage(img,loading){
    const RAW='https://raw.githubusercontent.com/magodaspools-creator/mal-upados-site/main/assets/arena-map/';
    try{
      const parts=await Promise.all(['01','02','03','04'].map(async part=>{
        const r=await fetch(`${RAW}${part}.txt?v=map-source-20260916a`,{cache:'no-store'});
        if(!r.ok)throw new Error(`arena-map/${part}.txt ${r.status}`);
        return (await r.text()).replace(/\s+/g,'');
      }));
      const b64=parts.join('');
      if(!b64.startsWith('/9j/'))throw new Error('fonte original não é JPEG em base64');
      const raw=atob(b64),bytes=new Uint8Array(raw.length);
      for(let i=0;i<raw.length;i++)bytes[i]=raw.charCodeAt(i);
      const blobUrl=URL.createObjectURL(new Blob([bytes],{type:'image/jpeg'}));
      img.onload=()=>{loading?.remove();setTimeout(()=>URL.revokeObjectURL(blobUrl),1000)};
      img.onerror=()=>{URL.revokeObjectURL(blobUrl);throw new Error('JPEG do mapa original inválido')};
      img.src=blobUrl;
    }catch(err){
      console.error('[Arena Map Tab] Falha ao carregar fonte original do mapa:',err);
      try{
        const r=await fetch(`${RAW}map-final.b64?v=map-final-fallback-20260916a`,{cache:'no-store'});
        if(!r.ok)throw new Error(`map-final.b64 ${r.status}`);
        const b64=(await r.text()).trim();
        if(!b64.startsWith('/9j/'))throw new Error('fallback não é JPEG em base64');
        const raw=atob(b64),bytes=new Uint8Array(raw.length);
        for(let i=0;i<raw.length;i++)bytes[i]=raw.charCodeAt(i);
        const blobUrl=URL.createObjectURL(new Blob([bytes],{type:'image/jpeg'}));
        img.onload=()=>{loading?.remove();setTimeout(()=>URL.revokeObjectURL(blobUrl),1000)};
        img.onerror=()=>{URL.revokeObjectURL(blobUrl);loading.textContent='MAPA INDISPONÍVEL'};
        img.src=blobUrl;
      }catch(fallbackErr){
        console.error('[Arena Map Tab] Fallback também falhou:',fallbackErr);
        loading.textContent='MAPA INDISPONÍVEL';
      }
    }
  }

  function closeMap(){
    const main=document.querySelector('main');
    if(!main)return;
    main.classList.remove('arena-map-tab-active','arena-view-map');
    main.querySelector('.arena-map-tab-page')?.remove();
    const combat=document.querySelector('#arenaSubnav button[data-target="arenaCombatSection"]');
    if(combat)combat.click();
  }

  function render(){
    const main=document.querySelector('main');
    if(!main)return false;
    main.classList.add('arena-map-tab-active','arena-view-map');
    main.querySelector('.arena-map-tab-page')?.remove();
    const level=gameLevel(),current=currentZone();
    const page=document.createElement('section');
    page.className='arena-map-tab-page';
    page.innerHTML=`<div class="arena-map-tab-head"><div><div class="eyebrow">MUNDO DA ARENA</div><h2>As Terras dos Mal Upados</h2><p>Explore o mapa e clique diretamente nas regiões para selecioná-las.</p></div><button class="arena-map-tab-close" type="button">Voltar</button></div>
      <div class="arena-map-tab-art"><img id="arenaMapTabImage" src="" alt="Mapa ilustrado do mundo da Arena"><div class="arena-map-tab-loading">CARREGANDO MAPA...</div>
        ${zones.map((z,i)=>{const locked=level<z.min;return `<button type="button" aria-label="${z.name} — Level ${z.min}+" class="arena-map-tab-hotspot ${i===current?'current ':''}${locked?'locked':''}" data-zone="${i}" style="left:${z.x}%;top:${z.y}%" ${locked?'disabled':''}></button>`}).join('')}
      </div>
      <div class="arena-map-tab-hotspots">${zones.map((z,i)=>{const locked=level<z.min;return `<button type="button" class="arena-map-tab-hotspot-card ${i===current?'current ':''}${locked?'locked':''}" data-zone="${i}" ${locked?'disabled':''}><strong>${z.name}</strong><span>${locked?'🔒 Level '+z.min+' necessário':z.meta}</span></button>`}).join('')}</div>
      <div class="arena-map-tab-info"><div><strong id="arenaMapTabInfoTitle">${zones[current].name}</strong><span id="arenaMapTabInfoMeta">${zones[current].meta} · Level mínimo ${zones[current].min}</span></div><button type="button" class="arena-map-tab-go" id="arenaMapTabGo">IR PARA ESTA ÁREA</button></div>`;
    main.prepend(page);
    loadMapImage(page.querySelector('#arenaMapTabImage'),page.querySelector('.arena-map-tab-loading'));

    let selected=current;
    const select=i=>{
      selected=i;
      page.querySelectorAll('[data-zone]').forEach(b=>b.classList.toggle('current',Number(b.dataset.zone)===i));
      page.querySelector('#arenaMapTabInfoTitle').textContent=zones[i].name;
      page.querySelector('#arenaMapTabInfoMeta').textContent=`${zones[i].meta} · Level mínimo ${zones[i].min}`;
      page.querySelector('#arenaMapTabGo').disabled=level<zones[i].min;
    };
    page.querySelectorAll('[data-zone]:not(:disabled)').forEach(b=>b.addEventListener('click',()=>select(Number(b.dataset.zone))));
    page.querySelector('#arenaMapTabGo').onclick=()=>{
      const homeZone=document.querySelector(`.zone[data-zone="${selected}"]`);
      if(homeZone){homeZone.click();closeMap()}
    };
    page.querySelector('.arena-map-tab-close').onclick=closeMap;
    return true;
  }

  function activate(){
    const main=document.querySelector('main');
    if(!main)return false;
    main.classList.add('arena-map-tab-active','arena-view-map');
    const btn=document.querySelector('#arenaSubnav button[data-target="arenaMap"]');
    if(btn)document.querySelectorAll('#arenaSubnav button[data-target]').forEach(b=>b.classList.toggle('active',b===btn));
    return render();
  }

  document.addEventListener('click',event=>{
    const btn=event.target.closest?.('#arenaSubnav button[data-target]');
    if(!btn)return;
    if(btn.dataset.target==='arenaMap'){
      event.preventDefault();event.stopPropagation();event.stopImmediatePropagation();
      activate();
      return;
    }
    document.querySelector('main')?.classList.remove('arena-map-tab-active','arena-view-map');
    document.querySelector('main .arena-map-tab-page')?.remove();
  },true);

  document.addEventListener('keydown',event=>{
    if(event.key!=='Escape')return;
    if(document.querySelector('main.arena-map-tab-active')){
      event.preventDefault();
      closeMap();
    }
  },true);

  window.arenaMapTab={activate,render,close:closeMap};
})();

(()=>{
  if(window.__arenaMapTabV2)return;
  window.__arenaMapTabV2=true;

  const CSS=`
    main.arena-view-map .game-shell,
    main.arena-view-map .shop-section,
    main.arena-view-map .activities,
    main.arena-view-map .progress-section,
    main.arena-view-map .arena-ranking,
    main.arena-view-map #arenaForgeSection,
    main.arena-view-map #abyssalGardens{display:none!important}
    main.arena-view-map .arena-map-tab-page{display:block!important}
    .arena-map-tab-page{margin:10px auto 0;width:min(1180px,calc(100% - 28px));padding:0;background:transparent;border:0;box-shadow:none}
    .arena-map-tab-head,.arena-map-tab-hotspots,.arena-map-tab-info{display:none!important}
    .arena-map-tab-art{position:relative;isolation:isolate;overflow:hidden;width:100%;border:0;background:transparent;box-shadow:none}
    .arena-map-tab-art img{display:block;width:100%;height:auto;max-width:100%;object-fit:contain;filter:none;transform:none;image-rendering:auto}
    .arena-map-tab-loading{position:absolute;inset:0;display:grid;place-items:center;color:#c7b17c;background:#050708;font-size:.7rem;letter-spacing:.08em}
    .arena-map-tab-hotspot,.arena-map-tab-hotspot-card{display:none!important}
  `;
  const style=document.createElement('style');style.id='arenaMapTabStyleV2';style.textContent=CSS;document.head.appendChild(style);

  const RAW='https://raw.githubusercontent.com/magodaspools-creator/mal-upados-site/main/assets/arena-map/';

  async function loadMapImage(img,loading){
    try{
      const r=await fetch(`${RAW}mapa%20arena%202048%20%C3%97%201024%20px.jpeg?v=map-pure-20260917`,{cache:'no-store'});
      if(!r.ok)throw new Error(`mapa original ${r.status}`);
      const blob=await r.blob();
      const blobUrl=URL.createObjectURL(blob);
      img.onload=()=>{loading?.remove();setTimeout(()=>URL.revokeObjectURL(blobUrl),1000)};
      img.onerror=()=>{URL.revokeObjectURL(blobUrl);loading.textContent='MAPA INDISPONÍVEL'};
      img.src=blobUrl;
    }catch(err){
      console.error('[Arena Map Tab] Mapa original falhou:',err);
      loading.textContent='MAPA INDISPONÍVEL';
    }
  }

  function restoreCombat(){
    const main=document.querySelector('main');
    if(!main)return;
    main.classList.remove('arena-map-tab-active','arena-view-map');
    main.querySelector('.arena-map-tab-page')?.remove();
    document.getElementById('arenaWorldModal')?.remove();
    document.getElementById('arenaMapModal')?.remove();
    const combat=document.querySelector('#arenaSubnav button[data-target="arenaCombatSection"]');
    if(combat)combat.click();
  }

  function render(){
    const main=document.querySelector('main');
    if(!main)return false;
    document.getElementById('arenaWorldModal')?.remove();
    document.getElementById('arenaMapModal')?.remove();
    main.classList.remove('arena-view-combat','arena-view-shop','arena-view-daily','arena-view-progress','arena-view-ranking','arena-view-forge','arena-view-abyssal');
    main.classList.add('arena-map-tab-active','arena-view-map');
    main.querySelector('.arena-map-tab-page')?.remove();

    const page=document.createElement('section');
    page.className='arena-map-tab-page';
    page.innerHTML=`<div class="arena-map-tab-art"><img id="arenaMapTabImage" src="" alt="Mapa ilustrado do mundo da Arena"><div class="arena-map-tab-loading">CARREGANDO MAPA...</div></div>`;
    main.appendChild(page);
    loadMapImage(page.querySelector('#arenaMapTabImage'),page.querySelector('.arena-map-tab-loading'));
    return true;
  }

  function activate(){
    const main=document.querySelector('main');
    if(!main)return false;
    render();
    const btn=document.querySelector('#arenaSubnav button[data-target="arenaMap"]');
    if(btn)document.querySelectorAll('#arenaSubnav button[data-target]').forEach(b=>b.classList.toggle('active',b===btn));
    return true;
  }

  document.addEventListener('click',event=>{
    const btn=event.target.closest?.('#arenaSubnav button[data-target]');
    if(!btn)return;
    if(btn.dataset.target==='arenaMap'){
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      activate();
      return;
    }
    document.getElementById('arenaWorldModal')?.remove();
    document.getElementById('arenaMapModal')?.remove();
    document.querySelector('main')?.classList.remove('arena-map-tab-active','arena-view-map');
    document.querySelector('main .arena-map-tab-page')?.remove();
  },true);

  document.addEventListener('keydown',event=>{
    if(event.key!=='Escape')return;
    if(document.querySelector('main.arena-map-tab-active')){
      event.preventDefault();
      event.stopPropagation();
      restoreCombat();
    }
  },true);

  window.arenaMapTab={activate,render,close:restoreCombat};
})();
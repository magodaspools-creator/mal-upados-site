// Arena submenu controller: one owner for normal tabs; Map stays specialized and Forge/Abyssal are tabs.
(()=>{
  if(window.__arenaUiFixV8)return;
  window.__arenaUiFixV8=true;

  const VIEW_CLASSES=[
    'arena-view-combat','arena-view-shop','arena-view-daily',
    'arena-view-progress','arena-view-ranking','arena-view-forge','arena-view-abyssal'
  ];
  const CLASS_MAP={
    arenaCombatSection:'arena-view-combat',
    arenaShopSection:'arena-view-shop',
    arenaActivitiesSection:'arena-view-daily',
    arenaProgressSection:'arena-view-progress',
    arenaRankingSection:'arena-view-ranking',
    arenaForgeSection:'arena-view-forge',
    abyssalGardens:'arena-view-abyssal'
  };

  function ensureIds(){
    const shell=document.querySelector('.game-shell');
    const shop=document.querySelector('.shop-section:not(.boss-token-shop)')||document.getElementById('arenaShopSection');
    const acts=document.querySelector('.activities');
    const prog=document.querySelector('.progress-section');
    const rank=document.querySelector('.arena-ranking');
    const forge=document.querySelector('.forge-section')||document.getElementById('arenaForgeSection');
    const abyssal=document.getElementById('abyssalGardens');
    if(shell)shell.id='arenaCombatSection';
    if(shop)shop.id='arenaShopSection';
    if(acts)acts.id='arenaActivitiesSection';
    if(prog)prog.id='arenaProgressSection';
    if(rank)rank.id='arenaRankingSection';
    if(forge)forge.id='arenaForgeSection';
    return {shell,shop,acts,prog,rank,forge,abyssal};
  }

  function ensureAbyssalButton(){
    const nav=document.getElementById('arenaSubnav');
    if(!nav||nav.querySelector('[data-target="abyssalGardens"]'))return;
    const btn=document.createElement('button');
    btn.type='button';
    btn.dataset.target='abyssalGardens';
    btn.textContent='☠ Abyssal Gardens';
    const ranking=nav.querySelector('[data-target="arenaRankingSection"]');
    if(ranking)nav.insertBefore(btn,ranking);
    else nav.appendChild(btn);
  }

  function setActiveButton(target){
    document.querySelectorAll('#arenaSubnav button[data-target]').forEach(btn=>{
      btn.classList.toggle('active',btn.dataset.target===target);
    });
  }

  function setView(target){
    const main=document.querySelector('main');
    const next=CLASS_MAP[target];
    if(!main||!next)return false;
    main.classList.remove(...VIEW_CLASSES);
    main.classList.add(next);
    main.dataset.arenaView=next;
    setActiveButton(target);
    return true;
  }

  function refresh(target){
    if(target==='arenaShopSection'&&typeof window.shopRender==='function'){
      try{window.shopRender()}catch(e){console.error('[Arena] shopRender',e)}
    }
    if(target==='arenaActivitiesSection'&&typeof window.renderArenaActivities==='function'){
      try{window.renderArenaActivities()}catch(e){console.error('[Arena] renderArenaActivities',e)}
    }
    if(target==='arenaForgeSection'&&window.arenaForgeV2?.render){
      try{window.arenaForgeV2.render()}catch(e){console.error('[Arena] forgeRender',e)}
    }
    if(target==='abyssalGardens'&&window.arenaDungeon?.render){
      try{window.arenaDungeon.render()}catch(e){console.error('[Arena] abyssalRender',e)}
    }
    if(typeof window.arenaSkillRender==='function'){
      try{window.arenaSkillRender()}catch(e){console.error('[Arena] arenaSkillRender',e)}
    }
  }

  function activate(target){
    ensureIds();
    ensureAbyssalButton();
    if(!setView(target))return false;
    refresh(target);
    return true;
  }

  function bind(){
    if(window.__arenaUiFixNavCapture)return;
    window.__arenaUiFixNavCapture=true;
    document.addEventListener('click',event=>{
      const btn=event.target.closest?.('#arenaSubnav button[data-target]');
      if(!btn)return;
      const target=btn.dataset.target;
      if(target==='arenaMap')return;
      if(!CLASS_MAP[target])return;
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      activate(target);
    },true);
  }

  function init(){
    ensureIds();
    bind();
    ensureAbyssalButton();
    activate('arenaCombatSection');
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();

// Arena submenu controller: one owner for normal tabs; Map and Forge stay specialized.
(()=>{
  if(window.__arenaUiFixV7)return;
  window.__arenaUiFixV7=true;

  const VIEW_CLASSES=['arena-view-combat','arena-view-shop','arena-view-daily','arena-view-progress','arena-view-ranking'];
  const CLASS_MAP={
    arenaCombatSection:'arena-view-combat',
    arenaShopSection:'arena-view-shop',
    arenaActivitiesSection:'arena-view-daily',
    arenaProgressSection:'arena-view-progress',
    arenaRankingSection:'arena-view-ranking'
  };

  function ensureIds(){
    const shell=document.querySelector('.game-shell');
    const shop=document.querySelector('.shop-section:not(.boss-token-shop)')||document.getElementById('arenaShopSection');
    const acts=document.querySelector('.activities');
    const prog=document.querySelector('.progress-section');
    const rank=document.querySelector('.arena-ranking');
    if(shell)shell.id='arenaCombatSection';
    if(shop)shop.id='arenaShopSection';
    if(acts)acts.id='arenaActivitiesSection';
    if(prog)prog.id='arenaProgressSection';
    if(rank)rank.id='arenaRankingSection';
    return {shell,shop,acts,prog,rank};
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
    if(typeof window.arenaSkillRender==='function'){
      try{window.arenaSkillRender()}catch(e){console.error('[Arena] arenaSkillRender',e)}
    }
  }

  function activate(target){
    ensureIds();
    if(!setView(target))return false;
    refresh(target);
    return true;
  }

  // Capture is intentional here: arena-ui-polish.js creates the buttons and
  // assigns its legacy scroll handler. This handler runs before that onclick,
  // so normal tabs cannot be hijacked by the old scroll behavior.
  function bind(){
    if(window.__arenaUiFixNavCapture)return;
    window.__arenaUiFixNavCapture=true;
    document.addEventListener('click',event=>{
      const btn=event.target.closest?.('#arenaSubnav button[data-target]');
      if(!btn)return;
      const target=btn.dataset.target;
      if(target==='arenaMap'||target==='arenaForgeSection')return;
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
    activate('arenaCombatSection');
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();

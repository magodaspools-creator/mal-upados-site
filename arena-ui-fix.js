// Arena submenu controller: one owner for normal tabs; Map and Forge stay specialized.
(()=>{
  if(window.__arenaUiFixV6)return;
  window.__arenaUiFixV6=true;

  const VIEW_CLASSES=['arena-view-combat','arena-view-shop','arena-view-daily','arena-view-progress','arena-view-ranking'];

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

  function setHeaderLabel(){
    const eyebrow=document.querySelector('.game-topbar>div:first-child .eyebrow');
    if(eyebrow)eyebrow.textContent='Sua conta';
  }

  function setActiveButton(target){
    document.querySelectorAll('#arenaSubnav button[data-target]').forEach(btn=>{
      btn.classList.toggle('active',btn.dataset.target===target);
    });
  }

  function setView(target){
    const main=document.querySelector('main.arena-view-combat, main.arena-view-shop, main.arena-view-daily, main.arena-view-progress, main.arena-view-ranking');
    if(!main)return false;

    const classMap={
      arenaCombatSection:'arena-view-combat',
      arenaShopSection:'arena-view-shop',
      arenaActivitiesSection:'arena-view-daily',
      arenaProgressSection:'arena-view-progress',
      arenaRankingSection:'arena-view-ranking'
    };
    const next=classMap[target];
    if(!next)return false;

    main.classList.remove(...VIEW_CLASSES);
    main.classList.add(next);
    setActiveButton(target);
    main.dataset.arenaView=next;
    return true;
  }

  function refreshTarget(target){
    if(target==='arenaShopSection'&&typeof window.shopRender==='function')window.shopRender();
    if(target==='arenaActivitiesSection'&&typeof window.renderArenaActivities==='function')window.renderArenaActivities();
    if(typeof window.arenaSkillRender==='function')window.arenaSkillRender();
  }

  function activate(target){
    ensureIds();
    if(!setView(target))return false;
    refreshTarget(target);
    return true;
  }

  function bindNav(){
    const nav=document.getElementById('arenaSubnav');
    if(!nav)return false;
    if(nav.dataset.arenaTabsBound==='6')return true;

    nav.querySelectorAll('button[data-target]').forEach(btn=>{
      const target=btn.dataset.target;
      if(target==='arenaMap'||target==='arenaForgeSection')return;
      btn.onclick=(event)=>{
        event.preventDefault();
        activate(target);
      };
    });

    nav.dataset.arenaTabsBound='6';
    return true;
  }

  function init(){
    setHeaderLabel();
    ensureIds();
    activate('arenaCombatSection');

    let tries=0;
    const timer=setInterval(()=>{
      tries++;
      setHeaderLabel();
      ensureIds();
      const bound=bindNav();
      if(bound||tries>300)clearInterval(timer);
    },100);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();

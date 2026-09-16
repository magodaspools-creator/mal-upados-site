// Arena submenu controller: one owner for normal tabs; specialized modules keep Map and Forge.
(()=>{
  if(window.__arenaUiFixV4)return;
  window.__arenaUiFixV4=true;

  const STYLE_ID='arenaRealTabsStyle';

  function setHeaderLabel(){
    const eyebrow=document.querySelector('.game-topbar>div:first-child .eyebrow');
    if(eyebrow)eyebrow.textContent='Sua conta';
  }

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

  function style(){
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent='.arena-tab-hidden{display:none!important}.arena-tab-visible{display:block!important}';
    document.head.appendChild(s);
  }

  function setActiveButton(target){
    document.querySelectorAll('#arenaSubnav button[data-target]').forEach(btn=>btn.classList.toggle('active',btn.dataset.target===target));
  }

  function activate(target){
    const s=ensureIds();
    const panes=[
      ['arenaCombatSection',s.shell],
      ['arenaShopSection',s.shop],
      ['arenaActivitiesSection',s.acts],
      ['arenaProgressSection',s.prog],
      ['arenaRankingSection',s.rank]
    ];
    const targetPane=panes.find(([id])=>id===target);
    if(!targetPane||!targetPane[1])return false;
    style();
    panes.forEach(([id,el])=>{
      if(!el)return;
      const active=id===target;
      el.classList.toggle('arena-tab-hidden',!active);
      el.classList.toggle('arena-tab-visible',active);
    });
    setActiveButton(target);
    if(target==='arenaShopSection'&&typeof window.shopRender==='function')window.shopRender();
    if(target==='arenaActivitiesSection'&&typeof window.renderArenaActivities==='function')window.renderArenaActivities();
    if(typeof window.arenaSkillRender==='function')window.arenaSkillRender();
    return true;
  }

  function neutralizeLegacyHandlers(nav){
    // arena-ui-polish used to attach scroll-based onclick handlers.
    // The submenu is now a real view switcher, so remove those handlers once.
    nav.querySelectorAll('button[data-target]').forEach(btn=>{
      btn.onclick=null;
    });
  }

  function bindNav(){
    const nav=document.getElementById('arenaSubnav');
    if(!nav)return false;
    if(nav.dataset.arenaTabsBound==='1')return true;
    nav.dataset.arenaTabsBound='1';
    neutralizeLegacyHandlers(nav);

    // arena-illustrated-map.js is loaded before this controller and owns Map.
    // Forge keeps its existing specialized handler. Normal tabs belong here.
    nav.addEventListener('click',event=>{
      const btn=event.target.closest?.('button[data-target]');
      if(!btn||btn.parentElement!==nav)return;
      const target=btn.dataset.target;
      if(target==='arenaMap'||target==='arenaForgeSection')return;
      event.preventDefault();
      event.stopImmediatePropagation();
      activate(target);
    },true);

    return true;
  }

  function init(){
    setHeaderLabel();
    style();
    ensureIds();
    activate('arenaCombatSection');
    let tries=0;
    const timer=setInterval(()=>{
      tries++;
      setHeaderLabel();
      ensureIds();
      const bound=bindNav();
      if(bound)activate('arenaCombatSection');
      if(bound||tries>300)clearInterval(timer);
    },100);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();

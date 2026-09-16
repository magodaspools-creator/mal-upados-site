// Arena UI navigation: real view switcher for normal tabs. Map/Forge keep their own handlers.
(()=>{
  if(window.__arenaUiFixV3)return;
  window.__arenaUiFixV3=true;

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

  function bindDelegatedNav(){
    if(document.documentElement.dataset.arenaUiDelegated==='1')return;
    document.documentElement.dataset.arenaUiDelegated='1';
    document.addEventListener('click',(event)=>{
      const btn=event.target.closest?.('#arenaSubnav button[data-target]');
      if(!btn)return;
      const target=btn.dataset.target;
      // Map and Forge have dedicated modules with their own capture handlers.
      // Do not cancel these events here or they become unreachable.
      if(target==='arenaMap'||target==='arenaForgeSection')return;
      event.preventDefault();
      event.stopImmediatePropagation();
      activate(target);
    },true);
  }

  function init(){
    setHeaderLabel();
    style();
    bindDelegatedNav();
    ensureIds();
    activate('arenaCombatSection');
    let tries=0;
    const timer=setInterval(()=>{
      tries++;
      setHeaderLabel();
      ensureIds();
      if(document.getElementById('arenaSubnav'))activate('arenaCombatSection');
      if(document.getElementById('arenaSubnav')||tries>150)clearInterval(timer);
    },100);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();

// UI-only Arena fixes: account header, clean combat view and skill-training visibility.
(()=>{
  if(window.__arenaUiFix)return;
  window.__arenaUiFix=true;

  const setHeaderLabel=()=>{
    const eyebrow=document.querySelector('.game-topbar>div:first-child .eyebrow');
    if(eyebrow)eyebrow.textContent='Sua conta';
  };

  const applyView=(view,activeTarget)=>{
    const main=document.querySelector('main');
    if(!main)return;
    main.classList.remove('arena-view-combat','arena-view-shop','arena-view-daily','arena-view-progress','arena-view-ranking','arena-view-forge');
    main.classList.add(`arena-view-${view}`);
    const nav=document.getElementById('arenaSubnav');
    nav?.querySelectorAll('button[data-target]').forEach(b=>b.classList.toggle('active',b.dataset.target===activeTarget));
  };

  // arena-skills.js is already loaded statically by arena.html. The old fix
  // only retried it once and only after the subnav existed, so a timing race
  // could leave TREINAR SKILL missing forever. Retry independently for a short
  // window until the character panel and the skill module have both settled.
  const ensureSkillTraining=()=>{
    if(document.getElementById('skillTrainBtn'))return true;
    if(!document.querySelector('.character-panel'))return false;
    const retry=document.querySelector('script[data-arena-skill-retry]');
    if(retry)return false;
    const s=document.createElement('script');
    s.src=`arena-skills.js?v=skills-retry-${Date.now()}`;
    s.setAttribute('data-arena-skill-retry','1');
    document.body.appendChild(s);
    setTimeout(()=>{
      s.remove();
      if(!document.getElementById('skillTrainBtn'))ensureSkillTraining();
    },700);
    return false;
  };

  const bindNav=()=>{
    const nav=document.getElementById('arenaSubnav');
    if(!nav)return false;
    if(nav.dataset.uiFixBound==='1')return true;
    nav.dataset.uiFixBound='1';
    const views={arenaCombatSection:'combat',arenaActivitiesSection:'daily',arenaShopSection:'shop',arenaProgressSection:'progress',arenaRankingSection:'ranking',arenaForgeSection:'forge'};
    nav.querySelectorAll('button[data-target]').forEach(btn=>{
      const target=btn.dataset.target;
      if(target==='arenaMap'||!views[target])return;
      btn.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();applyView(views[target],target)},true);
    });
    applyView('combat','arenaCombatSection');
    return true;
  };

  const init=()=>{
    setHeaderLabel();
    let tries=0;
    const timer=setInterval(()=>{
      tries++;
      setHeaderLabel();
      bindNav();
      const skillReady=ensureSkillTraining();
      if(skillReady||tries>120)clearInterval(timer);
    },100);
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();

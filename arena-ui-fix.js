// UI-only Arena fixes: account header, navigation and skill-training visibility.
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

    const id=activeTarget==='arenaForgeSection'?'forgePanel':activeTarget;
    const target=document.getElementById(id);
    if(target&&activeTarget!=='arenaCombatSection'){
      requestAnimationFrame(()=>target.scrollIntoView({behavior:'smooth',block:'start'}));
    }
  };

  const refreshSkill=()=>{
    if(typeof window.arenaSkillRender==='function')window.arenaSkillRender();
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
      btn.addEventListener('click',e=>{
        e.preventDefault();
        e.stopImmediatePropagation();
        applyView(views[target],target);
      },true);
    });
    applyView('combat','arenaCombatSection');
    return true;
  };

  const init=()=>{
    setHeaderLabel();
    refreshSkill();
    let tries=0;
    const timer=setInterval(()=>{
      tries++;
      setHeaderLabel();
      bindNav();
      refreshSkill();
      if((document.getElementById('skillTrainBtn')&&bindNav())||tries>120)clearInterval(timer);
    },100);
  };

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();

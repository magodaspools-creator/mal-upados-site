// UI-only Arena fixes: account header, navigation and skill-training visibility.
(()=>{
  if(window.__arenaUiFix)return;
  window.__arenaUiFix=true;

  const setHeaderLabel=()=>{
    const eyebrow=document.querySelector('.game-topbar>div:first-child .eyebrow');
    if(eyebrow)eyebrow.textContent='Sua conta';
  };

  const ensureSectionIds=()=>{
    const shop=document.getElementById('arenaShopSection')||document.querySelector('.shop-section');
    const acts=document.getElementById('arenaActivitiesSection')||document.querySelector('.activities');
    const prog=document.getElementById('arenaProgressSection')||document.querySelector('.progress-section');
    const rank=document.getElementById('arenaRankingSection')||document.querySelector('.arena-ranking');
    if(shop&&!shop.id)shop.id='arenaShopSection';
    if(acts&&!acts.id)acts.id='arenaActivitiesSection';
    if(prog&&!prog.id)prog.id='arenaProgressSection';
    if(rank&&!rank.id)rank.id='arenaRankingSection';
    return {shop,acts,prog,rank};
  };

  const refreshSkill=()=>{
    if(typeof window.arenaSkillRender==='function')window.arenaSkillRender();
  };

  const targetElement=(targetId)=>{
    ensureSectionIds();
    if(targetId==='arenaCombatSection')return document.getElementById('arenaCombatSection')||document.querySelector('.game-shell');
    if(targetId==='arenaForgeSection')return document.getElementById('forgePanel')||document.getElementById('arenaForgeSection');
    return document.getElementById(targetId);
  };

  const scrollToTarget=(targetId)=>{
    const target=targetElement(targetId);
    if(!target)return false;
    const top=target.getBoundingClientRect().top+window.scrollY-84;
    window.scrollTo({top:Math.max(0,top),behavior:'smooth'});
    return true;
  };

  const setActive=(nav,button)=>{
    nav.querySelectorAll('button[data-target]').forEach(b=>b.classList.toggle('active',b===button));
  };

  const bindNav=()=>{
    const nav=document.getElementById('arenaSubnav');
    if(!nav)return false;
    ensureSectionIds();
    if(nav.dataset.uiFixBound==='1')return true;
    nav.dataset.uiFixBound='1';

    nav.querySelectorAll('button[data-target]').forEach(btn=>{
      btn.addEventListener('click',e=>{
        e.preventDefault();
        e.stopImmediatePropagation();
        const target=btn.dataset.target;
        if(scrollToTarget(target))setActive(nav,btn);
      },true);
    });

    setActive(nav,nav.querySelector('button[data-target="arenaCombatSection"]'));
    return true;
  };

  const init=()=>{
    setHeaderLabel();
    ensureSectionIds();
    refreshSkill();
    let tries=0;
    const timer=setInterval(()=>{
      tries++;
      setHeaderLabel();
      ensureSectionIds();
      bindNav();
      refreshSkill();
      if(tries>120||document.getElementById('arenaSubnav')?.dataset.uiFixBound==='1')clearInterval(timer);
    },100);
  };

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();

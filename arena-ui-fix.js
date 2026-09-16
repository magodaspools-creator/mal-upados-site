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
    const refs=ensureSectionIds();
    if(targetId==='arenaCombatSection')return document.getElementById('arenaCombatSection')||document.querySelector('.game-shell');
    if(targetId==='arenaForgeSection')return document.getElementById('forgePanel')||document.getElementById('arenaForgeSection')||document.querySelector('.forge-section');
    if(targetId==='arenaShopSection')return refs.shop;
    if(targetId==='arenaActivitiesSection')return refs.acts;
    if(targetId==='arenaProgressSection')return refs.prog;
    if(targetId==='arenaRankingSection')return refs.rank;
    return document.getElementById(targetId);
  };

  const go=(targetId)=>{
    const target=targetElement(targetId);
    if(!target)return false;
    target.scrollIntoView({behavior:'smooth',block:'start'});
    return true;
  };

  const setActive=(nav,button)=>{
    nav.querySelectorAll('button[data-target]').forEach(b=>b.classList.toggle('active',b===button));
  };

  const handleClick=(e)=>{
    const btn=e.target.closest?.('#arenaSubnav button[data-target]');
    if(!btn)return;
    const nav=btn.closest('#arenaSubnav');
    if(!nav)return;
    const target=btn.dataset.target;
    if(target==='arenaMap')return;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    if(go(target))setActive(nav,btn);
  };

  const bind=()=>{
    ensureSectionIds();
    if(document.documentElement.dataset.arenaNavFinalBound==='1')return true;
    document.documentElement.dataset.arenaNavFinalBound='1';
    document.addEventListener('click',handleClick,true);
    return true;
  };

  const init=()=>{
    setHeaderLabel();
    ensureSectionIds();
    refreshSkill();
    bind();
    let tries=0;
    const timer=setInterval(()=>{
      tries++;
      setHeaderLabel();
      ensureSectionIds();
      bind();
      if(tries>120)clearInterval(timer);
    },100);
  };

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();

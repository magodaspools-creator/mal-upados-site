// UI-only Arena fixes: account header, real tab navigation and skill-training visibility.
(()=>{
  if(window.__arenaUiFix)return;
  window.__arenaUiFix=true;

  const setHeaderLabel=()=>{
    const eyebrow=document.querySelector('.game-topbar>div:first-child .eyebrow');
    if(eyebrow)eyebrow.textContent='Sua conta';
  };

  const ensureSectionIds=()=>{
    const shell=document.querySelector('.game-shell');
    const shop=document.getElementById('arenaShopSection')||document.querySelector('.shop-section');
    const acts=document.getElementById('arenaActivitiesSection')||document.querySelector('.activities');
    const prog=document.getElementById('arenaProgressSection')||document.querySelector('.progress-section');
    const rank=document.getElementById('arenaRankingSection')||document.querySelector('.arena-ranking');
    if(shell&&!shell.id)shell.id='arenaCombatSection';
    if(shop&&!shop.id)shop.id='arenaShopSection';
    if(acts&&!acts.id)acts.id='arenaActivitiesSection';
    if(prog&&!prog.id)prog.id='arenaProgressSection';
    if(rank&&!rank.id)rank.id='arenaRankingSection';
    return {shell,shop,acts,prog,rank};
  };

  const refreshSkill=()=>{
    if(typeof window.arenaSkillRender==='function')window.arenaSkillRender();
  };

  const injectTabStyle=()=>{
    if(document.getElementById('arenaRealTabsStyle'))return;
    const style=document.createElement('style');
    style.id='arenaRealTabsStyle';
    style.textContent=`
      .arena-tab-hidden{display:none!important}
      .arena-tab-visible{display:block!important}
    `;
    document.head.appendChild(style);
  };

  const sections=()=>{
    const s=ensureSectionIds();
    return [
      ['arenaCombatSection',s.shell],
      ['arenaShopSection',s.shop],
      ['arenaActivitiesSection',s.acts],
      ['arenaProgressSection',s.prog],
      ['arenaRankingSection',s.rank]
    ];
  };

  const activateTab=(target)=>{
    injectTabStyle();
    const items=sections();
    let found=false;
    items.forEach(([id,el])=>{
      if(!el)return;
      const active=id===target;
      el.classList.toggle('arena-tab-hidden',!active);
      el.classList.toggle('arena-tab-visible',active);
      if(active)found=true;
    });
    const nav=document.getElementById('arenaSubnav');
    nav?.querySelectorAll('button[data-target]').forEach(btn=>{
      btn.classList.toggle('active',btn.dataset.target===target);
    });
    if(found){
      window.scrollTo({top:0,behavior:'smooth'});
      if(target==='arenaShopSection'&&typeof window.shopRender==='function')window.shopRender();
      if(target==='arenaActivitiesSection'&&typeof window.renderArenaActivities==='function')window.renderArenaActivities();
      refreshSkill();
    }
    return found;
  };

  const openSpecialTarget=(target)=>{
    if(target==='arenaMap'){
      document.getElementById('p4ScrollMap')?.click();
      return true;
    }
    if(target==='arenaForgeSection'){
      const forge=document.getElementById('p4ForgeBtn')||document.getElementById('p4ForgeBtn2');
      if(forge){forge.click();return true;}
      return false;
    }
    return activateTab(target);
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
        openSpecialTarget(btn.dataset.target);
      },true);
    });
    activateTab('arenaCombatSection');
    return true;
  };

  const init=()=>{
    setHeaderLabel();
    injectTabStyle();
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

(()=>{
  if(window.__arenaSubnavFix)return;
  window.__arenaSubnavFix=true;

  function bind(){
    const nav=document.getElementById('arenaSubnav');
    if(!nav)return false;

    const upperMap=document.querySelector('.game-shell .map');
    if(upperMap)upperMap.id='arenaMap';

    const forgeSection=document.getElementById('arenaPhase4Command');
    if(forgeSection)forgeSection.id='arenaForgeSection';

    if(nav.dataset.bound==='1')return true;
    nav.dataset.bound='1';

    nav.querySelectorAll('button').forEach(btn=>{
      const target=btn.dataset.target;
      btn.onclick=(e)=>{
        e.preventDefault();
        e.stopPropagation();
        const el=document.getElementById(target);
        if(el)el.scrollIntoView({behavior:'smooth',block:'start'});
        nav.querySelectorAll('button').forEach(x=>x.classList.toggle('active',x===btn));
      };
    });
    return true;
  }

  // A UI Polish cria o submenu e a Fase 4 cria a Forja de forma assíncrona.
  const timer=setInterval(()=>{if(bind())clearInterval(timer)},150);
  setTimeout(()=>clearInterval(timer),30000);
})();

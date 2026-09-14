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

    // A navegação por views é responsabilidade do arena-views.js.
    // Este arquivo só prepara os IDs necessários para os destinos.
    return !!upperMap && !!forgeSection;
  }

  const timer=setInterval(()=>{if(bind())clearInterval(timer)},150);
  setTimeout(()=>clearInterval(timer),30000);
})();

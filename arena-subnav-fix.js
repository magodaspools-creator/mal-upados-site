(()=>{
  if(window.__arenaSubnavFix)return;
  window.__arenaSubnavFix=true;

  function bind(){
    const nav=document.getElementById('arenaSubnav');
    if(!nav)return false;

    // The combat map must keep id="map" because arena.js, arena-map-fix.js
    // and arena-world-map.js all use that stable target. The old code renamed
    // it to #arenaMap after startup, which made later renders target null and
    // left "Escolha seu destino" empty.
    const map=document.querySelector('.game-shell .map');
    if(!map)return false;

    const forgeSection=document.getElementById('arenaPhase4Command');
    if(forgeSection)forgeSection.id='arenaForgeSection';

    // Navigation/view state is handled by arena-ui-fix.js.
    return true;
  }

  const timer=setInterval(()=>{if(bind())clearInterval(timer)},150);
  setTimeout(()=>clearInterval(timer),30000);
})();

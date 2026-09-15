(()=>{
  if(window.__arenaStartupFix)return;
  window.__arenaStartupFix=true;

  function loadScript(src,attr){
    if(document.querySelector(`script[${attr}]`))return;
    const s=document.createElement('script');
    s.src=src;
    s.setAttribute(attr,'1');
    document.body.appendChild(s);
  }

  function loadSiteAuth(){loadScript('site-auth.js?v=global-account-20260914','data-mal-site-auth')}
  function loadPolish(){loadScript('arena-ui-polish.js?v=ui-polish-20260914a','data-arena-ui-polish')}
  function loadSubnavFix(){loadScript('arena-subnav-fix.js?v=subnav-fix-20260915b','data-arena-subnav-fix')}
  function loadIllustratedMap(){loadScript('arena-illustrated-map.js?v=illustrated-map-20260915','data-arena-illustrated-map')}
  function loadUiFix(){loadScript('arena-ui-fix.js?v=ui-fix-20260915d','data-arena-ui-fix')}
  function loadGlobalSync(){loadScript('arena-global-sync.js?v=global-sync-20260915','data-arena-global-sync')}
  function loadForgeV2(){loadScript('arena-forge-v2.js?v=forge-v2-20260914b','data-arena-forge-v2')}
  function loadForgeBalance(){loadScript('arena-forge-balance-fix.js?v=forge-balance-20260914','data-arena-forge-balance')}
  function loadCursedRuins(){loadScript('arena-cursed-ruins.js?v=cursed-ruins-20260914','data-arena-cursed-ruins')}
  function loadCursedRuinsUI(){loadScript('arena-cursed-ruins-ui.js?v=cursed-ruins-ui-20260914','data-arena-cursed-ruins-ui')}
  function loadCharacterCreation(){loadScript('arena-character-creation.js?v=character-creation-20260914','data-arena-character-creation')}
  function loadCharacterSyncFix(){loadScript('arena-character-sync-fix.js?v=character-sync-fix-20260915a','data-arena-character-sync-fix')}
  function loadCharacterCreationUI(){loadScript('arena-character-creation-ui.js?v=character-creation-ui-20260915','data-arena-character-creation-ui')}
  function loadWorldMap(){loadScript('arena-world-map.js?v=world-map-20260914','data-arena-world-map')}

  function boot(){
    loadSiteAuth();
    loadCharacterCreation();
    loadCharacterSyncFix();
    loadCharacterCreationUI();
    loadGlobalSync();
    loadPolish();
    loadSubnavFix();
    loadWorldMap();
    loadIllustratedMap();
    loadUiFix();
    // arena-views.js foi retirado do boot.
    // Ele movia elementos do DOM depois do primeiro paint e causava a "segunda tela"/pisca na Home.
    setTimeout(loadForgeV2,500);
    setTimeout(loadForgeBalance,850);
    setTimeout(loadCursedRuins,1000);
    setTimeout(loadCursedRuinsUI,1200);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,0),{once:true});
  else setTimeout(boot,0);
})();

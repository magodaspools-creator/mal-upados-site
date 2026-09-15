(()=>{
  if(window.__arenaStartupFix)return;
  window.__arenaStartupFix=true;

  // Legacy modules kept in the repository are intentionally disabled here.
  // Their systems now belong to the current Forge/Dungeon owners.
  window.__arenaPhase4=true;
  window.__arenaCursedRuins=true;
  window.__arenaCursedRuinsUI=true;

  function loadScript(src,attr){
    if(document.querySelector(`script[${attr}]`))return;
    const s=document.createElement('script');
    s.src=src;
    s.setAttribute(attr,'1');
    document.body.appendChild(s);
  }
  function loadSiteAuth(){loadScript('site-auth.js?v=global-account-20260914','data-mal-site-auth')}
  function loadPolish(){loadScript('arena-ui-polish.js?v=ui-polish-20260914a','data-arena-ui-polish')}
  function loadSubnavFix(){loadScript('arena-subnav-fix.js?v=arena-subnav-fix-20260915c','data-arena-subnav-fix')}
  function loadIllustratedMap(){loadScript('arena-illustrated-map.js?v=illustrated-map-20260915','data-arena-illustrated-map')}
  function loadUiFix(){loadScript('arena-ui-fix.js?v=ui-fix-20260915e','data-arena-ui-fix')}
  function loadGlobalSync(){loadScript('arena-global-sync.js?v=global-sync-20260915','data-arena-global-sync')}
  function loadSkillCharacterFix(){loadScript('arena-skill-character-fix.js?v=skill-character-fix-20260915','data-arena-skill-character-fix')}
  function loadForgeV2(){loadScript('arena-forge-v2.js?v=forge-v3-20260915','data-arena-forge-v2')}
  function loadDungeon(){loadScript('arena-dungeon.js?v=abyssal-gardens-20260915','data-arena-dungeon')}
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
    loadSkillCharacterFix();
    setTimeout(loadForgeV2,500);
    setTimeout(loadDungeon,750);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,0),{once:true});
  else setTimeout(boot,0);
})();

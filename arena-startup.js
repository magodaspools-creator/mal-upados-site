(()=>{
  if(window.__arenaStartup)return;
  window.__arenaStartup=true;

  function loadScript(src,attr){
    const base=src.split('?')[0];
    if(document.querySelector(`script[src^="${base}"]`))return;
    const s=document.createElement('script');
    s.src=src;
    if(attr)s.setAttribute(attr,'1');
    document.body.appendChild(s);
  }

  const loadSiteAuth=()=>loadScript('site-auth.js?v=global-account-20260914','data-mal-site-auth');
  const loadPolish=()=>loadScript('arena-ui-polish.js?v=ui-polish-20260914a','data-arena-ui-polish');
  const loadSubnavFix=()=>loadScript('arena-subnav-fix.js?v=arena-subnav-fix-20260915c','data-arena-subnav-fix');
  const loadIllustratedMap=()=>loadScript('arena-illustrated-map.js?v=illustrated-map-20260915','data-arena-illustrated-map');
  const loadUiFix=()=>loadScript('arena-ui-fix.js?v=ui-fix-20260916g','data-arena-ui-fix');
  const loadGlobalSync=()=>loadScript('arena-global-sync.js?v=global-sync-20260915','data-arena-global-sync');
  const loadSkillCharacter=()=>loadScript('arena-skill-character-fix.js?v=skill-character-fix-20260915','data-arena-skill-character-fix');
  const loadForge=()=>loadScript('arena-forge-v2.js?v=forge-v4-20260915','data-arena-forge-v2');
  const loadDungeon=()=>loadScript('arena-dungeon.js?v=abyssal-gardens-v2-20260915','data-arena-dungeon');
  const loadCharacterCreation=()=>loadScript('arena-character-creation.js?v=character-creation-20260915b','data-arena-character-creation');
  const loadCharacterSync=()=>loadScript('arena-character-sync-fix.js?v=character-sync-fix-20260915a','data-arena-character-sync-fix');
  const loadCharacterCreationUI=()=>loadScript('arena-character-creation-ui.js?v=character-creation-ui-20260915','data-arena-character-creation-ui');
  const loadWorldMap=()=>loadScript('arena-world-map.js?v=world-map-20260914','data-arena-world-map');

  const loadLegacyFeatures=()=>{
    const files=[
      'arena-campaign-timer-fix.js?v=timer-fix-20260912c',
      'arena-bestiary-platinum-popup.js?v=platinum-popup-20260912a',
      'arena-combat-final-fix.js?v=combat-fix-20260912',
      'arena-flee-fix.js?v=flee-fix-20260915b',
      'arena-gold-universal.js?v=gold-universal-20260912',
      'arena-account-systems.js?v=account-systems-20260912a',
      'arena-profile-advanced.js?v=profile-advanced-20260912b',
      'arena-achievements-v2.js?v=achievements-v2-20260912a',
      'arena-ranking-v2.js?v=ranking-v2-20260912c'
    ];
    files.forEach(src=>loadScript(src,'data-arena-feature'));
  };

  function boot(){
    loadSiteAuth();
    loadCharacterCreation();
    loadCharacterSync();
    loadCharacterCreationUI();
    loadGlobalSync();
    loadPolish();
    loadSubnavFix();
    loadWorldMap();
    loadIllustratedMap();
    loadUiFix();
    loadSkillCharacter();
    setTimeout(loadForge,500);
    setTimeout(loadDungeon,750);
    setTimeout(loadLegacyFeatures,1200);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,0),{once:true});
  else setTimeout(boot,0);
})();

(()=>{
  if(window.__arenaStartupFix)return;
  window.__arenaStartupFix=true;

  function loadScript(src,attr){
    if(document.querySelector(`script[${attr}]`))return;
    const s=document.createElement('script');s.src=src;s.setAttribute(attr,'1');document.body.appendChild(s);
  }
  function loadPolish(){loadScript('arena-ui-polish.js?v=ui-polish-20260914a','data-arena-ui-polish')}
  function loadSubnavFix(){loadScript('arena-subnav-fix.js?v=subnav-fix-20260914','data-arena-subnav-fix')}
  function loadViews(){loadScript('arena-views.js?v=views-20260914','data-arena-views')}
  function loadForgeV2(){loadScript('arena-forge-v2.js?v=forge-v2-20260914b','data-arena-forge-v2')}
  function loadForgeBalance(){loadScript('arena-forge-balance-fix.js?v=forge-balance-20260914','data-arena-forge-balance')}
  function loadCursedRuins(){loadScript('arena-cursed-ruins.js?v=cursed-ruins-20260914','data-arena-cursed-ruins')}

  function boot(){
    if(typeof window.load==='function'){
      try{window.load()}catch(e){console.error('Arena startup fix:',e)}
    }
    if(typeof members!=='undefined'&&Array.isArray(members)&&members.length){
      const menu=document.getElementById('characterPickerMenu');
      if(menu&&typeof window.__arenaCharacterDraw==='function')window.__arenaCharacterDraw();
      if(typeof window.renderAll==='function'&&typeof game!=='undefined'&&game)window.renderAll();
    }

    // Ordem: acabamento visual -> destinos -> views -> forja -> balanceamento -> novo mapa.
    loadPolish();
    loadSubnavFix();
    setTimeout(loadViews,250);
    setTimeout(loadForgeV2,500);
    setTimeout(loadForgeBalance,850);
    setTimeout(loadCursedRuins,1000);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,0),{once:true});
  else setTimeout(boot,0);
})();

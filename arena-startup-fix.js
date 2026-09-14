(()=>{
  if(window.__arenaStartupFix)return;
  window.__arenaStartupFix=true;

  function loadPolish(){
    if(document.querySelector('script[data-arena-ui-polish]'))return;
    const s=document.createElement('script');
    s.src='arena-ui-polish.js?v=ui-polish-20260914a';
    s.dataset.arenaUiPolish='1';
    document.body.appendChild(s);
  }

  function loadSubnavFix(){
    if(document.querySelector('script[data-arena-subnav-fix]'))return;
    const s=document.createElement('script');
    s.src='arena-subnav-fix.js?v=subnav-fix-20260914';
    s.dataset.arenaSubnavFix='1';
    document.body.appendChild(s);
  }

  function boot(){
    // arena.js ainda possui compatibilidade com a antiga roleta, mas a Fase 3
    // removeu esses elementos da página. O erro de null interrompia load().
    if(typeof window.load==='function'){
      try{window.load()}catch(e){console.error('Arena startup fix:',e)}
    }

    // Se o carregamento da guilda já terminou, força a reconstrução do picker.
    if(typeof members!=='undefined'&&Array.isArray(members)&&members.length){
      const menu=document.getElementById('characterPickerMenu');
      if(menu&&typeof window.__arenaCharacterDraw==='function')window.__arenaCharacterDraw();
      if(typeof window.renderAll==='function'&&typeof game!=='undefined'&&game)window.renderAll();
    }

    // Camada final de acabamento visual/UX. Ela espera a Fase 4 existir antes de agir.
    loadPolish();
    loadSubnavFix();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,0),{once:true});
  else setTimeout(boot,0);
})();

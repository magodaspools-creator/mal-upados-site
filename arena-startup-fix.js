(()=>{
  if(window.__arenaStartupFix)return;
  window.__arenaStartupFix=true;

  function boot(){
    // arena.js ainda possui compatibilidade com a antiga roleta, mas a Fase 3
    // removeu esses elementos da página. O erro de null interrompia load().
    if(typeof window.load==='function'){
      try{window.load()}catch(e){console.error('Arena startup fix:',e)}
    }

    const picker=document.getElementById('characterPicker');
    const topbar=document.querySelector('.game-topbar');
    if(topbar&&!document.getElementById('arenaStartBtn')){
      const btn=document.createElement('button');
      btn.id='arenaStartBtn';
      btn.className='btn active arena-start-btn';
      btn.type='button';
      btn.textContent='⚔ ENTRAR NA ARENA';
      btn.onclick=()=>{
        document.querySelector('.game-shell')?.scrollIntoView({behavior:'smooth',block:'start'});
        document.querySelector('.map')?.scrollIntoView({behavior:'smooth',block:'center'});
        picker?.classList.remove('open');
      };
      topbar.appendChild(btn);
    }

    // Se o carregamento da guilda já terminou, força a reconstrução do picker.
    if(typeof members!=='undefined'&&Array.isArray(members)&&members.length){
      const menu=document.getElementById('characterPickerMenu');
      if(menu&&typeof window.__arenaCharacterDraw==='function')window.__arenaCharacterDraw();
      if(typeof window.renderAll==='function'&&typeof game!=='undefined'&&game)window.renderAll();
    }
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,0),{once:true});
  else setTimeout(boot,0);
})();

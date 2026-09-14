(()=>{
  if(window.__arenaSubnavFix)return;
  window.__arenaSubnavFix=true;

  function bind(){
    const nav=document.getElementById('arenaSubnav');
    if(!nav)return false;

    if(nav.dataset.bound==='1')return true;
    nav.dataset.bound='1';

    nav.querySelectorAll('button').forEach(btn=>{
      const target=btn.dataset.target;
      btn.onclick=(e)=>{
        e.preventDefault();
        e.stopPropagation();

        // Mapa e Forja são ações, não âncoras de rolagem.
        if(target==='arenaMap'){
          if(typeof window.__arenaOpenMap==='function')window.__arenaOpenMap();
          return;
        }
        if(target==='arenaForgeSection'){
          if(typeof window.__arenaOpenForge==='function')window.__arenaOpenForge();
          return;
        }

        const el=document.getElementById(target);
        if(el)el.scrollIntoView({behavior:'smooth',block:'start'});
        nav.querySelectorAll('button').forEach(x=>x.classList.toggle('active',x===btn));
      };
    });
    return true;
  }

  // A UI Polish cria o submenu depois do startup; espera sem alterar o mapa superior.
  const timer=setInterval(()=>{if(bind())clearInterval(timer)},150);
  setTimeout(()=>clearInterval(timer),30000);
})();

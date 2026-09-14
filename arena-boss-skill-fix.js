(()=>{
  if(window.__arenaBossSkillFix)return;
  window.__arenaBossSkillFix=true;

  // Intercepta o clique no botão do Boss em CAPTURE, antes do onclick
  // instalado pelo renderBossBattle. Assim o primeiro ataque já usa o
  // combate autoritativo do Boss, sem depender do segundo render.
  function intercept(event){
    const btn=event.target?.closest?.('#attackBtn');
    if(!btn||typeof battle==='undefined'||!battle?.isBoss)return;
    const direct=window.__arenaBossAttackDirect;
    if(typeof direct!=='function')return;
    event.preventDefault();
    event.stopImmediatePropagation();
    direct();
  }

  document.addEventListener('click',intercept,true);

  function bind(){
    const btn=document.getElementById('attackBtn');
    if(!btn||typeof battle==='undefined'||!battle?.isBoss)return;
    // Mantém uma referência coerente caso algum código externo leia onclick.
    if(typeof window.__arenaBossAttackDirect==='function'){
      btn.onclick=window.__arenaBossAttackDirect;
      btn.__arenaBossSkillBound=true;
    }
  }

  const observer=new MutationObserver(bind);
  observer.observe(document.body,{childList:true,subtree:true});
  bind();
})();

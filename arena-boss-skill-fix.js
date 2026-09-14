(()=>{
  if(window.__arenaBossSkillFix)return;
  window.__arenaBossSkillFix=true;

  function bind(){
    const btn=document.getElementById('attackBtn');
    if(!btn)return;
    // Bosses renderizam o botão diretamente e antes usavam a referência
    // lexical `attack`, podendo escapar do wrapper final em window.attack.
    if(btn.__arenaBossSkillBound)return;
    btn.onclick=()=>{
      if(typeof window.attack==='function')return window.attack();
    };
    btn.__arenaBossSkillBound=true;
  }

  const observer=new MutationObserver(bind);
  observer.observe(document.body,{childList:true,subtree:true});
  bind();
})();

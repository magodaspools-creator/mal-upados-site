(()=>{
  if(window.__arenaSkillDebug)return;
  window.__arenaSkillDebug=true;

  const el=document.createElement('div');
  el.id='arenaSkillDebug';
  el.style.cssText='position:fixed;right:12px;bottom:12px;z-index:2147483647;background:#111;color:#fff;border:2px solid #d4af37;border-radius:8px;padding:12px;font:13px monospace;white-space:pre-line;box-shadow:0 8px 30px #000;min-width:260px';
  el.textContent='SKILL DEBUG CARREGADO\nAguardando batalha...';
  document.body.appendChild(el);

  function update(){
    try{
      const x=window.arenaSkillCurrent?.();
      const b=window.battle;
      const base=b&&Number(b.baseAttack)||0;
      const eff=b&&Number(b.attack)||0;
      const mult=x&&Number(x.multiplier)||1;
      const expected=Math.floor(base*mult);
      el.textContent=
        'SKILL DEBUG CARREGADO\n'+
        'SKILL: '+(x?.value??'?')+' | x'+mult.toFixed(2)+'\n'+
        'BASE: '+base+' | ATTACK: '+eff+'\n'+
        'ESPERADO: '+expected+'\n'+
        'BATALHA: '+(b?'SIM':'NÃO');
    }catch(e){
      el.textContent='SKILL DEBUG\nERRO: '+e.message;
    }
  }

  update();
  setInterval(update,300);
})();

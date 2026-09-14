(()=>{
  if(window.__arenaSkillDebug)return;
  window.__arenaSkillDebug=true;
  function update(){
    try{
      const x=window.arenaSkillCurrent?.();
      if(!x)return;
      const base=battle&&Number(battle.baseAttack)||0;
      const eff=battle&&Number(battle.attack)||0;
      const mult=Number(x.multiplier)||1;
      const expected=Math.floor(base*mult);
      let el=document.getElementById('arenaSkillDebug');
      if(!el){el=document.createElement('div');el.id='arenaSkillDebug';el.style.cssText='position:fixed;right:12px;bottom:12px;z-index:999999;background:#111;color:#eee;border:1px solid #806d38;padding:10px;font:12px monospace;white-space:pre-line;box-shadow:0 8px 30px #000';document.body.appendChild(el)}
      el.textContent=`SKILL ${x.value} | x${mult.toFixed(2)}\\nBASE ${base} | ATTACK ${eff} | ESPERADO ${expected}`;
    }catch(e){}
  }
  setInterval(update,300);
})();

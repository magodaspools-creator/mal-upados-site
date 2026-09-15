(()=>{
  if(window.__arenaSkillFinalFix)return;
  window.__arenaSkillFinalFix=true;

  function installStartHook(){
    if(typeof window.startBattle!=='function')return false;
    if(window.__arenaSkillFinalStartHook)return true;

    const originalStart=window.startBattle;
    window.startBattle=function(...args){
      const r=originalStart.apply(this,args);
      try{
        window.__arenaBattleRef=(typeof battle!=='undefined')?battle:null;
        const b=window.__arenaBattleRef;
        // arena-skill-power-fix captura o ataque cru e aplica a Skill uma única vez.
        // Não sobrescreva esse valor com o ataque já multiplicado.
        if(b&&!window.__arenaSkillPowerFix)b.baseAttack=Number(b.attack)||0;
      }catch{window.__arenaBattleRef=null}
      return r;
    };
    window.__arenaSkillFinalStartHook=true;
    return true;
  }

  function installAttack(){
    if(typeof window.attack!=='function')return false;
    if(window.__arenaSkillFinalAttack)return true;

    const original=window.attack;
    window.attack=function(...args){
      // A aplicação real da Skill pertence a uma única camada: o motor elemental.
      // Este wrapper apenas preserva a compatibilidade sem multiplicar o dano de novo.
      return original.apply(this,args);
    };
    window.__arenaSkillFinalAttack=true;
    return true;
  }

  function retry(){
    const a=installStartHook();
    const b=installAttack();
    if(!a||!b)setTimeout(retry,50);
  }
  retry();
})();

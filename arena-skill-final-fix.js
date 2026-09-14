(()=>{
  if(window.__arenaSkillFinalFix)return;
  window.__arenaSkillFinalFix=true;

  function skill(){
    try{
      const x=window.arenaSkillCurrent?.();
      return {value:Number(x?.value)||10,mult:Number(x?.multiplier)||1};
    }catch{return {value:10,mult:1}}
  }

  // The existing combat stack replaces startBattle/attack several times.
  // Apply the skill at the last possible layer, immediately before the real attack.
  function install(){
    if(typeof window.attack!=='function')return false;
    if(window.__arenaSkillFinalAttack)return true;

    const original=window.attack;
    window.attack=function(...args){
      if(typeof battle!=='undefined'&&battle){
        const x=skill();
        if(!Number.isFinite(Number(battle.baseAttack))||Number(battle.baseAttack)<=0){
          battle.baseAttack=Number(battle.attack)||0;
        }
        const base=Number(battle.baseAttack)||0;
        if(base>0){
          battle.attack=Math.max(1,Math.floor(base*x.mult));
        }
      }
      return original.apply(this,args);
    };
    window.__arenaSkillFinalAttack=true;
    return true;
  }

  function retry(){
    if(!install())setTimeout(retry,50);
  }
  retry();
})();

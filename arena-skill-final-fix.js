(()=>{
  if(window.__arenaSkillFinalFix)return;
  window.__arenaSkillFinalFix=true;

  function skill(){
    try{
      const x=window.arenaSkillCurrent?.();
      return {value:Number(x?.value)||10,mult:Number(x?.multiplier)||1};
    }catch{return {value:10,mult:1}}
  }

  function getBattle(){
    try{
      if(window.__arenaBattleRef)return window.__arenaBattleRef;
      if(typeof battle!=='undefined')return battle;
    }catch{}
    return null;
  }

  function installStartHook(){
    if(typeof window.startBattle!=='function')return false;
    if(window.__arenaSkillFinalStartHook)return true;

    const originalStart=window.startBattle;
    window.startBattle=function(...args){
      const r=originalStart.apply(this,args);
      try{window.__arenaBattleRef=(typeof battle!=='undefined')?battle:null}catch{window.__arenaBattleRef=null}
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
      const b=getBattle();
      const x=skill();

      if(b){
        if(!Number.isFinite(Number(b.baseAttack))||Number(b.baseAttack)<=0){
          b.baseAttack=Number(b.attack)||0;
        }
        const base=Number(b.baseAttack)||0;
        const effective=Math.max(1,Math.floor(base*x.mult));
        if(base>0)b.attack=effective;
      }

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

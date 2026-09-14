(()=>{
  if(window.__arenaSkillPowerFix)return;
  window.__arenaSkillPowerFix=true;

  function skillValue(){
    try{
      const c=typeof window.arenaSkillCurrent==='function'?window.arenaSkillCurrent():null;
      const v=Number(c?.value);
      return Number.isFinite(v)?Math.max(10,v):10;
    }catch{return 10}
  }

  function skillMultiplier(s){
    s=Math.max(10,Number(s)||10);
    if(s<=20)return 1+(s-10)*0.03;
    if(s<=30)return 1.3+(s-20)*0.04;
    if(s<=40)return 1.7+(s-30)*0.05;
    if(s<=50)return 2.2+(s-40)*0.06;
    if(s<=60)return 2.8+(s-50)*0.07;
    if(s<=70)return 3.5+(s-60)*0.08;
    if(s<=80)return 4.3+(s-70)*0.09;
    if(s<=90)return 5.2+(s-80)*0.10;
    return 6.2+(s-90)*0.11;
  }

  function applySkillPower(){
    if(!window.battle)return;
    let base=Number(window.battle.baseAttack);
    if(!Number.isFinite(base)||base<=0){
      base=Number(window.battle.attack)||0;
      window.battle.baseAttack=base;
    }
    const s=skillValue();
    window.battle.attack=Math.max(1,Math.floor(base*skillMultiplier(s)));
  }

  if(typeof window.startBattle==='function'){
    const oldStart=window.startBattle;
    window.startBattle=function(...args){
      oldStart.apply(this,args);
      if(window.battle){
        // Capture the raw Level + Equipment attack once, then Skill scales it.
        const current=Number(window.battle.baseAttack);
        if(!Number.isFinite(current)||current<=0){
          window.battle.baseAttack=Number(window.battle.attack)||0;
        }
        applySkillPower();
      }
    };
  }

  if(typeof window.attack==='function'){
    const oldAttack=window.attack;
    window.attack=function(...args){
      if(!window.battle)return oldAttack.apply(this,args);
      // Re-apply on EVERY attack so no later combat wrapper can erase Skill power.
      applySkillPower();
      return oldAttack.apply(this,args);
    };
  }

  window.arenaSkillPowerFix={apply:applySkillPower,multiplier:skillMultiplier};
})();

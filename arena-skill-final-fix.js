(()=>{
  if(window.__arenaSkillFinalFix)return;
  window.__arenaSkillFinalFix=true;

  const el=document.createElement('div');
  el.id='arenaSkillFinalDebug';
  el.style.cssText='position:fixed;right:12px;bottom:12px;z-index:2147483647;background:#111;color:#fff;border:2px solid #d4af37;border-radius:8px;padding:12px;font:13px monospace;white-space:pre-line;box-shadow:0 8px 30px #000;min-width:330px';
  el.textContent='SKILL FINAL FIX\nInstalando...';
  document.body.appendChild(el);

  let last={installed:false,startHook:false,seenBattle:false,skill:10,mult:1,base:0,effective:0,before:null,after:null};

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

  function render(){
    el.textContent=
      'SKILL FINAL FIX\n'+
      'INSTALADO: '+(last.installed?'SIM':'NAO')+'\n'+
      'START HOOK: '+(last.startHook?'SIM':'NAO')+'\n'+
      'BATALHA VISTA: '+(last.seenBattle?'SIM':'NAO')+'\n'+
      'SKILL: '+last.skill+' | x'+Number(last.mult).toFixed(2)+'\n'+
      'BASE ATK: '+(last.base||'?')+'\n'+
      'ATK FINAL: '+(last.effective||'?')+'\n'+
      'HP INICIO: '+(last.before==null?'?':last.before)+'\n'+
      'HP FIM: '+(last.after==null?'?':last.after);
  }

  function installStartHook(){
    if(typeof window.startBattle!=='function')return false;
    if(window.__arenaSkillFinalStartHook)return true;

    const originalStart=window.startBattle;
    window.startBattle=function(...args){
      const r=originalStart.apply(this,args);
      try{window.__arenaBattleRef=(typeof battle!=='undefined')?battle:null}catch{window.__arenaBattleRef=null}
      last.startHook=!!window.__arenaBattleRef;
      render();
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
      last.skill=x.value;
      last.mult=x.mult;
      last.seenBattle=!!b;
      last.before=b?Number(b.hp):null;

      if(b){
        if(!Number.isFinite(Number(b.baseAttack))||Number(b.baseAttack)<=0){
          b.baseAttack=Number(b.attack)||0;
        }
        const base=Number(b.baseAttack)||0;
        const effective=Math.max(1,Math.floor(base*x.mult));
        if(base>0)b.attack=effective;
        last.base=base;
        last.effective=effective;
      }else{
        last.base=0;
        last.effective=0;
      }

      render();
      const r=original.apply(this,args);
      const after=getBattle();
      last.after=after?Number(after.hp):null;
      render();
      return r;
    };
    window.__arenaSkillFinalAttack=true;
    last.installed=true;
    render();
    return true;
  }

  function retry(){
    const a=installStartHook();
    const b=installAttack();
    if(!a||!b)setTimeout(retry,50);
    else render();
  }
  retry();
})();

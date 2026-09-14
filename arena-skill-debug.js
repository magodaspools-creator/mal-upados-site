(()=>{
  if(window.__arenaSkillDebug)return;
  window.__arenaSkillDebug=true;

  const el=document.createElement('div');
  el.id='arenaSkillDebug';
  el.style.cssText='position:fixed;right:12px;bottom:12px;z-index:2147483647;background:#111;color:#fff;border:2px solid #d4af37;border-radius:8px;padding:12px;font:13px monospace;white-space:pre-line;box-shadow:0 8px 30px #000;min-width:320px';
  el.textContent='SKILL DEBUG\nInstrumentando combate...';
  document.body.appendChild(el);

  let lastHp=null,lastAttack=null,lastBattle=false,attackCalls=0,startCalls=0;

  function getSkill(){
    try{return window.arenaSkillCurrent?.()||null}catch{return null}
  }

  function patch(){
    // battle is lexical inside arena.js, so window.battle cannot expose it.
    // Instead observe the rendered battle UI and instrument the global functions.
    if(typeof window.startBattle==='function'&&!window.__arenaSkillDebugStart){
      const oldStart=window.startBattle;
      window.startBattle=function(...args){
        startCalls++;
        const r=oldStart.apply(this,args);
        setTimeout(update,0);
        return r;
      };
      window.__arenaSkillDebugStart=true;
    }
    if(typeof window.attack==='function'&&!window.__arenaSkillDebugAttack){
      const oldAttack=window.attack;
      window.attack=function(...args){
        attackCalls++;
        const before=readHp();
        const r=oldAttack.apply(this,args);
        const after=readHp();
        lastHp={before,after,damage:before!=null&&after!=null?before-after:null};
        setTimeout(update,0);
        return r;
      };
      window.__arenaSkillDebugAttack=true;
    }
  }

  function readHp(){
    const area=document.getElementById('battleArea');
    if(!area)return null;
    const metas=[...area.querySelectorAll('.fighter-meta')];
    if(metas.length<2)return null;
    const text=metas[metas.length-1]?.textContent||'';
    const m=text.match(/HP\s*([\d.,]+)/i);
    if(!m)return null;
    return Number(m[1].replace(/\./g,'').replace(',','.'));
  }

  function update(){
    patch();
    const x=getSkill();
    const area=document.getElementById('battleArea');
    const active=!!area?.querySelector('#attackBtn');
    const baseFromText=area?.textContent?.match(/(?:ataque|ATK|attack)\s*[:=]?\s*(\d+)/i)?.[1];
    const skill=x?.value??'?';
    const mult=Number(x?.multiplier)||1;
    const dmg=lastHp?.damage;
    el.textContent=
      'SKILL DEBUG\n'+
      'SKILL: '+skill+' | x'+mult.toFixed(2)+'\n'+
      'BATALHA: '+(active?'SIM':'NÃO')+'\n'+
      'DANO ÚLTIMO ATAQUE: '+(dmg==null?'?':dmg)+'\n'+
      'HP ANTES → DEPOIS: '+(lastHp?lastHp.before+' → '+lastHp.after:'?')+'\n'+
      'ATAQUES INTERCEPTADOS: '+attackCalls+'\n'+
      'STARTS INTERCEPTADOS: '+startCalls+'\n'+
      'ATK TEXTO: '+(baseFromText||'?');
  }

  patch();
  update();
  setInterval(update,300);
})();

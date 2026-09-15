(()=>{
  if(window.__arenaBugfixes20260915)return;
  window.__arenaBugfixes20260915=true;

  // This file is intentionally limited to fixes that are not part of arena.js.
  // Daily challenge state and map progression now live in arena.js itself.

  function bindArenaStart(){
    const btn=document.getElementById('arenaStartBtn');
    if(!btn||btn.dataset.arenaBugfixBound==='1')return;
    btn.dataset.arenaBugfixBound='1';
    btn.addEventListener('click',()=>{
      const shell=document.querySelector('.game-shell');
      shell?.scrollIntoView({behavior:'smooth',block:'start'});
      setTimeout(()=>document.getElementById('characterPickerBtn')?.focus(),350);
    });
  }

  function repairForgeLifesteal(){
    if(window.__arenaForgeLifestealBugfix)return true;
    if(typeof window.attack!=='function')return false;
    const original=window.attack;
    window.attack=function(...args){
      const b=(typeof battle!=='undefined'&&battle)||window.__arenaBattleRef||null;
      const before=b?Number(b.hp):NaN;
      const result=original.apply(this,args);
      try{
        const ls=b?Number(b.forgeLifesteal)||0:0;
        const after=b?Number(b.hp):NaN;
        if(b&&battle===b&&before>0&&Number.isFinite(after)&&after>0&&ls>0){
          const dealt=Math.max(0,before-after);
          if(dealt>0)b.playerHp=Math.min(Number(b.playerMax)||b.playerHp,b.playerHp+Math.max(1,Math.floor(dealt*ls/100)));
        }
      }catch{}
      return result;
    };
    window.__arenaForgeLifestealBugfix=true;
    return true;
  }

  function boot(){bindArenaStart();repairForgeLifesteal()}
  const observer=new MutationObserver(()=>{bindArenaStart();repairForgeLifesteal()});
  observer.observe(document.body,{childList:true,subtree:true});
  let tries=0;
  const timer=setInterval(()=>{
    tries++;
    if(typeof game!=='undefined'&&game){boot();if(tries>80)clearInterval(timer)}
    else if(tries>120)clearInterval(timer);
  },250);
})();
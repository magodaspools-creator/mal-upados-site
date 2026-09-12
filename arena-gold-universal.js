(()=>{
  if(window.__arenaGoldUniversalInstalled)return;
  window.__arenaGoldUniversalInstalled=true;

  let lastGold=null;
  let lastLevel=null;

  function refresh(force=false){
    if(typeof game==='undefined'||!game)return;
    const gold=Number(game.gold)||0;
    const level=Number(game.level)||1;
    if(!force&&gold===lastGold&&level===lastLevel)return;
    lastGold=gold;
    lastLevel=level;

    const stats=document.getElementById('gold');
    const shop=document.getElementById('shopGold');
    if(stats)stats.textContent=fmt(gold);
    if(shop)shop.textContent=fmt(gold);

    if(typeof window.shopRender==='function')window.shopRender();
  }

  // Gold universal: qualquer alteração feita pelo Arena é refletida na loja imediatamente.
  window.arenaGold={
    get:()=>Number(game?.gold)||0,
    set:value=>{
      if(typeof game==='undefined'||!game)return 0;
      game.gold=Math.max(0,Number(value)||0);
      persist();
      refresh(true);
      return game.gold;
    },
    add:value=>window.arenaGold.set(window.arenaGold.get()+(Number(value)||0)),
    spend:value=>{
      const amount=Math.max(0,Number(value)||0);
      if(window.arenaGold.get()<amount)return false;
      window.arenaGold.set(window.arenaGold.get()-amount);
      return true;
    }
  };

  window.addEventListener('arena:gold-changed',()=>refresh(true));
  setInterval(refresh,150);
  setTimeout(()=>refresh(true),100);
})();

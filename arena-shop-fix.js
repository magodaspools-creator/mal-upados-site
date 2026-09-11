// Correções complementares da Loja da Arena.
// 1) Garante que a loja seja renderizada no primeiro login.
// 2) Comprar Trinket II/III substitui a versão anterior do mesmo tipo na Backpack.
(()=>{
  const trinkets=()=>window.arenaTrinkets?.TRINKETS||[];

  function renderShop(){
    if(typeof game==='undefined'||!game)return false;
    const box=document.getElementById('shopItems');
    if(!box||typeof window.shopRender!=='function')return false;
    try{window.shopRender();return true}catch(error){console.error('Arena Shop Fix:',error);return false}
  }

  function findUpgrade(item){
    return trinkets().filter(x=>x.type===item.type&&x.level<item.level&&game.shopOwned?.includes(x.id)).sort((a,b)=>b.level-a.level)[0]||null;
  }

  function buyUpgrade(item){
    const previous=findUpgrade(item);
    if(!previous)return false;
    if(game.level<item.minLevel){toast(`Você precisa do Arena Level ${item.minLevel}.`);return true}
    if(game.gold<item.price){toast('Gold insuficiente.');return true}

    const equipped=Array.isArray(game.shopEquipped?.trinkets)&&game.shopEquipped.trinkets.includes(previous.id);
    game.gold-=item.price;
    game.shopOwned=game.shopOwned.filter(id=>{
      const old=trinkets().find(x=>x.id===id);
      return !(old&&old.type===item.type&&old.level<item.level);
    });
    if(!game.shopOwned.includes(item.id))game.shopOwned.push(item.id);
    if(!game.shopEquipped)game.shopEquipped={};
    if(!Array.isArray(game.shopEquipped.trinkets))game.shopEquipped.trinkets=[];
    game.shopEquipped.trinkets=game.shopEquipped.trinkets.filter(id=>id!==previous.id&&id!==item.id);
    if(equipped)game.shopEquipped.trinkets.push(item.id);
    if(typeof persist==='function')persist();
    renderShop();
    toast(`${item.name} aprimorado! ${previous.name} foi substituído na Backpack.`);
    return true;
  }

  function installPurchaseGuard(){
    const box=document.getElementById('shopItems');
    if(!box||box.__arenaShopFix)return;
    box.__arenaShopFix=true;
    box.addEventListener('click',e=>{
      const btn=e.target.closest('.shop-btn');
      if(!btn)return;
      const item=trinkets().find(x=>x.id===btn.dataset.id);
      if(!item||game?.shopOwned?.includes(item.id))return;
      const previous=findUpgrade(item);
      if(!previous)return;
      e.preventDefault();
      e.stopImmediatePropagation();
      buyUpgrade(item);
    },true);
  }

  function boot(){
    installPurchaseGuard();
    let tries=0;
    const timer=setInterval(()=>{
      tries++;
      installPurchaseGuard();
      if(renderShop()||tries>=30)clearInterval(timer);
    },250);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
  window.addEventListener('load',boot);
})();

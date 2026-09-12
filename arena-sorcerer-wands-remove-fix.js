(()=>{
  // Remove somente as Wands do Sorcerer solicitadas.
  const REMOVE_IDS=new Set(['soulhexer','sanguine-wand','archmage-wand']);
  function apply(){
    if(typeof SHOP_ITEMS==='undefined')return;
    for(let i=SHOP_ITEMS.length-1;i>=0;i--){
      const item=SHOP_ITEMS[i];
      if(item.category==='wands' && REMOVE_IDS.has(item.id))SHOP_ITEMS.splice(i,1);
    }
    if(typeof shopRender==='function')shopRender();
  }
  apply();
})();

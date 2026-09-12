(()=>{
  const REMOVE_WANDS=new Set([
    'wand-of-abyss',
    'arcanist-wand',
    'infernal-wand',
    'void-wand',
    'archmage-wand'
  ]);
  if(typeof SHOP_ITEMS==='undefined')return;
  for(let i=SHOP_ITEMS.length-1;i>=0;i--){
    if(REMOVE_WANDS.has(SHOP_ITEMS[i].id))SHOP_ITEMS.splice(i,1);
  }
  if(typeof shopRender==='function')shopRender();
})();

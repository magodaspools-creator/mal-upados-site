(()=>{
  if(typeof SHOP_ITEMS==='undefined'||typeof game==='undefined')return;

  const VOCATIONS={
    Knight:['sword','axe','club','sceptre','blade','edge','lance'],
    Paladin:['bow','crossbow'],
    Sorcerer:['wand'],
    Druid:['rod']
  };

  function currentVocation(){
    const member=typeof members!=='undefined'&&Array.isArray(members)
      ? members.find(m=>m.name===game?.character)
      : null;
    return member?.vocation||'';
  }

  function weaponAllowed(item,vocation){
    if(!item||!item.attack)return true;
    if(!['weapons','wands','rods'].includes(item.category))return true;
    const name=String(item.name||'').toLowerCase();
    if(item.id==='soulhexer'||item.category==='wands')return vocation==='Sorcerer';
    if(item.category==='rods')return vocation==='Druid';
    if(item.category==='weapons'){
      if(vocation==='Knight')return !/(bow|crossbow|wand|rod)/.test(name);
      if(vocation==='Paladin')return /(bow|crossbow)/.test(name);
      return false;
    }
    return true;
  }

  function sanitize(){
    const v=currentVocation();
    if(!v||!game.shopEquipped)return;
    const id=game.shopEquipped.weapon;
    const item=SHOP_ITEMS.find(x=>x.id===id);
    if(item&&!weaponAllowed(item,v))game.shopEquipped.weapon='base-weapon';
  }

  function render(){
    sanitize();
    if(typeof shopRenderOriginal==='function')shopRenderOriginal();
  }

  if(typeof shopRender==='function'&&!window.__arenaVocationEquipmentFix){
    window.__arenaVocationEquipmentFix=true;
    window.shopRenderOriginal=shopRender;
    window.shopRender=function(){
      const v=currentVocation();
      sanitize();
      const original=SHOP_ITEMS.slice();
      if(v){
        for(let i=SHOP_ITEMS.length-1;i>=0;i--){
          const item=SHOP_ITEMS[i];
          if(!weaponAllowed(item,v))SHOP_ITEMS.splice(i,1);
        }
      }
      try{shopRenderOriginal();}finally{
        SHOP_ITEMS.splice(0,SHOP_ITEMS.length,...original);
      }
    };
    window.shopRender();
  }

  // Defesa adicional: qualquer tentativa de equipar arma incompatível é bloqueada.
  if(typeof window.shopEquip==='function'&&!window.__arenaVocationEquipHook){
    window.__arenaVocationEquipHook=true;
    const originalEquip=window.shopEquip;
    window.shopEquip=function(id){
      const item=SHOP_ITEMS.find(x=>x.id===id),v=currentVocation();
      if(item&&!weaponAllowed(item,v))return;
      return originalEquip.apply(this,arguments);
    };
  }
})();

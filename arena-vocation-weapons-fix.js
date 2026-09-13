(()=>{
  if(typeof SHOP_ITEMS==='undefined')return;

  const VOCATIONS=new Set(['Knight','Paladin','Sorcerer','Druid']);

  // Toda arma de ataque agora pertence a uma única vocação.
  // Armas antigas sem classe ficam como Knight para manter compatibilidade.
  SHOP_ITEMS.forEach(item=>{
    if(!item||!Number(item.attack))return;

    if(item.category==='weapons' && !VOCATIONS.has(item.class)){
      item.class='Knight';
      item.bonus=`+${item.attack} ataque · Knight`;
    }

    // As wands genéricas são de Sorcerer; rods são de Druid.
    if(item.category==='wands' && !VOCATIONS.has(item.class)){
      const name=String(item.name||'').toLowerCase();
      item.class=name.includes('rod')?'Druid':'Sorcerer';
      item.bonus=`+${item.attack} ataque · ${item.class}`;
    }
  });

  // Soulhexer: melhor Wand do Sorcerer.
  if(!SHOP_ITEMS.some(x=>x.id==='soulhexer')){
    SHOP_ITEMS.push({
      id:'soulhexer',
      name:'Soulhexer',
      icon:'🪄',
      category:'wands',
      class:'Sorcerer',
      price:5000,
      attack:68,
      defense:0,
      minLevel:40,
      bonus:'+68 ataque · Sorcerer'
    });
  }else{
    const soul=SHOP_ITEMS.find(x=>x.id==='soulhexer');
    Object.assign(soul,{category:'wands',class:'Sorcerer',attack:68,defense:0,bonus:'+68 ataque · Sorcerer'});
  }

  function currentVocation(){
    const member=(typeof members!=='undefined'&&Array.isArray(members))
      ?members.find(m=>m.name===game?.character):null;
    return member?.vocation||'';
  }

  // Remove/unequip armas incompatíveis que já possam estar salvas no personagem.
  function sanitizeWeaponState(){
    if(typeof game==='undefined'||!game)return;
    const vocation=currentVocation();
    if(!vocation||!game.shopEquipped)return;
    const weaponId=game.shopEquipped.weapon;
    const weapon=SHOP_ITEMS.find(x=>x.id===weaponId);
    if(weapon&&weapon.class&&weapon.class!==vocation){
      game.shopEquipped.weapon=null;
      if(Array.isArray(game.shopOwned)){
        game.shopOwned=game.shopOwned.filter(id=>id!==weaponId);
      }
    }
  }

  // Reaplica o filtro da loja: arma de outra vocação não aparece para compra/equipar.
  if(typeof shopRender==='function'){
    const originalShopRender=shopRender;
    window.shopRender=function(){
      sanitizeWeaponState();
      const vocation=currentVocation();
      const originalItems=SHOP_ITEMS.slice();
      if(vocation){
        for(let i=SHOP_ITEMS.length-1;i>=0;i--){
          const item=SHOP_ITEMS[i];
          if(item.attack>0 && item.class && item.class!==vocation && (item.category==='weapons'||item.category==='wands')){
            SHOP_ITEMS.splice(i,1);
          }
        }
      }
      originalShopRender();
      SHOP_ITEMS.splice(0,SHOP_ITEMS.length,...originalItems);
    };
  }

  sanitizeWeaponState();
  if(typeof window.shopRender==='function')window.shopRender();
})();

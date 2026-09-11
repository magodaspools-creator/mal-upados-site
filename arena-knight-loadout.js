// Loadout do Knight: 1 mão + escudo OU 2 mãos.
// Isolado do motor base para preservar as outras vocações.
(()=>{
  const KNIGHT_SHIELDS=[
    {id:'bronze-shield',name:'Bronze Shield',icon:'🛡️',category:'shields',class:'Knight',price:180,attack:0,defense:6,minLevel:1,bonus:'+6 defesa · Knight'},
    {id:'dragon-shield',name:'Dragon Shield',icon:'🐉',category:'shields',class:'Knight',price:900,attack:0,defense:16,minLevel:10,bonus:'+16 defesa · Knight'},
    {id:'demon-shield',name:'Demon Shield',icon:'😈',category:'shields',class:'Knight',price:1600,attack:0,defense:24,minLevel:18,bonus:'+24 defesa · Knight'},
    {id:'mastermind-shield',name:'Mastermind Shield',icon:'🛡️',category:'shields',class:'Knight',price:2500,attack:0,defense:32,minLevel:28,bonus:'+32 defesa · Knight'},
    {id:'blessed-shield',name:'Blessed Shield',icon:'✨',category:'shields',class:'Knight',price:4200,attack:0,defense:42,minLevel:38,bonus:'+42 defesa · Knight'}
  ];
  const TWO_HANDED_IDS=new Set(['knight-sword','knight-axe','knight-demon','demon-blade','arcanum-edge']);
  const ONE_HANDED_IDS=new Set(['knight-club','fire-sword','spike-sword','heroic-axe','avenger','dragon-lance']);

  if(typeof SHOP_CATEGORIES!=='undefined'&&!SHOP_CATEGORIES.some(x=>x.id==='shields'))SHOP_CATEGORIES.push({id:'shields',label:'Escudos'});
  if(typeof SHOP_ITEMS!=='undefined')KNIGHT_SHIELDS.forEach(item=>{if(!SHOP_ITEMS.some(x=>x.id===item.id))SHOP_ITEMS.push(item)});

  function currentKnightClass(){
    const member=(typeof members!=='undefined'&&Array.isArray(members))?members.find(m=>m.name===game?.character):null;
    return member?.vocation||'';
  }
  function equippedWeapon(){
    const id=game?.shopEquipped?.weapon;
    return typeof SHOP_ITEMS!=='undefined'&&id?SHOP_ITEMS.find(x=>x.id===id)||null:null;
  }
  function isKnight(){return /knight/i.test(currentKnightClass());}
  function isTwoHanded(item){return !!item&&TWO_HANDED_IDS.has(item.id);}

  function ensureLoadout(){
    if(typeof shopEnsure==='function')shopEnsure();
    if(!game||!isKnight())return;
    if(!game.shopEquipped)game.shopEquipped={};
    if(!Object.prototype.hasOwnProperty.call(game.shopEquipped,'shield'))game.shopEquipped.shield=null;
    const weapon=equippedWeapon();
    if(weapon&&isTwoHanded(weapon))game.shopEquipped.shield=null;
  }

  if(typeof shopAction==='function'&&!window.__arenaKnightShopWrapped){
    const originalShopAction=shopAction;
    window.__arenaKnightShopWrapped=true;
    window.shopAction=function(id){
      const item=typeof SHOP_ITEMS!=='undefined'?SHOP_ITEMS.find(x=>x.id===id):null;
      if(item&&item.category==='shields'&&!isKnight()){
        toast('Escudos da Arena são exclusivos do Knight.');
        return;
      }
      if(item&&item.category==='shields'&&isKnight()){
        ensureLoadout();
        if(game.level<item.minLevel){toast(`Você precisa do Arena Level ${item.minLevel}.`);return;}
        if(game.shopOwned.includes(id)){
          game.shopEquipped.shield=id;
          persist();
          shopRender();
          toast(`${item.name} equipado.`);
          return;
        }
        if(game.gold<item.price){toast('Gold insuficiente.');return;}
        game.gold-=item.price;
        game.shopOwned.push(id);
        game.shopEquipped.shield=id;
        persist();
        shopRender();
        toast(`${item.name} comprado e equipado.`);
        return;
      }
      originalShopAction(id);
      ensureLoadout();
    };
    shopAction=window.shopAction;
  }

  if(typeof shopEnsure==='function'&&!window.__arenaKnightEnsureWrapped){
    const originalEnsure=shopEnsure;
    window.__arenaKnightEnsureWrapped=true;
    window.shopEnsure=function(){
      originalEnsure();
      if(game){
        if(!game.shopEquipped)game.shopEquipped={};
        if(!Object.prototype.hasOwnProperty.call(game.shopEquipped,'shield'))game.shopEquipped.shield=null;
        const weapon=game.shopEquipped.weapon&&typeof SHOP_ITEMS!=='undefined'?SHOP_ITEMS.find(x=>x.id===game.shopEquipped.weapon):null;
        if(weapon&&isTwoHanded(weapon))game.shopEquipped.shield=null;
      }
    };
    shopEnsure=window.shopEnsure;
  }

  // Converte armas já existentes para o modelo de mãos sem alterar seus preços/ATK base.
  if(typeof SHOP_ITEMS!=='undefined'){
    SHOP_ITEMS.forEach(item=>{
      if(TWO_HANDED_IDS.has(item.id)){
        item.hands=2;
        item.defensePenalty=item.id==='knight-demon'?-10:item.id==='knight-axe'?-8:item.id==='knight-sword'?-6:item.id==='demon-blade'?-8:-10;
        item.bonus=`+${item.attack} ataque · 2 mãos · ${item.defensePenalty} defesa`;
      }else if(ONE_HANDED_IDS.has(item.id)){
        item.hands=1;
      }
    });
  }

  const originalBonus=window.arenaWeaponBonus;
  window.arenaKnightLoadout=function(){
    if(typeof game==='undefined'||!game)return {attack:0,defense:0,hands:0,shield:null};
    const weapon=equippedWeapon();
    const twoHanded=isKnight()&&isTwoHanded(weapon);
    const shieldId=game.shopEquipped?.shield;
    const shield=typeof SHOP_ITEMS!=='undefined'&&shieldId?SHOP_ITEMS.find(x=>x.id===shieldId):null;
    return {
      attack:twoHanded?Number(weapon?.attack)||0:0,
      defense:twoHanded?(Number(weapon?.defensePenalty)||0):(Number(shield?.defense)||0),
      hands:twoHanded?2:1,
      shield:shield?.id||null
    };
  };

  if(typeof arenaWeaponBonus==='function'&&!window.__arenaKnightBonusWrapped){
    const baseBonus=arenaWeaponBonus;
    window.__arenaKnightBonusWrapped=true;
    window.arenaWeaponBonus=function(){
      const base=baseBonus()||{attack:0,defense:0};
      if(!isKnight())return base;
      const loadout=window.arenaKnightLoadout();
      const shieldAttack=0;
      const weapon=equippedWeapon();
      const weaponAlreadyCounted=isTwoHanded(weapon)?Number(weapon.attack)||0:0;
      const weaponPenalty=loadout.defense;
      const shieldDefense=loadout.shield&&!isTwoHanded(weapon)?(Number((SHOP_ITEMS.find(x=>x.id===loadout.shield)||{}).defense)||0):0;
      return {
        attack:base.attack+(isTwoHanded(weapon)?0:0)+shieldAttack,
        defense:base.defense+(isTwoHanded(weapon)?weaponPenalty:(shieldDefense-weaponAlreadyCounted*0))
      };
    };
    arenaWeaponBonus=window.arenaWeaponBonus;
  }

  if(typeof shopRender==='function'&&!window.__arenaKnightRenderWrapped){
    const baseRender=shopRender;
    window.__arenaKnightRenderWrapped=true;
    window.shopRender=function(){
      ensureLoadout();
      baseRender();
      const box=document.getElementById('shopItems');
      if(!box)return;
      box.querySelectorAll('.shop-item').forEach(card=>{
        const name=card.querySelector('.shop-info strong')?.textContent||'';
        const item=typeof SHOP_ITEMS!=='undefined'?SHOP_ITEMS.find(x=>x.name===name):null;
        if(!item||item.category!=='weapons'||!isKnight())return;
        const old=card.querySelector('.shop-info small');
        if(old&&isTwoHanded(item))old.textContent=`Level ${item.minLevel}+ · ${item.price.toLocaleString('pt-BR')} gold · 2 mãos`;
        else if(old&&item.hands===1)old.textContent=`Level ${item.minLevel}+ · ${item.price.toLocaleString('pt-BR')} gold · 1 mão`;
      });
    };
    shopRender=window.shopRender;
  }
})();

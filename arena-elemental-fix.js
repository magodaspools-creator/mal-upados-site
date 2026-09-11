// Sistema elemental isolado do motor base da Arena.
// Cada zona usa um elemento. O amuleto correspondente reduz parte do dano.
(()=>{
  const ELEMENTS={
    earth:{name:'Terra',icon:'🌿',resistance:0.10,color:'#8bc47f'},
    fire:{name:'Fogo',icon:'🔥',resistance:0.10,color:'#e58b5b'},
    energy:{name:'Energy',icon:'⚡',resistance:0.10,color:'#9db9e8'},
    ice:{name:'Gelo',icon:'❄️',resistance:0.10,color:'#8ccfe8'},
    death:{name:'Death',icon:'💀',resistance:0.10,color:'#9f8bc4'}
  };
  const ZONE_ELEMENTS=['earth','fire','energy','ice','death'];

  const AMULETS=[
    {id:'earthguard-amulet',name:'Earthguard Amulet',icon:'🌿',category:'amulets',price:5500,attack:0,defense:0,minLevel:1,bonus:'10% resistência a Terra',element:'earth',elementalResistance:0.10},
    {id:'fireheart-amulet',name:'Fireheart Amulet',icon:'🔥',category:'amulets',price:7500,attack:0,defense:0,minLevel:5,bonus:'10% resistência a Fogo',element:'fire',elementalResistance:0.10},
    {id:'energy-prism-amulet',name:'Energy Prism Amulet',icon:'⚡',category:'amulets',price:9500,attack:0,defense:0,minLevel:12,bonus:'10% resistência a Energy',element:'energy',elementalResistance:0.10},
    {id:'frost-amulet',name:'Frost Amulet',icon:'❄️',category:'amulets',price:12000,attack:0,defense:0,minLevel:20,bonus:'10% resistência a Gelo',element:'ice',elementalResistance:0.10},
    {id:'death-amulet',name:'Death Amulet',icon:'💀',category:'amulets',price:22000,attack:0,defense:0,minLevel:35,bonus:'10% resistência a Death',element:'death',elementalResistance:0.10}
  ];

  if(typeof SHOP_CATEGORIES!=='undefined'&&!SHOP_CATEGORIES.some(x=>x.id==='amulets')){
    SHOP_CATEGORIES.push({id:'amulets',label:'Amuletos'});
  }
  if(typeof SHOP_ITEMS!=='undefined')AMULETS.forEach(item=>{if(!SHOP_ITEMS.some(x=>x.id===item.id))SHOP_ITEMS.push(item)});

  if(typeof shopEnsure==='function'){
    const originalEnsure=shopEnsure;
    window.__arenaElementalShopWrapped=true;
    shopEnsure=function(){
      originalEnsure();
      if(game){
        if(!game.shopEquipped)game.shopEquipped={};
        if(!Object.prototype.hasOwnProperty.call(game.shopEquipped,'amulet'))game.shopEquipped.amulet=null;
      }
    };
  }

  if(typeof slotFor==='function'){
    slotFor=function(item){
      if(item?.category==='amulets')return 'amulet';
      return item?.category==='weapons'||item?.category==='wands'?'weapon':item?.category;
    };
  }

  function currentAmulet(){
    const id=game?.shopEquipped?.amulet;
    if(!id||typeof SHOP_ITEMS==='undefined')return null;
    return SHOP_ITEMS.find(x=>x.id===id)||null;
  }
  function resistanceFor(element){
    const amulet=currentAmulet();
    return amulet?.element===element?Number(amulet.elementalResistance)||0:0;
  }
  function elementForZone(zoneIndex){return ELEMENTS[ZONE_ELEMENTS[zoneIndex]]||ELEMENTS.earth}
  function elementLabel(element){const e=ELEMENTS[element]||ELEMENTS.earth;return `${e.icon} ${e.name}`}

  window.arenaElementalState={ELEMENTS,ZONE_ELEMENTS,currentAmulet,resistanceFor,elementForZone,elementLabel};

  if(typeof startBattle==='function'){
    startBattle=function(zoneIndex,monsterIndex){
      const m=ZONES[zoneIndex].monsters[monsterIndex];
      const baseWeapon=WEAPONS[game.weapon]?.[1]||0;
      const baseArmor=ARMORS[game.armor]?.[1]||0;
      const bonus=typeof arenaWeaponBonus==='function'?arenaWeaponBonus():{attack:0,defense:0};
      const attackBonus=baseWeapon+bonus.attack;
      const defenseBonus=baseArmor+bonus.defense;
      const elemental=elementForZone(zoneIndex);
      battle={
        zoneIndex,monsterIndex,name:m[0],icon:m[1],element:ZONE_ELEMENTS[zoneIndex],
        maxHp:m[2]+game.level*8,hp:m[2]+game.level*8,
        damage:m[3]+Math.floor(game.level*1.7),
        gold:m[4]+game.level*3,xp:m[5]+game.level*12,
        playerHp:110+game.level*12+defenseBonus*3,
        playerMax:110+game.level*12+defenseBonus*3,
        attack:15+game.level*4+attackBonus*3,
        enemyDelay:0,log:[]
      };
      renderBattle();
      battleLog(`<span style="color:${elemental.color}">${elementLabel(battle.element)} · ataque elemental ativo</span>`);
      renderBattle();
    };
  }

  if(typeof attack==='function'){
    attack=function(){
      if(!battle)return;
      let dmg=Math.max(1,battle.attack+Math.floor(Math.random()*12)-6);
      battle.hp=Math.max(0,battle.hp-dmg);
      game.damage+=dmg;
      battleLog(`Você causou <b>${dmg}</b> de dano.`);
      if(battle.hp<=0){winBattle();return}

      const rawIncoming=Math.max(1,battle.damage+Math.floor(Math.random()*10)-5);
      const resistance=resistanceFor(battle.element);
      const finalIncoming=Math.max(1,Math.floor(rawIncoming*(1-resistance)));
      battle.playerHp=Math.max(0,battle.playerHp-finalIncoming);
      const elem=ELEMENTS[battle.element]||ELEMENTS.earth;
      const amulet=currentAmulet();
      if(resistance>0){
        battleLog(`${esc(battle.name)} ${elem.icon} causou <b>${finalIncoming}</b> de dano (${Math.round(resistance*100)}% resistido pelo ${esc(amulet.name)}).`);
      }else{
        battleLog(`${esc(battle.name)} ${elem.icon} causou <b>${finalIncoming}</b> de dano <span style="color:#b56b6b">(sem resistência elemental)</span>.`);
      }
      if(battle.playerHp<=0){loseBattle();return}
      renderBattle();
    };
  }
})();

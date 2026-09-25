// Arena — correção final de vocações dos equipamentos.
// Fonte de referência: requisitos de vocação do Tibia. Itens sem restrição continuam
// livres; itens de vocação explícita passam a ser bloqueados também no equipamento
// já salvo, evitando que um save antigo mantenha bônus de outra vocação.
(()=>{
  if(window.__arenaVocationItemsFix)return;
  window.__arenaVocationItemsFix=true;

  const VOCATION_OVERRIDES={
    Monk:[
      // Armaduras
      'Death Oyoroi','Gnomish Cuirass','Ice Robe','Lightning Robe',
      'Merudri Battle Mail','Merudri Nanbando','Merudri Scale Mail',
      'Monk Robe','Naga Tanko','Plain Monk Robe','Robe of Enlightenment',
      'Soulgarb','Stag Robe','Stoic Iks Robe','Zaoan Monk Robe',
      // Calças
      'Mutant Hide Trousers','Norcferatu Fleshguards','Sanguine Trousers',
      // Botas
      'Eldritch Monk Boots','Gnomish Footwraps','Iks Footwraps',
      'Soulsoles','Stag Footwraps','Yalahari Footwraps',
      // Capacetes
      'Dark Vision Bandana','Demon Mengu','Moonsilver Strike Helm',
      'Norcferatu Bonehood',
      // Armas
      'Bambus Jo','Cobra Bo','Depth Claws','Fists of Enlightenment',
      'Inferniarch Claw','Nunchaku','Nunchaku of Enlightenment',
      'Pair of Iron Fists','Sai','Sai of Enlightenment','Umbral Master Katar',
      'Iron Knuckle','Tiger Claw','Jade Gauntlet','Dragon Fist',
      'Thunder Gauntlets','Shadow Fists','Celestial Gauntlets','Void Fists'
    ],
    Paladin:[
      // Armaduras
      'Knight Armor','Crown Armor','Dragon Scale Mail','Golden Armor',
      'Depth Lorica','Gnome Armor','Prismatic Armor','Dauntless Dragon Scale Armor',
      'Unerring Dragon Scale Armor',
      // Calças
      'Crown Legs','Golden Legs','Falcon Greaves','Stag Shinguards',
      // Botas
      'Dragon Scale Boots','Draken Boots','Guardian Boots','Feverbloom Boots',
      'Stoic Iks Boots','Winged Boots',
      // Capacetes
      'Falcon Coif','Moonsilver Trail Hood','Stoic Iks Casque',
      // Escudos
      'Gnome Shield','Falcon Escutcheon','Falcon Shield',
      // Armas
      'Cobra Crossbow','Glooth Spear','Naga Crossbow','Ornate Crossbow',
      'Rift Bow','Rift Crossbow','Umbral Master Bow','Umbral Master Crossbow',
      'Falcon Bow'
    ],
    Knight:[
      // Armaduras
      'Knight Armor','Crown Armor','Dragon Scale Mail','Golden Armor',
      'Ornate Chestplate','Prismatic Armor','Falcon Plate',
      'Stoic Iks Chestplate','Stoic Iks Cuirass','Norcferatu Tuskplate',
      // Calças
      'Knight Legs','Crown Legs','Ornate Legs','Falcon Greaves',
      'Stag Legs','Stag Shinguards',
      // Botas
      'Depth Calcei','Dragon Scale Boots','Draken Boots','Frostflower Boots',
      'Guardian Boots',
      // Capacetes
      'Falcon Coif','Falcon Circlet','Moonsilver Battle Visor',
      'Spiritthorn Helmet',
      // Escudos
      'Gnome Shield','Falcon Escutcheon','Falcon Shield',
      // Armas
      'Fire Sword','Spike Sword','Dragon Lance','Heroic Axe','Avenger',
      'Demonwing Axe','Demon Blade','Arcanum Edge','Chaos Mace','Cobra Axe',
      'Cobra Club','Cobra Sword','Crystalline Sword','Glooth Axe','Glooth Club',
      'Glooth Sword','Inferniarch Blade','Inferniarch Slayer','Lion Axe',
      'Lion Hammer','Mino Blade','Mino Lance','Naga Axe','Naga Club',
      'Naga Sword','Shiny Blade','Tagralt Blade','The Impaler',
      'Umbral Master Slayer','Gnome Sword','Falcon Battleaxe',
      'Falcon Longsword','Falcon Mace','Inferniarch Battleaxe',
      'Inferniarch Greataxe','Inferniarch Flail','Inferniarch Warhammer',
      'Draining Inferniarch Battleaxe','Knight Club','Knight Sword',
      'Knight Axe','Demon Crusher'
    ]
  };

  // Quando a mesma peça existe para mais de uma vocação, unimos as permissões.
  const allowed=new Map();
  Object.entries(VOCATION_OVERRIDES).forEach(([voc,names])=>{
    names.forEach(name=>{
      const key=name.toLowerCase();
      const set=allowed.get(key)||new Set();
      set.add(voc);
      allowed.set(key,set);
    });
  });

  function applyOverrides(){
    if(typeof SHOP_ITEMS==='undefined')return 0;
    let changed=0;
    SHOP_ITEMS.forEach(item=>{
      const set=allowed.get(String(item.name||'').toLowerCase());
      if(!set)return;
      const vocations=[...set];
      const old=JSON.stringify(item.vocations||item.vocation||null);
      if(vocations.length===1){
        item.vocation=vocations[0];
        delete item.vocations;
      }else{
        item.vocations=vocations;
        delete item.vocation;
      }
      if(old!==JSON.stringify(item.vocations||item.vocation||null))changed++;
    });
    return changed;
  }

  function currentVocation(){
    const member=typeof members!=='undefined'&&Array.isArray(members)
      ?members.find(m=>m.name===game?.character):null;
    const raw=String(member?.vocation||'').trim().toLowerCase();
    if(raw.includes('sorcerer'))return 'Sorcerer';
    if(raw.includes('druid'))return 'Druid';
    if(raw.includes('paladin'))return 'Paladin';
    if(raw.includes('knight'))return 'Knight';
    if(raw==='monk')return 'Monk';
    return member?.vocation||'';
  }

  function itemVocations(item){
    if(!item)return [];
    const raw=item.vocations||item.vocation||item.class||'';
    const values=Array.isArray(raw)?raw:[raw];
    return values.flatMap(v=>String(v).split(/[\\/,|]+/))
      .map(v=>v.trim())
      .filter(Boolean)
      .map(v=>v[0].toUpperCase()+v.slice(1).toLowerCase());
  }

  function allowedForCurrent(item){
    const req=itemVocations(item);
    const cur=currentVocation();
    return !req.length||!cur||req.includes(cur);
  }

  function sanitizeEquipped(){
    if(typeof SHOP_ITEMS==='undefined'||!game?.shopEquipped)return;
    const keys=Object.keys(game.shopEquipped);
    keys.forEach(slot=>{
      const id=game.shopEquipped[slot];
      if(!id)return;
      const item=SHOP_ITEMS.find(x=>x.id===id);
      if(item&&!allowedForCurrent(item))game.shopEquipped[slot]=null;
    });
  }

  const changed=applyOverrides();
  sanitizeEquipped();

  // O catálogo é carregado antes deste módulo; ainda assim, repetir a normalização
  // em render garante que mudanças de personagem não deixem equipamento inválido.
  const originalRender=window.shopRender;
  if(typeof originalRender==='function'&&!window.__arenaVocationRenderWrapped){
    window.__arenaVocationRenderWrapped=true;
    window.shopRender=function(){
      applyOverrides();
      sanitizeEquipped();
      originalRender();
    };
    shopRender=window.shopRender;
  }

  const originalCombat=window.arenaShopCombatBonuses;
  if(typeof originalCombat==='function'&&!window.__arenaVocationCombatWrapped){
    window.__arenaVocationCombatWrapped=true;
    window.arenaShopCombatBonuses=function(){
      applyOverrides();
      sanitizeEquipped();
      return originalCombat();
    };
  }

  window.arenaVocationAudit={
    changed,
    overrides:VOCATION_OVERRIDES,
    current:currentVocation,
    allowedForCurrent
  };

  if(typeof window.shopRender==='function')window.shopRender();
})();

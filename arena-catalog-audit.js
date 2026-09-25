// Arena — auditoria final do catálogo de equipamentos.
// Corrige categoria, vocação e resíduos de catálogos antigos depois que todos
// os módulos da loja/trinkets/backpack já foram carregados.
(()=>{
  if(window.__arenaCatalogAuditInstalled)return;
  window.__arenaCatalogAuditInstalled=true;

  const CATEGORY_FIXES={
    'Trinket #199470':'trinkets','Trinket #210930':'trinkets','Trinket #210931':'trinkets',
    'Trinket #214972':'trinkets','Trinket #214975':'trinkets','Trinket #218726':'trinkets',
    'Trinket #233482':'trinkets','Trinket #236017':'trinkets','Trinket #236019':'trinkets',
    'Trinket #238621':'trinkets','Trinket #238622':'trinkets','Trinket #238623':'trinkets',
    'Trinket #239123':'trinkets','Trinket #239781':'trinkets','Trinket #239786':'trinkets',
    'Trinket #239788':'trinkets','Trinket #239792':'trinkets','Trinket #239793':'trinkets',
    'Trinket #239794':'trinkets','Trinket #239795':'trinkets','Trinket #240132':'trinkets',
    'Trinket #240254':'trinkets'
  };

  // Correções verificadas contra as categorias/vocações atuais do Tibia.
  const VOCATION_FIXES={
    // Monk
    'Death Oyoroi':['Monk'],'Gnomish Cuirass':['Monk'],'Ice Robe':['Monk'],
    'Lightning Robe':['Monk'],'Merudri Battle Mail':['Monk'],'Merudri Battlemail':['Monk'],
    'Merudri Nanbando':['Monk'],'Merudri Scale Mail':['Monk'],'Monk Robe':['Monk'],
    'Naga Tanko':['Monk'],'Plain Monk Robe':['Monk'],'Robe of Enlightenment':['Monk'],
    'Soulgarb':['Monk'],'Stag Robe':['Monk'],'Stoic Iks Robe':['Monk'],
    'Zaoan Monk Robe':['Monk'],'Gnomish Footwraps':['Monk'],'Iks Footwraps':['Monk'],
    'Eldritch Monk Boots':['Monk'],'Soulsoles':['Monk'],'Stag Footwraps':['Monk'],
    'Yalahari Footwraps':['Monk'],'Norcferatu Fleshguards':['Monk'],
    'Norcferatu Fleeshguards':['Monk'],'Demon Mengu':['Monk'],
    'Moonsilver Strike Helm':['Monk'],'Norcferatu Bonehood':['Monk'],
    'Dark Vision Bandana':['Monk'],'Enchanted Werewolf Helmet (Fist)':['Monk'],
    'Ethereal Coned Hat':['Monk'],'Umbral Master Katar':['Monk'],
    'Bambus Jo':['Monk'],'Cobra Bo':['Monk'],'Depth Claws':['Monk'],
    'Fists of Enlightenment':['Monk'],'Inferniarch Claw':['Monk'],
    'Nunchaku':['Monk'],'Nunchaku of Enlightenment':['Monk'],
    'Pair of Iron Fists':['Monk'],'Sai':['Monk'],'Sai of Enlightenment':['Monk'],

    // Knight
    'Dauntless Dragon Scale Armor':['Knight'],'Ornate Chestplate':['Knight'],
    'Falcon Plate':['Knight'],'Stoic Iks Chestplate':['Knight'],
    'Norcferatu Tuskplate':['Knight'],'Stag Legs':['Knight'],
    'Cobra Hood':['Knight'],'Cobra Boots':['Knight'],'Depth Calcei':['Knight'],
    'Falcon Battleaxe':['Knight'],'Falcon Longsword':['Knight'],'Falcon Mace':['Knight'],
    'Gnome Sword':['Knight'],'Merudri Battlemail':['Monk'],
    'Stoic Iks Cuirass':['Druid'],'Glooth Cape':['Sorcerer','Druid'],

    // Paladin
    'Unerring Dragon Scale Armor':['Paladin'],'Gnome Armor':['Paladin'],
    'Falcon Coif':['Knight','Paladin'],'Falcon Greaves':['Knight','Paladin'],
    'Stag Plate':['Paladin'],'Stag Shinguards':['Paladin'],
    'Stoic Iks Casque':['Paladin'],'Stoic Iks Boots':['Paladin'],
    'Cobra Crossbow':['Paladin'],'Glooth Spear':['Paladin'],'Naga Crossbow':['Paladin'],
    'Ornate Crossbow':['Paladin'],'Rift Bow':['Paladin'],'Rift Crossbow':['Paladin'],
    'Umbral Master Bow':['Paladin'],'Umbral Master Crossbow':['Paladin'],
    'Falcon Bow':['Paladin'],

    // Sorcerer / Druid
    'Falcon Circlet':['Sorcerer','Druid'],'Gnome Helmet':['Sorcerer','Druid'],
    'Gnome Legs':['Sorcerer','Druid'],'Stoic Iks Sandals':['Sorcerer'],
    'Midnight Tunic':['Sorcerer','Druid'],'Midnight Sarong':['Sorcerer','Druid'],
    'Arcane Dragon Robe':['Sorcerer'],'Mystical Dragon Robe':['Druid'],
    'Dreadfire Headpiece':['Sorcerer'],'Demonfang Mask':['Druid'],
    'Falcon Wand':['Sorcerer'],'Falcon Rod':['Druid']
  };

  // Categoria explícita para itens conhecidos que não devem depender de heurística.
  const EXACT_CATEGORIES={
    'Falcon Circlet':'helmets','Falcon Coif':'helmets','Gnome Helmet':'helmets',
    'Gnome Legs':'legs','Gnome Armor':'armor','Gnome Shield':'shield',
    'Falcon Plate':'armor','Falcon Greaves':'legs','Stag Plate':'armor',
    'Stag Robe':'armor','Stag Legs':'legs','Stag Boots':'boots',
    'Stag Footwraps':'boots','Stag Shinguards':'boots',
    'Stoic Iks Boots':'boots','Stoic Iks Sandals':'boots','Stoic Iks Casque':'helmets',
    'Stoic Iks Chestplate':'armor','Stoic Iks Cuirass':'armor',
    'Merudri Battle Mail':'armor','Merudri Battlemail':'armor',
    'Merudri Scale Mail':'armor','Merudri Nanbando':'armor',
    'Plain Monk Robe':'armor','Norcferatu Fleshguards':'legs',
    'Norcferatu Fleeshguards':'legs','Eldritch Monk Boots':'boots',
    'Gnomish Footwraps':'boots','Iks Footwraps':'boots','Soulsoles':'boots',
    'Yalahari Footwraps':'boots','Moonsilver Strike Helm':'helmets',
    'Demon Mengu':'helmets','Norcferatu Bonehood':'helmets',
    'Dark Vision Bandana':'helmets','Enchanted Werewolf Helmet (Fist)':'helmets',
    'Ethereal Coned Hat':'helmets','Dauntless Dragon Scale Armor':'armor',
    'Unerring Dragon Scale Armor':'armor','Glooth Cape':'armor',
    'Glooth Amulet':'amulets','Sanguine Collar':'amulets','Bounty Talisman':'amulets'
  };

  const normalizeVocations=v=>[...new Set((Array.isArray(v)?v:[v]).flatMap(x=>String(x||'').split(/[\\/,|]+/))
    .map(x=>x.trim()).filter(Boolean).map(x=>x[0].toUpperCase()+x.slice(1).toLowerCase()))];

  function findByName(name){
    const n=String(name||'').trim().toLowerCase();
    return SHOP_ITEMS.find(x=>String(x.name||'').trim().toLowerCase()===n)||null;
  }

  function cleanOldBackpacks(){
    if(typeof SHOP_ITEMS==='undefined')return;
    const oldIds=new Set(['small-backpack','adventurer-backpack','dragon-backpack','demon-backpack','infernal-backpack']);
    for(let i=SHOP_ITEMS.length-1;i>=0;i--)if(oldIds.has(SHOP_ITEMS[i].id))SHOP_ITEMS.splice(i,1);
    if(typeof game!=='undefined'&&game){
      if(Array.isArray(game.shopOwned))game.shopOwned=game.shopOwned.filter(id=>!oldIds.has(id));
      if(game.shopEquipped?.backpack&&oldIds.has(game.shopEquipped.backpack))game.shopEquipped.backpack=null;
    }
  }

  function removeQuestTab(){
    if(typeof SHOP_CATEGORIES!=='undefined'){
      for(let i=SHOP_CATEGORIES.length-1;i>=0;i--){
        if(SHOP_CATEGORIES[i].id==='quest'||/quest/i.test(SHOP_CATEGORIES[i].label||''))SHOP_CATEGORIES.splice(i,1);
      }
    }
    if(typeof SHOP_ITEMS!=='undefined')SHOP_ITEMS.forEach(x=>{
      if(x.category==='quest')x.shopDisabled=true;
    });
  }

  function inferCategory(item){
    const n=String(item?.name||'').toLowerCase();
    if(/trinket/.test(n))return 'trinkets';
    if(/backpack/.test(n))return 'backpacks';
    if(/amulet|necklace|talisman|collar|brooch|pendulet/.test(n))return 'amulets';
    if(/ring/.test(n))return 'rings';
    if(/shield|escutcheon/.test(n))return 'shield';
    if(/wand/.test(n))return 'wands';
    if(/\brod\b/.test(n))return 'rods';
    if(/bow|crossbow|arbalest|spear|axe|sword|blade|mace|club|hammer|lance|katar|claw|fist|knuckle|nunchaku|\bsai\b|\bjo\b|\bbo\b|slayer|chopper|spade/.test(n))return 'weapons';
    if(/boots|footwraps|sandals|shoes|calcei|stompers|trumpers|galoshes/.test(n))return 'boots';
    if(/legs|greaves|shinguards|culets|trousers|kilt|faulds|sarong|fleshguards|fleeshguards|thornwraps/.test(n))return 'legs';
    if(/helmet|hood|visor|casque|headguard|headpiece|mask|bandana|circlet|galea|mengu|coned hat|hat/.test(n))return 'helmets';
    if(/armor|plate|mail|cuirass|chestplate|robe|cape|mantle|lorica|tunic|coat|nanbando|tanko|oyoroi|sherwani/.test(n))return 'armor';
    return null;
  }

  function apply(){
    if(typeof SHOP_ITEMS==='undefined')return;
    let categoryChanges=0,vocationChanges=0,nameChanges=0;
    for(const item of SHOP_ITEMS){
      const exact=EXACT_CATEGORIES[item.name];
      const forced=CATEGORY_FIXES[item.name];
      const inferred=exact||forced||inferCategory(item);
      // Nunca reclassificamos categorias de armas/armaduras já conhecidas apenas
      // por palavras genéricas se não houver um sinal forte; os mapas exatos acima
      // têm prioridade.
      if(inferred&&item.category!==inferred){
        item.category=inferred;
        categoryChanges++;
      }
      const voc=VOCATION_FIXES[item.name];
      if(voc){
        const normalized=normalizeVocations(voc);
        const old=normalizeVocations(item.vocations||item.vocation||[]);
        if(JSON.stringify(old)!==JSON.stringify(normalized))vocationChanges++;
        if(normalized.length===1){item.vocation=normalized[0];delete item.vocations}
        else{item.vocations=normalized;delete item.vocation}
      }
      if(item.name==='Norcferatu Bloohide'){item.name='Norcferatu Bloodhide';nameChanges++}
      if(item.name==='Norcferatu Fleeshguards'){item.name='Norcferatu Fleshguards';nameChanges++}
    }

    removeQuestTab();
    cleanOldBackpacks();

    // Trinkets ficam em sua própria aba; nunca em Backpack/Armor/Amulet.
    if(typeof window.arenaTrinkets!=='undefined'){
      const trinkets=window.arenaTrinkets.TRINKETS||[];
      for(const item of trinkets){
        item.category='trinkets';
        if(item.name?.startsWith('Trinket #'))item.shopDisabled=false;
      }
      if(typeof SHOP_CATEGORIES!=='undefined'&&!SHOP_CATEGORIES.some(x=>x.id==='trinkets'))
        SHOP_CATEGORIES.push({id:'trinkets',label:'Trinkets'});
    }

    // Garante que categorias usadas no catálogo tenham filtro próprio.
    const wanted=[
      ['weapons','Armas'],['armor','Armaduras'],['legs','Legs'],['boots','Boots'],
      ['shield','Shields'],['helmets','Helmets'],['wands','Wands'],['rods','Rods'],
      ['rings','Rings'],['amulets','Amuletos'],['trinkets','Trinkets'],['backpacks','Backpacks']
    ];
    if(typeof SHOP_CATEGORIES!=='undefined'){
      wanted.forEach(([id,label])=>{
        if(!SHOP_CATEGORIES.some(x=>x.id===id))SHOP_CATEGORIES.push({id,label});
      });
    }

    window.arenaCatalogAuditReport={
      categoryChanges,vocationChanges,nameChanges,
      shopItems:SHOP_ITEMS.length,
      categories:typeof SHOP_CATEGORIES!=='undefined'?SHOP_CATEGORIES.map(x=>x.id):[]
    };
  }

  apply();

  // Reaplica após qualquer wrapper tardio da loja, sem criar polling agressivo.
  const oldRender=typeof window.shopRender==='function'?window.shopRender:null;
  if(oldRender&&!window.__arenaCatalogAuditRenderWrapped){
    window.__arenaCatalogAuditRenderWrapped=true;
    window.shopRender=function(){apply();return oldRender()};
  }

  if(typeof window.shopRender==='function')window.shopRender();
})();

// Arena — auditoria final do catálogo de equipamentos.
// Corrige categoria, vocação e resíduos de catálogos antigos depois que todos
// os módulos da loja/trinkets/backpack já foram carregados.
(()=>{
  if(window.__arenaCatalogAuditInstalled)return;
  window.__arenaCatalogAuditInstalled=true;

  const CATEGORY_FIXES={
    // Itens Ink pertencem ao Extra Slot no Tibia; na Arena esse slot é Trinkets.
    'Ink Blade':'trinkets','Ink Brush':'trinkets','Ink Claw':'trinkets','Ink Quill':'trinkets','Ink Vine':'trinkets',
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
    // Correção solicitada: o sprite/item 214973 é usado como Glooth Armor na Arena.
    'Glooth Armor':'armor',
    'Glooth Amulet':'armor',
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
    'Unerring Dragon Scale Armor':'armor','Glooth Cape':'armor','Sanguine Collar':'amulets','Bounty Talisman':'amulets'
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
    const removedIds=new Set(oldIds);
    for(let i=SHOP_ITEMS.length-1;i>=0;i--){
      const item=SHOP_ITEMS[i];
      // Backpacks antigas/placeholder sem sprite não podem existir no catálogo.
      const isBackpack=String(item?.category||'').toLowerCase()==='backpacks';
      const hasSprite=!!String(item?.sprite||'').trim();
      if(oldIds.has(item.id)||(isBackpack&&!hasSprite)){
        removedIds.add(item.id);
        SHOP_ITEMS.splice(i,1);
      }
    }
    if(typeof game!=='undefined'&&game){
      if(Array.isArray(game.shopOwned))game.shopOwned=game.shopOwned.filter(id=>!removedIds.has(id));
      if(game.shopEquipped?.backpack&&removedIds.has(game.shopEquipped.backpack))game.shopEquipped.backpack=null;
    }
  }

  function cleanStep1WrongItems(){
    if(typeof SHOP_ITEMS==='undefined')return;

    // Passo 1: NÃO removemos itens só porque o sprite estava faltando.
    // Os sprites oficiais foram enviados para arena-godot/ e devem ser ligados
    // diretamente ao item pelo ID real.
    const SPRITES={
      'real-218726':'arena-godot/218726.png',
      'real-240132':'arena-godot/240132.png',
      'real-239792':'arena-godot/239792.png',
      'real-239793':'arena-godot/239793.png',
      'real-239794':'arena-godot/239794.png',
      'real-239795':'arena-godot/239795.png',
      'real-214973':'arena-godot/214973.png'
    };

    const INKS={
      'real-239792':'Ink Quill',
      'real-239793':'Ink Claw',
      'real-239794':'Ink Vine',
      'real-239795':'Ink Brush'
    };

    for(const item of SHOP_ITEMS){
      const id=String(item?.id||'');
      if(SPRITES[id])item.sprite=SPRITES[id];

      // Starlight Vial e Bounty Talisman são Extra Slot na lógica do Tibia;
      // na Arena isso corresponde à aba Trinkets.
      if(id==='real-218726' || id==='real-240132'){
        item.category='trinkets';
        item.shopDisabled=false;
        if(id==='real-218726')item.vocations=['knight','paladin','sorcerer','druid','monk'];
      }

      // As Ink reais ficam em Trinkets, nunca em Wands/Rods.
      if(INKS[id]){
        item.name=INKS[id];
        item.category='trinkets';
        item.shopDisabled=false;
        item.bonus='Sprite real';
        if(id==='real-239792')item.vocations=['paladin','knight'];
        if(id==='real-239793')item.vocations=['monk'];
        if(id==='real-239794')item.vocations=['druid'];
        if(id==='real-239795')item.vocations=['sorcerer'];
      }

      // Glooth 214973 usa o sprite enviado e é Glooth Armor.
      if(id==='real-214973'){
        item.name='Glooth Armor';
        item.category='armor';
        item.shopDisabled=false;
      }
    }

    // Caso uma versão antiga tenha removido alguma entrada de SHOP_ITEMS,
    // recriamos somente as entradas do Passo 1 usando os sprites existentes.
    const ensureItem=(id,name,category,sprite)=>{
      if(SHOP_ITEMS.some(x=>String(x.id)===id))return;
      SHOP_ITEMS.push({
        id,name,icon:'🛡️',sprite,category,price:500,attack:0,defense:0,
        minLevel:1,bonus:'Sprite real'
      });
    };

    ensureItem('real-218726','Starlight Vial','trinkets','arena-godot/218726.png');
    ensureItem('real-240132','Bounty Talisman','trinkets','arena-godot/240132.png');
    ensureItem('real-239792','Ink Quill','trinkets','arena-godot/239792.png');
    ensureItem('real-239793','Ink Claw','trinkets','arena-godot/239793.png');
    ensureItem('real-239794','Ink Vine','trinkets','arena-godot/239794.png');
    ensureItem('real-239795','Ink Brush','trinkets','arena-godot/239795.png');
    ensureItem('real-214973','Glooth Armor','armor','arena-godot/214973.png');
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

  const AMULET_PROTECTION={
    'Magma Amulet':{fire:20,ice:-10},
    'Terra Amulet':{earth:20,fire:-10},
    'Glacier Amulet':{ice:20,fire:-10},
    'Lightning Pendant':{energy:20,earth:-10},
    'Prismatic Necklace':{physical:10,energy:15},
    'Protection Amulet':{physical:6},
    'Sacred Tree Amulet':{physical:20,earth:20},
    'Shockwave Amulet':{physical:20,energy:20},
    'Bonfire Amulet':{physical:20,fire:20},
    'Leviathan\\'s Amulet':{physical:20,ice:20},
    'Stone Skin Amulet':{physical:20,death:20},
    'Strange Talisman':{energy:10},
    'Silver Amulet':{earth:10},
    'Koshei\\'s Ancient Amulet':{death:8},
    'Rainbow Necklace':{physical:3,fire:6,ice:-5}
  };
  const NEW_AMULET_DEFAULTS={
    'Cobra Amulet':{physical:3},
    'Enchanted Merudri Brooch':{earth:5},
    'Enchanted Pendulet':{death:5},
    'Enchanted Theurgic Amulet':{energy:8},
    'Enchanted Turtle Amulet':{physical:5},
    'Enchanted Werewolf Amulet':{death:5},
    'Foxtail Amulet':{physical:4},
    'Gill Necklace':{ice:5},
    'Greater Garlic Necklace':{death:5},
    'Greawhel Necklace':{earth:5},
    'Lion Amulet':{physical:5},
    'Amuleto #239124':{physical:5},
    'Amuleto #240581':{fire:5},
    'Amuleto #240589':{ice:5},
    'Amuleto #240605':{energy:5},
    'Amuleto #240620':{earth:5},
    'Amuleto #240635':{death:5}
  };
  function applyAmuletProtection(item){
    if(item?.category!=='amulets')return;
    const p=AMULET_PROTECTION[item.name]||NEW_AMULET_DEFAULTS[item.name]||{physical:3};
    item.elementalProtection={...p};
    const labels=Object.entries(p).map(([k,v])=>`${k} ${v>0?'+':''}${v}%`);
    item.protection=labels.join(' · ');
    if(item.name?.startsWith('Amuleto #')||item.name?.includes('Enchanted')||['Cobra Amulet','Foxtail Amulet','Gill Necklace','Greater Garlic Necklace','Greawhel Necklace','Lion Amulet'].includes(item.name)){
      item.bonus=`Proteção: ${labels.join(' · ')}`;
    }
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

      // O catálogo oficial deste projeto recebeu 214973 como Glooth Amulet,
      // mas o item visual usado na Arena deve ser tratado como Glooth Armor.
      if(String(item.id||'')==='real-214973' || String(item.sprite||'').split('/').pop()==='214973.png'){
        if(item.name!=='Glooth Armor')nameChanges++;
        item.name='Glooth Armor';
        item.category='armor';
      }

      // Qualquer Ink encontrado no catálogo fica fora de Wands/Rods e entra em Trinkets.
      if(/^Ink (Blade|Brush|Claw|Quill|Vine)$/i.test(String(item.name||''))){
        item.category='trinkets';
      }

      applyAmuletProtection(item);
    }

    removeQuestTab();
    cleanOldBackpacks();
    cleanStep1WrongItems();

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
      categories:typeof SHOP_CATEGORIES!=='undefined'?SHOP_CATEGORIES.map(x=>x.id):[],
      duplicateIds:[...new Set(SHOP_ITEMS.map(x=>x.id).filter((id,i,a)=>a.indexOf(id)!==i))],
      duplicateNames:[...new Set(SHOP_ITEMS.map(x=>String(x.name||'').trim().toLowerCase()).filter((n,i,a)=>n&&a.indexOf(n)!==i))],
      backpacksWithoutSprite:SHOP_ITEMS.filter(x=>x.category==='backpacks'&&!String(x.sprite||'').trim()).map(x=>x.name),
      amuletsWithElementalProtection:SHOP_ITEMS.filter(x=>x.category==='amulets'&&x.elementalProtection).map(x=>({name:x.name,protection:x.protection}))
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

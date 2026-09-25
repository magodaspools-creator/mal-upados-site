const SHOP_CATEGORIES=[
  {id:'all',label:'Todos'},
  {id:'weapons',label:'Armas'},
  {id:'armor',label:'Armaduras'},
  {id:'legs',label:'Legs'},
  {id:'boots',label:'Boots'},
  {id:'helmets',label:'Helmets'},
  {id:'wands',label:'Wands'},
  {id:'rings',label:'Rings'},
  {id:'amulets',label:'Amuletos'},
  {id:'backpacks',label:'Backpacks'}
];
const SHOP_ITEMS=[
  {id:'fire-sword',name:'Fire Sword',icon:'🗡️',category:'weapons',price:150,attack:8,defense:0,minLevel:1,bonus:'+8 ataque'},
  {id:'spike-sword',name:'Spike Sword',icon:'⚔️',category:'weapons',price:240,attack:11,defense:0,minLevel:3,bonus:'+11 ataque'},
  {id:'dragon-lance',name:'Dragon Lance',icon:'🔱',category:'weapons',price:360,attack:14,defense:0,minLevel:5,bonus:'+14 ataque'},
  {id:'heroic-axe',name:'Heroic Axe',icon:'🪓',category:'weapons',price:500,attack:17,defense:0,minLevel:7,bonus:'+17 ataque'},
  {id:'avenger',name:'Avenger',icon:'⚔️',category:'weapons',price:750,attack:20,defense:0,minLevel:10,bonus:'+20 ataque'},
  {id:'demon-wing-axe',name:'Demonwing Axe',icon:'🪓',category:'weapons',price:1100,attack:24,defense:0,minLevel:14,bonus:'+24 ataque'},
  {id:'demon-blade',name:'Demon Blade',icon:'🗡️',category:'weapons',price:1600,attack:29,defense:0,minLevel:18,bonus:'+29 ataque'},
  {id:'arcanum-edge',name:'Arcanum Edge',icon:'✨',category:'weapons',price:2500,attack:36,defense:0,minLevel:25,bonus:'+36 ataque'},
  {id:'knight-armor',name:'Knight Armor',icon:'🛡️',category:'armor',price:180,attack:0,defense:7,minLevel:2,bonus:'+7 defesa'},
  {id:'plate-armor',name:'Plate Armor',icon:'🛡️',category:'armor',price:300,attack:0,defense:10,minLevel:4,bonus:'+10 defesa'},
  {id:'crown-armor',name:'Crown Armor',icon:'👑',category:'armor',price:480,attack:0,defense:13,minLevel:7,bonus:'+13 defesa'},
  {id:'dragon-scale-mail',name:'Dragon Scale Mail',icon:'🐉',category:'armor',price:700,attack:0,defense:18,minLevel:10,bonus:'+18 defesa'},
  {id:'golden-armor',name:'Golden Armor',icon:'🟨',category:'armor',price:1000,attack:0,defense:22,minLevel:14,bonus:'+22 defesa'},
  {id:'demon-armor',name:'Demon Armor',icon:'😈',category:'armor',price:1450,attack:0,defense:28,minLevel:18,bonus:'+28 defesa'},
  {id:'ornate-chestplate',name:'Ornate Chestplate',icon:'🔱',category:'armor',price:2000,attack:0,defense:34,minLevel:22,bonus:'+34 defesa'},
  {id:'phoenix-plate',name:'Phoenix Plate',icon:'🔥',category:'armor',price:3000,attack:0,defense:42,minLevel:28,bonus:'+42 defesa'},
  {id:'knight-legs',name:'Knight Legs',icon:'🥋',category:'legs',price:160,attack:0,defense:4,minLevel:2,bonus:'+4 defesa'},
  {id:'crown-legs',name:'Crown Legs',icon:'👑',category:'legs',price:280,attack:0,defense:6,minLevel:5,bonus:'+6 defesa'},
  {id:'golden-legs',name:'Golden Legs',icon:'🟨',category:'legs',price:480,attack:0,defense:9,minLevel:8,bonus:'+9 defesa'},
  {id:'demon-legs',name:'Demon Legs',icon:'😈',category:'legs',price:780,attack:0,defense:13,minLevel:13,bonus:'+13 defesa'},
  {id:'ornate-legs',name:'Ornate Legs',icon:'🔱',category:'legs',price:1200,attack:0,defense:17,minLevel:18,bonus:'+17 defesa'},
  {id:'fabulous-legs',name:'Fabulous Legs',icon:'✨',category:'legs',price:1800,attack:0,defense:21,minLevel:23,bonus:'+21 defesa'},
  {id:'falcon-legs',name:'Falcon Greaves',icon:'🦅',category:'legs',price:2500,attack:0,defense:25,minLevel:28,bonus:'+25 defesa'},
  {id:'celestial-legs',name:'Celestial Legs',icon:'🌟',category:'legs',price:3600,attack:0,defense:30,minLevel:35,bonus:'+30 defesa'},
  {id:'steel-boots',name:'Steel Boots',icon:'🥾',category:'boots',price:140,attack:0,defense:3,minLevel:2,bonus:'+3 defesa'},
  {id:'crocodile-boots',name:'Crocodile Boots',icon:'🥾',category:'boots',price:260,attack:0,defense:5,minLevel:5,bonus:'+5 defesa'},
  {id:'guardian-boots',name:'Guardian Boots',icon:'🥾',category:'boots',price:420,attack:0,defense:7,minLevel:8,bonus:'+7 defesa'},
  {id:'boh',name:'Boots of Haste',icon:'⚡',category:'boots',price:650,attack:2,defense:7,minLevel:10,bonus:'+2 ataque · +7 defesa'},
  {id:'draken-boots',name:'Draken Boots',icon:'🐉',category:'boots',price:900,attack:0,defense:10,minLevel:14,bonus:'+10 defesa'},
  {id:'demon-boots',name:'Demon Boots',icon:'😈',category:'boots',price:1300,attack:3,defense:13,minLevel:18,bonus:'+3 ataque · +13 defesa'},
  {id:'winged-boots',name:'Winged Boots',icon:'🪽',category:'boots',price:2000,attack:4,defense:16,minLevel:25,bonus:'+4 ataque · +16 defesa'},
  {id:'phoenix-boots',name:'Phoenix Boots',icon:'🔥',category:'boots',price:3200,attack:6,defense:20,minLevel:32,bonus:'+6 ataque · +20 defesa'},
  {id:'steel-helmet',name:'Steel Helmet',icon:'⛑️',category:'helmets',price:120,attack:0,defense:3,minLevel:1,bonus:'+3 defesa'},
  {id:'crown-helmet',name:'Crown Helmet',icon:'👑',category:'helmets',price:240,attack:0,defense:5,minLevel:4,bonus:'+5 defesa'},
  {id:'royal-helmet',name:'Royal Helmet',icon:'👑',category:'helmets',price:400,attack:0,defense:7,minLevel:7,bonus:'+7 defesa'},
  {id:'demon-helmet',name:'Demon Helmet',icon:'😈',category:'helmets',price:650,attack:2,defense:9,minLevel:11,bonus:'+2 ataque · +9 defesa'},
  {id:'warrior-helmet',name:'Warrior Helmet',icon:'⚔️',category:'helmets',price:950,attack:3,defense:12,minLevel:15,bonus:'+3 ataque · +12 defesa'},
  {id:'cobra-hood',name:'Cobra Hood',icon:'🐍',category:'helmets',price:1400,attack:4,defense:15,minLevel:20,bonus:'+4 ataque · +15 defesa'},
  {id:'falcon-coif',name:'Falcon Coif',icon:'🦅',category:'helmets',price:2100,attack:5,defense:18,minLevel:26,bonus:'+5 ataque · +18 defesa'},
  {id:'grand-sanguine-headguard',name:'Grand Sanguine Headguard',icon:'🩸',category:'helmets',price:3500,attack:7,defense:23,minLevel:35,bonus:'+7 ataque · +23 defesa'},
  {id:'wand-of-inferno',name:'Wand of Inferno',icon:'🔥',category:'wands',price:180,attack:8,defense:0,minLevel:1,bonus:'+8 ataque'},
  {id:'wand-of-everblazing',name:'Wand of Everblazing',icon:'🔥',category:'wands',price:360,attack:12,defense:0,minLevel:5,bonus:'+12 ataque'},
  {id:'wand-of-destruction',name:'Wand of Destruction',icon:'💥',category:'wands',price:650,attack:17,defense:0,minLevel:10,bonus:'+17 ataque'},
  {id:'wand-of-defiance',name:'Wand of Defiance',icon:'🪄',category:'wands',price:900,attack:20,defense:2,minLevel:14,bonus:'+20 ataque · +2 defesa'},
  {id:'wand-of-vortex',name:'Wand of Vortex',icon:'🌪️',category:'wands',price:1250,attack:24,defense:0,minLevel:18,bonus:'+24 ataque'},
  {id:'wand-of-starfall',name:'Wand of Starfall',icon:'🌠',category:'wands',price:1750,attack:29,defense:1,minLevel:23,bonus:'+29 ataque · +1 defesa'},
  {id:'wand-of-abyss',name:'Wand of the Abyss',icon:'🌀',category:'wands',price:2600,attack:35,defense:2,minLevel:30,bonus:'+35 ataque · +2 defesa'},
  {id:'arcanist-wand',name:'Arcanist Wand',icon:'✨',category:'wands',price:3800,attack:43,defense:3,minLevel:38,bonus:'+43 ataque · +3 defesa'},
  {id:'ring-of-healing',name:'Ring of Healing',icon:'💍',category:'rings',price:130,attack:0,defense:5,minLevel:1,bonus:'+5 defesa'},
  {id:'energy-ring',name:'Energy Ring',icon:'💍',category:'rings',price:260,attack:4,defense:4,minLevel:4,bonus:'+4 ataque · +4 defesa'},
  {id:'might-ring',name:'Might Ring',icon:'💍',category:'rings',price:450,attack:3,defense:8,minLevel:8,bonus:'+3 ataque · +8 defesa'},
  {id:'stealth-ring',name:'Stealth Ring',icon:'💍',category:'rings',price:700,attack:6,defense:7,minLevel:12,bonus:'+6 ataque · +7 defesa'},
  {id:'ring-of-bless',name:'Ring of Blessing',icon:'💍',category:'rings',price:1000,attack:8,defense:9,minLevel:16,bonus:'+8 ataque · +9 defesa'},
  {id:'prismatic-ring',name:'Prismatic Ring',icon:'💎',category:'rings',price:1500,attack:10,defense:12,minLevel:21,bonus:'+10 ataque · +12 defesa'},
  {id:'demonbone-ring',name:'Demonbone Ring',icon:'💀',category:'rings',price:2200,attack:14,defense:14,minLevel:28,bonus:'+14 ataque · +14 defesa'},
  {id:'celestial-ring',name:'Celestial Ring',icon:'🌟',category:'rings',price:3400,attack:18,defense:20,minLevel:36,bonus:'+18 ataque · +20 defesa'},
  {id:'real-armor-212189',name:'Armor #212189',icon:'🛡️',sprite:'212189.png',category:'armor',price:450,attack:0,defense:8,minLevel:1,bonus:'+8 defesa'},
  {id:'real-armor-212190',name:'Armor #212190',icon:'🛡️',sprite:'212190.png',category:'armor',price:475,attack:0,defense:8,minLevel:1,bonus:'+8 defesa'},
  {id:'real-armor-214379',name:'Armor #214379',icon:'🛡️',sprite:'214379.png',category:'armor',price:500,attack:0,defense:8,minLevel:1,bonus:'+8 defesa'},
  {id:'real-armor-214385',name:'Armor #214385',icon:'🛡️',sprite:'214385.png',category:'armor',price:525,attack:0,defense:8,minLevel:1,bonus:'+8 defesa'},
  {id:'real-armor-214388',name:'Armor #214388',icon:'🛡️',sprite:'214388.png',category:'armor',price:550,attack:0,defense:8,minLevel:2,bonus:'+8 defesa'},
  {id:'real-armor-214391',name:'Armor #214391',icon:'🛡️',sprite:'214391.png',category:'armor',price:575,attack:0,defense:9,minLevel:2,bonus:'+9 defesa'},
  {id:'real-armor-214394',name:'Armor #214394',icon:'🛡️',sprite:'214394.png',category:'armor',price:600,attack:0,defense:9,minLevel:2,bonus:'+9 defesa'},
  {id:'real-armor-214971',name:'Armor #214971',icon:'🛡️',sprite:'214971.png',category:'armor',price:625,attack:0,defense:9,minLevel:2,bonus:'+9 defesa'},
  {id:'real-armor-214973',name:'Armor #214973',icon:'🛡️',sprite:'214973.png',category:'armor',price:650,attack:0,defense:9,minLevel:3,bonus:'+9 defesa'},
  {id:'real-armor-214974',name:'Armor #214974',icon:'🛡️',sprite:'214974.png',category:'armor',price:675,attack:0,defense:9,minLevel:3,bonus:'+9 defesa'},
  {id:'real-armor-214978',name:'Armor #214978',icon:'🛡️',sprite:'214978.png',category:'armor',price:700,attack:0,defense:10,minLevel:3,bonus:'+10 defesa'},
  {id:'real-armor-214979',name:'Armor #214979',icon:'🛡️',sprite:'214979.png',category:'armor',price:725,attack:0,defense:10,minLevel:3,bonus:'+10 defesa'},
  {id:'real-armor-214983',name:'Armor #214983',icon:'🛡️',sprite:'214983.png',category:'armor',price:750,attack:0,defense:10,minLevel:4,bonus:'+10 defesa'},
  {id:'real-armor-221304',name:'Armor #221304',icon:'🛡️',sprite:'221304.png',category:'armor',price:775,attack:0,defense:10,minLevel:4,bonus:'+10 defesa'},
  {id:'real-armor-221305',name:'Armor #221305',icon:'🛡️',sprite:'221305.png',category:'armor',price:800,attack:0,defense:10,minLevel:4,bonus:'+10 defesa'},
  {id:'real-armor-221307',name:'Armor #221307',icon:'🛡️',sprite:'221307.png',category:'armor',price:825,attack:0,defense:11,minLevel:4,bonus:'+11 defesa'},
  {id:'real-armor-233480',name:'Armor #233480',icon:'🛡️',sprite:'233480.png',category:'armor',price:850,attack:0,defense:11,minLevel:5,bonus:'+11 defesa'},
  {id:'real-armor-236011',name:'Armor #236011',icon:'🛡️',sprite:'236011.png',category:'armor',price:875,attack:0,defense:11,minLevel:5,bonus:'+11 defesa'},
  {id:'real-armor-236012',name:'Armor #236012',icon:'🛡️',sprite:'236012.png',category:'armor',price:900,attack:0,defense:11,minLevel:5,bonus:'+11 defesa'},
  {id:'real-armor-236013',name:'Armor #236013',icon:'🛡️',sprite:'236013.png',category:'armor',price:925,attack:0,defense:11,minLevel:5,bonus:'+11 defesa'},
  {id:'real-armor-236014',name:'Armor #236014',icon:'🛡️',sprite:'236014.png',category:'armor',price:950,attack:0,defense:12,minLevel:6,bonus:'+12 defesa'},
  {id:'real-armor-236015',name:'Armor #236015',icon:'🛡️',sprite:'236015.png',category:'armor',price:975,attack:0,defense:12,minLevel:6,bonus:'+12 defesa'},
  {id:'real-armor-236016',name:'Armor #236016',icon:'🛡️',sprite:'236016.png',category:'armor',price:1000,attack:0,defense:12,minLevel:6,bonus:'+12 defesa'},
  {id:'real-armor-238612',name:'Armor #238612',icon:'🛡️',sprite:'238612.png',category:'armor',price:1025,attack:0,defense:12,minLevel:6,bonus:'+12 defesa'},
  {id:'real-armor-238613',name:'Armor #238613',icon:'🛡️',sprite:'238613.png',category:'armor',price:1050,attack:0,defense:12,minLevel:7,bonus:'+12 defesa'},
  {id:'real-armor-238614',name:'Armor #238614',icon:'🛡️',sprite:'238614.png',category:'armor',price:1075,attack:0,defense:13,minLevel:7,bonus:'+13 defesa'},
  {id:'real-armor-238615',name:'Armor #238615',icon:'🛡️',sprite:'238615.png',category:'armor',price:1100,attack:0,defense:13,minLevel:7,bonus:'+13 defesa'},
  {id:'real-armor-239165',name:'Armor #239165',icon:'🛡️',sprite:'239165.png',category:'armor',price:1125,attack:0,defense:13,minLevel:7,bonus:'+13 defesa'},
  {id:'real-armor-239170',name:'Armor #239170',icon:'🛡️',sprite:'239170.png',category:'armor',price:1150,attack:0,defense:13,minLevel:8,bonus:'+13 defesa'},
  {id:'real-armor-239171',name:'Armor #239171',icon:'🛡️',sprite:'239171.png',category:'armor',price:1175,attack:0,defense:13,minLevel:8,bonus:'+13 defesa'},
  {id:'real-armor-239181',name:'Armor #239181',icon:'🛡️',sprite:'239181.png',category:'armor',price:1200,attack:0,defense:14,minLevel:8,bonus:'+14 defesa'},
  {id:'real-armor-239783',name:'Armor #239783',icon:'🛡️',sprite:'239783.png',category:'armor',price:1225,attack:0,defense:14,minLevel:8,bonus:'+14 defesa'},
  {id:'real-armor-239784',name:'Armor #239784',icon:'🛡️',sprite:'239784.png',category:'armor',price:1250,attack:0,defense:14,minLevel:9,bonus:'+14 defesa'},
  {id:'real-armor-239785',name:'Armor #239785',icon:'🛡️',sprite:'239785.png',category:'armor',price:1275,attack:0,defense:14,minLevel:9,bonus:'+14 defesa'},
  {id:'real-armor-240252',name:'Armor #240252',icon:'🛡️',sprite:'240252.png',category:'armor',price:1300,attack:0,defense:14,minLevel:9,bonus:'+14 defesa'},
  {id:'real-armor-240253',name:'Armor #240253',icon:'🛡️',sprite:'240253.png',category:'armor',price:1325,attack:0,defense:15,minLevel:9,bonus:'+15 defesa'},
  {id:'real-armor-240578',name:'Armor #240578',icon:'🛡️',sprite:'240578.png',category:'armor',price:1350,attack:0,defense:15,minLevel:10,bonus:'+15 defesa'},
  {id:'real-armor-bear-skin',name:'Bear Skin',icon:'🛡️',sprite:'bear skin.png',category:'armor',price:720,attack:0,defense:10,minLevel:10,bonus:'+10 defesa'},
  {id:'real-armor-calopteryx-cape',name:'Calopteryx Cape',icon:'🛡️',sprite:'calopteryx cape.png',category:'armor',price:840,attack:0,defense:11,minLevel:15,bonus:'+11 defesa'},
  {id:'real-armor-death-oyioroi',name:'Death Oyoroi',icon:'🛡️',sprite:'death oyioroi.png',category:'armor',price:960,attack:0,defense:11,minLevel:20,bonus:'+11 defesa',vocation:'Monk'},
  {id:'real-armor-depth-lorica',name:'Depth Lorica',icon:'🛡️',sprite:'depth lorica.png',category:'armor',price:1080,attack:0,defense:12,minLevel:25,bonus:'+12 defesa'},
  {id:'real-armor-dwanfire-sherwany',name:'Dawnfire Sherwani',icon:'🛡️',sprite:'dwanfire sherwany.png',category:'armor',price:1200,attack:0,defense:12,minLevel:30,bonus:'+12 defesa',vocation:'Sorcerer'},
  {id:'real-armor-gill-coat',name:'Gill Coat',icon:'🛡️',sprite:'gill coat.png',category:'armor',price:1320,attack:0,defense:13,minLevel:35,bonus:'+13 defesa'},
  {id:'real-armor-gnomish-cuirass',name:'Gnomish Cuirass',icon:'🛡️',sprite:'gnomish cuirass.png',category:'armor',price:1440,attack:0,defense:13,minLevel:40,bonus:'+13 defesa',vocation:'Monk'},
  {id:'real-armor-green-demon-armor',name:'Green Demon Armor',icon:'🛡️',sprite:'green demon armor.png',category:'armor',price:1560,attack:0,defense:14,minLevel:45,bonus:'+14 defesa'},
  {id:'real-armor-ice-robe',name:'Ice Robe',icon:'🛡️',sprite:'ice robe.png',category:'armor',price:1680,attack:0,defense:14,minLevel:50,bonus:'+14 defesa',vocation:'Monk'},
  {id:'real-armor-lightning-robe',name:'Lightning Robe',icon:'🛡️',sprite:'lightning robe.png',category:'armor',price:1800,attack:0,defense:15,minLevel:55,bonus:'+15 defesa',vocation:'Monk'},
  {id:'real-armor-merudri-nanbando',name:'Merudri Nanbando',icon:'🛡️',sprite:'merudri nanbando.png',category:'armor',price:1920,attack:0,defense:15,minLevel:60,bonus:'+15 defesa',vocation:'Monk'},
  {id:'real-armor-monk-robe',name:'Monk Robe',icon:'🛡️',sprite:'monk robe.png',category:'armor',price:2040,attack:0,defense:16,minLevel:65,bonus:'+16 defesa',vocation:'Monk'},
  {id:'real-armor-naga-tanko',name:'Naga Tanko',icon:'🛡️',sprite:'naga tanko.png',category:'armor',price:2160,attack:0,defense:16,minLevel:70,bonus:'+16 defesa',vocation:'Monk'},
  {id:'real-armor-ornate-chestplate',name:'Ornate Chestplate',icon:'🛡️',sprite:'ornate chestplate.png',category:'armor',price:2280,attack:0,defense:17,minLevel:75,bonus:'+17 defesa'},
  {id:'real-armor-prismatic-armor',name:'Prismatic Armor',icon:'🛡️',sprite:'prismatic armor.png',category:'armor',price:2400,attack:0,defense:17,minLevel:80,bonus:'+17 defesa'},
  {id:'real-armor-robe-of-enlightment',name:'Robe of Enlightenment',icon:'🛡️',sprite:'robe of enlightment.png',category:'armor',price:2520,attack:0,defense:18,minLevel:85,bonus:'+18 defesa',vocation:'Monk'},
  {id:'real-armor-soul-mantle',name:'Soul Mantle',icon:'🛡️',sprite:'soul mantle.png',category:'armor',price:2640,attack:0,defense:18,minLevel:90,bonus:'+18 defesa'},
  {id:'real-armor-stoic-iks-robe',name:'Stoic Iks Robe',icon:'🛡️',sprite:'stoic iks robe.png',category:'armor',price:2760,attack:0,defense:19,minLevel:95,bonus:'+19 defesa',vocation:'Monk'},
  {id:'real-armor-terra-mantle',name:'Terra Mantle',icon:'🛡️',sprite:'terra mantle.png',category:'armor',price:2880,attack:0,defense:19,minLevel:100,bonus:'+19 defesa'},
  {id:'real-armor-zaoan-monk-robe',name:'Zaoan Monk Robe',icon:'🛡️',sprite:'zaoan monk robe.png',category:'armor',price:3000,attack:0,defense:20,minLevel:105,bonus:'+20 defesa',vocation:'Monk'},
  {id:'real-weapon-bambus-joo',name:'Bambus Jo',icon:'⚔️',sprite:'bambus joo.png',category:'weapons',price:700,attack:18,defense:0,minLevel:10,bonus:'+18 ataque',vocation:'Monk'},
  {id:'real-weapon-chaos-mace',name:'Chaos Mace',icon:'⚔️',sprite:'chaos mace.png',category:'weapons',price:700,attack:18,defense:0,minLevel:10,bonus:'+18 ataque',vocation:'Knight'},
  {id:'real-weapon-cobra-axe',name:'Cobra Axe',icon:'⚔️',sprite:'cobra axe.png',category:'weapons',price:840,attack:19,defense:0,minLevel:16,bonus:'+19 ataque',vocation:'Knight'},
  {id:'real-weapon-cobra-boo',name:'Cobra Bo',icon:'⚔️',sprite:'cobra boo.png',category:'weapons',price:980,attack:20,defense:0,minLevel:22,bonus:'+20 ataque',vocation:'Monk'},
  {id:'real-weapon-cobra-club',name:'Cobra Club',icon:'⚔️',sprite:'cobra club.png',category:'weapons',price:1120,attack:21,defense:0,minLevel:28,bonus:'+21 ataque',vocation:'Knight'},
  {id:'real-weapon-cobra-sword',name:'Cobra Sword',icon:'⚔️',sprite:'cobra sword.png',category:'weapons',price:1260,attack:22,defense:0,minLevel:34,bonus:'+22 ataque',vocation:'Knight'},
  {id:'real-weapon-crystalline-sword',name:'Crystalline Sword',icon:'⚔️',sprite:'crystalline sword.png',category:'weapons',price:1400,attack:23,defense:0,minLevel:40,bonus:'+23 ataque',vocation:'Knight'},
  {id:'real-weapon-depth-claw',name:'Depth Claws',icon:'⚔️',sprite:'depth claw.png',category:'weapons',price:1540,attack:24,defense:0,minLevel:46,bonus:'+24 ataque',vocation:'Monk'},
  {id:'real-weapon-eldritch-crescent-moon-spade',name:'Eldritch Crescent Moon Spade',icon:'⚔️',sprite:'eldritch crescent moon spade.png',category:'weapons',price:1680,attack:25,defense:0,minLevel:52,bonus:'+25 ataque',vocation:'Monk'},
  {id:'real-weapon-fists-of-enlightment',name:'Fists of Enlightenment',icon:'⚔️',sprite:'fists of enlightment.png',category:'weapons',price:1820,attack:26,defense:0,minLevel:58,bonus:'+26 ataque',vocation:'Monk'},
  {id:'real-weapon-glooth-axe',name:'Glooth Axe',icon:'⚔️',sprite:'glooth axe.png',category:'weapons',price:1960,attack:27,defense:0,minLevel:64,bonus:'+27 ataque',vocation:'Knight'},
  {id:'real-weapon-glooth-club',name:'Glooth Club',icon:'⚔️',sprite:'glooth club.png',category:'weapons',price:2100,attack:28,defense:0,minLevel:70,bonus:'+28 ataque',vocation:'Knight'},
  {id:'real-weapon-glooth-sword',name:'Glooth Sword',icon:'⚔️',sprite:'glooth sword.png',category:'weapons',price:2240,attack:29,defense:0,minLevel:76,bonus:'+29 ataque',vocation:'Knight'},
  {id:'real-weapon-inferniarch-blade',name:'Inferniarch Blade',icon:'⚔️',sprite:'inferniarch blade.png',category:'weapons',price:2380,attack:30,defense:0,minLevel:82,bonus:'+30 ataque',vocation:'Knight'},
  {id:'real-weapon-inferniarch-claw',name:'Inferniarch Claw',icon:'⚔️',sprite:'inferniarch claw.png',category:'weapons',price:2520,attack:31,defense:0,minLevel:88,bonus:'+31 ataque',vocation:'Monk'},
  {id:'real-weapon-inferniarch-slayer',name:'Inferniarch Slayer',icon:'⚔️',sprite:'inferniarch slayer.png',category:'weapons',price:2660,attack:32,defense:0,minLevel:94,bonus:'+32 ataque',vocation:'Knight'},
  {id:'real-weapon-iron-fists',name:'Pair of Iron Fists',icon:'⚔️',sprite:'iron fists.png',category:'weapons',price:2800,attack:33,defense:0,minLevel:100,bonus:'+33 ataque',vocation:'Monk'},
  {id:'real-weapon-lion-axe',name:'Lion Axe',icon:'⚔️',sprite:'lion axe.png',category:'weapons',price:2940,attack:34,defense:0,minLevel:106,bonus:'+34 ataque',vocation:'Knight'},
  {id:'real-weapon-lion-claw',name:'Lion Claw',icon:'⚔️',sprite:'lion claw.png',category:'weapons',price:3080,attack:35,defense:0,minLevel:112,bonus:'+35 ataque',vocation:'Monk'},
  {id:'real-weapon-lion-hammer',name:'Lion Hammer',icon:'⚔️',sprite:'lion hammer.png',category:'weapons',price:3220,attack:36,defense:0,minLevel:118,bonus:'+36 ataque',vocation:'Knight'},
  {id:'real-weapon-mino-blade',name:'Mino Blade',icon:'⚔️',sprite:'mino blade.png',category:'weapons',price:3360,attack:37,defense:0,minLevel:124,bonus:'+37 ataque',vocation:'Knight'},
  {id:'real-weapon-mino-lance',name:'Mino Lance',icon:'⚔️',sprite:'mino lance.png',category:'weapons',price:3500,attack:38,defense:0,minLevel:130,bonus:'+38 ataque',vocation:'Knight'},
  {id:'real-weapon-naga-axe',name:'Naga Axe',icon:'⚔️',sprite:'naga axe.png',category:'weapons',price:3640,attack:39,defense:0,minLevel:136,bonus:'+39 ataque',vocation:'Knight'},
  {id:'real-weapon-naga-club',name:'Naga Club',icon:'⚔️',sprite:'naga club.png',category:'weapons',price:3780,attack:40,defense:0,minLevel:142,bonus:'+40 ataque',vocation:'Knight'},
  {id:'real-weapon-naga-sword',name:'Naga Sword',icon:'⚔️',sprite:'naga sword.png',category:'weapons',price:3920,attack:41,defense:0,minLevel:148,bonus:'+41 ataque',vocation:'Knight'},
  {id:'real-weapon-nunchaku-of-enlightment',name:'Nunchaku of Enlightenment',icon:'⚔️',sprite:'nunchaku of enlightment.png',category:'weapons',price:4060,attack:42,defense:0,minLevel:154,bonus:'+42 ataque',vocation:'Monk'},
  {id:'real-weapon-nunchaku',name:'Nunchaku',icon:'⚔️',sprite:'nunchaku].png',category:'weapons',price:4200,attack:43,defense:0,minLevel:160,bonus:'+43 ataque',vocation:'Monk'},
  {id:'real-weapon-sai-of-enlightment',name:'Sai of Enlightenment',icon:'⚔️',sprite:'sai of enlightment.png',category:'weapons',price:4340,attack:44,defense:0,minLevel:166,bonus:'+44 ataque',vocation:'Monk'},
  {id:'real-weapon-sai',name:'Sai',icon:'⚔️',sprite:'sai.png',category:'weapons',price:4480,attack:45,defense:0,minLevel:172,bonus:'+45 ataque',vocation:'Monk'},
  {id:'real-weapon-shiny-blade',name:'Shiny Blade',icon:'⚔️',sprite:'shiny blade.png',category:'weapons',price:4620,attack:46,defense:0,minLevel:178,bonus:'+46 ataque',vocation:'Knight'},
  {id:'real-weapon-tagralt-blade',name:'Tagralt Blade',icon:'⚔️',sprite:'tagralt blade.png',category:'weapons',price:4760,attack:47,defense:0,minLevel:184,bonus:'+47 ataque',vocation:'Knight'},
  {id:'real-weapon-the-impaler',name:'The Impaler',icon:'⚔️',sprite:'the impaler.png',category:'weapons',price:4900,attack:48,defense:0,minLevel:190,bonus:'+48 ataque',vocation:'Knight'},
  {id:'real-weapon-umbral-master-katar',name:'Umbral Master Katar',icon:'⚔️',sprite:'umbral master katar.png',category:'weapons',price:5040,attack:49,defense:0,minLevel:196,bonus:'+49 ataque',vocation:'Monk'},
  {id:'real-weapon-umbral-master-slayer',name:'Umbral Master Slayer',icon:'⚔️',sprite:'umbral master slayer.png',category:'weapons',price:5180,attack:50,defense:0,minLevel:202,bonus:'+50 ataque',vocation:'Knight'},
  {id:'real-bp-20-years',name:'20 Years Backpack',icon:'🎒',sprite:'20 years backpack.png',category:'backpacks',price:5000,attack:0,defense:0,minLevel:5,slots:6,bonus:'6 slots · Amuletos + Trinkets'},
  {id:'real-bp-adventurer',name:"Adventurer's Backpack",icon:'🎒',sprite:"adventurer's backpack.png",category:'backpacks',price:3500,attack:0,defense:0,minLevel:5,slots:5,bonus:'5 slots · Amuletos + Trinkets'},
  {id:'real-bp-blossom',name:'Blossom Backpack',icon:'🎒',sprite:'blossom backpack.png',category:'backpacks',price:6500,attack:0,defense:0,minLevel:8,slots:6,bonus:'6 slots · Amuletos + Trinkets'},
  {id:'real-bp-book',name:'Book Backpack',icon:'🎒',sprite:'book backpack.png',category:'backpacks',price:7000,attack:0,defense:0,minLevel:10,slots:6,bonus:'6 slots · Amuletos + Trinkets'},
  {id:'real-bp-boss',name:'Boss Backpack',icon:'🎒',sprite:'boss backpack.png',category:'backpacks',price:12000,attack:0,defense:0,minLevel:15,slots:7,bonus:'7 slots · Amuletos + Trinkets'},
  {id:'real-bp-captain',name:'Captain Backpack',icon:'🎒',sprite:'captain backpack.png',category:'backpacks',price:8500,attack:0,defense:0,minLevel:12,slots:6,bonus:'6 slots · Amuletos + Trinkets'},
  {id:'real-bp-crystalline',name:'Crystalline Backpack',icon:'🎒',sprite:'crystalline backpack.png',category:'backpacks',price:10000,attack:0,defense:0,minLevel:14,slots:7,bonus:'7 slots · Amuletos + Trinkets'},
  {id:'real-bp-deepling',name:'Deepling Backpack',icon:'🎒',sprite:'deepling backpack.png',category:'backpacks',price:9000,attack:0,defense:0,minLevel:13,slots:7,bonus:'7 slots · Amuletos + Trinkets'},
  {id:'real-bp-energetic',name:'Energetic Backpack',icon:'🎒',sprite:'energetic backpack.png',category:'backpacks',price:11000,attack:0,defense:0,minLevel:16,slots:7,bonus:'7 slots · Amuletos + Trinkets'},
  {id:'real-bp-ghost',name:'Ghost Backpack',icon:'🎒',sprite:'ghost backpack.png',category:'backpacks',price:12500,attack:0,defense:0,minLevel:18,slots:8,bonus:'8 slots · Amuletos + Trinkets'},
  {id:'real-bp-glooth',name:'Glooth Backpack',icon:'🎒',sprite:'glooth backpack.png',category:'backpacks',price:10500,attack:0,defense:0,minLevel:15,slots:7,bonus:'7 slots · Amuletos + Trinkets'},
  {id:'real-bp-gnome',name:'Gnome Backpack',icon:'🎒',sprite:'gnome backpack.png',category:'backpacks',price:13000,attack:0,defense:0,minLevel:20,slots:8,bonus:'8 slots · Amuletos + Trinkets'},
  {id:'real-bp-ladybug',name:'Ladybug Backpack',icon:'🎒',sprite:'ladybug backpack.png',category:'backpacks',price:7500,attack:0,defense:0,minLevel:10,slots:6,bonus:'6 slots · Amuletos + Trinkets'},
  {id:'real-bp-mouth',name:'Mouth Backpack',icon:'🎒',sprite:'mouth backpack.png',category:'backpacks',price:9500,attack:0,defense:0,minLevel:14,slots:7,bonus:'7 slots · Amuletos + Trinkets'},
  {id:'real-bp-pillow',name:'Pillow Backpack',icon:'🎒',sprite:'pillow backpack.png',category:'backpacks',price:8000,attack:0,defense:0,minLevel:11,slots:6,bonus:'6 slots · Amuletos + Trinkets'},
  {id:'real-bp-rascacoon',name:'Rascacoon Backpack',icon:'🎒',sprite:'rascacoon backpack.png',category:'backpacks',price:11500,attack:0,defense:0,minLevel:17,slots:7,bonus:'7 slots · Amuletos + Trinkets'},
  {id:'real-bp-wolf',name:'Wolf Backpack',icon:'🎒',sprite:'wolf backpack.png',category:'backpacks',price:9000,attack:0,defense:0,minLevel:13,slots:7,bonus:'7 slots · Amuletos + Trinkets'}

  {id:'real-boots-199464',name:'Boots #199464',icon:'🥾',sprite:'199464.png',category:'boots',price:350,attack:0,defense:5,minLevel:1,bonus:'+5 defesa'},
  {id:'real-boots-199465',name:'Boots #199465',icon:'🥾',sprite:'199465.png',category:'boots',price:410,attack:0,defense:5,minLevel:1,bonus:'+5 defesa'},
  {id:'real-boots-212191',name:'Boots #212191',icon:'🥾',sprite:'212191.png',category:'boots',price:470,attack:0,defense:5,minLevel:1,bonus:'+5 defesa'},
  {id:'real-boots-212192',name:'Boots #212192',icon:'🥾',sprite:'212192.png',category:'boots',price:530,attack:0,defense:5,minLevel:2,bonus:'+5 defesa'},
  {id:'real-boots-214976',name:'Boots #214976',icon:'🥾',sprite:'214976.png',category:'boots',price:590,attack:0,defense:6,minLevel:2,bonus:'+6 defesa'},
  {id:'real-boots-215397',name:'Boots #215397',icon:'🥾',sprite:'215397.png',category:'boots',price:650,attack:0,defense:6,minLevel:2,bonus:'+6 defesa'},
  {id:'real-boots-220603',name:'Boots #220603',icon:'🥾',sprite:'220603.png',category:'boots',price:710,attack:0,defense:6,minLevel:3,bonus:'+6 defesa'},
  {id:'real-boots-221306',name:'Boots #221306',icon:'🥾',sprite:'221306.png',category:'boots',price:770,attack:0,defense:6,minLevel:3,bonus:'+6 defesa'},
  {id:'real-boots-222644',name:'Boots #222644',icon:'🥾',sprite:'222644.png',category:'boots',price:830,attack:0,defense:7,minLevel:3,bonus:'+7 defesa'},
  {id:'real-boots-233476',name:'Boots #233476',icon:'🥾',sprite:'233476.png',category:'boots',price:890,attack:0,defense:7,minLevel:4,bonus:'+7 defesa'},
  {id:'real-boots-236021',name:'Boots #236021',icon:'🥾',sprite:'236021.png',category:'boots',price:950,attack:0,defense:7,minLevel:4,bonus:'+7 defesa'},
  {id:'real-boots-236022',name:'Boots #236022',icon:'🥾',sprite:'236022.png',category:'boots',price:1010,attack:0,defense:7,minLevel:4,bonus:'+7 defesa'},
  {id:'real-boots-238610',name:'Boots #238610',icon:'🥾',sprite:'238610.png',category:'boots',price:1070,attack:0,defense:8,minLevel:5,bonus:'+8 defesa'},
  {id:'real-boots-238611',name:'Boots #238611',icon:'🥾',sprite:'238611.png',category:'boots',price:1130,attack:0,defense:8,minLevel:5,bonus:'+8 defesa'},
  {id:'real-boots-239172',name:'Boots #239172',icon:'🥾',sprite:'239172.png',category:'boots',price:1190,attack:0,defense:8,minLevel:5,bonus:'+8 defesa'},
  {id:'real-boots-239789',name:'Boots #239789',icon:'🥾',sprite:'239789.png',category:'boots',price:1250,attack:0,defense:8,minLevel:6,bonus:'+8 defesa'},
  {id:'real-boots-239790',name:'Boots #239790',icon:'🥾',sprite:'239790.png',category:'boots',price:1310,attack:0,defense:9,minLevel:6,bonus:'+9 defesa'},
  {id:'real-boots-240255',name:'Boots #240255',icon:'🥾',sprite:'240255.png',category:'boots',price:1370,attack:0,defense:9,minLevel:6,bonus:'+9 defesa'},
  {id:'real-boots-240256',name:'Boots #240256',icon:'🥾',sprite:'240256.png',category:'boots',price:1430,attack:0,defense:9,minLevel:7,bonus:'+9 defesa'},
  {id:'real-boots-depth-calcei',name:'Depth Calcei',icon:'🥾',sprite:'depth calcei.png',category:'boots',price:1500,attack:0,defense:10,minLevel:15,bonus:'+10 defesa'},
  {id:'real-boots-dreamwalker-boots',name:'Dreamwalker Boots',icon:'🥾',sprite:'dreamwalker boots.png',category:'boots',price:1650,attack:0,defense:10,minLevel:19,bonus:'+10 defesa'},
  {id:'real-boots-enlightment-boots',name:'Enlightenment Boots',icon:'🥾',sprite:'enlightment boots.png',category:'boots',price:1800,attack:0,defense:11,minLevel:23,bonus:'+11 defesa'},
  {id:'real-boots-frostflower-boots',name:'Frostflower Boots',icon:'🥾',sprite:'frostflower boots.png',category:'boots',price:1950,attack:0,defense:11,minLevel:27,bonus:'+11 defesa'},
  {id:'real-boots-green-spleepbunny-boots',name:'Green Spleepbunny Boots',icon:'🥾',sprite:'green spleepbunny boots.png',category:'boots',price:2100,attack:0,defense:12,minLevel:31,bonus:'+12 defesa'},
  {id:'real-boots-magma-boots',name:'Magma Boots',icon:'🥾',sprite:'magma boots.png',category:'boots',price:2250,attack:0,defense:12,minLevel:35,bonus:'+12 defesa'},
  {id:'real-boots-nightmare-boots',name:'Nightmare Boots',icon:'🥾',sprite:'nightmare boots.png',category:'boots',price:2400,attack:0,defense:13,minLevel:39,bonus:'+13 defesa'},
  {id:'real-boots-prismatic-boots',name:'Prismatic Boots',icon:'🥾',sprite:'prismatic boots.png',category:'boots',price:2550,attack:0,defense:13,minLevel:43,bonus:'+13 defesa'},
  {id:'real-boots-stag-boots',name:'Stag Boots',icon:'🥾',sprite:'stag boots.png',category:'boots',price:2700,attack:0,defense:14,minLevel:47,bonus:'+14 defesa'},
  {id:'real-boots-stoic-iks-boots',name:'Stoic Iks Boots',icon:'🥾',sprite:'stoic iks boots.png',category:'boots',price:2850,attack:0,defense:14,minLevel:51,bonus:'+14 defesa'},
  {id:'real-boots-terra-boots',name:'Terra Boots',icon:'🥾',sprite:'terra boots.png',category:'boots',price:3000,attack:0,defense:15,minLevel:55,bonus:'+15 defesa'},
  {id:'real-boots-void-boots',name:'Void Boots',icon:'🥾',sprite:'void boots.png',category:'boots',price:3150,attack:0,defense:15,minLevel:59,bonus:'+15 defesa'},
  {id:'real-boots-yalahari-boots',name:'Yalahari Boots',icon:'🥾',sprite:'yalahari boots.png',category:'boots',price:3300,attack:0,defense:16,minLevel:63,bonus:'+16 defesa'},
  {id:'real-boots-gnomish-footwraps',name:'Gnomish Footwraps',icon:'🥾',sprite:'gnomish footwraps.png',category:'boots',price:3450,attack:0,defense:16,minLevel:67,bonus:'+16 defesa'},
  {id:'real-rp-cobra-crossbow',name:'Cobra Crossbow',icon:'🏹',sprite:'cobra crossbow.png',category:'weapons',price:1200,attack:24,defense:0,minLevel:12,bonus:'+24 ataque',vocation:'Paladin'},
  {id:'real-rp-glooth-spear',name:'Glooth Spear',icon:'🏹',sprite:'glooth spear.png',category:'weapons',price:1700,attack:27,defense:0,minLevel:19,bonus:'+27 ataque',vocation:'Paladin'},
  {id:'real-rp-naga-crossbow',name:'Naga Crossbow',icon:'🏹',sprite:'naga crossbow.png',category:'weapons',price:2200,attack:30,defense:0,minLevel:26,bonus:'+30 ataque',vocation:'Paladin'},
  {id:'real-rp-ornate-crossbow',name:'Ornate Crossbow',icon:'🏹',sprite:'ornate crossbow.png',category:'weapons',price:2700,attack:33,defense:0,minLevel:33,bonus:'+33 ataque',vocation:'Paladin'},
  {id:'real-rp-rift-bow',name:'Rift Bow',icon:'🏹',sprite:'rift bow.png',category:'weapons',price:3200,attack:36,defense:0,minLevel:40,bonus:'+36 ataque',vocation:'Paladin'},
  {id:'real-rp-rift-crossbow',name:'Rift Crossbow',icon:'🏹',sprite:'rift crossbow.png',category:'weapons',price:3700,attack:39,defense:0,minLevel:47,bonus:'+39 ataque',vocation:'Paladin'},
  {id:'real-rp-umbral-master-bow',name:'Umbral Master Bow',icon:'🏹',sprite:'umbral master bow.png',category:'weapons',price:4200,attack:42,defense:0,minLevel:54,bonus:'+42 ataque',vocation:'Paladin'},
  {id:'real-rp-umbral-master-crossbow',name:'Umbral Master Crossbow',icon:'🏹',sprite:'umbral master crossbow.png',category:'weapons',price:4700,attack:45,defense:0,minLevel:61,bonus:'+45 ataque',vocation:'Paladin'},
  {id:'real-gnome-gnome-armor',name:'Gnome Armor',icon:'🛡️',sprite:'gnome armor.png',category:'armor',price:1100,attack:0,defense:14,minLevel:10,bonus:'+14 defesa',},
  {id:'real-gnome-gnome-helmet',name:'Gnome Helmet',icon:'🛡️',sprite:'gnome helmet.png',category:'helmets',price:1540,attack:0,defense:12,minLevel:20,bonus:'+12 defesa',},
  {id:'real-gnome-gnome-legs',name:'Gnome Legs',icon:'🛡️',sprite:'gnome legs.png',category:'legs',price:1760,attack:0,defense:10,minLevel:25,bonus:'+10 defesa',},
  {id:'real-gnome-gnome-shield',name:'Gnome Shield',icon:'🛡️',sprite:'gnome shield.png',category:'shield',price:1980,attack:0,defense:12,minLevel:30,bonus:'+12 defesa',},
  {id:'real-gnome-gnome-sword',name:'Gnome Sword',icon:'⚔️',sprite:'gnome sword.png',category:'weapons',price:2200,attack:18,defense:0,minLevel:35,bonus:'+18 ataque',vocation:'Knight',},
  {id:'real-falcon-falcon-battleaxe',name:'Falcon Battleaxe',icon:'⚔️',sprite:'falcon battleaxe.png',category:'weapons',price:2200,attack:30,defense:0,minLevel:25,bonus:'+30 ataque',vocation:'Knight'},
  {id:'real-falcon-falcon-bow',name:'Falcon Bow',icon:'⚔️',sprite:'falcon bow.png',category:'weapons',price:2500,attack:31,defense:0,minLevel:29,bonus:'+31 ataque',vocation:'Paladin'},
  {id:'real-falcon-falcon-circlet',name:'Falcon Circlet',icon:'🛡️',sprite:'falcon circlet.png',category:'helmets',price:2800,attack:0,defense:20,minLevel:33,bonus:'+20 defesa',vocation:'Sorcerer'},
  {id:'real-falcon-falcon-escutcheon',name:'Falcon Escutcheon',icon:'🛡️',sprite:'falcon escutcheon.png',category:'shield',price:3100,attack:0,defense:21,minLevel:37,bonus:'+21 defesa'},
  {id:'real-falcon-falcon-longword',name:'Falcon Longsword',icon:'⚔️',sprite:'falcon longword.png',category:'weapons',price:3400,attack:34,defense:0,minLevel:41,bonus:'+34 ataque',vocation:'Knight'},
  {id:'real-falcon-falcon-mace',name:'Falcon Mace',icon:'⚔️',sprite:'falcon mace.png',category:'weapons',price:3700,attack:35,defense:0,minLevel:45,bonus:'+35 ataque',vocation:'Knight'},
  {id:'real-falcon-falcon-plate',name:'Falcon Plate',icon:'🛡️',sprite:'falcon plate.png',category:'armor',price:4000,attack:0,defense:24,minLevel:49,bonus:'+24 defesa',vocation:'Knight'},
  {id:'real-falcon-falcon-rod',name:'Falcon Rod',icon:'⚔️',sprite:'falcon rod.png',category:'rods',price:4300,attack:28,defense:0,minLevel:53,bonus:'+28 ataque',vocation:'Druid'},
  {id:'real-falcon-falcon-shield',name:'Falcon Shield',icon:'🛡️',sprite:'falcon shield.png',category:'shield',price:4600,attack:0,defense:26,minLevel:57,bonus:'+26 defesa'},
  {id:'real-falcon-falcon-wand',name:'Falcon Wand',icon:'⚔️',sprite:'falcon wand.png',category:'wands',price:4900,attack:28,defense:0,minLevel:61,bonus:'+28 ataque',vocation:'Sorcerer'},
  {id:'amulet-cobra',name:'Cobra Amulet',icon:'✦',sprite:'cobra amulet.png',category:'amulets',price:500,attack:0,defense:0,minLevel:1,bonus:'Amuleto'},
  {id:'amulet-enchanted-merudri',name:'Enchanted Merudri Brooch',icon:'✦',sprite:'enchanted merudri brooch.png',category:'amulets',price:500,attack:0,defense:0,minLevel:1,bonus:'Amuleto'},
  {id:'amulet-enchanted-pendulet',name:'Enchanted Pendulet',icon:'✦',sprite:'enchanted pendulet.png',category:'amulets',price:500,attack:0,defense:0,minLevel:1,bonus:'Amuleto'},
  {id:'amulet-enchanted-theurgic',name:'Enchanted Theurgic Amulet',icon:'✦',sprite:'enchanted theurgic amulet.png',category:'amulets',price:500,attack:0,defense:0,minLevel:1,bonus:'Amuleto'},
  {id:'amulet-enchanted-turtle',name:'Enchanted Turtle Amulet',icon:'✦',sprite:'enchanted turtle amulet.png',category:'amulets',price:500,attack:0,defense:0,minLevel:1,bonus:'Amuleto'},
  {id:'amulet-enchanted-werewolf',name:'Enchanted Werewolf Amulet',icon:'✦',sprite:'enchanted werewolf amulet.png',category:'amulets',price:500,attack:0,defense:0,minLevel:1,bonus:'Amuleto'},
  {id:'amulet-foxtail',name:'Foxtail Amulet',icon:'✦',sprite:'foxtail amulet.png',category:'amulets',price:500,attack:0,defense:0,minLevel:1,bonus:'Amuleto'},
  {id:'amulet-gill-necklace',name:'Gill Necklace',icon:'✦',sprite:'gill necklace.png',category:'amulets',price:500,attack:0,defense:0,minLevel:1,bonus:'Amuleto'},
  {id:'amulet-glacier',name:'Glacier Amulet',icon:'✦',sprite:'glacier amulet.png',category:'amulets',price:500,attack:0,defense:0,minLevel:1,bonus:'Amuleto'},
  {id:'amulet-greater-garlic',name:'Greater Garlic Necklace',icon:'✦',sprite:'greater garlic necklace.png',category:'amulets',price:500,attack:0,defense:0,minLevel:1,bonus:'Amuleto'},
  {id:'amulet-greawhel',name:'Greawhel Necklace',icon:'✦',sprite:'greawhel necklace.png',category:'amulets',price:500,attack:0,defense:0,minLevel:1,bonus:'Amuleto'},
  {id:'amulet-lion',name:'Lion Amulet',icon:'✦',sprite:'lion amulet.png',category:'amulets',price:500,attack:0,defense:0,minLevel:1,bonus:'Amuleto'},
  {id:'amulet-magma',name:'Magma Amulet',icon:'✦',sprite:'magma amulet.png',category:'amulets',price:500,attack:0,defense:0,minLevel:1,bonus:'Amuleto'},
  {id:'amulet-prismatic',name:'Prismatic Necklace',icon:'✦',sprite:'prismatic necklace.png',category:'amulets',price:500,attack:0,defense:0,minLevel:1,bonus:'Amuleto'},
  {id:'amulet-terra',name:'Terra Amulet',icon:'✦',sprite:'terra amulet.png',category:'amulets',price:500,attack:0,defense:0,minLevel:1,bonus:'Amuleto'},
  {id:'amulet-239124',name:'Amuleto #239124',icon:'✦',sprite:'239124.png',category:'amulets',price:500,attack:0,defense:0,minLevel:1,bonus:'Amuleto'},
  {id:'amulet-240581',name:'Amuleto #240581',icon:'✦',sprite:'240581.png',category:'amulets',price:500,attack:0,defense:0,minLevel:1,bonus:'Amuleto'},
  {id:'amulet-240589',name:'Amuleto #240589',icon:'✦',sprite:'240589.png',category:'amulets',price:500,attack:0,defense:0,minLevel:1,bonus:'Amuleto'},
  {id:'amulet-240605',name:'Amuleto #240605',icon:'✦',sprite:'240605.png',category:'amulets',price:500,attack:0,defense:0,minLevel:1,bonus:'Amuleto'},
  {id:'amulet-240620',name:'Amuleto #240620',icon:'✦',sprite:'240620.png',category:'amulets',price:500,attack:0,defense:0,minLevel:1,bonus:'Amuleto'},
  {id:'amulet-240635',name:'Amuleto #240635',icon:'✦',sprite:'240635.png',category:'amulets',price:500,attack:0,defense:0,minLevel:1,bonus:'Amuleto'},
];
let shopFilter='all';
function shopEnsure(){
  if(!game)return;
  if(!game.shopOwned)game.shopOwned=['base-weapon','base-armor'];
  if(!game.shopEquipped)game.shopEquipped={weapon:'base-weapon',armor:'base-armor',legs:null,boots:null,helmets:null,wands:null,rings:null,amulet:null};
  if(!game.shopOwned.includes('base-weapon'))game.shopOwned.push('base-weapon');
  if(!game.shopOwned.includes('base-armor'))game.shopOwned.push('base-armor');
  if(game.ownedWeapons?.length>0 && game.ownedWeapons.includes(1)&&!game.shopOwned.includes('fire-sword'))game.shopOwned.push('fire-sword');
  if(game.ownedWeapons?.length>0 && game.ownedWeapons.includes(2)&&!game.shopOwned.includes('heroic-axe'))game.shopOwned.push('heroic-axe');
  if(game.ownedWeapons?.length>0 && game.ownedWeapons.includes(3)&&!game.shopOwned.includes('demon-blade'))game.shopOwned.push('demon-blade');
  if(game.ownedWeapons?.length>0 && game.ownedWeapons.includes(4)&&!game.shopOwned.includes('arcanum-edge'))game.shopOwned.push('arcanum-edge');
  if(game.ownedArmors?.length>0 && game.ownedArmors.includes(1)&&!game.shopOwned.includes('knight-armor'))game.shopOwned.push('knight-armor');
  if(game.ownedArmors?.length>0 && game.ownedArmors.includes(2)&&!game.shopOwned.includes('dragon-scale-mail'))game.shopOwned.push('dragon-scale-mail');
  if(game.ownedArmors?.length>0 && game.ownedArmors.includes(3)&&!game.shopOwned.includes('demon-armor'))game.shopOwned.push('demon-armor');
  if(game.ownedArmors?.length>0 && game.ownedArmors.includes(4)&&!game.shopOwned.includes('phoenix-plate'))game.shopOwned.push('phoenix-plate');
  if(game.weapon>0){const map={1:'fire-sword',2:'heroic-axe',3:'demon-blade',4:'arcanum-edge'};if(map[game.weapon])game.shopEquipped.weapon=map[game.weapon];game.weapon=0}
  if(game.armor>0){const map={1:'knight-armor',2:'dragon-scale-mail',3:'demon-armor',4:'phoenix-plate'};if(map[game.armor])game.shopEquipped.armor=map[game.armor];game.armor=0}
}
function categoryLabel(id){return (SHOP_CATEGORIES.find(c=>c.id===id)||{label:id}).label}
function arenaShopVocation(){
  const member=typeof members!=='undefined'&&Array.isArray(members)?members.find(m=>m.name===game?.character):null;
  const raw=String(member?.vocation||'').trim().toLowerCase();
  if(/master\s+sorcerer|^sorcerer$/.test(raw))return 'Sorcerer';
  if(/elder\s+druid|^druid$/.test(raw))return 'Druid';
  if(/royal\s+paladin|^paladin$/.test(raw))return 'Paladin';
  if(/elite\s+knight|^knight$/.test(raw))return 'Knight';
  if(/^monk$/.test(raw))return 'Monk';
  return member?.vocation||'';
}
function arenaShopItemVocation(item){
  if(!item)return '';
  const explicit=String(item.vocation||item.class||item.vocations||'').trim().toLowerCase();
  if(explicit.includes('monk'))return 'Monk';
  if(explicit.includes('sorcerer'))return 'Sorcerer';
  if(explicit.includes('druid'))return 'Druid';
  if(explicit.includes('paladin'))return 'Paladin';
  if(explicit.includes('knight'))return 'Knight';
  const category=String(item.category||'').toLowerCase();
  const name=String(item.name||'').toLowerCase();
  if(category==='wands'||/\bwand\b/.test(name))return 'Sorcerer';
  if(category==='rods'||/\brod\b/.test(name))return 'Druid';
  if(category==='weapons'){
    if(/bow|crossbow|spear|star/.test(name))return 'Paladin';
    if(/fist|knuckle|gauntlet/.test(name))return 'Monk';
    return 'Knight';
  }
  return '';
}
function arenaShopVocationAllowed(item){
  const required=arenaShopItemVocation(item),current=arenaShopVocation();
  return !required||!current||required===current;
}
function shopRender(){
  shopEnsure();
  const box=document.getElementById('shopItems'),filters=document.getElementById('shopFilters'),balance=document.getElementById('shopGold');
  if(!box||!game)return;
  if(balance)balance.textContent=fmt(game.gold);
  if(filters){filters.innerHTML=SHOP_CATEGORIES.map(c=>`<button class="shop-filter ${shopFilter===c.id?'active':''}" data-filter="${c.id}">${esc(c.label)}</button>`).join('');filters.querySelectorAll('.shop-filter').forEach(b=>b.onclick=()=>{shopFilter=b.dataset.filter;shopRender()})}
  const items=SHOP_ITEMS.filter(item=>shopFilter==='all'||item.category===shopFilter);
  box.innerHTML=items.map(item=>{
    const owned=game.shopOwned.includes(item.id),equipped=Object.values(game.shopEquipped).includes(item.id),canBuy=game.gold>=item.price,levelOk=game.level>=item.minLevel,vocationOk=arenaShopVocationAllowed(item);
    const inSlot=game.shopEquipped[item.category==='weapons'||item.category==='wands'||item.category==='rods'?'weapon':item.category];
    const isEquipped=inSlot===item.id;
    let label=isEquipped?'Equipado':!vocationOk?`Exclusivo · ${esc(arenaShopItemVocation(item))}`:owned?'Equipar':levelOk&&canBuy?`Comprar · ${fmt(item.price)} gold`:!levelOk?`Level ${item.minLevel}`:`${fmt(item.price)} gold`;
    let disabled=isEquipped||!vocationOk||(!owned&&(!canBuy||!levelOk));
    return `<div class="shop-item ${isEquipped?'equipped':''} ${levelOk?'':'level-locked'} ${vocationOk?'':'vocation-locked'}"><div class="shop-icon">${item.sprite?`<img src="arena-godot/assets-importados/${encodeURI(item.sprite)}" alt="" draggable="false">`:item.icon}</div><div class="shop-info"><strong>${esc(item.name)}</strong><span>${esc(categoryLabel(item.category))} · ${esc(item.bonus)}</span><small>Level ${item.minLevel}+ · ${fmt(item.price)} gold</small></div><button class="shop-btn ${isEquipped?'equipped-btn':''}" data-id="${item.id}" ${disabled?'disabled':''}>${label}</button></div>`;
  }).join('')||'<div class="small">Nenhum item nesta categoria.</div>';
  box.querySelectorAll('.shop-btn').forEach(btn=>btn.onclick=()=>shopAction(btn.dataset.id));
  syncEquipmentDisplay();
}
function slotFor(item){if(item.category==='backpacks')return 'backpack';return item.category==='weapons'||item.category==='wands'||item.category==='rods'?'weapon':item.category}
function shopAction(id){
  shopEnsure();
  const item=SHOP_ITEMS.find(x=>x.id===id);if(!item)return;
  if(!arenaShopVocationAllowed(item)){toast(`Este equipamento é exclusivo do ${arenaShopItemVocation(item)}.`);return}
  if(game.level<item.minLevel){toast(`Você precisa do Arena Level ${item.minLevel}.`);return}
  if(game.shopOwned.includes(id)){
    const slot=slotFor(item);game.shopEquipped[slot]=id;persist();shopRender();toast(`${item.name} equipado.`);return;
  }
  if(game.gold<item.price){toast('Gold insuficiente.');return}
  game.gold-=item.price;game.shopOwned.push(id);game.shopEquipped[slotFor(item)]=id;persist();shopRender();toast(`${item.name} comprado e equipado.`);
}
function syncEquipmentDisplay(){
  if(!game)return;
  const weapon=SHOP_ITEMS.find(i=>i.id===game.shopEquipped?.weapon),armor=SHOP_ITEMS.find(i=>i.id===game.shopEquipped?.armor);
  const w=document.getElementById('weapon'),a=document.getElementById('armor');
  if(w)w.textContent=weapon?.name||'Espada de Bronze';
  if(a)a.textContent=armor?.name||'Leather Armor';
}
window.arenaShopCombatBonuses=function(){
  shopEnsure();
  let attack=0,defense=0;
  Object.values(game.shopEquipped||{}).forEach(id=>{const item=SHOP_ITEMS.find(i=>i.id===id);if(item){attack+=item.attack||0;defense+=item.defense||0}});
  return {attack,defense};
};
window.shopRender=shopRender;
function initArenaShop(){try{shopEnsure();shopRender()}catch(error){console.error('Arena Shop:',error)}}
window.addEventListener('DOMContentLoaded',initArenaShop);
window.addEventListener('load',initArenaShop);
setTimeout(initArenaShop,500);
setTimeout(initArenaShop,1500);

const SHOP_CATEGORIES=[
  {id:'all',label:'Todos'},
  {id:'weapons',label:'Armas'},
  {id:'armor',label:'Armaduras'},
  {id:'legs',label:'Legs'},
  {id:'boots',label:'Boots'},
  {id:'shield',label:'Shields'},
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
  {id:'real-bp-wolf',name:'Wolf Backpack',icon:'🎒',sprite:'wolf backpack.png',category:'backpacks',price:9000,attack:0,defense:0,minLevel:13,slots:7,bonus:'7 slots · Amuletos + Trinkets'},

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
  // Normaliza saves antigos/corrompidos antes de qualquer acesso da loja.
  // Sem isso, shopOwned/ shopEquipped existentes em formato inválido interrompem
  // o render antes de os filtros e os itens serem inseridos no DOM.
  if(!Array.isArray(game.shopOwned))game.shopOwned=['base-weapon','base-armor'];
  if(!game.shopEquipped||typeof game.shopEquipped!=='object'||Array.isArray(game.shopEquipped)){
    game.shopEquipped={weapon:'base-weapon',armor:'base-armor',legs:null,boots:null,helmets:null,wands:null,rings:null,amulet:null};
  }
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
function arenaShopItemVocations(item){
  if(!item)return [];
  const raw=item.vocations||item.vocation||item.class||'';
  const values=Array.isArray(raw)?raw:[raw];
  const explicit=values.flatMap(v=>String(v).split(/[\/,|]+/)).map(v=>v.trim()).filter(Boolean);
  if(explicit.length)return [...new Set(explicit.map(v=>v[0].toUpperCase()+v.slice(1).toLowerCase()))];
  const category=String(item.category||'').toLowerCase(),name=String(item.name||'').toLowerCase();
  if(category==='wands'||/\bwand\b/.test(name))return ['Sorcerer'];
  if(category==='rods'||/\brod\b/.test(name))return ['Druid'];
  if(category==='weapons'){
    if(/bow|crossbow|spear|star/.test(name))return ['Paladin'];
    if(/fist|knuckle|gauntlet/.test(name))return ['Monk'];
    return ['Knight'];
  }
  return [];
}
function arenaShopItemVocation(item){return arenaShopItemVocations(item).join(' / ')}
function arenaShopVocationAllowed(item){
  const required=arenaShopItemVocations(item),current=arenaShopVocation();
  return !required.length||!current||required.includes(current);
}
function shopRender(){
  shopEnsure();
  const box=document.getElementById('shopItems'),filters=document.getElementById('shopFilters'),balance=document.getElementById('shopGold');
  if(!box||!game)return;
  if(balance)balance.textContent=fmt(game.gold);
  if(filters){filters.innerHTML=SHOP_CATEGORIES.map(c=>`<button class="shop-filter ${shopFilter===c.id?'active':''}" data-filter="${c.id}">${esc(c.label)}</button>`).join('');filters.querySelectorAll('.shop-filter').forEach(b=>b.onclick=()=>{shopFilter=b.dataset.filter;shopRender()})}
  const items=SHOP_ITEMS.filter(item=>!item.shopDisabled&&(shopFilter==='all'||item.category===shopFilter));
  box.innerHTML=items.map(item=>{
    const owned=game.shopOwned.includes(item.id),equipped=Object.values(game.shopEquipped).includes(item.id),canBuy=game.gold>=item.price,levelOk=game.level>=item.minLevel,vocationOk=arenaShopVocationAllowed(item);
    const inSlot=game.shopEquipped[item.category==='weapons'||item.category==='wands'||item.category==='rods'?'weapon':item.category];
    const isEquipped=inSlot===item.id;
    let label=isEquipped?'Equipado':!vocationOk?`Exclusivo · ${esc(arenaShopItemVocation(item))}`:owned?'Equipar':levelOk&&canBuy?`Comprar · ${fmt(item.price)} gold`:!levelOk?`Level ${item.minLevel}`:`${fmt(item.price)} gold`;
    let disabled=isEquipped||!vocationOk||(!owned&&(!canBuy||!levelOk));
    return `<div class="shop-item ${isEquipped?'equipped':''} ${levelOk?'':'level-locked'} ${vocationOk?'':'vocation-locked'}"><div class="shop-icon">${item.sprite?`<img src="${window.arenaItemSpriteUrl(item)}" alt="" draggable="false">`:item.icon}</div><div class="shop-info"><strong>${esc(item.name)}</strong><span>${esc(categoryLabel(item.category))} · ${esc(item.bonus)}</span><small>Level ${item.minLevel}+ · ${fmt(item.price)} gold</small></div><button class="shop-btn ${isEquipped?'equipped-btn':''}" data-id="${item.id}" ${disabled?'disabled':''}>${label}</button></div>`;
  }).join('')||'<div class="small">Nenhum item nesta categoria.</div>';
  box.querySelectorAll('.shop-btn').forEach(btn=>btn.onclick=()=>shopAction(btn.dataset.id));
  syncEquipmentDisplay();
}
function slotFor(item){if(item.category==='backpacks')return 'backpack';return item.category==='weapons'||item.category==='wands'||item.category==='rods'?'weapon':item.category}
function shopAction(id){
  shopEnsure();
  const item=SHOP_ITEMS.find(x=>x.id===id);if(!item||item.shopDisabled)return;
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
window.renderShop=shopRender;
function initArenaShop(){try{shopEnsure();shopRender()}catch(error){console.error('Arena Shop:',error)}}
window.addEventListener('DOMContentLoaded',initArenaShop);
window.addEventListener('load',initArenaShop);
setTimeout(initArenaShop,500);
setTimeout(initArenaShop,1500);


/* Real item sprites — non-invasive patch. Keeps the original SHOP_ITEMS catalog intact. */
(()=>{
 const spriteRoot='arena-godot/';
 const patches={
  'Cobra Hood':'cobra hood.png','Cobra Rod':'cobra rod.png','Cobra Wand':'cobra wand.png','Dark Vision Bandana':'dark vision bandana.png','Demon Mengu':'demon mengu.png','Dwanfire Pantaloons':'dwanfire pantaloons.png','Gill Coat':'gill coat.png','Gill Legs':'gill legs.png','Glacier Wand':'glacier wand.png','Grasshoper Legs':'grasshoper legs.png','Green Demon Helmet':'green demon helmet.png','Green Demon Legs':'green demon legs.png','Helmet of Enlightenment':'helmet of enlightment.png','Ice Hood':'ice hood.png','Inferniarch Rod':'inferniarch rod.png','Inferniarch Wand':'inferniarch wand.png','Ink Blade':'ink blade.png','Jade Conical Helmet':'jade conical helmet.png','Jade Legs':'jade legs.png','Legs of Enlightenment':'legs of enlightment.png','Legs of Windsdows':'legs of winsdows.png','Lightning Headband':'lightning headband.png','Lightning Legs':'lightning legs.png','Magma Monocle':'magma monocle.png','Maliceforged Helmet':'maliceforged helmet.png','Mino Shield':'mino shield.png','Moon Mirror':'moon mirror.png','Moonshade Wand':'moonshade wand.png','Muc Rod':'muc rod.png','Mutant Hide Trousers':'mutant hide trousers.png','Norcferatu Bonehood':'norcferatu bonehood.png','Norcferatu Fleshguards':'norcferatu fleshgards.png','Ornate Legs':'ornate legs.png','Ornate Shield':'ornate shield.png','Prismatic Helmet':'prismatic helmet.png','Prismatic Legs':'prismatic legs.png','Prismatic Ring':'prismatic ring.png','Prismatic Shield':'prismatic shield.png','Rift Shield':'rift shield.png','Scarab Ocarina':'scarab ocarina.png','Soulfull Legs':'soulfull legs.png','Stag Helmet':'stag helmet.png','Stag Shield':'stag shield.png','Stoic Iks Fraulds':'stoic iks fraulds.png','Stoic Iks Headpiece':'stoic iks headpiece.png','Sun Catcher':'sun catcher.png','Terra Helmet':'terra helmet.png','Terra Hood':'terra hood.png','Terra Legs':'terra legs.png','Void Tiara':'void tiara.png','Werewolf Helmet':'werewolf helmet.png','Falcon Rod':'falcon rod.png','Falcon Wand':'falcon wand.png','Falcon Shield':'falcon shield.png','Fabulous Legs':'fabulous legs.png','Naga Rod':'naga rod.png'};
 if(!SHOP_CATEGORIES.some(x=>x.id==='rods'))SHOP_CATEGORIES.push({id:'rods',label:'Rods'});
 const escName=n=>String(n).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
 for(const [name,file] of Object.entries(patches)){
  const item=SHOP_ITEMS.find(x=>String(x.name||'').toLowerCase()===name.toLowerCase());
  if(item)item.sprite=spriteRoot+file;
  else console.warn('[Arena Shop] Sprite sem item catalogado:',name);
 }
 window.arenaItemSpriteUrl=item=>{
  const sprite=String(item?.sprite||'');
  return sprite.startsWith('arena-godot/')?encodeURI(sprite):'arena-godot/assets-importados/'+encodeURI(sprite);
 };
})();


/* Official real-item catalog correction — 2026-09-25. */
(()=>{
 const official=[["199464","Glacier Shoes","boots",[]],["199465","Lightning Boots","boots",[]],["199470","Glacier Kilt","legs",[]],["210930","Depth Galea","helmets",["Knight"]],["210931","Depth Ocrea","legs",["Knight"]],["212189","Crystalline Axe","weapons",["Knight"]],["212190","Mycological Mace","weapons",["Knight"]],["212191","Thorn Spitter","weapons",["Paladin"]],["212192","Mycological Bow","weapons",["Paladin"]],["214379","Umbral Master Blade","weapons",["Knight"]],["214385","Umbral Master Axe","weapons",["Knight"]],["214388","Umbral Master Chopper","weapons",["Knight"]],["214391","Umbral Master Mace","weapons",["Knight"]],["214394","Umbral Master Hammer","weapons",["Knight"]],["214971","Glooth Cape","armor",["Sorcerer","Druid"]],["214972","Rubber Cap","helmets",[]],["214973","Glooth Amulet","amulets",[]],["214974","Heat Core","quest",[]],["214975","Glooth Trousers","legs",[]],["214976","Metal Spats / Glooth Boots","boots",[]],["214978","Metal Bat / Wand of Defiance","weapons",["Knight","Sorcerer"]],["214979","Glooth Whip","weapons",["Knight"]],["214983","Execowtioner Axe","weapons",["Knight"]],["215397","Oriental Shoes","boots",[]],["218726","Starlight Vial","amulets",[]],["220603","Cobra Boots","boots",["Paladin"]],["221304","Embrace of Nature","armor",["Druid"]],["221305","Mortal Mace","weapons",["Knight"]],["221306","Bow of Cataclysm","weapons",["Paladin"]],["221307","Galea Mortis","helmets",["Sorcerer","Druid"]],["222644","Falcon Bow","weapons",["Paladin"]],["233476","Feeverbloom Boots","boots",[]],["233480","Midnight Tunic","armor",["Sorcerer","Druid"]],["233482","Midnight Sarong","legs",["Sorcerer","Druid"]],["236011","Stoic Iks Cuirass","armor",["Knight"]],["236012","Stoic Iks Chestplate","armor",["Knight"]],["236013","Dauntless Dragon Scale Armor","armor",["Knight","Paladin"]],["236014","Unerring Dragon Scale Armor","armor",["Knight","Paladin"]],["236015","Arcane Dragon Robe","armor",["Sorcerer","Druid"]],["236016","Mystical Dragon Robe","armor",["Sorcerer","Druid"]],["236017","Stoic Iks Casque","helmets",["Knight"]],["236019","Stoic Iks Culets","legs",["Knight"]],["236021","Stoic Iks Sandals","boots",[]],["236022","Stoic Iks Boots","boots",[]],["238610","Inferniarch Bow","weapons",["Paladin"]],["238611","Inferniarch Arbalest","weapons",["Paladin"]],["238612","Inferniarch Battleaxe","weapons",["Knight"]],["238613","Inferniarch Greataxe","weapons",["Knight"]],["238614","Inferniarch Flail","weapons",["Knight"]],["238615","Inferniarch Warhammer","weapons",["Knight"]],["238621","Hellstalker Visor","helmets",["Paladin"]],["238622","Dreadfire Headpiece","helmets",["Sorcerer"]],["238623","Demonfang Mask","helmets",["Druid"]],["239123","Bandana","helmets",[]],["239124","Sanguine Collar","amulets",[]],["239165","Plain Monk Robe","armor",[]],["239170","Merudri Scale Mail","armor",["Knight"]],["239171","Merudri Battlemail","armor",["Knight"]],["239172","Eldritch Monk Boots","boots",[]],["239181","Ghazbaran Yoroi","armor",["Knight"]],["239781","Norcferatu Skullguard","helmets",["Knight"]],["239783","Norcferatu Tuskplate","armor",["Knight"]],["239784","Norcferatu Bloohide","armor",["Paladin"]],["239785","Norcferatu Bonecloak","armor",["Sorcerer","Druid"]],["239786","Norcferatu Thornwraps","legs",["Knight","Paladin"]],["239788","Norcferatu Fleeshguards","legs",[]],["239789","Norcferatu Goretrumpers","boots",["Knight"]],["239790","Norcferatu Fangstompers","boots",["Paladin"]],["239792","Ink Quill","wands",["Sorcerer"]],["239793","Ink Claw","rods",["Druid"]],["239794","Ink Vine","rods",["Druid"]],["239795","Ink Brush","wands",["Sorcerer"]],["240132","Bounty Talisman","amulets",[]],["240252","Stag Robe","armor",["Sorcerer","Druid"]],["240253","Stag Plate","armor",["Knight"]],["240254","Stag Legs","legs",["Knight","Paladin"]],["240255","Stag Shinguards","legs",["Knight"]],["240256","Stag Boots","boots",[]],["240578","Captain's Sabre","weapons",["Knight"]],["240581","Enchanted Flamingo of Valor","amulets",["Knight"]],["240589","Enchanted Flamingo of Precision","amulets",["Paladin"]],["240605","Enchanted Flamingo Amulet of Destruction","amulets",[]],["240620","Enchanted Flamingo Amulet of Nature","amulets",["Druid","Sorcerer"]],["240635","Enchanted Swan Amulet of Balance","amulets",[]],["mooh'tah plate","Mooh'tah Plate","armor",["Knight"]]];
 const findItem=id=>SHOP_ITEMS.find(x=>String(x.id||'')===id||String(x.id||'').endsWith('-'+id)||String(x.sprite||'').split('/').pop()===id+'.png');
 for(const [id,name,category,vocations] of official){
  let item=findItem(id);
  if(!item){
   item={id:'real-'+id.replace(/[^a-z0-9]+/gi,'-').replace(/^-|-$/g,'').toLowerCase(),name,icon:'🛡️',sprite:id+'.png',category,price:500,attack:0,defense:0,minLevel:1,bonus:category==='quest'?'Quest':'Equipamento'};
   SHOP_ITEMS.push(item);
  }
  item.name=name;
  item.category=category;
  item.sprite=id+'.png';
  if(vocations.length)item.vocations=vocations;
  else delete item.vocation;
  if(category==='quest')item.shopDisabled=true;
 }
 if(!SHOP_CATEGORIES.some(x=>x.id==='quest'))SHOP_CATEGORIES.push({id:'quest',label:'Quest'});
})();


/* Category-for-category replacement — 2026-09-25. */
(()=>{
 const replacements={"armor":["real-armor-depth-lorica","real-armor-dwanfire-sherwany","real-armor-gill-coat","real-armor-gnomish-cuirass","real-armor-green-demon-armor","real-armor-ice-robe","real-armor-lightning-robe","real-armor-merudri-nanbando","real-armor-monk-robe","real-armor-naga-tanko","real-armor-ornate-chestplate","real-armor-prismatic-armor","real-armor-robe-of-enlightment","real-armor-soul-mantle","real-armor-stoic-iks-robe","real-armor-terra-mantle","real-armor-zaoan-monk-robe","real-gnome-gnome-armor","real-falcon-falcon-plate"],"boots":["real-boots-enlightment-boots","real-boots-frostflower-boots","real-boots-green-spleepbunny-boots","real-boots-magma-boots","real-boots-nightmare-boots","real-boots-prismatic-boots","real-boots-stag-boots","real-boots-stoic-iks-boots","real-boots-terra-boots","real-boots-void-boots","real-boots-yalahari-boots","real-boots-gnomish-footwraps"],"weapons":["real-weapon-nunchaku-of-enlightment","real-weapon-nunchaku","real-weapon-sai-of-enlightment","real-weapon-sai","real-weapon-shiny-blade","real-weapon-tagralt-blade","real-weapon-the-impaler","real-weapon-umbral-master-katar","real-weapon-umbral-master-slayer","real-rp-cobra-crossbow","real-rp-glooth-spear","real-rp-naga-crossbow","real-rp-ornate-crossbow","real-rp-rift-bow","real-rp-rift-crossbow","real-rp-umbral-master-bow","real-rp-umbral-master-crossbow","real-gnome-gnome-sword","real-falcon-falcon-battleaxe","real-falcon-falcon-bow","real-falcon-falcon-longword","real-falcon-falcon-mace"],"amulets":["amulet-foxtail","amulet-gill-necklace","amulet-glacier","amulet-greater-garlic","amulet-greawhel","amulet-lion","amulet-magma","amulet-prismatic","amulet-terra"],"helmets":["real-gnome-gnome-helmet","real-falcon-falcon-circlet","steel-helmet","crown-helmet","royal-helmet","demon-helmet","warrior-helmet","cobra-hood","falcon-coif"],"legs":["knight-legs","crown-legs","golden-legs","demon-legs","ornate-legs","fabulous-legs","falcon-legs","celestial-legs","real-gnome-gnome-legs"],"wands":["real-falcon-falcon-wand","arcanist-wand"],"rods":["real-falcon-falcon-rod"]};
 const disabled=[];
 for(const [category,ids] of Object.entries(replacements)){
  for(const id of ids){
   const item=SHOP_ITEMS.find(x=>x.id===id&&x.category===category);
   if(item){item.shopDisabled=true;item.shopReplacement=true;disabled.push({category,id,name:item.name});}
   else console.warn('[Arena Shop] Item antigo não encontrado para substituição:',category,id);
  }
 }
 window.arenaShopReplacementReport={disabled,counts:Object.fromEntries(Object.entries(replacements).map(([k,v])=>[k,v.length]))};
})();


/* Balanced stats for official real-item catalog — 2026-09-25. */
(()=>{
 const stats={"199464":[35,0,5,"+5 defesa"],"199465":[35,0,5,"+5 defesa"],"199470":[100,0,18,"+18 defesa"],"210930":[150,0,22,"+22 defesa"],"210931":[130,0,19,"+19 defesa"],"212189":[100,32,0,"+32 ataque"],"212190":[120,34,0,"+34 ataque"],"212191":[150,36,0,"+36 ataque"],"212192":[105,33,0,"+33 ataque"],"214379":[250,50,2,"+50 ataque · +2 defesa"],"214385":[250,51,2,"+51 ataque · +2 defesa"],"214388":[250,52,2,"+52 ataque · +2 defesa"],"214391":[250,50,3,"+50 ataque · +3 defesa"],"214394":[250,53,3,"+53 ataque · +3 defesa"],"214971":[100,0,18,"+18 defesa"],"214972":[100,0,21,"+21 defesa"],"214973":[150,2,4,"+2 ataque · +4 defesa"],"214974":[1,0,0,"Quest"],"214975":[100,0,19,"+19 defesa"],"214976":[100,0,8,"+8 defesa"],"214978":[140,38,1,"+38 ataque · +1 defesa"],"214979":[180,40,1,"+40 ataque · +1 defesa"],"214983":[55,43,1,"+43 ataque · +1 defesa"],"215397":[80,0,7,"+7 defesa"],"218726":[200,3,7,"+3 ataque · +7 defesa"],"220603":[80,0,9,"+9 defesa"],"221304":[120,0,20,"+20 defesa"],"221305":[250,48,2,"+48 ataque · +2 defesa"],"221306":[250,46,0,"+46 ataque"],"221307":[200,0,25,"+25 defesa"],"222644":[250,47,0,"+47 ataque"],"233476":[270,0,13,"+13 defesa"],"233480":[200,0,23,"+23 defesa"],"233482":[200,0,22,"+22 defesa"],"236011":[250,0,26,"+26 defesa"],"236012":[250,0,28,"+28 defesa"],"236013":[300,0,30,"+30 defesa"],"236014":[300,0,31,"+31 defesa"],"236015":[300,0,24,"+24 defesa"],"236016":[300,0,25,"+25 defesa"],"236017":[250,0,27,"+27 defesa"],"236019":[250,0,25,"+25 defesa"],"236021":[250,0,12,"+12 defesa"],"236022":[250,0,13,"+13 defesa"],"238610":[300,56,0,"+56 ataque"],"238611":[300,58,0,"+58 ataque"],"238612":[300,55,2,"+55 ataque · +2 defesa"],"238613":[300,57,2,"+57 ataque · +2 defesa"],"238614":[300,54,3,"+54 ataque · +3 defesa"],"238615":[300,59,3,"+59 ataque · +3 defesa"],"238621":[250,0,29,"+29 defesa"],"238622":[250,0,28,"+28 defesa"],"238623":[250,0,28,"+28 defesa"],"239123":[200,0,24,"+24 defesa"],"239124":[270,4,8,"+4 ataque · +8 defesa"],"239165":[100,0,16,"+16 defesa"],"239170":[100,0,17,"+17 defesa"],"239171":[100,0,19,"+19 defesa"],"239172":[300,0,15,"+15 defesa"],"239181":[200,0,27,"+27 defesa"],"239781":[270,0,30,"+30 defesa"],"239783":[270,0,32,"+32 defesa"],"239784":[270,0,28,"+28 defesa"],"239785":[270,0,28,"+28 defesa"],"239786":[270,0,28,"+28 defesa"],"239788":[230,0,24,"+24 defesa"],"239789":[270,0,18,"+18 defesa"],"239790":[270,0,18,"+18 defesa"],"239792":[250,52,0,"+52 ataque"],"239793":[250,51,0,"+51 ataque"],"239794":[300,56,0,"+56 ataque"],"239795":[300,58,1,"+58 ataque · +1 defesa"],"240132":[300,5,10,"+5 ataque · +10 defesa"],"240252":[350,0,30,"+30 defesa"],"240253":[350,0,34,"+34 defesa"],"240254":[350,0,33,"+33 defesa"],"240255":[350,0,18,"+18 defesa"],"240256":[350,0,18,"+18 defesa"],"240578":[350,61,2,"+61 ataque · +2 defesa"],"240581":[350,6,12,"+6 ataque · +12 defesa"],"240589":[350,7,10,"+7 ataque · +10 defesa"],"240605":[350,8,11,"+8 ataque · +11 defesa"],"240620":[350,7,12,"+7 ataque · +12 defesa"],"240635":[350,6,14,"+6 ataque · +14 defesa"],"mooh'tah plate":[300,0,32,"+32 defesa"]};
 const officialIds=new Set(Object.keys(stats));
 for(const [id,data] of Object.entries(stats)){
  const item=SHOP_ITEMS.find(x=>String(x.id||'')===id||String(x.id||'').endsWith('-'+id)||String(x.sprite||'').split('/').pop()===id+'.png');
  if(!item){console.warn('[Arena Shop] Balance: item não encontrado:',id);continue;}
  const [minLevel,attack,defense,bonus]=data;
  item.minLevel=minLevel;
  item.attack=attack;
  item.defense=defense;
  item.bonus=bonus;
  if(id!=='214974'){
   item.price=Math.round(250 + minLevel*14 + attack*38 + defense*52);
  }else{
   item.price=0;
   item.shopDisabled=true;
  }
 }
 window.arenaShopBalanceReport={count:Object.keys(stats).length,ids:[...officialIds]};
})();

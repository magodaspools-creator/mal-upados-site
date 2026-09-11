const SHOP_CATEGORIES=[
  {id:'all',label:'Todos'},
  {id:'weapons',label:'Armas'},
  {id:'armor',label:'Armaduras'},
  {id:'legs',label:'Legs'},
  {id:'boots',label:'Boots'},
  {id:'helmets',label:'Helmets'},
  {id:'wands',label:'Wands'},
  {id:'rings',label:'Rings'}
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
  {id:'celestial-ring',name:'Celestial Ring',icon:'🌟',category:'rings',price:3400,attack:18,defense:20,minLevel:36,bonus:'+18 ataque · +20 defesa'}
];
let shopFilter='all';
function shopEnsure(){
  if(!game)return;
  if(!game.shopOwned)game.shopOwned=['base-weapon','base-armor'];
  if(!game.shopEquipped)game.shopEquipped={weapon:'base-weapon',armor:'base-armor',legs:null,boots:null,helmets:null,wands:null,rings:null};
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
function shopRender(){
  shopEnsure();
  const box=document.getElementById('shopItems'),filters=document.getElementById('shopFilters'),balance=document.getElementById('shopGold');
  if(!box||!game)return;
  if(balance)balance.textContent=fmt(game.gold);
  if(filters){filters.innerHTML=SHOP_CATEGORIES.map(c=>`<button class="shop-filter ${shopFilter===c.id?'active':''}" data-filter="${c.id}">${esc(c.label)}</button>`).join('');filters.querySelectorAll('.shop-filter').forEach(b=>b.onclick=()=>{shopFilter=b.dataset.filter;shopRender()})}
  const items=SHOP_ITEMS.filter(item=>shopFilter==='all'||item.category===shopFilter);
  box.innerHTML=items.map(item=>{
    const owned=game.shopOwned.includes(item.id),equipped=Object.values(game.shopEquipped).includes(item.id),canBuy=game.gold>=item.price,levelOk=game.level>=item.minLevel;
    const inSlot=game.shopEquipped[item.category==='weapons'||item.category==='wands'?'weapon':item.category];
    const isEquipped=inSlot===item.id;
    let label=isEquipped?'Equipado':owned?'Equipar':levelOk&&canBuy?`Comprar · ${fmt(item.price)} gold`:!levelOk?`Level ${item.minLevel}`:`${fmt(item.price)} gold`;
    let disabled=isEquipped||(!owned&&(!canBuy||!levelOk));
    return `<div class="shop-item ${isEquipped?'equipped':''} ${levelOk?'':'level-locked'}"><div class="shop-icon">${item.icon}</div><div class="shop-info"><strong>${esc(item.name)}</strong><span>${esc(categoryLabel(item.category))} · ${esc(item.bonus)}</span><small>Level ${item.minLevel}+ · ${fmt(item.price)} gold</small></div><button class="shop-btn ${isEquipped?'equipped-btn':''}" data-id="${item.id}" ${disabled?'disabled':''}>${label}</button></div>`;
  }).join('')||'<div class="small">Nenhum item nesta categoria.</div>';
  box.querySelectorAll('.shop-btn').forEach(btn=>btn.onclick=()=>shopAction(btn.dataset.id));
  syncEquipmentDisplay();
}
function slotFor(item){return item.category==='weapons'||item.category==='wands'?'weapon':item.category}
function shopAction(id){
  shopEnsure();
  const item=SHOP_ITEMS.find(x=>x.id===id);if(!item)return;
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
window.addEventListener('load',()=>{shopEnsure();shopRender()});

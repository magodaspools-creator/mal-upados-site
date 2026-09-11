const SHOP_WEAPONS=[
  {name:'Fire Sword',icon:'🗡️',kind:'weapon',index:1,price:150,bonus:'+8 ataque'},
  {name:'Heroic Axe',icon:'🪓',kind:'weapon',index:2,price:400,bonus:'+15 ataque'},
  {name:'Demon Blade',icon:'⚔️',kind:'weapon',index:3,price:900,bonus:'+24 ataque'},
  {name:'Arcanum Edge',icon:'✨',kind:'weapon',index:4,price:1800,bonus:'+35 ataque'}
];
const SHOP_ARMORS=[
  {name:'Knight Armor',icon:'🛡️',kind:'armor',index:1,price:180,bonus:'+7 defesa'},
  {name:'Dragon Scale Mail',icon:'🐉',kind:'armor',index:2,price:500,bonus:'+15 defesa'},
  {name:'Demon Armor',icon:'😈',kind:'armor',index:3,price:1000,bonus:'+25 defesa'},
  {name:'Phoenix Plate',icon:'🔥',kind:'armor',index:4,price:2200,bonus:'+38 defesa'}
];
function shopNormalize(){
  if(!game)return;
  game.ownedWeapons=Array.isArray(game.ownedWeapons)?game.ownedWeapons:[0];
  game.ownedArmors=Array.isArray(game.ownedArmors)?game.ownedArmors:[0];
  if(!game.ownedWeapons.includes(0))game.ownedWeapons.unshift(0);
  if(!game.ownedArmors.includes(0))game.ownedArmors.unshift(0);
}
function shopRender(){
  shopNormalize();
  const box=document.getElementById('shopItems');
  const balance=document.getElementById('shopGold');
  if(!box||!game)return;
  if(balance)balance.textContent=fmt(game.gold);
  const cards=[...SHOP_WEAPONS,...SHOP_ARMORS];
  box.innerHTML=cards.map(item=>{
    const owned=item.kind==='weapon'?game.ownedWeapons.includes(item.index):game.ownedArmors.includes(item.index);
    const equipped=item.kind==='weapon'?game.weapon===item.index:game.armor===item.index;
    const canBuy=game.gold>=item.price;
    let label=equipped?'Equipado':owned?'Equipar':`Comprar · ${fmt(item.price)} gold`;
    let disabled=equipped||(!owned&&!canBuy);
    return `<div class="shop-item ${equipped?'equipped':''}"><div class="shop-icon">${item.icon}</div><div class="shop-info"><strong>${esc(item.name)}</strong><span>${item.kind==='weapon'?'Arma':'Armadura'} · ${esc(item.bonus)}</span></div><button class="shop-btn ${equipped?'equipped-btn':''}" data-kind="${item.kind}" data-index="${item.index}" ${disabled?'disabled':''}>${label}</button></div>`;
  }).join('');
  box.querySelectorAll('.shop-btn').forEach(btn=>btn.onclick=()=>shopAction(btn.dataset.kind,Number(btn.dataset.index)));
}
function shopAction(kind,index){
  shopNormalize();
  const owned=kind==='weapon'?game.ownedWeapons:game.ownedArmors;
  const catalog=kind==='weapon'?SHOP_WEAPONS:SHOP_ARMORS;
  const item=catalog.find(x=>x.index===index);
  if(!item)return;
  if(owned.includes(index)){
    if(kind==='weapon')game.weapon=index;else game.armor=index;
    persist();
    renderAll();
    shopRender();
    toast(`${item.name} equipado.`);
    return;
  }
  if(game.gold<item.price){toast('Gold insuficiente.');return;}
  game.gold-=item.price;
  owned.push(index);
  if(kind==='weapon')game.weapon=index;else game.armor=index;
  persist();
  renderAll();
  shopRender();
  toast(`${item.name} comprado e equipado.`);
}
function shopInit(){
  shopNormalize();
  shopRender();
  const select=document.getElementById('characterSelect');
  if(select)select.addEventListener('change',()=>setTimeout(shopRender,0));
}
window.addEventListener('load',shopInit);

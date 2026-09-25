// Sistema de Backpacks: capacidade real para Amuletos + Trinkets.
// Isolado da loja e do combate para preservar o restante da Arena.
(()=>{
  const BACKPACKS=[
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
  ];
  if(typeof SHOP_CATEGORIES!=='undefined'&&!SHOP_CATEGORIES.some(x=>x.id==='backpacks'))SHOP_CATEGORIES.push({id:'backpacks',label:'Backpacks'});
  if(typeof SHOP_ITEMS!=='undefined')BACKPACKS.forEach(item=>{if(!SHOP_ITEMS.some(x=>x.id===item.id))SHOP_ITEMS.push(item)});

  function ensure(){
    if(typeof game==='undefined'||!game)return;
    if(!game.shopOwned)game.shopOwned=[];
    if(!game.shopEquipped)game.shopEquipped={};
    if(!Object.prototype.hasOwnProperty.call(game.shopEquipped,'backpack'))game.shopEquipped.backpack=null;
  }
  function current(){
    ensure();
    const id=game?.shopEquipped?.backpack;
    return BACKPACKS.find(x=>x.id===id)||null;
  }
  function capacity(){return current()?.slots||0}

  // Trinkets de nível 2/3 ficam fora de SHOP_ITEMS para a loja exibir apenas o card-base.
  // Para inventário/capacidade, usamos a fonte completa do sistema de Trinkets.
  function allSpecialItems(){
    ensure();
    const amulets=typeof SHOP_ITEMS!=='undefined'?SHOP_ITEMS.filter(item=>item.category==='amulets'):[];
    const trinkets=window.arenaTrinkets?.TRINKETS||[];
    return [...amulets,...trinkets];
  }
  function specialItems(){
    ensure();
    return allSpecialItems().filter(item=>game.shopOwned.includes(item.id));
  }
  function usedSlots(){return specialItems().length}
  function freeSlots(){return Math.max(0,capacity()-usedSlots())}
  function canCarrySpecial(item){
    if(!item||!['amulets','trinkets'].includes(item.category))return true;
    return capacity()>0&&game.shopOwned.includes(item.id)?true:freeSlots()>0;
  }
  function canCarryAmulet(){return capacity()>=1}

  const previousSlotFor=typeof slotFor==='function'?slotFor:null;
  if(previousSlotFor){window.slotFor=function(item){if(item?.category==='backpacks')return 'backpack';return previousSlotFor(item)}}

  function itemById(id){
    if(typeof SHOP_ITEMS!=='undefined'){
      const shopItem=SHOP_ITEMS.find(x=>x.id===id);if(shopItem)return shopItem;
    }
    return (window.arenaTrinkets?.TRINKETS||[]).find(x=>x.id===id)||null;
  }
  function blockedMessage(item){
    const bp=current();
    if(!bp)return 'Compre e equipe uma Backpack antes de carregar Amuletos ou Trinkets.';
    return `Sua ${bp.name} está cheia (${bp.slots}/${bp.slots} slots). Compre uma Backpack maior para carregar mais Amuletos/Trinkets.`;
  }

  function installGuard(){
    const box=document.getElementById('shopItems');
    if(!box||box.__backpackGuard)return;
    box.__backpackGuard=true;
    box.addEventListener('click',e=>{
      const btn=e.target.closest('button');if(!btn)return;
      const card=btn.closest('.shop-item');if(!card)return;
      const item=itemById(btn.dataset.id);if(!item)return;
      const action=(btn.textContent||'').toLowerCase();
      const isSpecial=item.category==='amulets'||item.category==='trinkets';
      const isUpgrade=isSpecial&&item.category==='trinkets'&&action.includes('upgrade');
      const isBuy=!game.shopOwned.includes(item.id)&&!isUpgrade;
      const isEquip=game.shopOwned.includes(item.id)&&action.includes('equipar');
      if(isUpgrade)return;
      if(isSpecial&&isBuy&&!canCarrySpecial(item)){
        e.preventDefault();
        e.stopImmediatePropagation();
        if(typeof toast==='function')toast(blockedMessage(item));
        return;
      }
      if(isSpecial&&isEquip&&capacity()<1){
        e.preventDefault();
        e.stopImmediatePropagation();
        if(typeof toast==='function')toast('Compre e equipe uma Backpack antes de usar este item.');
      }
    },true);
  }

  function renderCapacity(){
    const panel=document.querySelector('.shop-section');
    if(!panel)return;
    let note=document.getElementById('backpackCapacityNote');
    if(!note){
      note=document.createElement('div');
      note.id='backpackCapacityNote';
      note.className='backpack-capacity-note';
      panel.appendChild(note);
    }
    updateCapacity();
  }
  function updateCapacity(){
    const note=document.getElementById('backpackCapacityNote');
    if(!note)return;
    const bp=current();
    const used=usedSlots();
    if(bp){
      note.innerHTML=`<span>🎒 Backpack equipada: <strong>${esc(bp.name)}</strong></span><span>Capacidade: <strong>${used}/${bp.slots} slots usados</strong> · ${freeSlots()} livres · Amuletos + Trinkets</span>`;
    }else{
      note.innerHTML='<span>🎒 Nenhuma Backpack equipada.</span><span>Backpack obrigatória para carregar Amuletos e Trinkets.</span>';
    }
  }
  function installStyle(){
    if(document.getElementById('arena-backpack-style'))return;
    const style=document.createElement('style');
    style.id='arena-backpack-style';
    style.textContent=`.backpack-capacity-note{margin-top:10px;padding:10px 12px;border:1px solid #383c42;background:#111316;display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;color:#7f858e;font-size:.65rem}.backpack-capacity-note strong{color:var(--gold2)}.shop-filter[data-filter="backpacks"]{border-color:#4d4a3e}@media(max-width:620px){.backpack-capacity-note{display:block}.backpack-capacity-note span{display:block}.backpack-capacity-note span+span{margin-top:4px}}`;
    document.head.appendChild(style);
  }

  ensure();
  installStyle();
  installGuard();
  const oldRender=typeof shopRender==='function'?shopRender:null;
  if(oldRender&&!window.__arenaBackpackShopWrapped){
    window.shopRender=function(){oldRender();installGuard();renderCapacity();updateCapacity()};
    window.__arenaBackpackShopWrapped=true;
  }
  setInterval(()=>{ensure();installGuard();updateCapacity()},500);
  window.arenaBackpacks={BACKPACKS,current,capacity,usedSlots,freeSlots,canCarryAmulet,canCarrySpecial};
})();

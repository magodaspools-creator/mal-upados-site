// Sistema de Backpacks: capacidade real para Amuletos + futuros Trinkets.
// Isolado da loja e do combate para preservar o restante da Arena.
(()=>{
  const BACKPACKS=[
    {id:'small-backpack',name:'Small Backpack',icon:'🎒',category:'backpacks',price:750,attack:0,defense:0,minLevel:1,slots:3,bonus:'3 slots · Amuletos + Trinkets'},
    {id:'adventurer-backpack',name:"Adventurer's Backpack",icon:'🎒',category:'backpacks',price:3500,attack:0,defense:0,minLevel:5,slots:4,bonus:'4 slots · Amuletos + Trinkets'},
    {id:'dragon-backpack',name:'Dragon Backpack',icon:'🎒',category:'backpacks',price:9000,attack:0,defense:0,minLevel:12,slots:5,bonus:'5 slots · Amuletos + Trinkets'},
    {id:'demon-backpack',name:'Demon Backpack',icon:'🎒',category:'backpacks',price:18000,attack:0,defense:0,minLevel:20,slots:6,bonus:'6 slots · Amuletos + Trinkets'},
    {id:'infernal-backpack',name:'Infernal Backpack',icon:'🎒',category:'backpacks',price:35000,attack:0,defense:0,minLevel:35,slots:7,bonus:'7 slots · Amuletos + Trinkets'}
  ];
  if(typeof SHOP_CATEGORIES!=='undefined'&&!SHOP_CATEGORIES.some(x=>x.id==='backpacks'))SHOP_CATEGORIES.push({id:'backpacks',label:'Backpacks'});
  if(typeof SHOP_ITEMS!=='undefined')BACKPACKS.forEach(item=>{if(!SHOP_ITEMS.some(x=>x.id===item.id))SHOP_ITEMS.push(item)});
  function ensure(){if(typeof game==='undefined'||!game)return;if(!game.shopOwned)game.shopOwned=[];if(!game.shopEquipped)game.shopEquipped={};if(!Object.prototype.hasOwnProperty.call(game.shopEquipped,'backpack'))game.shopEquipped.backpack=null}
  function current(){ensure();const id=game?.shopEquipped?.backpack;return BACKPACKS.find(x=>x.id===id)||null}
  function capacity(){return current()?.slots||0}
  function canCarryAmulet(){return capacity()>=1}
  const previousSlotFor=typeof slotFor==='function'?slotFor:null;
  if(previousSlotFor){window.slotFor=function(item){if(item?.category==='backpacks')return 'backpack';return previousSlotFor(item)}}
  function installGuard(){const box=document.getElementById('shopItems');if(!box||box.__backpackGuard)return;box.__backpackGuard=true;box.addEventListener('click',e=>{const btn=e.target.closest('button');if(!btn)return;const card=btn.closest('.shop-item');if(!card)return;const text=(card.textContent||'').toLowerCase();const isAmulet=text.includes('amulet');const action=(btn.textContent||'').toLowerCase();if(isAmulet&&action.includes('equipar')&&!canCarryAmulet()){e.preventDefault();e.stopImmediatePropagation();if(typeof toast==='function')toast('Compre e equipe uma Backpack antes de usar um Amuleto.')}},true)}
  function renderCapacity(){const panel=document.querySelector('.shop-section');if(!panel||document.getElementById('backpackCapacityNote'))return;const note=document.createElement('div');note.id='backpackCapacityNote';note.className='backpack-capacity-note';panel.appendChild(note);updateCapacity()}
  function updateCapacity(){const note=document.getElementById('backpackCapacityNote');if(!note)return;const bp=current();note.innerHTML=bp?`<span>🎒 Backpack equipada: <strong>${esc(bp.name)}</strong></span><span>Capacidade: <strong>${bp.slots} slots</strong> · 1 para o Amuleto + ${Math.max(0,bp.slots-1)} para Trinkets</span>`:`<span>🎒 Nenhuma Backpack equipada.</span><span>Compre uma Backpack para liberar o uso de Amuletos e Trinkets.</span>`}
  function installStyle(){if(document.getElementById('arena-backpack-style'))return;const style=document.createElement('style');style.id='arena-backpack-style';style.textContent=`.backpack-capacity-note{margin-top:10px;padding:10px 12px;border:1px solid #383c42;background:#111316;display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;color:#7f858e;font-size:.65rem}.backpack-capacity-note strong{color:var(--gold2)}.shop-filter[data-filter="backpacks"]{border-color:#4d4a3e}@media(max-width:620px){.backpack-capacity-note{display:block}.backpack-capacity-note span{display:block}.backpack-capacity-note span+span{margin-top:4px}}`;document.head.appendChild(style)}
  ensure();installStyle();installGuard();
  const oldRender=typeof shopRender==='function'?shopRender:null;
  if(oldRender&&!window.__arenaBackpackShopWrapped){window.shopRender=function(){oldRender();installGuard();renderCapacity();updateCapacity()};window.__arenaBackpackShopWrapped=true}
  setInterval(()=>{ensure();updateCapacity()},500);
  window.arenaBackpacks={BACKPACKS,current,capacity,canCarryAmulet};
})();

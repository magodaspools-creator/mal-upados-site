// Trinkets da Arena — versão limpa, sem sistema de D6.
(()=>{
  const TRINKETS=[
    {id:'trinket-loot-1',name:'Lucky Charm',icon:'✦',category:'trinkets',type:'loot',level:1,price:1200,minLevel:5,loot:10,bonus:'+10% loot'},
    {id:'trinket-loot-2',name:'Lucky Charm',icon:'✦',category:'trinkets',type:'loot',level:2,price:4500,minLevel:15,loot:20,bonus:'+20% loot'},
    {id:'trinket-loot-3',name:'Lucky Charm',icon:'✦',category:'trinkets',type:'loot',level:3,price:12000,minLevel:30,loot:30,bonus:'+30% loot'},
    {id:'trinket-crit-1',name:'Critical Eye',icon:'◆',category:'trinkets',type:'crit',level:1,price:1400,minLevel:5,crit:5,bonus:'+5% chance de crítico'},
    {id:'trinket-crit-2',name:'Critical Eye',icon:'◆',category:'trinkets',type:'crit',level:2,price:5000,minLevel:15,crit:10,bonus:'+10% chance de crítico'},
    {id:'trinket-crit-3',name:'Critical Eye',icon:'◆',category:'trinkets',type:'crit',level:3,price:13500,minLevel:30,crit:15,bonus:'+15% chance de crítico'},
    {id:'trinket-life-1',name:'Vampiric Fang',icon:'♥',category:'trinkets',type:'lifesteal',level:1,price:1600,minLevel:5,lifesteal:3,bonus:'Rouba 3% do dano em vida'},
    {id:'trinket-life-2',name:'Vampiric Fang',icon:'♥',category:'trinkets',type:'lifesteal',level:2,price:5500,minLevel:15,lifesteal:6,bonus:'Rouba 6% do dano em vida'},
    {id:'trinket-life-3',name:'Vampiric Fang',icon:'♥',category:'trinkets',type:'lifesteal',level:3,price:14500,minLevel:30,lifesteal:10,bonus:'Rouba 10% do dano em vida'}
  ];
  const TYPES=['loot','crit','lifesteal'];

  if(typeof SHOP_CATEGORIES!=='undefined'&&!SHOP_CATEGORIES.some(x=>x.id==='trinkets'))SHOP_CATEGORIES.push({id:'trinkets',label:'Trinkets'});
  if(typeof SHOP_ITEMS!=='undefined')TRINKETS.forEach(item=>{if(!SHOP_ITEMS.some(x=>x.id===item.id))SHOP_ITEMS.push(item)});

  const find=(type,level)=>TRINKETS.find(x=>x.type===type&&x.level===level)||null;
  const highestOwned=type=>typeof game==='undefined'||!game?null:TRINKETS.filter(x=>x.type===type&&game.shopOwned?.includes(x.id)).sort((a,b)=>b.level-a.level)[0]||null;

  function ensure(){
    if(typeof game==='undefined'||!game)return;
    if(!game.shopOwned)game.shopOwned=[];
    if(!game.shopEquipped)game.shopEquipped={};
    if(!Array.isArray(game.shopEquipped.trinkets))game.shopEquipped.trinkets=[];
    TYPES.forEach(type=>{
      const owned=TRINKETS.filter(x=>x.type===type&&game.shopOwned.includes(x.id));
      if(!owned.length)return;
      const best=owned.sort((a,b)=>b.level-a.level)[0];
      const equippedBest=game.shopEquipped.trinkets.includes(best.id);
      game.shopOwned=game.shopOwned.filter(id=>!owned.some(x=>x.id===id)||id===best.id);
      game.shopEquipped.trinkets=game.shopEquipped.trinkets.filter(id=>!owned.some(x=>x.id===id)||id===best.id);
      if(equippedBest&&!game.shopEquipped.trinkets.includes(best.id))game.shopEquipped.trinkets.push(best.id);
    });
    game.shopEquipped.trinkets=game.shopEquipped.trinkets.filter(id=>TRINKETS.some(x=>x.id===id)&&game.shopOwned.includes(id));
  }

  function equipped(){ensure();return game?.shopEquipped?.trinkets||[]}
  function owned(){ensure();return TYPES.map(highestOwned).filter(Boolean)}
  function active(){return owned().filter(x=>equipped().includes(x.id))}
  function bonuses(){
    const out={loot:0,crit:0,lifesteal:0};
    active().forEach(x=>{out.loot+=x.loot||0;out.crit+=x.crit||0;out.lifesteal+=x.lifesteal||0});
    return out;
  }
  function typeEquipped(type){return active().find(x=>x.type===type)||null}

  function equip(id){
    ensure();const item=TRINKETS.find(x=>x.id===id);if(!item||!game.shopOwned.includes(id))return false;
    game.shopEquipped.trinkets=game.shopEquipped.trinkets.filter(existing=>TRINKETS.find(x=>x.id===existing)?.type!==item.type);
    game.shopEquipped.trinkets.push(id);persist?.();shopRender?.();return true;
  }
  function unequip(id){ensure();game.shopEquipped.trinkets=game.shopEquipped.trinkets.filter(x=>x!==id);persist?.();shopRender?.()}

  function upgrade(type){
    ensure();const current=highestOwned(type);
    if(!current){toast?.('Compre a Trinket primeiro.');return false}
    if(current.level>=3){toast?.('Esta Trinket já está no nível máximo.');return false}
    const next=find(type,current.level+1);if(!next)return false;
    if(game.level<next.minLevel){toast?.(`Você precisa do Arena Level ${next.minLevel} para este upgrade.`);return false}
    if(game.gold<next.price){toast?.(`Gold insuficiente. Upgrade custa ${fmt(next.price)} gold.`);return false}
    const wasEquipped=equipped().includes(current.id);
    game.gold-=next.price;game.shopOwned=game.shopOwned.filter(id=>id!==current.id);game.shopOwned.push(next.id);
    game.shopEquipped.trinkets=game.shopEquipped.trinkets.filter(id=>id!==current.id);
    if(wasEquipped)game.shopEquipped.trinkets.push(next.id);
    persist?.();shopRender?.();toast?.(`${next.name} melhorada para nível ${next.level}.`);return true;
  }

  const previousSlotFor=typeof slotFor==='function'?slotFor:null;
  if(previousSlotFor)window.slotFor=function(item){if(item?.category==='trinkets')return 'trinkets';return previousSlotFor(item)};

  function renderTrinketCards(){
    const box=document.getElementById('shopItems');if(!box)return;
    box.querySelectorAll('.shop-item').forEach(card=>{
      const btn=card.querySelector('button');if(!btn)return;
      const item=TRINKETS.find(x=>x.id===btn.dataset.id);if(!item||item.level!==1)return;
      const current=highestOwned(item.type);const activeNow=!!current&&equipped().includes(current.id);const next=current&&current.level<3?find(item.type,current.level+1):null;const ownedBase=!!current;
      let badge=card.querySelector('.arena-trinket-level-badge');
      if(!badge){badge=document.createElement('div');badge.className='arena-trinket-level-badge';card.prepend(badge)}
      badge.textContent=`NÍVEL ${current?.level||1}`;badge.classList.toggle('owned',ownedBase);badge.classList.toggle('max',current?.level===3);
      if(!ownedBase){btn.textContent=`Comprar · ${fmt(item.price)} gold`;btn.disabled=game.level<item.minLevel||game.gold<item.price;btn.onclick=()=>window.shopAction(item.id)}
      else if(next){btn.textContent=`⬆ Upgrade para ${next.level} · ${fmt(next.price)} gold`;btn.disabled=game.level<next.minLevel||game.gold<next.price;btn.onclick=()=>upgrade(item.type);card.classList.toggle('equipped',activeNow)}
      else{btn.textContent='NÍVEL MÁXIMO';btn.disabled=true;card.classList.toggle('equipped',activeNow)}
      const meta=card.querySelector('.shop-item-bonus');if(meta)meta.textContent=ownedBase?`${current.bonus}${activeNow?' · EQUIPADA':''}`:item.bonus;
      const small=card.querySelector('.shop-info small');if(small)small.textContent=ownedBase?`Nível atual: ${current.level}/3${next?` · Próximo: Level ${next.minLevel}+`:''}`:`Level ${item.minLevel}+ · ${fmt(item.price)} gold`;
    });
  }

  const previousRender=typeof shopRender==='function'?shopRender:null;
  if(previousRender&&!window.__arenaTrinketShopV2Wrapped){
    window.shopRender=function(){ensure();previousRender();renderTrinketCards()};
    window.__arenaTrinketShopV2Wrapped=true;
  }

  const previousShopAction=typeof shopAction==='function'?shopAction:null;
  if(previousShopAction&&!window.__arenaTrinketActionV2Wrapped){
    window.shopAction=function(id){
      const item=TRINKETS.find(x=>x.id===id);
      if(!item)return previousShopAction(id);
      if(item.level!==1){toast?.('Use o botão Upgrade para evoluir esta Trinket.');return}
      ensure();
      if(game.shopOwned.includes(item.id)){equip(item.id);return}
      if(game.level<item.minLevel){toast?.(`Você precisa do Arena Level ${item.minLevel}.`);return}
      if(game.gold<item.price){toast?.('Gold insuficiente.');return}
      game.gold-=item.price;game.shopOwned.push(item.id);persist?.();shopRender?.();renderAll?.();toast?.(`${item.name} adquirida. Abra a Backpack para equipar.`);
    };
    window.__arenaTrinketActionV2Wrapped=true;
  }

  function installStyle(){
    if(document.getElementById('arena-trinket-level-style'))return;
    const s=document.createElement('style');s.id='arena-trinket-level-style';
    s.textContent=`.shop-item{position:relative}.arena-trinket-level-badge{position:absolute;top:8px;right:8px;z-index:3;display:block;width:max-content;padding:4px 8px;border:1px solid rgba(220,180,90,.75);border-radius:999px;background:rgba(35,27,18,.92);color:#f2d37d;font:900 .66rem/1 Arial,sans-serif;letter-spacing:.8px;box-shadow:0 2px 8px rgba(0,0,0,.35);pointer-events:none;white-space:nowrap}.arena-trinket-level-badge.owned{border-color:#e6c15c;background:rgba(78,56,20,.94);color:#ffe29a}.arena-trinket-level-badge.max{border-color:#8ed6a0;background:rgba(25,70,38,.94);color:#b8f0c6}@media(max-width:620px){.arena-trinket-level-badge{top:6px;right:6px;font-size:.62rem;padding:4px 7px;letter-spacing:.6px}}`;
    document.head.appendChild(s);
  }

  function combatWrap(){
    if(typeof attack!=='function'||window.__arenaTrinketCombatV2)return;
    const originalAttack=window.attack;
    window.attack=function(){
      if(!battle||window.__arenaCritRolling)return;
      const b=bonuses();
      const critical=b.crit>0&&Math.random()*100<b.crit;
      if(critical&&typeof window.__arenaRollCrit3D==='function'){
        window.__arenaRollCrit3D(battle.attack,b,originalAttack);
        return;
      }
      const beforeHp=battle.hp;originalAttack();
      const dealt=Math.max(0,beforeHp-(battle?.hp??0));
      if(b.lifesteal>0&&dealt>0&&battle){const healed=Math.max(1,Math.floor(dealt*b.lifesteal/100));battle.playerHp=Math.min(battle.playerMax,battle.playerHp+healed);battleLog(`Roubo de vida: +${healed} HP`)}
      if(typeof renderBattle==='function')renderBattle();
    };
    window.__arenaTrinketCombatV2=true;
  }

  function install(){ensure();installStyle();combatWrap();shopRender?.()}
  window.arenaTrinkets={TRINKETS,owned,active,equipped,bonuses,equip,unequip,typeEquipped,upgrade};
  install();window.addEventListener('load',install);setTimeout(install,500);
})();

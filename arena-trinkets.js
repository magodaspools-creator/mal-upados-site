// Sistema de Trinkets da Arena.
// 3 tipos x 3 níveis. Trinkets ficam na Backpack e podem ser equipados juntos.
(()=>{
  const TRINKETS=[
    {id:'trinket-loot-1',name:'Lucky Charm I',icon:'✦',category:'trinkets',type:'loot',level:1,price:1200,minLevel:5,loot:10,bonus:'+10% loot'},
    {id:'trinket-loot-2',name:'Lucky Charm II',icon:'✦',category:'trinkets',type:'loot',level:2,price:4500,minLevel:15,loot:20,bonus:'+20% loot'},
    {id:'trinket-loot-3',name:'Lucky Charm III',icon:'✦',category:'trinkets',type:'loot',level:3,price:12000,minLevel:30,loot:30,bonus:'+30% loot'},
    {id:'trinket-crit-1',name:'Critical Eye I',icon:'◆',category:'trinkets',type:'crit',level:1,price:1400,minLevel:5,crit:5,bonus:'+5% chance de crítico'},
    {id:'trinket-crit-2',name:'Critical Eye II',icon:'◆',category:'trinkets',type:'crit',level:2,price:5000,minLevel:15,crit:10,bonus:'+10% chance de crítico'},
    {id:'trinket-crit-3',name:'Critical Eye III',icon:'◆',category:'trinkets',type:'crit',level:3,price:13500,minLevel:30,crit:15,bonus:'+15% chance de crítico'},
    {id:'trinket-life-1',name:'Vampiric Fang I',icon:'♥',category:'trinkets',type:'lifesteal',level:1,price:1600,minLevel:5,lifesteal:3,bonus:'Rouba 3% do dano em vida'},
    {id:'trinket-life-2',name:'Vampiric Fang II',icon:'♥',category:'trinkets',type:'lifesteal',level:2,price:5500,minLevel:15,lifesteal:6,bonus:'Rouba 6% do dano em vida'},
    {id:'trinket-life-3',name:'Vampiric Fang III',icon:'♥',category:'trinkets',type:'lifesteal',level:3,price:14500,minLevel:30,lifesteal:10,bonus:'Rouba 10% do dano em vida'}
  ];

  if(typeof SHOP_CATEGORIES!=='undefined'&&!SHOP_CATEGORIES.some(x=>x.id==='trinkets'))SHOP_CATEGORIES.push({id:'trinkets',label:'Trinkets'});
  if(typeof SHOP_ITEMS!=='undefined')TRINKETS.forEach(item=>{if(!SHOP_ITEMS.some(x=>x.id===item.id))SHOP_ITEMS.push(item)});

  function ensure(){
    if(typeof game==='undefined'||!game)return;
    if(!game.shopOwned)game.shopOwned=[];
    if(!game.shopEquipped)game.shopEquipped={};
    if(!Array.isArray(game.shopEquipped.trinkets))game.shopEquipped.trinkets=[];
    game.shopEquipped.trinkets=game.shopEquipped.trinkets.filter(id=>TRINKETS.some(x=>x.id===id)&&game.shopOwned.includes(id));
  }

  function equipped(){ensure();return game?.shopEquipped?.trinkets||[]}
  function owned(){ensure();return TRINKETS.filter(x=>game.shopOwned.includes(x.id))}
  function active(){return owned().filter(x=>equipped().includes(x.id))}
  function bonuses(){
    const out={loot:0,crit:0,lifesteal:0};
    active().forEach(x=>{out.loot+=x.loot||0;out.crit+=x.crit||0;out.lifesteal+=x.lifesteal||0});
    return out;
  }

  // Cada tipo pode ter somente 1 Trinket equipado: o nível escolhido substitui o anterior.
  function typeEquipped(type){return active().find(x=>x.type===type)||null}
  function equip(id){
    ensure();
    const item=TRINKETS.find(x=>x.id===id);
    if(!item||!game.shopOwned.includes(id))return false;
    game.shopEquipped.trinkets=game.shopEquipped.trinkets.filter(existing=>{
      const other=TRINKETS.find(x=>x.id===existing);
      return other?.type!==item.type;
    });
    game.shopEquipped.trinkets.push(id);
    if(typeof persist==='function')persist();
    if(typeof shopRender==='function')shopRender();
    return true;
  }
  function unequip(id){
    ensure();
    game.shopEquipped.trinkets=game.shopEquipped.trinkets.filter(x=>x!==id);
    if(typeof persist==='function')persist();
    if(typeof shopRender==='function')shopRender();
  }

  // O slot físico continua sendo a categoria Trinkets para manter a capacidade da Backpack.
  // A lista interna permite 1 Loot + 1 Crit + 1 Lifesteal equipados ao mesmo tempo.
  const previousSlotFor=typeof slotFor==='function'?slotFor:null;
  if(previousSlotFor){window.slotFor=function(item){if(item?.category==='trinkets')return 'trinkets';return previousSlotFor(item)}}

  const previousRender=typeof shopRender==='function'?shopRender:null;
  if(previousRender&&!window.__arenaTrinketShopWrapped){
    window.shopRender=function(){
      previousRender();
      document.querySelectorAll('#shopItems .shop-item').forEach(card=>{
        const btn=card.querySelector('button');
        if(!btn)return;
        const item=TRINKETS.find(x=>x.id===btn.dataset.id);
        if(!item||!game.shopOwned.includes(item.id))return;
        const isEquipped=equipped().includes(item.id);
        btn.textContent=isEquipped?'Desequipar':'Equipar';
        btn.classList.toggle('active',!isEquipped);
        btn.onclick=()=>isEquipped?unequip(item.id):equip(item.id);
        const meta=card.querySelector('.shop-item-bonus');
        if(meta)meta.textContent=item.bonus;
      });
    };
    window.__arenaTrinketShopWrapped=true;
  }

  function combatWrap(){
    if(typeof attack!=='function'||window.__arenaTrinketAttackWrapped)return;
    const originalAttack=attack;
    window.attack=function(){
      if(!battle)return;
      const b=bonuses();
      const baseAttack=battle.attack;
      let critical=false;
      if(b.crit>0&&Math.random()*100<b.crit){battle.attack=Math.floor(battle.attack*2);critical=true}
      const beforeHp=battle.hp;
      originalAttack();
      const dealt=beforeHp-(battle?.hp??0);
      battle.attack=baseAttack;
      if(critical&&dealt>0){battleLog(`<span class="loot">CRÍTICO! x2 dano · +${b.crit}% chance</span>`)}
      if(b.lifesteal>0&&dealt>0&&battle){
        const healed=Math.max(1,Math.floor(dealt*b.lifesteal/100));
        battle.playerHp=Math.min(battle.playerMax,battle.playerHp+healed);
        battleLog(`🩸 Roubo de vida: +${healed} HP`);
      }
      if(battle&&typeof renderBattle==='function')renderBattle();
    };
    window.__arenaTrinketAttackWrapped=true;
  }

  function winWrap(){
    if(typeof winBattle!=='function'||window.__arenaTrinketWinWrapped)return;
    const originalWin=winBattle;
    window.winBattle=function(){
      const b=bonuses();
      if(b.loot>0&&battle)battle.gold=Math.floor(battle.gold*(1+b.loot/100));
      originalWin();
      if(b.loot>0)toast(`Trinket de Loot: +${b.loot}% gold nesta vitória.`);
    };
    window.__arenaTrinketWinWrapped=true;
  }

  function install(){
    ensure();
    combatWrap();
    winWrap();
  }

  window.arenaTrinkets={TRINKETS,owned,active,equipped,bonuses,equip,unequip,typeEquipped};
  install();
  window.addEventListener('load',install);
  setTimeout(install,500);
})();

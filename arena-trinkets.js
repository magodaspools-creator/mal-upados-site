// Sistema de Trinkets da Arena.
// 3 tipos. Cada tipo ocupa apenas 1 slot na Backpack e evolui por Upgrade.
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
  const BASE_TYPES=['loot','crit','lifesteal'];

  if(typeof SHOP_CATEGORIES!=='undefined'&&!SHOP_CATEGORIES.some(x=>x.id==='trinkets'))SHOP_CATEGORIES.push({id:'trinkets',label:'Trinkets'});
  if(typeof SHOP_ITEMS!=='undefined')TRINKETS.forEach(item=>{if(!SHOP_ITEMS.some(x=>x.id===item.id))SHOP_ITEMS.push(item)});

  const find=(type,level)=>TRINKETS.find(x=>x.type===type&&x.level===level)||null;
  const highestOwned=(type)=>{
    if(typeof game==='undefined'||!game)return null;
    return TRINKETS.filter(x=>x.type===type&&game.shopOwned?.includes(x.id)).sort((a,b)=>b.level-a.level)[0]||null;
  };

  function ensure(){
    if(typeof game==='undefined'||!game)return;
    if(!game.shopOwned)game.shopOwned=[];
    if(!game.shopEquipped)game.shopEquipped={};
    if(!Array.isArray(game.shopEquipped.trinkets))game.shopEquipped.trinkets=[];

    // Migração: contas antigas que tinham I + II + III ficam somente com o maior nível.
    BASE_TYPES.forEach(type=>{
      const owned=TRINKETS.filter(x=>x.type===type&&game.shopOwned.includes(x.id));
      if(!owned.length)return;
      const best=owned.sort((a,b)=>b.level-a.level)[0];
      game.shopOwned=game.shopOwned.filter(id=>!owned.some(x=>x.id===id)||id===best.id);
      game.shopEquipped.trinkets=game.shopEquipped.trinkets.filter(id=>!owned.some(x=>x.id===id)||id===best.id);
      if(game.shopEquipped.trinkets.includes(best.id)===false&&owned.some(x=>x.id===best.id&&game.shopEquipped.trinkets.includes(x.id)))game.shopEquipped.trinkets.push(best.id);
    });

    game.shopEquipped.trinkets=game.shopEquipped.trinkets.filter(id=>TRINKETS.some(x=>x.id===id)&&game.shopOwned.includes(id));
  }

  function equipped(){ensure();return game?.shopEquipped?.trinkets||[]}
  function owned(){ensure();return BASE_TYPES.map(type=>highestOwned(type)).filter(Boolean)}
  function active(){return owned().filter(x=>equipped().includes(x.id))}
  function bonuses(){
    const out={loot:0,crit:0,lifesteal:0};
    active().forEach(x=>{out.loot+=x.loot||0;out.crit+=x.crit||0;out.lifesteal+=x.lifesteal||0});
    return out;
  }
  function typeEquipped(type){return active().find(x=>x.type===type)||null}

  function equip(id){
    ensure();
    const item=TRINKETS.find(x=>x.id===id);
    if(!item||!game.shopOwned.includes(id))return false;
    game.shopEquipped.trinkets=game.shopEquipped.trinkets.filter(existing=>TRINKETS.find(x=>x.id===existing)?.type!==item.type);
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

  function upgrade(type){
    ensure();
    const current=highestOwned(type);
    if(!current){toast('Compre a Trinket primeiro.');return false}
    if(current.level>=3){toast('Esta Trinket já está no nível máximo.');return false}
    const next=find(type,current.level+1);
    if(!next)return false;
    if(game.level<next.minLevel){toast(`Você precisa do Arena Level ${next.minLevel} para este upgrade.`);return false}
    if(game.gold<next.price){toast(`Gold insuficiente. Upgrade custa ${fmt(next.price)} gold.`);return false}

    const wasEquipped=equipped().includes(current.id);
    game.gold-=next.price;
    game.shopOwned=game.shopOwned.filter(id=>id!==current.id);
    game.shopOwned.push(next.id);
    game.shopEquipped.trinkets=game.shopEquipped.trinkets.filter(id=>id!==current.id);
    if(wasEquipped)game.shopEquipped.trinkets.push(next.id);
    persist();
    shopRender();
    toast(`${next.name} melhorada para nível ${next.level}.`);
    return true;
  }

  // O slot físico continua sendo a categoria Trinkets.
  const previousSlotFor=typeof slotFor==='function'?slotFor:null;
  if(previousSlotFor){window.slotFor=function(item){if(item?.category==='trinkets')return 'trinkets';return previousSlotFor(item)}}

  function renderTrinketCards(){
    const box=document.getElementById('shopItems');
    if(!box)return;
    box.querySelectorAll('.shop-item').forEach(card=>{
      const btn=card.querySelector('button');
      if(!btn)return;
      const item=TRINKETS.find(x=>x.id===btn.dataset.id);
      if(!item)return;
      // A loja mostra somente a Trinket base de cada tipo. Os níveis II/III viram upgrades.
      if(item.level!==1){card.remove();return}

      const current=highestOwned(item.type);
      const currentLevel=current?.level||0;
      const active=current&&equipped().includes(current.id);
      const next=current&&current.level<3?find(item.type,current.level+1):null;
      const ownedBase=!!current;

      if(!ownedBase){
        btn.textContent=`Comprar · ${fmt(item.price)} gold`;
        btn.disabled=game.level<item.minLevel||game.gold<item.price;
        btn.onclick=()=>window.shopAction(item.id);
      }else if(next){
        btn.textContent=`⬆ Upgrade para ${next.level} · ${fmt(next.price)} gold`;
        btn.disabled=game.level<next.minLevel||game.gold<next.price;
        btn.onclick=()=>upgrade(item.type);
        card.classList.toggle('equipped',active);
      }else{
        btn.textContent='NÍVEL MÁXIMO';
        btn.disabled=true;
        card.classList.toggle('equipped',active);
      }

      const meta=card.querySelector('.shop-item-bonus');
      if(meta)meta.textContent=ownedBase?`${current.bonus}${active?' · EQUIPADA':''}`:item.bonus;
      const info=card.querySelector('.shop-info');
      const small=info?.querySelector('small');
      if(small)small.textContent=ownedBase?`Nível atual: ${current.level}/3${next?` · Próximo: Level ${next.minLevel}+`:''}`:`Level ${item.minLevel}+ · ${fmt(item.price)} gold`;
    });
  }

  const previousRender=typeof shopRender==='function'?shopRender:null;
  if(previousRender&&!window.__arenaTrinketShopWrapped){
    window.shopRender=function(){
      ensure();
      previousRender();
      renderTrinketCards();
    };
    window.__arenaTrinketShopWrapped=true;
  }

  const previousShopAction=typeof shopAction==='function'?shopAction:null;
  if(previousShopAction&&!window.__arenaTrinketActionWrapped){
    window.shopAction=function(id){
      const item=TRINKETS.find(x=>x.id===id);
      if(item){
        if(item.level!==1){toast('Use o botão Upgrade para evoluir esta Trinket.');return}
        ensure();
        if(game.shopOwned.includes(item.id)){equip(item.id);return}
        if(game.level<item.minLevel){toast(`Você precisa do Arena Level ${item.minLevel}.`);return}
        if(game.gold<item.price){toast('Gold insuficiente.');return}
        game.gold-=item.price;
        game.shopOwned.push(item.id);
        // A compra da Trinket entra na Backpack; o jogador escolhe equipar por lá.
        persist();
        shopRender();
        if(typeof renderAll==='function')renderAll();
        toast(`${item.name} adquirida. Abra a Backpack para equipar.`);
        return;
      }
      return previousShopAction(id);
    };
    window.__arenaTrinketActionWrapped=true;
  }

  function showCritAnimation(){
    const area=document.getElementById('battleArea');if(!area)return;
    area.querySelector('.arena-crit-pop')?.remove();
    const el=document.createElement('div');el.className='arena-crit-pop';el.textContent='CRIT!';area.appendChild(el);
    setTimeout(()=>el.remove(),850);
  }
  function installCritStyle(){
    if(document.getElementById('arena-crit-style'))return;
    const s=document.createElement('style');s.id='arena-crit-style';s.textContent=`#battleArea{position:relative}.arena-crit-pop{position:absolute;left:50%;top:50%;z-index:50;pointer-events:none;transform:translate(-50%,-50%) scale(.55) rotate(-4deg);font-family:Cinzel,serif;font-size:clamp(2rem,7vw,4rem);font-weight:900;letter-spacing:2px;color:#e33434;text-shadow:0 3px 0 #620909,0 0 16px rgba(255,40,40,.8),2px 2px 0 #120000;animation:arenaCritPop .8s cubic-bezier(.2,.85,.25,1) forwards}@keyframes arenaCritPop{0%{opacity:0;transform:translate(-50%,-50%) scale(.35) rotate(-8deg)}22%{opacity:1;transform:translate(-50%,-50%) scale(1.18) rotate(3deg)}55%{opacity:1;transform:translate(-50%,-56%) scale(1) rotate(-2deg)}100%{opacity:0;transform:translate(-50%,-72%) scale(1.08) rotate(2deg)}}`;document.head.appendChild(s)
  }
  function combatWrap(){
    if(typeof attack!=='function'||window.__arenaTrinketAttackWrapped)return;
    const originalAttack=attack;
    window.attack=function(){
      if(!battle)return;
      const b=bonuses(),baseAttack=battle.attack;let critical=false;
      if(b.crit>0&&Math.random()*100<b.crit){battle.attack=Math.floor(battle.attack*2);critical=true}
      const beforeHp=battle.hp;originalAttack();const dealt=beforeHp-(battle?.hp??0);battle.attack=baseAttack;
      if(critical&&dealt>0){battleLog(`<span class="loot">CRÍTICO! x2 dano · +${b.crit}% chance</span>`);showCritAnimation()}
      if(b.lifesteal>0&&dealt>0&&battle){const healed=Math.max(1,Math.floor(dealt*b.lifesteal/100));battle.playerHp=Math.min(battle.playerMax,battle.playerHp+healed);battleLog(`🩸 Roubo de vida: +${healed} HP`)}
      if(battle&&typeof renderBattle==='function')renderBattle();
    };
    window.__arenaTrinketAttackWrapped=true;
  }
  function winWrap(){
    if(typeof winBattle!=='function'||window.__arenaTrinketWinWrapped)return;
    const originalWin=winBattle;
    window.winBattle=function(){const b=bonuses();if(b.loot>0&&battle)battle.gold=Math.floor(battle.gold*(1+b.loot/100));originalWin();if(b.loot>0)toast(`Trinket de Loot: +${b.loot}% gold nesta vitória.`)};
    window.__arenaTrinketWinWrapped=true;
  }
  function install(){ensure();installCritStyle();combatWrap();winWrap();if(typeof shopRender==='function')shopRender()}

  window.arenaTrinkets={TRINKETS,owned,active,equipped,bonuses,equip,unequip,typeEquipped,upgrade};
  install();window.addEventListener('load',install);setTimeout(install,500);
})();
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

    BASE_TYPES.forEach(type=>{
      const owned=TRINKETS.filter(x=>x.type===type&&game.shopOwned.includes(x.id));
      if(!owned.length)return;
      const best=owned.sort((a,b)=>b.level-a.level)[0];
      const wasBestEquipped=game.shopEquipped.trinkets.includes(best.id);
      game.shopOwned=game.shopOwned.filter(id=>!owned.some(x=>x.id===id)||id===best.id);
      game.shopEquipped.trinkets=game.shopEquipped.trinkets.filter(id=>!owned.some(x=>x.id===id)||id===best.id);
      if(wasBestEquipped&&!game.shopEquipped.trinkets.includes(best.id))game.shopEquipped.trinkets.push(best.id);
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
      if(item.level!==1){card.remove();return}

      const current=highestOwned(item.type);
      const activeNow=current&&equipped().includes(current.id);
      const next=current&&current.level<3?find(item.type,current.level+1):null;
      const ownedBase=!!current;
      let levelBadge=card.querySelector('.arena-trinket-level-badge');
      if(!levelBadge){
        levelBadge=document.createElement('div');
        levelBadge.className='arena-trinket-level-badge';
        card.prepend(levelBadge);
      }
      levelBadge.textContent=`NÍVEL ${current?.level||1}`;
      levelBadge.classList.toggle('owned',ownedBase);
      levelBadge.classList.toggle('max',current?.level===3);

      if(!ownedBase){
        btn.textContent=`Comprar · ${fmt(item.price)} gold`;
        btn.disabled=game.level<item.minLevel||game.gold<item.price;
        btn.onclick=()=>window.shopAction(item.id);
      }else if(next){
        btn.textContent=`⬆ Upgrade para ${next.level} · ${fmt(next.price)} gold`;
        btn.disabled=game.level<next.minLevel||game.gold<next.price;
        btn.onclick=()=>upgrade(item.type);
        card.classList.toggle('equipped',activeNow);
      }else{
        btn.textContent='NÍVEL MÁXIMO';
        btn.disabled=true;
        card.classList.toggle('equipped',activeNow);
      }

      const meta=card.querySelector('.shop-item-bonus');
      if(meta)meta.textContent=ownedBase?`${current.bonus}${activeNow?' · EQUIPADA':''}`:item.bonus;
      const info=card.querySelector('.shop-info');
      const small=info?.querySelector('small');
      if(small)small.textContent=ownedBase?`Nível atual: ${current.level}/3${next?` · Próximo: Level ${next.minLevel}+`:''}`:`Level ${item.minLevel}+ · ${fmt(item.price)} gold`;
    });
  }

  const previousRender=typeof shopRender==='function'?shopRender:null;
  if(previousRender&&!window.__arenaTrinketShopWrapped){
    window.shopRender=function(){ensure();previousRender();renderTrinketCards()};
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

  const D6_FACES={1:[4],2:[0,8],3:[0,4,8],4:[0,2,6,8],5:[0,2,4,6,8],6:[0,2,3,5,6,8]};
  function d6Face(n){const dots=new Array(9).fill('').map((_,i)=>D6_FACES[n].includes(i)?'<i></i>':'<i class="empty"></i>').join('');return `<div class="arena-d6-face" aria-label="Dado mostrando ${n}">${dots}</div>`}
  function showCritDice(roll,multiplier,onDone){
    const area=document.getElementById('battleArea');if(!area){onDone();return}
    area.querySelector('.arena-crit-dice-overlay')?.remove();
    const el=document.createElement('div');el.className='arena-crit-dice-overlay';
    el.innerHTML=`<div class="arena-crit-dice-modal"><div class="arena-crit-dice-title">CRÍTICO!</div><div class="arena-crit-dice-sub">Role o D6 para definir o dano</div><div class="arena-d6-wrap">${d6Face(1)}</div><div class="arena-crit-dice-result">?</div><div class="arena-crit-dice-mult">Dano crítico: rolando...</div></div>`;
    area.appendChild(el);let ticks=0;const face=el.querySelector('.arena-d6-wrap');const result=el.querySelector('.arena-crit-dice-result');const mult=el.querySelector('.arena-crit-dice-mult');
    const timer=setInterval(()=>{ticks++;const n=1+Math.floor(Math.random()*6);face.innerHTML=d6Face(n);if(ticks>=9){clearInterval(timer);face.innerHTML=d6Face(roll);result.textContent=roll;mult.textContent=`Dano crítico: x${multiplier.toFixed(2)}`;el.classList.add('resolved');setTimeout(()=>{el.remove();onDone()},650)}},75)
  }

  function installTrinketLevelStyle(){
    if(document.getElementById('arena-trinket-level-style'))return;
    const s=document.createElement('style');s.id='arena-trinket-level-style';s.textContent=`.shop-item{position:relative}.arena-trinket-level-badge{display:block;width:max-content;margin:-4px 0 10px;padding:5px 12px;border:2px solid rgba(220,180,90,.65);border-radius:999px;background:rgba(80,58,24,.5);color:#f2d37d;font:900 .78rem/1 Arial,sans-serif;letter-spacing:1.2px;box-shadow:0 2px 10px rgba(0,0,0,.25)}.arena-trinket-level-badge.owned{border-color:#e6c15c;background:rgba(126,91,25,.55);color:#ffe29a}.arena-trinket-level-badge.max{border-color:#8ed6a0;background:rgba(35,96,52,.5);color:#b8f0c6}@media(max-width:620px){.arena-trinket-level-badge{font-size:.74rem;padding:5px 10px;margin-bottom:8px}}`;document.head.appendChild(s)
  }

  function installCritStyle(){
    if(document.getElementById('arena-crit-style'))return;
    const s=document.createElement('style');s.id='arena-crit-style';s.textContent=`#battleArea{position:relative}.arena-crit-pop{position:absolute;left:50%;top:50%;z-index:50;pointer-events:none;transform:translate(-50%,-50%) scale(.55) rotate(-4deg);font-family:Cinzel,serif;font-size:clamp(2rem,7vw,4rem);font-weight:900;letter-spacing:2px;color:#e33434;text-shadow:0 3px 0 #620909,0 0 16px rgba(255,40,40,.8),2px 2px 0 #120000;animation:arenaCritPop .8s cubic-bezier(.2,.85,.25,1) forwards}@keyframes arenaCritPop{0%{opacity:0;transform:translate(-50%,-50%) scale(.35) rotate(-8deg)}22%{opacity:1;transform:translate(-50%,-50%) scale(1.18) rotate(3deg)}55%{opacity:1;transform:translate(-50%,-56%) scale(1) rotate(-2deg)}100%{opacity:0;transform:translate(-50%,-72%) scale(1.08) rotate(2deg)}}.arena-crit-dice-overlay{position:absolute;inset:0;z-index:80;display:flex;align-items:center;justify-content:center;background:rgba(8,5,12,.58);backdrop-filter:blur(2px);pointer-events:auto}.arena-crit-dice-modal{min-width:220px;max-width:86%;padding:18px 20px 20px;border:2px solid rgba(220,180,90,.75);border-radius:12px;background:linear-gradient(145deg,#211a24,#0d0a10);box-shadow:0 12px 40px rgba(0,0,0,.65),0 0 24px rgba(220,180,90,.18);text-align:center;font-family:Cinzel,serif;color:#f7e8c5}.arena-crit-dice-title{font-size:1.55rem;font-weight:900;letter-spacing:2px;color:#e33434;text-shadow:0 2px 0 #620909}.arena-crit-dice-sub{margin-top:3px;font:700 .7rem/1.3 Arial,sans-serif;color:#cfc5b5}.arena-d6-wrap{height:82px;margin:14px auto 6px;display:flex;align-items:center;justify-content:center}.arena-d6-face{width:68px;height:68px;padding:8px;box-sizing:border-box;display:grid;grid-template-columns:repeat(3,1fr);grid-template-rows:repeat(3,1fr);gap:3px;border:2px solid #e7d39a;border-radius:12px;background:linear-gradient(145deg,#f8f0d9,#bda86e);box-shadow:0 8px 18px rgba(0,0,0,.45),inset 0 1px 0 rgba(255,255,255,.65);transform:rotate(-4deg);animation:arenaDiceShake .16s linear infinite}.arena-d6-face i{display:block;width:10px;height:10px;align-self:center;justify-self:center;border-radius:50%;background:#241d22;box-shadow:inset 0 1px 1px rgba(255,255,255,.18)}.arena-d6-face i.empty{opacity:0}.arena-crit-dice-result{font-size:2.5rem;line-height:1;font-weight:900;color:#fff;text-shadow:0 2px 8px rgba(255,255,255,.25)}.arena-crit-dice-mult{margin-top:7px;font:900 .85rem Arial,sans-serif;color:#e8c76c}.arena-crit-dice-overlay.resolved .arena-d6-face{animation:arenaDiceResult .35s ease-out forwards}.arena-crit-dice-overlay.resolved .arena-crit-dice-result{animation:arenaDiceNumber .4s ease-out}@keyframes arenaDiceShake{0%{transform:rotate(-6deg) translate(-1px,-1px)}50%{transform:rotate(5deg) translate(1px,1px)}100%{transform:rotate(-4deg) translate(0,0)}}@keyframes arenaDiceResult{to{transform:rotate(0) scale(1.08)}}@keyframes arenaDiceNumber{from{transform:scale(.7);opacity:.2}to{transform:scale(1);opacity:1}}@media(max-width:620px){.arena-crit-dice-modal{min-width:190px;padding:15px}.arena-d6-face{width:60px;height:60px}.arena-d6-wrap{height:72px}}`;document.head.appendChild(s)
  }

  function resolveAttack(originalAttack,baseAttack,b,roll,multiplier){
    if(!battle){window.__arenaCritRolling=false;return}
    battle.attack=Math.floor(baseAttack*multiplier);const beforeHp=battle.hp;originalAttack();const dealt=Math.max(0,beforeHp-(battle?.hp??0));battle.attack=baseAttack;
    battleLog(`<span class="loot">CRÍTICO! D6 = ${roll} · x${multiplier.toFixed(2)} dano</span>`);
    if(battle&&b.lifesteal>0&&dealt>0){const healed=Math.max(1,Math.floor(dealt*b.lifesteal/100));battle.playerHp=Math.min(battle.playerMax,battle.playerHp+healed);battleLog(`🩸 Roubo de vida: +${healed} HP`)}
    if(battle&&typeof renderBattle==='function')renderBattle();window.__arenaCritRolling=false;
  }

  function combatWrap(){
    if(typeof attack!=='function'||window.__arenaTrinketAttackWrapped)return;
    const originalAttack=attack;
    window.attack=function(){
      if(!battle||window.__arenaCritRolling)return;
      const b=bonuses();const baseAttack=battle.attack;const critical=b.crit>0&&Math.random()*100<b.crit;
      if(!critical){const beforeHp=battle.hp;originalAttack();const dealt=Math.max(0,beforeHp-(battle?.hp??0));if(b.lifesteal>0&&dealt>0&&battle){const healed=Math.max(1,Math.floor(dealt*b.lifesteal/100));battle.playerHp=Math.min(battle.playerMax,battle.playerHp+healed);battleLog(`🩸 Roubo de vida: +${healed} HP`)}if(battle&&typeof renderBattle==='function')renderBattle();return}
      window.__arenaCritRolling=true;const roll=1+Math.floor(Math.random()*6);const multiplier=1+(roll*0.25);showCritDice(roll,multiplier,()=>resolveAttack(originalAttack,baseAttack,b,roll,multiplier));
    };
    window.__arenaTrinketAttackWrapped=true;
  }

  function winWrap(){
    if(typeof winBattle!=='function'||window.__arenaTrinketWinWrapped)return;
    const originalWin=winBattle;window.winBattle=function(){const b=bonuses();if(b.loot>0&&battle)battle.gold=Math.floor(battle.gold*(1+b.loot/100));originalWin();if(b.loot>0)toast(`Trinket de Loot: +${b.loot}% gold nesta vitória.`)};window.__arenaTrinketWinWrapped=true;
  }

  function install(){ensure();installTrinketLevelStyle();installCritStyle();combatWrap();winWrap();if(typeof shopRender==='function')shopRender()}
  window.arenaTrinkets={TRINKETS,owned,active,equipped,bonuses,equip,unequip,typeEquipped,upgrade};
  install();window.addEventListener('load',install);setTimeout(install,500);
})();
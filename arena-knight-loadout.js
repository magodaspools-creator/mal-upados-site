// Loadout e classificacao de armas da Arena.
(()=>{
  const KNIGHT_SHIELDS=[
    {id:'bronze-shield',name:'Bronze Shield',icon:'🛡️',category:'shields',class:'Knight',price:180,attack:0,defense:6,minLevel:1,bonus:'+6 defesa · Knight'},
    {id:'dragon-shield',name:'Dragon Shield',icon:'🐉',category:'shields',class:'Knight',price:900,attack:0,defense:16,minLevel:10,bonus:'+16 defesa · Knight'},
    {id:'demon-shield',name:'Demon Shield',icon:'😈',category:'shields',class:'Knight',price:1600,attack:0,defense:24,minLevel:18,bonus:'+24 defesa · Knight'},
    {id:'mastermind-shield',name:'Mastermind Shield',icon:'🛡️',category:'shields',class:'Knight',price:2500,attack:0,defense:32,minLevel:28,bonus:'+32 defesa · Knight'},
    {id:'blessed-shield',name:'Blessed Shield',icon:'✨',category:'shields',class:'Knight',price:4200,attack:0,defense:42,minLevel:38,bonus:'+42 defesa · Knight'}
  ];

  const KNIGHT_WEAPONS=[
    {id:'fire-sword',name:'Fire Sword',hands:1},
    {id:'spike-sword',name:'Spike Sword',hands:1},
    {id:'dragon-lance',name:'Dragon Lance',hands:1},
    {id:'heroic-axe',name:'Heroic Axe',hands:1},
    {id:'avenger',name:'Avenger',hands:1},
    {id:'knight-club',name:'Knight Club',icon:'🔨',category:'weapons',vocation:'Knight',class:'Knight',hands:1,price:620,attack:18,defense:0,minLevel:9,bonus:'+18 ataque · 1 mão · Knight'},
    {id:'demon-wing-axe',name:'Demonwing Axe',hands:2},
    {id:'demon-blade',name:'Demon Blade',hands:2},
    {id:'arcanum-edge',name:'Arcanum Edge',hands:2},
    {id:'knight-sword',name:'Knight Sword',icon:'⚔️',category:'weapons',vocation:'Knight',class:'Knight',hands:2,price:900,attack:27,defense:0,minLevel:16,bonus:'+27 ataque · 2 mãos · Knight'},
    {id:'knight-axe',name:'Knight Axe',icon:'🪓',category:'weapons',vocation:'Knight',class:'Knight',hands:2,price:1250,attack:32,defense:0,minLevel:21,bonus:'+32 ataque · 2 mãos · Knight'},
    {id:'knight-demon',name:'Demon Crusher',icon:'💀',category:'weapons',vocation:'Knight',class:'Knight',hands:2,price:1900,attack:38,defense:0,minLevel:27,bonus:'+38 ataque · 2 mãos · Knight'}
  ];

  const PALADIN_WEAPONS=[
    {id:'royal-spear',name:'Royal Spear',icon:'🔱',category:'weapons',class:'Paladin',vocation:'Paladin',hands:1,price:220,attack:10,defense:0,minLevel:3,bonus:'+10 ataque · 1 mão · Paladin'},
    {id:'enchanted-spear',name:'Enchanted Spear',icon:'🔱',category:'weapons',class:'Paladin',vocation:'Paladin',hands:1,price:520,attack:17,defense:0,minLevel:8,bonus:'+17 ataque · 1 mão · Paladin'},
    {id:'royal-star',name:'Royal Star',icon:'⭐',category:'weapons',class:'Paladin',vocation:'Paladin',hands:1,price:780,attack:22,defense:0,minLevel:12,bonus:'+22 ataque · 1 mão · Paladin'},
    {id:'diamond-arrow-star',name:'Diamond Star',icon:'⭐',category:'weapons',class:'Paladin',vocation:'Paladin',hands:1,price:1150,attack:28,defense:0,minLevel:18,bonus:'+28 ataque · 1 mão · Paladin'},
    {id:'crystal-spear',name:'Crystal Spear',icon:'🔱',category:'weapons',class:'Paladin',vocation:'Paladin',hands:1,price:1650,attack:34,defense:0,minLevel:24,bonus:'+34 ataque · 1 mão · Paladin'},
    {id:'blessed-star',name:'Blessed Star',icon:'⭐',category:'weapons',class:'Paladin',vocation:'Paladin',hands:1,price:2400,attack:40,defense:0,minLevel:30,bonus:'+40 ataque · 1 mão · Paladin'},
    {id:'warsinger-bow',name:'Warsinger Bow',icon:'🏹',category:'weapons',class:'Paladin',vocation:'Paladin',hands:2,price:950,attack:24,defense:0,minLevel:14,bonus:'+24 ataque · 2 mãos · Paladin'},
    {id:'royal-crossbow',name:'Royal Crossbow',icon:'🏹',category:'weapons',class:'Paladin',vocation:'Paladin',hands:2,price:1700,attack:31,defense:0,minLevel:20,bonus:'+31 ataque · 2 mãos · Paladin'},
    {id:'falcon-bow',name:'Falcon Bow',icon:'🏹',category:'weapons',class:'Paladin',vocation:'Paladin',hands:2,price:3000,attack:40,defense:0,minLevel:30,bonus:'+40 ataque · 2 mãos · Paladin'},
    {id:'sanguine-bow',name:'Sanguine Bow',icon:'🏹',category:'weapons',class:'Paladin',vocation:'Paladin',hands:2,price:3900,attack:48,defense:0,minLevel:36,bonus:'+48 ataque · 2 mãos · Paladin'},
    {id:'dawnfire-crossbow',name:'Dawnfire Crossbow',icon:'🏹',category:'weapons',class:'Paladin',vocation:'Paladin',hands:2,price:4800,attack:56,defense:0,minLevel:42,bonus:'+56 ataque · 2 mãos · Paladin'},
    {id:'masterwork-bow',name:'Masterwork Bow',icon:'🏹',category:'weapons',class:'Paladin',vocation:'Paladin',hands:2,price:6000,attack:64,defense:0,minLevel:48,bonus:'+64 ataque · 2 mãos · Paladin'}
  ];

  const VOCATION_RANGED=[
    {id:'wand-of-inferno',name:'Wand of Inferno',icon:'🔥',category:'wands',vocation:'Sorcerer',class:'Sorcerer',price:180,attack:8,defense:0,minLevel:1,bonus:'+8 ataque · Sorcerer'},
    {id:'wand-of-everblazing',name:'Wand of Everblazing',icon:'🔥',category:'wands',vocation:'Sorcerer',price:360,attack:12,defense:0,minLevel:5,bonus:'+12 ataque · Sorcerer'},
    {id:'wand-of-destruction',name:'Wand of Destruction',icon:'💥',category:'wands',vocation:'Sorcerer',price:650,attack:17,defense:0,minLevel:10,bonus:'+17 ataque · Sorcerer'},
    {id:'wand-of-defiance',name:'Wand of Defiance',icon:'🪄',category:'wands',vocation:'Sorcerer',price:900,attack:20,defense:2,minLevel:14,bonus:'+20 ataque · +2 defesa · Sorcerer'},
    {id:'wand-of-vortex',name:'Wand of Vortex',icon:'🌪️',category:'wands',vocation:'Sorcerer',price:1250,attack:24,defense:0,minLevel:18,bonus:'+24 ataque · Sorcerer'},
    {id:'wand-of-starfall',name:'Wand of Starfall',icon:'🌠',category:'wands',vocation:'Sorcerer',price:1750,attack:29,defense:1,minLevel:23,bonus:'+29 ataque · +1 defesa · Sorcerer'},
    {id:'wand-of-abyss',name:'Wand of the Abyss',icon:'🌀',category:'wands',vocation:'Sorcerer',class:'Sorcerer',price:2600,attack:35,defense:2,minLevel:30,bonus:'+35 ataque · +2 defesa · Sorcerer'},
    {id:'arcanist-wand',name:'Arcanist Wand',icon:'✨',category:'wands',vocation:'Sorcerer',class:'Sorcerer',price:3800,attack:43,defense:3,minLevel:38,bonus:'+43 ataque · +3 defesa · Sorcerer'},
    {id:'infernal-wand',name:'Infernal Wand',icon:'🔥',category:'wands',vocation:'Sorcerer',class:'Sorcerer',price:4700,attack:51,defense:3,minLevel:45,bonus:'+51 ataque · +3 defesa · Sorcerer'},
    {id:'void-wand',name:'Void Wand',icon:'🌀',category:'wands',vocation:'Sorcerer',class:'Sorcerer',price:5800,attack:59,defense:4,minLevel:52,bonus:'+59 ataque · +4 defesa · Sorcerer'},
    {id:'archmage-wand',name:'Archmage Wand',icon:'✨',category:'wands',vocation:'Sorcerer',class:'Sorcerer',price:7200,attack:68,defense:5,minLevel:60,bonus:'+68 ataque · +5 defesa · Sorcerer'}
  ];

  const DRUID_RODS=[
    {id:'snakebite-rod',name:'Snakebite Rod',icon:'🐍',category:'rods',vocation:'Druid',class:'Druid',price:180,attack:8,defense:0,minLevel:1,bonus:'+8 ataque · Druid'},
    {id:'moonlight-rod',name:'Moonlight Rod',icon:'🌙',category:'rods',vocation:'Druid',class:'Druid',price:360,attack:12,defense:0,minLevel:5,bonus:'+12 ataque · Druid'},
    {id:'necrotic-rod',name:'Necrotic Rod',icon:'💀',category:'rods',vocation:'Druid',class:'Druid',price:650,attack:17,defense:0,minLevel:10,bonus:'+17 ataque · Druid'},
    {id:'terra-rod',name:'Terra Rod',icon:'🌿',category:'rods',vocation:'Druid',class:'Druid',price:900,attack:20,defense:2,minLevel:14,bonus:'+20 ataque · +2 defesa · Druid'},
    {id:'underworld-rod',name:'Underworld Rod',icon:'🌑',category:'rods',vocation:'Druid',class:'Druid',price:1250,attack:24,defense:0,minLevel:18,bonus:'+24 ataque · Druid'},
    {id:'hailstorm-rod',name:'Hailstorm Rod',icon:'❄️',category:'rods',vocation:'Druid',class:'Druid',price:1750,attack:29,defense:1,minLevel:23,bonus:'+29 ataque · +1 defesa · Druid'},
    {id:'shrub-rod',name:'Shrub Rod',icon:'🌿',category:'rods',vocation:'Druid',class:'Druid',price:2600,attack:35,defense:2,minLevel:30,bonus:'+35 ataque · +2 defesa · Druid'},
    {id:'caduceus-rod',name:'Caduceus Rod',icon:'🪄',category:'rods',vocation:'Druid',class:'Druid',price:3800,attack:43,defense:3,minLevel:38,bonus:'+43 ataque · +3 defesa · Druid'},
    {id:'mystic-rod',name:'Mystic Rod',icon:'✨',category:'rods',vocation:'Druid',class:'Druid',price:4700,attack:51,defense:3,minLevel:45,bonus:'+51 ataque · +3 defesa · Druid'},
    {id:'nature-rod',name:'Nature Rod',icon:'🌳',category:'rods',vocation:'Druid',class:'Druid',price:5800,attack:59,defense:4,minLevel:52,bonus:'+59 ataque · +4 defesa · Druid'},
    {id:'elder-rod',name:'Elder Rod',icon:'🌳',category:'rods',vocation:'Druid',class:'Druid',price:7200,attack:68,defense:5,minLevel:60,bonus:'+68 ataque · +5 defesa · Druid'}
  ];

  if(typeof SHOP_CATEGORIES!=='undefined'){
    if(!SHOP_CATEGORIES.some(x=>x.id==='shields'))SHOP_CATEGORIES.push({id:'shields',label:'Escudos'});
    if(!SHOP_CATEGORIES.some(x=>x.id==='rods'))SHOP_CATEGORIES.push({id:'rods',label:'Rods'});
  }

  if(typeof SHOP_ITEMS!=='undefined'){
    KNIGHT_SHIELDS.forEach(item=>{if(!SHOP_ITEMS.some(x=>x.id===item.id))SHOP_ITEMS.push(item)});
    [...KNIGHT_WEAPONS,...PALADIN_WEAPONS,...VOCATION_RANGED,...DRUID_RODS].forEach(item=>{
      const existing=SHOP_ITEMS.find(x=>x.id===item.id);
      if(existing)Object.assign(existing,item);
      else SHOP_ITEMS.push(item);
    });
    SHOP_ITEMS.forEach(item=>{
      if(item.category==='wands')item.vocation='Sorcerer';
      if(item.category==='rods')item.vocation='Druid';
    });
  }

  let weaponVocationFilter='all';
  let weaponHandsFilter='all';

  function currentKnightClass(){
    const member=(typeof members!=='undefined'&&Array.isArray(members))?members.find(m=>m.name===game?.character):null;
    return member?.vocation||'';
  }
  function equippedWeapon(){
    const id=game?.shopEquipped?.weapon;
    return typeof SHOP_ITEMS!=='undefined'&&id?SHOP_ITEMS.find(x=>x.id===id)||null:null;
  }
  function isKnight(){return /knight/i.test(currentKnightClass());}
  function isTwoHanded(item){return !!item&&item.hands===2;}

  function ensureLoadout(){
    if(typeof shopEnsure==='function')shopEnsure();
    if(!game||!isKnight())return;
    if(!game.shopEquipped)game.shopEquipped={};
    if(!Object.prototype.hasOwnProperty.call(game.shopEquipped,'shield'))game.shopEquipped.shield=null;
    const weapon=equippedWeapon();
    if(weapon&&isTwoHanded(weapon))game.shopEquipped.shield=null;
  }

  if(typeof shopAction==='function'&&!window.__arenaKnightShopWrapped){
    const originalShopAction=shopAction;
    window.__arenaKnightShopWrapped=true;
    window.shopAction=function(id){
      const item=typeof SHOP_ITEMS!=='undefined'?SHOP_ITEMS.find(x=>x.id===id):null;
      if(item&&item.category==='shields'&&!isKnight()){
        toast('Escudos da Arena são exclusivos do Knight.');
        return;
      }
      if(item&&item.category==='shields'&&isKnight()){
        ensureLoadout();
        if(game.level<item.minLevel){toast(`Você precisa do Arena Level ${item.minLevel}.`);return;}
        if(game.shopOwned.includes(id)){
          game.shopEquipped.shield=id;
          persist();
          shopRender();
          toast(`${item.name} equipado.`);
          return;
        }
        if(game.gold<item.price){toast('Gold insuficiente.');return;}
        game.gold-=item.price;
        game.shopOwned.push(id);
        game.shopEquipped.shield=id;
        persist();
        shopRender();
        toast(`${item.name} comprado e equipado.`);
        return;
      }
      originalShopAction(id);
      ensureLoadout();
    };
    shopAction=window.shopAction;
  }

  if(typeof shopEnsure==='function'&&!window.__arenaKnightEnsureWrapped){
    const originalEnsure=shopEnsure;
    window.__arenaKnightEnsureWrapped=true;
    window.shopEnsure=function(){
      originalEnsure();
      if(game){
        if(!game.shopEquipped)game.shopEquipped={};
        if(!Object.prototype.hasOwnProperty.call(game.shopEquipped,'shield'))game.shopEquipped.shield=null;
        const weapon=game.shopEquipped.weapon&&typeof SHOP_ITEMS!=='undefined'?SHOP_ITEMS.find(x=>x.id===game.shopEquipped.weapon):null;
        if(weapon&&isTwoHanded(weapon))game.shopEquipped.shield=null;
      }
    };
    shopEnsure=window.shopEnsure;
  }

  if(typeof SHOP_ITEMS!=='undefined'){
    SHOP_ITEMS.forEach(item=>{
      if(item.vocation==='Knight'&&item.category==='weapons'){
        if(!item.hands)item.hands=1;
        if(item.hands===2){
          item.defensePenalty=item.defensePenalty||-8;
          item.bonus=`+${item.attack} ataque · 2 mãos · ${item.defensePenalty} defesa`;
        }
      }
    });
  }

  function applyWeaponFilters(){
    const box=document.getElementById('shopItems');
    if(!box||typeof SHOP_ITEMS==='undefined')return;
    box.querySelectorAll('.shop-item').forEach(card=>{
      const name=card.querySelector('.shop-info strong')?.textContent?.trim()||'';
      const item=SHOP_ITEMS.find(x=>x.name===name);
      if(!item||item.category!=='weapons')return;
      const vocationOk=weaponVocationFilter==='all'||item.vocation===weaponVocationFilter;
      const handsOk=weaponHandsFilter==='all'||Number(item.hands)===Number(weaponHandsFilter);
      card.style.display=vocationOk&&handsOk?'':'none';
    });
  }

  function renderWeaponFilters(){
    const filters=document.getElementById('shopFilters');
    if(!filters)return;
    let old=filters.querySelector('.weapon-subfilters');
    if(old)old.remove();
    if(typeof shopFilter==='undefined'||shopFilter!=='weapons')return;
    const wrap=document.createElement('div');
    wrap.className='weapon-subfilters';
    wrap.innerHTML=`
      <span class="weapon-subfilter-label">Vocação</span>
      <button type="button" class="shop-filter weapon-subfilter ${weaponVocationFilter==='all'?'active':''}" data-weapon-vocation="all">Todas</button>
      <button type="button" class="shop-filter weapon-subfilter ${weaponVocationFilter==='Knight'?'active':''}" data-weapon-vocation="Knight">Knight</button>
      <button type="button" class="shop-filter weapon-subfilter ${weaponVocationFilter==='Paladin'?'active':''}" data-weapon-vocation="Paladin">Paladin</button>
      <button type="button" class="shop-filter weapon-subfilter ${weaponVocationFilter==='Monk'?'active':''}" data-weapon-vocation="Monk">Monk</button>
      <span class="weapon-subfilter-label">Mãos</span>
      <button type="button" class="shop-filter weapon-subfilter ${weaponHandsFilter==='all'?'active':''}" data-weapon-hands="all">Todas</button>
      <button type="button" class="shop-filter weapon-subfilter ${weaponHandsFilter==='1'?'active':''}" data-weapon-hands="1">1 mão</button>
      <button type="button" class="shop-filter weapon-subfilter ${weaponHandsFilter==='2'?'active':''}" data-weapon-hands="2">2 mãos</button>`;
    filters.appendChild(wrap);
    wrap.querySelectorAll('[data-weapon-vocation]').forEach(btn=>btn.onclick=()=>{weaponVocationFilter=btn.dataset.weaponVocation;shopRender()});
    wrap.querySelectorAll('[data-weapon-hands]').forEach(btn=>btn.onclick=()=>{weaponHandsFilter=btn.dataset.weaponHands;shopRender()});
  }

  const originalShopRender=window.shopRender||shopRender;
  if(typeof originalShopRender==='function'&&!window.__arenaWeaponFiltersWrapped){
    window.__arenaWeaponFiltersWrapped=true;
    window.shopRender=function(){
      originalShopRender();
      renderWeaponFilters();
      applyWeaponFilters();
    };
    shopRender=window.shopRender;
  }

  const originalBonus=window.arenaWeaponBonus;
  window.arenaWeaponBonus=function(item){
    let text=typeof originalBonus==='function'?originalBonus(item):'';
    if(item?.vocation==='Knight'&&item?.hands===2)text=`+${item.attack} ataque · 2 mãos · -8 defesa`;
    return text||item?.bonus||'';
  };

  if(typeof shopRender==='function')shopRender();
})();

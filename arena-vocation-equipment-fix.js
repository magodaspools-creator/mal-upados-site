(()=>{
  if(typeof SHOP_ITEMS==='undefined'||typeof game==='undefined')return;

  function currentVocation(){
    const member=typeof members!=='undefined'&&Array.isArray(members)
      ?members.find(m=>m.name===game?.character):null;
    const raw=String(member?.vocation||'').trim().toLowerCase();
    if(/master\s+sorcerer|^sorcerer$/.test(raw))return 'Sorcerer';
    if(/elder\s+druid|^druid$/.test(raw))return 'Druid';
    if(/royal\s+paladin|^paladin$/.test(raw))return 'Paladin';
    if(/elite\s+knight|^knight$/.test(raw))return 'Knight';
    if(/^monk$/.test(raw))return 'Monk';
    return member?.vocation||'';
  }

  function itemVocation(item){
    if(!item)return '';
    const explicit=String(item.class||item.vocation||item.vocations||'').trim().toLowerCase();
    if(explicit.includes('monk'))return 'Monk';
    if(explicit.includes('sorcerer'))return 'Sorcerer';
    if(explicit.includes('druid'))return 'Druid';
    if(explicit.includes('paladin'))return 'Paladin';
    if(explicit.includes('knight'))return 'Knight';

    const category=String(item.category||'').toLowerCase();
    const name=String(item.name||'').toLowerCase();
    if(category==='wands'||/\bwand\b/.test(name))return 'Sorcerer';
    if(category==='rods'||/\brod\b/.test(name))return 'Druid';
    if(category==='weapons'){
      if(/bow|crossbow/.test(name))return 'Paladin';
      if(/monk|fist|knuckle|gauntlet/.test(name))return 'Monk';
      return 'Knight';
    }
    return '';
  }

  function weaponAllowed(item,vocation){
    if(!item||!item.attack)return true;
    const required=itemVocation(item);
    return !required||required===vocation;
  }

  function findCardItem(card){
    if(!card)return null;
    return SHOP_ITEMS.find(item=>{
      const name=String(item.name||'');
      return name&&card.textContent.includes(name);
    })||null;
  }

  function sanitize(){
    const v=currentVocation();
    if(!v||!game.shopEquipped)return;
    const item=SHOP_ITEMS.find(x=>x.id===game.shopEquipped.weapon);
    if(item&&!weaponAllowed(item,v))game.shopEquipped.weapon='base-weapon';
  }

  function lockShopClicks(){
    if(window.__arenaVocationClickLock)return;
    window.__arenaVocationClickLock=true;
    document.addEventListener('click',event=>{
      const target=event.target?.closest?.('.shop-item button, .shop-item');
      if(!target)return;
      const card=target.closest('.shop-item');
      const item=findCardItem(card);
      const v=currentVocation();
      if(!item||!v||weaponAllowed(item,v))return;
      event.preventDefault();
      event.stopPropagation();
      if(typeof event.stopImmediatePropagation==='function')event.stopImmediatePropagation();
      if(typeof window.shopRender==='function')window.shopRender();
    },true);
  }

  if(typeof shopRender==='function'&&!window.__arenaVocationEquipmentFix){
    window.__arenaVocationEquipmentFix=true;
    const originalRender=shopRender;
    window.shopRender=function(){
      sanitize();
      originalRender();
      const v=currentVocation(),box=document.getElementById('shopItems');
      if(!box||!v)return;
      box.querySelectorAll('.shop-item').forEach(card=>{
        const item=findCardItem(card);
        if(!item||weaponAllowed(item,v))return;
        const btn=card.querySelector('button');
        if(!btn)return;
        btn.disabled=true;
        btn.textContent='Exclusivo · '+itemVocation(item);
        card.classList.add('vocation-locked');
      });
    };
    lockShopClicks();
    window.shopRender();
  }
})();

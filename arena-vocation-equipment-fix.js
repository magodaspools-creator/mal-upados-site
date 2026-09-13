(()=>{
  if(typeof SHOP_ITEMS==='undefined'||typeof game==='undefined')return;

  function currentVocation(){
    const member=typeof members!=='undefined'&&Array.isArray(members)
      ?members.find(m=>m.name===game?.character):null;
    return member?.vocation||'';
  }

  function weaponAllowed(item,vocation){
    if(!item)return true;
    const category=String(item.category||'');
    const name=String(item.name||'').toLowerCase();
    const isAttackWeapon=category==='weapons'||category==='wands'||category==='rods'||/\b(wand|rod)\b/.test(name);
    if(!isAttackWeapon)return true;

    if(category==='wands'||/\bwand\b/.test(name))return vocation==='Sorcerer';
    if(category==='rods'||/\brod\b/.test(name))return vocation==='Druid';
    if(category!=='weapons')return true;

    if(/bow|crossbow/.test(name))return vocation==='Paladin';
    return vocation==='Knight';
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
      else if(typeof shopRender==='function')shopRender();
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
        btn.textContent='Exclusivo · '+vocationLabel(item);
        card.classList.add('vocation-locked');
      });
    };

    lockShopClicks();
    window.shopRender();
  }

  function vocationLabel(item){
    const name=String(item?.name||'').toLowerCase();
    if(item?.category==='wands'||/\bwand\b/.test(name))return 'Sorcerer';
    if(item?.category==='rods'||/\brod\b/.test(name))return 'Druid';
    if(item?.category==='weapons')return /bow|crossbow/.test(name)?'Paladin':'Knight';
    return 'outra vocação';
  }
})();

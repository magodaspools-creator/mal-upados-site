(()=>{
  if(typeof SHOP_ITEMS==='undefined'||typeof game==='undefined')return;
  function currentVocation(){
    const member=typeof members!=='undefined'&&Array.isArray(members)?members.find(m=>m.name===game?.character):null;
    return member?.vocation||'';
  }
  function weaponAllowed(item,vocation){
    if(!item||!item.attack)return true;
    const category=item.category,name=String(item.name||'').toLowerCase();
    if(category==='wands')return vocation==='Sorcerer';
    if(category==='rods')return vocation==='Druid';
    if(category!=='weapons')return true;
    if(vocation==='Knight')return !/(bow|crossbow|wand|rod)/.test(name);
    if(vocation==='Paladin')return /(bow|crossbow)/.test(name);
    return false;
  }
  function sanitize(){
    const v=currentVocation();
    if(!v||!game.shopEquipped)return;
    const item=SHOP_ITEMS.find(x=>x.id===game.shopEquipped.weapon);
    if(item&&!weaponAllowed(item,v))game.shopEquipped.weapon='base-weapon';
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
        const btn=card.querySelector('button');
        if(!btn)return;
        const id=btn.dataset.item,item=SHOP_ITEMS.find(x=>x.id===id);
        if(!item||weaponAllowed(item,v))return;
        btn.disabled=true;
        btn.textContent='Exclusivo · '+vocationLabel(item);
        card.classList.add('vocation-locked');
      });
    };
    window.shopRender();
  }
  function vocationLabel(item){
    const name=String(item?.name||'').toLowerCase();
    if(item?.category==='wands')return 'Sorcerer';
    if(item?.category==='rods')return 'Druid';
    if(item?.category==='weapons')return /bow|crossbow/.test(name)?'Paladin':'Knight';
    return 'outra vocação';
  }
})();

// Integração das armas Monk na loja da Arena.
// Mantém a navegação normal de Knight / Paladin / Monk e evita filtro travado.
(()=>{
  const MONK_WEAPONS=[
    {id:'iron-knuckle',name:'Iron Knuckle',icon:'🥊',category:'weapons',vocation:'Monk',class:'Monk',hands:2,price:300,attack:12,defense:0,minLevel:3,bonus:'+12 ataque · 2 mãos · Monk'},
    {id:'tiger-claw',name:'Tiger Claw',icon:'🐯',category:'weapons',vocation:'Monk',class:'Monk',hands:2,price:650,attack:18,defense:0,minLevel:8,bonus:'+18 ataque · 2 mãos · Monk'},
    {id:'jade-gauntlet',name:'Jade Gauntlet',icon:'🟢',category:'weapons',vocation:'Monk',class:'Monk',hands:2,price:1100,attack:25,defense:0,minLevel:14,bonus:'+25 ataque · 2 mãos · Monk'},
    {id:'dragon-fist',name:'Dragon Fist',icon:'🐉',category:'weapons',vocation:'Monk',class:'Monk',hands:2,price:1700,attack:32,defense:0,minLevel:20,bonus:'+32 ataque · 2 mãos · Monk'},
    {id:'thunder-gauntlets',name:'Thunder Gauntlets',icon:'⚡',category:'weapons',vocation:'Monk',class:'Monk',hands:2,price:2500,attack:40,defense:0,minLevel:28,bonus:'+40 ataque · 2 mãos · Monk'},
    {id:'shadow-fists',name:'Shadow Fists',icon:'🌑',category:'weapons',vocation:'Monk',class:'Monk',hands:2,price:3600,attack:49,defense:0,minLevel:36,bonus:'+49 ataque · 2 mãos · Monk'},
    {id:'celestial-gauntlets',name:'Celestial Gauntlets',icon:'✨',category:'weapons',vocation:'Monk',class:'Monk',hands:2,price:5000,attack:59,defense:0,minLevel:46,bonus:'+59 ataque · 2 mãos · Monk'},
    {id:'void-fists',name:'Void Fists',icon:'🌀',category:'weapons',vocation:'Monk',class:'Monk',hands:2,price:7000,attack:70,defense:0,minLevel:58,bonus:'+70 ataque · 2 mãos · Monk'}
  ];

  function ensureItems(){
    if(typeof SHOP_ITEMS==='undefined')return;
    MONK_WEAPONS.forEach(item=>{
      const existing=SHOP_ITEMS.find(x=>x.id===item.id);
      if(existing)Object.assign(existing,item);
      else SHOP_ITEMS.push({...item});
    });
  }

  function addMonkButton(){
    const filters=document.getElementById('shopFilters');
    if(!filters||typeof shopFilter==='undefined'||shopFilter!=='weapons')return;
    const sub=filters.querySelector('.weapon-subfilters');
    if(!sub)return;
    if(sub.querySelector('[data-weapon-vocation="Monk"]'))return;

    const label=[...sub.querySelectorAll('.weapon-subfilter-label')].find(x=>x.textContent.trim()==='Vocação');
    const btn=document.createElement('button');
    btn.type='button';
    btn.className='shop-filter weapon-subfilter';
    btn.dataset.weaponVocation='Monk';
    btn.textContent='Monk';
    if(label)label.after(btn); else sub.appendChild(btn);

    btn.onclick=()=>{
      ensureItems();
      sub.querySelectorAll('[data-weapon-vocation]').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      window.__arenaMonkFilter=true;
      if(typeof window.shopRender==='function')window.shopRender();
    };
  }

  function syncMonkFilterState(){
    const filters=document.getElementById('shopFilters');
    const sub=filters?.querySelector('.weapon-subfilters');
    if(!sub)return;

    const monk=sub.querySelector('[data-weapon-vocation="Monk"]');
    const active=sub.querySelector('[data-weapon-vocation].active');

    // Se Knight, Paladin ou Todas estiver ativo, o filtro Monk deixa de valer.
    window.__arenaMonkFilter=!!(monk&&active===monk);
  }

  function applyMonkFilter(){
    const box=document.getElementById('shopItems');
    if(!box)return;
    syncMonkFilterState();
    if(!window.__arenaMonkFilter)return;

    box.querySelectorAll('.shop-item').forEach(card=>{
      const name=card.querySelector('.shop-info strong')?.textContent?.trim()||'';
      const item=typeof SHOP_ITEMS!=='undefined'?SHOP_ITEMS.find(x=>x.name===name):null;
      card.style.display=item?.vocation==='Monk'?'':'none';
    });
  }

  function install(){
    ensureItems();
    if(typeof window.shopRender!=='function'||window.__arenaMonkShopWrapped)return;
    const base=window.shopRender;
    window.__arenaMonkShopWrapped=true;
    window.shopRender=function(){
      ensureItems();
      base();
      addMonkButton();
      applyMonkFilter();
    };
    if(typeof shopRender!=='undefined')shopRender=window.shopRender;
    window.shopRender();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);
  else install();
  window.addEventListener('load',install);
})();

// Arsenal Monk da Arena: 8 armas, todas de 2 mãos.
(()=>{
  if(typeof SHOP_ITEMS==='undefined')return;

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

  MONK_WEAPONS.forEach(item=>{
    const existing=SHOP_ITEMS.find(x=>x.id===item.id);
    if(existing)Object.assign(existing,item);
    else SHOP_ITEMS.push(item);
  });

  if(typeof shopRender==='function')shopRender();
})();

(()=>{
  // Correção isolada das armas do Knight: exatamente 6 de 1 mão + 6 de 2 mãos.
  const KNIGHT_WEAPONS=[
    {id:'fire-sword',name:'Fire Sword',icon:'🔥',category:'weapons',vocation:'Knight',class:'Knight',hands:1,price:320,attack:12,defense:0,minLevel:3,bonus:'+12 ataque · 1 mão · Knight'},
    {id:'spike-sword',name:'Spike Sword',icon:'⚔️',category:'weapons',vocation:'Knight',class:'Knight',hands:1,price:480,attack:15,defense:0,minLevel:6,bonus:'+15 ataque · 1 mão · Knight'},
    {id:'dragon-lance',name:'Dragon Lance',icon:'🗡️',category:'weapons',vocation:'Knight',class:'Knight',hands:1,price:700,attack:19,defense:0,minLevel:10,bonus:'+19 ataque · 1 mão · Knight'},
    {id:'heroic-axe',name:'Heroic Axe',icon:'🪓',category:'weapons',vocation:'Knight',class:'Knight',hands:1,price:980,attack:24,defense:0,minLevel:14,bonus:'+24 ataque · 1 mão · Knight'},
    {id:'avenger',name:'Avenger',icon:'⚔️',category:'weapons',vocation:'Knight',class:'Knight',hands:1,price:1450,attack:31,defense:0,minLevel:20,bonus:'+31 ataque · 1 mão · Knight'},
    {id:'knight-club',name:'Knight Club',icon:'🔨',category:'weapons',vocation:'Knight',class:'Knight',hands:1,price:1900,attack:36,defense:0,minLevel:26,bonus:'+36 ataque · 1 mão · Knight'},
    {id:'demon-wing-axe',name:'Demonwing Axe',icon:'🪓',category:'weapons',vocation:'Knight',class:'Knight',hands:2,price:1100,attack:29,defense:0,minLevel:12,bonus:'+29 ataque · 2 mãos · -8 defesa'},
    {id:'demon-blade',name:'Demon Blade',icon:'⚔️',category:'weapons',vocation:'Knight',class:'Knight',hands:2,price:1550,attack:35,defense:0,minLevel:18,bonus:'+35 ataque · 2 mãos · -8 defesa'},
    {id:'arcanum-edge',name:'Arcanum Edge',icon:'✨',category:'weapons',vocation:'Knight',class:'Knight',hands:2,price:2200,attack:43,defense:0,minLevel:25,bonus:'+43 ataque · 2 mãos · -8 defesa'},
    {id:'knight-sword',name:'Knight Sword',icon:'⚔️',category:'weapons',vocation:'Knight',class:'Knight',hands:2,price:2900,attack:50,defense:0,minLevel:32,bonus:'+50 ataque · 2 mãos · -8 defesa'},
    {id:'knight-axe',name:'Knight Axe',icon:'🪓',category:'weapons',vocation:'Knight',class:'Knight',hands:2,price:3800,attack:58,defense:0,minLevel:40,bonus:'+58 ataque · 2 mãos · -8 defesa'},
    {id:'knight-demon',name:'Demon Crusher',icon:'💀',category:'weapons',vocation:'Knight',class:'Knight',hands:2,price:5200,attack:68,defense:0,minLevel:50,bonus:'+68 ataque · 2 mãos · -8 defesa'}
  ];
  const IDS=new Set(KNIGHT_WEAPONS.map(x=>x.id));

  function apply(){
    if(typeof SHOP_ITEMS==='undefined')return;

    // Remove somente armas Knight que não pertencem às 12 escolhidas.
    for(let i=SHOP_ITEMS.length-1;i>=0;i--){
      const item=SHOP_ITEMS[i];
      if(item.category==='weapons' && item.vocation==='Knight' && !IDS.has(item.id))SHOP_ITEMS.splice(i,1);
    }

    KNIGHT_WEAPONS.forEach(item=>{
      const old=SHOP_ITEMS.find(x=>x.id===item.id);
      if(old)Object.assign(old,item);
      else SHOP_ITEMS.push({...item});
    });

    if(typeof shopRender==='function')shopRender();
  }

  apply();
})();

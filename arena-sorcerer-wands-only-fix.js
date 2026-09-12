(()=>{
  // Correção isolada das Wands do Sorcerer: exatamente 14 armas.
  const SORCERER_WANDS=[
    {id:'wand-of-vortex',name:'Wand of Vortex',icon:'🪄',category:'wands',vocation:'Sorcerer',class:'Sorcerer',hands:1,price:180,attack:10,minLevel:1,bonus:'+10 ataque · Sorcerer'},
    {id:'wand-of-dragonbreath',name:'Wand of Dragonbreath',icon:'🐉',category:'wands',vocation:'Sorcerer',class:'Sorcerer',hands:1,price:320,attack:14,minLevel:7,bonus:'+14 ataque · Sorcerer'},
    {id:'wand-of-plague',name:'Wand of Plague',icon:'☠️',category:'wands',vocation:'Sorcerer',class:'Sorcerer',hands:1,price:520,attack:18,minLevel:19,bonus:'+18 ataque · Sorcerer'},
    {id:'wand-of-cosmic-energy',name:'Wand of Cosmic Energy',icon:'✨',category:'wands',vocation:'Sorcerer',class:'Sorcerer',hands:1,price:760,attack:23,minLevel:26,bonus:'+23 ataque · Sorcerer'},
    {id:'wand-of-inferno',name:'Wand of Inferno',icon:'🔥',category:'wands',vocation:'Sorcerer',class:'Sorcerer',hands:1,price:980,attack:27,minLevel:33,bonus:'+27 ataque · Sorcerer'},
    {id:'wand-of-everblazing',name:'Wand of Everblazing',icon:'🔥',category:'wands',vocation:'Sorcerer',class:'Sorcerer',hands:1,price:1250,attack:31,minLevel:37,bonus:'+31 ataque · Sorcerer'},
    {id:'wand-of-destruction',name:'Wand of Destruction',icon:'💥',category:'wands',vocation:'Sorcerer',class:'Sorcerer',hands:1,price:1600,attack:36,minLevel:45,bonus:'+36 ataque · Sorcerer'},
    {id:'wand-of-defiance',name:'Wand of Defiance',icon:'⚡',category:'wands',vocation:'Sorcerer',class:'Sorcerer',hands:1,price:1950,attack:40,minLevel:60,bonus:'+40 ataque · Sorcerer'},
    {id:'wand-of-starfall',name:'Wand of Starfall',icon:'🌠',category:'wands',vocation:'Sorcerer',class:'Sorcerer',hands:1,price:2300,attack:44,minLevel:70,bonus:'+44 ataque · Sorcerer'},
    {id:'wand-of-abyss',name:'Wand of the Abyss',icon:'🌑',category:'wands',vocation:'Sorcerer',class:'Sorcerer',hands:1,price:2700,attack:48,minLevel:80,bonus:'+48 ataque · Sorcerer'},
    {id:'arcanist-wand',name:'Arcanist Wand',icon:'🔮',category:'wands',vocation:'Sorcerer',class:'Sorcerer',hands:1,price:3150,attack:52,minLevel:90,bonus:'+52 ataque · Sorcerer'},
    {id:'infernal-wand',name:'Infernal Wand',icon:'🔥',category:'wands',vocation:'Sorcerer',class:'Sorcerer',hands:1,price:3600,attack:56,minLevel:100,bonus:'+56 ataque · Sorcerer'},
    {id:'void-wand',name:'Void Wand',icon:'🌀',category:'wands',vocation:'Sorcerer',class:'Sorcerer',hands:1,price:4100,attack:60,minLevel:110,bonus:'+60 ataque · Sorcerer'},
    {id:'eldritch-wand',name:'Eldritch Wand',icon:'👁️',category:'wands',vocation:'Sorcerer',class:'Sorcerer',hands:1,price:5400,attack:68,minLevel:130,bonus:'+68 ataque · Sorcerer'}
  ];
  const IDS=new Set(SORCERER_WANDS.map(x=>x.id));

  function apply(){
    if(typeof SHOP_ITEMS==='undefined')return;
    for(let i=SHOP_ITEMS.length-1;i>=0;i--){
      const item=SHOP_ITEMS[i];
      if(item.category==='wands' && item.vocation==='Sorcerer' && !IDS.has(item.id))SHOP_ITEMS.splice(i,1);
    }
    SORCERER_WANDS.forEach(item=>{
      const old=SHOP_ITEMS.find(x=>x.id===item.id);
      if(old)Object.assign(old,item);
      else SHOP_ITEMS.push({...item});
    });
    if(typeof shopRender==='function')shopRender();
  }
  apply();
})();

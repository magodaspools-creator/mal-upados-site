(()=>{
  if(typeof SHOP_ITEMS==='undefined')return;

  const LEGACY_WAND_IDS=new Set([
    'sorcerer-wand','sorcerer-destruction','sorcerer-supreme','sorcerer-abyss',
    'druid-rod','druid-rod-destruction','druid-supreme','druid-abyss'
  ]);
  for(let i=SHOP_ITEMS.length-1;i>=0;i--){
    if(LEGACY_WAND_IDS.has(SHOP_ITEMS[i].id))SHOP_ITEMS.splice(i,1);
  }

  const ATK_VALUES=[8,20,24,29,35,43,51,59,68];
  const rods=SHOP_ITEMS.filter(x=>x.category==='rods').slice().sort((a,b)=>(a.attack||0)-(b.attack||0));
  const wands=SHOP_ITEMS.filter(x=>x.category==='wands').slice().sort((a,b)=>(a.attack||0)-(b.attack||0));
  rods.forEach((rod,i)=>{if(ATK_VALUES[i]!==undefined)rod.attack=ATK_VALUES[i];});
  wands.forEach((wand,i)=>{if(ATK_VALUES[i]!==undefined)wand.attack=ATK_VALUES[i];});

  const VOCATIONS=new Set(['Knight','Paladin','Sorcerer','Druid']);
  SHOP_ITEMS.forEach(item=>{
    if(!item||!Number(item.attack))return;
    if(item.category==='weapons'&&!VOCATIONS.has(item.class)){
      item.class='Knight';
      item.bonus=`+${item.attack} ataque · Knight`;
    }
    if((item.category==='wands'||item.category==='rods')&&!VOCATIONS.has(item.class)){
      const name=String(item.name||'').toLowerCase();
      item.class=(item.category==='rods'||name.includes('rod'))?'Druid':'Sorcerer';
      item.bonus=`+${item.attack} ataque · ${item.class}`;
    }
  });

  let soul=SHOP_ITEMS.find(x=>x.id==='soulhexer');
  if(!soul){
    soul={id:'soulhexer',name:'Soulhexer',icon:'🪄',category:'wands',class:'Sorcerer',price:5000,attack:68,defense:0,minLevel:40,bonus:'+68 ataque · Sorcerer'};
    SHOP_ITEMS.push(soul);
  }else{
    Object.assign(soul,{category:'wands',class:'Sorcerer',price:5000,attack:68,defense:0,minLevel:40,bonus:'+68 ataque · Sorcerer'});
  }

  function vocation(){
    const member=(typeof members!=='undefined'&&Array.isArray(members))?members.find(m=>m.name===game?.character):null;
    return member?.vocation||'';
  }

  // Apenas limpa uma arma incompatível que já esteja equipada.
  // A loja continua exibindo todos os itens; a restrição de equipar/comprar
  // será tratada separadamente para não apagar categorias inteiras da loja.
  function sanitize(){
    if(typeof game==='undefined'||!game||!game.shopEquipped)return;
    const v=vocation(),id=game.shopEquipped.weapon,item=SHOP_ITEMS.find(x=>x.id===id);
    if(v&&item?.class&&item.class!==v)game.shopEquipped.weapon=null;
  }

  sanitize();
  if(typeof shopRender==='function')shopRender();
})();

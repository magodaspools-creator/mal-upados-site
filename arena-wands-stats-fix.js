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

  const wandIndexes=[];
  SHOP_ITEMS.forEach((item,i)=>{if(item.category==='wands')wandIndexes.push(i);});
  const sortedWands=SHOP_ITEMS.filter(x=>x.category==='wands').sort((a,b)=>(a.attack||0)-(b.attack||0));
  wandIndexes.forEach((idx,i)=>{if(sortedWands[i])SHOP_ITEMS[idx]=sortedWands[i];});

  const VOCATIONS=new Set(['Knight','Paladin','Sorcerer','Druid']);
  SHOP_ITEMS.forEach(item=>{
    if(!item||!Number(item.attack))return;
    if(item.category==='weapons'&&!VOCATIONS.has(item.class)){
      item.class='Knight';
      item.bonus=`+${item.attack} ataque · Knight`;
    }
    if(item.category==='wands'&&!VOCATIONS.has(item.class)){
      const name=String(item.name||'').toLowerCase();
      item.class=name.includes('rod')?'Druid':'Sorcerer';
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
  function sanitize(){
    if(typeof game==='undefined'||!game||!game.shopEquipped)return;
    const v=vocation(),id=game.shopEquipped.weapon,item=SHOP_ITEMS.find(x=>x.id===id);
    if(v&&item?.class&&item.class!==v)game.shopEquipped.weapon=null;
  }

  // O sistema anterior já ignora o ATK de uma arma incompatível; aqui também
  // impedimos que ela seja exibida na loja da vocação atual.
  if(typeof shopRender==='function'){
    const original=shopRender;
    window.shopRender=function(){
      sanitize();
      const v=vocation(),snapshot=SHOP_ITEMS.slice();
      if(v){
        for(let i=SHOP_ITEMS.length-1;i>=0;i--){
          const item=SHOP_ITEMS[i];
          if(item.attack>0&&item.class&&item.class!==v&&(item.category==='weapons'||item.category==='wands'))SHOP_ITEMS.splice(i,1);
        }
      }
      original();
      SHOP_ITEMS.splice(0,SHOP_ITEMS.length,...snapshot);
    };
  }

  if(typeof shopRender==='function')shopRender();
})();

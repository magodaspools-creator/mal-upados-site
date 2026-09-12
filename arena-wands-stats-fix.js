(()=>{
  if(typeof SHOP_ITEMS==='undefined')return;

  // Armas antigas que usavam category='wands' mas nao fazem parte do arsenal atual.
  const LEGACY_WAND_IDS=new Set([
    'sorcerer-wand',
    'sorcerer-destruction',
    'sorcerer-supreme',
    'sorcerer-abyss',
    'druid-rod',
    'druid-rod-destruction',
    'druid-supreme',
    'druid-abyss'
  ]);

  for(let i=SHOP_ITEMS.length-1;i>=0;i--){
    if(LEGACY_WAND_IDS.has(SHOP_ITEMS[i].id))SHOP_ITEMS.splice(i,1);
  }

  const ATK_VALUES=[8,20,24,29,35,43,51,59,68];

  const rods=SHOP_ITEMS
    .filter(x=>x.category==='rods')
    .slice()
    .sort((a,b)=>(a.attack||0)-(b.attack||0));

  const wands=SHOP_ITEMS
    .filter(x=>x.category==='wands')
    .slice()
    .sort((a,b)=>(a.attack||0)-(b.attack||0));

  // Define exatamente a progressao de ATK solicitada para Rods e Wands.
  rods.forEach((rod,i)=>{
    if(ATK_VALUES[i]===undefined)return;
    rod.attack=ATK_VALUES[i];
  });

  wands.forEach((wand,i)=>{
    if(ATK_VALUES[i]===undefined)return;
    wand.attack=ATK_VALUES[i];
    wand.bonus=`+${ATK_VALUES[i]} ataque · Sorcerer`;
  });

  // Reordena apenas as posicoes ocupadas por Wands, preservando Rings,
  // Rods e todos os demais itens exatamente onde estavam.
  const wandIndexes=[];
  SHOP_ITEMS.forEach((item,i)=>{
    if(item.category==='wands')wandIndexes.push(i);
  });

  const sortedWands=SHOP_ITEMS
    .filter(x=>x.category==='wands')
    .sort((a,b)=>(a.attack||0)-(b.attack||0));

  wandIndexes.forEach((idx,i)=>{
    if(sortedWands[i])SHOP_ITEMS[idx]=sortedWands[i];
  });

  if(typeof shopRender==='function')shopRender();
})();

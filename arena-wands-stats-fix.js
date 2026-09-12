(()=>{
  if(typeof SHOP_ITEMS==='undefined')return;

  // Existem armas antigas em arena-weapons-fix.js que usam category='wands'
  // e duplicam Wands atuais ou classificam Rods como Wands. Elas não fazem
  // parte do arsenal atual do Sorcerer.
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

  const rods=SHOP_ITEMS
    .filter(x=>x.category==='rods')
    .slice()
    .sort((a,b)=>(b.attack||0)-(a.attack||0));

  const wands=SHOP_ITEMS
    .filter(x=>x.category==='wands')
    .slice()
    .sort((a,b)=>(b.attack||0)-(a.attack||0));

  // Mantém exatamente as Wands atuais. Apenas copia os status dos Rods por
  // posição e ordena as Wands da maior para a menor força de ataque.
  wands.forEach((wand,i)=>{
    const rod=rods[i];
    if(!rod)return;
    wand.attack=rod.attack;
    wand.defense=rod.defense;
    wand.price=rod.price;
    wand.minLevel=rod.minLevel;
    wand.bonus=`+${rod.attack} ataque${rod.defense?` · +${rod.defense} defesa`:''} · Sorcerer`;
  });

  const sortedWands=SHOP_ITEMS
    .filter(x=>x.category==='wands')
    .sort((a,b)=>(b.attack||0)-(a.attack||0));
  const first=SHOP_ITEMS.findIndex(x=>x.category==='wands');
  if(first>=0){
    SHOP_ITEMS.splice(first,sortedWands.length,...sortedWands);
  }

  if(typeof shopRender==='function')shopRender();
})();

(()=>{
  if(typeof SHOP_ITEMS==='undefined')return;

  const rods=SHOP_ITEMS
    .filter(x=>x.category==='rods')
    .slice()
    .sort((a,b)=>(b.attack||0)-(a.attack||0));

  const wands=SHOP_ITEMS
    .filter(x=>x.category==='wands')
    .slice()
    .sort((a,b)=>(b.attack||0)-(a.attack||0));

  // Mantém exatamente os mesmos wands existentes.
  // Apenas copia os status dos Rods por posição e ordena do maior ATK para o menor.
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

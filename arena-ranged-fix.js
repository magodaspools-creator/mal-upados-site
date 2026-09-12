// Ajustes finais da loja da Arena: quantidade exata de armas e categorias separadas.
(()=>{
  const KNIGHT_ALLOWED=new Set([
    'fire-sword','spike-sword','dragon-lance','heroic-axe','avenger','knight-club',
    'demon-wing-axe','demon-blade','arcanum-edge','knight-sword','knight-axe','knight-demon'
  ]);

  const WAND_ALLOWED=new Set([
    'wand-of-inferno','wand-of-everblazing','wand-of-destruction','wand-of-defiance',
    'wand-of-vortex','wand-of-starfall','wand-of-abyss','arcanist-wand',
    'infernal-wand','void-wand','archmage-wand'
  ]);

  const ROD_ALLOWED=new Set([
    'snakebite-rod','moonlight-rod','necrotic-rod','terra-rod','underworld-rod',
    'hailstorm-rod','shrub-rod','caduceus-rod','mystic-rod','nature-rod','elder-rod'
  ]);

  if(typeof SHOP_CATEGORIES!=='undefined'){
    if(!SHOP_CATEGORIES.some(x=>x.id==='wands'))SHOP_CATEGORIES.push({id:'wands',label:'Wands'});
    if(!SHOP_CATEGORIES.some(x=>x.id==='rods'))SHOP_CATEGORIES.push({id:'rods',label:'Rods'});
  }

  if(typeof SHOP_ITEMS!=='undefined'){
    // Remove armas antigas/extras do Knight: ficam exatamente 6 de 1 mão + 6 de 2 mãos.
    for(let i=SHOP_ITEMS.length-1;i>=0;i--){
      const item=SHOP_ITEMS[i];
      if(item.category==='weapons'&&item.vocation==='Knight'&&!KNIGHT_ALLOWED.has(item.id))SHOP_ITEMS.splice(i,1);
      else if(item.category==='wands'&&!WAND_ALLOWED.has(item.id))SHOP_ITEMS.splice(i,1);
      else if(item.category==='rods'&&!ROD_ALLOWED.has(item.id))SHOP_ITEMS.splice(i,1);
    }

    // Garante a classificação exclusiva.
    SHOP_ITEMS.forEach(item=>{
      if(item.category==='wands')item.vocation='Sorcerer';
      if(item.category==='rods')item.vocation='Druid';
    });
  }

  let rangedFilter='all';

  function renderRangedFilters(){
    const filters=document.getElementById('shopFilters');
    if(!filters)return;
    const category=typeof shopFilter!=='undefined'?shopFilter:'all';
    let old=filters.querySelector('.ranged-subfilters');
    if(old)old.remove();
    if(category!=='wands'&&category!=='rods')return;

    const wrap=document.createElement('div');
    wrap.className='ranged-subfilters';
    const vocation=category==='wands'?'Sorcerer':'Druid';
    const label=category==='wands'?'Wands':'Rods';
    wrap.innerHTML=`<span class="weapon-subfilter-label">${label}</span><span class="weapon-subfilter-label">Exclusivo: ${vocation}</span>`;
    filters.appendChild(wrap);
  }

  if(typeof shopRender==='function'&&!window.__arenaRangedFixWrapped){
    const baseRender=shopRender;
    window.__arenaRangedFixWrapped=true;
    window.shopRender=function(){
      baseRender();
      renderRangedFilters();
    };
    shopRender=window.shopRender;
  }

  if(typeof shopRender==='function')shopRender();
})();

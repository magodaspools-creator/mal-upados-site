// Componentes visuais narrativos globais da Arena — Fase 2.
(()=> {
  const root=document;
  const sigil=(label='☀')=>{const el=root.createElement('span');el.className='arena-lore-sigil';el.setAttribute('aria-hidden','true');el.textContent=label;return el;};
  const fragment=(count=1)=>{const el=root.createElement('span');el.className='arena-lore-fragment';el.textContent='Fragmentos '+Math.max(0,Number(count)||0);return el;};
  const corruption=(label='Sinal corrompido')=>{const el=root.createElement('span');el.className='arena-lore-corruption';el.textContent=label;return el;};
  const kaelenMark=()=>{const el=root.createElement('span');el.className='arena-kaelen-mark';const inner=root.createElement('span');inner.textContent='K';el.appendChild(inner);return el;};
  window.ArenaLoreVisuals={sigil,fragment,corruption,kaelenMark};
})();
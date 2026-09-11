// Sprites isoladas dos amuletos da Arena.
// Não altera compra, equipamento ou combate.
(()=>{
  function sprite(name){
    const n=String(name||'').toLowerCase();
    if(!n||n==='nenhum'||n==='nenhuma'){
      return `<svg class="arena-item-sprite arena-empty-sprite" viewBox="0 0 24 24" aria-hidden="true" shape-rendering="crispEdges"><path d="M8 7l4 4 4-4M8 17l4-4 4 4" fill="none" stroke="#4b4f55" stroke-width="1.5"/><circle cx="12" cy="12" r="2" fill="#25282d" stroke="#5a5e65"/></svg>`;
    }
    if(n.includes('earthguard')){
      return `<svg class="arena-item-sprite" viewBox="0 0 24 24" aria-hidden="true" shape-rendering="crispEdges"><path fill="#27301f" d="M12 3l7 5-2 9-5 4-5-4-2-9z"/><path fill="#6f9252" d="M12 5l5 4-2 6-3 3-3-3-2-6z"/><path fill="#b5cf7e" d="M10 8h4v3h-4zM8 12h8v2H8z"/><path stroke="#d5e3a1" stroke-width="1.5" d="M12 3v17"/></svg>`;
    }
    if(n.includes('fireheart')){
      return `<svg class="arena-item-sprite" viewBox="0 0 24 24" aria-hidden="true" shape-rendering="crispEdges"><path fill="#351a14" d="M12 3l7 7-2 8-5 3-5-3-2-8z"/><path fill="#b84e2e" d="M12 5l5 5-2 6-3 2-3-2-2-6z"/><path fill="#f0a45e" d="M12 7l3 4-3 5-3-5z"/><path fill="#ffe3a8" d="M11 9h2v4h-2z"/></svg>`;
    }
    if(n.includes('energy')){
      return `<svg class="arena-item-sprite" viewBox="0 0 24 24" aria-hidden="true" shape-rendering="crispEdges"><path fill="#18243a" d="M12 2l8 6-3 11-5 3-5-3L4 8z"/><path fill="#6e91d9" d="M12 4l5 5-2 8-3 2-3-2-2-8z"/><path fill="#cfe4ff" d="M13 5l-3 7h3l-2 7 5-9h-3z"/><rect x="10" y="3" width="4" height="2" fill="#e7f1ff"/></svg>`;
    }
    if(n.includes('frost')){
      return `<svg class="arena-item-sprite" viewBox="0 0 24 24" aria-hidden="true" shape-rendering="crispEdges"><path fill="#18303a" d="M12 2l7 6-2 10-5 4-5-4L5 8z"/><path fill="#67b8d4" d="M12 4l5 5-2 7-3 3-3-3-2-7z"/><path stroke="#d5f4ff" stroke-width="1.4" d="M12 5v14M7 9l10 6M17 9L7 15"/><circle cx="12" cy="12" r="2" fill="#e5fbff"/></svg>`;
    }
    if(n.includes('death')){
      return `<svg class="arena-item-sprite" viewBox="0 0 24 24" aria-hidden="true" shape-rendering="crispEdges"><path fill="#211c2b" d="M12 2l8 7-3 10-5 3-5-3L4 9z"/><path fill="#725a8b" d="M12 4l5 5-2 7-3 3-3-3-2-7z"/><path fill="#d2c2e3" d="M8 10h3v2H8zM13 10h3v2h-3zM10 14h4v2h-4z"/><path fill="#9f8bc4" d="M11 4h2v14h-2z"/></svg>`;
    }
    return null;
  }

  function apply(){
    document.querySelectorAll('.arena-equipment-slot.slot-amulet').forEach(slot=>{
      const name=slot.querySelector('strong')?.textContent||'';
      const icon=slot.querySelector('.arena-item-icon');
      const custom=sprite(name);
      if(icon&&custom&&icon.dataset.amuletSprite!==name){
        icon.innerHTML=custom;
        icon.dataset.amuletSprite=name;
      }
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply);else apply();
  setInterval(apply,400);
})();

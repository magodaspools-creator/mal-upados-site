// Controle de ordenação do Guia de Hunts.
// Mantém os dados/filtros existentes e remove a antiga janela fixa de 50 levels do Solo.
(function(){
  function getOrder(){
    return document.getElementById('huntOrder')?.value || 'desc';
  }

  // Substitui apenas a regra de faixa de level do Solo:
  // agora entram todas as hunts cujo level mínimo seja <= ao level informado.
  window.huntCurrentRows = function(mode, voc, level, search){
    const source = mode==='duo' ? huntDuoSource : mode==='team' ? huntTeamSource : (huntSource[voc] || []);
    return source.filter(h=>{
      const levelOk = mode==='solo' ? h.min >= 8 && h.min <= level : h.min >= level;
      return levelOk && (!search || String(h.n).toLowerCase().includes(search) || String(h.style||'').toLowerCase().includes(search));
    });
  };

  // O render original continua responsável por cards, destaques, stats e filtros.
  // Depois dele, apenas reorganizamos a lista principal pelo level mínimo.
  const originalRender = window.guiaRender;
  window.guiaRender = function(){
    originalRender();
    const list = document.querySelector('#huntResult .hunt-list');
    if(!list) return;
    const cards = [...list.children];
    cards.sort((a,b)=>{
      const am = Number((a.querySelector('.hunt-meta')?.textContent.match(/Level\s+(\d+)/i)||[])[1] || 0);
      const bm = Number((b.querySelector('.hunt-meta')?.textContent.match(/Level\s+(\d+)/i)||[])[1] || 0);
      return getOrder()==='asc' ? am-bm : bm-am;
    });
    cards.forEach(card=>list.appendChild(card));
    cards.forEach((card,i)=>{
      const pos=card.querySelector('.hunt-position');
      if(pos) pos.textContent=i+1;
    });
  };

  function setup(){
    const form=document.querySelector('.hunt-guide-form');
    const level=document.getElementById('huntLevel');
    if(!form || !level || document.getElementById('huntOrder')) return;

    const label=document.createElement('label');
    label.innerHTML='<span>Ordem</span><select id="huntOrder"><option value="desc">Maior level → menor</option><option value="asc">Menor level → maior</option></select>';
    level.closest('label')?.insertAdjacentElement('afterend',label);

    document.getElementById('huntOrder').addEventListener('change', window.guiaRender);

    const style=document.createElement('style');
    style.textContent='.hunt-guide-form{grid-template-columns:repeat(5,1fr)}@media(max-width:800px){.hunt-form,.hunt-guide-form{grid-template-columns:repeat(2,1fr)}}@media(max-width:520px){.hunt-form,.hunt-guide-form{grid-template-columns:1fr}}';
    document.head.appendChild(style);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',setup);
  else setup();
})();

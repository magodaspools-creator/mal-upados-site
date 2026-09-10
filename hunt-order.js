// Controle de ordenação do Guia de Hunts.
// Mantém os dados/filtros existentes e remove a antiga janela fixa de 50 levels do Solo.
(function(){
  function getOrder(){
    return document.getElementById('huntOrder')?.value || 'desc';
  }

  window.huntCurrentRows = function(mode, voc, level, search){
    const source = mode==='duo' ? huntDuoSource : mode==='team' ? huntTeamSource : (huntSource[voc] || []);
    return source.filter(h=>{
      const levelOk = mode==='solo' ? h.min >= 8 && h.min <= level : h.min >= level;
      return levelOk && (!search || String(h.n).toLowerCase().includes(search) || String(h.style||'').toLowerCase().includes(search));
    });
  };

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
    if(!form || !level) return;

    let order=document.getElementById('huntOrder');
    if(!order){
      const label=document.createElement('label');
      label.id='huntOrderWrap';
      label.innerHTML='<span>Ordem</span><select id="huntOrder"><option value="desc">Maior level → menor</option><option value="asc">Menor level → maior</option></select>';
      document.querySelector('#huntResult')?.parentNode?.insertBefore(label, document.querySelector('#huntResult'));
      order=document.getElementById('huntOrder');
    }else{
      // A ordenação fica fora da grade de filtros, perto da lista de hunts.
      const wrap=order.closest('label');
      const result=document.getElementById('huntResult');
      if(wrap && result && wrap.parentNode===form){
        result.parentNode.insertBefore(wrap, result);
      }
    }

    order.addEventListener('change', window.guiaRender);

    // Level: somente números, mínimo efetivo 8. Campo vazio usa 8.
    level.addEventListener('keydown', e=>{
      if(['e','E','+','-','.'].includes(e.key)) e.preventDefault();
    });
    level.addEventListener('blur', ()=>{
      const raw=level.value.trim();
      if(!raw){ level.value=''; window.guiaRender(); return; }
      const n=Number(raw);
      if(!Number.isFinite(n) || n<8){
        level.value='8';
      }else{
        level.value=String(Math.floor(n));
      }
      window.guiaRender();
    });

    const style=document.createElement('style');
    style.textContent='.hunt-guide-form{grid-template-columns:repeat(5,1fr)}#huntOrderWrap{display:flex;align-items:center;gap:10px;margin:18px 0 10px;max-width:360px}#huntOrderWrap span{font-weight:700;white-space:nowrap}@media(max-width:1000px){.hunt-form,.hunt-guide-form{grid-template-columns:repeat(3,1fr)}}@media(max-width:800px){.hunt-form,.hunt-guide-form{grid-template-columns:repeat(2,1fr)}}@media(max-width:520px){.hunt-form,.hunt-guide-form{grid-template-columns:1fr}#huntOrderWrap{max-width:none;margin:14px 0 10px;display:grid;grid-template-columns:1fr;gap:6px}}#huntLevel{appearance:textfield;-moz-appearance:textfield}#huntLevel::-webkit-inner-spin-button,#huntLevel::-webkit-outer-spin-button{-webkit-appearance:none;margin:0}';
    document.head.appendChild(style);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',setup);
  else setup();
})();

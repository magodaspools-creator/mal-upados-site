// Componentes visuais narrativos globais da Arena — Fase 2.
(()=> {
  const root=document;
  const sigil=(label='☀')=>{const el=root.createElement('span');el.className='arena-lore-sigil';el.setAttribute('aria-hidden','true');el.textContent=label;return el;};
  const fragment=(count=1)=>{const el=root.createElement('span');el.className='arena-lore-fragment';el.textContent='Fragmentos '+Math.max(0,Number(count)||0);return el;};
  const corruption=(label='Sinal corrompido')=>{const el=root.createElement('span');el.className='arena-lore-corruption';el.textContent=label;return el;};
  const kaelenMark=()=>{const el=root.createElement('span');el.className='arena-kaelen-mark';const inner=root.createElement('span');inner.textContent='K';el.appendChild(inner);return el;};
  const chapterNames=['Floresta Sombria','Acampamento Orc','Deserto Perdido','Covil dos Dragões','Abismo Demoníaco'];
  function renderFragmentProgress(){
    const panel=root.querySelector('.adventure-panel'), n=window.ArenaNarrative;
    if(!panel||!n)return;
    let el=panel.querySelector('#arena-fragments-progress');
    if(!el){
      el=root.createElement('div');
      el.id='arena-fragments-progress';
      el.className='arena-fragments-progress';
      el.setAttribute('aria-label','Fragmentos de memória');
      panel.appendChild(el);
    }
    const count=Math.min(4,Math.max(0,Number(n.state?.fragments)||0));
    el.innerHTML='<span class="arena-fragments-label">MEMÓRIA</span><span class="arena-fragments-count">'+count+' / 4</span><span class="arena-fragments-pips">'+[0,1,2,3].map(i=>'<i class="'+(i<count?'filled':'')+'" aria-hidden="true"></i>').join('')+'</span>';
    el.classList.toggle('complete',count>=4);
  }
  function pulseFragmentProgress(){
    const el=root.querySelector('#arena-fragments-progress');
    if(!el)return;
    renderFragmentProgress();
    el.classList.remove('fragment-earned');
    void el.offsetWidth;
    el.classList.add('fragment-earned');
    setTimeout(()=>el.classList.remove('fragment-earned'),760);
  }
  root.addEventListener('arena:fragment-earned',pulseFragmentProgress);
  let transitionTimer=null;
  function chapterTransition(to,from=null){
    const panel=root.querySelector('.adventure-panel');
    if(!panel||Number(to)===Number(from))return;
    root.querySelector('.arena-chapter-transition')?.remove();
    const overlay=root.createElement('div');
    overlay.className='arena-chapter-transition';
    overlay.setAttribute('aria-hidden','true');
    const chapter=chapterNames[Number(to)]||'Nova área';
    overlay.innerHTML='<span class="arena-chapter-transition-kicker">CAPÍTULO '+String(Number(to)+1).padStart(2,'0')+'</span><strong>'+chapter+'</strong>';
    panel.appendChild(overlay);
    panel.classList.remove('arena-chapter-changing');
    void panel.offsetWidth;
    panel.classList.add('arena-chapter-changing');
    clearTimeout(transitionTimer);
    transitionTimer=setTimeout(()=>{
      panel.classList.remove('arena-chapter-changing');
      overlay.classList.add('is-leaving');
      setTimeout(()=>overlay.remove(),420);
    },620);
  }
  window.ArenaLoreVisuals={sigil,fragment,corruption,kaelenMark,chapterTransition};
})();
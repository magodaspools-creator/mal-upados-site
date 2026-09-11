// Calculadora de Shared Experience do Tibia.
// Regra oficial: o menor level da party não pode ter menos de 2/3 do maior level.
(function(){
  function calc(){
    const input=document.getElementById('shareXpLevel');
    const result=document.getElementById('shareXpResult');
    if(!input||!result) return;

    const level=Math.floor(Number(input.value));
    if(!Number.isFinite(level)||level<1){
      result.innerHTML='<div class="share-xp-empty">Digite seu level para calcular a faixa.</div>';
      return;
    }

    const min=Math.ceil(level*2/3);
    const max=Math.floor(level*3/2);

    result.innerHTML=`
      <div class="share-xp-answer">
        <div class="share-xp-range">
          <div><span>Level mínimo</span><strong>${min}</strong></div>
          <div class="share-xp-arrow">↔</div>
          <div><span>Level máximo</span><strong>${max}</strong></div>
        </div>
        <p><strong>Level ${level}</strong> pode compartilhar XP com personagens do <strong>level ${min} ao ${max}</strong>.</p>
      </div>`;
  }

  function setup(){
    const input=document.getElementById('shareXpLevel');
    if(!input) return;

    input.addEventListener('input',calc);
    input.addEventListener('keydown',e=>{
      if(['e','E','+','-','.'].includes(e.key)) e.preventDefault();
      if(e.key==='Enter') calc();
    });

    const style=document.createElement('style');
    style.textContent=`
      .share-xp-box{max-width:760px;margin:0 auto}
      .share-xp-form{display:flex;gap:14px;align-items:end;justify-content:center;flex-wrap:wrap}
      .share-xp-form label{display:flex;flex-direction:column;gap:7px;min-width:220px;color:var(--muted,#aaa);font-size:.82rem;font-weight:700}
      .share-xp-form input{width:100%;box-sizing:border-box;padding:13px 14px;border:1px solid rgba(240,196,92,.25);border-radius:10px;background:rgba(255,255,255,.04);color:inherit;font:inherit;font-size:1.05rem;outline:none}
      .share-xp-form input:focus{border-color:rgba(240,196,92,.7);box-shadow:0 0 0 3px rgba(240,196,92,.08)}
      .share-xp-result{margin-top:20px}
      .share-xp-answer{padding:22px;border:1px solid rgba(240,196,92,.2);border-radius:14px;background:linear-gradient(180deg,rgba(240,196,92,.08),rgba(255,255,255,.025));text-align:center}
      .share-xp-range{display:flex;justify-content:center;align-items:center;gap:22px;margin-bottom:15px}
      .share-xp-range div:not(.share-xp-arrow){display:flex;flex-direction:column;gap:4px}
      .share-xp-range span{font-size:.72rem;text-transform:uppercase;letter-spacing:1px;color:var(--muted,#aaa)}
      .share-xp-range strong{font-family:Cinzel,serif;font-size:2rem;color:var(--gold2,#f0c45c)}
      .share-xp-arrow{font-size:1.5rem;color:var(--muted,#aaa)}
      .share-xp-answer p{margin:0;color:var(--muted,#bbb);line-height:1.6}
      .share-xp-empty{padding:18px;text-align:center;color:var(--muted,#aaa)}
      @media(max-width:520px){.share-xp-form{display:block}.share-xp-form label{min-width:0}.share-xp-range{gap:12px}.share-xp-range strong{font-size:1.6rem}}
    `;
    document.head.appendChild(style);
    calc();
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',setup);
  else setup();
})();

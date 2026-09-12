// Tutorial do Bestiário — aparece uma única vez após a primeira vitória da criatura.
(()=>{
  if(window.__arenaBestiaryIntroInstalled)return;
  window.__arenaBestiaryIntroInstalled=true;

  const STORAGE='malupados_arena_v1';
  const currentChar=()=>{
    const a=document.getElementById('playerName')?.textContent?.trim();
    const b=document.getElementById('characterPickerName')?.textContent?.trim();
    const c=document.getElementById('characterSelect')?.value?.trim();
    if(a&&a!=='Carregando...')return a;
    if(b&&b!=='Escolher personagem')return b;
    if(c)return c;
    return game?.character||'default';
  };
  const seenKey=()=>`malupados_bestiary_intro_seen_${currentChar()}`;

  function hasFirstKill(){
    try{
      const all=JSON.parse(localStorage.getItem(STORAGE)||'{}');
      const g=all[currentChar()];
      const bestiary=g?.bestiary||{};
      return Object.values(bestiary).some(v=>Number(v?.kills||0)>0);
    }catch{return false}
  }

  function close(){
    document.getElementById('arenaBestiaryIntro')?.remove();
    document.body.classList.remove('bestiary-intro-open');
  }

  function open(){
    if(!game||localStorage.getItem(seenKey())||!hasFirstKill())return;

    localStorage.setItem(seenKey(),'1');
    const modal=document.createElement('div');
    modal.id='arenaBestiaryIntro';
    modal.className='bti-overlay';
    modal.innerHTML=`
      <div class="bti-backdrop"></div>
      <section class="bti-modal" role="dialog" aria-modal="true" aria-labelledby="btiTitle">
        <button class="bti-close" id="btiClose" aria-label="Fechar">×</button>
        <div class="bti-icon">📖</div>
        <small class="bti-kicker">NOVO SISTEMA DESBLOQUEADO</small>
        <h2 id="btiTitle">Você encontrou o Bestiário!</h2>
        <p class="bti-lead">Cada criatura derrotada deixa um registro permanente da sua jornada na Arena.</p>
        <div class="bti-info">
          <div><strong>⚔️ Derrote criaturas</strong><span>Cada vitória aumenta seu registro daquela criatura.</span></div>
          <div><strong>📊 Complete os registros</strong><span>Mate a mesma criatura várias vezes para preencher sua progressão.</span></div>
          <div><strong>🏆 Conquiste Platina</strong><span>Complete o registro de uma criatura e prove que você dominou aquela presa.</span></div>
        </div>
        <p class="bti-tip">Dica: abra o botão <strong>📖 Bestiário</strong> na Arena para acompanhar suas mortes por mapa.</p>
        <button class="btn active bti-action" id="btiOpenBestiary">ABRIR BESTIÁRIO</button>
      </section>`;
    document.body.appendChild(modal);
    document.body.classList.add('bestiary-intro-open');

    modal.querySelector('#btiClose').onclick=close;
    modal.querySelector('.bti-backdrop').onclick=close;
    modal.querySelector('#btiOpenBestiary').onclick=()=>{
      close();
      document.getElementById('arenaBestiaryButton')?.click();
    };
  }

  // Evento normal quando o Bestiário já estava carregado.
  window.addEventListener('arena:bestiary-kill',()=>setTimeout(open,100));

  // Segurança: se o script carregar depois da primeira morte, recupera o evento
  // olhando o registro salvo. Também cobre level-up no mesmo combate.
  const timer=setInterval(()=>{
    if(localStorage.getItem(seenKey())){clearInterval(timer);return;}
    if(hasFirstKill()){
      open();
      clearInterval(timer);
    }
  },300);
  setTimeout(()=>clearInterval(timer),20000);

  const style=document.createElement('style');
  style.textContent=`
    body.bestiary-intro-open{overflow:hidden}
    .bti-overlay{position:fixed;inset:0;z-index:100000;display:grid;place-items:center;padding:20px;box-sizing:border-box}
    .bti-backdrop{position:absolute;inset:0;background:rgba(0,0,0,.82);backdrop-filter:blur(4px)}
    .bti-modal{position:relative;z-index:1;width:min(520px,100%);box-sizing:border-box;padding:30px;border:1px solid #806d38;border-radius:16px;background:linear-gradient(180deg,#17191b,#0d0f10);color:#ddd;text-align:center;box-shadow:0 28px 100px rgba(0,0,0,.8)}
    .bti-close{position:absolute;right:14px;top:12px;width:36px;height:36px;border:1px solid #343638;border-radius:8px;background:#111315;color:#999;font-size:24px;cursor:pointer}
    .bti-icon{font-size:48px;margin-bottom:8px}
    .bti-kicker{color:#bda35c;font-size:.62rem;font-weight:900;letter-spacing:.16em}
    .bti-modal h2{margin:8px 0 10px;color:#f0e5c5;font-size:1.55rem}
    .bti-lead{margin:0 auto 20px;max-width:430px;color:#9a9fa5;line-height:1.55;font-size:.9rem}
    .bti-info{display:grid;gap:8px;text-align:left;margin:0 0 16px}
    .bti-info div{padding:11px 13px;background:#111315;border:1px solid #292c2f;border-radius:9px}
    .bti-info strong,.bti-info span{display:block}
    .bti-info strong{font-size:.78rem;color:#e2d3a5;margin-bottom:3px}
    .bti-info span{font-size:.68rem;color:#777d84;line-height:1.4}
    .bti-tip{padding:11px 13px;margin:0 0 18px;background:#211e16;border-left:3px solid #a89562;color:#a9a398;text-align:left;font-size:.7rem;line-height:1.45}
    .bti-action{width:100%;font-weight:900}
    @media(max-width:520px){.bti-modal{padding:25px 18px}.bti-modal h2{font-size:1.3rem}}
  `;
  document.head.appendChild(style);
})();

(()=>{
  if(window.__arenaBestiaryIntroInstalled)return;
  window.__arenaBestiaryIntroInstalled=true;

  const STORE='malupados_arena_v1';
  const currentChar=()=>String((typeof game!=='undefined'&&game?.character)||document.getElementById('characterPickerName')?.textContent||'').trim()||'default';
  const seenKey=()=>`malupados_bestiary_intro_seen_${currentChar()}`;
  const markSeen=()=>{try{localStorage.setItem(seenKey(),'1')}catch{}};
  const seen=()=>{try{return localStorage.getItem(seenKey())==='1'}catch{return false}};

  const close=(continueToSkill=false)=>{
    markSeen();
    document.getElementById('arenaBestiaryIntro')?.remove();
    document.body.classList.remove('bestiary-intro-open');
    if(continueToSkill)setTimeout(()=>window.dispatchEvent(new Event('arena:bestiary-intro-complete')),150);
  };

  const open=event=>{
    const detail=event?.detail||{};
    const name=String(detail.name||'').trim();
    if(!name||seen()||document.getElementById('arenaBestiaryIntro')||document.getElementById('skillTutorialModal'))return;
    if(detail.character&&detail.character!==currentChar())return;

    const modal=document.createElement('div');
    modal.id='arenaBestiaryIntro';
    modal.className='bti-overlay';
    modal.innerHTML=`<div class="bti-backdrop"></div><section class="bti-modal" role="dialog" aria-modal="true" aria-labelledby="btiTitle"><button class="bti-close" id="btiClose" aria-label="Fechar">×</button><div class="bti-icon">📖</div><small class="bti-kicker">NOVO SISTEMA DESBLOQUEADO</small><h2 id="btiTitle">Você encontrou o Bestiário!</h2><p class="bti-lead">Cada criatura derrotada deixa um registro permanente da sua jornada na Arena.</p><div class="bti-info"><div><strong>⚔️ Derrote criaturas</strong><span>Cada vitória aumenta seu registro daquela criatura.</span></div><div><strong>📊 Complete os registros</strong><span>Mate a mesma criatura várias vezes para preencher sua progressão.</span></div><div><strong>🏆 Conquiste Platina</strong><span>Complete o registro de uma criatura e prove que você dominou aquela presa.</span></div></div><div class="bti-actions"><button class="btn active bti-action" id="btiOpenBestiary">ABRIR BESTIÁRIO</button><button class="bti-skip" id="btiSkip">PULAR → TREINO DE SKILL</button></div></section>`;
    document.body.appendChild(modal);
    document.body.classList.add('bestiary-intro-open');

    modal.querySelector('#btiClose').onclick=()=>close(false);
    modal.querySelector('.bti-backdrop').onclick=()=>close(false);
    modal.querySelector('#btiOpenBestiary').onclick=()=>{
      close(false);
      setTimeout(()=>document.getElementById('arenaBestiaryButton')?.click(),120);
    };
    modal.querySelector('#btiSkip').onclick=()=>close(true);
  };

  const style=document.createElement('style');
  style.textContent=`body.bestiary-intro-open{overflow:hidden}.bti-overlay{position:fixed;inset:0;z-index:100000;display:grid;place-items:center;padding:20px;box-sizing:border-box}.bti-backdrop{position:absolute;inset:0;background:rgba(0,0,0,.84);backdrop-filter:blur(5px)}.bti-modal{position:relative;z-index:1;width:min(560px,100%);max-height:92vh;overflow:auto;box-sizing:border-box;padding:28px;border:1px solid #806d38;border-radius:16px;background:linear-gradient(180deg,#17191b,#0d0f10);color:#ddd;text-align:center;box-shadow:0 28px 100px rgba(0,0,0,.8)}.bti-close{position:absolute;right:14px;top:12px;width:36px;height:36px;border:1px solid #343638;border-radius:8px;background:#111315;color:#999;font-size:24px;cursor:pointer}.bti-icon{font-size:48px;margin-bottom:8px}.bti-kicker{color:#bda35c;font-size:.62rem;font-weight:900;letter-spacing:.16em}.bti-modal h2{margin:8px 0 10px;color:#f0e5c5;font-size:1.55rem}.bti-lead{margin:0 auto 16px;max-width:430px;color:#9a9fa5;line-height:1.55;font-size:.9rem}.bti-info{display:grid;gap:7px;text-align:left;margin:0 0 16px}.bti-info div{padding:9px 12px;background:#111315;border:1px solid #292c2f;border-radius:9px}.bti-info strong,.bti-info span{display:block}.bti-info strong{font-size:.76rem;color:#e2d3a5;margin-bottom:3px}.bti-info span{font-size:.66rem;color:#777d84;line-height:1.35}.bti-actions{display:grid;gap:7px}.bti-action{width:100%;font-weight:900}.bti-skip{border:0;background:transparent;color:#777d84;font-size:.62rem;font-weight:800;letter-spacing:.08em;padding:8px;cursor:pointer}.bti-skip:hover{color:#c4a85e}@media(max-width:520px){.bti-modal{padding:24px 16px}.bti-modal h2{font-size:1.3rem}}`;
  document.head.appendChild(style);

  document.addEventListener('keydown',event=>{
    if(event.key!=='Escape')return;
    const modal=document.getElementById('arenaBestiaryIntro');
    if(modal){event.preventDefault();close(false)}
  });

  window.addEventListener('arena:bestiary-kill',open);
})();

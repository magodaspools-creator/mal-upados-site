(()=>{
  if(window.__arenaIntro)return;
  window.__arenaIntro=true;

  const style=()=>{
    if(document.getElementById('arena-intro-style'))return;
    const s=document.createElement('style');s.id='arena-intro-style';
    s.textContent=`.arena-intro-gate{position:fixed;inset:0;z-index:100060;background:radial-gradient(circle at 50% 35%,rgba(91,67,28,.2),rgba(3,5,8,.96) 65%);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;padding:20px}.arena-intro-window{width:min(720px,100%);max-height:90vh;overflow:auto;background:linear-gradient(145deg,#17191e,#090b0f);border:1px solid rgba(194,151,67,.55);border-radius:14px;box-shadow:0 30px 110px rgba(0,0,0,.78);padding:32px;color:#fff;text-align:center}.arena-intro-sigil{width:68px;height:68px;margin:0 auto 16px;border:1px solid rgba(218,180,92,.55);border-radius:50%;display:grid;place-items:center;color:#e2bd68;font:900 30px Cinzel,serif;box-shadow:0 0 35px rgba(195,151,62,.14)}.arena-intro-kicker{color:#a88a50;font:800 11px Inter,sans-serif;letter-spacing:2px;text-transform:uppercase}.arena-intro-window h2{font:900 30px Cinzel,serif;color:#e8c66f;margin:7px 0 12px}.arena-intro-window .lead{max-width:570px;margin:0 auto 22px;color:#c8cbd0;font:500 14px/1.65 Inter,sans-serif}.arena-intro-steps{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;text-align:left}.arena-intro-step{padding:14px;border:1px solid #2e3339;background:#111419;border-radius:9px}.arena-intro-step b{display:block;color:#e1c06d;font:900 11px Inter,sans-serif;letter-spacing:.8px;text-transform:uppercase;margin-bottom:6px}.arena-intro-step span{display:block;color:#9ba1a9;font:500 12px/1.5 Inter,sans-serif}.arena-intro-action{margin-top:22px}.arena-intro-action button{border:1px solid #d0aa5d;background:linear-gradient(180deg,#b98d3d,#765622);color:#fff;border-radius:8px;padding:12px 22px;font:900 12px Inter,sans-serif;cursor:pointer}.arena-intro-hint{margin-top:10px;color:#707780;font:500 11px Inter,sans-serif}@media(max-width:650px){.arena-intro-window{padding:24px}.arena-intro-steps{grid-template-columns:1fr}.arena-intro-window h2{font-size:25px}}`;
    document.head.appendChild(s);
  };

  function open(){
    if(document.getElementById('arenaIntroModal'))return;
    style();
    const modal=document.createElement('div');modal.className='arena-intro-gate';modal.id='arenaIntroModal';
    modal.innerHTML=`<div class="arena-intro-window" role="dialog" aria-modal="true" aria-labelledby="arenaIntroTitle"><div class="arena-intro-sigil">☀</div><div class="arena-intro-kicker">O CISMA DO SOBERANO</div><h2 id="arenaIntroTitle">A Arena começa aqui.</h2><p class="lead">Algo rompeu o equilíbrio deste mundo. Criaturas, ruínas e antigos fragmentos escondem as respostas. Você acaba de entrar nessa história.</p><div class="arena-intro-steps"><div class="arena-intro-step"><b>01 · Explore</b><span>Comece pela Floresta Sombria e descubra o primeiro sinal.</span></div><div class="arena-intro-step"><b>02 · Enfrente</b><span>Derrote os chefes e avance quando a história abrir o próximo caminho.</span></div><div class="arena-intro-step"><b>03 · Descubra</b><span>Cada área revela uma parte do mistério por trás do Cisma.</span></div></div><div class="arena-intro-action"><button type="button" id="arenaIntroStart">COMEÇAR A JORNADA</button></div><div class="arena-intro-hint">Ao fechar esta introdução, a Floresta Sombria será aberta automaticamente.</div></div>`;
    document.body.appendChild(modal);
    const finish=()=>{modal.remove();if(typeof game!=='undefined'&&game){game.zone=0;game.manualZone=0;if(typeof persist==='function')persist();if(typeof renderAll==='function')renderAll();if(typeof showZone==='function')showZone(0)}};
    modal.querySelector('#arenaIntroStart').onclick=finish;
    modal.addEventListener('click',e=>{if(e.target===modal)finish()});
    modal.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();finish()}});
    setTimeout(()=>modal.querySelector('#arenaIntroStart')?.focus(),30);
  }

  window.arenaOpenIntro=open;
})();

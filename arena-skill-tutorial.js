(()=>{
  if(window.__arenaSkillTutorialInstalled)return;
  window.__arenaSkillTutorialInstalled=true;

  const DONE_PREFIX='malupados_arena_skill_tutorial_done_';
  const character=()=>String(document.getElementById('playerName')?.textContent||document.getElementById('characterPickerName')?.textContent||game?.character||'').trim();
  const doneKey=()=>DONE_PREFIX+(character()||'default');
  const isDone=()=>{try{return localStorage.getItem(doneKey())==='1'}catch{return false}};

  function kills(){
    try{
      if(typeof game!=='undefined'&&game)return Number(game.kills)||0;
      const all=JSON.parse(localStorage.getItem('malupados_arena_v1')||'{}');
      const d=all[character()];
      return Number(d?.kills)||0;
    }catch{return 0}
  }

  function markDone(){try{localStorage.setItem(doneKey(),'1')}catch{}}

  function style(){
    if(document.getElementById('arena-skill-tutorial-style'))return;
    const s=document.createElement('style');s.id='arena-skill-tutorial-style';
    s.textContent=`
      .skill-tutorial-modal{position:fixed;inset:0;z-index:100010;display:flex;align-items:center;justify-content:center;padding:18px}
      .skill-tutorial-backdrop{position:absolute;inset:0;background:rgba(0,0,0,.84);backdrop-filter:blur(5px)}
      .skill-tutorial-window{position:relative;width:min(560px,100%);max-height:92vh;overflow:auto;border:1px solid #806d38;background:linear-gradient(145deg,#1d1a15,#0e0f11);box-shadow:0 24px 90px rgba(0,0,0,.82);padding:26px;color:#d7d9dd;text-align:center}
      .skill-tutorial-x{position:absolute;top:9px;right:10px;width:34px;height:34px;border:1px solid #3b3d40;background:#111316;color:#aeb3ba;font:800 1.1rem Inter,sans-serif;line-height:1;cursor:pointer;z-index:2}
      .skill-tutorial-x:hover{border-color:#b99645;color:#e4c875;background:#19150f}
      .skill-tutorial-icon{font-size:48px;line-height:1;margin-bottom:12px}
      .skill-tutorial-window h2{margin:0 0 8px;font-family:Cinzel,serif;color:#e3c46e}
      .skill-tutorial-window p{margin:0 auto 14px;max-width:430px;color:#969ba3;font-size:.76rem;line-height:1.65}
      .skill-tutorial-rule{display:grid;grid-template-columns:1fr auto 1fr;gap:8px;align-items:center;margin:16px 0;color:#676d76;font-size:.58rem;letter-spacing:1px}
      .skill-tutorial-rule:before,.skill-tutorial-rule:after{content:'';height:1px;background:#35383d}
      .skill-tutorial-preview{margin:0 0 16px;padding:10px;border:1px solid #383a3d;border-radius:10px;background:#0a0c0e;text-align:left}
      .skill-tutorial-preview-top{display:flex;justify-content:space-between;padding:3px 5px 8px;color:#777;font-size:.54rem;letter-spacing:.12em}
      .skill-tutorial-preview-body{display:grid;grid-template-columns:1fr 1fr;gap:12px;align-items:center}
      .skill-tutorial-panel{display:grid;gap:5px;padding:10px;background:#141619;border:1px solid #2d3033;border-radius:8px;font-size:.61rem;color:#8e9399}
      .skill-tutorial-panel b{font-size:.55rem;color:#c4a85e;letter-spacing:.08em}
      .skill-tutorial-highlight{padding:8px 7px;border:1px solid #b99645;border-radius:6px;background:#292215;color:#e4c875;font-weight:900;box-shadow:0 0 0 2px rgba(185,150,69,.14)}
      .skill-tutorial-copy strong,.skill-tutorial-copy small{display:block}.skill-tutorial-copy strong{color:#ddd;font-size:.72rem;margin-bottom:4px}.skill-tutorial-copy small{color:#777d84;font-size:.61rem;line-height:1.45}
      .skill-tutorial-key{display:inline-flex;align-items:center;justify-content:center;min-width:100px;height:48px;padding:0 18px;border:1px solid #8c713c;background:linear-gradient(145deg,#302719,#17130e);color:#e3c46e;font-weight:900;font-size:.8rem;letter-spacing:1px}
      .skill-tutorial-actions{display:grid;gap:7px}.skill-tutorial-close{width:100%}.skill-tutorial-skip{border:0;background:transparent;color:#777d84;font-size:.62rem;font-weight:800;letter-spacing:.08em;padding:8px;cursor:pointer}.skill-tutorial-skip:hover{color:#c4a85e}
      @media(max-width:520px){.skill-tutorial-window{padding:24px 16px}.skill-tutorial-preview-body{grid-template-columns:1fr}}
    `;
    document.head.appendChild(s);
  }

  function show(force=false){
    const name=character();
    if(!name)return;
    if(document.getElementById('skillTutorialModal'))return;
    if(!force&&isDone())return;
    if(kills()<1)return;
    if(document.getElementById('arenaBestiaryIntro'))return;
    style();
    const m=document.createElement('div');
    m.id='skillTutorialModal';m.className='skill-tutorial-modal';
    m.innerHTML=`<div class="skill-tutorial-backdrop"></div><div class="skill-tutorial-window" role="dialog" aria-modal="true">
      <button type="button" class="skill-tutorial-x" id="skillTutorialX" aria-label="Fechar tutorial">×</button>
      <div class="skill-tutorial-icon">⚔</div><div class="eyebrow">NOVO SISTEMA DESBLOQUEADO</div>
      <h2>Treinamento de Skill</h2>
      <p>Você derrotou sua primeira criatura. Agora sua <strong>Skill</strong> pode evoluir. Quanto maior sua Skill, mais forte fica seu personagem.</p>
      <div class="skill-tutorial-rule"><span></span><b>COMO TREINAR?</b><span></span></div>
      <div class="skill-tutorial-preview"><div class="skill-tutorial-preview-top"><span>ARENA</span><span>PAINEL DO PERSONAGEM</span></div><div class="skill-tutorial-preview-body">
        <div class="skill-tutorial-panel"><b>MENU DO PERSONAGEM</b><span>⚔️ Combate</span><span>🎒 Mochila</span><span class="skill-tutorial-highlight">⚔ TREINAR SKILL</span><span>🪙 Equipamentos</span></div>
        <div class="skill-tutorial-copy"><strong>É ESTE BOTÃO</strong><small>Volte ao painel do personagem e clique em <b>TREINAR SKILL</b> quando quiser treinar novamente.</small></div>
      </div></div>
      <p>No Training Grounds, aperte <strong>ESPAÇO</strong> quando o marcador estiver dentro da zona dourada. Cada acerto gera progresso.</p>
      <div class="skill-tutorial-key">ESPAÇO</div>
      <div class="skill-tutorial-actions"><button type="button" class="btn active big skill-tutorial-close" id="skillTutorialGo">ENTRAR NO TRAINING GROUNDS</button><button type="button" class="skill-tutorial-skip" id="skillTutorialSkip">PULAR → CONTINUAR NA ARENA</button></div>
    </div>`;
    document.body.appendChild(m);
    const close=()=>{m.remove();document.body.classList.remove('skill-tutorial-open');document.removeEventListener('keydown',esc)};
    const esc=e=>{if(e.key==='Escape')close()};
    m.querySelector('.skill-tutorial-backdrop').onclick=close;
    m.querySelector('#skillTutorialX').onclick=close;
    m.querySelector('#skillTutorialGo').onclick=()=>{markDone();close();setTimeout(()=>document.getElementById('skillTrainBtn')?.click(),120)};
    m.querySelector('#skillTutorialSkip').onclick=()=>{markDone();close()};
    document.body.classList.add('skill-tutorial-open');document.addEventListener('keydown',esc);
  }

  style();
  window.addEventListener('arena:bestiary-intro-complete',()=>setTimeout(()=>show(true),500));
  window.addEventListener('arena:bestiary-kill',()=>setTimeout(show,100));
  window.addEventListener('arena:first-kill',()=>setTimeout(show,100));
  const watcher=setInterval(show,250);
  setTimeout(()=>clearInterval(watcher),120000);
})();

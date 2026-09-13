(()=>{
  if(typeof game==='undefined')return;
  const KEY_PREFIX='malupados_arena_skill_tutorial_';
  function key(){return KEY_PREFIX+String(game?.character||'').trim();}
  function seen(){try{return localStorage.getItem(key())==='1'}catch{return false}}
  function markSeen(){try{localStorage.setItem(key(),'1')}catch{}}
  function installStyle(){
    if(document.getElementById('arena-skill-tutorial-style'))return;
    const s=document.createElement('style');s.id='arena-skill-tutorial-style';s.textContent=`
      .skill-tutorial-modal{position:fixed;inset:0;z-index:100010;display:none;align-items:center;justify-content:center;padding:18px}
      .skill-tutorial-modal.open{display:flex}
      .skill-tutorial-backdrop{position:absolute;inset:0;background:rgba(0,0,0,.8);backdrop-filter:blur(4px)}
      .skill-tutorial-window{position:relative;width:min(520px,100%);border:1px solid #665638;background:linear-gradient(145deg,#1d1a15,#0e0f11);box-shadow:0 24px 90px rgba(0,0,0,.82);padding:26px;color:#d7d9dd;text-align:center}
      .skill-tutorial-icon{font-size:48px;line-height:1;margin-bottom:12px}
      .skill-tutorial-window h2{margin:0 0 8px;font-family:Cinzel,serif;color:#e3c46e}
      .skill-tutorial-window p{margin:0 auto 16px;max-width:420px;color:#969ba3;font-size:.76rem;line-height:1.65}
      .skill-tutorial-rule{display:grid;grid-template-columns:1fr auto 1fr;gap:8px;align-items:center;margin:18px 0;color:#676d76;font-size:.58rem;letter-spacing:1px}
      .skill-tutorial-rule:before,.skill-tutorial-rule:after{content:'';height:1px;background:#35383d}
      .skill-tutorial-key{display:inline-flex;align-items:center;justify-content:center;min-width:100px;height:48px;padding:0 18px;border:1px solid #8c713c;background:linear-gradient(145deg,#302719,#17130e);color:#e3c46e;font-weight:900;font-size:.8rem;letter-spacing:1px;box-shadow:inset 0 0 20px rgba(215,183,94,.06)}
      .skill-tutorial-close{margin-top:18px;width:100%}
    `;document.head.appendChild(s);
  }
  function show(){
    if(seen()||Number(game?.kills||0)<1||document.getElementById('skillTutorialModal'))return;
    markSeen();installStyle();
    const m=document.createElement('div');m.id='skillTutorialModal';m.className='skill-tutorial-modal';m.innerHTML=`<div class="skill-tutorial-backdrop"></div><div class="skill-tutorial-window" role="dialog" aria-modal="true" aria-labelledby="skillTutorialTitle"><div class="skill-tutorial-icon">⚔</div><div class="eyebrow">NOVO SISTEMA</div><h2 id="skillTutorialTitle">Treinamento de Skill</h2><p>Boa! Você acabou de derrotar sua primeira criatura. Agora seu personagem pode evoluir a <strong>Skill</strong> através de treinamento.</p><div class="skill-tutorial-rule"><span></span><b>COMO TREINAR</b><span></span></div><p>Abra o Training Grounds, observe o marcador e aperte <strong>ESPAÇO</strong> quando ele estiver dentro da zona dourada. A posição muda a cada tentativa.</p><div class="skill-tutorial-key">ESPAÇO</div><button type="button" class="btn active big skill-tutorial-close" id="skillTutorialGo">ENTRAR NO TRAINING GROUNDS</button></div>`;
    document.body.appendChild(m);
    const close=()=>{m.remove();document.removeEventListener('keydown',esc)};
    const esc=e=>{if(e.key==='Escape')close()};
    m.querySelector('.skill-tutorial-backdrop').onclick=close;
    m.querySelector('#skillTutorialGo').onclick=()=>{close();setTimeout(()=>document.getElementById('skillTrainBtn')?.click(),80)};
    document.addEventListener('keydown',esc);
  }
  function patch(){
    if(typeof renderAll!=='function'||window.__arenaSkillTutorialPatch)return;
    window.__arenaSkillTutorialPatch=true;
    const old=renderAll;
    window.renderAll=function(...args){const r=old(...args);setTimeout(show,450);return r};
  }
  installStyle();patch();
  setTimeout(show,800);
})();

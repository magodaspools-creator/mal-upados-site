// Timer da campanha normal da Arena.
// Começa no primeiro combate, sobrevive a refresh/fechamento e termina na morte do Boss Final.
(()=>{
  const KEY_PREFIX='malupados_campaign_timer_v1_';
  let interval=null;

  const safeCharacter=()=>{
    try{return String(window.game?.character||'').trim()}catch{return ''}
  };
  const key=()=>KEY_PREFIX+encodeURIComponent(safeCharacter()||'default');
  const read=()=>{try{return JSON.parse(localStorage.getItem(key())||'null')}catch{return null}};
  const write=v=>{try{localStorage.setItem(key(),JSON.stringify(v));return true}catch{return false}};

  function state(){
    const s=read();
    if(!s||typeof s!=='object')return null;
    if(s.completedAt&&s.startedAt)return s;
    if(s.startedAt&&!Number.isFinite(Number(s.startedAt)))return null;
    return s;
  }

  function elapsed(s){
    if(!s?.startedAt)return 0;
    const end=s.completedAt||Date.now();
    return Math.max(0,Number(end)-Number(s.startedAt));
  }

  function format(ms){
    let total=Math.floor(Math.max(0,ms)/1000);
    const h=Math.floor(total/3600); total%=3600;
    const m=Math.floor(total/60); const sec=total%60;
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
  }

  function ensureUI(){
    if(document.getElementById('campaignTimer'))return;
    const top=document.querySelector('.game-topbar');
    if(!top)return;
    const el=document.createElement('div');
    el.id='campaignTimer';
    el.innerHTML=`<div class="campaign-timer-card"><div><div class="eyebrow">Campanha normal</div><strong id="campaignTimerValue">00:00:00</strong></div><span id="campaignTimerStatus">Ainda não iniciada</span></div>`;
    top.insertAdjacentElement('afterend',el);
    if(!document.getElementById('campaign-timer-style')){
      const style=document.createElement('style');
      style.id='campaign-timer-style';
      style.textContent=`#campaignTimer{margin:0 0 14px}.campaign-timer-card{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:12px 16px;border:1px solid #494c52;background:linear-gradient(145deg,#181a1e,#0e1012);box-shadow:inset 0 0 0 1px rgba(255,255,255,.025),0 8px 18px rgba(0,0,0,.18)}.campaign-timer-card strong{display:block;margin-top:2px;color:var(--gold2);font:900 1.35rem/1.1 Inter,sans-serif;letter-spacing:.08em}.campaign-timer-card span{font-size:.68rem;color:#858a92;text-align:right}.campaign-timer-card.done{border-color:#66542f}.campaign-timer-card.done strong{color:var(--gold2)}@media(max-width:620px){.campaign-timer-card{align-items:flex-start}.campaign-timer-card strong{font-size:1.08rem}.campaign-timer-card span{font-size:.62rem}}`;
      document.head.appendChild(style);
    }
  }

  function render(){
    ensureUI();
    const box=document.querySelector('.campaign-timer-card');
    const value=document.getElementById('campaignTimerValue');
    const status=document.getElementById('campaignTimerStatus');
    if(!box||!value||!status)return;
    const s=state();
    if(!s){value.textContent='00:00:00';status.textContent='Ainda não iniciada';box.classList.remove('done');return}
    value.textContent=format(elapsed(s));
    if(s.completedAt){status.textContent='Campanha concluída';box.classList.add('done')}
    else{status.textContent='Contando · sem pausa';box.classList.remove('done')}
  }

  function start(){
    const character=safeCharacter(); if(!character)return;
    const s=state();
    if(s?.startedAt||s?.completedAt){render();return}
    write({version:1,character,startedAt:Date.now(),completedAt:null});
    render();
  }

  function complete(){
    const s=state();
    if(!s?.startedAt||s.completedAt)return;
    s.completedAt=Date.now();
    write(s);
    render();
    try{window.toast?.(`Campanha concluída em ${format(elapsed(s))}.`)}catch{}
  }

  function resetAfterCharacterReset(){
    const character=safeCharacter(); if(!character)return;
    const s=state();
    // O reset nativo zera level/wins. Só então apagamos a run.
    if(window.game&&Number(window.game.level)===1&&Number(window.game.wins)===0&&s){
      try{localStorage.removeItem(key())}catch{}
      render();
    }
  }

  const originalStart=window.startBattle;
  if(typeof originalStart==='function'){
    window.startBattle=function(zoneIndex,monsterIndex){
      start();
      return originalStart.apply(this,arguments);
    };
  }

  const originalWin=window.winBattle;
  if(typeof originalWin==='function'){
    window.winBattle=function(){
      let finalBoss=false;
      try{finalBoss=!!window.battle?.isBoss&&Number(window.battle.zoneIndex)===4}catch{}
      const result=originalWin.apply(this,arguments);
      if(finalBoss)complete();
      return result;
    };
  }

  document.addEventListener('click',e=>{
    if(e.target?.id==='resetBtn')setTimeout(resetAfterCharacterReset,100);
  },true);

  function boot(){
    ensureUI();
    render();
    if(interval)clearInterval(interval);
    interval=setInterval(render,1000);
  }

  boot();
})();

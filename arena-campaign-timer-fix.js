// Timer robusto da campanha.
// Só inicia quando o personagem atingir/estiver no Level 8 e iniciar um combate.
(()=>{
  const PREFIX='malupados_campaign_timer_v2_';
  const storeKey='malupados_arena_v1';
  const char=()=>{const a=document.getElementById('characterSelect')?.value?.trim();const b=document.getElementById('characterPickerName')?.textContent?.trim();if(a)return a;if(b&&b!=='Escolher personagem')return b;try{const all=JSON.parse(localStorage.getItem(storeKey)||'{}');return Object.keys(all)[0]||'default'}catch{return'default'}};
  const key=()=>PREFIX+encodeURIComponent(char());
  const read=()=>{try{return JSON.parse(localStorage.getItem(key())||'null')}catch{return null}};
  const write=v=>localStorage.setItem(key(),JSON.stringify(v));
  const level=()=>{try{const all=JSON.parse(localStorage.getItem(storeKey)||'{}');const g=all[char()];return Number(g?.level)||0}catch{return 0}};
  const fmt=ms=>{let s=Math.floor(Math.max(0,ms)/1000),h=Math.floor(s/3600);s%=3600;let m=Math.floor(s/60);s%=60;return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`};
  const ensure=()=>{if(document.getElementById('campaignTimer'))return;const top=document.querySelector('.game-topbar');if(!top)return;const e=document.createElement('div');e.id='campaignTimer';e.innerHTML='<div class="campaign-timer-card"><div><div class="eyebrow">Campanha normal</div><strong id="campaignTimerValue">00:00:00</strong></div><span id="campaignTimerStatus">Disponível a partir do Level 8</span></div>';top.insertAdjacentElement('afterend',e)};
  const render=()=>{ensure();const v=document.getElementById('campaignTimerValue'),s=document.getElementById('campaignTimerStatus'),box=document.querySelector('.campaign-timer-card');if(!v||!s)return;const x=read(),lv=level();if(!x){v.textContent='00:00:00';s.textContent=lv>=8?'Pronto — inicia no próximo combate':'Disponível a partir do Level 8';box?.classList.remove('done');return}v.textContent=fmt((x.completedAt||Date.now())-x.startedAt);s.textContent=x.completedAt?'Campanha concluída':'Contando · sem pausa';box?.classList.toggle('done',!!x.completedAt)};
  const start=()=>{if(level()<8)return;const x=read();if(!x?.startedAt)write({version:3,character:char(),startedAt:Date.now(),completedAt:null});render()};
  const complete=()=>{const x=read();if(x?.startedAt&&!x.completedAt){x.completedAt=Date.now();write(x);render()}};
  document.addEventListener('click',e=>{if(e.target.closest('.monster-choice'))start()},true);
  const area=document.getElementById('battleArea');
  if(area){let seen='';const obs=new MutationObserver(()=>{const h=area.querySelector('.result h3');if(!h)return;const t=h.textContent.trim();if(t===seen)return;seen=t;if(/Deathbringer\s+derrotado/i.test(t))complete()});obs.observe(area,{subtree:true,childList:true})}
  const style=document.createElement('style');style.textContent='#campaignTimer{margin:0 0 14px}.campaign-timer-card{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:12px 16px;border:1px solid #494c52;background:linear-gradient(145deg,#181a1e,#0e1012);box-shadow:0 8px 18px rgba(0,0,0,.18)}.campaign-timer-card strong{display:block;margin-top:2px;color:var(--gold2);font:900 1.35rem/1.1 Inter,sans-serif;letter-spacing:.08em}.campaign-timer-card span{font-size:.68rem;color:#858a92}.campaign-timer-card.done{border-color:#66542f}@media(max-width:620px){.campaign-timer-card strong{font-size:1.08rem}}';document.head.appendChild(style);
  setInterval(render,1000);render();
})();

(()=>{
  if(window.__arenaPhase3)return;
  window.__arenaPhase3=true;

  const STORAGE='malupados_arena_phase3';
  const esc3=v=>String(v??'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]));
  const read=()=>{try{return JSON.parse(localStorage.getItem(STORAGE)||'{}')}catch{return {}}};
  const write=v=>{try{localStorage.setItem(STORAGE,JSON.stringify(v))}catch{}};
  const state=read();
  state.lootLog=Array.isArray(state.lootLog)?state.lootLog:[];
  state.achievements=state.achievements&&typeof state.achievements==='object'?state.achievements:{};

  const rarityFor=item=>{
    const power=(Number(item?.attack)||0)+(Number(item?.defense)||0);
    const level=Number(item?.minLevel)||1;
    const price=Number(item?.price)||0;
    if(price>=3000||level>=35||power>=45)return ['Lendário','legendary'];
    if(price>=1800||level>=25||power>=32)return ['Épico','epic'];
    if(price>=900||level>=15||power>=22)return ['Raro','rare'];
    if(price>=400||level>=7||power>=14)return ['Incomum','uncommon'];
    return ['Comum','common'];
  };

  function installStyle(){
    if(document.getElementById('arenaPhase3Style'))return;
    const s=document.createElement('style');s.id='arenaPhase3Style';s.textContent=`
      .p3-rarity{display:inline-flex;align-items:center;gap:5px;margin-top:6px;padding:3px 7px;border:1px solid currentColor;border-radius:999px;font-size:.52rem;font-weight:900;letter-spacing:.09em;text-transform:uppercase}.p3-rarity.common{color:#9a9da3}.p3-rarity.uncommon{color:#79c58b}.p3-rarity.rare{color:#74a8e8}.p3-rarity.epic{color:#b88be6}.p3-rarity.legendary{color:#e1bb63}.shop-item-card.p3-rare,.shop-item-card.p3-epic,.shop-item-card.p3-legendary{box-shadow:inset 0 0 0 1px rgba(255,255,255,.035)}
      .p3-codex{margin-top:28px}.p3-grid{display:grid;grid-template-columns:1.25fr .75fr;gap:16px}.p3-card{border:1px solid #302f2b;background:linear-gradient(145deg,#171817,#0d0f0f);padding:18px;box-shadow:0 18px 55px rgba(0,0,0,.22)}.p3-card h3{margin:4px 0 8px;font-family:Cinzel,serif;color:#e8dfc9}.p3-card p{color:#858a8d;font-size:.68rem;line-height:1.5}.p3-bestiary{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-top:12px}.p3-mob{padding:10px;border:1px solid #2b2e30;background:#111315;display:grid;grid-template-columns:auto 1fr auto;gap:9px;align-items:center}.p3-mob-icon{font-size:1.35rem}.p3-mob strong{display:block;color:#ddd;font-size:.7rem}.p3-mob small{color:#737980;font-size:.56rem}.p3-progress{height:4px;background:#24272a;margin-top:5px;overflow:hidden}.p3-progress i{display:block;height:100%;background:#b99b53}.p3-achievements{display:grid;gap:8px;margin-top:12px}.p3-ach{padding:10px 11px;border:1px solid #2b2e30;background:#111315;display:flex;justify-content:space-between;gap:12px;align-items:center}.p3-ach strong{display:block;font-size:.68rem;color:#d9dadd}.p3-ach small{display:block;font-size:.55rem;color:#70767d;margin-top:2px}.p3-ach b{font-size:.58rem;color:#b99b53;white-space:nowrap}.p3-ach.done{border-color:#6d5a2e;background:linear-gradient(90deg,#1b1912,#111315)}
      .p3-loot{margin-top:14px;padding:11px;border:1px dashed #4b4637;background:#12120f}.p3-loot-title{font-size:.57rem;letter-spacing:.12em;color:#b99b53;font-weight:900}.p3-loot-list{display:flex;flex-wrap:wrap;gap:6px;margin-top:7px}.p3-loot-pill{padding:5px 8px;border:1px solid #302f2a;background:#0d0f10;color:#bfc2c5;font-size:.56rem}.p3-loot-pill strong{color:#e1d2a3}
      .boss-battle-card.p3-boss-enraged{box-shadow:0 0 0 1px rgba(190,65,50,.45),0 0 45px rgba(130,35,25,.16)}.boss-battle-card.p3-boss-critical{animation:p3BossPulse 1.1s ease-in-out infinite}.boss-battle-warning.p3-phase-warning{color:#e7ad83;border-color:#734033;background:rgba(120,45,30,.13)}@keyframes p3BossPulse{0%,100%{filter:none}50%{filter:brightness(1.12)}}
      .p3-forge-ready{border-color:#66572f!important;background:linear-gradient(145deg,#191711,#0d0f10)!important}.p3-forge-ready .forge-coming-soon{display:grid;grid-template-columns:auto 1fr;gap:8px;align-items:center}.p3-forge-ready .forge-coming-soon span{grid-column:2}.p3-forge-ready .forge-icon{grid-row:span 2}
      @media(max-width:760px){.p3-grid{grid-template-columns:1fr}.p3-bestiary{grid-template-columns:1fr}}
    `;document.head.appendChild(s);
  }

  function mobs(){
    const out=[];
    if(typeof ZONES==='undefined')return out;
    ZONES.forEach((z,zi)=>{(z.monsters||[]).forEach((m,mi)=>{if(!m?.[0])return;if(String(m[0]).toLowerCase().includes('guardian')||String(m[0]).toLowerCase().includes('overlord')||String(m[0]).toLowerCase().includes('tyrant')||String(m[0]).toLowerCase().includes('wyrm')||String(m[0]).toLowerCase().includes('deathbringer'))return;out.push({name:m[0],icon:m[1]||'👹',zone:zi,hp:Number(m[2])||0})})});return out;
  }

  function killCount(name){
    try{const b=game?.bestiary||{};const direct=b[name];if(direct)return Number(direct.kills||0);const key=Object.keys(b).find(k=>String(k).toLowerCase()===String(name).toLowerCase());return key?Number(b[key]?.kills||0):0}catch{return 0}
  }

  function achievements(){
    const wins=Number(game?.wins||0),level=Number(game?.level||1),bosses=Object.values(game?.bossKills||{}).reduce((a,v)=>a+Number(v||0),0),best=mobs().reduce((a,m)=>a+killCount(m.name),0),skill=typeof window.arenaSkillCurrent==='function'?Number(window.arenaSkillCurrent()?.value||10):10;
    return [
      ['first-blood','Primeiro Sangue','Derrote sua primeira criatura.',wins>=1,'✓'],
      ['hunter-10','Caçador Iniciante','Acumule 10 criaturas derrotadas.',best>=10,'10'],
      ['boss-1','Derrubador de Boss','Derrote seu primeiro Boss.',bosses>=1,'BOSS'],
      ['level-20','Veterano da Arena','Alcance o Level 20.',level>=20,'20'],
      ['skill-30','Mestre do Ofício','Chegue ao Skill 30.',skill>=30,'30'],
      ['bestiary-50','Livro Vivo','Registre 50 criaturas derrotadas.',best>=50,'50']
    ];
  }

  function renderCodex(){
    const anchor=document.querySelector('.progress-section');if(!anchor||document.getElementById('arenaPhase3Codex'))return;
    const ms=mobs();
    const cards=ms.slice(0,10).map(m=>{const k=killCount(m.name),pct=Math.min(100,k*10);return `<div class="p3-mob"><span class="p3-mob-icon">${esc3(m.icon)}</span><div><strong>${esc3(m.name)}</strong><small>Área ${m.zone+1} · ${k} vitórias</small><div class="p3-progress"><i style="width:${pct}%"></i></div></div><b>${k}/10</b></div>`}).join('');
    const ach=achievements().map(a=>`<div class="p3-ach ${a[3]?'done':''}"><div><strong>${a[1]}</strong><small>${a[2]}</small></div><b>${a[3]?a[4]:'BLOQUEADO'}</b></div>`).join('');
    const loot=state.lootLog.slice(-6).reverse().map(x=>`<span class="p3-loot-pill">${esc3(x.icon||'✦')} <strong>${esc3(x.text)}</strong></span>`).join('')||'<span class="p3-loot-pill">Derrote criaturas para alimentar seu registro de loot.</span>';
    const sec=document.createElement('section');sec.id='arenaPhase3Codex';sec.className='p3-codex';sec.innerHTML=`<div class="section-head"><div><div class="eyebrow">Codex · Conquistas · Recompensas</div><h2>Crônicas da Arena</h2></div><div class="small">Fase 3 · Progressão viva</div></div><div class="p3-grid"><article class="p3-card"><div class="eyebrow">Bestiário</div><h3>Suas criaturas</h3><p>Cada vitória alimenta o registro. Complete 10 derrotas da mesma criatura para marcar domínio.</p><div class="p3-bestiary">${cards||'<div class="p3-mob">Nenhuma criatura registrada ainda.</div>'}</div><div class="p3-loot"><div class="p3-loot-title">ÚLTIMOS LOOTS / RECOMPENSAS</div><div class="p3-loot-list">${loot}</div></div></article><article class="p3-card"><div class="eyebrow">Conquistas</div><h3>Feitos do aventureiro</h3><p>Objetivos permanentes para dar motivo real para continuar evoluindo.</p><div class="p3-achievements">${ach}</div></article></div>`;
    anchor.insertAdjacentElement('afterend',sec);
  }

  function enrichShop(){
    const root=document.getElementById('shopItems');if(!root)return;
    if(root.dataset.p3Bound)return;root.dataset.p3Bound='1';
    const observer=new MutationObserver(()=>{root.querySelectorAll('.shop-item-card').forEach(card=>{if(card.querySelector('.p3-rarity'))return;const text=card.textContent||'';let item=null;try{item=(typeof SHOP_ITEMS!=='undefined'?SHOP_ITEMS:[]).find(x=>text.includes(x.name))}catch{}if(!item)return;const [label,cls]=rarityFor(item);const r=document.createElement('span');r.className=`p3-rarity ${cls}`;r.textContent=label;const target=card.querySelector('h3,.shop-item-name,strong');(target||card).insertAdjacentElement('afterend',r);card.classList.add(`p3-${cls}`)})});observer.observe(root,{childList:true,subtree:true});setTimeout(()=>observer.takeRecords(),0);
  }

  function enhanceEquipment(){
    const box=document.querySelector('.character-panel .equipment');if(!box||box.dataset.p3Done)return;box.dataset.p3Done='1';
    box.querySelectorAll('.equip-item').forEach(item=>{const name=item.querySelector('strong')?.textContent||'';let obj=null;try{obj=(typeof SHOP_ITEMS!=='undefined'?SHOP_ITEMS:[]).find(x=>x.name===name)}catch{}const [label,cls]=rarityFor(obj||{name});const r=document.createElement('em');r.className=`p3-rarity ${cls}`;r.textContent=label;item.appendChild(r)});
  }

  function enhanceForge(){const card=document.querySelector('.forge-card');if(!card||card.dataset.p3Done)return;card.dataset.p3Done='1';card.classList.add('p3-forge-ready');const span=card.querySelector('.forge-coming-soon span');if(span)span.textContent='A Forja será o próximo grande sistema: fundir materiais, melhorar raridade e criar upgrades para seu equipamento.'}

  function bossVisual(){const card=document.querySelector('.boss-battle-card');const b=typeof battle!=='undefined'?battle:null;if(!card||!b?.isBoss)return;const pct=b.maxHp?b.hp/b.maxHp:1;card.classList.toggle('p3-boss-enraged',pct<=.5);card.classList.toggle('p3-boss-critical',pct<=.2);const warning=card.querySelector('.boss-battle-warning');if(warning&&pct<=.5){warning.classList.add('p3-phase-warning');if(!warning.dataset.p3)warning.innerHTML+=' · <strong>FASE DE FÚRIA ATIVA</strong>'}}

  function monitor(){
    renderCodex();enhanceEquipment();enrichShop();enhanceForge();bossVisual();
    try{const g=Number(game?.gold||0);if(state.lastGold!=null&&g>state.lastGold){const gain=g-state.lastGold;state.lootLog.push({text:`+${gain} gold`,icon:'🪙'});state.lootLog=state.lootLog.slice(-12);write(state)}state.lastGold=g}catch{}
    achievements().forEach(a=>{if(a[3]&&!state.achievements[a[0]]){state.achievements[a[0]]=Date.now();write(state);try{toast(`CONQUISTA! ${a[1]}`)}catch{}}});
  }

  installStyle();
  const timer=setInterval(monitor,700);setTimeout(()=>clearInterval(timer),180000);monitor();
})();

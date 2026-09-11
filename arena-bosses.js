// Bosses da Arena: um chefe elemental por área, cooldown e Boss Tokens.
// Isolado do motor base para preservar combate, loja e progressão existentes.
(()=>{
  const BOSSES=[
    {name:'Forest Guardian',icon:'🌿',element:'earth',hp:480,damage:42,gold:240,xp:360,cooldown:20,tokenChance:.35},
    {name:'Energy Overlord',icon:'⚡',element:'energy',hp:900,damage:70,gold:520,xp:720,cooldown:45,tokens:1},
    {name:'Inferno Tyrant',icon:'🔥',element:'fire',hp:1550,damage:105,gold:900,xp:1200,cooldown:90,tokens:2},
    {name:'Frost Wyrm',icon:'❄️',element:'ice',hp:2500,damage:150,gold:1500,xp:1900,cooldown:180,tokens:2},
    {name:'Deathbringer',icon:'💀',element:'death',hp:3900,damage:220,gold:2600,xp:3000,cooldown:300,tokens:3}
  ];
  const originalShowZone=window.showZone;
  const originalStartBattle=window.startBattle;
  const originalWinBattle=window.winBattle;
  const originalRenderBattle=window.renderBattle;
  let activeBoss=null;
  function ensureState(){if(typeof game==='undefined'||!game)return;if(!game.bossTokens)game.bossTokens=0;if(!game.bossKills||typeof game.bossKills!=='object')game.bossKills={};if(!game.bossCooldowns||typeof game.bossCooldowns!=='object')game.bossCooldowns={};updateTokenBalance()}
  function updateTokenBalance(){const el=document.getElementById('bossTokenBalance');if(el&&typeof game!=='undefined'&&game)el.textContent=fmt(game.bossTokens||0)}
  function bossFor(zoneIndex){return BOSSES[Number(zoneIndex)]||null}
  function key(zoneIndex){return `boss-${Number(zoneIndex)}`}
  function kills(zoneIndex){ensureState();return Number(game.bossKills[key(zoneIndex)]||0)}
  function cooldownLeft(zoneIndex){ensureState();return Math.max(0,Number(game.bossCooldowns[key(zoneIndex)]||0)-Date.now())}
  function fmtTime(ms){let sec=Math.ceil(ms/1000);let m=Math.floor(sec/60);let s=sec%60;return m?`${m}m ${String(s).padStart(2,'0')}s`:`${s}s`}
  function scale(zoneIndex){return 1+Math.min(1,kills(zoneIndex)*.05)}
  function bossTuple(zoneIndex){const b=bossFor(zoneIndex),s=scale(zoneIndex);return [b.name,b.icon,Math.floor(b.hp*s),Math.floor(b.damage*s),Math.floor(b.gold*(1+Math.min(.5,kills(zoneIndex)*.02))),Math.floor(b.xp*s)]}
  function hasAmulet(element){try{const amulet=window.arenaElementalState?.currentAmulet?.();return !!amulet&&amulet.element===element}catch{return false}}

  // Nunca deixamos uma cópia antiga do Boss dentro da lista de criaturas.
  // Isso impede que cada tentativa crie uma nova "caixinha" reutilizável.
  function cleanupBossEntries(zoneIndex){
    const list=ZONES[zoneIndex]?.monsters;
    const b=bossFor(zoneIndex);
    if(!list||!b)return;
    for(let i=list.length-1;i>=0;i--){if(list[i]?.[0]===b.name)list.splice(i,1)}
  }

  function bossCard(zoneIndex){
    const b=bossFor(zoneIndex);if(!b)return '';
    const left=cooldownLeft(zoneIndex),k=kills(zoneIndex),s=Math.round(scale(zoneIndex)*100);
    const guaranteed=b.tokens?`${b.tokens} Token${b.tokens>1?'s':''}`:`35% de chance de 1 Token`;
    if(left>0)return `<article class="arena-boss-card boss-cooldown"><div class="boss-card-icon">${b.icon}</div><div class="boss-card-body"><div class="eyebrow">Boss elemental</div><h3>${esc(b.name)}</h3><p>Disponível novamente em <strong class="boss-timer" data-boss-zone="${zoneIndex}">${fmtTime(left)}</strong>.</p><small>Cooldown: ${b.cooldown}s · Derrotas: ${k} · dificuldade atual: +${s-100}%</small></div><button class="btn" disabled>COOLDOWN</button></article>`;
    const amuletOk=hasAmulet(b.element);
    return `<article class="arena-boss-card ${amuletOk?'boss-ready':'boss-needs-amulet'}"><div class="boss-card-icon">${b.icon}</div><div class="boss-card-body"><div class="eyebrow">Boss elemental</div><h3>${esc(b.name)}</h3><p>${amuletOk?'Proteção elemental confirmada.':'Requer o amuleto elemental desta área.'}</p><small>Cooldown: ${b.cooldown}s · Loot: <strong>${guaranteed}</strong> · +${s-100}% por vitória anterior</small></div><button class="btn ${amuletOk?'active':''} boss-fight-btn" data-boss-zone="${zoneIndex}" ${amuletOk?'':'disabled'}>${amuletOk?'ENFRENTAR BOSS':'SEM AMULETO'}</button></article>`
  }

  window.showZone=function(index){
    cleanupBossEntries(index);
    originalShowZone(index);
    const area=document.getElementById('battleArea');
    if(!area||typeof game==='undefined'||!game)return;
    // Remove qualquer card antigo antes de inserir exatamente um card novo.
    area.querySelectorAll('.arena-boss-wrap').forEach(el=>el.remove());
    const old=area.querySelector('.battle-empty');if(!old)return;
    const boss=bossCard(index);if(!boss)return;
    old.insertAdjacentHTML('beforeend',`<div class="arena-boss-wrap">${boss}</div>`);
    const btn=area.querySelector('.boss-fight-btn');if(btn)btn.onclick=()=>startBoss(Number(btn.dataset.bossZone));
  };

  function startBoss(zoneIndex){
    ensureState();
    const b=bossFor(zoneIndex);if(!b)return;
    if(game.level<(ZONES[zoneIndex]?.min||1)){toast('Você ainda não pode enfrentar este Boss.');return}
    const left=cooldownLeft(zoneIndex);
    if(left>0){toast(`Boss em cooldown: ${fmtTime(left)}.`);showZone(zoneIndex);return}
    if(!hasAmulet(b.element)){toast(`Você precisa do amuleto de ${b.element} para enfrentar este Boss.`);return}
    // Limpa resíduos de tentativas anteriores antes de criar a batalha temporária.
    cleanupBossEntries(zoneIndex);
    const tuple=bossTuple(zoneIndex),list=ZONES[zoneIndex].monsters,index=list.length;
    list.push(tuple);
    activeBoss={zoneIndex,monsterIndex:index,baseScale:scale(zoneIndex),name:b.name,element:b.element};
    originalStartBattle(zoneIndex,index);
    if(battle){battle.isBoss=true;battle.bossKills=kills(zoneIndex);battle.bossCooldown=b.cooldown;battle.bossTokenLoot=b.tokens||0}
    renderBossBattle();
  }

  function removeTemporaryBoss(){
    if(activeBoss){cleanupBossEntries(activeBoss.zoneIndex);activeBoss=null}
  }

  function bossSprite(b){const colors={earth:'#7db77b',energy:'#8fa9e8',fire:'#e27b4f',ice:'#86cde5',death:'#a18ac7'},c=colors[b.element]||'#aeb4bd';return `<svg class="arena-boss-sprite" viewBox="0 0 64 64" aria-hidden="true" shape-rendering="crispEdges"><path fill="#111318" d="M14 18h36v8h6v24H8V26h6z"/><path fill="${c}" d="M18 14h28v8h8v24H10V22h8z"/><path fill="#17191d" d="M18 30h8v8h-8zM38 30h8v8h-8z"/><path fill="#e8ebef" d="M20 31h4v4h-4zM40 31h4v4h-4z"/><path fill="#17191d" d="M24 44h16v6H24z"/><path fill="${c}" d="M8 18h8v10H8zM48 18h8v10h-8z"/></svg>`}

  function renderBossBattle(){if(!battle?.isBoss){originalRenderBattle();return}const z=ZONES[battle.zoneIndex],b=bossFor(battle.zoneIndex),pct=Math.max(0,battle.hp/battle.maxHp*100),ppct=Math.max(0,battle.playerHp/battle.playerMax*100);document.getElementById('battleArea').innerHTML=`<div class="battle-card boss-battle-card"><div class="battle-head"><div><div class="battle-zone">${esc(z.name)} · BOSS</div><h3>${esc(battle.name)}</h3></div><button class="btn" id="fleeBtn">Fugir</button></div><div class="boss-battle-warning">${b.icon} Proteção ${esc(b.element)} ativa · Boss +${battle.bossKills*5}% de força · cooldown após a vitória: ${b.cooldown}s</div><div class="battle-enemies"><div class="fighter"><div class="fighter-icon">⚔️</div><h3>${esc(game.character)}</h3><div class="hp-track"><i style="width:${ppct}%"></i></div><div class="fighter-meta">HP ${fmt(battle.playerHp)} / ${fmt(battle.playerMax)}</div></div><div class="vs">VS</div><div class="fighter boss-fighter"><div class="fighter-icon boss-fighter-icon">${bossSprite(b)}</div><h3>${esc(battle.name)}</h3><div class="hp-track"><i style="width:${pct}%"></i></div><div class="fighter-meta">HP ${fmt(battle.hp)} / ${fmt(battle.maxHp)}</div></div></div><div class="battle-log">${battle.log.join('<br>')||'O Boss elemental encara você. A batalha começou.'}</div><div class="battle-actions"><button class="btn active big" id="attackBtn">ATACAR</button></div></div>`;document.getElementById('attackBtn').onclick=attack;document.getElementById('fleeBtn').onclick=()=>{battle=null;removeTemporaryBoss();showZone(game.zone)}}
  window.renderBattle=function(){if(battle?.isBoss)renderBossBattle();else originalRenderBattle()};

  window.winBattle=function(){
    if(!battle?.isBoss){originalWinBattle();return}
    ensureState();
    const zone=battle.zoneIndex,b=bossFor(zone),tokenDrop=b.tokens||(Math.random()<b.tokenChance?1:0),oldKills=kills(zone);
    game.bossKills[key(zone)]=oldKills+1;
    game.bossCooldowns[key(zone)]=Date.now()+b.cooldown*1000;
    game.bossTokens+=tokenDrop;
    activeBoss={zoneIndex:zone,monsterIndex:battle.monsterIndex,name:b.name,tokenDrop};
    originalWinBattle();
    persist();
    updateTokenBalance();
    removeTemporaryBoss();
    const result=document.getElementById('battleArea');
    if(result){const loot=tokenDrop?`<strong class="boss-token-loot">+${tokenDrop} Boss Token${tokenDrop>1?'s':''}</strong>`:'<span>Token não caiu desta vez.</span>';result.innerHTML=`<div class="battle-empty result"><div class="battle-icon">🏆</div><div class="battle-zone">${esc(ZONES[zone].name)} · BOSS DERROTADO</div><h3>${esc(b.name)} derrotado!</h3><p><strong class="loot">Boss Token</strong> · ${loot}</p><p class="small">Cooldown: ${fmtTime(b.cooldown*1000)} · dificuldade futura +${Math.min(100,(oldKills+1)*5)}%</p><button class="btn active" id="againBtn">Voltar para a área</button></div>`;document.getElementById('againBtn').onclick=()=>showZone(game.zone)}
    activeBoss=null;
  };

  function installStyle(){if(document.getElementById('arena-boss-style'))return;const style=document.createElement('style');style.id='arena-boss-style';style.textContent=`.arena-boss-wrap{margin-top:14px;width:100%}.arena-boss-card{display:flex;align-items:center;gap:12px;padding:13px;border:1px solid #494c52;background:linear-gradient(145deg,#181a1e,#0e1012);box-shadow:inset 0 0 0 1px rgba(255,255,255,.025),0 8px 18px rgba(0,0,0,.22)}.arena-boss-card.boss-ready{border-color:#66542f}.arena-boss-card.boss-needs-amulet{opacity:.72}.arena-boss-card.boss-cooldown{opacity:.72}.boss-card-icon{width:48px;height:48px;display:grid;place-items:center;font-size:28px;border:1px solid #3c4046;background:#101216;flex:0 0 48px}.boss-card-body{flex:1;min-width:0}.boss-card-body h3{margin:2px 0 3px;color:#ddd;font-family:Cinzel,serif}.boss-card-body p{margin:0 0 4px;font-size:.72rem;color:#a5a9b0}.boss-card-body small{color:#777d86;font-size:.61rem}.boss-card-body strong{color:var(--gold2)}.arena-boss-card .btn{white-space:nowrap}.boss-timer{color:var(--gold2)}.boss-battle-warning{margin:8px 0;padding:7px 10px;border:1px solid #3b3e44;background:#131519;color:#c2c6cd;font-size:.66rem;text-align:center}.boss-fighter-icon{display:grid!important;place-items:center}.arena-boss-sprite{width:62px;height:62px;image-rendering:pixelated;filter:drop-shadow(0 3px 3px rgba(0,0,0,.8))}.boss-token-loot{color:var(--gold2)}.boss-token-shop{border-color:#51472f}.token-coming-soon{display:flex;align-items:center;gap:14px;padding:18px;border:1px dashed #51472f;background:linear-gradient(145deg,#171711,#10110e);min-height:74px}.token-coming-icon{width:48px;height:48px;display:grid;place-items:center;border:1px solid #5b4b2b;color:var(--gold2);font-size:25px;background:#15130d}.token-coming-soon strong{display:block;color:#ddd;font-family:Cinzel,serif}.token-coming-soon span{display:block;margin-top:4px;color:#777d86;font-size:.7rem}@media(max-width:620px){.arena-boss-card{align-items:flex-start;flex-wrap:wrap}.boss-card-body{min-width:calc(100% - 64px)}.arena-boss-card .btn{width:100%}.boss-battle-warning{font-size:.6rem}.token-coming-soon{align-items:flex-start}}`;document.head.appendChild(style)}

  function refreshBossTimers(){
    document.querySelectorAll('.boss-timer').forEach(el=>{
      const z=Number(el.dataset.bossZone),left=cooldownLeft(z);
      if(left<=0){showZone(game.zone)}else el.textContent=fmtTime(left)
    });
    updateTokenBalance()
  }

  installStyle();
  ensureState();
  window.arenaBosses={BOSSES,cooldownLeft,kills};
  setInterval(refreshBossTimers,1000);
})();

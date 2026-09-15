(()=>{
  if(window.__arenaPhase4)return;
  window.__arenaPhase4=true;

  const STORE='malupados_arena_phase4';
  const load=()=>{try{return JSON.parse(localStorage.getItem(STORE)||'{}')}catch{return {}}};
  const save=v=>{try{localStorage.setItem(STORE,JSON.stringify(v))}catch{}};
  const data=load();
  const esc=v=>String(v??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));

  function style(){
    if(document.getElementById('arenaPhase4Style'))return;
    const s=document.createElement('style');s.id='arenaPhase4Style';s.textContent=`
      .p4-command{margin-top:30px}.p4-command-grid{display:grid;grid-template-columns:1.25fr .75fr;gap:14px}.p4-command-card{border:1px solid #34322d;background:linear-gradient(145deg,#171816,#0c0e0f);padding:18px;position:relative;overflow:hidden}.p4-command-card:before{content:'';position:absolute;inset:0;background:radial-gradient(circle at 90% 0%,rgba(190,157,82,.10),transparent 35%);pointer-events:none}.p4-command-card h3{margin:3px 0 5px;font-family:Cinzel,serif;color:#e8dfc9}.p4-command-card p{font-size:.65rem;color:#858a8e;line-height:1.45;margin:0}.p4-goal{margin-top:13px;padding:11px;background:#101213;border:1px solid #292c2e;display:flex;align-items:center;gap:12px}.p4-goal-icon{font-size:1.45rem}.p4-goal strong{display:block;color:#ddd;font-size:.7rem}.p4-goal small{display:block;color:#777d83;font-size:.56rem;margin-top:3px}.p4-progress{height:5px;background:#25282a;margin-top:6px;overflow:hidden}.p4-progress i{display:block;height:100%;background:#b99b53}.p4-stat-row{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin-top:12px}.p4-stat{padding:9px;background:#111315;border:1px solid #292c2e;text-align:center}.p4-stat span{display:block;color:#6f7479;font-size:.5rem;text-transform:uppercase;letter-spacing:.08em}.p4-stat strong{display:block;color:#ded8ca;font-size:.82rem;margin-top:3px}.p4-forge{display:grid;grid-template-columns:auto 1fr;gap:12px;align-items:center;height:100%}.p4-forge-icon{font-size:2.5rem}.p4-forge strong{display:block;color:#e0d3ad;font-size:.72rem}.p4-forge span{display:block;color:#777d82;font-size:.58rem;line-height:1.4;margin-top:4px}.p4-forge .btn{margin-top:10px}.p4-final{margin-top:14px;border:1px solid #5b4e2d;background:linear-gradient(90deg,rgba(116,94,42,.12),rgba(20,20,18,.2));padding:10px 12px;color:#aaa;font-size:.57rem}.p4-final b{color:#d8bd76}.p4-quick{display:flex;flex-wrap:wrap;gap:7px;margin-top:12px}.p4-quick button{font:inherit}.p4-chip{padding:7px 9px;border:1px solid #303235;background:#111315;color:#9da2a6;font-size:.56rem;cursor:pointer}.p4-chip:hover{border-color:#79653a;color:#dfd0aa}.p4-modal{position:fixed;inset:0;background:rgba(0,0,0,.72);display:grid;place-items:center;z-index:9999;padding:20px}.p4-modal-box{width:min(480px,100%);background:#111314;border:1px solid #66572f;box-shadow:0 25px 80px #000;padding:20px}.p4-modal-box h3{font-family:Cinzel,serif;color:#e8dfc9;margin:0 0 6px}.p4-modal-box p{font-size:.62rem;color:#858b8f;line-height:1.5}.p4-upgrades{display:grid;gap:8px;margin:14px 0}.p4-upgrade{padding:11px;border:1px solid #2c2f31;background:#0d0f10;display:flex;justify-content:space-between;align-items:center;gap:12px}.p4-upgrade strong{display:block;color:#ddd;font-size:.65rem}.p4-upgrade small{color:#70767b;font-size:.55rem}.p4-upgrade button{border:1px solid #68582f;background:#1a1811;color:#d9c17c;padding:7px 9px;cursor:pointer;font-size:.55rem}.p4-upgrade button:disabled{opacity:.35;cursor:not-allowed}.p4-close{width:100%;margin-top:4px}.p4-complete{color:#b99b53!important;border-color:#6c5b32!important}.p4-boss-spotlight{margin-top:12px;padding:11px;border:1px solid #322f2b;background:#101213}.p4-boss-spotlight strong{display:block;color:#ddd;font-size:.65rem}.p4-boss-spotlight span{display:block;color:#777d82;font-size:.55rem;margin-top:3px}
      @media(max-width:760px){.p4-command-grid{grid-template-columns:1fr}.p4-stat-row{grid-template-columns:repeat(3,1fr)}}
    `;document.head.appendChild(s);
  }

  function ensureForge(){
    if(!game)return;
    game.forge=game.forge&&typeof game.forge==='object'?game.forge:{weapon:0,armor:0};
    game.forge.weapon=Math.max(0,Math.min(5,Number(game.forge.weapon)||0));
    game.forge.armor=Math.max(0,Math.min(5,Number(game.forge.armor)||0));
  }

  function patchBattle(){
    if(window.__arenaPhase4Battle)return;
    if(typeof window.startBattle!=='function'){setTimeout(patchBattle,80);return}
    const old=window.startBattle;
    window.startBattle=function(...args){
      const r=old.apply(this,args);
      try{
        ensureForge();
        if(battle){
          // Skill scaling uses battle.baseAttack. Add forge power to that base
          // value so the weapon upgrade cannot be overwritten by later wrappers.
          battle.baseAttack=Number(battle.baseAttack||battle.attack||0)+(game.forge.weapon*2);
          battle.attack=battle.baseAttack;
          battle.playerMax+=game.forge.armor*6;
          battle.playerHp+=game.forge.armor*6;
        }
      }catch{}
      return r;
    };
    window.__arenaPhase4Battle=true;
  }

  function forgeModal(){
    if(document.getElementById('p4ForgeModal'))return;
    ensureForge();
    const cost=w=>250*(w+1);
    const a=game.forge.weapon,b=game.forge.armor;
    const modal=document.createElement('div');modal.id='p4ForgeModal';modal.className='p4-modal';modal.innerHTML=`<div class="p4-modal-box"><div class="eyebrow">FORJA DA ARENA</div><h3>Melhore seu equipamento</h3><p>Use Gold para aplicar upgrades permanentes neste personagem. Os bônus entram nas próximas batalhas.</p><div class="p4-upgrades"><div class="p4-upgrade"><div><strong>⚔ Reforço de arma · +2 ataque</strong><small>Nível ${a}/5 · custo ${fmt(cost(a))} gold</small></div><button data-up="weapon" ${a>=5||game.gold<cost(a)?'disabled':''}>Forjar</button></div><div class="p4-upgrade"><div><strong>🛡 Reforço de armadura · +6 HP</strong><small>Nível ${b}/5 · custo ${fmt(cost(b))} gold</small></div><button data-up="armor" ${b>=5||game.gold<cost(b)?'disabled':''}>Forjar</button></div></div><div class="p4-final"><b>Progressão:</b> cada personagem possui sua própria forja e seus upgrades são salvos no navegador.</div><button class="btn p4-close">Fechar</button></div>`;
    document.body.appendChild(modal);
    modal.querySelectorAll('[data-up]').forEach(btn=>btn.onclick=()=>{const type=btn.dataset.up;ensureForge();const level=game.forge[type];const c=cost(level);if(level>=5||game.gold<c)return;game.gold-=c;game.forge[type]++;persist();toast(`Forja concluída! ${type==='weapon'?'+2 ataque':'+6 HP'}.`);modal.remove();renderAll();forgeModal()});
    modal.querySelector('.p4-close').onclick=()=>modal.remove();modal.onclick=e=>{if(e.target===modal)modal.remove()};
  }
  const fmt=n=>new Intl.NumberFormat('pt-BR').format(Math.floor(Number(n)||0));

  function command(){
    if(document.getElementById('arenaPhase4Command')||!game)return;
    ensureForge();
    const nextLevel=Math.max(2,Number(game.level||1)+1),need=typeof xpNeed==='function'?xpNeed():100,pct=Math.min(100,Number(game.xp||0)/need*100);
    const zone=typeof ZONES!=='undefined'?ZONES[Math.min(ZONES.length-1,Number(game.zone)||0)]:null;
    const nextZone=typeof ZONES!=='undefined'?ZONES[(Number(game.zone)||0)+1]:null;
    const goal=nextZone&&Number(game.level||1)<Number(nextZone.min)?`Chegar ao Level ${nextZone.min} para desbloquear ${nextZone.name}`:`Buscar o próximo Level ${nextLevel}`;
    const bossText=nextZone?`Próximo território: ${nextZone.icon} ${nextZone.name} · Level ${nextZone.min}`:'Você alcançou a última área da Arena.';
    const sec=document.createElement('section');sec.id='arenaPhase4Command';sec.className='p4-command';sec.innerHTML=`<div class="section-head"><div><div class="eyebrow">Fase Final · Centro de Comando</div><h2>Estado da sua jornada</h2></div><div class="small">Major Update concluído</div></div><div class="p4-command-grid"><article class="p4-command-card"><div class="eyebrow">Próximo objetivo</div><h3>${esc(goal)}</h3><p>${esc(bossText)}</p><div class="p4-goal"><div class="p4-goal-icon">${zone?.icon||'⚔'}</div><div style="flex:1"><strong>${esc(zone?.name||'Arena')}</strong><small>XP atual · ${fmt(game.xp)} / ${fmt(need)}</small><div class="p4-progress"><i style="width:${pct}%"></i></div></div></div><div class="p4-stat-row"><div class="p4-stat"><span>Vitórias</span><strong>${fmt(game.wins)}</strong></div><div class="p4-stat"><span>Streak</span><strong>${fmt(game.streak)}</strong></div><div class="p4-stat"><span>Forja</span><strong>${game.forge.weapon+game.forge.armor}/10</strong></div></div><div class="p4-quick"><button class="p4-chip" id="p4ScrollMap">🗺 Ver mapa</button><button class="p4-chip" id="p4ForgeBtn">⚒ Abrir forja</button><button class="p4-chip" id="p4ScrollCodex">📖 Abrir crônicas</button></div></article><article class="p4-command-card"><div class="p4-forge"><div class="p4-forge-icon">⚒</div><div><div class="eyebrow">Sistema final</div><strong>Forja agora está funcional</strong><span>Transforme o Gold conquistado em progressão permanente de ataque e sobrevivência.</span><button class="btn" id="p4ForgeBtn2">Abrir Forja</button></div></div><div class="p4-boss-spotlight"><strong>☠️ Próximo grande alvo</strong><span>${esc(nextZone?`Explore ${nextZone.name} e avance rumo ao próximo Boss.`:'Deathbringer aguarda no fim da jornada.')}</span></div><div class="p4-final"><b>Major Update:</b> visual, mapa, combate, Skill, Bosses, bestiário, conquistas, raridade, loot e forja integrados em uma única progressão.</div></article></div>`;
    const anchor=document.querySelector('.progress-section');if(anchor)anchor.insertAdjacentElement('beforebegin',sec);else document.querySelector('main')?.appendChild(sec);
    ['p4ForgeBtn','p4ForgeBtn2'].forEach(id=>document.getElementById(id)?.addEventListener('click',forgeModal));
    document.getElementById('p4ScrollMap')?.addEventListener('click',()=>document.querySelector('.map')?.scrollIntoView({behavior:'smooth',block:'center'}));
    document.getElementById('p4ScrollCodex')?.addEventListener('click',()=>document.getElementById('arenaPhase3Codex')?.scrollIntoView({behavior:'smooth',block:'center'}));
  }

  function refresh(){
    const sec=document.getElementById('arenaPhase4Command');if(!sec||!game)return;
    const goal=sec.querySelector('h3');const zone=typeof ZONES!=='undefined'?ZONES[Math.min(ZONES.length-1,Number(game.zone)||0)]:null;const nextZone=typeof ZONES!=='undefined'?ZONES[(Number(game.zone)||0)+1]:null;const need=typeof xpNeed==='function'?xpNeed():100;const pct=Math.min(100,Number(game.xp||0)/need*100);if(goal)goal.textContent=nextZone&&game.level<nextZone.min?`Chegar ao Level ${nextZone.min} para desbloquear ${nextZone.name}`:`Buscar o próximo Level ${Number(game.level||1)+1}`;const prog=sec.querySelector('.p4-progress i');if(prog)prog.style.width=pct+'%';const stats=sec.querySelectorAll('.p4-stat strong');if(stats[0])stats[0].textContent=fmt(game.wins);if(stats[1])stats[1].textContent=fmt(game.streak);if(stats[2])stats[2].textContent=`${game.forge.weapon+game.forge.armor}/10`;
  }

  style();patchBattle();
  const boot=setInterval(()=>{if(game){ensureForge();command();refresh()}},700);setTimeout(()=>clearInterval(boot),180000);
})();

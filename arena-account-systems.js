// Sistemas de conta da Arena: Perfil + Conquistas + Ranking local.
// Fonte única: o mesmo objeto `game` usado pelo combate e pelo Bestiário.
(()=>{
  const STYLE='arena-account-systems-style';
  const MODAL='arenaAccountModal';
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const fmt=n=>new Intl.NumberFormat('pt-BR').format(Math.floor(Number(n)||0));
  const totalXp=()=>{if(typeof game==='undefined'||!game)return 0;const l=Math.max(1,Number(game.level)||1),x=Math.max(0,Number(game.xp)||0),c=l-1;return Math.floor(100*c+65*c*(c-1)/2+x)};
  const reqBestiary=name=>String(name)==='Deathbringer'?5:25;
  const bestiaryData=()=>game&&game.bestiary&&typeof game.bestiary==='object'?game.bestiary:{};
  const bestiaryKills=name=>Math.max(0,Number(bestiaryData()?.[name]?.kills ?? bestiaryData()?.[name])||0);
  const bestiaryNames=()=>Object.keys(bestiaryData());
  const completedBestiary=()=>bestiaryNames().filter(n=>bestiaryKills(n)>=reqBestiary(n)).length;
  const bestiaryTotal=()=>bestiaryNames().reduce((a,n)=>a+bestiaryKills(n),0);

  const ACHIEVEMENTS=[
    {id:'first-victory',icon:'⚔️',title:'Primeiro Sangue',desc:'Vença sua primeira batalha.',goal:1,value:()=>Number(game?.wins)||0},
    {id:'hunter-100',icon:'☠️',title:'Caçador',desc:'Derrote 100 criaturas.',goal:100,value:()=>Number(game?.kills)||0},
    {id:'hunter-1000',icon:'💀',title:'Ceifador',desc:'Derrote 1.000 criaturas.',goal:1000,value:()=>Number(game?.kills)||0},
    {id:'hunter-10000',icon:'👑',title:'Lenda da Arena',desc:'Derrote 10.000 criaturas.',goal:10000,value:()=>Number(game?.kills)||0},
    {id:'level-10',icon:'⭐',title:'Veterano',desc:'Alcance o Level 10.',goal:10,value:()=>Number(game?.level)||0},
    {id:'level-35',icon:'🔥',title:'Senhor do Abismo',desc:'Alcance o Level 35.',goal:35,value:()=>Number(game?.level)||0},
    {id:'gold-10000',icon:'💰',title:'Magnata',desc:'Acumule 10.000 gold.',goal:10000,value:()=>Number(game?.gold)||0},
    {id:'wins-100',icon:'🏆',title:'Campeão',desc:'Vença 100 batalhas.',goal:100,value:()=>Number(game?.wins)||0},
    {id:'streak-25',icon:'🔥',title:'Sem Parar',desc:'Alcance uma streak de 25 vitórias.',goal:25,value:()=>Number(game?.bestStreak)||0},
    {id:'bestiary-1',icon:'📖',title:'Estudioso',desc:'Complete 1 criatura no Bestiário.',goal:1,value:completedBestiary},
    {id:'bestiary-10',icon:'📚',title:'Colecionador',desc:'Complete 10 criaturas no Bestiário.',goal:10,value:completedBestiary},
    {id:'bestiary-all',icon:'👑',title:'Mestre do Bestiário',desc:'Complete todas as criaturas registradas.',goal:16,value:completedBestiary}
  ];
  function achievementState(){
    if(!game.achievements||typeof game.achievements!=='object')game.achievements={};
    if(!game.achievementUnlocked||typeof game.achievementUnlocked!=='object')game.achievementUnlocked={};
    return game.achievements;
  }
  function syncAchievements(save=true){
    if(typeof game==='undefined'||!game)return;
    const state=achievementState();
    let changed=false;
    ACHIEVEMENTS.forEach(a=>{
      const value=Math.max(0,Number(a.value())||0);
      state[a.id]={progress:value,goal:a.goal,completed:value>=a.goal};
      if(value>=a.goal&&!game.achievementUnlocked[a.id]){
        game.achievementUnlocked[a.id]=Date.now();
        changed=true;
        if(typeof toast==='function')toast(`CONQUISTA! ${a.title}`);
      }
    });
    if(changed&&save&&typeof persist==='function')persist();
  }
  function derived(){
    const level=Math.max(1,Number(game?.level)||1),weapon=Number(game?.weapon)||0,armor=Number(game?.armor)||0;
    let atk=15+level*4+weapon*3,def=armor*3,hp=110+level*12+def;
    if(game?.shopEquipped&&typeof SHOP_ITEMS!=='undefined'){
      Object.values(game.shopEquipped).flat().forEach(id=>{const item=SHOP_ITEMS.find(x=>x&&x.id===id);const bonus=String(item?.bonus||'');const m=bonus.match(/([+-]?\d+)\s*(?:ATK|Ataque|DEF|Defesa|HP|Vida)/i);if(!m)return;const n=Number(m[1])||0;if(/atk|ataque/i.test(bonus))atk+=n;if(/def|defesa/i.test(bonus))def+=n;if(/hp|vida/i.test(bonus))hp+=n;});
    }
    return {atk,def,hp};
  }
  function records(){
    let all={};try{all=JSON.parse(localStorage.getItem('malupados_arena_v1')||'{}')}catch{}
    if(typeof game!=='undefined'&&game?.character)all[game.character]=game;
    return Object.entries(all).map(([character,g])=>({character,level:Number(g?.level)||1,xp:totalXpFor(g),gold:Number(g?.gold)||0,kills:Number(g?.kills)||0,wins:Number(g?.wins)||0,bestStreak:Number(g?.bestStreak)||0,damage:Number(g?.damage)||0,bestiary:countCompleteFor(g)}));
  }
  function totalXpFor(g){const l=Math.max(1,Number(g?.level)||1),x=Math.max(0,Number(g?.xp)||0),c=l-1;return Math.floor(100*c+65*c*(c-1)/2+x)}
  function countCompleteFor(g){const b=g?.bestiary&&typeof g.bestiary==='object'?g.bestiary:{};return Object.keys(b).filter(n=>Math.max(0,Number(b[n]?.kills??b[n])||0)>=reqBestiary(n)).length}
  function installStyle(){
    if(document.getElementById(STYLE))return;
    const s=document.createElement('style');s.id=STYLE;s.textContent=`
      .arena-account-tools{display:flex;gap:7px;flex-wrap:wrap;margin-top:12px}.arena-account-tools button{border:1px solid #494d53;background:linear-gradient(180deg,#25282d,#15171a);color:#d8dbe0;padding:8px 10px;border-radius:3px;font:800 .62rem Inter,sans-serif;letter-spacing:.7px;text-transform:uppercase;cursor:pointer}.arena-account-tools button:hover{border-color:#b48b3c;color:#f1d28b}.arena-account-modal{position:fixed;inset:0;z-index:99990;background:rgba(5,6,8,.86);backdrop-filter:blur(5px);display:flex;align-items:center;justify-content:center;padding:18px}.arena-account-window{width:min(980px,100%);max-height:92vh;overflow:auto;background:linear-gradient(145deg,#17191d,#0d0f12);border:1px solid #4a4e55;box-shadow:0 24px 80px rgba(0,0,0,.65);border-radius:6px}.arena-account-head{position:sticky;top:0;z-index:2;display:flex;align-items:center;justify-content:space-between;padding:15px 18px;background:#121417;border-bottom:1px solid #34383e}.arena-account-head h2{margin:0;color:#e6c36b;font:900 1.05rem Cinzel,serif}.arena-account-close{background:none;border:0;color:#aeb3bb;font-size:1.5rem;cursor:pointer}.arena-account-tabs{display:flex;gap:4px;padding:10px 14px;border-bottom:1px solid #292d32;background:#101215;overflow:auto}.arena-account-tabs button{white-space:nowrap;border:1px solid #353940;background:#17191d;color:#aeb3bb;padding:8px 12px;border-radius:3px;font:800 .63rem Inter,sans-serif;text-transform:uppercase;cursor:pointer}.arena-account-tabs button.active{color:#f0cf78;border-color:#9a7637;background:#211c13}.arena-account-body{padding:18px}.arena-profile-hero{display:grid;grid-template-columns:1fr auto;gap:15px;align-items:center;padding:17px;border:1px solid #363a40;background:radial-gradient(circle at 15% 30%,#24262b,#111316 62%);margin-bottom:14px}.arena-profile-name{font:900 1.5rem Cinzel,serif;color:#e9c76d}.arena-profile-class{color:#8f959e;font-size:.75rem;margin-top:3px}.arena-level-badge{border:1px solid #6c562e;color:#edcb76;padding:9px 12px;text-align:center;font:900 .72rem Inter,sans-serif}.arena-level-badge strong{display:block;font-size:1.25rem}.arena-stat-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:9px}.arena-stat{padding:12px;border:1px solid #30343a;background:#141619}.arena-stat span{display:block;color:#777e87;font-size:.58rem;text-transform:uppercase;letter-spacing:.6px}.arena-stat strong{display:block;color:#e0e3e7;font-size:1rem;margin-top:5px}.arena-account-section{margin-top:14px}.arena-account-section h3{font:800 .75rem Cinzel,serif;color:#c7cbd1;text-transform:uppercase;letter-spacing:1px;margin:0 0 8px}.arena-achievement-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}.arena-achievement{padding:12px;border:1px solid #34383e;background:#141619}.arena-achievement.done{border-color:#7e6332;background:linear-gradient(145deg,#211c13,#141619)}.arena-achievement-top{display:flex;gap:9px;align-items:center}.arena-achievement-icon{font-size:1.35rem}.arena-achievement-title{font-weight:800;color:#d8dbe0;font-size:.78rem}.arena-achievement-desc{color:#858b94;font-size:.65rem;margin-top:3px}.arena-achievement-progress{height:5px;background:#282c31;margin-top:9px;overflow:hidden}.arena-achievement-progress i{display:block;height:100%;background:#b48b3c}.arena-achievement-meta{display:flex;justify-content:space-between;margin-top:5px;color:#747a83;font-size:.58rem}.arena-rank-table{width:100%;border-collapse:collapse}.arena-rank-table th,.arena-rank-table td{padding:10px 8px;border-bottom:1px solid #292d32;text-align:left;font-size:.68rem}.arena-rank-table th{color:#777e87;text-transform:uppercase;font-size:.55rem}.arena-rank-table td{color:#d5d8dc}.arena-rank-table tr.current td{color:#f0ce78}.arena-rank-number{width:35px;font-weight:900;color:#888}.arena-rank-select{margin-bottom:10px;background:#17191d;border:1px solid #3b3f45;color:#d5d8dc;padding:8px;border-radius:3px}.arena-feats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.arena-feat{border:1px solid #30343a;background:#141619;padding:10px}.arena-feat span{display:block;color:#777e87;font-size:.55rem;text-transform:uppercase}.arena-feat strong{display:block;color:#d8dbe0;font-size:.8rem;margin-top:4px}@media(max-width:650px){.arena-account-modal{padding:8px}.arena-account-body{padding:12px}.arena-stat-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.arena-achievement-grid{grid-template-columns:1fr}.arena-feats{grid-template-columns:repeat(2,minmax(0,1fr))}.arena-profile-hero{grid-template-columns:1fr}}
    `;document.head.appendChild(s);
  }
  function ensureTools(){
    const host=document.querySelector('.game-topbar');if(!host||document.getElementById('arenaAccountTools'))return;
    const box=document.createElement('div');box.id='arenaAccountTools';box.className='arena-account-tools';box.innerHTML='<button type="button" data-account="profile">Perfil</button><button type="button" data-account="achievements">Conquistas</button><button type="button" data-account="ranking">Ranking</button>';
    host.appendChild(box);box.querySelectorAll('button').forEach(b=>b.onclick=()=>openModal(b.dataset.account));
  }
  function modal(){
    let m=document.getElementById(MODAL);if(m)return m;
    m=document.createElement('div');m.id=MODAL;m.className='arena-account-modal';m.innerHTML='<div class="arena-account-window"><div class="arena-account-head"><h2 id="arenaAccountTitle">Perfil</h2><button class="arena-account-close" aria-label="Fechar">×</button></div><div class="arena-account-tabs"><button data-tab="profile">Perfil</button><button data-tab="achievements">Conquistas</button><button data-tab="ranking">Ranking</button></div><div class="arena-account-body" id="arenaAccountBody"></div></div>';
    document.body.appendChild(m);m.querySelector('.arena-account-close').onclick=()=>m.remove();m.addEventListener('click',e=>{if(e.target===m)m.remove()});m.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>renderTab(b.dataset.tab));return m;
  }
  function renderProfile(){
    const d=derived(),v=(typeof members!=='undefined'&&Array.isArray(members)?members.find(x=>x.name===game.character):null)||{};
    syncAchievements(false);
    return `<div class="arena-profile-hero"><div><div class="arena-profile-name">${esc(game.character)}</div><div class="arena-profile-class">${esc(v.vocation||'Aventureiro')} · Arena</div></div><div class="arena-level-badge">LEVEL<strong>${fmt(game.level)}</strong></div></div><div class="arena-stat-grid"><div class="arena-stat"><span>⚔ Ataque</span><strong>${fmt(d.atk)}</strong></div><div class="arena-stat"><span>🛡 Defesa</span><strong>${fmt(d.def)}</strong></div><div class="arena-stat"><span>❤️ Vida</span><strong>${fmt(d.hp)}</strong></div><div class="arena-stat"><span>⭐ XP total</span><strong>${fmt(totalXp())}</strong></div><div class="arena-stat"><span>💰 Gold</span><strong>${fmt(game.gold)}</strong></div><div class="arena-stat"><span>⚔ Kills</span><strong>${fmt(game.kills)}</strong></div><div class="arena-stat"><span>🏆 Vitórias</span><strong>${fmt(game.wins)}</strong></div><div class="arena-stat"><span>🔥 Melhor streak</span><strong>${fmt(game.bestStreak)}</strong></div></div><div class="arena-account-section"><h3>Estatísticas da conta</h3><div class="arena-feats"><div class="arena-feat"><span>Dano causado</span><strong>${fmt(game.damage)}</strong></div><div class="arena-feat"><span>Bestiários completos</span><strong>${fmt(completedBestiary())}</strong></div><div class="arena-feat"><span>Conquistas</span><strong>${fmt(ACHIEVEMENTS.filter(a=>Number(a.value())>=a.goal).length)} / ${ACHIEVEMENTS.length}</strong></div></div></div><div class="arena-account-section"><h3>Maiores feitos no Bestiário</h3><div class="arena-feats">${bestiaryNames().sort((a,b)=>bestiaryKills(b)-bestiaryKills(a)).slice(0,6).map(n=>`<div class="arena-feat"><span>${esc(n)}</span><strong>${fmt(bestiaryKills(n))} / ${reqBestiary(n)}</strong></div>`).join('')||'<div class="arena-feat"><span>Bestiário</span><strong>Nenhum registro ainda</strong></div>'}</div></div>`;
  }
  function renderAchievements(){
    syncAchievements(false);
    return `<div class="arena-account-section" style="margin-top:0"><h3>Conquistas da Arena</h3><p style="color:#777e87;font-size:.68rem;margin:0 0 12px">Cada conquista acompanha o progresso da conta. Depois de desbloqueada, continua marcada como concluída.</p><div class="arena-achievement-grid">${ACHIEVEMENTS.map(a=>{const val=Math.max(0,Number(a.value())||0),done=val>=a.goal,pct=Math.min(100,val/a.goal*100);return `<div class="arena-achievement ${done?'done':''}"><div class="arena-achievement-top"><div class="arena-achievement-icon">${a.icon}</div><div><div class="arena-achievement-title">${esc(a.title)} ${done?'✓':''}</div><div class="arena-achievement-desc">${esc(a.desc)}</div></div></div><div class="arena-achievement-progress"><i style="width:${pct}%"></i></div><div class="arena-achievement-meta"><span>${fmt(Math.min(val,a.goal))} / ${fmt(a.goal)}</span><span>${done?'CONCLUÍDA':fmt(Math.round(pct))+'%'}</span></div></div>`}).join('')}</div></div>`;
  }
  function renderRanking(){
    const rows=records();
    return `<div class="arena-account-section" style="margin-top:0"><h3>Ranking deste navegador</h3><p style="color:#777e87;font-size:.68rem;margin:0 0 12px">Compara os personagens salvos neste navegador. Ranking global entre jogadores exige uma conta/backend e fica para a próxima fase.</p><select class="arena-rank-select" id="arenaRankMetric"><option value="level">Level</option><option value="xp">XP total</option><option value="kills">Criaturas derrotadas</option><option value="gold">Gold</option><option value="wins">Vitórias</option><option value="bestStreak">Melhor streak</option><option value="bestiary">Bestiários completos</option></select><table class="arena-rank-table"><thead><tr><th>#</th><th>Personagem</th><th>Valor</th><th>Level</th></tr></thead><tbody id="arenaRankRows"></tbody></table></div>`;
  }
  function fillRanking(){
    const sel=document.getElementById('arenaRankMetric'),body=document.getElementById('arenaRankRows');if(!sel||!body)return;const key=sel.value,rows=records().sort((a,b)=>(b[key]||0)-(a[key]||0));body.innerHTML=rows.map((r,i)=>`<tr class="${r.character===game.character?'current':''}"><td class="arena-rank-number">${i+1}</td><td>${esc(r.character)}</td><td>${fmt(r[key])}</td><td>${fmt(r.level)}</td></tr>`).join('')||'<tr><td colspan="4">Nenhum personagem salvo.</td></tr>';
  }
  function renderTab(tab){
    const m=modal(),title=m.querySelector('#arenaAccountTitle'),body=m.querySelector('#arenaAccountBody');m.querySelectorAll('[data-tab]').forEach(b=>b.classList.toggle('active',b.dataset.tab===tab));title.textContent=tab==='profile'?'Perfil':tab==='achievements'?'Conquistas':'Ranking';body.innerHTML=tab==='profile'?renderProfile():tab==='achievements'?renderAchievements():renderRanking();if(tab==='ranking'){const sel=document.getElementById('arenaRankMetric');sel.onchange=fillRanking;fillRanking()}}
  function openModal(tab='profile'){if(typeof game==='undefined'||!game)return;installStyle();ensureTools();syncAchievements();modal();renderTab(tab)}
  function tick(){if(typeof game==='undefined'||!game)return;installStyle();ensureTools();syncAchievements(false)}
  function init(){installStyle();ensureTools();setInterval(tick,1200);window.addEventListener('arena:bestiary-kill',()=>{syncAchievements();if(document.getElementById(MODAL)&&document.querySelector('[data-tab="profile"].active'))renderTab('profile')});document.addEventListener('keydown',e=>{if(e.key==='Escape')document.getElementById(MODAL)?.remove()});}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
  window.arenaAccount={open:openModal,syncAchievements};
})();

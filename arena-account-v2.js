// Arena Account V2 — Perfil + Conquistas + Ranking.
// Responsabilidade única: toda a área de conta da Arena vive neste arquivo.
// O módulo cria seu próprio modal, abas, estilos, perfil, conquistas e ranking.
(()=>{
  if(window.__arenaAccountV2)return;
  window.__arenaAccountV2=true;

  const STYLE='arena-account-v2-style';
  const MODAL='arenaAccountV2Modal';
  const SUPABASE_URL='https://tylyfkwfoqwsnrotmvzt.supabase.co';
  const SUPABASE_KEY='sb_publishable_SGwpPSRttuKAAI4pm2xi5g_Bd3mW95F';
  const FUNCTION_URL=SUPABASE_URL+'/functions/v1/arena-sync-ranking';
  const SYNC_INTERVAL=30000;
  const CREATURES=['Rat','Troll','Orc','Orc Berserker','Orc Rider','Cyclops','Scorpion','Ancient Scarab','Dragon Hatchling','Dragon','Dragon Lord','Frost Dragon','Demon Skeleton','Hellhound','Demon','Deathbringer'];
  const fmt=n=>new Intl.NumberFormat('pt-BR').format(Math.floor(Number(n)||0));
  const num=v=>Math.max(0,Number(v)||0);
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const req=n=>String(n)==='Deathbringer'?5:25;
  const totalXp=g=>{const l=Math.max(1,Number(g?.level)||1),x=Math.max(0,Number(g?.xp)||0),c=l-1;return Math.floor(100*c+65*c*(c-1)/2+x)};
  const bestiary=g=>g?.bestiary&&typeof g.bestiary==='object'?g.bestiary:{};
  const bk=(g,n)=>num(bestiary(g)?.[n]?.kills??bestiary(g)?.[n]);
  const complete=g=>Object.keys(bestiary(g)).filter(n=>bk(g,n)>=req(n)).length;
  const bosses=g=>Math.floor(num(g?.bossKills??g?.bossesDefeated));

  const ACH=[
    ['combat','⚔️','Primeiro Sangue','Vença sua primeira batalha.',1,()=>num(game?.wins),'comum'],
    ['combat','☠️','Caçador','Derrote 100 criaturas.',100,()=>num(game?.kills),'comum'],
    ['combat','💀','Ceifador','Derrote 1.000 criaturas.',1000,()=>num(game?.kills),'raro'],
    ['combat','👑','Lenda da Arena','Derrote 10.000 criaturas.',10000,()=>num(game?.kills),'épico'],
    ['combat','🔥','Carnificina','Derrote 100.000 criaturas.',100000,()=>num(game?.kills),'lendário'],
    ['combat','🏆','Campeão','Vença 100 batalhas.',100,()=>num(game?.wins),'raro'],
    ['combat','🔥','Sem Parar','Alcance streak de 25.',25,()=>num(game?.bestStreak),'raro'],
    ['progress','⭐','Veterano','Alcance o Level 10.',10,()=>num(game?.level),'comum'],
    ['progress','🔥','Senhor do Abismo','Alcance o Level 35.',35,()=>num(game?.level),'épico'],
    ['economy','💰','Magnata','Tenha 10.000 gold.',10000,()=>num(game?.gold),'raro'],
    ['bestiary','📖','Estudioso','Complete 1 Bestiário.',1,()=>complete(game),'comum'],
    ['bestiary','📚','Colecionador','Complete 10 Bestiários.',10,()=>complete(game),'raro'],
    ['bestiary','👑','Mestre do Bestiário','Complete 16 Bestiários.',16,()=>complete(game),'lendário'],
    ['boss','💀','Caçador de Bosses','Derrote 1 boss.',1,()=>bosses(game),'raro'],
    ['boss','👑','Senhor dos Bosses','Derrote 5 bosses.',5,()=>bosses(game),'lendário']
  ].map((x,i)=>({id:'a'+i,cat:x[0],icon:x[1],title:x[2],desc:x[3],goal:x[4],value:x[5],rarity:x[6]}));
  const CATS={all:'Todas',combat:'Combate',progress:'Progressão',bestiary:'Bestiário',economy:'Economia',boss:'Bosses'};
  const METRICS={
    level:{label:'Level',icon:'⭐',get:r=>r.level},xp:{label:'XP total',icon:'✨',get:r=>r.totalXp},kills:{label:'Kills',icon:'☠️',get:r=>r.kills},
    gold:{label:'Gold',icon:'💰',get:r=>r.gold},wins:{label:'Vitórias',icon:'🏆',get:r=>r.wins},streak:{label:'Melhor streak',icon:'🔥',get:r=>r.streak},
    bestiary:{label:'Bestiários',icon:'📖',get:r=>r.bestiary},achievements:{label:'Conquistas',icon:'🏅',get:r=>r.achievements},damage:{label:'Dano',icon:'⚔️',get:r=>r.damage}
  };
  const state=()=>{if(!game.achievementsV2)game.achievementsV2={};return game.achievementsV2};
  let currentMetric='level',currentCreature='Rat',globalCache=null,cacheAt=0,syncBusy=false,lastSyncSignature='',renderToken=0;

  function syncAchievements(){
    if(typeof game==='undefined'||!game)return;
    const s=state();let changed=false;
    ACH.forEach(a=>{const v=Math.max(0,Number(a.value())||0),done=v>=a.goal;if(!s[a.id])s[a.id]={};s[a.id].progress=v;s[a.id].completed=done;if(done&&!s[a.id].unlockedAt){s[a.id].unlockedAt=Date.now();changed=true}});
    if(changed&&typeof persist==='function')persist();
  }

  function installStyle(){
    if(document.getElementById(STYLE))return;
    const s=document.createElement('style');s.id=STYLE;s.textContent=`
      .arena-account-v2{position:fixed;inset:0;z-index:99990;background:rgba(5,6,8,.88);backdrop-filter:blur(5px);display:flex;align-items:center;justify-content:center;padding:18px}
      .arena-account-v2-window{width:min(1050px,100%);max-height:92vh;overflow:auto;background:linear-gradient(145deg,#17191d,#0d0f12);border:1px solid #4a4e55;box-shadow:0 24px 80px rgba(0,0,0,.65);border-radius:6px}
      .arena-account-v2-head{position:sticky;top:0;z-index:3;display:flex;align-items:center;justify-content:space-between;padding:15px 18px;background:#121417;border-bottom:1px solid #34383e}
      .arena-account-v2-head h2{margin:0;color:#e6c36b;font:900 1.05rem Cinzel,serif}.arena-account-v2-close{background:none;border:0;color:#aeb3bb;font-size:1.5rem;cursor:pointer}
      .arena-account-v2-tabs{display:flex;gap:4px;padding:10px 14px;border-bottom:1px solid #292d32;background:#101215;overflow:auto}.arena-account-v2-tabs button{white-space:nowrap;border:1px solid #353940;background:#17191d;color:#aeb3bb;padding:8px 12px;border-radius:3px;font:800 .63rem Inter,sans-serif;text-transform:uppercase;cursor:pointer}.arena-account-v2-tabs button.active{color:#f0cf78;border-color:#9a7637;background:#211c13}
      .arena-account-v2-body{padding:18px;min-height:220px}.arena-account-v2-tools{display:flex;gap:7px;flex-wrap:wrap;margin-top:12px}.arena-account-v2-tools button{border:1px solid #494d53;background:linear-gradient(180deg,#25282d,#15171a);color:#d8dbe0;padding:8px 10px;border-radius:3px;font:800 .62rem Inter,sans-serif;letter-spacing:.7px;text-transform:uppercase;cursor:pointer}.arena-account-v2-tools button:hover{border-color:#b48b3c;color:#f1d28b}
      .arena-profile-hero{display:grid;grid-template-columns:1fr auto;gap:15px;align-items:center;padding:17px;border:1px solid #363a40;background:radial-gradient(circle at 15% 30%,#24262b,#111316 62%);margin-bottom:14px}.arena-profile-name{font:900 1.5rem Cinzel,serif;color:#e9c76d}.arena-profile-class{color:#8f959e;font-size:.75rem;margin-top:3px}.arena-level-badge{border:1px solid #6c562e;color:#edcb76;padding:9px 12px;text-align:center;font:900 .72rem Inter,sans-serif}.arena-level-badge strong{display:block;font-size:1.25rem}
      .arena-stat-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:9px}.arena-stat{padding:12px;border:1px solid #30343a;background:#141619}.arena-stat span{display:block;color:#777e87;font-size:.58rem;text-transform:uppercase;letter-spacing:.6px}.arena-stat strong{display:block;color:#e0e3e7;font-size:1rem;margin-top:5px}.arena-account-section{margin-top:14px}.arena-account-section h3{font:800 .75rem Cinzel,serif;color:#c7cbd1;text-transform:uppercase;letter-spacing:1px;margin:0 0 8px}.arena-feats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.arena-feat{border:1px solid #30343a;background:#141619;padding:10px}.arena-feat span{display:block;color:#777e87;font-size:.55rem;text-transform:uppercase}.arena-feat strong{display:block;color:#d8dbe0;font-size:.8rem;margin-top:4px}
      .arena-profile-xp{margin:0 0 14px;padding:12px 14px;border:1px solid #34383e;background:#121417}.arena-profile-xp-head{display:flex;justify-content:space-between;color:#969ca5;font-size:.6rem;text-transform:uppercase;letter-spacing:.7px}.arena-profile-xp-head strong{color:#e4c36c}.arena-profile-xp-track{height:7px;margin-top:8px;background:#292d32;overflow:hidden;border:1px solid #0b0c0e}.arena-profile-xp-track i{display:block;height:100%;background:linear-gradient(90deg,#80612d,#d7b55d)}
      .arena-profile-detail-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.arena-profile-detail{border:1px solid #30343a;background:#141619;padding:12px}.arena-profile-detail h4{margin:0 0 9px;color:#c8ccd2;font:800 .68rem Cinzel,serif;text-transform:uppercase;letter-spacing:.8px}.arena-equip-mini{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px}.arena-equip-mini div{min-width:0;padding:7px 5px;border:1px solid #292d32;background:#101215;text-align:center}.arena-equip-mini span{display:block;color:#727983;font-size:.48rem;text-transform:uppercase}.arena-equip-mini strong{display:block;margin-top:3px;color:#d5d8dc;font-size:.55rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.arena-combat-line{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #292d32;color:#858b94;font-size:.62rem}.arena-combat-line:last-child{border-bottom:0}.arena-combat-line b{color:#e0e3e7}
      .achv-v2-head{display:flex;justify-content:space-between;align-items:end;gap:12px;margin-bottom:14px}.achv-v2-total{font-size:.62rem;color:#858b94}.achv-v2-total strong{color:#e5c46d;font-size:1rem}.achv-v2-filters{display:flex;gap:5px;overflow:auto;margin-bottom:12px}.achv-v2-filters button,.rank-v2-metrics button,.rank-v2-creature{border:1px solid #353940;background:#17191d;color:#9ca2aa;padding:7px 10px;border-radius:3px;font:800 .58rem Inter,sans-serif;text-transform:uppercase;white-space:nowrap;cursor:pointer}.achv-v2-filters button.active,.rank-v2-metrics button.active,.rank-v2-creature:focus{border-color:#9a7637;color:#f0ce78;background:#211c13}.achv-v2-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}.achv-v2-card{border:1px solid #30343a;background:#141619;padding:12px;overflow:hidden}.achv-v2-card.done{border-color:#806533;background:linear-gradient(145deg,#211c13,#141619)}.achv-v2-card.locked{opacity:.62}.achv-v2-top{display:flex;gap:9px;align-items:center}.achv-v2-icon{width:35px;height:35px;display:grid;place-items:center;border:1px solid #34383e;background:#101215;font-size:1.15rem}.achv-v2-card.done .achv-v2-icon{border-color:#8a6b35}.achv-v2-name{color:#dfe2e6;font-size:.76rem;font-weight:900}.achv-v2-desc{color:#7e858e;font-size:.6rem;margin-top:2px}.achv-v2-rarity{font-size:.52rem;text-transform:uppercase;font-weight:900;letter-spacing:.7px;margin-top:3px}.achv-v2-bar{height:5px;background:#292d32;margin-top:10px}.achv-v2-bar i{display:block;height:100%;background:#b48b3c}.achv-v2-meta{display:flex;justify-content:space-between;margin-top:5px;color:#777e87;font-size:.55rem}.achv-v2-reward{margin-top:7px;color:#b89b5b;font-size:.55rem}.achv-v2-title{display:inline-block;margin-top:8px;padding:4px 7px;border:1px solid #51462e;color:#d8bb70;font-size:.53rem;text-transform:uppercase}.achv-v2-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:12px}.achv-v2-stat{padding:8px;border:1px solid #30343a;background:#141619;text-align:center}.achv-v2-stat span{display:block;color:#777e87;font-size:.5rem;text-transform:uppercase}.achv-v2-stat b{display:block;color:#e0e3e7;font-size:.9rem;margin-top:3px}
      .rank-v2-head{display:flex;justify-content:space-between;align-items:end;gap:12px;margin-bottom:12px}.rank-v2-title{font:900 .86rem Cinzel,serif;color:#d9bd70;text-transform:uppercase;letter-spacing:.8px}.rank-v2-sub{color:#727983;font-size:.58rem;margin-top:3px}.rank-v2-local{border:1px solid #66532f;color:#cdb16c;padding:6px 8px;font:800 .52rem Inter,sans-serif;text-transform:uppercase}.rank-v2-metrics{display:flex;gap:5px;overflow:auto;margin-bottom:10px;padding-bottom:2px}.rank-v2-creature-wrap{display:none;margin-bottom:10px}.rank-v2-creature-wrap.show{display:flex;gap:7px;align-items:center}.rank-v2-creature-wrap label{color:#777e87;font-size:.55rem;text-transform:uppercase}.rank-v2-podium{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin-bottom:12px}.rank-v2-podium-card{border:1px solid #34383e;background:#141619;padding:10px;text-align:center;min-width:0}.rank-v2-podium-card:first-child{border-color:#8b6b31;background:linear-gradient(145deg,#251f14,#141619)}.rank-v2-podium-pos{font:900 .62rem Inter,sans-serif;color:#777e87}.rank-v2-podium-name{font:900 .76rem Cinzel,serif;color:#dedfe2;margin-top:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.rank-v2-podium-voc{font-size:.53rem;color:#777e87;margin-top:2px}.rank-v2-podium-value{font:900 1rem Inter,sans-serif;color:#e6c56f;margin-top:6px}.rank-v2-table{width:100%;border-collapse:collapse}.rank-v2-table th,.rank-v2-table td{padding:9px 7px;border-bottom:1px solid #292d32;text-align:left}.rank-v2-table th{color:#707780;font:800 .51rem Inter,sans-serif;text-transform:uppercase;letter-spacing:.5px}.rank-v2-table td{color:#d3d6da;font-size:.64rem}.rank-v2-table tr.current td{color:#f0ce78}.rank-v2-pos{width:34px;font-weight:900;color:#777e87}.rank-v2-char{font-weight:800}.rank-v2-voc{display:block;color:#707780;font-size:.52rem;font-weight:400;margin-top:2px}.rank-v2-value{text-align:right!important;font-weight:900;color:#d9b963!important}.rank-v2-empty{padding:20px;text-align:center;border:1px dashed #34383e;color:#777e87;font-size:.65rem}
      @media(max-width:650px){.arena-account-v2{padding:8px}.arena-account-v2-body{padding:12px}.arena-stat-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.arena-feats{grid-template-columns:repeat(2,minmax(0,1fr))}.arena-profile-detail-grid{grid-template-columns:1fr}.arena-equip-mini{grid-template-columns:repeat(2,minmax(0,1fr))}.achv-v2-grid{grid-template-columns:1fr}.achv-v2-stats{grid-template-columns:repeat(2,1fr)}.rank-v2-head{align-items:start}.rank-v2-podium-card{padding:8px 5px}.rank-v2-podium-name{font-size:.67rem}.rank-v2-table th,.rank-v2-table td{padding:8px 5px}.rank-v2-voc{display:none}}
    `;document.head.appendChild(s);
  }

  function ensureTools(){
    const host=document.querySelector('.game-topbar');
    if(!host||document.getElementById('arenaAccountV2Tools'))return;
    const box=document.createElement('div');box.id='arenaAccountV2Tools';box.className='arena-account-v2-tools';
    box.innerHTML='<button type="button" data-account-v2="profile">Perfil</button><button type="button" data-account-v2="achievements">Conquistas</button><button type="button" data-account-v2="ranking">Ranking</button>';
    host.appendChild(box);box.querySelectorAll('button').forEach(b=>b.onclick=()=>open(b.dataset.accountV2));
  }

  function open(tab='profile'){
    if(typeof game==='undefined'||!game)return;installStyle();ensureTools();syncAchievements();
    let m=document.getElementById(MODAL);
    if(!m){m=document.createElement('div');m.id=MODAL;m.className='arena-account-v2';m.innerHTML='<div class="arena-account-v2-window"><div class="arena-account-v2-head"><h2 id="arenaAccountV2Title">Perfil</h2><button class="arena-account-v2-close" aria-label="Fechar">×</button></div><div class="arena-account-v2-tabs"><button data-tab-v2="profile">Perfil</button><button data-tab-v2="achievements">Conquistas</button><button data-tab-v2="ranking">Ranking</button></div><div class="arena-account-v2-body" id="arenaAccountV2Body"></div></div></div>';document.body.appendChild(m);m.querySelector('.arena-account-v2-close').onclick=close;m.addEventListener('click',e=>{if(e.target===m)close()});m.querySelectorAll('[data-tab-v2]').forEach(b=>b.onclick=()=>renderTab(b.dataset.tabV2))}
    renderTab(tab);
  }
  function close(){document.getElementById(MODAL)?.remove()}

  function renderProfile(){
    const level=Math.max(1,Number(game.level)||1),xp=num(game.xp),need=100+(level-1)*65,pct=Math.min(100,xp/need*100);
    const vocation=(typeof members!=='undefined'&&Array.isArray(members)?members.find(x=>x.name===game.character)?.vocation:null)||game.vocation||'Aventureiro';
    const atk=15+level*4+num(game.weapon)*3,def=num(game.armor)*3,hp=110+level*12+def;
    const item=slot=>{const id=game?.shopEquipped?.[slot];return id&&typeof SHOP_ITEMS!=='undefined'?SHOP_ITEMS.find(x=>x.id===id)||null:null};
    const itemName=(slot,fallback)=>item(slot)?.name||fallback;
    const eq=[['Amuleto','amulet','Nenhum'],['Helmet','helmets','Nenhum'],['Backpack','backpack','Nenhuma'],['Arma','weapon',typeof WEAPONS!=='undefined'?WEAPONS[game.weapon||0]?.[0]||'Espada de Bronze':'Espada de Bronze'],['Armadura','armor',typeof ARMORS!=='undefined'?ARMORS[game.armor||0]?.[0]||'Leather Armor':'Leather Armor'],['Escudo','shield','Nenhum'],['Ring','rings','Nenhum'],['Boots','boots','Nenhuma']];
    const bests=Object.keys(bestiary(game)).sort((a,b)=>bk(game,b)-bk(game,a)).slice(0,6);
    return `<div class="arena-profile-hero"><div><div class="arena-profile-name">${esc(game.character)}</div><div class="arena-profile-class">${esc(vocation)} · Arena</div></div><div class="arena-level-badge">LEVEL<strong>${fmt(level)}</strong></div></div><div class="arena-stat-grid"><div class="arena-stat"><span>Ataque</span><strong>${fmt(atk)}</strong></div><div class="arena-stat"><span>Defesa</span><strong>${fmt(def)}</strong></div><div class="arena-stat"><span>Vida</span><strong>${fmt(hp)}</strong></div><div class="arena-stat"><span>XP total</span><strong>${fmt(totalXp(game))}</strong></div><div class="arena-stat"><span>Gold</span><strong>${fmt(game.gold)}</strong></div><div class="arena-stat"><span>Kills</span><strong>${fmt(game.kills)}</strong></div><div class="arena-stat"><span>Vitórias</span><strong>${fmt(game.wins)}</strong></div><div class="arena-stat"><span>Melhor streak</span><strong>${fmt(game.bestStreak)}</strong></div></div><div class="arena-account-section"><div class="arena-profile-xp"><div class="arena-profile-xp-head"><span>Progresso para Level ${fmt(level+1)}</span><strong>${fmt(xp)} / ${fmt(need)} XP</strong></div><div class="arena-profile-xp-track"><i style="width:${pct}%"></i></div></div></div><div class="arena-profile-detail-grid"><div class="arena-profile-detail"><h4>Equipamento atual</h4><div class="arena-equip-mini">${eq.map(x=>`<div title="${esc(itemName(x[1],x[2]))}"><span>${esc(x[0])}</span><strong>${esc(itemName(x[1],x[2]))}</strong></div>`).join('')}</div></div><div class="arena-profile-detail"><h4>Combate</h4><div class="arena-combat-line"><span>Ataque base</span><b>${fmt(atk)}</b></div><div class="arena-combat-line"><span>Defesa base</span><b>${fmt(def)}</b></div><div class="arena-combat-line"><span>Vida máxima</span><b>${fmt(hp)}</b></div><div class="arena-combat-line"><span>XP total</span><b>${fmt(totalXp(game))}</b></div><div class="arena-combat-line"><span>Dano causado</span><b>${fmt(game.damage)}</b></div></div></div><div class="arena-account-section"><h3>Maiores feitos no Bestiário</h3><div class="arena-feats">${bests.map(n=>`<div class="arena-feat"><span>${esc(n)}</span><strong>${fmt(bk(game,n))} / ${req(n)}</strong></div>`).join('')||'<div class="arena-feat"><span>Bestiário</span><strong>Nenhum registro ainda</strong></div>'}</div></div>`;
  }

  function renderAchievements(){
    syncAchievements();const s=state(),done=ACH.filter(a=>s[a.id]?.completed).length;
    const body=document.getElementById('arenaAccountV2Body');
    body.innerHTML=`<div class="achv-v2-head"><div><h3 style="margin:0;color:#c7cbd1;font:800 .82rem Cinzel,serif">Conquistas da Arena</h3><p style="margin:4px 0 0;color:#777e87;font-size:.62rem">Feitos permanentes do personagem. Cada conquista pode gerar um título.</p></div><div class="achv-v2-total"><strong>${done}/${ACH.length}</strong><br>concluídas</div></div><div class="achv-v2-stats"><div class="achv-v2-stat"><span>Concluídas</span><b>${done}</b></div><div class="achv-v2-stat"><span>Progresso</span><b>${fmt(done/ACH.length*100)}%</b></div><div class="achv-v2-stat"><span>Raras+</span><b>${ACH.filter(a=>s[a.id]?.completed&&a.rarity!=='comum').length}</b></div></div><div class="achv-v2-filters">${Object.entries(CATS).map(([k,v])=>`<button class="${k==='all'?'active':''}" data-achcat-v2="${k}">${v}</button>`).join('')}</div><div class="achv-v2-grid" id="achvV2Grid"></div>`;
    const grid=body.querySelector('#achvV2Grid');const draw=cat=>{grid.innerHTML=ACH.filter(a=>cat==='all'||a.cat===cat).map(a=>{const v=Math.max(0,Number(a.value())||0),ok=v>=a.goal,pct=Math.min(100,v/a.goal*100);return `<article class="achv-v2-card ${ok?'done':'locked'}"><div class="achv-v2-top"><div class="achv-v2-icon">${a.icon}</div><div><div class="achv-v2-name">${esc(a.title)} ${ok?'✓':''}</div><div class="achv-v2-desc">${esc(a.desc)}</div><div class="achv-v2-rarity">${a.rarity}</div></div></div><div class="achv-v2-bar"><i style="width:${pct}%"></i></div><div class="achv-v2-meta"><span>${fmt(Math.min(v,a.goal))} / ${fmt(a.goal)}</span><span>${ok?'CONCLUÍDA':fmt(Math.round(pct))+'%'}</span></div><div class="achv-v2-reward">Recompensa: título <b>${esc(a.title)}</b></div>${ok?'<div class="achv-v2-title">Título desbloqueado</div>':''}</article>`}).join('')};
    draw('all');body.querySelectorAll('[data-achcat-v2]').forEach(b=>b.onclick=()=>{body.querySelectorAll('[data-achcat-v2]').forEach(x=>x.classList.remove('active'));b.classList.add('active');draw(b.dataset.achcatV2)});
  }

  function buildSyncPayload(){
    if(typeof game==='undefined'||!game?.character)return null;const g=game;
    const b=Object.entries(g.bestiary||{}).map(([creature,v])=>{const kills=Math.floor(num(v?.kills??v));return {creature_name:creature,kills,completed:kills>=req(creature)}});
    return {player:{character_name:String(g.character).trim(),vocation:String(g.vocation||'Aventureiro'),level:Math.floor(num(g.level)||1),xp:Math.floor(num(g.xp)),kills:Math.floor(num(g.kills)),wins:Math.floor(num(g.wins)),deaths:Math.floor(num(g.deaths)),best_streak:Math.floor(num(g.bestStreak)),gold:Math.floor(num(g.gold)),damage:Math.floor(num(g.damage)),bestiary_completed:complete(g),achievements_completed:Object.values(g.achievementsV2||{}).filter(x=>x?.completed).length,bosses_defeated:bosses(g)},bestiary:b};
  }
  async function sync(force=false){
    if(syncBusy)return false;const data=buildSyncPayload();if(!data)return false;const sig=JSON.stringify(data);if(!force&&sig===lastSyncSignature)return true;syncBusy=true;
    try{const res=await fetch(FUNCTION_URL,{method:'POST',headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${SUPABASE_KEY}`,'Content-Type':'application/json'},body:JSON.stringify(data),keepalive:true});if(!res.ok)throw new Error('HTTP '+res.status);const result=await res.json();if(result?.ok){lastSyncSignature=sig;globalCache=null;cacheAt=0}return !!result?.ok}catch(err){console.warn('[Arena Account V2] Supabase indisponível:',err);return false}finally{syncBusy=false}
  }
  async function getGlobalRecords(){
    if(globalCache&&Date.now()-cacheAt<15000)return globalCache;const headers={apikey:SUPABASE_KEY,Authorization:`Bearer ${SUPABASE_KEY}`};
    try{const [pRes,bRes]=await Promise.all([fetch(`${SUPABASE_URL}/rest/v1/arena_players?select=*`,{headers}),fetch(`${SUPABASE_URL}/rest/v1/arena_bestiary?select=player_id,creature_name,kills,completed`,{headers})]);if(!pRes.ok)throw new Error('players '+pRes.status);if(!bRes.ok)throw new Error('bestiary '+bRes.status);const players=await pRes.json(),bs=await bRes.json(),by={};bs.forEach(b=>(by[b.player_id]??=[]).push(b));globalCache=players.map(g=>{const list=by[g.id]||[],bm={};list.forEach(b=>bm[b.creature_name]={kills:num(b.kills),completed:Boolean(b.completed)});return {character:g.character_name,raw:{bestiary:bm},vocation:g.vocation||'Aventureiro',level:num(g.level)||1,xp:num(g.xp),totalXp:num(g.xp),gold:num(g.gold),kills:num(g.kills),wins:num(g.wins),streak:num(g.best_streak),damage:num(g.damage),bestiary:num(g.bestiary_completed)||list.filter(b=>num(b.kills)>=req(b.creature_name)).length,achievements:num(g.achievements_completed)||0}});cacheAt=Date.now();return globalCache}catch(err){console.warn('[Arena Account V2] Ranking indisponível:',err);return globalCache||[]}
  }
  function renderRanking(){
    const body=document.getElementById('arenaAccountV2Body');const token=++renderToken;body.innerHTML='<div style="padding:24px;text-align:center;color:#777e87;font-size:.65rem">Carregando ranking global...</div>';
    getGlobalRecords().then(rows=>{if(token!==renderToken||document.getElementById('arenaAccountV2Title')?.textContent!=='Ranking')return;const creatureMode=currentMetric==='creature',metric=METRICS[currentMetric];const values=rows.map(r=>({...r,rankValue:creatureMode?num(r.raw?.bestiary?.[currentCreature]?.kills):metric.get(r)})).sort((a,b)=>b.rankValue-a.rankValue||b.level-a.level||a.character.localeCompare(b.character,'pt-BR'));
      body.innerHTML=`<div class="rank-v2-head"><div><div class="rank-v2-title">Ranking Global da Arena</div><div class="rank-v2-sub">Todos os personagens registrados no servidor.</div></div><div class="rank-v2-local">GLOBAL</div></div><div class="rank-v2-metrics">${Object.entries(METRICS).map(([id,m])=>`<button data-rank-metric-v2="${id}" class="${currentMetric===id?'active':''}">${m.icon} ${m.label}</button>`).join('')}<button data-rank-metric-v2="creature" class="${creatureMode?'active':''}">☠️ Por criatura</button></div><div class="rank-v2-creature-wrap ${creatureMode?'show':''}"><label for="rankCreatureV2">Criatura</label><select id="rankCreatureV2" class="rank-v2-creature">${CREATURES.map(n=>`<option value="${esc(n)}" ${n===currentCreature?'selected':''}>${esc(n)}</option>`).join('')}</select></div>${values.length?`<div class="rank-v2-podium">${[0,1,2].map(i=>values[i]?`<div class="rank-v2-podium-card"><div class="rank-v2-podium-pos">#${i+1}</div><div class="rank-v2-podium-name">${esc(values[i].character)}</div><div class="rank-v2-podium-voc">${esc(values[i].vocation)}</div><div class="rank-v2-podium-value">${fmt(values[i].rankValue)}</div></div>`:'').join('')}</div>`:'<div class="rank-v2-empty">Ainda não há personagens registrados no ranking global.</div>'}<table class="rank-v2-table"><thead><tr><th>#</th><th>Personagem</th><th style="text-align:right">${creatureMode?esc(currentCreature):metric.label}</th></tr></thead><tbody>${values.map((r,i)=>`<tr class="${typeof game!=='undefined'&&game?.character===r.character?'current':''}"><td class="rank-v2-pos">${i+1}</td><td class="rank-v2-char">${esc(r.character)}<span class="rank-v2-voc">${esc(r.vocation)}</span></td><td class="rank-v2-value">${fmt(r.rankValue)}</td></tr>`).join('')}</tbody></table>`;
      body.querySelectorAll('[data-rank-metric-v2]').forEach(b=>b.onclick=()=>{currentMetric=b.dataset.rankMetricV2;renderRanking()});const sel=body.querySelector('#rankCreatureV2');if(sel)sel.onchange=()=>{currentCreature=sel.value;renderRanking()};
    });
  }

  function renderTab(tab){
    const m=document.getElementById(MODAL);if(!m)return;const title=m.querySelector('#arenaAccountV2Title');title.textContent=tab==='profile'?'Perfil':tab==='achievements'?'Conquistas':'Ranking';m.querySelectorAll('[data-tab-v2]').forEach(b=>b.classList.toggle('active',b.dataset.tabV2===tab));
    if(tab==='profile')m.querySelector('#arenaAccountV2Body').innerHTML=renderProfile();
    else if(tab==='achievements')renderAchievements();
    else renderRanking();
  }
  function tick(){if(typeof game==='undefined'||!game)return;installStyle();ensureTools();syncAchievements();}
  function init(){installStyle();ensureTools();sync(true);setInterval(tick,1200);setInterval(()=>sync(false),SYNC_INTERVAL);document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});window.addEventListener('arena:bestiary-kill',()=>{syncAchievements();if(document.getElementById(MODAL)?.querySelector('[data-tab-v2="achievements"].active'))renderAchievements()});}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
  window.arenaAccountV2={open,close,render:renderTab,sync,definitions:ACH};
})();

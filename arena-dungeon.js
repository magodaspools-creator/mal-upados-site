(()=>{
  if(window.__arenaDungeon)return;
  window.__arenaDungeon=true;

  const STORE='malupados_arena_v1';
  const ROOMS=10;
  const RARITIES=[
    {id:'common',name:'Comum',chance:70,cls:'common'},
    {id:'uncommon',name:'Incomum',chance:23,cls:'uncommon'},
    {id:'rare',name:'Raro',chance:6,cls:'rare'},
    {id:'epic',name:'Épico',chance:.9,cls:'epic'},
    {id:'legendary',name:'Lendário',chance:.1,cls:'legendary'}
  ];
  const MATERIALS={
    essence:{name:'Essência Corrompida',icon:'◆'},
    fragment:{name:'Fragmento Abissal',icon:'✦'},
    core:{name:'Núcleo Abissal',icon:'◈'},
    heart:{name:'Coração Abissal',icon:'♥'}
  };
  const STAGES=[
    {min:0,max:19,name:'Contaminação',desc:'A corrupção ainda está adormecida.'},
    {min:20,max:39,name:'Infecção',desc:'A Dungeon começa a reagir à sua presença.'},
    {min:40,max:59,name:'Degradação',desc:'As rotas ficam instáveis e surgem escolhas perigosas.'},
    {min:60,max:79,name:'Abismo',desc:'Elites e fendas corrompidas passam a dominar as salas.'},
    {min:80,max:99,name:'Colapso',desc:'A própria Dungeon tenta impedir sua chegada ao fim.'},
    {min:100,max:100,name:'Ascensão',desc:'A corrupção atingiu o máximo. Ferumbras aguarda.'}
  ];
  const MOBS=[
    {name:'Jardineiro Abissal',icon:'👹',hp:520,damage:34,res:62,gold:[900,1500]},
    {name:'Guardião das Raízes',icon:'🌳',hp:610,damage:39,res:68,gold:[1000,1700]},
    {name:'Abominação Floral',icon:'🪻',hp:700,damage:45,res:72,gold:[1200,2000]},
    {name:'Cavaleiro Corrompido',icon:'☠️',hp:820,damage:51,res:76,gold:[1400,2300]}
  ];
  const fmt=n=>new Intl.NumberFormat('pt-BR').format(Math.floor(Number(n)||0));
  const rand=(a,b)=>Math.floor(a+Math.random()*(b-a+1));
  const esc=v=>String(v??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
  const save=()=>{if(typeof persist==='function')persist();else{try{const all=JSON.parse(localStorage.getItem(STORE)||'{}');all[game.character]=game;localStorage.setItem(STORE,JSON.stringify(all))}catch{}}};
  function ensure(){
    if(!game)return null;
    game.abyssal=game.abyssal&&typeof game.abyssal==='object'?game.abyssal:{};
    const a=game.abyssal;
    a.unlocked=!!a.unlocked;
    a.popupSeen=!!a.popupSeen;
    a.corruption=Math.max(0,Math.min(100,Number(a.corruption)||0));
    a.room=Math.max(0,Math.min(ROOMS,Number(a.room)||0));
    a.loot=a.loot&&typeof a.loot==='object'?a.loot:{};
    a.loot.gold=Math.max(0,Number(a.loot.gold)||0);
    Object.keys(MATERIALS).forEach(k=>a.loot[k]=Math.max(0,Number(a.loot[k])||0));
    a.active=!!a.active;
    a.event=a.event||'';
    return a;
  }
  function forge(){
    if(typeof window.arenaForgeV2==='object')return window.arenaForgeV2;
    return null;
  }
  function hasDemonProof(){
    const a=ensure();
    if(!a)return false;
    return !!game.demonDefeated||!!a.demonDefeated;
  }
  function detectUnlock(){
    const a=ensure();if(!a)return;
    const text=document.getElementById('battleArea')?.textContent||'';
    if(/Demon derrotado/i.test(text)){game.demonDefeated=true;a.demonDefeated=true;save()}
    const eligible=Number(game.level||0)>=150&&hasDemonProof();
    if(eligible&&!a.unlocked){a.unlocked=true;save();showUnlockPopup()}
    if(a.unlocked&&!a.popupSeen&&eligible)showUnlockPopup();
  }
  function showUnlockPopup(){
    const a=ensure();if(!a||document.getElementById('abyssalUnlockModal'))return;
    const modal=document.createElement('div');modal.id='abyssalUnlockModal';modal.className='abyssal-modal';
    modal.innerHTML=`<div class="abyssal-modal-box"><div class="abyssal-sigil">☠</div><div class="eyebrow">UMA NOVA AMEAÇA</div><h3>Abyssal Gardens</h3><p>Além do Abismo Demoníaco existe uma região onde a própria natureza foi corrompida. Lá não há XP. Só Gold, materiais raros e uma coisa: risco.</p><div class="abyssal-unlock-grid"><div><b>100%</b><span>Corrupção máxima</span></div><div><b>0 XP</b><span>Conteúdo de endgame</span></div><div><b>5 TIERS</b><span>Progressão da Forja</span></div></div><button class="btn active" id="abyssalUnlockBtn">ENTRAR NOS ABYSSAL GARDENS</button><button class="btn" id="abyssalUnlockClose">Depois</button></div>`;
    document.body.appendChild(modal);
    a.popupSeen=true;save();
    modal.querySelector('#abyssalUnlockBtn').onclick=()=>{modal.remove();scrollToDungeon();render()};
    modal.querySelector('#abyssalUnlockClose').onclick=()=>modal.remove();
    modal.onclick=e=>{if(e.target===modal)modal.remove()};
  }
  function scrollToDungeon(){document.getElementById('abyssalGardens')?.scrollIntoView({behavior:'smooth',block:'center'})}
  function stage(c){return STAGES.find(x=>c>=x.min&&c<=x.max)||STAGES[0]}
  function rarityAt(c){
    const boost=Math.max(0,Math.min(3,(c-50)/40));
    const weights={common:70-boost*15,uncommon:23+boost*3,rare:6+boost*7,epic:.9+boost*3.5,legendary:.1+boost*1.5};
    const total=Object.values(weights).reduce((a,b)=>a+b,0);let r=Math.random()*total;
    for(const x of RARITIES){r-=weights[x.id];if(r<=0)return x.id}return 'common';
  }
  function materialFor(rarity){
    const map={common:['essence'],uncommon:['essence','fragment'],rare:['fragment','core'],epic:['core','fragment'],legendary:['heart','core']};
    const pool=map[rarity]||map.common;return pool[rand(0,pool.length-1)];
  }
  function addLoot(a,final=false){
    const c=a.corruption;
    a.loot.gold+=final?rand(18000,45000):rand(650,1400)+Math.floor(c*8);
    const rolls=final?rand(8,13):rand(1,3);
    for(let i=0;i<rolls;i++){
      const rarity=rarityAt(c);
      const key=materialFor(rarity);
      const qty=rarity==='common'?rand(8,22):rarity==='uncommon'?rand(4,10):rarity==='rare'?rand(2,5):rarity==='epic'?rand(1,2):1;
      a.loot[key]+=qty;
    }
  }
  function resetRun(){const a=ensure();a.corruption=0;a.room=0;a.active=true;a.event='';a.loot={gold:0,essence:0,fragment:0,core:0,heart:0};save()}
  function loseRun(){const a=ensure();a.active=false;a.corruption=0;a.room=0;a.event='';a.loot={gold:0,essence:0,fragment:0,core:0,heart:0};save();toast?.('Você morreu nos Abyssal Gardens. A run foi perdida.');render()}
  function completeRun(){const a=ensure();addLoot(a,true);a.active=false;a.room=ROOMS;a.corruption=100;save();showChest()}
  function showChest(){const a=ensure();const modal=document.createElement('div');modal.className='abyssal-modal';modal.innerHTML=`<div class="abyssal-modal-box chest-box"><div class="abyssal-sigil">🗝</div><div class="eyebrow">FERUMBRAS DERROTADO</div><h3>Baú dos Jardins Abissais</h3><p>Você atravessou a corrupção e chegou ao fim. Todo o loot da run foi convertido em recompensa agora.</p><div class="loot-grid"><div><b>🪙 ${fmt(a.loot.gold)}</b><span>Gold</span></div>${Object.keys(MATERIALS).map(k=>`<div><b>${MATERIALS[k].icon} ${fmt(a.loot[k])}</b><span>${MATERIALS[k].name}</span></div>`).join('')}</div><button class="btn active" id="claimAbyssal">ABRIR BAÚ</button></div>`;document.body.appendChild(modal);modal.querySelector('#claimAbyssal').onclick=()=>{game.gold+=a.loot.gold;game.forgeMaterials=game.forgeMaterials||{};Object.keys(MATERIALS).forEach(k=>game.forgeMaterials[k]=(Number(game.forgeMaterials[k])||0)+a.loot[k]);a.loot={gold:0,essence:0,fragment:0,core:0,heart:0};a.corruption=0;a.room=0;save();modal.remove();render();toast?.('Loot recebido. A Forja está esperando.')}}
  function roomMechanic(){const a=ensure(),c=a.corruption;
    if(c>=90)return {title:'Abyssal Collapse',desc:'A rota está colapsando. A próxima sala é obrigatória e um inimigo adicional pode aparecer.',kind:'danger',options:[['AVANÇAR','seguir'] ]};
    if(c>=80)return {title:'Corruption Hunt',desc:'Uma criatura corrompida percebeu você. Derrote-a para preservar a run.',kind:'danger',options:[['ENFRENTAR','fight'] ]};
    if(c>=70)return {title:'Reality Rift',desc:'Uma fenda divide a rota. O caminho seguro é mais longo; o caminho corrompido aumenta o risco e a recompensa.',kind:'choice',options:[['FECHAR A FENDA','safe'],['ATRAVESSAR','risk']]};
    if(c>=60)return {title:'Corrupted Elite',desc:'Um elite aparece nesta sala. Ele tem pouca vida, mas resistência muito alta e um modificador especial.',kind:'fight',options:[['ENFRENTAR ELITE','fight']]};
    if(c>=50)return {title:'Corruption Choice',desc:'A corrupção oferece poder em troca de risco.',kind:'choice',options:[['RESISTIR','safe'],['ABRAÇAR A CORRUPÇÃO','risk']]};
    if(c>=40)return {title:'Blood Sacrifice',desc:'Um altar oferece recompensa em troca de parte do seu HP atual.',kind:'choice',options:[['IGNORAR','safe'],['SACRIFICAR 12% HP','sac']]};
    if(c>=30)return {title:'Corrupted Spawn',desc:'O próximo inimigo pode nascer em uma forma corrompida, com resistência ainda maior.',kind:'fight',options:[['ENFRENTAR','fight']]};
    if(c>=20)return {title:'Corrupted Ground',desc:'O chão está contaminado. Atravessar é possível, mas causa dano ao chegar à próxima sala.',kind:'choice',options:[['CONTORNAR','safe'],['ATRAVESSAR','risk']]};
    return {title:'Jardins Abissais',desc:'A vegetação ainda parece silenciosa. A corrupção está apenas começando.',kind:'fight',options:[['AVANÇAR','fight']]};
  }
  let combat=null;
  function playerStats(){
    let attack=20+Number(game.level||1)*2,defense=15,hp=180+Number(game.level||1)*5;
    const eq=game.shopEquipped||{};
    if(typeof SHOP_ITEMS!=='undefined')Object.entries(eq).forEach(([slot,id])=>{const item=SHOP_ITEMS.find(x=>x.id===id);if(!item)return;const tier=Number(game.forge?.tiers?.[id]||0);const mult=[0,.05,.10,.17,.25,.35][tier]||0;attack+=Number(item.attack||0)*(1+mult);defense+=Number(item.defense||0)*(1+mult);hp+=Number(item.defense||0)*2*(1+mult)});
    const forgeAttack=typeof window.arenaForgeV2?.getTotalAttack==='function'?window.arenaForgeV2.getTotalAttack():0;
    const forgeDefense=typeof window.arenaForgeV2?.getTotalDefense==='function'?window.arenaForgeV2.getTotalDefense():0;
    return {attack:Math.floor(attack+forgeAttack),defense:Math.floor(defense+forgeDefense),maxHp:Math.floor(hp)};
  }
  function startMob(elite=false){
    const a=ensure(),base=MOBS[rand(0,MOBS.length-1)],s=stage(a.corruption);let hp=base.hp+Math.floor(a.corruption*2);let res=Math.min(92,base.res+Math.floor(a.corruption*.12)+(elite?8:0));let dmg=base.damage+Math.floor(a.corruption*.25)+(elite?18:0);if(a.corruption>=30)res=Math.min(94,res+5);combat={kind:'mob',name:elite?'Elite '+base.name:base.name,icon:elite?'☠️':base.icon,maxHp:hp,hp,damage:dmg,res,playerHp:playerStats().maxHp,playerMax:playerStats().maxHp,log:[],busy:false};
    combat.stats=playerStats();combat.log.unshift(`${s.name}: ${s.desc}`);render();
  }
  function startBoss(){const a=ensure(),s=playerStats();combat={kind:'boss',name:'Ferumbras',icon:'👿',maxHp:5200,hp:5200,damage:95,res:58,playerHp:s.maxHp,playerMax:s.maxHp,log:['Ferumbras encara você. A arena é parte da batalha.'],busy:false,phase:1,stats:s};render()}
  function attack(){if(!combat||combat.busy)return;combat.busy=true;const c=ensure(),s=combat.stats;let raw=Math.max(1,Math.floor(s.attack*(.9+Math.random()*.2)));let dealt=Math.max(1,Math.floor(raw*(1-combat.res/100)));combat.hp=Math.max(0,combat.hp-dealt);combat.log.unshift(`Você causou <b>${fmt(dealt)}</b> de dano após a resistência.`);if(combat.kind==='boss'&&combat.hp<=3500&&combat.phase===1){combat.phase=2;combat.res=Math.min(85,combat.res+10);combat.log.unshift('<b>FASE 2:</b> a arena foi tomada pela corrupção. Ferumbras ficou mais resistente.')}if(combat.hp<=0){combat=null;nextRoom(true);return}let incoming=Math.max(1,combat.damage+rand(-8,8)-Math.floor(s.defense*.35));if(c.corruption>=80)incoming+=rand(4,12);if(combat.kind==='boss'&&combat.phase===2)incoming+=18;combat.playerHp=Math.max(0,combat.playerHp-incoming);combat.log.unshift(`${esc(combat.name)} causou <b>${fmt(incoming)}</b> de dano.`);if(combat.playerHp<=0){combat=null;loseRun();return}combat.busy=false;render()}
  function nextRoom(won){const a=ensure();if(!won)return;if(a.room>=ROOMS){completeRun();return}a.room++;a.corruption=Math.min(100,a.room*10);addLoot(a,false);save();if(a.room===ROOMS){startBoss();return}const mech=roomMechanic();a.event=mech.title;save();if(mech.kind==='fight'||mech.kind==='danger'&&mech.options[0][1]==='fight')startMob(mech.title==='Corrupted Elite'||a.corruption>=60);else render()}
  function choose(kind){const a=ensure();if(kind==='safe'){a.corruption=Math.max(0,a.corruption-3);a.event='Você escolheu o caminho seguro.'}if(kind==='risk'){a.corruption=Math.min(100,a.corruption+7);addLoot(a,false);a.event='A corrupção foi abraçada. A recompensa potencial aumentou.'}if(kind==='sac'){const loss=Math.max(1,Math.floor(combat?.playerHp||playerStats().maxHp)*.12);a.event=`O altar tomou ${fmt(loss)} HP.`}if(kind==='fight'){startMob(a.corruption>=60);return}save();nextRoom(true)}
  function start(){const a=ensure();if(!a||!a.unlocked)return;resetRun();nextRoom(true)}
  function render(){
    const host=document.getElementById('abyssalGardens');if(!host)return;const a=ensure();if(!a)return;
    if(!a.unlocked){host.innerHTML=`<div class="abyssal-locked"><div class="abyssal-sigil">☠</div><h3>Abyssal Gardens</h3><p>Derrote o Demon e alcance o nível 150 para descobrir este conteúdo.</p><button class="btn" disabled>Bloqueado</button></div>`;return}
    const s=stage(a.corruption),pct=a.corruption;
    let body='';
    if(combat){const hp=Math.max(0,combat.hp/combat.maxHp*100),php=Math.max(0,combat.playerHp/combat.playerMax*100);body=`<div class="abyssal-combat"><div class="abyssal-combat-head"><div><span class="abyssal-stage">${esc(s.name)}</span><h3>${combat.icon} ${esc(combat.name)}</h3></div><span class="abyssal-res">Resistência ${combat.res}%</span></div><div class="abyssal-bars"><div><span>Inimigo · ${fmt(combat.hp)} / ${fmt(combat.maxHp)}</span><i><b style="width:${hp}%"></b></i></div><div><span>Você · ${fmt(combat.playerHp)} / ${fmt(combat.playerMax)}</span><i class="player"><b style="width:${php}%"></b></i></div></div><div class="abyssal-log">${combat.log.slice(0,5).join('<br>')}</div><button class="btn active big" id="abyssalAttack">ATACAR</button></div>`;
    }else if(a.room>=ROOMS&&a.corruption>=100){body=`<div class="abyssal-final"><div class="abyssal-sigil">👿</div><h3>Ferumbras aguarda.</h3><p>100% de corrupção. Não há mais caminho para trás.</p><button class="btn active big" id="abyssalBoss">ENFRENTAR FERUMBRAS</button></div>`}else{const mech=roomMechanic();body=`<div class="abyssal-event"><span class="abyssal-stage">Sala ${a.room} / ${ROOMS}</span><h3>${esc(mech.title)}</h3><p>${esc(mech.desc)}</p><div class="abyssal-options">${mech.options.map(o=>`<button class="btn ${o[1]==='risk'?'danger':''}" data-abyss-option="${o[1]}">${esc(o[0])}</button>`).join('')}</div></div>`}
    host.innerHTML=`<div class="abyssal-head"><div><div class="eyebrow">ENDGAME · SEM XP</div><h2>☠ Abyssal Gardens</h2><p>Uma Dungeon pós-jogo onde a corrupção aumenta, as mecânicas mudam e o loot só é seu quando Ferumbras cair.</p></div><div class="abyssal-entry"><b>${fmt(game.gold)}</b><span>Gold</span></div></div><div class="abyssal-corruption"><div class="corruption-copy"><span>Corrupção</span><strong>${pct}% · ${esc(s.name)}</strong></div><div class="corruption-track"><i style="width:${pct}%"></i></div><div class="corruption-meta"><span>0%</span><span>${esc(s.desc)}</span><span>100%</span></div></div><div class="abyssal-map">${Array.from({length:ROOMS},(_,i)=>`<div class="abyssal-node ${i<a.room?'done':''} ${i===a.room?'current':''}"><span>${i+1}</span></div>`).join('')}</div><div class="abyssal-run-stats"><div><span>Progresso</span><b>${a.room}/${ROOMS}</b></div><div><span>Loot em risco</span><b>${fmt(a.loot.gold)} Gold</b></div><div><span>Materiais</span><b>${fmt(Object.values(a.loot).reduce((x,y)=>x+y,0)-a.loot.gold)}</b></div></div>${body}<div class="abyssal-warning">Morrer zera a run inteira. O loot só é entregue ao abrir o baú depois de derrotar Ferumbras.</div></div>`;
    host.querySelector('#abyssalAttack')?.addEventListener('click',attack);
    host.querySelector('#abyssalBoss')?.addEventListener('click',startBoss);
    host.querySelectorAll('[data-abyss-option]').forEach(b=>b.onclick=()=>choose(b.dataset.abyssOption));
  }
  function addPanel(){
    if(document.getElementById('abyssalGardens'))return;
    const sec=document.createElement('section');sec.id='abyssalGardens';sec.className='abyssal-section';
    const activities=document.querySelector('.activities');if(activities)activities.insertAdjacentElement('beforebegin',sec);else document.querySelector('main')?.appendChild(sec);
  }
  function hookDemon(){
    const area=document.getElementById('battleArea');if(!area||area.__abyssalHook)return;area.__abyssalHook=true;
    new MutationObserver(()=>detectUnlock()).observe(area,{childList:true,subtree:true,characterData:true});
  }
  function boot(){addPanel();hookDemon();detectUnlock();render()}
  const timer=setInterval(()=>{if(typeof game!=='undefined'&&game){boot()}},700);setTimeout(()=>clearInterval(timer),180000);boot();
  window.arenaDungeon={ensure,render,start,loseRun,stage,RARITIES,MATERIALS};
})();
// Arena Game Mode — modo de ondas separado do combate normal
(()=>{
 const STYLE='arena-game-mode-style';
 const MAX_WAVES=20;
 const ENEMIES=[
  ['Rat','🐀',35,6],['Goblin','👺',55,9],['Skeleton','💀',75,12],['Slime','🟢',95,16],['Bat','🦇',120,19],
  ['Scorpion','🦂',150,23],['Spider','🕷️',180,27],['Hornet','🐝',215,31],['Cockatrice','🐔',250,36],['Sahuagin','🧜',300,42],
  ['Gazer','👁️',360,49],['Mimic','📦',420,55],['Imp','👿',480,61],['Ghost','👻',540,68],['Parasite','🪱',620,76],
  ['Puppet','🧸',680,82],['Drone','🤖',740,88],['Plant','🌿',800,94],['Snake','🐍',880,101],['Dragon','🐲',1000,115]
 ];
 const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const fmt=n=>Number(n||0).toLocaleString('pt-BR');
 const num=v=>Number(v)||0;
 let state=null;
 function ensureData(){if(typeof window.arenaGameData!=='object'||!window.arenaGameData)window.arenaGameData={};return window.arenaGameData}
 function save(){try{if(typeof persist==='function')persist();else{localStorage.setItem('arenaGameData',JSON.stringify(ensureData()))}}catch(e){}if(typeof renderAll==='function')renderAll()}
 function stats(){const d=ensureData();const g=num(d.gold);return{hp:100+Math.floor(g/20),atk:12+Math.floor(g/35),def:4+Math.floor(g/60),crit:.12}}
 function enemyFor(wave){const base=ENEMIES[Math.min(ENEMIES.length-1,wave-1)];const scale=1+Math.max(0,wave-ENEMIES.length)*.22;return{name:base[0],emoji:base[1],maxHp:Math.floor(base[2]*scale),atk:Math.floor(base[3]*scale)}}
 function reward(wave,boss){return Math.floor(18+wave*9+(boss?120:0))}
 function shell(){
  if(document.getElementById('arenaGameMode'))return;
  const host=document.querySelector('.boss-token-shop')||document.querySelector('.shop-section')||document.querySelector('#arena');if(!host)return;
  const sec=document.createElement('section');sec.id='arenaGameMode';sec.className='arena-game';sec.innerHTML=`<div class="arena-game-head"><div><h2>Waves</h2><p>Enfrente 20 criaturas sem repetir a sprite.</p></div><div class="arena-wave-counter" id="arenaWaveCounter">Wave 0 / ${MAX_WAVES}</div></div><div class="arena-game-battle"><div class="arena-fighter"><div class="arena-fighter-icon"></div><div class="arena-fighter-name" id="arenaPlayerName">Knight</div><div class="arena-fighter-meta">HP <span id="arenaPlayerHpText">—</span></div><div class="arena-hp"><span id="arenaPlayerHpBar"></span></div></div><div class="arena-vs">VS</div><div class="arena-fighter enemy"><div class="arena-fighter-icon" id="arenaEnemyIcon"></div><div class="arena-fighter-name" id="arenaEnemyName">—</div><div class="arena-fighter-meta">HP <span id="arenaEnemyHpText">—</span></div><div class="arena-hp"><span id="arenaEnemyHpBar"></span></div></div></div><div class="arena-game-actions"><button id="arenaGameStartBtn">Começar Wave</button><button id="arenaAttackBtn" disabled>Ataque</button><button id="arenaPotionBtn" disabled>Poção</button><button id="arenaFleeBtn" disabled>Fugir</button><button id="arenaRestartBtn" style="display:none">Jogar novamente</button></div><div id="arenaGameLog" class="arena-game-log">Prepare-se.</div></section>`;
  host.insertAdjacentElement('afterend',sec);bind();drawIdle();
 }
 function bind(){document.getElementById('arenaGameStartBtn').onclick=start;document.getElementById('arenaRestartBtn').onclick=start;document.getElementById('arenaAttackBtn').onclick=attack;document.getElementById('arenaPotionBtn').onclick=potion;document.getElementById('arenaFleeBtn').onclick=finishLoss}
 function drawIdle(){const p=document.querySelector('#arenaGameMode .arena-fighter:first-child .arena-fighter-icon');if(p)p.textContent='🧙';const e=document.getElementById('arenaEnemyIcon');if(e)e.textContent='🐉'}
 function start(){const st=stats();state={wave:1,playerHp:st.hp,playerMax:st.hp,potions:3,enemy:null,ended:false,busy:false};document.getElementById('arenaGameStartBtn').style.display='none';document.getElementById('arenaRestartBtn').style.display='none';document.getElementById('arenaFleeBtn').disabled=false;spawn();save()}
 function spawn(){if(!state)return;state.enemy=enemyFor(state.wave);state.busy=false;document.getElementById('arenaWaveCounter').textContent=`Wave ${state.wave} / ${MAX_WAVES}`;document.getElementById('arenaEnemyName').textContent=state.enemy.name;document.getElementById('arenaEnemyHpText').textContent=`${fmt(state.enemy.maxHp)} / ${fmt(state.enemy.maxHp)}`;document.getElementById('arenaGameLog').innerHTML=`${esc(state.enemy.name)} apareceu!`;renderFight()}
 function renderFight(){if(!state)return;const p=document.getElementById('arenaPlayerHpText'),pb=document.getElementById('arenaPlayerHpBar'),e=document.getElementById('arenaEnemyHpText'),eb=document.getElementById('arenaEnemyHpBar');if(p)p.textContent=`${fmt(state.playerHp)} / ${fmt(state.playerMax)}`;if(pb)pb.style.width=Math.max(0,state.playerHp/state.playerMax*100)+'%';if(e&&state.enemy)e.textContent=`${fmt(state.enemy.hp??state.enemy.maxHp)} / ${fmt(state.enemy.maxHp)}`;if(eb&&state.enemy)eb.style.width=Math.max(0,(state.enemy.hp??state.enemy.maxHp)/state.enemy.maxHp*100)+'%';const a=document.getElementById('arenaAttackBtn');const po=document.getElementById('arenaPotionBtn');if(a)a.disabled=!!state.ended||!!state.busy;if(po)po.disabled=!!state.ended||!!state.busy||state.potions<=0||state.playerHp>=state.playerMax}
 function attack(){if(!state||state.ended||state.busy)return;state.busy=true;try{const st=stats(),e=state.enemy;const crit=Math.random()<st.crit,dmg=Math.max(1,Math.floor(st.atk*(.85+Math.random()*.3))+(crit?Math.floor(st.atk*.55):0));e.hp=Math.max(0,(e.hp??e.maxHp)-dmg);state.log=`Você causou <b>${fmt(dmg)}</b> de dano${crit?' — CRÍTICO!':''}.`;if(e.hp<=0){winWave();return}state.playerHp=Math.max(0,state.playerHp-Math.max(1,e.atk-st.def));state.log+=`<br>${esc(e.name)} causou dano.`;document.getElementById('arenaGameLog').innerHTML=state.log;state.busy=false;renderFight();save()}catch(err){console.error('[Arena Waves] attack error',err);state.busy=false;renderFight()}}
 function winWave(){const boss=state.wave===MAX_WAVES;const gold=reward(state.wave,boss);const d=ensureData();d.gold=num(d.gold)+gold;document.getElementById('arenaGameLog').innerHTML=`<b>${esc(state.enemy.name)} derrotado!</b> +${fmt(gold)} gold.`;if(boss){state.ended=true;state.busy=false;document.getElementById('arenaFleeBtn').disabled=true;document.getElementById('arenaRestartBtn').style.display='inline-block';renderFight();save();return}state.wave++;setTimeout(()=>{if(!state||state.ended)return;spawn();save()},500);save()}
 function potion(){if(!state||state.ended||state.busy||state.potions<=0)return;state.potions--;state.playerHp=Math.min(state.playerMax,state.playerHp+Math.floor(state.playerMax*.3));state.log=`Poção usada. +30% HP.`;document.getElementById('arenaGameLog').innerHTML=state.log;renderFight();save()}
 function finishLoss(){if(!state||state.ended)return;state.ended=true;state.busy=false;document.getElementById('arenaGameLog').innerHTML='<b>Você fugiu da batalha.</b>';document.getElementById('arenaFleeBtn').disabled=true;document.getElementById('arenaRestartBtn').style.display='inline-block';renderFight();save()}
 function boot(){shell()}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();

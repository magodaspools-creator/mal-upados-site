// Waves pixel-art renderer for the website.
// Enemy art: each Waves mob is shown as ONE static frame. Rat remains animated.
(()=>{
 const ROOT='arena-godot/assets-importados/';
 const HERO_ROOT={knight:'knight-hero-128/knight-hero-128',mage:'mage-hero-128/mage-hero-128',archer:'archer-hero-128/archer-hero-128',rogue:'rogue-hero-128/rogue-hero-128'};
 const RAW='https://raw.githubusercontent.com/LiquidGalaxyLAB/lg-rpg/main/lg_rpg_server/public/assets/enemies/';
 const HIDDEN='https://www.hiddenone-sprites.com/uploads/7/1/8/7/71878507/published/';
 const DEMON_ROOT='assets/arena-enemies/demon-survive/';
 const DEMON_FRAMES=9;
 // Os 36 sprites estão intercalados por frame:
 // frame 0 = 4161..4164, frame 1 = 4165..4168, etc.
 // Norte: 4161,4165,4169... | East: 4162,4166,4170...
 const DEMON_DIRECTIONS={north:0,east:1,south:2,west:3};
 const demonSrc=(dir,frame)=>DEMON_ROOT+String(4161+(frame%DEMON_FRAMES)*4+dir)+'.png';
 const DEMON={frames:DEMON_FRAMES,size:144};
 const MONSTERS={
  rat:{src:HIDDEN+'rat-grey-sv_2.png?1550287821=',frames:9,w:64,h:64,rate:8,size:96,row:0,animated:true},
  goblin:{src:RAW+'goblin/idle.png',frames:4,w:150,h:150,rate:1,size:112,static:true},
  skeleton:{src:RAW+'skeleton/idle.png',frames:4,w:150,h:150,rate:1,size:112,static:true},
  dragon:{src:RAW+'boss/dragon_idle.png',frames:6,w:70,h:73,rate:1,size:128,static:true},
  sahuagin:{src:HIDDEN+'sahuagin-default_2.png?1550287917=',frames:9,w:64,h:64,rate:1,size:112,row:0,static:true},
  imp:{src:HIDDEN+'imp-dark-default_2.png?1550287170=',frames:9,w:64,h:64,rate:1,size:112,row:0,static:true},
  cockatrice:{src:HIDDEN+'cockatrice-default_2.png?1550201742=',frames:9,w:64,h:64,rate:1,size:112,row:0,static:true},
  gazer:{src:HIDDEN+'gazer-default_2.png?1550286768=',frames:9,w:64,h:64,rate:1,size:112,row:0,static:true},
  scorpion:{src:HIDDEN+'scorpion-default_4.png?1550288043=',frames:9,w:64,h:64,rate:1,size:112,row:0,static:true},
  plant:{src:HIDDEN+'plant-wilted_2.png?1550287615=',frames:9,w:64,h:64,rate:1,size:112,row:0,static:true},
  snake:{src:HIDDEN+'snake-hornless_2.png?1550288470=',frames:9,w:64,h:64,rate:1,size:112,row:0,static:true},
  puppet:{src:HIDDEN+'puppet-default_2.png?1550287709=',frames:9,w:64,h:64,rate:1,size:112,row:0,static:true},
  drone:{src:HIDDEN+'drone-default_2.png?1550286560=',frames:9,w:64,h:64,rate:1,size:112,row:0,static:true},
  spider:{src:HIDDEN+'spider-sv_4.png?1550288631=',frames:9,w:64,h:64,rate:1,size:112,row:0,static:true},
  willoWisp:{src:ROOT+'monsters-static/demon.svg',frames:1,w:64,h:64,rate:1,size:144,row:0,static:true},
  sufferingSoul:{src:HIDDEN+'suffering-soul-default_2.png?1550288890=',frames:9,w:64,h:64,rate:1,size:112,row:0,static:true}
 };
 const HERO_FRAMES=7,HERO_SIZE=96;
 let timer=null,animFrame=0,attacking=false,lastEnemyHp=null;
 let demonMoveDir=DEMON_DIRECTIONS.south,demonAnimFrame=0,demonAnimating=false,lastDemonPos=null;
 const cache=new Set();
 function preload(src){if(!src||cache.has(src))return;cache.add(src);const img=new Image();img.decoding='async';img.src=src}
 function style(){
  if(document.getElementById('arena-game-sprites-style'))return;
  const s=document.createElement('style');s.id='arena-game-sprites-style';s.textContent=`
   #arenaGameMode .arena-game-battle{position:relative;display:block!important;min-height:390px;overflow:hidden;padding:0!important;border:1px solid rgba(190,151,78,.45);isolation:isolate;box-shadow:inset 0 0 0 8px #151613,inset 0 0 0 10px #5a4d38,inset 0 0 70px rgba(0,0,0,.72)}
   #arenaGameMode .arena-fighter{position:absolute!important;z-index:2;width:190px;min-height:0!important;padding:8px!important;border:0!important;background:transparent!important;box-shadow:none!important;backdrop-filter:none!important}
   #arenaGameMode .arena-fighter:first-child{left:9%;top:50%;transform:translateY(-50%)}
   #arenaGameMode .arena-fighter.enemy{right:9%;top:50%;transform:translateY(-50%)}
   #arenaGameMode .arena-vs{position:absolute!important;left:50%;top:50%;transform:translate(-50%,-50%);z-index:2;padding:8px 12px;background:rgba(7,9,12,.72);border:1px solid rgba(190,151,78,.4);border-radius:3px;box-shadow:0 5px 18px rgba(0,0,0,.45)}
   #arenaGameMode .arena-fighter-icon{height:${HERO_SIZE}px;width:${HERO_SIZE}px;margin:auto;display:flex;align-items:center;justify-content:center;font-size:3.6rem;line-height:1;filter:drop-shadow(0 7px 7px rgba(0,0,0,.68));position:relative;overflow:hidden;background-repeat:no-repeat;background-position:left center;background-color:transparent!important;image-rendering:pixelated;color:transparent!important;text-shadow:none!important}
   #arenaGameMode .arena-fighter-name{display:inline-block;margin-top:0;padding:4px 8px;background:rgba(6,8,11,.82);border:1px solid rgba(190,151,78,.25);text-shadow:0 2px 3px #000}
   #arenaGameMode .arena-fighter-meta{display:inline-block;padding:2px 7px;background:rgba(6,8,11,.68);text-shadow:0 2px 3px #000}
   #arenaGameMode .arena-hp{max-width:180px;margin:7px auto 0;border:1px solid rgba(0,0,0,.7)}
   #arenaGameMode .arena-hp-text{display:inline-block;padding:2px 6px;background:rgba(6,8,11,.72);text-shadow:0 2px 3px #000}
   .waves-attack{animation:wavesAttack .28s ease-out}.arena-game .waves-damage{animation:wavesDamage .22s ease-out}
   @keyframes wavesAttack{0%{transform:translateX(0) scale(1)}35%{transform:translateX(10px) scale(1.04)}65%{transform:translateX(6px) scale(1.02)}100%{transform:translateX(0) scale(1)}}
   @keyframes wavesDamage{0%{transform:translateX(0)}25%{transform:translateX(-6px) scale(1.02);filter:drop-shadow(0 0 10px rgba(255,65,55,.95))}50%{transform:translateX(6px);filter:drop-shadow(0 0 8px rgba(255,65,55,.75))}100%{transform:translateX(0);filter:drop-shadow(0 7px 7px rgba(0,0,0,.68))}}
   @media(max-width:650px){#arenaGameMode .arena-game-battle{min-height:330px}#arenaGameMode .arena-fighter{width:145px}#arenaGameMode .arena-fighter:first-child{left:1%}#arenaGameMode .arena-fighter.enemy{right:1%}#arenaGameMode .arena-fighter-icon{width:72px;height:72px;font-size:2.7rem} }
  `;document.head.appendChild(s)
 }
 function playerVocation(){const n=String(document.getElementById('arenaPlayerName')?.textContent||'').toLowerCase();if(n.includes('mage')||n.includes('mago'))return'mage';if(n.includes('archer')||n.includes('paladin')||n.includes('paladino'))return'archer';if(n.includes('rogue')||n.includes('monk')||n.includes('monge'))return'rogue';return'knight'}
 function heroIdle(v,n){return ROOT+HERO_ROOT[v]+'/idle_south/'+String(n).padStart(2,'0')+'.png'}
 function paint(el,src,size){if(!el)return;el.style.width=size+'px';el.style.height=size+'px';el.style.backgroundImage=src?`url(\"${src}\")`:'';el.style.backgroundSize=size+'px '+size+'px';el.style.backgroundPosition='center'}
 function paintDemon(el,dir,frame){
  if(!el)return;
  const src=demonSrc(dir,frame%DEMON_FRAMES);
  el.style.width=DEMON.size+'px';
  el.style.height=DEMON.size+'px';
  el.style.backgroundImage='url("'+src+'")';
  el.style.backgroundSize=DEMON.size+'px '+DEMON.size+'px';
  el.style.backgroundPosition='center';
  el.style.backgroundRepeat='no-repeat';
 }
 function detectDemonMovement(){
  const mode=window.__arenaGameState;
  if(!mode?.enemyPos)return;
  const x=Number(mode.enemyPos.x),y=Number(mode.enemyPos.y);
  if(!Number.isFinite(x)||!Number.isFinite(y))return;
  if(!lastDemonPos){lastDemonPos={x,y};return;}
  const dx=x-lastDemonPos.x,dy=y-lastDemonPos.y;
  if(dx!==0||dy!==0){
   const nextDir=Math.abs(dx)>=Math.abs(dy)
    ?(dx>0?DEMON_DIRECTIONS.east:DEMON_DIRECTIONS.west)
    :(dy>0?DEMON_DIRECTIONS.south:DEMON_DIRECTIONS.north);
   // Ao mudar de direção, reinicia a sequência daquela direção.
   if(nextDir!==demonMoveDir)demonAnimFrame=0;
   else demonAnimFrame=(demonAnimFrame+1)%DEMON_FRAMES;
   demonMoveDir=nextDir;
   demonAnimating=true;
   // CRÍTICO: consumir a posição observada. Sem isso, o mesmo movimento
   // era detectado a cada 120ms e o Demon percorria a sequência inteira.
   lastDemonPos={x,y};
  }
 }
 function paintSheet(el,m,frame){
  if(!el||!m)return;
  const targetH=m.size,targetW=targetH*(m.w/m.h);
  // O elemento vira exatamente a janela de UM frame. Isso impede qualquer
  // vazamento visual das outras poses do spritesheet.
  el.style.width=`${targetW}px`;
  el.style.height=`${targetH}px`;
  el.style.backgroundImage=`url(\"${m.src}\")`;
  el.style.backgroundSize=`${targetW*m.frames}px ${targetH*(m.rows||1)}px`;
  el.style.backgroundPosition=`${-(frame*targetW)}px ${-((m.row||0)*targetH)}px`;
  el.style.backgroundRepeat='no-repeat';
 }
 function playerEl(){return document.querySelector('#arenaPlayerName')?.closest('.arena-fighter')?.querySelector('.arena-fighter-icon')}
 function enemyEl(){return document.getElementById('arenaEnemyIcon')}
 function prepareAssets(){for(const v of Object.keys(HERO_ROOT))for(let i=0;i<HERO_FRAMES;i++)preload(heroIdle(v,i));Object.values(MONSTERS).forEach(m=>preload(m.src));for(let dir=0;dir<4;dir++)for(let frame=0;frame<DEMON_FRAMES;frame++)preload(demonSrc(dir,frame))}
 function enemyKind(){
  const n=String(document.getElementById('arenaEnemyName')?.textContent||'').toLowerCase();
  if(n.includes('rat'))return'rat';if(n.includes('troll'))return'sahuagin';if(n==='orc')return'goblin';if(n.includes('berserker'))return'imp';if(n.includes('rider'))return'cockatrice';if(n.includes('cyclops'))return'gazer';if(n.includes('scorpion'))return'scorpion';if(n.includes('scarab'))return'plant';if(n.includes('dragon hatchling'))return'snake';if(n==='dragon')return'dragon';if(n.includes('dragon lord'))return'puppet';if(n.includes('frost dragon'))return'drone';if(n.includes('demon skeleton'))return'skeleton';if(n.includes('hellhound'))return'spider';if(n==='demon')return'demonSurvive';if(n.includes('deathbringer'))return'sufferingSoul';return null;
 }
 function draw(){
  const p=playerEl(),e=enemyEl();if(!p||!e)return;
  const v=playerVocation();paint(p,heroIdle(v,animFrame%HERO_FRAMES),HERO_SIZE);p.textContent='';e.textContent='';
  const kind=enemyKind();if(kind==='demonSurvive'){detectDemonMovement();paintDemon(e,demonMoveDir,demonAnimating?demonAnimFrame:0);return;}const m=MONSTERS[kind];if(m)paintSheet(e,m,m.animated?animFrame%m.frames:0);else{e.style.backgroundImage='';e.style.width='112px';e.style.height='112px'}
 }
 function startAttack(){if(attacking)return;attacking=true;const p=playerEl();if(p){p.classList.remove('waves-attack');void p.offsetWidth;p.classList.add('waves-attack');setTimeout(()=>p.classList.remove('waves-attack'),300)}setTimeout(()=>{attacking=false;draw()},310)}
 function idleAnimation(){if(attacking)return;animFrame++;draw()}
 function enemyDamageFx(){const el=enemyEl();if(!el)return;el.classList.remove('waves-damage');void el.offsetWidth;el.classList.add('waves-damage');setTimeout(()=>el.classList.remove('waves-damage'),230)}
 function hookAttack(){const b=document.getElementById('arenaAttackBtn');if(b&&!b.dataset.pixelHook){b.dataset.pixelHook='1';b.addEventListener('click',()=>setTimeout(startAttack,0))}}
 function observeDamage(){const t=document.getElementById('arenaEnemyHpText');if(!t)return;const m=String(t.textContent||'').match(/([\d.,]+)\s*\/\s*([\d.,]+)/);if(!m)return;const hp=Number(m[1].replace(/\./g,'').replace(',','.'));if(lastEnemyHp!==null&&hp<lastEnemyHp)enemyDamageFx();lastEnemyHp=hp}
 function tick(){if(!document.getElementById('arenaGameMode'))return;hookAttack();draw();observeDamage()}
 function boot(){style();prepareAssets();tick();if(timer)clearInterval(timer);timer=setInterval(()=>{tick();idleAnimation()},120)}
 function wait(){if(document.getElementById('arenaGameMode'))boot();else setTimeout(wait,300)}
 wait();
})();

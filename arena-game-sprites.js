// Waves pixel-art renderer for the website.
// Enemy art: CC0 monster assets from LiquidGalaxyLAB/lg-rpg (LuizMelo).
(()=>{
 const ROOT='arena-godot/assets-importados/';
 const HERO_ROOT={knight:'knight-hero-128/knight-hero-128',mage:'mage-hero-128/mage-hero-128',archer:'archer-hero-128/archer-hero-128',rogue:'rogue-hero-128/rogue-hero-128'};
 const MONSTER_ROOT=ROOT+'monsters-lg-rpg/';
 const RAW='https://raw.githubusercontent.com/LiquidGalaxyLAB/lg-rpg/main/lg_rpg_server/public/assets/enemies/';
 const MONSTERS={
  rat:{src:MONSTER_ROOT+'rat/idle.png',frames:10,w:70,h:70,rate:8,size:88},
  goblin:{src:RAW+'goblin/idle.png',frames:4,w:150,h:150,rate:6,size:88},
  skeleton:{src:RAW+'skeleton/idle.png',frames:4,w:150,h:150,rate:6,size:88},
  slime:{src:RAW+'slime/idle.png',frames:14,w:156,h:156,rate:8,size:88},
  bat:{src:RAW+'bat/fly.png',frames:11,w:87,h:87,rate:12,size:82},
  dragon:{src:RAW+'boss/dragon_idle.png',frames:6,w:70,h:73,rate:8,size:92}
 };
 const HERO_FRAMES=7,HERO_SIZE=96;
 let timer=null,animFrame=0,attacking=false,lastEnemyHp=null;
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
   #arenaGameMode .arena-fighter-icon{height:${HERO_SIZE}px;width:${HERO_SIZE}px;margin:auto;display:flex;align-items:center;justify-content:center;font-size:3.6rem;line-height:1;filter:drop-shadow(0 7px 7px rgba(0,0,0,.68));position:relative;overflow:hidden;background-repeat:no-repeat;background-position:center;background-color:transparent!important;image-rendering:pixelated;color:transparent!important;text-shadow:none!important}
   #arenaGameMode .arena-fighter-name{display:inline-block;margin-top:0;padding:4px 8px;background:rgba(6,8,11,.82);border:1px solid rgba(190,151,78,.25);text-shadow:0 2px 3px #000}
   #arenaGameMode .arena-fighter-meta{display:inline-block;padding:2px 7px;background:rgba(6,8,11,.68);text-shadow:0 2px 3px #000}
   #arenaGameMode .arena-hp{max-width:180px;margin:7px auto 0;border:1px solid rgba(0,0,0,.7)}
   #arenaGameMode .arena-hp-text{display:inline-block;padding:2px 6px;background:rgba(6,8,11,.72);text-shadow:0 2px 3px #000}
   #arenaGameMode .waves-attack{animation:wavesAttack .28s ease-out}.arena-game .waves-damage{animation:wavesDamage .22s ease-out}
   @keyframes wavesAttack{0%{transform:translateX(0) scale(1)}35%{transform:translateX(10px) scale(1.04)}65%{transform:translateX(6px) scale(1.02)}100%{transform:translateX(0) scale(1)}}
   @keyframes wavesDamage{0%{transform:translateX(0)}25%{transform:translateX(-6px) scale(1.02);filter:drop-shadow(0 0 10px rgba(255,65,55,.95))}50%{transform:translateX(6px);filter:drop-shadow(0 0 8px rgba(255,65,55,.75))}100%{transform:translateX(0);filter:drop-shadow(0 7px 7px rgba(0,0,0,.68))}}
   @media(max-width:650px){#arenaGameMode .arena-game-battle{min-height:330px}#arenaGameMode .arena-fighter{width:145px}#arenaGameMode .arena-fighter:first-child{left:1%}#arenaGameMode .arena-fighter.enemy{right:1%}#arenaGameMode .arena-fighter-icon{width:72px;height:72px;font-size:2.7rem} }
  `;document.head.appendChild(s)
 }
 function playerVocation(){const n=String(document.getElementById('arenaPlayerName')?.textContent||'').toLowerCase();if(n.includes('mage')||n.includes('mago'))return'mage';if(n.includes('archer')||n.includes('paladin')||n.includes('paladino'))return'archer';if(n.includes('rogue')||n.includes('monk')||n.includes('monge'))return'rogue';return'knight'}
 function heroIdle(v,n){return ROOT+HERO_ROOT[v]+'/idle_south/'+String(n).padStart(2,'0')+'.png'}
 function paint(el,src,size){if(!el)return;el.style.backgroundImage=src?`url("${src}")`:'';el.style.backgroundSize=size+'px '+size+'px';el.style.backgroundPosition='center'}
 function paintSheet(el,m,frame){
  if(!el||!m)return;
  const targetH=m.size;
  const targetW=targetH*(m.w/m.h);
  el.style.backgroundImage=`url("${m.src}")`;
  el.style.backgroundSize=`${targetW*m.frames}px ${targetH}px`;
  el.style.backgroundPosition=`${-(frame*targetW)}px center`;
  el.style.backgroundRepeat='no-repeat';
 }
 function playerEl(){return document.querySelector('#arenaPlayerName')?.closest('.arena-fighter')?.querySelector('.arena-fighter-icon')}
 function enemyEl(){return document.getElementById('arenaEnemyIcon')}
 function prepareAssets(){for(const v of Object.keys(HERO_ROOT))for(let i=0;i<HERO_FRAMES;i++)preload(heroIdle(v,i));Object.values(MONSTERS).forEach(m=>preload(m.src))}
 function enemyKind(){
  const n=String(document.getElementById('arenaEnemyName')?.textContent||'').toLowerCase();
  if(n.includes('rat'))return'rat';
  if(n.includes('goblin'))return'goblin';
  if(n.includes('skeleton'))return'skeleton';
  if(n.includes('slime'))return'slime';
  if(n.includes('bat'))return'bat';
  if(n.includes('dragon'))return'dragon';
  return null;
 }
 function draw(){
  const p=playerEl(),e=enemyEl();if(!p||!e)return;
  const v=playerVocation();paint(p,heroIdle(v,animFrame%HERO_FRAMES),HERO_SIZE);p.textContent='';e.textContent='';
  const kind=enemyKind(),m=MONSTERS[kind];
  if(m)paintSheet(e,m,animFrame%m.frames);else e.style.backgroundImage='';
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

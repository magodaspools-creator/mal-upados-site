// Waves pixel-art renderer for the website.
// IMPORTANT: this belongs only to the Waves mini-game, not the normal Arena hunt UI.
(()=>{
 const ROOT='arena-godot/assets-importados/';
 const HERO_ROOT={
  knight:'knight-hero-128/knight-hero-128',
  mage:'mage-hero-128/mage-hero-128',
  archer:'archer-hero-128/archer-hero-128',
  rogue:'rogue-hero-128/rogue-hero-128'
 };
 const HERO_FRAMES={knight:7,mage:7,archer:7,rogue:7};
 const ENEMY_IDLE=ROOT+'six-kingdoms-free-v1.0/six-kingdoms-free-v1.0/01_coral_knight_SUNKEN/128/idle_south/00.png';
 const ATTACK_ROOT=ROOT+'six-kingdoms-free-v1.0/six-kingdoms-free-v1.0/01_coral_knight_SUNKEN/128/attack_south/';
 const MAP_BG=ROOT+'Foozle_2DT0003_Lucifer_Dungeon_Tileset_Pixel_Art/Foozle_2DT0003_Lucifer_Dungeon_Tileset_Pixel_Art/DungeonTileset Mockup.png';
 const ATTACK_FRAMES=7;
 let timer=null, animFrame=0, attacking=false, attackStarted=0, lastEnemyHp=null;
 const cache=new Set();

 function preload(src){
  if(cache.has(src))return;
  cache.add(src);
  const img=new Image();
  img.decoding='async';
  img.src=src;
 }

 function style(){
  if(document.getElementById('arena-game-sprites-style'))return;
  const s=document.createElement('style');
  s.id='arena-game-sprites-style';
  s.textContent=`
   #arenaGameMode{position:relative;overflow:hidden;background:#101217 url("${MAP_BG}") center center/cover no-repeat;isolation:isolate}
   #arenaGameMode:before{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(3,5,8,.10),rgba(3,5,8,.38));pointer-events:none;z-index:0}
   #arenaGameMode:after{content:"";position:absolute;left:3%;right:3%;top:35%;bottom:6%;border:2px solid rgba(190,151,78,.22);box-shadow:inset 0 0 90px rgba(0,0,0,.40),0 8px 30px rgba(0,0,0,.22);pointer-events:none;z-index:0}
   #arenaGameMode>*{position:relative;z-index:1}
   .arena-game-head,.arena-game-body{background:rgba(9,11,14,.68)}
   .arena-fighter{min-height:205px;display:flex;flex-direction:column;justify-content:center;align-items:center;background:rgba(10,13,17,.70)}
   .arena-fighter-icon{height:120px;width:120px;display:flex;align-items:center;justify-content:center;font-size:0;filter:drop-shadow(0 8px 8px rgba(0,0,0,.55));position:relative;background-repeat:no-repeat;background-position:center;background-size:contain;image-rendering:pixelated;transition:none}
   .arena-fighter.enemy .arena-fighter-icon{background-size:108px 108px}
   .arena-fighter-icon img{display:none!important}
   .waves-damage{animation:wavesDamage .22s ease-out}
   .waves-attack{animation:wavesAttack .18s ease-out}
   @keyframes wavesDamage{0%{transform:translateX(0);filter:drop-shadow(0 8px 8px rgba(0,0,0,.55))}25%{transform:translateX(-5px);filter:drop-shadow(0 0 11px rgba(255,65,55,.95))}50%{transform:translateX(5px);filter:drop-shadow(0 0 8px rgba(255,65,55,.78))}75%{transform:translateX(-3px)}100%{transform:translateX(0);filter:drop-shadow(0 8px 8px rgba(0,0,0,.55))}}
   @keyframes wavesAttack{0%{transform:translateX(0) scale(1)}45%{transform:translateX(8px) scale(1.05)}100%{transform:translateX(0) scale(1)}}
   .arena-game-actions{position:relative;z-index:3}
  `;
  document.head.appendChild(s);
 }

 function playerVocation(){
  const n=String(document.getElementById('arenaPlayerName')?.textContent||'').toLowerCase();
  if(n.includes('mage')||n.includes('mago'))return'mage';
  if(n.includes('archer')||n.includes('paladin')||n.includes('paladino'))return'archer';
  if(n.includes('rogue')||n.includes('monk')||n.includes('monge'))return'rogue';
  return'knight';
 }

 function heroIdle(v,n){return ROOT+HERO_ROOT[v]+'/idle_south/'+String(n).padStart(2,'0')+'.png'}
 function attackFrame(n){return ATTACK_ROOT+String(n).padStart(2,'0')+'.png'}

 function paint(el,src,size){
  if(!el)return;
  el.style.backgroundImage=`url("${src}")`;
  el.style.backgroundSize=size+'px '+size+'px';
 }

 function playerEl(){return document.querySelector('#arenaPlayerName')?.closest('.arena-fighter')?.querySelector('.arena-fighter-icon')}
 function enemyEl(){return document.getElementById('arenaEnemyIcon')}

 function prepareAssets(){
  for(const v of Object.keys(HERO_ROOT)){
   for(let i=0;i<HERO_FRAMES[v];i++)preload(heroIdle(v,i));
  }
  for(let i=0;i<ATTACK_FRAMES;i++)preload(attackFrame(i));
  preload(ENEMY_IDLE);
  preload(MAP_BG);
 }

 function draw(){
  const p=playerEl(),e=enemyEl();
  if(!p||!e)return;
  const v=playerVocation();
  const frame=attacking?animFrame%ATTACK_FRAMES:animFrame%HERO_FRAMES[v];
  paint(p,attacking?attackFrame(frame):heroIdle(v,frame),120);
  // Enemy is intentionally fixed. Never swap/remove its sprite during damage.
  paint(e,ENEMY_IDLE,108);
 }

 function startAttack(){
  if(attacking)return;
  attacking=true;
  attackStarted=performance.now();
  animFrame=0;
  const p=playerEl();
  if(p){p.classList.remove('waves-attack');void p.offsetWidth;p.classList.add('waves-attack')}
  const run=(now)=>{
   if(!document.getElementById('arenaGameMode'))return;
   const elapsed=now-attackStarted;
   animFrame=Math.min(ATTACK_FRAMES-1,Math.floor(elapsed/75));
   draw();
   if(elapsed<ATTACK_FRAMES*75){requestAnimationFrame(run)}
   else{attacking=false;animFrame=0;draw()}
  };
  requestAnimationFrame(run);
 }

 function idleAnimation(){
  if(attacking)return;
  const v=playerVocation();
  animFrame=(animFrame+1)%HERO_FRAMES[v];
  draw();
 }

 function enemyDamageFx(){
  const el=enemyEl();
  if(!el)return;
  el.classList.remove('waves-damage');
  void el.offsetWidth;
  el.classList.add('waves-damage');
  setTimeout(()=>el.classList.remove('waves-damage'),230);
 }

 function hookAttack(){
  const b=document.getElementById('arenaAttackBtn');
  if(b&&!b.dataset.pixelHook){
   b.dataset.pixelHook='1';
   b.addEventListener('click',()=>setTimeout(startAttack,0));
  }
 }

 function observeDamage(){
  const t=document.getElementById('arenaEnemyHpText');
  if(!t)return;
  const m=String(t.textContent||'').match(/([\d.,]+)\s*\/\s*([\d.,]+)/);
  if(!m)return;
  const hp=Number(m[1].replace(/\./g,'').replace(',','.'));
  if(lastEnemyHp!==null&&hp<lastEnemyHp)enemyDamageFx();
  lastEnemyHp=hp;
 }

 function tick(){
  if(!document.getElementById('arenaGameMode'))return;
  hookAttack();
  draw();
  observeDamage();
 }

 function boot(){
  style();
  prepareAssets();
  tick();
  if(timer)clearInterval(timer);
  timer=setInterval(()=>{tick();idleAnimation()},180);
 }

 function wait(){if(document.getElementById('arenaGameMode'))boot();else setTimeout(wait,300)}
 wait();
})();

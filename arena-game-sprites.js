// Waves pixel-art renderer for the website.
// IMPORTANT: this belongs only to the Waves mini-game, not the normal Arena hunt UI.
(()=>{
 const ROOT='arena-godot/assets-importados/';
 const heroes={
  knight:'knight-hero-128/knight-hero-128',
  mage:'mage-hero-128/mage-hero-128',
  archer:'archer-hero-128/archer-hero-128',
  rogue:'rogue-hero-128/rogue-hero-128'
 };
 const ENEMY='knight';
 const cache=new Map();
 let timer=null;
 let idleFrame=0;
 let attacking=false;
 let lastEnemyHp=null;

 function style(){
  if(document.getElementById('arena-game-sprites-style'))return;
  const s=document.createElement('style');
  s.id='arena-game-sprites-style';
  s.textContent=`
   #arenaGameMode{position:relative;overflow:hidden;background:#101217 url("${ROOT}Foozle Lucifer Dungeon Tileset/Foozle_2DT0003_Lucifer_Dungeon_Tileset_Pixel_Art/DungeonTileset Mockup.png") center/cover no-repeat;}
   #arenaGameMode:before{content:"";position:absolute;inset:0;background:rgba(4,6,9,.28);pointer-events:none;z-index:0}
   #arenaGameMode>*{position:relative;z-index:1}
   .arena-game-head,.arena-game-body{background:rgba(9,11,14,.72)}
   .arena-fighter{min-height:205px;display:flex;flex-direction:column;justify-content:center;align-items:center;background:rgba(10,13,17,.80)}
   .arena-fighter-icon{height:120px;width:120px;display:flex;align-items:center;justify-content:center;font-size:0;filter:drop-shadow(0 8px 8px rgba(0,0,0,.55));position:relative}
   .arena-fighter-icon img{width:120px;height:120px;object-fit:contain;image-rendering:pixelated;display:block}
   .arena-fighter.enemy .arena-fighter-icon img{width:104px;height:104px}
   .waves-damage{animation:wavesDamage .18s ease-out}
   .waves-hit{animation:wavesHit .16s ease-out}
   @keyframes wavesDamage{0%{transform:translateX(0);filter:drop-shadow(0 0 0 rgba(255,80,70,0))}35%{transform:translateX(-5px);filter:drop-shadow(0 0 9px rgba(255,70,60,.85))}70%{transform:translateX(5px);filter:drop-shadow(0 0 5px rgba(255,70,60,.55))}100%{transform:translateX(0);filter:drop-shadow(0 8px 8px rgba(0,0,0,.55))}}
   @keyframes wavesHit{0%{transform:scale(1)}45%{transform:scale(1.08)}100%{transform:scale(1)}}
   .arena-game-actions{position:relative;z-index:3}
  `;
  document.head.appendChild(s);
 }

 function vocation(){
  const name=String(document.getElementById('arenaPlayerName')?.textContent||'').toLowerCase();
  if(name.includes('mage')||name.includes('mago'))return 'mage';
  if(name.includes('archer')||name.includes('paladin')||name.includes('paladino'))return 'archer';
  if(name.includes('rogue')||name.includes('monk')||name.includes('monge'))return 'rogue';
  return 'knight';
 }
 function path(v,anim,n){return `${ROOT}${heroes[v]}/${anim}/${String(n).padStart(2,'0')}.png`}
 function getImg(el){return el?.querySelector('img')||null}
 function setFrame(el,v,anim,n,size){
  if(!el||!heroes[v])return;
  const src=path(v,anim,n);
  let img=getImg(el);
  if(!img){img=document.createElement('img');el.replaceChildren(img)}
  const key=src;
  if(!cache.has(key)){const probe=new Image();probe.src=src;cache.set(key,probe.src)}
  if(img.dataset.src!==src){img.dataset.src=src;img.src=src}
  img.alt=v;
  img.style.width=img.style.height=`${size}px`;
 }
 function playerEl(){return document.querySelector('#arenaPlayerName')?.closest('.arena-fighter')?.querySelector('.arena-fighter-icon')}
 function enemyEl(){return document.getElementById('arenaEnemyIcon')}
 function draw(){
  const p=playerEl(),e=enemyEl();
  if(!p||!e)return;
  const v=vocation();
  setFrame(p,v,attacking?'attack_south':'idle_south',attacking?Math.min(idleFrame,9):idleFrame,120);
  // Enemy is intentionally fixed. It never swaps vocation/sprite between waves.
  setFrame(e,ENEMY,'idle_south',0,104);
 }
 function startAttack(){
  if(attacking)return;
  attacking=true;
  let f=0;
  const tick=()=>{
   if(!document.getElementById('arenaGameMode'))return;
   idleFrame=f;
   draw();
   f++;
   if(f<10){setTimeout(tick,65)}else{attacking=false;idleFrame=0;draw()}
  };
  tick();
 }
 function enemyDamageFx(){
  const el=enemyEl();
  if(!el)return;
  el.classList.remove('waves-damage');
  void el.offsetWidth;
  el.classList.add('waves-damage');
  setTimeout(()=>el.classList.remove('waves-damage'),220);
 }
 function hookAttack(){
  const btn=document.getElementById('arenaAttackBtn');
  if(btn&&!btn.dataset.pixelHook){
   btn.dataset.pixelHook='1';
   btn.addEventListener('click',()=>setTimeout(startAttack,0));
  }
 }
 function observeDamage(){
  const hpText=document.getElementById('arenaEnemyHpText');
  if(!hpText)return;
  const m=String(hpText.textContent||'').match(/([\d.,]+)\s*\/\s*([\d.,]+)/);
  if(!m)return;
  const hp=Number(m[1].replace(/\./g,'' ).replace(',','.'));
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
  tick();
  if(timer)clearInterval(timer);
  timer=setInterval(tick,120);
 }
 function wait(){
  if(document.getElementById('arenaGameMode'))boot();
  else setTimeout(wait,100);
 }
 wait();
})();

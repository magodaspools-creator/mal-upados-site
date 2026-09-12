// Waves pixel-art renderer for the website.
// IMPORTANT: this belongs only to the Waves mini-game, not the normal Arena hunt UI.
(()=>{
 const ROOT='arena-godot/assets-importados/';
 const HERO_ROOT={knight:'knight-hero-128/knight-hero-128',mage:'mage-hero-128/mage-hero-128',archer:'archer-hero-128/archer-hero-128',rogue:'rogue-hero-128/rogue-hero-128'};
 const HERO_FRAMES=7;
 const ENEMY_IDLE=ROOT+'six-kingdoms-free-v1.0/six-kingdoms-free-v1.0/01_coral_knight_SUNKEN/128/idle_south/00.png';
 const MAP_BG=ROOT+'Foozle_2DT0003_Lucifer_Dungeon_Tileset_Pixel_Art/Foozle_2DT0003_Lucifer_Dungeon_Tileset_Pixel_Art/DungeonTileset Mockup.png';
 let timer=null,animFrame=0,attacking=false,lastEnemyHp=null;
 const cache=new Set();
 function preload(src){if(cache.has(src))return;cache.add(src);const img=new Image();img.decoding='async';img.src=src}
 function style(){
  if(document.getElementById('arena-game-sprites-style'))return;
  const s=document.createElement('style');s.id='arena-game-sprites-style';s.textContent=`
   #arenaGameMode .arena-game-battle{position:relative;display:block!important;min-height:390px;overflow:hidden;padding:0!important;border:1px solid rgba(190,151,78,.35);background:#101217 url("${MAP_BG}") center center/cover no-repeat;isolation:isolate}
   #arenaGameMode .arena-game-battle:before{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(4,6,9,.20),rgba(4,6,9,.38));pointer-events:none;z-index:0}
   #arenaGameMode .arena-fighter{position:absolute!important;z-index:2;width:220px;min-height:0!important;padding:8px!important;border:0!important;background:transparent!important;box-shadow:none!important;backdrop-filter:none!important}
   #arenaGameMode .arena-fighter:first-child{left:9%;top:50%;transform:translateY(-50%)}
   #arenaGameMode .arena-fighter.enemy{right:9%;top:50%;transform:translateY(-50%)}
   #arenaGameMode .arena-vs{position:absolute!important;left:50%;top:50%;transform:translate(-50%,-50%);z-index:2;padding:8px 12px;background:rgba(7,9,12,.68);border:1px solid rgba(190,151,78,.35);border-radius:3px}
   #arenaGameMode .arena-fighter-icon{height:150px;width:150px;margin:auto;display:flex;align-items:center;justify-content:center;font-size:0;line-height:0;filter:drop-shadow(0 10px 9px rgba(0,0,0,.68));position:relative;overflow:visible;background-repeat:no-repeat;background-position:center;background-size:150px 150px}
   #arenaGameMode .arena-fighter.enemy .arena-fighter-icon{background-size:132px 132px}
   #arenaGameMode .arena-fighter-name{display:inline-block;margin-top:0;padding:4px 8px;background:rgba(6,8,11,.78);border:1px solid rgba(190,151,78,.25);text-shadow:0 2px 3px #000}
   #arenaGameMode .arena-fighter-meta{display:inline-block;padding:2px 7px;background:rgba(6,8,11,.68);text-shadow:0 2px 3px #000}
   #arenaGameMode .arena-hp{max-width:180px;margin:7px auto 0;border:1px solid rgba(0,0,0,.7)}
   #arenaGameMode .arena-hp-text{display:inline-block;padding:2px 6px;background:rgba(6,8,11,.72);text-shadow:0 2px 3px #000}
   #arenaGameMode .waves-attack{animation:wavesAttack .28s ease-out}.arena-game .waves-damage{animation:wavesDamage .22s ease-out}
   @keyframes wavesAttack{0%{transform:translateX(0) scale(1)}35%{transform:translateX(12px) scale(1.04)}65%{transform:translateX(7px) scale(1.02)}100%{transform:translateX(0) scale(1)}}
   @keyframes wavesDamage{0%{transform:translateX(0)}25%{transform:translateX(-7px) scale(1.02);filter:drop-shadow(0 0 11px rgba(255,65,55,.95))}50%{transform:translateX(7px);filter:drop-shadow(0 0 9px rgba(255,65,55,.75))}100%{transform:translateX(0);filter:drop-shadow(0 10px 9px rgba(0,0,0,.68))}}
   @media(max-width:650px){#arenaGameMode .arena-game-battle{min-height:330px}#arenaGameMode .arena-fighter{width:145px}#arenaGameMode .arena-fighter:first-child{left:1%}#arenaGameMode .arena-fighter.enemy{right:1%}#arenaGameMode .arena-fighter-icon{width:110px;height:110px;background-size:110px 110px}#arenaGameMode .arena-fighter.enemy .arena-fighter-icon{background-size:100px 100px}}
  `;document.head.appendChild(s)
 }
 function playerVocation(){const n=String(document.getElementById('arenaPlayerName')?.textContent||'').toLowerCase();if(n.includes('mage')||n.includes('mago'))return'mage';if(n.includes('archer')||n.includes('paladin')||n.includes('paladino'))return'archer';if(n.includes('rogue')||n.includes('monk')||n.includes('monge'))return'rogue';return'knight'}
 function heroIdle(v,n){return ROOT+HERO_ROOT[v]+'/idle_south/'+String(n).padStart(2,'0')+'.png'}
 function paint(el,src,size){if(!el)return;el.style.backgroundImage=`url("${src}")`;el.style.backgroundSize=size+'px '+size+'px'}
 function playerEl(){return document.querySelector('#arenaPlayerName')?.closest('.arena-fighter')?.querySelector('.arena-fighter-icon')}
 function enemyEl(){return document.getElementById('arenaEnemyIcon')}
 function prepareAssets(){for(const v of Object.keys(HERO_ROOT))for(let i=0;i<HERO_FRAMES;i++)preload(heroIdle(v,i));preload(ENEMY_IDLE);preload(MAP_BG)}
 function draw(){const p=playerEl(),e=enemyEl();if(!p||!e)return;const v=playerVocation();paint(p,heroIdle(v,animFrame%HERO_FRAMES),150);paint(e,ENEMY_IDLE,132)}
 function startAttack(){if(attacking)return;attacking=true;const p=playerEl();if(p){p.classList.remove('waves-attack');void p.offsetWidth;p.classList.add('waves-attack');setTimeout(()=>p.classList.remove('waves-attack'),300)}setTimeout(()=>{attacking=false;draw()},310)}
 function idleAnimation(){if(attacking)return;animFrame=(animFrame+1)%HERO_FRAMES;draw()}
 function enemyDamageFx(){const el=enemyEl();if(!el)return;el.classList.remove('waves-damage');void el.offsetWidth;el.classList.add('waves-damage');setTimeout(()=>el.classList.remove('waves-damage'),230)}
 function hookAttack(){const b=document.getElementById('arenaAttackBtn');if(b&&!b.dataset.pixelHook){b.dataset.pixelHook='1';b.addEventListener('click',()=>setTimeout(startAttack,0))}}
 function observeDamage(){const t=document.getElementById('arenaEnemyHpText');if(!t)return;const m=String(t.textContent||'').match(/([\d.,]+)\s*\/\s*([\d.,]+)/);if(!m)return;const hp=Number(m[1].replace(/\./g,'').replace(',','.'));if(lastEnemyHp!==null&&hp<lastEnemyHp)enemyDamageFx();lastEnemyHp=hp}
 function tick(){if(!document.getElementById('arenaGameMode'))return;hookAttack();draw();observeDamage()}
 function boot(){style();prepareAssets();tick();if(timer)clearInterval(timer);timer=setInterval(()=>{tick();idleAnimation()},180)}
 function wait(){if(document.getElementById('arenaGameMode'))boot();else setTimeout(wait,300)}
 wait();
})();

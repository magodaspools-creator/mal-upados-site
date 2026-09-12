// Waves pixel-art renderer for the website.
// IMPORTANT: this belongs only to the Waves mini-game, not the normal Arena hunt UI.
(()=>{
 const ROOT='arena-godot/assets-importados/';
 const HERO_ROOT={knight:'knight-hero-128/knight-hero-128',mage:'mage-hero-128/mage-hero-128',archer:'archer-hero-128/archer-hero-128',rogue:'rogue-hero-128/rogue-hero-128'};
 const ENEMY_IDLE=ROOT+'six-kingdoms-free-v1.0/six-kingdoms-free-v1.0/01_coral_knight_SUNKEN/128/idle_south/00.png';
 const ATTACK_ROOT=ROOT+'six-kingdoms-free-v1.0/six-kingdoms-free-v1.0/01_coral_knight_SUNKEN/128/attack_south/';
 let timer=null, idleFrame=0, attacking=false, lastEnemyHp=null;
 function style(){if(document.getElementById('arena-game-sprites-style'))return;const s=document.createElement('style');s.id='arena-game-sprites-style';s.textContent=`
 #arenaGameMode{position:relative;overflow:hidden;background:#101217 url("${ROOT}Foozle Lucifer Dungeon Tileset/Foozle_2DT0003_Lucifer_Dungeon_Tileset_Pixel_Art/DungeonTileset Mockup.png") center/cover no-repeat}
 #arenaGameMode:before{content:"";position:absolute;inset:0;background:rgba(4,6,9,.24);pointer-events:none;z-index:0}
 #arenaGameMode:after{content:"";position:absolute;left:4%;right:4%;top:38%;bottom:7%;border:2px solid rgba(190,151,78,.20);box-shadow:inset 0 0 80px rgba(0,0,0,.38);pointer-events:none;z-index:0}
 #arenaGameMode>*{position:relative;z-index:1}.arena-game-head,.arena-game-body{background:rgba(9,11,14,.70)}
 .arena-fighter{min-height:205px;display:flex;flex-direction:column;justify-content:center;align-items:center;background:rgba(10,13,17,.78)}
 .arena-fighter-icon{height:120px;width:120px;display:flex;align-items:center;justify-content:center;font-size:0;filter:drop-shadow(0 8px 8px rgba(0,0,0,.55));position:relative}
 .arena-fighter-icon img{width:120px;height:120px;object-fit:contain;image-rendering:pixelated;display:block}.arena-fighter.enemy .arena-fighter-icon img{width:108px;height:108px}
 .waves-damage{animation:wavesDamage .20s ease-out}.waves-attack{animation:wavesAttack .16s ease-out}
 @keyframes wavesDamage{0%{transform:translateX(0);filter:drop-shadow(0 8px 8px rgba(0,0,0,.55))}30%{transform:translateX(-6px);filter:drop-shadow(0 0 10px rgba(255,65,55,.95))}60%{transform:translateX(5px);filter:drop-shadow(0 0 6px rgba(255,65,55,.65))}100%{transform:translateX(0);filter:drop-shadow(0 8px 8px rgba(0,0,0,.55))}}
 @keyframes wavesAttack{0%{transform:translateX(0) scale(1)}50%{transform:translateX(8px) scale(1.06)}100%{transform:translateX(0) scale(1)}}
 .arena-game-actions{position:relative;z-index:3}`;document.head.appendChild(s)}
 function playerVocation(){const n=String(document.getElementById('arenaPlayerName')?.textContent||'').toLowerCase();if(n.includes('mage')||n.includes('mago'))return'mage';if(n.includes('archer')||n.includes('paladin')||n.includes('paladino'))return'archer';if(n.includes('rogue')||n.includes('monk')||n.includes('monge'))return'rogue';return'knight'}
 function heroIdle(v,n){return ROOT+HERO_ROOT[v]+'/idle_south/'+String(n).padStart(2,'0')+'.png'}
 function attackFrame(n){return ATTACK_ROOT+String(n).padStart(2,'0')+'.png'}
 function setSrc(el,src,size){if(!el)return;let img=el.querySelector('img');if(!img){img=document.createElement('img');el.replaceChildren(img)}if(img.dataset.src!==src){img.dataset.src=src;img.src=src}img.draggable=false;img.style.width=img.style.height=size+'px'}
 function playerEl(){return document.querySelector('#arenaPlayerName')?.closest('.arena-fighter')?.querySelector('.arena-fighter-icon')}
 function enemyEl(){return document.getElementById('arenaEnemyIcon')}
 function draw(){const p=playerEl(),e=enemyEl();if(!p||!e)return;const v=playerVocation();setSrc(p,attacking?attackFrame(idleFrame):heroIdle(v,idleFrame),120);setSrc(e,ENEMY_IDLE,108)}
 function startAttack(){if(attacking)return;attacking=true;let f=0;const p=playerEl();if(p){p.classList.remove('waves-attack');void p.offsetWidth;p.classList.add('waves-attack')}const run=()=>{if(!document.getElementById('arenaGameMode'))return;idleFrame=f;draw();f++;if(f<10)setTimeout(run,65);else{attacking=false;idleFrame=0;draw()}};run()}
 function enemyDamageFx(){const el=enemyEl();if(!el)return;el.classList.remove('waves-damage');void el.offsetWidth;el.classList.add('waves-damage');setTimeout(()=>el.classList.remove('waves-damage'),230)}
 function hookAttack(){const b=document.getElementById('arenaAttackBtn');if(b&&!b.dataset.pixelHook){b.dataset.pixelHook='1';b.addEventListener('click',()=>setTimeout(startAttack,0))}}
 function observeDamage(){const t=document.getElementById('arenaEnemyHpText');if(!t)return;const m=String(t.textContent||'').match(/([\d.,]+)\s*\/\s*([\d.,]+)/);if(!m)return;const hp=Number(m[1].replace(/\./g,'').replace(',','.'));if(lastEnemyHp!==null&&hp<lastEnemyHp)enemyDamageFx();lastEnemyHp=hp}
 function tick(){if(!document.getElementById('arenaGameMode'))return;hookAttack();draw();observeDamage()}
 function boot(){style();tick();if(timer)clearInterval(timer);timer=setInterval(tick,140)}function wait(){if(document.getElementById('arenaGameMode'))boot();else setTimeout(wait,100)}wait();
})();

// Waves pixel-art renderer for the website.
// IMPORTANT: this belongs only to the Waves mini-game, not the normal Arena hunt UI.
(()=>{
 const ROOT='arena-godot/assets-importados/';
 const HERO_ROOT={knight:'knight-hero-128/knight-hero-128',mage:'mage-hero-128/mage-hero-128',archer:'archer-hero-128/archer-hero-128',rogue:'rogue-hero-128/rogue-hero-128'};
 const HERO_FRAMES=7;
 const MAP_BG='';
 const HERO_SIZE=96;
 const ENEMY_SIZE=88;
 let timer=null,animFrame=0,attacking=false,lastEnemyHp=null;
 const cache=new Set();
 function preload(src){if(!src||cache.has(src))return;cache.add(src);const img=new Image();img.decoding='async';img.src=src}
 function style(){
  if(document.getElementById('arena-game-sprites-style'))return;
  const s=document.createElement('style');s.id='arena-game-sprites-style';s.textContent=`
   #arenaGameMode .arena-game-battle{position:relative;display:block!important;min-height:390px;overflow:hidden;padding:0!important;border:1px solid rgba(190,151,78,.45);background:
    radial-gradient(circle at 18% 28%,rgba(117,93,55,.24) 0 2px,transparent 3px),
    radial-gradient(circle at 72% 67%,rgba(117,93,55,.20) 0 2px,transparent 3px),
    repeating-linear-gradient(0deg,rgba(255,255,255,.025) 0 1px,transparent 1px 48px),
    repeating-linear-gradient(90deg,rgba(0,0,0,.12) 0 1px,transparent 1px 48px),
    linear-gradient(180deg,#37322a 0%,#292821 48%,#211f1a 100%);isolation:isolate;box-shadow:inset 0 0 0 8px #151613,inset 0 0 0 10px #5a4d38,inset 0 0 70px rgba(0,0,0,.72)}
   #arenaGameMode .arena-game-battle:before{content:"";position:absolute;inset:12px;border:2px solid rgba(190,151,78,.18);box-shadow:inset 0 0 0 1px rgba(0,0,0,.45);pointer-events:none;z-index:0}
   #arenaGameMode .arena-game-battle:after{content:"";position:absolute;left:50%;top:0;bottom:0;width:2px;background:linear-gradient(180deg,transparent,rgba(190,151,78,.18),transparent);transform:translateX(-50%);pointer-events:none;z-index:0}
   #arenaGameMode .arena-fighter{position:absolute!important;z-index:2;width:190px;min-height:0!important;padding:8px!important;border:0!important;background:transparent!important;box-shadow:none!important;backdrop-filter:none!important}
   #arenaGameMode .arena-fighter:first-child{left:9%;top:50%;transform:translateY(-50%)}
   #arenaGameMode .arena-fighter.enemy{right:9%;top:50%;transform:translateY(-50%)}
   #arenaGameMode .arena-vs{position:absolute!important;left:50%;top:50%;transform:translate(-50%,-50%);z-index:2;padding:8px 12px;background:rgba(7,9,12,.72);border:1px solid rgba(190,151,78,.4);border-radius:3px;box-shadow:0 5px 18px rgba(0,0,0,.45)}
   #arenaGameMode .arena-fighter-icon{height:${HERO_SIZE}px;width:${HERO_SIZE}px;margin:auto;display:flex;align-items:center;justify-content:center;font-size:3.6rem;line-height:1;filter:drop-shadow(0 7px 7px rgba(0,0,0,.68));position:relative;overflow:visible;background-repeat:no-repeat;background-position:center;background-size:${HERO_SIZE}px ${HERO_SIZE}px;image-rendering:pixelated}
   #arenaGameMode .arena-fighter.enemy .arena-fighter-icon{background-size:${ENEMY_SIZE}px ${ENEMY_SIZE}px}
   #arenaGameMode .arena-fighter-name{display:inline-block;margin-top:0;padding:4px 8px;background:rgba(6,8,11,.82);border:1px solid rgba(190,151,78,.25);text-shadow:0 2px 3px #000}
   #arenaGameMode .arena-fighter-meta{display:inline-block;padding:2px 7px;background:rgba(6,8,11,.68);text-shadow:0 2px 3px #000}
   #arenaGameMode .arena-hp{max-width:180px;margin:7px auto 0;border:1px solid rgba(0,0,0,.7)}
   #arenaGameMode .arena-hp-text{display:inline-block;padding:2px 6px;background:rgba(6,8,11,.72);text-shadow:0 2px 3px #000}
   #arenaGameMode .waves-attack{animation:wavesAttack .28s ease-out}.arena-game .waves-damage{animation:wavesDamage .22s ease-out}
   @keyframes wavesAttack{0%{transform:translateX(0) scale(1)}35%{transform:translateX(10px) scale(1.04)}65%{transform:translateX(6px) scale(1.02)}100%{transform:translateX(0) scale(1)}}
   @keyframes wavesDamage{0%{transform:translateX(0)}25%{transform:translateX(-6px) scale(1.02);filter:drop-shadow(0 0 10px rgba(255,65,55,.95))}50%{transform:translateX(6px);filter:drop-shadow(0 0 8px rgba(255,65,55,.75))}100%{transform:translateX(0);filter:drop-shadow(0 7px 7px rgba(0,0,0,.68))}}
   @media(max-width:650px){#arenaGameMode .arena-game-battle{min-height:330px}#arenaGameMode .arena-fighter{width:145px}#arenaGameMode .arena-fighter:first-child{left:1%}#arenaGameMode .arena-fighter.enemy{right:1%}#arenaGameMode .arena-fighter-icon{width:72px;height:72px;background-size:72px 72px;font-size:2.7rem}#arenaGameMode .arena-fighter.enemy .arena-fighter-icon{background-size:68px 68px}}
  `;document.head.appendChild(s)
 }
 function playerVocation(){const n=String(document.getElementById('arenaPlayerName')?.textContent||'').toLowerCase();if(n.includes('mage')||n.includes('mago'))return'mage';if(n.includes('archer')||n.includes('paladin')||n.includes('paladino'))return'archer';if(n.includes('rogue')||n.includes('monk')||n.includes('monge'))return'rogue';return'knight'}
 function heroIdle(v,n){return ROOT+HERO_ROOT[v]+'/idle_south/'+String(n).padStart(2,'0')+'.png'}
 function paint(el,src,size){if(!el)return;el.style.backgroundImage=src?`url(\"${src}\")`:'';el.style.backgroundSize=size+'px '+size+'px'}
 function playerEl(){return document.querySelector('#arenaPlayerName')?.closest('.arena-fighter')?.querySelector('.arena-fighter-icon')}
 function enemyEl(){return document.getElementById('arenaEnemyIcon')}
 function prepareAssets(){for(const v of Object.keys(HERO_ROOT))for(let i=0;i<HERO_FRAMES;i++)preload(heroIdle(v,i))}
 function enemyUsesSprite(){const name=String(document.getElementById('arenaEnemyName')?.textContent||'').toLowerCase();return /knight|shieldmaiden|sentinela/.test(name)}
 function draw(){const p=playerEl(),e=enemyEl();if(!p||!e)return;const v=playerVocation();paint(p,heroIdle(v,animFrame%HERO_FRAMES),HERO_SIZE);if(enemyUsesSprite()){const name=String(document.getElementById('arenaEnemyName')?.textContent||'').toLowerCase();const key=name.includes('shieldmaiden')?'02_shieldmaiden_IRONDEEP':name.includes('thorn')?'03_thorn_knight_VERDANT':name.includes('obsidian')?'04_obsidian_knight_EMBERWING':name.includes('glacier')?'05_glacier_knight_FROSTHOLD':name.includes('capshield')?'06_capshield_knight_GLOOMCAP':'01_coral_knight_SUNKEN';const src=ROOT+'six-kingdoms-free-v1.0/six-kingdoms-free-v1.0/'+key+'/128/south.png';paint(e,src,ENEMY_SIZE);e.textContent=''}else{paint(e,'',ENEMY_SIZE)}}
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

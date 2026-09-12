// Visual fix for Arena Waves: remove fallback weapon glyph, repair Rat sprite-sheet cropping,
// and turn the battle stage into an actual dungeon arena instead of a flat brown panel.
(()=>{
 const ROOT='arena-godot/assets-importados/';
 const RAT=ROOT+'monsters-lg-rpg/rat/idle.png';
 const RAT_W=748, RAT_H=70, RAT_FRAMES=10;
 const RAT_FRAME_W=RAT_W/RAT_FRAMES;
 const RAT_SIZE=88;
 function css(){
  if(document.getElementById('arena-game-visual-fix-style'))return;
  const s=document.createElement('style');s.id='arena-game-visual-fix-style';
  s.textContent=`
   #arenaGameMode .arena-game-battle{
    position:relative!important;display:block!important;min-height:390px!important;overflow:hidden!important;padding:0!important;
    border:3px solid #171717!important;
    background-color:#25272a!important;
    background-image:
      linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px),
      linear-gradient(90deg,rgba(0,0,0,.22) 1px,transparent 1px),
      linear-gradient(180deg,#3b3d3f 0%,#292b2d 52%,#202224 100%)!important;
    background-size:48px 48px,48px 48px,100% 100%!important;
    box-shadow:inset 0 0 0 10px #111214,inset 0 0 0 12px #57504a,inset 0 0 65px rgba(0,0,0,.82)!important;
   }
   #arenaGameMode .arena-game-battle:before{
    content:"";position:absolute;inset:14px;z-index:0;pointer-events:none;
    border:4px solid #161719;
    box-shadow:inset 0 0 0 3px #514b44,0 0 0 1px rgba(255,255,255,.04);
    background:
      linear-gradient(90deg,transparent 0 17%,rgba(12,13,14,.58) 17% 20%,transparent 20% 80%,rgba(12,13,14,.58) 80% 83%,transparent 83%),
      linear-gradient(0deg,rgba(12,13,14,.62) 0 12%,transparent 12% 88%,rgba(12,13,14,.62) 88% 100%);
   }
   #arenaGameMode .arena-game-battle:after{
    content:"";position:absolute;inset:28px;z-index:0;pointer-events:none;
    background:
      radial-gradient(circle at 7% 9%,#d89138 0 4px,rgba(216,145,56,.25) 5px,transparent 18px),
      radial-gradient(circle at 93% 9%,#d89138 0 4px,rgba(216,145,56,.25) 5px,transparent 18px),
      radial-gradient(circle at 7% 91%,#d89138 0 4px,rgba(216,145,56,.25) 5px,transparent 18px),
      radial-gradient(circle at 93% 91%,#d89138 0 4px,rgba(216,145,56,.25) 5px,transparent 18px);
    opacity:.9;
   }
   #arenaGameMode .arena-fighter,#arenaGameMode .arena-vs{z-index:3}
   #arenaGameMode .arena-fighter-icon{color:transparent!important;text-shadow:none!important}
   #arenaGameMode .arena-fighter-icon{background-repeat:no-repeat!important;background-position:center!important;}
   #arenaGameMode .arena-fighter.enemy .arena-fighter-icon{background-color:transparent!important;}
  `;
  document.head.appendChild(s);
 }
 function enemyName(){return String(document.getElementById('arenaEnemyName')?.textContent||'').toLowerCase()}
 function playerIcon(){return document.querySelector('#arenaPlayerName')?.closest('.arena-fighter')?.querySelector('.arena-fighter-icon')}
 function enemyIcon(){return document.getElementById('arenaEnemyIcon')}
 function fixText(){const p=playerIcon();if(p)p.textContent='';const e=enemyIcon();if(e)e.textContent=''}
 function rat(){
  const e=enemyIcon();if(!e||!enemyName().includes('rat'))return false;
  const frame=(Date.now()/180|0)%RAT_FRAMES;
  e.style.backgroundImage=`url("${RAT}")`;
  e.style.backgroundSize=`${RAT_SIZE*(RAT_W/RAT_H)}px ${RAT_SIZE}px`;
  e.style.backgroundPosition=`-${frame*RAT_SIZE*(RAT_FRAME_W/RAT_H)}px center`;
  e.style.backgroundRepeat='no-repeat';
  return true;
 }
 function boot(){css();fixText();rat()}
 function wait(){if(document.getElementById('arenaGameMode'))boot();else setTimeout(wait,250)}
 wait();setInterval(()=>{if(document.getElementById('arenaGameMode')){fixText();rat()}},90);
})();

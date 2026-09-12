// Visual fix for Arena Waves: remove fallback weapon glyph and turn the battle stage into a dungeon arena.
(()=>{
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
 function fixText(){
  const p=document.querySelector('#arenaPlayerName')?.closest('.arena-fighter')?.querySelector('.arena-fighter-icon');
  if(p)p.textContent='';
  const e=document.getElementById('arenaEnemyIcon');
  if(e)e.textContent='';
 }
 function boot(){css();fixText()}
 function wait(){if(document.getElementById('arenaGameMode'))boot();else setTimeout(wait,250)}
 wait();
 setInterval(()=>{if(document.getElementById('arenaGameMode'))fixText()},90);
})();

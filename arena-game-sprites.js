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
 const RAT_FRAMES=8,RAT_DIRECTIONS={north:0,east:1,south:2,west:3};
 const MONSTERS={
  rat:{src:ROOT+'3843.png',frames:35,w:64,h:64,rate:1,size:96,row:0,animated:true,individualFrames:true,base:3843,directionFrames:8,folder:''},
  troll:{src:ROOT+'3675.png',frames:35,w:64,h:64,rate:1,size:112,row:0,animated:true,individualFrames:true,base:3675,directionFrames:8,folder:''},
  scorpion:{src:ROOT+'scorpion/54629.png',frames:36,w:64,h:64,rate:1,size:112,row:0,animated:true,individualFrames:true,base:54629,directionFrames:9,folder:'scorpion/'},
  orcRider:{src:ROOT+'orc rider/3419.png',frames:36,w:64,h:64,rate:1,size:112,row:0,animated:true,individualFrames:true,base:3419,directionFrames:9,folder:'orc rider/'},
  cyclops:{src:ROOT+'cyc/3879.png',frames:36,w:64,h:64,rate:1,size:112,row:0,animated:true,individualFrames:true,base:3879,directionFrames:9,folder:'cyc/'},
  dragon:{src:ROOT+'4125.png',frames:36,w:64,h:64,rate:1,size:128,row:0,animated:true,individualFrames:true,base:4125,directionFrames:9,folder:''},
  orc:{src:ROOT+'13.png',frames:36,w:64,h:64,rate:1,size:112,row:0,animated:true,individualFrames:true,base:13,directionFrames:9,folder:''},
  orcBerserker:{src:ROOT+'53.png',frames:36,w:64,h:64,rate:1,size:112,row:0,animated:true,individualFrames:true,base:53,directionFrames:9,folder:''},
  dragonLord:{src:ROOT+'4301.png',frames:36,w:64,h:64,rate:1,size:128,row:0,animated:true,individualFrames:true,base:4301,directionFrames:9,folder:''},
  ancientScarab:{src:ROOT+'ancient scarab/5077.png',frames:36,w:64,h:64,rate:1,size:112,row:0,animated:true,individualFrames:true,base:5077,directionFrames:9,folder:'ancient scarab/'},
  ferumbras:{src:ROOT+'deathbringer campeão/15908.png',frames:36,w:64,h:64,rate:1,size:144,row:0,animated:true,individualFrames:true,base:15908,directionFrames:9,folder:'deathbringer campeão/'},
  frostDragon:{src:ROOT+'16265.png',frames:12,w:64,h:64,rate:1,size:128,row:0,animated:true,individualFrames:true,base:16265,directionFrames:3,folder:''},
  dragonHatchling:{src:ROOT+'18549.png',frames:36,w:64,h:64,rate:1,size:112,row:0,animated:true,individualFrames:true,base:18549,directionFrames:9,folder:''},
  demonSkeleton:{src:ROOT+'demon skeleton/4233.png',frames:32,w:64,h:64,rate:1,size:112,row:0,animated:true,individualFrames:true,base:4233,directionFrames:8,folder:'demon skeleton/'},
  hellhound:{src:ROOT+'16153.png',frames:12,w:64,h:64,rate:1,size:128,row:0,animated:true,individualFrames:true,base:16153,directionFrames:3,folder:''},
  goblin:{src:RAW+'goblin/idle.png',frames:4,w:150,h:150,rate:1,size:112,static:true},
  skeleton:{src:RAW+'skeleton/idle.png',frames:4,w:150,h:150,rate:1,size:112,static:true},
  sahuagin:{src:HIDDEN+'sahuagin-default_2.png?1550287917=',frames:9,w:64,h:64,rate:1,size:112,row:0,static:true},
  imp:{src:HIDDEN+'imp-dark-default_2.png?1550287170=',frames:9,w:64,h:64,rate:1,size:112,row:0,static:true},
  cockatrice:{src:HIDDEN+'cockatrice-default_2.png?1550201742=',frames:9,w:64,h:64,rate:1,size:112,row:0,static:true},
  gazer:{src:HIDDEN+'gazer-default_2.png?1550286768=',frames:9,w:64,h:64,rate:1,size:112,row:0,static:true},
  plant:{src:HIDDEN+'plant-wilted_2.png?1550287615=',frames:9,w:64,h:64,rate:1,size:112,row:0,static:true},
  snake:{src:HIDDEN+'snake-hornless_2.png?1550288470=',frames:9,w:64,h:64,rate:1,size:112,row:0,static:true},
  puppet:{src:HIDDEN+'puppet-default_2.png?1550287709=',frames:9,w:64,h:64,rate:1,size:112,row:0,static:true},
  drone:{src:HIDDEN+'drone-default_2.png?1550286560=',frames:9,w:64,h:64,rate:1,size:112,row:0,static:true},
  spider:{src:HIDDEN+'spider-sv_4.png?1550288631=',frames:9,w:64,h:64,rate:1,size:112,row:0,static:true},
  willoWisp:{src:ROOT+'monsters-static/demon.svg',frames:1,w:64,h:64,rate:1,size:144,row:0,static:true},
  sufferingSoul:{src:HIDDEN+'suffering-soul-default_2.png?1550288890=',frames:9,w:64,h:64,rate:1,size:112,row:0,static:true}
 };
 const HERO_FRAMES=3,HERO_SIZE=96;
 const PALADIN_SIZE=96;
 const PALADIN_DIRECTIONS={north:0,east:1,south:2,west:3};
 const PALADIN_ROOT='arena-godot/characters/';
 const paladinSrc=(dir)=>PALADIN_ROOT+String(6311+dir*2)+'.png';
 const MAGE_ROOT='arena-godot/characters/';
 const MAGE_SIZE=96;
 // Cada frame de caminhada do Mage tem 4 direções de base + 4 máscaras RGB.
 // A parte da montaria NÃO é usada: desenhamos somente o Rider/Player.
 const MAGE_WALK_FRAMES=[
  {base:6673,mask:6674},
  {base:6694,mask:6695},
  {base:6714,mask:6715}
 ];
 const MAGE_DIRECTIONS={north:0,east:1,south:2,west:3};
 const mageFrameSrc=(frame,dir)=>MAGE_ROOT+String(MAGE_WALK_FRAMES[frame%MAGE_WALK_FRAMES.length].base+dir*2)+'.png';
 const mageFrameMask=(frame,dir)=>MAGE_ROOT+String(MAGE_WALK_FRAMES[frame%MAGE_WALK_FRAMES.length].mask+dir*2)+'.png';
 const mageColors={
  head:'#d6a06d',
  body:'#3f7cff',
  details:'#7a4fd0',
  feet:'#8b5a2b'
 };
 const mageCanvasCache=new Map();
 const mageImages=new Map();
 const mageImage=(src)=>{
  if(mageImages.has(src))return mageImages.get(src);
  const img=new Image();
  img.decoding='async';
  img.crossOrigin='anonymous';
  img.src=src;
  mageImages.set(src,img);
  return img;
 };
 const mageHexRgb=(hex)=>{
  const s=String(hex||'').replace('#','');
  if(!/^[0-9a-fA-F]{6}$/.test(s))return [255,255,255];
  return [parseInt(s.slice(0,2),16),parseInt(s.slice(2,4),16),parseInt(s.slice(4,6),16)];
 };
 const mageRecolor=(frame,dir)=>{
  const colors=window.arenaMageColors||mageColors;
  const key=frame+'|'+dir+'|'+colors.head+'|'+colors.body+'|'+colors.details+'|'+colors.feet;
  if(mageCanvasCache.has(key))return mageCanvasCache.get(key);
  const base=mageImage(mageFrameSrc(frame,dir));
  const mask=mageImage(mageFrameMask(frame,dir));
  if(!base.complete||!mask.complete||!base.naturalWidth||!mask.naturalWidth){
   base.onload=()=>draw();
   mask.onload=()=>draw();
   return mageFrameSrc(frame,dir);
  }
  const w=base.naturalWidth,h=base.naturalHeight;
  const c=document.createElement('canvas');c.width=w;c.height=h;
  const ctx=c.getContext('2d');
  ctx.imageSmoothingEnabled=false;
  ctx.drawImage(base,0,0);
  const bi=ctx.getImageData(0,0,w,h);
  const mc=document.createElement('canvas');mc.width=w;mc.height=h;
  const mx=mc.getContext('2d');mx.drawImage(mask,0,0);
  const mi=mx.getImageData(0,0,w,h).data;
  const targets={
   head:mageHexRgb(colors.head),body:mageHexRgb(colors.body),
   details:mageHexRgb(colors.details),feet:mageHexRgb(colors.feet)
  };
  for(let i=0;i<bi.data.length;i+=4){
   const a=mi[i+3]; if(!a)continue;
   const r=mi[i],g=mi[i+1],b=mi[i+2];
   let target=null;
   if(r>180&&g>180&&b<120)target=targets.head;
   else if(r>180&&g<120&&b<120)target=targets.body;
   else if(r<120&&g>150&&b<150)target=targets.details;
   else if(r<120&&g<150&&b>150)target=targets.feet;
   if(!target)continue;
   bi.data[i]=target[0];bi.data[i+1]=target[1];bi.data[i+2]=target[2];
  }
  ctx.putImageData(bi,0,0);
  const out=c.toDataURL('image/png');
  mageCanvasCache.set(key,out);
  return out;
 };
 const GM_DIRECTIONS={north:0,east:1,south:2,west:3};
 const GM_ROOT=ROOT;
 const gmSrc=(dir,frame)=>GM_ROOT+String(1771+(frame%3)*4+dir)+'.png';
 let playerMoveDir=GM_DIRECTIONS.south,playerAnimFrame=0,lastPlayerPos=null;
 let timer=null,animFrame=0,attacking=false,lastEnemyHp=null;
 let demonMoveDir=DEMON_DIRECTIONS.south,demonAnimFrame=0,demonAnimating=false,lastDemonPos=null;
 let ratMoveDir=RAT_DIRECTIONS.south,ratAnimFrame=0,ratAnimating=false,lastRatPos=null,lastRatKind=null;
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
 function setupMageColorControls(){
  const panel=document.getElementById('mageColorPanel');
  if(!panel)return;
  const ids={head:'mageColorHead',body:'mageColorBody',details:'mageColorDetails',feet:'mageColorFeet'};
  const saved=window.game?.arenaMode?.outfitColors||{};
  window.arenaMageColors={...mageColors,...saved};
  Object.keys(ids).forEach(key=>{
   const input=document.getElementById(ids[key]);
   if(!input)return;
   input.value=window.arenaMageColors[key];
   if(input.dataset.mageHook)return;
   input.dataset.mageHook='1';
   input.addEventListener('input',()=>{
    window.arenaMageColors[key]=input.value;
    try{
     if(window.game){
      window.game.arenaMode=window.game.arenaMode||{};
      window.game.arenaMode.outfitColors={...window.arenaMageColors};
     }
     if(typeof window.persist==='function')window.persist();
    }catch(e){}
    mageCanvasCache.clear();
    draw();
   });
  });
  panel.hidden=playerVocation()!=='mage';
 }
 function syncMageColorControls(){
  const panel=document.getElementById('mageColorPanel');
  if(!panel)return;
  const saved=window.game?.arenaMode?.outfitColors||{};
  const next={...mageColors,...saved};
  window.arenaMageColors={...next};
  panel.hidden=playerVocation()!=='mage';
  const map={head:'mageColorHead',body:'mageColorBody',details:'mageColorDetails',feet:'mageColorFeet'};
  Object.keys(map).forEach(k=>{const el=document.getElementById(map[k]);if(el&&el.value!==next[k])el.value=next[k]});
 }
 function playerVocation(){let voc='';try{const current=typeof window.arenaSurviveCurrent==='function'?window.arenaSurviveCurrent():null;voc=String(current?.vocation||'')}catch(e){}if(!voc){try{const name=String(document.getElementById('arenaPlayerName')?.textContent||'').trim();let list=[];try{list=typeof members!=='undefined'&&Array.isArray(members)?members:[]}catch(e){}const member=list.find(m=>String(m?.name||'').trim()===name);voc=String(member?.vocation||'')}catch(e){}}voc=voc.toLowerCase().trim();if(voc.includes('paladin')||voc.includes('paladino'))return'paladin';if(voc.includes('sorcerer')||voc.includes('mage')||voc.includes('mago'))return'mage';if(voc.includes('druid'))return'druid';if(voc.includes('monk')||voc.includes('monge')||voc.includes('rogue'))return'rogue';return'knight'}
 function heroIdle(v,n){const voc=playerVocation();if(voc==='paladin')return paladinSrc(playerMoveDir);if(voc==='mage')return mageRecolor(n||0,playerMoveDir);return gmSrc(playerMoveDir,n)}
 function detectPlayerMovement(){
  const mode=window.__arenaGameState;
  if(!mode?.player)return;
  const x=Number(mode.player.x),y=Number(mode.player.y);
  if(!Number.isFinite(x)||!Number.isFinite(y))return;
  if(!lastPlayerPos){lastPlayerPos={x,y};return}
  const dx=x-lastPlayerPos.x,dy=y-lastPlayerPos.y;
  if(dx!==0||dy!==0){
   playerMoveDir=Math.abs(dx)>=Math.abs(dy)
    ?(dx>0?GM_DIRECTIONS.east:GM_DIRECTIONS.west)
    :(dy>0?GM_DIRECTIONS.south:GM_DIRECTIONS.north);
   playerAnimFrame=(playerAnimFrame+1)%3;
   lastPlayerPos={x,y};
  }
 }
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
 function detectRatMovement(){
  const mode=window.__arenaGameState;
  if(!mode?.enemyPos)return;
  const x=Number(mode.enemyPos.x),y=Number(mode.enemyPos.y);
  if(!Number.isFinite(x)||!Number.isFinite(y))return;
  if(!lastRatPos){lastRatPos={x,y};return}
  const dx=x-lastRatPos.x,dy=y-lastRatPos.y;
  if(dx!==0||dy!==0){
   ratMoveDir=Math.abs(dx)>=Math.abs(dy)
    ?(dx>0?RAT_DIRECTIONS.east:RAT_DIRECTIONS.west)
    :(dy>0?RAT_DIRECTIONS.south:RAT_DIRECTIONS.north);
   ratAnimFrame=ratAnimFrame+1;
   ratAnimating=true;
   lastRatPos={x,y};
  }
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
  if(m.individualFrames){
   const frameCount=m.directionFrames||Math.floor(m.frames/4);
   const mobIndex=(Math.min(frameCount-1,frame%frameCount)*4)+ratMoveDir;
   const src=ROOT+(m.folder||'')+String(m.base+mobIndex)+'.png';
   el.style.width=m.size+'px';
   el.style.height=m.size+'px';
   el.style.backgroundImage='url("'+src+'")';
   el.style.backgroundSize=m.size+'px '+m.size+'px';
   el.style.backgroundPosition='center';
   el.style.backgroundRepeat='no-repeat';
   return;
  }
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
 function prepareAssets(){for(let dir=0;dir<4;dir++)for(let frame=0;frame<3;frame++)preload(gmSrc(dir,frame));for(let dir=0;dir<4;dir++)preload(paladinSrc(dir));for(let frame=0;frame<3;frame++)for(let dir=0;dir<4;dir++){preload(mageFrameSrc(frame,dir));preload(mageFrameMask(frame,dir));}Object.values(MONSTERS).forEach(m=>{preload(m.src);if(m.individualFrames){for(let i=0;i<m.frames;i++)preload(ROOT+(m.folder||'')+String(m.base+i)+'.png')}});for(let dir=0;dir<4;dir++)for(let frame=0;frame<DEMON_FRAMES;frame++)preload(demonSrc(dir,frame))}
 function enemyKind(){
  const n=String(document.getElementById('arenaEnemyName')?.textContent||'').toLowerCase().replace(/\\s+/g,' ').trim();
  if(n.includes('rat'))return'rat';if(n.includes('troll'))return'troll';if(n.includes('orc berserker'))return'orcBerserker';if(n.includes('orc rider'))return'orcRider';if(n==='orc')return'orc';if(n.includes('cyclops'))return'cyclops';if(n.includes('scorpion'))return'scorpion';if(n.includes('ancient scarab')||n.includes('scarab'))return'ancientScarab';if(n.includes('dragon hatchling'))return'dragonHatchling';if(n.includes('dragon lord'))return'dragonLord';if(n.includes('frost dragon')||n.includes('drost dragon'))return'frostDragon';if(n==='dragon')return'dragon';if(n.includes('demon skeleton'))return'demonSkeleton';if(n.includes('hellhound'))return'hellhound';if(n.includes('ferumbras')||n.includes('deathbringer'))return'ferumbras';if(n==='demon')return'demonSurvive';return null;
 }
 function draw(){
  syncMageColorControls();
  const p=playerEl(),e=enemyEl();if(!p||!e)return;
  detectPlayerMovement();paint(p,heroIdle(null,playerAnimFrame),HERO_SIZE);p.textContent='';e.textContent='';
  const kind=enemyKind();const m=MONSTERS[kind];if(m?.individualFrames){if(lastRatKind!==kind){lastRatKind=kind;lastRatPos=null;ratAnimFrame=0;ratMoveDir=RAT_DIRECTIONS.south;ratAnimating=false;}detectRatMovement();paintSheet(e,m,ratAnimating?ratAnimFrame:0);return;}if(kind==='demonSurvive'){detectDemonMovement();paintDemon(e,demonMoveDir,demonAnimating?demonAnimFrame:0);return;}if(m)paintSheet(e,m,m.animated?animFrame%m.frames:0);else{e.style.backgroundImage='';e.style.width='112px';e.style.height='112px'}
 }
 function startAttack(){if(attacking)return;attacking=true;const p=playerEl();if(p){p.classList.remove('waves-attack');void p.offsetWidth;p.classList.add('waves-attack');setTimeout(()=>p.classList.remove('waves-attack'),300)}setTimeout(()=>{attacking=false;draw()},310)}
 function idleAnimation(){if(attacking)return;animFrame++;draw()}
 function enemyDamageFx(){const el=enemyEl();if(!el)return;el.classList.remove('waves-damage');void el.offsetWidth;el.classList.add('waves-damage');setTimeout(()=>el.classList.remove('waves-damage'),230)}
 function hookAttack(){const b=document.getElementById('arenaAttackBtn');if(b&&!b.dataset.pixelHook){b.dataset.pixelHook='1';b.addEventListener('click',()=>setTimeout(startAttack,0))}}
 function observeDamage(){const t=document.getElementById('arenaEnemyHpText');if(!t)return;const m=String(t.textContent||'').match(/([\d.,]+)\s*\/\s*([\d.,]+)/);if(!m)return;const hp=Number(m[1].replace(/\./g,'').replace(',','.'));if(lastEnemyHp!==null&&hp<lastEnemyHp)enemyDamageFx();lastEnemyHp=hp}
 function tick(){if(!document.getElementById('arenaGameMode'))return;hookAttack();draw();observeDamage()}
 function boot(){style();setupMageColorControls();prepareAssets();tick();if(timer)clearInterval(timer);timer=setInterval(()=>{tick();idleAnimation()},120)}
 function wait(){if(document.getElementById('arenaGameMode'))boot();else setTimeout(wait,300)}
 wait();
})();

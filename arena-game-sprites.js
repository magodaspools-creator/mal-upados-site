// Visual bridge for the Waves game on the Mal Upados website.
// Uses the pixel-art assets uploaded under arena-godot directly in the web game.
(()=>{
 const ROOT='arena-godot/assets-importados/';
 const heroes={
  knight:'knight-hero-128/knight-hero-128',
  mage:'mage-hero-128/mage-hero-128',
  archer:'archer-hero-128/archer-hero-128',
  rogue:'rogue-hero-128/rogue-hero-128'
 };
 const enemyVoc=['rogue','archer','mage','knight'];
 const frameCache={};
 let timer=null;
 let frame=0;
 let lastPlayer='';
 let lastEnemy='';

 function style(){
  if(document.getElementById('arena-game-sprites-style')) return;
  const s=document.createElement('style');
  s.id='arena-game-sprites-style';
  s.textContent=`
   #arenaGameMode{position:relative;overflow:hidden;background:#11151a url("${ROOT}Foozle Lucifer Dungeon Tileset/Foozle_2DT0003_Lucifer_Dungeon_Tileset_Pixel_Art/DungeonTileset Mockup.png") center/cover no-repeat;}
   #arenaGameMode:before{content:"";position:absolute;inset:0;background:rgba(7,9,12,.38);pointer-events:none;z-index:0}
   #arenaGameMode>*{position:relative;z-index:1}
   .arena-game-head,.arena-game-body{background:rgba(10,12,15,.78)}
   .arena-fighter{min-height:205px;display:flex;flex-direction:column;justify-content:center;align-items:center;background:rgba(12,15,18,.86)}
   .arena-fighter-icon{height:112px;width:112px;display:flex;align-items:center;justify-content:center;font-size:0;filter:drop-shadow(0 8px 8px rgba(0,0,0,.55))}
   .arena-fighter-icon img{width:112px;height:112px;object-fit:contain;image-rendering:pixelated}
   .arena-fighter.enemy .arena-fighter-icon img{width:100px;height:100px}
   .arena-game-actions{position:relative;z-index:3}
  `;
  document.head.appendChild(s);
 }
 function imgPath(vocation,frame){return ROOT+heroes[vocation]+'/idle_south/'+String(frame).padStart(2,'0')+'.png'}
 function setIcon(el,vocation,frame,size){
  if(!el||!heroes[vocation]) return;
  const key=vocation+':'+frame;
  if(!frameCache[key]){
   const img=new Image();
   img.src=imgPath(vocation,frame);
   frameCache[key]=img.src;
  }
  let img=el.querySelector('img');
  if(!img){img=document.createElement('img');el.replaceChildren(img)}
  img.alt=vocation;
  img.src=frameCache[key];
  if(size) img.style.width=img.style.height=size+'px';
 }
 function playerVocation(){
  const name=String(document.getElementById('arenaPlayerName')?.textContent||'').toLowerCase();
  if(name.includes('mage')||name.includes('mago'))return 'mage';
  if(name.includes('archer')||name.includes('paladin')||name.includes('paladino'))return 'archer';
  if(name.includes('rogue')||name.includes('monk')||name.includes('monge'))return 'rogue';
  return 'knight';
 }
 function enemyVocation(){
  const name=String(document.getElementById('arenaEnemyName')?.textContent||'').toLowerCase();
  if(name.includes('boss')||name.includes('lord')||name.includes('death'))return 'knight';
  const wave=Number(String(document.getElementById('arenaWaveTitle')?.textContent||'').match(/\d+/)?.[0]||1);
  return enemyVoc[(wave-1)%enemyVoc.length];
 }
 function apply(){
  const p=document.querySelector('#arenaPlayerName')?.closest('.arena-fighter')?.querySelector('.arena-fighter-icon');
  const e=document.getElementById('arenaEnemyIcon');
  if(!p||!e)return;
  const pv=playerVocation(),ev=enemyVocation();
  if(pv!==lastPlayer){lastPlayer=pv;frame=0}
  if(ev!==lastEnemy){lastEnemy=ev}
  setIcon(p,pv,frame,112);
  setIcon(e,ev,(frame+3)%10,100);
 }
 function tick(){
  frame=(frame+1)%10;
  apply();
 }
 function boot(){
  style();
  apply();
  if(timer)clearInterval(timer);
  timer=setInterval(()=>{
   const mode=document.getElementById('arenaGameMode');
   if(!mode){clearInterval(timer);timer=null;return}
   apply();
  },150);
  setInterval(tick,180);
 }
 function wait(){
  if(document.getElementById('arenaGameMode'))boot();
  else setTimeout(wait,100);
 }
 wait();
})();

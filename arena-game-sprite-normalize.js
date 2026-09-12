// Normaliza o tamanho visual das criaturas das Waves e corrige o spritesheet do Rat.
(()=>{
 const ROOT='arena-godot/assets-importados/monsters-lg-rpg/';
 const RAW='https://raw.githubusercontent.com/LiquidGalaxyLAB/lg-rpg/main/lg_rpg_server/public/assets/enemies/';
 const MAP={
  rat:{src:ROOT+'rat/idle.png',frames:8,frameW:94,frameH:70},
  goblin:{src:RAW+'goblin/idle.png',frames:4,frameW:150,frameH:150},
  skeleton:{src:RAW+'skeleton/idle.png',frames:4,frameW:150,frameH:150},
  slime:{src:RAW+'slime/idle.png',frames:14,frameW:156,frameH:156},
  bat:{src:RAW+'bat/fly.png',frames:11,frameW:87,frameH:87},
  dragon:{src:RAW+'boss/dragon_idle.png',frames:6,frameW:70,frameH:73}
 };
 const HEIGHT=100;
 function kind(){
  const n=(document.getElementById('arenaEnemyName')?.textContent||'').toLowerCase();
  if(n.includes('rat'))return'rat';
  if(n.includes('goblin')||n.includes('troll')||n.includes('orc'))return'goblin';
  if(n.includes('skeleton')||n.includes('cyclops')||n.includes('scarab')||n.includes('scorpion')||n.includes('demon'))return'skeleton';
  if(n.includes('slime'))return'slime';
  if(n.includes('bat')||n.includes('hellhound'))return'bat';
  if(n.includes('dragon'))return'dragon';
  return null;
 }
 function fix(){
  const el=document.getElementById('arenaEnemyIcon'),k=kind(),m=MAP[k];
  if(!el||!m)return;
  const frameW=HEIGHT*(m.frameW/m.frameH);
  const frame=window.__wavesSpriteFrame||0;
  el.style.width='104px';el.style.height='104px';
  el.style.backgroundImage=`url("${m.src}")`;
  el.style.backgroundRepeat='no-repeat';
  el.style.backgroundSize=`${frameW*m.frames}px ${HEIGHT}px`;
  el.style.backgroundPosition=`${-(frame% m.frames)*frameW}px center`;
  el.textContent='';
 }
 function boot(){
  setInterval(()=>{window.__wavesSpriteFrame=(window.__wavesSpriteFrame||0)+1;fix()},120);
  fix();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();

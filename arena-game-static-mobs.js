// Waves: force non-Rat enemies to use one-frame standalone SVG assets.
(()=>{
 const ROOT='arena-godot/assets-importados/monsters-static/';
 const MAP={
  troll:'sahuagin.svg',orc:'goblin.svg','orc berserker':'imp.svg','orc rider':'cockatrice.svg',cyclops:'gazer.svg',scorpion:'scorpion.svg','ancient scarab':'plant.svg','dragon hatchling':'snake.svg',dragon:'dragon.svg','dragon lord':'puppet.svg','frost dragon':'drone.svg','demon skeleton':'skeleton.svg',hellhound:'spider.svg',demon:'willowisp.svg',deathbringer:'suffering-soul.svg'
 };
 function apply(){
  const icon=document.getElementById('arenaEnemyIcon');
  const name=String(document.getElementById('arenaEnemyName')?.textContent||'').trim().toLowerCase();
  if(!icon||!name||name.includes('rat'))return;
  const file=MAP[name] || Object.keys(MAP).find(k=>name.includes(k));
  if(!file)return;
  const url=ROOT+file;
  if(icon.dataset.staticMobUrl!==url){
   icon.dataset.staticMobUrl=url;
   icon.textContent='';
   icon.style.backgroundImage=`url("${url}")`;
   icon.style.backgroundSize='112px 112px';
   icon.style.backgroundPosition='center';
   icon.style.backgroundRepeat='no-repeat';
  }
 }
 function boot(){apply();setInterval(apply,150)}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();

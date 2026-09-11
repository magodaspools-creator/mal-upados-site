window.addXP=function(amount){
  game.xp+=amount;
  while(game.xp>=xpNeed()){
    game.xp-=xpNeed();
    game.level++;
    toast(`LEVEL UP! Você chegou ao Arena Level ${game.level}.`);
  }
  return amount;
};

window.renderMap=function(){
  const map=document.getElementById('map');
  if(!map)return;
  map.innerHTML=ZONES.map((z,i)=>{
    const unlocked=game.level>=z.min;
    return `<div class="zone ${i===game.zone?'selected':''} ${unlocked?'':'locked'}">
      <span class="lock">${unlocked?'':'🔒 '+z.min}</span>
      <div class="zone-icon">${z.icon}</div>
      <strong>${esc(z.name)}</strong>
      <small>${esc(z.color)} · Level ${z.min}+</small>
    </div>`;
  }).join('');

  const count=ZONES.filter(z=>game.level>=z.min).length;
  document.getElementById('zoneCount').textContent=`${count} de ${ZONES.length} áreas desbloqueadas`;

  const next=document.getElementById('nextZoneBtn');
  if(!next)return;
  const ni=game.zone+1;
  const available=ni<ZONES.length&&game.level>=ZONES[ni].min;
  next.disabled=!available;
  next.textContent=available?`Próxima área → ${ZONES[ni].name}`:'Próxima área bloqueada';
  next.onclick=()=>{
    if(!available)return;
    game.zone=ni;
    persist();
    renderAll();
    showZone(game.zone);
  };
};

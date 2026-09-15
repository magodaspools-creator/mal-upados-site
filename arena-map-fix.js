// Regras da progressão do mapa:
// áreas já desbloqueadas podem ser escolhidas livremente;
// a troca de área nunca acontece automaticamente.
if (typeof ZONES !== 'undefined' && Array.isArray(ZONES)) {
  const levelGaps = [1, 10, 20, 35, 50];
  ZONES.forEach((zone, index) => {
    if (levelGaps[index] != null) zone.min = levelGaps[index];
  });
}

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
  if(!map||typeof game==='undefined'||!game||!Array.isArray(ZONES))return;

  map.innerHTML=ZONES.map((z,i)=>{
    const unlocked=game.level>=z.min;
    return `<div class="zone ${i===game.zone?'selected':''} ${unlocked?'':'locked'}" data-zone="${i}" role="button" tabindex="${unlocked?'0':'-1'}" aria-disabled="${unlocked?'false':'true'}">
      <span class="lock">${unlocked?'':'🔒 '+z.min}</span>
      <div class="zone-icon">${z.icon}</div>
      <strong>${esc(z.name)}</strong>
      <small>${esc(z.color)} · Level ${z.min}+</small>
    </div>`;
  }).join('');

  const count=ZONES.filter(z=>game.level>=z.min).length;
  const zoneCount=document.getElementById('zoneCount');
  if(zoneCount)zoneCount.textContent=`${count} de ${ZONES.length} áreas desbloqueadas`;

  map.querySelectorAll('.zone:not(.locked)').forEach(card=>{
    const selectZone=()=>{
      const index=Number(card.dataset.zone);
      if(!Number.isInteger(index)||index<0||index>=ZONES.length)return;
      game.zone=index;
      persist();
      renderAll();
      showZone(game.zone);
    };
    card.addEventListener('click',selectZone);
    card.addEventListener('keydown',e=>{
      if(e.key==='Enter'||e.key===' '){
        e.preventDefault();
        selectZone();
      }
    });
  });

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

// arena.js can render once before this override is loaded. Re-render after the
// character/game state becomes available so "Escolha seu destino" never stays empty.
(()=>{
  let tries=0;
  const timer=setInterval(()=>{
    tries++;
    if(typeof game!=='undefined'&&game&&typeof renderMap==='function'){
      renderMap();
      clearInterval(timer);
      return;
    }
    if(tries>120)clearInterval(timer);
  },100);
})();

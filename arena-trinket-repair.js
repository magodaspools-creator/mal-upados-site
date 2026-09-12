// Correções defensivas do sistema de Trinkets.
(()=>{
  if(window.__arenaTrinketRepairInstalled)return;
  window.__arenaTrinketRepairInstalled=true;

  function catalog(){return window.arenaTrinkets?.TRINKETS||[]}
  function equipped(){return Array.isArray(game?.shopEquipped?.trinkets)?game.shopEquipped.trinkets:[]}

  // O perfil antigo procura Trinkets apenas em SHOP_ITEMS, que contém somente os cards-base.
  // Aqui sincronizamos o quadrado visual diretamente com o catálogo completo, incluindo níveis 2/3.
  function renderSetTrinkets(){
    const box=document.querySelector('.slot-trinket');
    if(!box)return;
    const list=equipped().map(id=>catalog().find(x=>x.id===id)).filter(Boolean);
    const content=list.length
      ? `<div class="trinket-set-title">Trinkets</div><div class="trinket-set-list">${list.map(x=>{
          const accent=x.type==='loot'?'#d8b85b':x.type==='crit'?'#d96a62':'#a65c6b';
          const icon=x.type==='loot'?'✦':x.type==='crit'?'◆':'♥';
          const label=x.type==='loot'?'Loot':x.type==='crit'?'Crítico':'Roubo de vida';
          const level=x.level?` ${['','I','II','III'][x.level]||''}`:'';
          return `<div class="trinket-set-item"><div class="trinket-set-icon" style="color:${accent};font-size:1rem;text-shadow:0 0 8px ${accent}">${icon}</div><div><small>${label}</small><strong>${x.name}${level}</strong><em>${x.bonus||''}</em></div></div>`;
        }).join('')}</div>`
      : `<div class="trinket-set-title">Trinkets</div><div class="trinket-set-empty"><span>＋</span><small>Trinkets</small><b>Nenhum equipado</b></div>`;
    if(box.innerHTML!==content)box.innerHTML=content;
  }

  // arena.js não cria playerMax. O wrapper de Trinkets usa esse campo para limitar o lifesteal;
  // inicializamos a vida máxima com o HP atual antes do ataque para impedir Math.min(..., undefined)=NaN.
  function repairHpCap(){
    if(typeof battle==='undefined'||!battle)return;
    if(!Number.isFinite(Number(battle.playerMax))){
      battle.playerMax=Math.max(1,Number(battle.playerHp)||1);
    }
  }

  function loop(){
    renderSetTrinkets();
    repairHpCap();
  }

  setInterval(loop,300);
  setTimeout(loop,100);
  window.addEventListener('load',loop);
})();

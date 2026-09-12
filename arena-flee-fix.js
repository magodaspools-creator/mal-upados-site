// Reset de combate ao fugir, evitando referências antigas do Boss Final.
(()=>{
  if(window.__arenaFleeFix)return;
  window.__arenaFleeFix=true;

  const originalRenderBattle=window.renderBattle;
  if(typeof originalRenderBattle!=='function')return;

  const bind=()=>{
    const attackBtn=document.getElementById('attackBtn');
    const fleeBtn=document.getElementById('fleeBtn');

    // Sempre usa a função de ataque atualmente registrada no sistema.
    if(attackBtn&&typeof window.attack==='function'){
      attackBtn.onclick=window.attack;
      attackBtn.disabled=false;
    }

    if(fleeBtn){
      fleeBtn.onclick=()=>{
        battle=null;
        // Remove qualquer estado visual/modal residual do Boss Final.
        document.getElementById('demonCampaignPopup')?.remove();
        document.getElementById('arenaBestiaryModal')?.remove();
        document.body.classList.remove('arena-modal-open');
        document.body.style.overflow='';

        // Renderiza a seleção de criaturas somente depois de limpar o combate.
        setTimeout(()=>{
          if(!battle&&typeof showZone==='function')showZone(game.zone);
        },0);
      };
    }
  };

  window.renderBattle=function(){
    originalRenderBattle.apply(this,arguments);
    bind();
  };

  // Também corrige imediatamente caso o script entre depois de uma batalha já renderizada.
  bind();
})();

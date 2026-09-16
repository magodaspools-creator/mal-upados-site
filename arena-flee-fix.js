// Reset de combate ao fugir, sem substituir handlers específicos de Boss.
(()=>{
  if(window.__arenaFleeFix)return;
  window.__arenaFleeFix=true;

  const originalRenderBattle=window.renderBattle;
  if(typeof originalRenderBattle!=='function')return;

  const bind=()=>{
    const attackBtn=document.getElementById('attackBtn');
    const fleeBtn=document.getElementById('fleeBtn');

    // Bosses possuem handler próprio. Nunca sobrescreva esse botão.
    const isBoss=!!(typeof battle!=='undefined'&&battle?.isBoss);
    if(attackBtn&&!isBoss&&typeof window.attack==='function'){
      attackBtn.onclick=window.attack;
      attackBtn.disabled=false;
    }

    if(fleeBtn){
      fleeBtn.onclick=()=>{
        battle=null;
        document.getElementById('demonCampaignPopup')?.remove();
        document.getElementById('arenaBestiaryModal')?.remove();
        document.body.classList.remove('arena-modal-open');
        document.body.style.overflow='';

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

  bind();
})();

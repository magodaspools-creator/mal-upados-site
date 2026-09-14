// Mecânica especial do Deathbringer.
// Isolada do combate autoritativo dos Bosses para não alterar a pipeline de Skill.
(()=>{
  if(window.__arenaDeathbringerMechanic)return;
  window.__arenaDeathbringerMechanic=true;

  let originalBossAttack=null;

  function isDeathbringer(b){
    return !!b?.isBoss && Number(b.zoneIndex)===4 && b.name==='Deathbringer';
  }

  function install(){
    const direct=window.__arenaBossAttackDirect;
    if(typeof direct!=='function'){
      setTimeout(install,50);
      return;
    }
    if(!originalBossAttack)originalBossAttack=direct;
    const wrapped=window.__arenaDeathbringerAttack;
    if(!wrapped){
      window.__arenaDeathbringerAttack=function(){
        if(!battle?.isBoss||!isDeathbringer(battle))return originalBossAttack();

        const fight=battle;
        originalBossAttack();

        // Se o golpe matou o boss, não existe segunda fase.
        if(typeof battle==='undefined'||battle!==fight||!isDeathbringer(battle)||battle.hp<=0)return;
        if(battle.finalPhase2)return;

        const threshold=battle.maxHp*0.50;
        if(battle.hp>threshold)return;

        battle.finalPhase2=true;
        const heal=Math.floor(battle.maxHp*0.12);
        battle.hp=Math.min(battle.maxHp,battle.hp+heal);
        battle.damage=Math.floor(battle.damage*1.35);

        // Explosão da Fase 2: dano percentual no jogador, sem matar por este efeito.
        const explosion=Math.max(1,Math.floor(battle.playerMax*0.18));
        battle.playerHp=Math.max(1,battle.playerHp-explosion);
        battleLog(`<b>☠️ FASE 2 — EXPLOSÃO DA MORTE!</b> Deathbringer recuperou ${fmt(heal)} HP, entrou em fúria e liberou uma explosão de morte que causou <b>${fmt(explosion)}</b> de dano.`);
        renderBattle();
      };
    }

    // O Boss usa uma referência direta no botão. Reaplica a referência após cada render.
    bindButton();
    if(!window.__arenaDeathbringerObserver){
      window.__arenaDeathbringerObserver=new MutationObserver(bindButton);
      window.__arenaDeathbringerObserver.observe(document.body,{childList:true,subtree:true});
    }
  }

  function bindButton(){
    const btn=document.getElementById('attackBtn');
    if(!btn||!battle?.isBoss)return;
    if(isDeathbringer(battle)){
      btn.onclick=window.__arenaDeathbringerAttack;
      btn.__arenaDeathbringerBound=true;
    }
  }

  install();
})();

// Mecânica especial do Deathbringer.
// Isolada do combate autoritativo dos Bosses para não alterar a fórmula de Skill.
(()=>{
  if(window.__arenaDeathbringerMechanic)return;
  window.__arenaDeathbringerMechanic=true;
  let originalBossAttack=null;
  function isDeathbringer(b){return !!b?.isBoss&&Number(b.zoneIndex)===4&&b.name==='Deathbringer';}
  function install(){
    const direct=window.__arenaBossAttackDirect;
    if(typeof direct!=='function'){setTimeout(install,50);return;}
    if(!originalBossAttack)originalBossAttack=direct;
    if(!window.__arenaDeathbringerAttack){
      window.__arenaDeathbringerAttack=function(){
        if(!battle?.isBoss||!isDeathbringer(battle))return originalBossAttack();
        const fight=battle;
        originalBossAttack();
        if(typeof battle==='undefined'||battle!==fight||!isDeathbringer(battle)||battle.hp<=0)return;
        if(battle.finalPhase2||battle.hp>battle.maxHp*0.50)return;
        battle.finalPhase2=true;
        const heal=Math.floor(battle.maxHp*0.12);
        battle.hp=Math.min(battle.maxHp,battle.hp+heal);
        battle.damage=Math.floor(battle.damage*1.35);
        const explosion=Math.max(1,Math.floor(battle.playerMax*0.18));
        battle.playerHp=Math.max(1,battle.playerHp-explosion);
        battleLog(`<b>☠️ FASE 2 — EXPLOSÃO DA MORTE!</b> Deathbringer recuperou <b>${fmt(heal)}</b> HP, entrou em fúria e liberou uma explosão de morte que causou <b>${fmt(explosion)}</b> de dano.`);
        renderBattle();
      };
    }
    if(!window.__arenaDeathbringerRebind){
      window.__arenaDeathbringerRebind=setInterval(()=>{
        const btn=document.getElementById('attackBtn');
        if(!btn||!battle?.isBoss)return;
        if(isDeathbringer(battle)){
          btn.onclick=window.__arenaDeathbringerAttack;
          btn.__arenaDeathbringerBound=true;
          window.__arenaBossAttackDirect=window.__arenaDeathbringerAttack;
        }else if(window.__arenaBossAttackDirect!==originalBossAttack){
          window.__arenaBossAttackDirect=originalBossAttack;
        }
      },50);
    }
  }
  install();
})();

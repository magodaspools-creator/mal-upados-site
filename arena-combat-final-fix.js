// Correção final do combate de Boss.
// O motor base chama a função winBattle localmente, então o wrapper do sistema de Boss
// não consegue interceptar a morte do Deathbringer. Aqui tratamos apenas batalhas de Boss.
(()=>{
  if(window.__arenaCombatFinalFix)return;
  window.__arenaCombatFinalFix=true;

  const originalAttack=window.attack;
  if(typeof originalAttack!=='function')return;

  window.attack=function(){
    // Batalhas normais continuam usando exatamente o motor original.
    if(!battle?.isBoss){
      return originalAttack.apply(this,arguments);
    }

    if(battle.hp<=0||battle.playerHp<=0)return;

    const dmg=Math.max(1,battle.attack+Math.floor(Math.random()*12)-6);
    battle.hp=Math.max(0,battle.hp-dmg);
    game.damage+=dmg;
    battleLog(`Você causou <b>${dmg}</b> de dano.`);

    // IMPORTANTE: usar window.winBattle() para permitir que arena-bosses.js
    // execute loot, tokens, cooldown e limpeza do Boss.
    if(battle.hp<=0){
      if(typeof window.winBattle==='function')window.winBattle();
      return;
    }

    const incoming=Math.max(1,battle.damage+Math.floor(Math.random()*10)-5);
    battle.playerHp=Math.max(0,battle.playerHp-incoming);
    battleLog(`${esc(battle.name)} causou <b>${incoming}</b> de dano.`);

    if(battle.playerHp<=0){
      if(typeof loseBattle==='function')loseBattle();
      return;
    }

    // Deathbringer — segunda fase.
    const finalFight=Number(battle.zoneIndex)===4;
    if(finalFight&&!battle.finalPhase2&&battle.hp<=battle.maxHp*0.5){
      battle.finalPhase2=true;
      const heal=Math.floor(battle.maxHp*0.12);
      battle.hp=Math.min(battle.maxHp,battle.hp+heal);
      battle.damage=Math.floor(battle.damage*1.35);
      const pulse=Math.max(1,Math.floor(battle.playerMax*0.18));
      battle.playerHp=Math.max(1,battle.playerHp-pulse);
      battleLog(`<b>☠️ FASE 2 — COLHEITA DA MORTE!</b> Deathbringer recuperou ${fmt(heal)} HP, ficou enfurecido e lançou uma onda de morte que causou ${fmt(pulse)} de dano.`);
    }

    renderBattle();
  };
})();

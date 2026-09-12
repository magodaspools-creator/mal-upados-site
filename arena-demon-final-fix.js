// Marco de campanha + Boss Final reforçado.
// Mantém o motor de combate intacto e adiciona apenas a transição Demon -> Boss Final
// e uma segunda fase para o Deathbringer.
(()=>{
  const bossApi=window.arenaBosses;
  if(bossApi?.BOSSES?.[4]){
    const finalBoss=bossApi.BOSSES[4];
    finalBoss.hp=8500;
    finalBoss.damage=700;
    finalBoss.gold=6000;
    finalBoss.xp=8000;
  }

  function campaignPopup(){
    document.getElementById('demonCampaignPopup')?.remove();
    const el=document.createElement('div');
    el.id='demonCampaignPopup';
    el.innerHTML=`<div class="demon-popup-backdrop"></div><section class="demon-popup" role="dialog" aria-modal="true" aria-labelledby="demonPopupTitle"><div class="demon-popup-art">😈</div><div class="eyebrow">MARCO DA CAMPANHA</div><h2 id="demonPopupTitle">DEMON DERROTADO</h2><p>Você atravessou o Abismo Demoníaco e derrotou uma das criaturas mais brutais da Arena.</p><div class="demon-popup-divider"></div><div class="demon-popup-next"><span>PRÓXIMO DESAFIO</span><strong>☠️ DEATHBRINGER</strong><small>O verdadeiro Boss Final agora está desbloqueado.</small></div><button class="btn active big" id="demonPopupContinue">ENFRENTAR O BOSS FINAL</button><button class="demon-popup-skip" id="demonPopupSkip">Continuar depois</button></section>`;
    document.body.appendChild(el);
    const close=()=>el.remove();
    document.getElementById('demonPopupContinue')?.addEventListener('click',()=>{close();if(typeof showZone==='function'){game.zone=4;persist();renderAll();showZone(4)}});
    document.getElementById('demonPopupSkip')?.addEventListener('click',close);
    el.querySelector('.demon-popup-backdrop')?.addEventListener('click',close);
  }

  const originalWin=window.winBattle;
  if(typeof originalWin==='function'&&!window.__arenaDemonFinalWinWrapped){
    window.__arenaDemonFinalWinWrapped=true;
    window.winBattle=function(){
      const wasDemon=!!battle && Number(battle.zoneIndex)===4 && battle.name==='Demon';
      originalWin();
      if(wasDemon)setTimeout(campaignPopup,80);
    };
  }

  const originalAttack=window.attack;
  if(typeof originalAttack==='function'&&!window.__arenaFinalBossMechanicWrapped){
    window.__arenaFinalBossMechanicWrapped=true;
    window.attack=function(){
      const finalFight=!!battle && battle.isBoss && Number(battle.zoneIndex)===4;
      originalAttack();
      if(!finalFight||!battle||battle.zoneIndex!==4||battle.hp<=0)return;
      const threshold=battle.maxHp*0.5;
      if(!battle.finalPhase2 && battle.hp<=threshold){
        battle.finalPhase2=true;
        const heal=Math.floor(battle.maxHp*0.12);
        battle.hp=Math.min(battle.maxHp,battle.hp+heal);
        battle.damage=Math.floor(battle.damage*1.35);
        const pulse=Math.max(1,Math.floor(battle.playerMax*0.18));
        battle.playerHp=Math.max(1,battle.playerHp-pulse);
        battleLog(`<b>☠️ FASE 2 — COLHEITA DA MORTE!</b> Deathbringer recuperou ${fmt(heal)} HP, ficou enfurecido e lançou uma onda de morte que causou ${fmt(pulse)} de dano.`);
        renderBattle();
      }
    };
    if(typeof attack!=='undefined')attack=window.attack;
  }

  function style(){
    if(document.getElementById('arena-demon-final-style'))return;
    const s=document.createElement('style');s.id='arena-demon-final-style';s.textContent=`#demonCampaignPopup{position:fixed;inset:0;z-index:99999;display:grid;place-items:center;padding:20px}.demon-popup-backdrop{position:absolute;inset:0;background:rgba(0,0,0,.82);backdrop-filter:blur(5px)}.demon-popup{position:relative;width:min(520px,100%);padding:30px 26px 24px;text-align:center;border:1px solid #6b2020;background:radial-gradient(circle at 50% 0,#321617 0,#171315 45%,#0c0d0f 100%);box-shadow:0 24px 80px rgba(0,0,0,.65),inset 0 0 50px rgba(130,20,20,.08);animation:demonPopupIn .22s ease-out}.demon-popup-art{width:86px;height:86px;margin:0 auto 12px;display:grid;place-items:center;font-size:54px;border:1px solid #713030;background:#120d0e;box-shadow:0 0 30px rgba(180,30,30,.22)}.demon-popup h2{margin:5px 0 10px;color:#eee;font-family:Cinzel,serif;font-size:1.65rem;letter-spacing:.04em}.demon-popup p{margin:0 auto 16px;max-width:410px;color:#aeb2b9;font-size:.78rem;line-height:1.6}.demon-popup-divider{height:1px;background:linear-gradient(90deg,transparent,#623030,transparent);margin:16px 0}.demon-popup-next{padding:13px 12px;margin-bottom:18px;border:1px solid #443b2a;background:#12110e}.demon-popup-next span{display:block;color:#777d86;font-size:.58rem;letter-spacing:.13em}.demon-popup-next strong{display:block;margin:5px 0;color:#e2d2a4;font-family:Cinzel,serif;font-size:1.08rem}.demon-popup-next small{color:#8f949b;font-size:.67rem}.demon-popup-skip{display:block;margin:10px auto 0;border:0;background:none;color:#737981;font-size:.65rem;cursor:pointer}.demon-popup-skip:hover{color:#bbb}@keyframes demonPopupIn{from{opacity:0;transform:translateY(8px) scale(.98)}to{opacity:1;transform:none}}`;document.head.appendChild(s)}
  style();

  // O timer entra por último para conseguir observar a vitória do Boss Final.
  const timerSrc='arena-campaign-timer.js?v=campaign-timer-20260912';
  if(!document.querySelector(`script[src^="arena-campaign-timer.js"]`)){
    const s=document.createElement('script');s.src=timerSrc;document.body.appendChild(s);
  }
  // Bestiário depois do timer, para observar a vitória final sem interferir no relógio.
  const bestiarySrc='arena-bestiary.js?v=bestiary-20260912';
  if(!document.querySelector(`script[src^="arena-bestiary.js"]`)){
    const s=document.createElement('script');s.src=bestiarySrc;document.body.appendChild(s);
  }
})();

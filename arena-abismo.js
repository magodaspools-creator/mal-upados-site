// Arena — Fase 8: Abismo Demoníaco.
// Camada narrativa isolada. Não substitui combate, renderer, XP, ranking ou progressão.
(()=> {
  const ZONE=4, MAP_ID='map5', ENTRY_EVENT='map5_cathedral', THRONE_EVENT='map5_throne_room', BOSS_EVENT='map5_boss_defeat';
  const narrative=()=>window.ArenaNarrative||null;
  const selectedZone=()=>{const el=document.querySelector('.zone.selected');return el?Number(el.dataset.zone):null};

  function renderScene(){
    const zone=selectedZone(), existing=document.getElementById('arenaAbyssScene');
    if(zone!==ZONE){existing?.remove();return}
    const battleArea=document.getElementById('battleArea'); if(!battleArea)return;
    const n=narrative(); if(!n)return;

    if(!existing){
      const html='<section id="arenaAbyssScene" class="arena-abyss-scene" aria-label="Narrativa do Abismo Demoníaco">'
       +'<div class="abyss-header"><div><div class="eyebrow">Capítulo V · Abismo Demoníaco</div><h3>A catedral onde ninguém celebra a vitória</h3></div><span class="abyss-mark">A GUARDA REAL</span></div>'
       +'<div class="abyss-cathedral" aria-hidden="true"><div class="abyss-arch arch-back"></div><div class="abyss-arch arch-mid"></div><div class="abyss-arch arch-front"></div><div class="abyss-crystal crystal-a"></div><div class="abyss-crystal crystal-b"></div><div class="abyss-crystal crystal-c"></div><div class="abyss-knight knight-a"></div><div class="abyss-knight knight-b"></div><div class="abyss-knight knight-c"></div><div class="abyss-floor"></div></div>'
       +'<div class="abyss-silence"><span>SILÊNCIO SEPULCRAL</span><strong>Ninguém aqui parece comemorar a queda do invasor.</strong><p>Os guardas de armadura branca, manchados pelo preto do Cisma, avançam sem gritos. A sensação é de luto, não de conquista.</p></div>'
       +'<div class="abyss-clues"><article><strong>✦ A arquitetura perfeita</strong><p>As formas do Abismo parecem uma versão intacta e divina das construções encontradas nos quatro domínios anteriores.</p></article><article><strong>☾ A guarda real</strong><p>Os chamados demônios usam armaduras de cavaleiros alados. Eles não parecem uma invasão: parecem uma última linha de proteção.</p></article><article><strong>◇ O luto</strong><p>Não há troféus, pilhagem ou sinais de celebração. A presença dos guardas transmite a tristeza de quem perdeu o próprio rei.</p></article></div>'
       +'<div class="abyss-throne" aria-label="Sala do Trono"><div class="abyss-throne-label">SALA DO TRONO</div><div class="abyss-throne-room"><div class="throne-back"></div><div class="throne-seat"></div><div class="sovereign-corpse"><div class="corpse-head"></div><div class="corpse-chest"></div><div class="corpse-arm arm-left"></div><div class="corpse-arm arm-right"></div></div><div class="throne-light"></div></div><div class="throne-text"><strong>Há um corpo no trono.</strong><span>Um rei mumificado, sem rosto visível, com o peito aberto e vazio. Não há marcas de batalha ao redor — apenas sinais de luto.</span></div></div>'
       +'<div class="abyss-warning"><span>O QUE AINDA NÃO FOI REVELADO</span><strong>Não toque no corpo.</strong><p>O trono guarda a resposta para tudo o que veio antes. A verdade permanece oculta até o momento certo.</p></div></section>';
      battleArea.insertAdjacentHTML('beforebegin',html);
      if(!n.hasEvent(ENTRY_EVENT)){
        n.setChapter(MAP_ID); n.completeEvent(ENTRY_EVENT,{entry:'abyss_cathedral'});
        n.discoverClue('map5_mourning_guard'); n.discoverClue('map5_perfect_architecture');
      }
      if(!n.hasEvent(THRONE_EVENT))n.completeEvent(THRONE_EVENT,{entry:'throne_room',revelationReady:true});
    }
  }

  function renderBossNarrative(){
    if(typeof battle==='undefined'||!battle?.isBoss||Number(battle.zoneIndex)!==ZONE)return;
    const card=document.querySelector('.boss-battle-card'); if(!card)return;
    const title=card.querySelector('.battle-head h3');
    if(title&&!title.dataset.abyssLore){
      title.dataset.abyssLore='1';
      title.insertAdjacentHTML('afterend','<div class="abyss-boss-label">GUARDA REAL DO ABISMO · ÚLTIMA VIGÍLIA</div>');
    }
  }

  function installBossHook(){
    if(window.__arenaAbyssWinHook)return;
    const original=window.winBattle;if(typeof original!=='function')return;
    window.winBattle=function(){
      const abyssBoss=typeof battle!=='undefined'&&battle?.isBoss&&Number(battle.zoneIndex)===ZONE;
      original.apply(this,arguments);
      if(!abyssBoss)return;
      const n=narrative();if(!n||n.hasEvent(BOSS_EVENT))return;
      n.completeEvent(BOSS_EVENT,{source:'royal_guard',boss:'deathbringer'});
      if(typeof toast==='function')toast('A última vigília caiu. O caminho para o trono está aberto.');
      setTimeout(renderScene,100);
    };
    window.__arenaAbyssWinHook=true;
  }

  function observe(){
    const map=document.getElementById('map'); if(!map)return;
    new MutationObserver(()=>setTimeout(()=>{renderScene();renderBossNarrative();installBossHook()},0))
      .observe(map,{subtree:true,childList:true,attributes:true,attributeFilter:['class','data-zone']});
    setInterval(()=>{renderScene();renderBossNarrative();installBossHook()},350);
    setTimeout(()=>{renderScene();renderBossNarrative();installBossHook()},250);
  }

  function boot(){if(narrative())observe()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
  window.ArenaAbyssLore={render:renderScene};
})();

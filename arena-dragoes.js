// Arena — Fase 7: Covil dos Dragões.
// Camada narrativa isolada. Não altera combate, renderer, XP ou progressão.
(()=> {
  const ZONE=3, MAP_ID='map4';
  const CHAIN_EVENT='map4_chains_reveal';
  const KAELEN_BREAK_EVENT='map4_kaelen_break';
  const BOSS_EVENT='map4_boss_defeat';
  const DESCENT_EVENT='map4_descent';
  const narrative=()=>window.ArenaNarrative||null;
  const selectedZone=()=>{const el=document.querySelector('.zone.selected');return el?Number(el.dataset.zone):null};

  function renderScene(){
    const zone=selectedZone();
    const existing=document.getElementById('arenaDragonScene');
    if(zone!==ZONE){existing?.remove();return}
    const battleArea=document.getElementById('battleArea'); if(!battleArea)return;
    const n=narrative(); if(!n)return;

    if(!existing){
      const html='<section id="arenaDragonScene" class="arena-dragon-scene" aria-label="Narrativa do Covil dos Dragões">'
       +'<div class="dragon-header"><div><div class="eyebrow">Capítulo IV · Covil dos Dragões</div><h3>O poder que nunca deveria ter sido usado assim</h3></div><span class="dragon-mark">CORRENTES</span></div>'
       +'<div class="dragon-lair-art" aria-hidden="true"><div class="dragon-chain chain-a"></div><div class="dragon-chain chain-b"></div><div class="dragon-silhouette dragon-one"></div><div class="dragon-silhouette dragon-two"></div><div class="dragon-machinery"></div></div>'
       +'<div class="dragon-clues">'
       +'<article><strong>⛓ Dragões acorrentados</strong><p>Os dragões não estão livres. Correntes e estruturas de contenção os mantêm presos ao interior do covil.</p></article>'
       +'<article><strong>⚙ O poder das turbinas</strong><p>As estruturas do covil aproveitam a força dos dragões para manter o mecanismo funcionando.</p></article>'
       +'<article><strong>☀ A marca de Kaelen</strong><p>O símbolo associado a Kaelen aparece no local. A presença dele deixa de parecer apenas a de um guia.</p></article>'
       +'<article class="dragon-foreshadow"><strong>◇ O selo nas correntes</strong><p>Na âncora de uma corrente há o mesmo corte visto nos outros domínios. O símbolo parece pertencer a alguém que já comandou este lugar.</p></article>'
       +'</div>'
       +'<div class="dragon-double-reading"><div class="dragon-reading-head"><span>DUAS LEITURAS</span><strong>O que realmente aconteceu aqui?</strong></div>'
       +'<div class="dragon-reading-grid"><div><b>Escravidão</b><p>Os dragões podem ter sido capturados e transformados em ferramentas pelos responsáveis pela corrupção deste mundo.</p></div><div><b>Uma máquina improvisada</b><p>As correntes e mecanismos também podem ser parte de uma gambiarra dos Generais para manter o mundo funcionando depois do desaparecimento do Soberano.</p></div></div></div>'
       +'<div class="dragon-kaelen-state"><span class="state-label">KAELEN</span><strong>“Eles são monstros! Ferramentas! Mate-os e pegue o poder!”</strong><span class="state-note">Pela primeira vez, a postura do guia se rompe: ele deixa de apenas conduzir e passa a exigir a morte dos dragões.</span></div>'
       +'<div class="dragon-descent"><span class="state-label">O NÚCLEO ABAIXO</span><strong>O mecanismo continua funcionando.</strong><p>Se o sistema falhar agora, o mundo acima também pode cair. O caminho para o Abismo se abre sob as ruínas da fornalha.</p></div>'
       +'</section>';
      battleArea.insertAdjacentHTML('beforebegin',html);

      if(!n.hasEvent(CHAIN_EVENT)){
        n.setChapter(MAP_ID);
        n.completeEvent(CHAIN_EVENT,{entry:'dragon_lair'});
        n.discoverClue('map4_dragon_turbines');
        n.discoverClue('map4_kaelen_crest');
        n.discoverClue('map4_exploitation');
        n.discoverClue('map4_split_seal');
        setTimeout(()=>{
          if(window.ArenaNarrativeNPCs?.openDialogue)window.ArenaNarrativeNPCs.openDialogue('kaelen',MAP_ID);
          setTimeout(()=>{
            if(!n.hasEvent(KAELEN_BREAK_EVENT)){
              n.completeEvent(KAELEN_BREAK_EVENT,{reason:'dragon_lair'});
              const scene=document.getElementById('arenaDragonScene');
              scene?.classList.add('kaelen-broken');
            }
          },250);
        },220);
      }
    }

    const broken=n.hasEvent(KAELEN_BREAK_EVENT);
    existing?.classList.toggle('kaelen-broken',broken);
    existing?.classList.toggle('dragon-descent-open',n.hasEvent(DESCENT_EVENT));
  }

  function installBossHook(){
    if(window.__arenaDragonWinHook)return;
    const original=window.winBattle;
    if(typeof original!=='function')return;
    window.winBattle=function(){
      const isDragonBoss=typeof battle!=='undefined'&&battle?.isBoss&&Number(battle.zoneIndex)===ZONE;
      original.apply(this,arguments);
      if(!isDragonBoss)return;
      const n=narrative();
      if(!n||n.hasEvent(BOSS_EVENT))return;
      n.completeEvent(BOSS_EVENT,{source:'general_of_beasts',boss:'frost_wyrm'});
      n.addFragment(1);
      n.completeEvent(DESCENT_EVENT,{source:'dragon_lair',destination:'abyss'});
      n.discoverClue('map4_final_words',{text:'Nós acorrentamos o mundo... para que você não precisasse... O Abismo está aberto. O Trono o aguarda.'});
      if(typeof toast==='function')toast('Quarto fragmento absorvido. O chão começa a ceder para o Abismo.');
      setTimeout(renderScene,100);
    };
    window.__arenaDragonWinHook=true;
  }

  function renderBossNarrative(){
    if(typeof battle==='undefined'||!battle?.isBoss||Number(battle.zoneIndex)!==ZONE)return;
    const card=document.querySelector('.boss-battle-card');if(!card)return;
    const title=card.querySelector('.battle-head h3');
    if(title&&!title.dataset.dragonLore){
      title.dataset.dragonLore='1';
      title.insertAdjacentHTML('afterend','<div class="dragon-boss-label">GENERAL DAS FERAS · DRAGÃO ANCIÃO</div>');
    }
    if(!card.querySelector('.dragon-boss-line')){
      const line=document.createElement('div');
      line.className='dragon-boss-line';
      line.textContent='“Nós acorrentamos o mundo... para que você não precisasse... O Abismo está aberto. O Trono o aguarda.”';
      (card.querySelector('.boss-battle-warning')||card.querySelector('.battle-head'))?.after(line);
    }
  }

  function observe(){
    const map=document.getElementById('map');if(!map)return;
    new MutationObserver(()=>setTimeout(()=>{renderScene();renderBossNarrative();installBossHook()},0))
      .observe(map,{subtree:true,childList:true,attributes:true,attributeFilter:['class','data-zone']});
    setInterval(()=>{renderScene();renderBossNarrative();installBossHook()},350);
    setTimeout(()=>{renderScene();renderBossNarrative();installBossHook()},250);
  }

  function boot(){if(narrative())observe()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
  window.ArenaDragonLore={render:renderScene};
})();
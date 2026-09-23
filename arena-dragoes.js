// Arena — Fase 7: Covil dos Dragões.
// Camada narrativa isolada. Não altera combate, renderer, XP ou progressão.
(()=> {
  const ZONE=3, MAP_ID='map4';
  const CHAIN_EVENT='map4_chains_reveal';
  const KAELEN_BREAK_EVENT='map4_kaelen_break';
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
       +'</div>'
       +'<div class="dragon-double-reading"><div class="dragon-reading-head"><span>DUAS LEITURAS</span><strong>O que realmente aconteceu aqui?</strong></div>'
       +'<div class="dragon-reading-grid"><div><b>Escravidão</b><p>Os dragões podem ter sido capturados e transformados em ferramentas pelos responsáveis pela corrupção deste mundo.</p></div><div><b>Uma máquina improvisada</b><p>As correntes e mecanismos também podem ser parte de uma gambiarra dos Generais para manter o mundo funcionando depois do desaparecimento do Soberano.</p></div></div></div>'
       +'<div class="dragon-kaelen-state"><span class="state-label">KAELEN</span><strong>“Eles são monstros! Ferramentas! Mate-os e pegue o poder!”</strong><span class="state-note">Pela primeira vez, a postura do guia se rompe: ele deixa de apenas conduzir e passa a exigir a morte dos dragões.</span></div>'
       +'</section>';
      battleArea.insertAdjacentHTML('beforebegin',html);

      if(!n.hasEvent(CHAIN_EVENT)){
        n.setChapter(MAP_ID);
        n.completeEvent(CHAIN_EVENT,{entry:'dragon_lair'});
        n.discoverClue('map4_dragon_turbines');
        n.discoverClue('map4_kaelen_crest');
        n.discoverClue('map4_exploitation');
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
  }

  function observe(){
    const map=document.getElementById('map');if(!map)return;
    new MutationObserver(()=>setTimeout(renderScene,0))
      .observe(map,{subtree:true,childList:true,attributes:true,attributeFilter:['class','data-zone']});
    setInterval(renderScene,350);
    setTimeout(renderScene,250);
  }

  function boot(){if(narrative())observe()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
  window.ArenaDragonLore={render:renderScene};
})();
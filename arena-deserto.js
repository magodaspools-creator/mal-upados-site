// Arena — Fase 6: Deserto Perdido.
// Camada narrativa isolada. Não substitui renderer, combate, XP, ranking ou progressão.
(()=> {
  const ZONE=2, MAP_ID='map3', FLASH_FLAG='map3_flashback', BOSS_EVENT='map3_boss_defeat';
  const narrative=()=>window.ArenaNarrative||null;
  const selectedZone=()=>{const el=document.querySelector('.zone.selected');return el?Number(el.dataset.zone):null};

  function renderScene(){
    const zone=selectedZone(), existing=document.getElementById('arenaDesertScene');
    if(zone!==ZONE){existing?.remove();return}
    const battleArea=document.getElementById('battleArea'); if(!battleArea)return;
    if(!existing){
      const html='<section id="arenaDesertScene" class="arena-desert-scene" aria-label="Narrativa do Deserto Perdido">'
       +'<div class="desert-header"><div><div class="eyebrow">Capítulo III · Deserto Perdido</div><h3>A cidade que caiu para dentro de si mesma</h3></div><span class="desert-mark">AREIA DE VIDRO</span></div>'
       +'<div class="desert-city"><div class="desert-sky"><i></i><i></i><i></i></div><div class="desert-palace"><span></span><span></span><span></span></div><div class="desert-tower"></div><div class="desert-glass"></div></div>'
       +'<div class="desert-clues"><article><strong>☼ Cidade invertida</strong><p>Torres e palácios parecem enterrados de cabeça para baixo, como se a própria cidade tivesse sido puxada para dentro da areia.</p></article><article><strong>◇ Vidro e areia</strong><p>O solo brilha como vidro moído. Não há marcas de um exército chegando de fora.</p></article><article><strong>⇲ Destruição interna</strong><p>O epicentro está no palácio central: corredores queimados de dentro para fora.</p></article></div>'
       +'<div class="desert-kaelen-note"><strong>Kaelen:</strong> “O Abismo está abaixo de nós. Os demônios destruíram esta cidade. Não deixe que o medo desvie você do caminho.”</div>'
       +'<div class="desert-drain"><div class="drain-ring"></div><div><strong>Os ralos gigantes</strong><span>A areia escorre lentamente para baixo. Há calor vindo do fundo — e um caminho para o núcleo vulcânico.</span></div></div>'
       +'</section>';
      battleArea.insertAdjacentHTML('beforebegin',html);
      const n=narrative();
      if(n&&!n.hasEvent('map3_elias_encounter')){
        setTimeout(()=>{
          n.setChapter(MAP_ID);
          n.completeEvent('map3_elias_encounter',{entry:'lost_desert'});
          n.discoverClue('map3_destruction_inside_out');
          n.discoverClue('map3_no_invasion_marks');
          if(window.ArenaNarrativeNPCs?.openDialogue)window.ArenaNarrativeNPCs.openDialogue('elias',MAP_ID);
        },220);
      }
    }
    renderFlashback();
  }

  function renderFlashback(){
    const n=narrative(), scene=document.getElementById('arenaDesertScene'); if(!n||!scene)return;
    let el=scene.querySelector('.desert-flashback');
    if(!n.hasFlag(FLASH_FLAG)){el?.remove();return}
    if(!el){
      el=document.createElement('div');el.className='desert-flashback';
      el.innerHTML='<div class="desert-flashback-label">FLASHBACK · A GRANDE VERGONHA</div><strong>Não foram demônios.</strong><p>O General da Magia incendiou a própria cidade para esconder a verdade. A areia levou os registros para longe.</p><span>O terceiro fragmento foi absorvido. O caminho para o núcleo vulcânico está aberto.</span>';
      scene.appendChild(el);
    }
  }

  function renderBossNarrative(){
    if(typeof battle==='undefined'||!battle?.isBoss||Number(battle.zoneIndex)!==ZONE)return;
    const card=document.querySelector('.boss-battle-card'); if(!card)return;
    const title=card.querySelector('.battle-head h3');
    if(title&&!title.dataset.desertLore){title.dataset.desertLore='1';title.insertAdjacentHTML('afterend','<div class="desert-boss-label">GENERAL DA MAGIA · MÚMIA DE CRISTAL</div>')}
  }

  function installWinHook(){
    if(window.__arenaDesertWinHook)return;
    const original=window.winBattle;if(typeof original!=='function')return;
    window.winBattle=function(){
      const boss=typeof battle!=='undefined'&&battle?.isBoss&&Number(battle.zoneIndex)===ZONE;
      original.apply(this,arguments);
      if(!boss)return;
      const n=narrative();if(!n||n.hasEvent(BOSS_EVENT))return;
      n.completeEvent(BOSS_EVENT,{source:'general_magic'});
      n.addFragment(1);
      n.setFlag(FLASH_FLAG,true);
      n.completeEvent('map3_flashback',{source:'arena_desert'});
      n.discoverClue('map3_key_in_mind');
      if(typeof toast==='function')toast('Terceiro fragmento absorvido. Uma memória proibida desperta.');
      setTimeout(renderScene,100);
    };
    window.__arenaDesertWinHook=true;
  }

  function observe(){
    const map=document.getElementById('map');if(!map)return;
    new MutationObserver(()=>setTimeout(()=>{renderScene();renderBossNarrative();installWinHook()},0))
      .observe(map,{subtree:true,childList:true,attributes:true,attributeFilter:['class','data-zone']});
    setInterval(()=>{renderScene();renderBossNarrative();installWinHook()},350);
    setTimeout(()=>{renderScene();renderBossNarrative();installWinHook()},250);
  }
  function boot(){if(narrative())observe()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
  window.ArenaDesertLore={render:renderScene};
})();

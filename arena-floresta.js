// Arena — Fase 4: Floresta Sombria.
// Camada narrativa isolada. Não substitui renderer, combate ou progressão.
(()=>{
  const ZONE=0, MAP_ID='map1', FRAGMENT_EVENT='map1_fragment', ROOT_FLAG='map1_roots_open';
  function narrative(){return window.ArenaNarrative||null}
  function renderScene(){
    const map=document.querySelector('.zone.selected');
    const zone=map?Number(map.dataset.zone):null;
    const existing=document.getElementById('arenaForestScene');
    if(zone!==ZONE){existing?.remove();return}
    const battleArea=document.getElementById('battleArea'); if(!battleArea)return;
    if(!existing){
      const n=narrative(), rootsOpen=!!n?.hasFlag(ROOT_FLAG);
      const html='<section id="arenaForestScene" class="arena-forest-scene" aria-label="Atmosfera narrativa da Floresta Sombria">'
       +'<div class="arena-forest-head"><div><div class="eyebrow">Capítulo I · Floresta Sombria</div><h3>Onde a floresta ainda se lembra</h3></div><span class="arena-forest-mark">O CISMA</span></div>'
       +'<div class="arena-forest-grid">'
       +'<article class="forest-clue forest-suffering"><span class="forest-clue-icon">✦</span><div><strong>Silêncio ferido</strong><p>A mata parece sofrer. Não há canto de pássaros. A água se move, mas nada nela parece vivo.</p></div></article>'
       +'<article class="forest-clue forest-statues"><span class="forest-clue-icon">◈</span><div><strong>Estátuas voltadas para fora</strong><p>O General da Vida está de costas para o centro da floresta, como se vigiassem algo que vem de dentro.</p></div></article>'
       +'<article class="forest-clue forest-lakes"><span class="forest-clue-icon">≈</span><div><strong>Lagos sem reflexo</strong><p>A superfície dos lagos deveria devolver o céu. Em vez disso, as sombras chegam atrasadas.</p></div></article>'
       +'<article class="forest-clue forest-shadow"><span class="forest-clue-icon">☀</span><div><strong>A sombra que falta</strong><p>Kaelen está diante de você. A luz alcança seu corpo. O chão, porém, não recebe sua sombra.</p><span class="forest-shadow-note">Ausência registrada</span></div></article>'
       +'<article class="forest-clue forest-foreshadow"><span class="forest-clue-icon">◇</span><div><strong>Uma marca partida</strong><p>Entre as raízes há um selo quase apagado. Seu desenho parece uma coroa atravessada por uma única rachadura.</p><span class="forest-shadow-note">Você não reconhece o símbolo.</span></div></article>'
       +'</div><div class="forest-roots '+(rootsOpen?'open':'')+'"><div class="forest-roots-art" aria-hidden="true"><i></i><i></i><i></i><i></i></div><div><strong>'+(rootsOpen?'As raízes se abriram.':'As raízes aguardam.')+'</strong><span>'+(rootsOpen?'O caminho para baixo está preparado.':'Há algo selado sob a floresta.')+'</span></div></div></section>';
      battleArea.insertAdjacentHTML('beforebegin',html);
      if(n&&!n.hasEvent('map1_intro')){
        setTimeout(()=>{
          if(window.ArenaNarrativeNPCs?.openDialogue)window.ArenaNarrativeNPCs.openDialogue('kaelen',MAP_ID);
          n.completeEvent('map1_intro',{entry:'forest'});
          n.discoverClue('map1_statues_outward');
          n.discoverClue('map1_water_shadow');
          n.discoverClue('map1_kaelen_shadow_absent');
          n.discoverClue('map1_split_crown_mark');
        },180);
      }
    }
    if(narrative()?.hasFlag(ROOT_FLAG))document.querySelector('#arenaForestScene .forest-roots')?.classList.add('open');
  }
  function applyDefensiveBoss(){
    if(typeof battle==='undefined'||!battle?.isBoss||Number(battle.zoneIndex)!==ZONE||battle.__forestDefenseApplied)return;
    battle.__forestDefenseApplied=true;
    battle.forestDefensive=true;
    battle.maxHp=Math.ceil(Number(battle.maxHp||1)*1.20);
    battle.hp=battle.maxHp;
    battle.damage=Math.max(1,Math.floor(Number(battle.damage||1)*0.75));
    setTimeout(()=>{
      const card=document.querySelector('.boss-battle-card'); if(!card)return;
      const warning=document.createElement('div');
      warning.className='forest-defensive-note';
      warning.textContent='O Guardião recua e protege a floresta. Sua defesa aumenta; seus ataques são menos agressivos.';
      card.querySelector('.boss-battle-warning')?.after(warning);
    },0);
  }
  function renderBossLine(){
    if(typeof battle==='undefined'||!battle?.isBoss||Number(battle.zoneIndex)!==ZONE)return;
    const n=narrative();
    if(!n||n.hasFlag('map1_boss_my_king'))return;
    const max=Number(battle.maxHp)||0, hp=Number(battle.hp)||0;
    if(!max||hp/max>0.30)return;
    n.setFlag('map1_boss_my_king',true);
    const card=document.querySelector('.boss-battle-card');
    if(!card)return;
    const line=document.createElement('div');
    line.className='forest-boss-line';
    line.textContent='“Meu Rei... você voltou para nos punir?”';
    const warning=card.querySelector('.boss-battle-warning');
    (warning||card.querySelector('.battle-head'))?.after(line);
  }
  function installBossRewardHook(){
    if(window.__arenaForestWinHook)return;
    const original=window.winBattle; if(typeof original!=='function')return;
    window.winBattle=function(){
      const forestBoss=typeof battle!=='undefined'&&battle?.isBoss&&Number(battle.zoneIndex)===ZONE;
      original.apply(this,arguments);
      if(forestBoss){
        const n=narrative();
        if(n&&!n.hasEvent(FRAGMENT_EVENT)){
          n.addFragment(1);
          n.completeEvent(FRAGMENT_EVENT,{source:'forest_guardian'});
          n.setFlag(ROOT_FLAG,true);
          n.discoverClue('map1_first_fragment');
          if(typeof toast==='function')toast('Fragmento dourado encontrado. As raízes começam a se abrir.');
          setTimeout(renderScene,50);
        }
      }
    };
    window.__arenaForestWinHook=true;
  }
  function observe(){
    const map=document.getElementById('map'); if(!map)return;
    new MutationObserver(()=>setTimeout(()=>{renderScene();applyDefensiveBoss();renderBossLine();installBossRewardHook()},0))
      .observe(map,{subtree:true,childList:true,attributes:true,attributeFilter:['class','data-zone']});
    setInterval(()=>{renderScene();applyDefensiveBoss();installBossRewardHook()},350);
    setTimeout(()=>{renderScene();renderBossLine();installBossRewardHook()},250);
  }
  function boot(){if(!narrative())return;narrative().setChapter(MAP_ID);observe()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
  window.ArenaForestLore={render:renderScene,applyDefensiveBoss};
})();
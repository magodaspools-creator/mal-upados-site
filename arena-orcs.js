// Arena — Fase 5: Acampamento Orc.
// Camada narrativa isolada. Não substitui renderer, combate, XP, ranking ou progressão.
(()=> {
  const ZONE=1, MAP_ID='map2', GATE_FLAG='map2_gate_open', INTRO_EVENT='map2_intro', BOSS_EVENT='map2_boss_defeat';

  const narrative=()=>window.ArenaNarrative||null;
  const selectedZone=()=>{const el=document.querySelector('.zone.selected');return el?Number(el.dataset.zone):null};

  function renderScene(){
    const zone=selectedZone();
    const existing=document.getElementById('arenaOrcScene');
    if(zone!==ZONE){existing?.remove();return}
    const battleArea=document.getElementById('battleArea'); if(!battleArea)return;
    const n=narrative(), open=!!n?.hasFlag(GATE_FLAG);
    if(!existing){
      const html='<section id="arenaOrcScene" class="arena-orc-scene" aria-label="Arquitetura narrativa do Acampamento Orc">'
       +'<div class="arena-orc-head"><div><div class="eyebrow">Capítulo II · Acampamento Orc</div><h3>Uma linha de defesa, não uma horda</h3></div><span class="arena-orc-mark">O SOL PARTIDO</span></div>'
       +'<div class="orc-defense-grid">'
       +'<article class="orc-defense-card"><span class="orc-defense-icon">🛡</span><strong>Formações de escudo</strong><p>Os Orcs não avançam em massa. Escudos fecham corredores e recuam em ordem quando a pressão aumenta.</p></article>'
       +'<article class="orc-defense-card"><span class="orc-defense-icon">⚔</span><strong>Retirada tática</strong><p>Cada grupo parece ganhar tempo para os que estão atrás. A defesa é organizada em camadas.</p></article>'
       +'<article class="orc-defense-card"><span class="orc-defense-icon">☀</span><strong>Estandartes do Sol Partido</strong><p>O mesmo símbolo dourado aparece entre os defensores: um sol dividido ao meio, antigo demais para ser uma simples bandeira de guerra.</p></article>'
       +'<article class="orc-defense-card orc-foreshadow"><span class="orc-defense-icon">◇</span><strong>O mesmo corte</strong><p>Em uma pedra junto ao portão, há uma marca antiga: uma forma de coroa dividida pela mesma rachadura vista na floresta.</p></article>'
       +'</div>'
       +'<div class="orc-banner"><strong>O portão colossal</strong> — ferro, rebites e marcas de vigília fecham uma passagem muito maior do que seria necessária para proteger um acampamento comum.</div>'
       +'<div class="orc-gate '+(open?'open':'closed')+'"><div class="orc-gate-art" aria-hidden="true"></div><div><strong>'+(open?'O portão se abriu.':'O portão permanece fechado.')+'</strong><span>'+(open?'Do outro lado existe um deserto subterrâneo de areia brilhante.':'Os defensores estão guardando o que existe além dele.')+'</span></div></div>'
       +'</section>';
      battleArea.insertAdjacentHTML('beforebegin',html);
      if(n&&!n.hasEvent(INTRO_EVENT)){
        setTimeout(()=>{
          n.setChapter(MAP_ID);
          n.completeEvent(INTRO_EVENT,{entry:'orc_camp'});
          n.discoverClue('map2_broken_sun');
          n.discoverClue('map2_orc_defense');
          n.discoverClue('map2_split_crown_mark');
          if(window.ArenaNarrativeNPCs?.openDialogue)window.ArenaNarrativeNPCs.openDialogue('vara',MAP_ID);
        },220);
      }
    } else {
      const gate=existing.querySelector('.orc-gate');
      if(gate){
        gate.classList.toggle('open',open);gate.classList.toggle('closed',!open);
        const strong=gate.querySelector('strong'),span=gate.querySelector('span');
        if(strong)strong.textContent=open?'O portão se abriu.':'O portão permanece fechado.';
        if(span)span.textContent=open?'Do outro lado existe um deserto subterrâneo de areia brilhante.':'Os defensores estão guardando o que existe além dele.';
      }
    }
    renderVaraReaction();
  }

  function renderVaraReaction(){
    const n=narrative(), scene=document.getElementById('arenaOrcScene');
    if(!n||!scene)return;
    const seen=n.hasDialogue('vara.map2.two_shadows');
    let el=scene.querySelector('.orc-kaelen-reaction');
    if(!seen){el?.remove();return}
    if(!el){
      el=document.createElement('div');el.className='orc-kaelen-reaction';
      el.innerHTML='<strong>Kaelen reage:</strong> “Não dê ouvidos àquela bruxa. Vara está corrompida. Continue. O caminho precisa ser aberto.”';
      scene.appendChild(el);
    }
  }

  function renderBossLine(){
    if(typeof battle==='undefined'||!battle?.isBoss||Number(battle.zoneIndex)!==ZONE)return;
    const n=narrative(); if(!n)return;
    const max=Number(battle.maxHp)||0,hp=Number(battle.hp)||0;
    if(!max||hp/max>0.30)return;
    const card=document.querySelector('.boss-battle-card'); if(!card)return;
    if(!n.hasFlag('map2_boss_majestade'))n.setFlag('map2_boss_majestade',true);
    if(card.querySelector('.orc-boss-line'))return;
    const line=document.createElement('div');line.className='orc-boss-line';
    line.innerHTML='<div class="orc-boss-label">O CHEFE SE AJOELHA DIANTE DO PORTÃO</div>“Perdoe-nos, Majestade.”';
    (card.querySelector('.boss-battle-warning')||card.querySelector('.battle-head'))?.after(line);
  }

  function installWinHook(){
    if(window.__arenaOrcWinHook)return;
    const original=window.winBattle;if(typeof original!=='function')return;
    window.winBattle=function(){
      const boss=typeof battle!=='undefined'&&battle?.isBoss&&Number(battle.zoneIndex)===ZONE;
      original.apply(this,arguments);
      if(!boss)return;
      const n=narrative();if(!n||n.hasEvent(BOSS_EVENT))return;
      n.completeEvent(BOSS_EVENT,{source:'orc_war_chief'});
      n.addFragment(1);
      n.setFlag(GATE_FLAG,true);
      n.discoverClue('map2_two_shadows');
      if(typeof toast==='function')toast('A linha de defesa caiu. O portão colossal começa a se abrir.');
      setTimeout(renderScene,80);
    };
    window.__arenaOrcWinHook=true;
  }

  function installBossNarrativeLabel(){
    if(typeof battle==='undefined'||!battle?.isBoss||Number(battle.zoneIndex)!==ZONE)return;
    const card=document.querySelector('.boss-battle-card');if(!card)return;
    const title=card.querySelector('.battle-head h3');
    if(title&&!title.dataset.orcLoreLabel){
      title.dataset.orcLoreLabel='1';
      title.insertAdjacentHTML('afterend','<div class="orc-boss-label">CHEFE DE GUERRA ORC · A ÚLTIMA LINHA</div>');
    }
  }

  function observe(){
    const map=document.getElementById('map');if(!map)return;
    new MutationObserver(()=>setTimeout(()=>{renderScene();renderBossLine();installWinHook();installBossNarrativeLabel()},0))
      .observe(map,{subtree:true,childList:true,attributes:true,attributeFilter:['class','data-zone']});
    setInterval(()=>{renderScene();renderBossLine();installWinHook();installBossNarrativeLabel()},350);
    setTimeout(()=>{renderScene();renderBossLine();installWinHook();installBossNarrativeLabel()},250);
  }

  function boot(){if(!narrative())return;observe()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
  window.ArenaOrcLore={render:renderScene};
})();

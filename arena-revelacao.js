// Arena — Fase 9: Grande Revelação.
// Camada narrativa isolada. Não substitui combate, renderer, XP, ranking ou progressão.
(()=> {
  const ZONE=4;
  const THRONE_EVENT='map5_throne_room';
  const BOSS_EVENT='map5_boss_defeat';
  const CORPSE_EVENT='map5_corpse_reveal';
  const REVEAL_EVENT='finale_kaelen_reveal';
  const narrative=()=>window.ArenaNarrative||null;
  const selectedZone=()=>{const el=document.querySelector('.zone.selected');return el?Number(el.dataset.zone):null};

  function playerName(){
    return document.getElementById('playerName')?.textContent?.trim() || 'o jogador';
  }

  function renderPrompt(){
    if(selectedZone()!==ZONE)return;
    const n=narrative();
    const scene=document.getElementById('arenaAbyssScene');
    if(!n||!scene||n.hasEvent(REVEAL_EVENT))return;
    if(document.getElementById('arenaRevelationPrompt'))return;
    if(!n.hasEvent(THRONE_EVENT))return;

    const warning=scene.querySelector('.abyss-warning');
    if(warning){
      if(!n.hasEvent(BOSS_EVENT)){
        warning.innerHTML='<span>A ÚLTIMA VIGÍLIA</span><strong>A Guarda Real ainda protege o trono.</strong><p>O corpo está diante de você, mas o caminho até a verdade passa primeiro pelo guardião deste lugar.</p>';
        document.getElementById('arenaRevelationPrompt')?.remove();
        return;
      }
      warning.innerHTML='<span>O ÚLTIMO SEGREDO</span><strong>O corpo não está vazio.</strong><p>Uma presença parece esperar pelo toque de alguém que já esteve aqui antes.</p><button type="button" class="btn active revelation-trigger" id="revelationTrigger">TOCAR O CADÁVER</button>';
    }

    const corpse=scene.querySelector('.sovereign-corpse');
    if(corpse){
      corpse.id='sovereignCorpseInteract';
      corpse.setAttribute('role','button');
      corpse.setAttribute('tabindex','0');
      corpse.setAttribute('aria-label','Tocar o corpo do Soberano');
      corpse.classList.add('corpse-interactable');
      corpse.onclick=triggerReveal;
      corpse.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();triggerReveal()}};
    }
    document.getElementById('revelationTrigger')?.addEventListener('click',triggerReveal);
    const prompt=document.createElement('div');
    prompt.id='arenaRevelationPrompt';
    prompt.className='revelation-prompt';
    prompt.innerHTML='<span>O TRONO ESPERA</span><strong>Há algo familiar no rosto que ainda não pode ser visto.</strong>';
    scene.querySelector('.abyss-throne')?.appendChild(prompt);
  }

  function triggerReveal(){
    const n=narrative();
    if(!n||n.hasEvent(REVEAL_EVENT))return;
    if(!n.hasEvent(THRONE_EVENT)||!n.hasEvent(BOSS_EVENT))return;
    n.completeEvent(CORPSE_EVENT,{source:'sovereign_corpse',zone:'map5'});
    n.discoverClue('finale_same_face',{source:'corpse',identity:'player'});
    n.discoverClue('finale_two_halves',{source:'revelation'});
    n.completeEvent(REVEAL_EVENT,{
      source:'sovereign_corpse',
      character:playerName(),
      truth:'the_sovereign_soul_was_split_into_two_halves',
      kaelen:'dark_half'
    });
    n.setFlag('kaelen_revealed',true);
    renderReveal();
    window.dispatchEvent(new CustomEvent('arena:kaelen-revealed',{detail:{character:playerName()}}));
  }

  function renderReveal(){
    const scene=document.getElementById('arenaAbyssScene');
    if(!scene||document.getElementById('arenaRevelation'))return;
    const name=playerName();
    scene.classList.add('abyss-revelation-active');
    scene.innerHTML=
      '<section id="arenaRevelation" class="arena-revelation" aria-label="Grande revelação">'
      +'<div class="revelation-kicker">CAPÍTULO VI · O CISMA DO SOBERANO</div>'
      +'<div class="revelation-title"><span>O ROSTO DO REI</span><strong>não era desconhecido.</strong></div>'
      +'<div class="revelation-stage">'
      +'<article class="reveal-portrait corpse-portrait"><div class="portrait-label">O CORPO NO TRONO</div><div class="reveal-face face-player"><i class="face-hair"></i><i class="face-brow left"></i><i class="face-brow right"></i><i class="face-eye left"></i><i class="face-eye right"></i><i class="face-mouth"></i></div><strong>'+escapeHtml(name)+'</strong><span>Seu próprio rosto, preservado pela morte.</span></article>'
      +'<div class="reveal-divider"><span>≡</span><small>A MESMA ALMA</small></div>'
      +'<article class="reveal-portrait kaelen-portrait"><div class="portrait-label">KAELEN</div><div class="kaelen-helmet"><span>CAPACETE</span></div><div class="reveal-face face-kaelen face-aged"><i class="face-hair"></i><i class="face-brow left"></i><i class="face-brow right"></i><i class="face-eye left"></i><i class="face-eye right"></i><i class="face-mouth"></i></div><strong>Kaelen</strong><span>O mesmo rosto. Mais velho. Cansado. Cínico.</span></article>'
      +'</div>'
      +'<div class="revelation-copy">'
      +'<p class="revelation-impact">Kaelen se materializa fisicamente diante do trono. Ele remove o capacete.</p>'
      +'<p>Não existe um guia histórico separado do jogador. Durante o Cisma, a alma do Soberano foi partida em duas: <strong>a Inocência</strong>, que preservou o poder e a pureza sem as memórias, e <strong>a Ambição e a Culpa</strong>, que tomou a forma de Kaelen.</p>'
      +'<blockquote>“Você foi uma excelente espada, minha criança. Mas a mente deve governar o corpo. Volte para mim.”</blockquote>'
      +'<div class="revelation-handoff"><span>VERDADE EXPOSTA</span><strong>Kaelen quer recuperar a outra metade.</strong><p>O salão de cristal está pronto. O próximo confronto será contra um espelho do próprio jogador.</p></div>'
      +'</div></section>';
    const revelation=document.getElementById('arenaRevelation');
    if(revelation){
      revelation.classList.add('reveal-enter');
      requestAnimationFrame(()=>requestAnimationFrame(()=>{
        revelation.classList.remove('reveal-enter');
        revelation.classList.add('reveal-active');
      }));
    }
  }

  function escapeHtml(value){
    return String(value??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
  }

  function observe(){
    const map=document.getElementById('map');
    if(map)new MutationObserver(()=>setTimeout(()=>{renderPrompt();if(narrative()?.hasEvent(REVEAL_EVENT))renderReveal()},0))
      .observe(map,{subtree:true,childList:true,attributes:true,attributeFilter:['class','data-zone']});
    setInterval(()=>{renderPrompt();if(narrative()?.hasEvent(REVEAL_EVENT))renderReveal()},350);
    setTimeout(()=>{renderPrompt();if(narrative()?.hasEvent(REVEAL_EVENT))renderReveal()},500);
  }

  window.ArenaRevelation={trigger:triggerReveal,render:renderPrompt};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',observe);else observe();
})();
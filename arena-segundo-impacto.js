// Arena — Fase 11: Segundo Impacto.
// Cena final narrativa. Não altera combate, renderer, XP, ranking ou progressão.
(()=> {
  const ABSORPTION_EVENT='finale_absorption';
  const SECOND_IMPACT_EVENT='finale_second_impact';
  const narrative=()=>window.ArenaNarrative||null;

  function render(){
    const n=narrative();
    const battleArea=document.getElementById('battleArea');
    if(!n||!battleArea||!n.hasEvent(ABSORPTION_EVENT)||n.hasEvent(SECOND_IMPACT_EVENT))return;
    if(document.getElementById('arenaSecondImpact'))return;
    battleArea.innerHTML='<section id="arenaSecondImpact" class="arena-second-impact" aria-label="Segundo Impacto">'
      +'<div class="impact-blackout" aria-hidden="true"></div>'
      +'<div class="impact-stage">'
      +'<div class="impact-kicker">FASE XI · SEGUNDO IMPACTO</div>'
      +'<h3>O Trono Vazio</h3>'
      +'<p class="impact-intro">A música para. A luz dourada recua pelos corredores. Pela primeira vez, o silêncio não vem do Abismo.</p>'
      +'<button type="button" class="btn active big" id="secondImpactEnter">SENTAR NO TRONO</button>'
      +'</div></section>';
    document.getElementById('secondImpactEnter').onclick=enterThrone;
  }

  function enterThrone(){
    const n=narrative();
    if(!n||!n.hasEvent(ABSORPTION_EVENT))return;
    const root=document.getElementById('arenaSecondImpact');
    if(!root)return;
    root.innerHTML='<div class="impact-first-person">'
      +'<div class="impact-vignette"></div>'
      +'<div class="impact-crossfade"></div>'
      +'<div class="impact-frescoes" aria-label="Afrescos da criação do mundo">'
      +'<div class="fresco-title">MEMÓRIAS DO SOBERANO</div>'
      +'<div class="fresco-scene"><div class="fresco-world"></div><div class="fresco-titan titan-left"></div><div class="fresco-titan titan-right"></div><div class="fresco-tube tube-left"></div><div class="fresco-tube tube-right"></div><div class="fresco-flow flow-left"></div><div class="fresco-flow flow-right"></div><div class="fresco-arena"></div></div>'
      +'<div class="fresco-caption">O MUNDO DA ARENA NÃO FOI CRIADO DO NADA.</div>'
      +'</div>'
      +'<div class="impact-memory"><span>VOCÊ SE LEMBRA.</span><strong>O mundo é um parasita.</strong><p>As imagens não mostram um soberano construindo a Arena. Mostram tubos colossais presos às costas de Titãs de outras dimensões, drenando sua energia para manter este pequeno mundo vivo.</p><p>Kaelen não queria apenas poder. Ele conhecia a verdade e sabia que a Inocência não suportaria carregá-la.</p></div>'
      +'<div class="impact-controls"><div class="throne-arm left"><span class="control-label">CONTROLE A</span><i></i></div><div class="throne-arm right"><span class="control-label">CONTROLE B</span><i></i></div><div class="chain-glow"></div></div>'
      +'<div class="impact-choice"><span>O ÚLTIMO COMANDO</span><strong>Você precisa escolher o que será sacrificado.</strong><div class="choice-options"><div class="choice-option"><b>DESTRUIR ESTE MUNDO</b><small>Interromper a Arena e condenar tudo que vive nela.</small></div><div class="choice-option"><b>DESTRUIR OS OUTROS</b><small>Retomar a drenagem das dimensões inocentes.</small></div></div><p class="choice-note">As opções não respondem ao toque. O trono não aceita uma escolha fácil.</p></div>'
      +'<div class="impact-end">As correntes começam a esticar. Engrenagens antigas voltam a girar. A luz dourada escorre pelo rosto do Soberano.</div>'
      +'</div>';
    n.discoverClue('finale_world_parasite',{source:'second_impact',dimensions:'other_titans'});
    root.querySelector('.impact-first-person')?.classList.add('impact-awakened');
    if(root.dataset.completionScheduled!=='1'){
      root.dataset.completionScheduled='1';
      window.setTimeout(()=>{
        const current=window.ArenaNarrative;
        if(!current||current.hasEvent(SECOND_IMPACT_EVENT))return;
        current.completeEvent(SECOND_IMPACT_EVENT,{source:'throne',ending:'ambiguous_tragic',choices:['destroy_this_world','destroy_others'],interactive:false});
        current.setFlag('second_impact_complete',true);
        window.dispatchEvent(new CustomEvent('arena:second-impact',{detail:{event:SECOND_IMPACT_EVENT}}));
      },1800);
    }
  }

  function observe(){
    window.addEventListener('arena:mirror-absorbed',render);
    setInterval(render,500);
    setTimeout(render,400);
  }

  window.ArenaSecondImpact={render,enterThrone};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',observe);else observe();
})();
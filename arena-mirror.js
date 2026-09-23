// Arena — Fase 10: Mirror Match.
// Camada narrativa/integração. O combate reutiliza o battle/attack/renderBattle existentes em arena.js.
(()=> {
  const REQUIRED_REVEAL='finale_kaelen_reveal';
  const MIRROR_EVENT='finale_mirror_match';
  const ABSORPTION_EVENT='finale_absorption';
  const narrative=()=>window.ArenaNarrative||null;

  function canStart(){
    const n=narrative();
    return !!n?.hasEvent(REQUIRED_REVEAL) && !n.hasEvent(MIRROR_EVENT);
  }

  function renderArena(){
    const battleArea=document.getElementById('battleArea');
    if(!battleArea||document.getElementById('arenaMirrorIntro'))return;
    const n=narrative();
    if(!n||!n.hasEvent(REQUIRED_REVEAL)||n.hasEvent(MIRROR_EVENT))return;
    battleArea.insertAdjacentHTML('beforebegin',
      '<section id="arenaMirrorIntro" class="arena-mirror-intro" aria-label="Mirror Match">'
      +'<div class="mirror-kicker">FASE X · O ESPELHO</div>'
      +'<h3>Kaelen não precisa de um novo poder.</h3>'
      +'<p>Ele conhece exatamente o que você aprendeu. Arma, força e ritmo de combate serão refletidos pela própria Arena.</p>'
      +'<div class="mirror-warning"><span>ENERGIA SOMBRIA</span><strong>Ele se move como você.</strong></div>'
      +'<button type="button" class="btn active big" id="mirrorStartBtn">ENFRENTAR KAELEN</button>'
      +'</section>');
    document.getElementById('mirrorStartBtn').onclick=()=>{
      window.ArenaMirrorMatch?.start();
      document.getElementById('arenaMirrorIntro')?.remove();
    };
  }

  function renderDefeat(){
    const battleArea=document.getElementById('battleArea');
    if(!battleArea||document.getElementById('arenaMirrorDefeat'))return;
    const n=narrative();
    if(!n?.hasEvent(MIRROR_EVENT)||n.hasEvent(ABSORPTION_EVENT))return;
    battleArea.innerHTML='<section id="arenaMirrorDefeat" class="arena-mirror-defeat">'
      +'<div class="mirror-light"></div><div class="mirror-body">'
      +'<div class="mirror-kicker">KAELEN · DERROTADO</div>'
      +'<h3>Ele cai de joelhos.</h3>'
      +'<p>Não há explosão. Apenas luz dourada escorrendo pela armadura escura, como se algo antigo finalmente tivesse encontrado o caminho de volta.</p>'
      +'<blockquote>“Você prefere ser um homem bom na poeira... a ser um Deus vivo?”</blockquote>'
      +'<button type="button" class="btn active big" id="mirrorAbsorbBtn">ABSORVER A METADE SOMBRIA</button>'
      +'</div></section>';
    document.getElementById('mirrorAbsorbBtn').onclick=()=>{
      n.completeEvent(ABSORPTION_EVENT,{source:'kaelen',method:'absorption'});
      n.setFlag('soul_complete',true);
      battleArea.innerHTML='<section class="arena-mirror-absorbed"><div class="mirror-light"></div><div class="mirror-body"><div class="mirror-kicker">A ALMA ESTÁ COMPLETA</div><h3>Kaelen desaparece dentro de você.</h3><p>A música para. A energia sombria não explode: ela é absorvida. O próximo capítulo é o Trono.</p></div></section>';
      window.dispatchEvent(new CustomEvent('arena:mirror-absorbed',{detail:{event:ABSORPTION_EVENT}}));
    };
  }

  function observe(){
    const map=document.getElementById('map');
    if(map)new MutationObserver(()=>setTimeout(renderArena,0)).observe(map,{subtree:true,childList:true,attributes:true,attributeFilter:['class','data-zone']});
    window.addEventListener('arena:mirror-defeated',renderDefeat);
    setInterval(()=>{renderArena();renderDefeat()},400);
    setTimeout(()=>{renderArena();renderDefeat()},300);
  }

  window.ArenaMirrorMatch={
    canStart,
    start(){
      if(!canStart()){console.warn('[Arena Mirror] revelação de Kaelen ainda não foi concluída.');return false;}
      if(typeof window.ArenaCombat?.startMirror==='function')return window.ArenaCombat.startMirror();
      console.warn('[Arena Mirror] adaptador de combate ainda não carregado.');
      return false;
    }
  };

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',observe);else observe();
})();

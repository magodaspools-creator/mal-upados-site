// Arena — Fase 12: Rejogabilidade narrativa.
// Camada isolada. Só aparece depois do Segundo Impacto e não altera a leitura inicial.
(()=>{
  const FINAL_EVENT='finale_second_impact';
  const SCENES={
    map1:{
      scene:'arenaForestScene',
      title:'Agora você reconhece o medo',
      text:'As estátuas não estavam fugindo da floresta. Estavam voltadas para fora para conter o que vinha do centro — e para impedir que o próprio Soberano avançasse.',
      detail:'A sombra que faltava nunca foi um detalhe de um fantasma. Kaelen não projetava uma presença independente porque sua existência estava presa à sua própria alma.'
    },
    map2:{
      scene:'arenaOrcScene',
      title:'A linha de defesa fazia sentido',
      text:'Os recuos dos Orcs não eram uma estratégia de invasão. Eram uma tentativa de atrasar você. Vara viu as duas metades antes de você lembrar que elas existiam.',
      detail:'O Sol Partido deixou de ser um estandarte de guerra: era o símbolo da alma dividida do Soberano.'
    },
    map3:{
      scene:'arenaDesertScene',
      title:'Elias estava tentando impedir a pergunta errada',
      text:'A cidade destruída de dentro para fora não escondia um ataque do Abismo. Escondia a memória de um crime que o próprio reino não podia suportar.',
      detail:'“A chave na sua própria mente” nunca foi uma metáfora vazia. As memórias que faltavam eram a chave para o Trono.'
    },
    map4:{
      scene:'arenaDragonScene',
      title:'As correntes eram uma confissão',
      text:'Os dragões não estavam alimentando uma arma inimiga. Os Generais improvisaram uma forma brutal de manter o mundo funcionando depois que o Soberano desapareceu do Trono.',
      detail:'O brasão de Kaelen nas correntes não significava que ele era apenas um carcereiro. Era o símbolo do mesmo Soberano que um dia ordenou que aquela energia fosse usada.'
    },
    map5:{
      scene:'arenaAbyssScene',
      title:'A guarda nunca foi o inimigo',
      text:'O silêncio da catedral era luto. Os chamados demônios eram a última guarda do Soberano, esperando que ele próprio decidisse o destino do mundo.',
      detail:'O corpo no Trono não era a chegada de um novo inimigo. Era a ausência do rei que você ainda não lembrava ser.'
    }
  };

  const narrative=()=>window.ArenaNarrative||null;
  const finalUnlocked=()=>!!narrative()?.hasEvent(FINAL_EVENT);

  function selectedMap(){
    const el=document.querySelector('.zone.selected');
    return el?Number(el.dataset.zone):null;
  }

  function addRetro(scene, data){
    if(!scene||scene.querySelector('.arena-retro-lore'))return;
    const el=document.createElement('article');
    el.className='arena-retro-lore';
    el.innerHTML='<div class="arena-retro-label">MEMÓRIA RETROATIVA · O QUE AGORA FAZ SENTIDO</div>'
      +'<h4>'+data.title+'</h4>'
      +'<p>'+data.text+'</p>'
      +'<span>'+data.detail+'</span>';
    scene.appendChild(el);
  }

  function renderRetro(){
    if(!finalUnlocked())return;
    const zone=selectedMap();
    const key='map'+(zone+1);
    const data=SCENES[key];
    if(!data)return;
    addRetro(document.getElementById(data.scene),data);
  }

  function patchDialogue(){
    if(window.__arenaReplayDialogueHook)return true;
    const api=window.ArenaNarrativeNPCs;
    if(!api?.openDialogue)return false;
    const original=api.openDialogue;
    api.openDialogue=function(npc,mapId,second=false){
      const result=original.apply(this,arguments);
      if(finalUnlocked()){
        setTimeout(()=>{
          const modal=document.getElementById('arenaNarrativeDialogue');
          const box=modal?.querySelector('.arena-narrative-dialogue');
          if(!box||box.querySelector('.arena-retro-dialogue'))return;
          const notes={
            map1:'Agora você entende por que Kaelen falava da “coroa”: ele estava falando da alma do Soberano, não de um reino distante.',
            map2:'Agora você entende a advertência de Vara: havia realmente duas vontades ligadas ao mesmo corpo.',
            map3:'Agora você entende Elias: a pergunta sobre o Abismo sempre foi uma pergunta sobre suas próprias memórias.',
            map4:'Agora você entende o desespero de Kaelen: ele precisava dos fragmentos e temia que você descobrisse para que o poder deles servia.',
            map5:'Agora você entende o silêncio: aqueles guardas estavam esperando o retorno do próprio rei.'
          };
          const note=notes[mapId];
          if(!note)return;
          const el=document.createElement('div');
          el.className='arena-retro-dialogue';
          el.innerHTML='<strong>Depois de lembrar:</strong><span>'+note+'</span>';
          box.querySelector('.arena-narrative-text')?.after(el);
        },30);
      }
      return result;
    };
    window.__arenaReplayDialogueHook=true;
    return true;
  }

  function observe(){
    const map=document.getElementById('map');
    if(!map)return;
    const refresh=()=>{patchDialogue();renderRetro()};
    new MutationObserver(()=>setTimeout(refresh,0))
      .observe(map,{subtree:true,childList:true,attributes:true,attributeFilter:['class','data-zone']});
    setInterval(refresh,350);
    setTimeout(refresh,300);
  }

  function boot(){
    if(!narrative())return;
    observe();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
  window.ArenaReplayLore={render:renderRetro};
})();

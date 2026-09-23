// Arena — NPCs narrativos. Fase 3: somente narrativa/UI; não altera combate.
(()=> {
  const MAPS=[
    {zone:0,id:'map1',name:'Floresta Sombria',npcs:['kaelen']},
    {zone:1,id:'map2',name:'Acampamento Orc',npcs:['kaelen','vara']},
    {zone:2,id:'map3',name:'Deserto Perdido',npcs:['kaelen','elias']},
    {zone:3,id:'map4',name:'Covil dos Dragões',npcs:['kaelen']},
    {zone:4,id:'map5',name:'Abismo Demoníaco',npcs:['kaelen']}
  ];
  const DATA={
    kaelen:{name:'Kaelen',role:'O Guia',icon:'⚔',tone:'sereno',lines:{
      map1:{id:'kaelen.map1.crown',text:'Nós precisamos consertar o que foi quebrado, guerreiro. A coroa deve ser restaurada.'},
      map2:{id:'kaelen.map2.dismiss_vara',text:'Não dê ouvidos àquela bruxa. Vara está corrompida. Continue. O caminho precisa ser aberto.'},
      map3:{id:'kaelen.map3.abyss',text:'O Abismo está abaixo de nós. Os demônios destruíram esta cidade. Não deixe que o medo desvie você do caminho.'},
      map4:{id:'kaelen.map4.kill_beasts',text:'Eles são monstros! Ferramentas! Mate-os e pegue o poder!'},
      map5:{id:'kaelen.map5.silence',text:'...O trono nos espera.'}
    }},
    vara:{name:'Vara',role:'A Xamã',icon:'👁',tone:'enigmática',lines:{
      map2:{id:'vara.map2.two_shadows',text:'Eu vejo um corpo, mas duas sombras. O Mentiroso caminha colado às costas do Inocente. Qual dos dois segura a espada?'}
    }},
    elias:{name:'Elias',role:'O Arquivista',icon:'📜',tone:'perturbado',lines:{
      map3:{id:'elias.map3.poison_water',text:'Você bebe o veneno achando que é água! Você destrói os cadeados achando que está salvando a porta!'},
      map3b:{id:'elias.map3.key_in_mind',text:'Por que pergunta a mim sobre o Abismo, se é você quem carrega a chave na sua própria mente?'}
    }}
  };
  let currentMap=null;
  function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function getMap(){const el=document.querySelector('.zone.selected');return el?Number(el.dataset.zone):null;}
  function getNpcs(zone){const map=MAPS.find(x=>x.zone===zone);return map?map.npcs:[];}
  function lineFor(npc,mapId){const d=DATA[npc]?.lines||{};return d[mapId]||d[mapId+'b']||null;}
  function markDialogue(id){if(window.ArenaNarrative?.registerDialogue)window.ArenaNarrative.registerDialogue(id);}
  function openDialogue(npc,mapId,second=false){
    const d=DATA[npc], line=second&&npc==='elias'?d.lines.map3b:lineFor(npc,mapId);
    if(!d||!line)return;
    markDialogue(line.id);
    let modal=document.getElementById('arenaNarrativeDialogue');
    if(!modal){modal=document.createElement('div');modal.id='arenaNarrativeDialogue';modal.className='arena-narrative-modal';document.body.appendChild(modal);}
    modal.innerHTML='<div class="arena-narrative-dialogue" role="dialog" aria-modal="true" aria-label="Diálogo de '+esc(d.name)+'"><button class="arena-narrative-close" type="button" aria-label="Fechar">×</button><div class="arena-narrative-speaker"><span class="arena-narrative-avatar">'+d.icon+'</span><div><strong>'+esc(d.name)+'</strong><small>'+esc(d.role)+'</small></div></div><div class="arena-narrative-text">“'+esc(line.text)+'”</div><div class="arena-narrative-footer"><span>Registro narrativo atualizado</span><button class="btn active arena-narrative-ok" type="button">Continuar</button></div></div>';
    modal.classList.add('open');
    const close=()=>modal.classList.remove('open');
    modal.querySelector('.arena-narrative-close').onclick=close;
    modal.querySelector('.arena-narrative-ok').onclick=close;
    modal.onclick=e=>{if(e.target===modal)close()};
  }
  function render(){
    const zone=getMap();
    if(zone===null||zone===currentMap)return;
    currentMap=zone;
    document.getElementById('arenaNpcPanel')?.remove();
    const ids=getNpcs(zone);if(!ids.length)return;
    const battle=document.getElementById('battleArea');if(!battle)return;
    const panel=document.createElement('section');panel.id='arenaNpcPanel';panel.className='arena-npc-panel';
    const map=MAPS.find(x=>x.zone===zone);
    panel.innerHTML='<div class="arena-npc-head"><div><div class="eyebrow">Narrativa</div><h3>Presenças em '+esc(map.name)+'</h3></div><span class="arena-npc-status">EVENTO NARRATIVO</span></div><div class="arena-npc-list">'+ids.map(npc=>{const d=DATA[npc],line=lineFor(npc,map.id);return '<article class="arena-npc-card"><div class="arena-npc-icon">'+d.icon+'</div><div class="arena-npc-info"><strong>'+esc(d.name)+'</strong><span>'+esc(d.role)+'</span></div><button type="button" class="btn arena-npc-talk" data-npc="'+npc+'">Falar</button></article>'}).join('')+'</div>';
    battle.parentNode.insertBefore(panel,battle);
    panel.querySelectorAll('.arena-npc-talk').forEach(btn=>btn.onclick=()=>openDialogue(btn.dataset.npc,map.id));
    if(ids.includes('elias')){
      const extra=panel.querySelector('[data-npc="elias"]');
      if(extra){const more=document.createElement('button');more.type='button';more.className='btn arena-npc-more';more.textContent='Perguntar sobre o Abismo';more.onclick=()=>openDialogue('elias','map3',true);extra.parentNode.appendChild(more);}
    }
  }
  function observe(){
    const map=document.getElementById('map');if(!map)return;
    new MutationObserver(()=>setTimeout(render,0)).observe(map,{subtree:true,childList:true,attributes:true,attributeFilter:['class','data-zone']});
    setInterval(()=>{const z=getMap();if(z!==currentMap)render()},250);
    setTimeout(render,0);
  }
  window.ArenaNarrativeNPCs={render,openDialogue};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',observe);else observe();
})();
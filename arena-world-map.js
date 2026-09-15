// World Map da Arena: mantém a estrutura original e transforma os cards em uma jornada.
(()=>{
  if(window.__arenaWorldMap)return;
  window.__arenaWorldMap=true;

  const style=document.createElement('style');
  style.textContent=`
    .map-controls .next-zone{display:none!important}
    .map-controls .zone-count{display:none!important}
    #map.world-map{grid-template-columns:repeat(5,minmax(0,1fr));gap:8px;margin-bottom:18px;overflow:visible}
    #map.world-map .zone{min-height:100px;padding:14px;background:#0e1013;text-align:left}
    #map.world-map .zone:not(.locked):hover{transform:translateY(-1px);background:#12110d}
    #map.world-map .zone.selected{background:#12110d;border-color:var(--gold);box-shadow:inset 0 0 0 1px rgba(197,155,59,.12)}
    #map.world-map .zone.locked{opacity:.38}
    #map.world-map .zone .zone-icon{font-size:1.6rem}
    #map.world-map .zone strong{font-size:inherit;line-height:normal}
    #map.world-map .zone small{font-size:.63rem}
    #map.world-map .zone .lock{font-size:.65rem}
    #map.world-map .zone:not(:last-child)::after{content:'›';position:absolute;right:-7px;top:50%;transform:translateY(-50%);font-size:1.15rem;color:#655a3b;z-index:3;background:#0e1013;padding:0 1px}
    #map.world-map .zone.selected::before{content:'VOCÊ ESTÁ AQUI';position:absolute;left:14px;bottom:8px;white-space:nowrap;font-size:.48rem;font-weight:800;letter-spacing:1px;color:var(--gold2)}
    #map.world-map .zone.current-node{padding-bottom:25px}
    #map.world-map .zone.unlocked-node:not(.selected){border-color:#30343a}
    .arena-map-travel{animation:arenaMapTravel .45s ease both}
    @keyframes arenaMapTravel{0%{opacity:.55;transform:scale(.99)}100%{opacity:1;transform:scale(1)}}
    @media(max-width:900px){#map.world-map{grid-template-columns:1fr 1fr;gap:8px}}
    @media(max-width:620px){#map.world-map{grid-template-columns:1fr;gap:8px}.map-controls{display:none!important}.section-head{margin-bottom:14px}}
  `;
  document.head.appendChild(style);

  function enhance(){
    if(typeof game==='undefined'||!game||typeof ZONES==='undefined')return false;
    const map=document.getElementById('map');
    if(!map)return false;

    map.classList.add('world-map');
    const current=Math.min(Math.max(Number(game.zone)||0,0),ZONES.length-1);

    map.querySelectorAll('.zone').forEach((button,index)=>{
      button.classList.toggle('unlocked-node',!button.classList.contains('locked'));
      button.classList.toggle('current-node',index===current);
      if(index===current)button.setAttribute('aria-current','page');
      else button.removeAttribute('aria-current');

      const original=button.onclick;
      if(!original||button.dataset.worldBound)return;
      button.dataset.worldBound='1';
      button.onclick=(event)=>{
        if(index===current){original.call(button,event);return}
        if(typeof toast==='function')toast(`Viajando para ${ZONES[index].name}...`);
        map.classList.add('arena-map-travel');
        setTimeout(()=>{
          original.call(button,event);
          setTimeout(()=>map.classList.remove('arena-map-travel'),50);
        },300);
      };
    });

    return true;
  }

  function install(){
    if(typeof window.renderMap!=='function')return false;
    if(window.renderMap.__worldMap)return true;
    const original=window.renderMap;
    function worldRenderMap(){
      const result=original.apply(this,arguments);
      setTimeout(enhance,0);
      return result;
    }
    worldRenderMap.__worldMap=true;
    window.renderMap=worldRenderMap;
    setTimeout(enhance,0);
    return true;
  }

  let tries=0;
  const timer=setInterval(()=>{
    tries++;
    if(install()||tries>100)clearInterval(timer);
  },100);
})();

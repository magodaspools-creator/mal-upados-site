// World Map da Arena: transforma a troca de áreas em uma jornada visual.
(()=>{
  if(window.__arenaWorldMap)return;
  window.__arenaWorldMap=true;

  const style=document.createElement('style');
  style.textContent=`
    .map-controls .next-zone{display:none!important}
    .map-controls .zone-count{display:none!important}
    #arenaWorldMap{margin:0 0 14px;padding:14px 14px 12px;border:1px solid var(--line);background:linear-gradient(180deg,#121419,#0d0f12);overflow:hidden}
    #arenaWorldMap .world-head{display:flex;justify-content:space-between;align-items:end;gap:12px;margin-bottom:12px}
    #arenaWorldMap .world-title{font-family:Cinzel,serif;color:var(--gold2);font-size:.9rem;letter-spacing:1.2px}
    #arenaWorldMap .world-sub{font-size:.62rem;color:var(--muted);margin-top:3px}
    #arenaWorldMap .world-status{font-size:.62rem;color:var(--muted);text-align:right}
    #arenaWorldMap .world-status strong{color:var(--text)}
    #map.world-map{display:grid;grid-template-columns:repeat(5,minmax(135px,1fr));gap:0;margin:0;padding:2px 0 4px;overflow-x:auto}
    #map.world-map .zone{min-height:112px;padding:12px 10px;text-align:center;border-color:#292d34;background:#0c0f13;z-index:1}
    #map.world-map .zone:not(.locked):hover{transform:translateY(-2px);background:#15130f}
    #map.world-map .zone.selected{background:linear-gradient(180deg,#1d1910,#111216);border-color:var(--gold);box-shadow:0 0 0 1px rgba(197,155,59,.12),0 8px 22px rgba(0,0,0,.25)}
    #map.world-map .zone.locked{opacity:.3}
    #map.world-map .zone .zone-icon{font-size:1.8rem}
    #map.world-map .zone strong{font-size:.68rem;line-height:1.25}
    #map.world-map .zone small{font-size:.56rem}
    #map.world-map .zone .lock{font-size:.56rem}
    #map.world-map .zone:not(:last-child)::after{content:'›';position:absolute;right:-8px;top:50%;transform:translateY(-50%);font-size:1.3rem;color:#655a3b;z-index:3;background:#0d0f12;padding:0 1px}
    #map.world-map .zone.selected::before{content:'VOCÊ ESTÁ AQUI';position:absolute;left:50%;bottom:6px;transform:translateX(-50%);white-space:nowrap;font-size:.48rem;font-weight:800;letter-spacing:1px;color:var(--gold2)}
    #map.world-map .zone.unlocked-node:not(.selected){border-color:#3d403f}
    #map.world-map .zone.current-node{padding-bottom:25px}
    .arena-map-travel{animation:arenaMapTravel .45s ease both}
    @keyframes arenaMapTravel{0%{opacity:.55;transform:scale(.985)}100%{opacity:1;transform:scale(1)}}
    @media(max-width:900px){#map.world-map{grid-template-columns:repeat(5,150px);overflow-x:auto;scrollbar-width:thin}#arenaWorldMap .world-head{align-items:flex-start;flex-direction:column}.world-status{text-align:left!important}}
    @media(max-width:620px){#arenaWorldMap{padding:12px 10px}#map.world-map{grid-template-columns:repeat(5,142px)}#map.world-map .zone{min-height:105px}.map-controls{display:none!important}}
  `;
  document.head.appendChild(style);

  function enhance(){
    if(typeof game==='undefined'||!game||typeof ZONES==='undefined')return false;
    const map=document.getElementById('map');
    if(!map)return false;

    const old=document.getElementById('arenaWorldMap');
    if(old)old.remove();

    map.classList.add('world-map');
    const current=Math.min(Math.max(Number(game.zone)||0,ZONES.length-1),ZONES.length-1);
    const unlocked=ZONES.filter(z=>(Number(game.level)||1)>=Number(z.min||1)).length;
    const wrap=document.createElement('section');
    wrap.id='arenaWorldMap';
    wrap.innerHTML=`<div class="world-head"><div><div class="world-title">🗺️ JORNADA DA ARENA</div><div class="world-sub">Escolha qualquer território já desbloqueado.</div></div><div class="world-status"><strong>Área atual:</strong> ${String(ZONES[current]?.name||'')}</div></div>`;
    map.parentNode.insertBefore(wrap,map);
    wrap.appendChild(map);

    map.querySelectorAll('.zone').forEach((button,index)=>{
      button.classList.toggle('unlocked-node',!button.classList.contains('locked'));
      button.classList.toggle('current-node',index===current);
      if(index===current)button.setAttribute('aria-current','page');

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

    setTimeout(()=>{
      const active=map.querySelector('.zone.selected');
      active?.scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'});
    },20);
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

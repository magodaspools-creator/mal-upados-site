(()=>{
  if(window.__arenaViews)return;
  window.__arenaViews=true;

  const CSS=`
    .arena-view-shell{width:min(1180px,calc(100% - 28px));margin:0 auto 70px;position:relative}
    .arena-view{display:none;animation:arenaViewIn .22s ease}
    .arena-view.active{display:block}
    @keyframes arenaViewIn{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:none}}
    .arena-view[data-view="combat"] .game-shell{margin-bottom:0}
    .arena-map-view-head,.arena-forge-view-head{display:flex;justify-content:space-between;align-items:end;gap:18px;padding:0 2px;margin-bottom:16px}
    .arena-map-view-head h2,.arena-forge-view-head h2{margin:4px 0 0;font-family:Cinzel,serif;color:#e8dfc9}
    .arena-map-view-head p,.arena-forge-view-head p{margin:5px 0 0;color:#777d83;font-size:.64rem}
    .arena-map-view-body{border:1px solid #302f2b;background:linear-gradient(145deg,#151716,#0b0d0e);padding:18px;box-shadow:0 20px 60px rgba(0,0,0,.25)}
    .arena-view .shop-section,.arena-view .activities,.arena-view .progress-section,.arena-view .arena-ranking,.arena-view .p3-codex,.arena-view .p4-command{margin-top:0}
    .arena-view .shop-section+.shop-section{margin-top:16px}
    .arena-view[data-view="daily"] .p3-codex{margin-top:16px}
    .arena-view[data-view="forge"] .p4-command{margin-top:0}
    .arena-view-empty{border:1px dashed #34383a;background:#0e1011;padding:30px;text-align:center;color:#737a80;font-size:.68rem}
    @media(max-width:760px){.arena-view-shell{width:calc(100% - 14px)}.arena-map-view-head,.arena-forge-view-head{align-items:start;flex-direction:column}.arena-map-view-body{padding:10px}}
  `;
  const style=document.createElement('style');style.id='arenaViewsStyle';style.textContent=CSS;document.head.appendChild(style);

  const $=s=>document.querySelector(s);
  const mk=(id,label)=>{const s=document.createElement('section');s.className='arena-view';s.id=id;s.dataset.view=label;return s};
  const move=(node,parent)=>{if(node&&parent)parent.appendChild(node)};

  function setup(){
    const nav=$('#arenaSubnav'),shell=$('#arenaCombatSection')||$('.game-shell');
    if(!nav||!shell)return false;
    const main=shell.parentElement;if(!main)return false;
    if($('#arenaViewShell'))return true;

    const combat=mk('arenaViewCombat','combat');
    move(shell,combat);

    const mapView=mk('arenaViewMap','map');
    const mapHead=document.createElement('div');mapHead.className='arena-map-view-head';
    mapHead.innerHTML='<div><div class="eyebrow">MAPA DA ARENA</div><h2>Escolha seu destino</h2><p>Selecione uma área desbloqueada para definir onde sua próxima aventura acontece.</p></div>';
    const mapBody=document.createElement('div');mapBody.className='arena-map-view-body';
    const mapSource=shell.querySelector('.adventure-panel');
    const mapSectionHead=mapSource?.querySelector('.section-head');
    const map=mapSource?.querySelector('#map');
    if(mapSectionHead){const title=mapSectionHead.querySelector('h2');if(title)title.textContent='Escolha seu destino';mapBody.appendChild(mapSectionHead)}
    if(map)mapBody.appendChild(map);
    mapView.append(mapHead,mapBody);

    const forgeView=mk('arenaViewForge','forge');
    const command=$('#arenaPhase4Command');
    if(command)forgeView.appendChild(command);else forgeView.innerHTML='<div class="arena-view-empty" data-forge-loading>Forja carregando...</div>';

    const dailyView=mk('arenaViewDaily','daily');
    const activities=$('.activities');if(activities)dailyView.appendChild(activities);
    const progressView=mk('arenaViewProgress','progress');
    const progress=$('.progress-section');if(progress)progressView.appendChild(progress);
    const rankingView=mk('arenaViewRanking','ranking');
    const ranking=$('.arena-ranking');if(ranking)rankingView.appendChild(ranking);
    const shopView=mk('arenaViewShop','shop');
    document.querySelectorAll('main > .shop-section').forEach(x=>shopView.appendChild(x));

    const views=document.createElement('div');views.id='arenaViewShell';views.className='arena-view-shell';
    views.append(combat,mapView,forgeView,dailyView,shopView,progressView,rankingView);
    main.appendChild(views);

    const codex=$('#arenaPhase3Codex');if(codex)dailyView.appendChild(codex);

    const targets={arenaCombatSection:'arenaViewCombat',arenaMap:'arenaViewMap',arenaForgeSection:'arenaViewForge',arenaActivitiesSection:'arenaViewDaily',arenaShopSection:'arenaViewShop',arenaProgressSection:'arenaViewProgress',arenaRankingSection:'arenaViewRanking'};
    nav.querySelectorAll('button').forEach(btn=>{
      btn.dataset.viewTarget=targets[btn.dataset.target]||btn.dataset.target;
      btn.onclick=e=>{e.preventDefault();e.stopPropagation();show(btn.dataset.viewTarget,btn)};
    });
    show('arenaViewCombat',nav.querySelector('[data-target="arenaCombatSection"]'));
    return true;
  }

  function show(id,btn){
    const target=document.getElementById(id);if(!target)return;
    document.querySelectorAll('#arenaViewShell .arena-view').forEach(v=>v.classList.toggle('active',v===target));
    document.querySelectorAll('#arenaSubnav button').forEach(b=>b.classList.toggle('active',b===btn));
    window.scrollTo({top:0,behavior:'smooth'});
  }

  function watch(){
    if(!setup())return;
    const daily=$('#arenaViewDaily'),forge=$('#arenaViewForge'),mapView=$('#arenaViewMap');
    const codex=$('#arenaPhase3Codex');if(daily&&codex&&codex.parentElement!==daily)daily.appendChild(codex);
    const command=$('#arenaPhase4Command');
    if(forge&&command&&command.parentElement!==forge){forge.querySelector('[data-forge-loading]')?.remove();forge.appendChild(command)}
    const mapSource=$('.adventure-panel');
    const mapHead=mapSource?.querySelector('.section-head');
    const map=$('#map');
    if(mapView&&map){const body=mapView.querySelector('.arena-map-view-body');if(body){if(mapHead&&mapHead.parentElement!==body)body.insertBefore(mapHead,map);if(map.parentElement!==body)body.appendChild(map)}}
  }

  const timer=setInterval(watch,250);setTimeout(()=>clearInterval(timer),180000);watch();
})();

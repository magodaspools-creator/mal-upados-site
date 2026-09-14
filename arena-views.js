(()=>{
  if(window.__arenaViews)return;
  window.__arenaViews=true;

  const CSS=`
    .arena-view-shell{width:min(1180px,calc(100% - 28px));margin:0 auto 70px;position:relative}
    .arena-view{display:none;animation:arenaViewIn .22s ease}
    .arena-view.active{display:block}
    @keyframes arenaViewIn{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:none}}
    .arena-view[data-view="combat"] .game-shell{margin-bottom:0}
    .arena-view[data-view="combat"] .adventure-panel>.section-head,.arena-view[data-view="combat"] .adventure-panel>.map{display:none!important}
    .arena-view[data-view="combat"] .adventure-panel{display:flex;align-items:stretch}
    .arena-view[data-view="combat"] .battle-area{width:100%;margin:0}
    .arena-map-art{border:1px solid #39372f;background:#090b0c;padding:10px;box-shadow:0 24px 70px rgba(0,0,0,.45)}
    .arena-map-art img{display:block;width:100%;height:auto;border:1px solid #2d2d29;background:#0a0c0d}
    .arena-view .shop-section,.arena-view .activities,.arena-view .progress-section,.arena-view .arena-ranking,.arena-view .p3-codex,.arena-view .p4-command{margin-top:0}
    .arena-view .shop-section+.shop-section{margin-top:16px}
    .arena-view[data-view="daily"] .p3-codex{margin-top:16px}
    .arena-view[data-view="forge"] .p4-command{margin-top:0}
    .arena-view-empty{border:1px dashed #34383a;background:#0e1011;padding:30px;text-align:center;color:#737a80;font-size:.68rem}
    @media(max-width:760px){.arena-view-shell{width:calc(100% - 14px)}.arena-map-art{padding:5px}}
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
    const mapHead=document.createElement('div');
    mapHead.className='arena-map-view-head';
    mapHead.innerHTML='<div><div class="eyebrow">MAPA DA ARENA</div><h2>Mapa da Jornada</h2><p>Visão geral do mundo da Arena.</p></div>';
    const mapBody=document.createElement('div');mapBody.className='arena-map-art';
    const img=document.createElement('img');img.src='arena-map.svg?v=map-20260914';img.alt='Mapa da Jornada da Arena Mal Upados';
    mapBody.appendChild(img);
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
    const daily=$('#arenaViewDaily'),forge=$('#arenaViewForge');
    const codex=$('#arenaPhase3Codex');if(daily&&codex&&codex.parentElement!==daily)daily.appendChild(codex);
    const command=$('#arenaPhase4Command');
    if(forge&&command&&command.parentElement!==forge){forge.querySelector('[data-forge-loading]')?.remove();forge.appendChild(command)}
  }

  const timer=setInterval(watch,250);setTimeout(()=>clearInterval(timer),180000);watch();
})();

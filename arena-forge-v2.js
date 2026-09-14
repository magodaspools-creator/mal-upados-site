(()=>{
  if(window.__arenaForgeV2)return;
  window.__arenaForgeV2=true;

  const TIERS=[
    {tier:1,cost:25000,cores:1,chance:.85,attack:4,hp:12},
    {tier:2,cost:75000,cores:2,chance:.70,attack:6,hp:20},
    {tier:3,cost:180000,cores:3,chance:.55,attack:8,hp:30},
    {tier:4,cost:400000,cores:5,chance:.40,attack:10,hp:42},
    {tier:5,cost:850000,cores:8,chance:.25,attack:14,hp:58}
  ];

  const fmt=n=>new Intl.NumberFormat('pt-BR').format(Math.floor(Number(n)||0));
  const getForge=()=>{game.forge=game.forge&&typeof game.forge==='object'?game.forge:{};game.forge.weapon=Math.max(0,Math.min(5,Number(game.forge.weapon)||0));game.forge.armor=Math.max(0,Math.min(5,Number(game.forge.armor)||0));game.forge.cores=Math.max(0,Number(game.forge.cores)||0);game.forge.unlocked=!!game.forge.unlocked;return game.forge};
  const nextTier=type=>getForge()[type]||0;
  const materialLabel=()=>`${fmt(getForge().cores)} Essência Demoníaca`;

  function style(){
    if(document.getElementById('arenaForgeV2Style'))return;
    const s=document.createElement('style');s.id='arenaForgeV2Style';s.textContent=`
      .forge-v2-lock{border:1px solid #4b3a27;background:linear-gradient(145deg,#15120e,#0d0f10);padding:20px;margin-bottom:14px}.forge-v2-lock strong{display:block;color:#dfc98f;font-family:Cinzel,serif;font-size:.85rem}.forge-v2-lock span{display:block;color:#777d82;font-size:.59rem;line-height:1.5;margin-top:6px}.forge-v2-material{display:flex;justify-content:space-between;gap:12px;align-items:center;padding:11px 13px;border:1px solid #34302a;background:#0d1011;margin-bottom:12px}.forge-v2-material span{font-size:.55rem;color:#858b90}.forge-v2-material b{font-size:.68rem;color:#d8b86d}.forge-v2-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}.forge-v2-card{border:1px solid #353536;background:linear-gradient(145deg,#151719,#0c0f10);padding:15px}.forge-v2-card h4{font-family:Cinzel,serif;color:#e1d9c7;margin:0 0 4px}.forge-v2-card p{font-size:.57rem;color:#747b81;line-height:1.45;margin:0 0 12px}.forge-v2-tier{display:flex;justify-content:space-between;align-items:center;margin-bottom:9px}.forge-v2-tier b{color:#d5b66c;font-size:.7rem}.forge-v2-tier span{color:#777e83;font-size:.53rem}.forge-v2-bar{height:7px;border:1px solid #2d3032;background:#080a0b;display:flex;gap:2px;margin-bottom:12px}.forge-v2-bar i{flex:1;background:#272a2c}.forge-v2-bar i.on{background:linear-gradient(90deg,#765b26,#d5b86d)}.forge-v2-info{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:11px}.forge-v2-info div{padding:7px;border:1px solid #292c2e;background:#101315}.forge-v2-info span{display:block;color:#686f75;font-size:.48rem;text-transform:uppercase}.forge-v2-info b{display:block;color:#d5d7d8;font-size:.62rem;margin-top:2px}.forge-v2-action{width:100%;border:1px solid #765e2d;background:linear-gradient(180deg,#292115,#17130e);color:#dfc27b;padding:10px;cursor:pointer;font-weight:800;font-size:.58rem}.forge-v2-action:disabled{opacity:.32;cursor:not-allowed}.forge-v2-warning{font-size:.52rem;color:#8a7d62;text-align:center;margin-top:8px;line-height:1.4}.forge-v2-result{margin:0 0 12px;padding:11px;border:1px solid #3b352a;background:#101213;color:#aaa;font-size:.59rem}.forge-v2-result.success{border-color:#6a5b35;color:#dfc77f}.forge-v2-result.fail{border-color:#493434;color:#c28e8e}.forge-v2-roll{animation:forgeRoll .35s ease}.forge-v2-lock-icon{font-size:1.6rem;float:left;margin-right:10px}.forge-v2-tag{display:inline-block;border:1px solid #51432a;padding:4px 7px;color:#bca064;font-size:.48rem;letter-spacing:.08em;margin-bottom:8px}
      @keyframes forgeRoll{0%{transform:scale(.98);opacity:.5}50%{transform:scale(1.02)}100%{transform:none;opacity:1}}
      @media(max-width:760px){.forge-v2-grid{grid-template-columns:1fr}}
    `;document.head.appendChild(s);
  }

  function persistForge(){if(typeof persist==='function')persist();else{try{const all=JSON.parse(localStorage.getItem('malupados_arena_v1')||'{}');all[game.character]=game;localStorage.setItem('malupados_arena_v1',JSON.stringify(all))}catch{}}}

  function awardDemonEssence(){
    if(!game||!game.forge)return;
    const f=getForge();
    f.cores++;
    f.unlocked=true;
    persistForge();
    if(typeof toast==='function')toast('Essência Demoníaca obtida! A Forja de Endgame foi desbloqueada.');
  }

  function watchDemonVictory(){
    const area=document.getElementById('battleArea');if(!area)return;
    const obs=new MutationObserver(()=>{
      if(!game)return;
      const text=area.textContent||'';
      if(/Demon derrotado/i.test(text)&&!area.dataset.forgeRewarded){
        area.dataset.forgeRewarded='1';
        awardDemonEssence();
      }
    });
    obs.observe(area,{childList:true,subtree:true,characterData:true});
  }

  function open(){
    document.getElementById('arenaForgeV2Modal')?.remove();
    const f=getForge();
    const modal=document.createElement('div');modal.id='arenaForgeV2Modal';modal.className='p4-modal';
    modal.innerHTML=`<div class="p4-modal-box forge-v2-modal-box"><div class="eyebrow">FORJA · ENDGAME</div><h3>Forja do Abismo</h3><p>A forja não é uma compra comum. Ela foi criada para o trecho entre o <b>Demon</b> e o <b>Deathbringer</b>: queime Gold e Essências Demoníacas em tentativas arriscadas para transformar uma Skill ainda baixa em poder de equipamento.</p><div class="forge-v2-tag">RISCO × RECOMPENSA</div>${!f.unlocked?`<div class="forge-v2-lock"><div class="forge-v2-lock-icon">☠</div><strong>Forja bloqueada</strong><span>Derrote o Demon pela primeira vez para obter a primeira Essência Demoníaca e desbloquear este sistema.</span></div>`:`<div class="forge-v2-material"><span>Material raro</span><b>☠ ${materialLabel()}</b></div><div id="forgeV2Result"></div><div class="forge-v2-grid">${card('weapon','⚔','Forja da Arma','Ataque',f.weapon)}${card('armor','🛡','Forja da Armadura','HP',f.armor)}</div><div class="forge-v2-warning">Falhar consome Gold e Essências. O tier não diminui. Quanto maior o tier, maior o custo e menor a chance de sucesso.</div>`}<button class="btn p4-close">Fechar</button></div>`;
    document.body.appendChild(modal);
    modal.querySelectorAll('[data-forge-v2]').forEach(b=>b.onclick=()=>attempt(b.dataset.forgeV2));
    modal.querySelector('.p4-close').onclick=()=>modal.remove();
    modal.onclick=e=>{if(e.target===modal)modal.remove()};
  }

  function card(type,icon,title,stat,level){
    if(level>=5)return `<article class="forge-v2-card"><h4>${icon} ${title}</h4><p>Limite máximo atingido.</p>${bar(level)}<div class="forge-v2-info"><div><span>Tier</span><b>5 / 5</b></div><div><span>Bônus</span><b>Máximo</b></div></div><button class="forge-v2-action" disabled>FORJA MÁXIMA</button></article>`;
    const t=TIERS[level];
    return `<article class="forge-v2-card"><h4>${icon} ${title}</h4><p>Próximo tier: +${t[type==='weapon'?'attack':'hp']} ${stat}. Tentativa de ${t.tier}º tier.</p>${bar(level)}<div class="forge-v2-tier"><b>Tier ${t.tier}</b><span>${Math.round(t.chance*100)}% de sucesso</span></div><div class="forge-v2-info"><div><span>Gold</span><b>${fmt(t.cost)}</b></div><div><span>Essência</span><b>${t.cores}</b></div></div><button class="forge-v2-action" data-forge-v2="${type}">TENTAR FORJAR</button></article>`;
  }

  function bar(level){return `<div class="forge-v2-bar">${[1,2,3,4,5].map(i=>`<i class="${i<=level?'on':''}"></i>`).join('')}</div>`}

  function attempt(type){
    if(!game)return;
    const f=getForge();
    if(!f.unlocked){open();return}
    const level=nextTier(type);if(level>=5)return;
    const t=TIERS[level];
    if(Number(game.gold||0)<t.cost){showResult(`Gold insuficiente. Você precisa de ${fmt(t.cost)} Gold.`,'fail');return}
    if(Number(f.cores||0)<t.cores){showResult(`Essência Demoníaca insuficiente. Você precisa de ${t.cores}.`,'fail');return}
    game.gold-=t.cost;f.cores-=t.cores;
    const success=Math.random()<t.chance;
    if(success){f[type]++;persistForge();showResult(`FORJA BEM-SUCEDIDA! Tier ${t.tier} concluído. +${type==='weapon'?t.attack+' ataque':t.hp+' HP'}.`,'success');if(typeof toast==='function')toast(`Forja bem-sucedida! Tier ${t.tier}.`)}
    else{persistForge();showResult(`A forja falhou. Os materiais foram consumidos, mas seu Tier permaneceu intacto.`,'fail');if(typeof toast==='function')toast('A forja falhou. Os materiais foram perdidos.')}
    if(typeof renderAll==='function')renderAll();
    setTimeout(open,420);
  }

  function showResult(text,kind){
    const box=document.getElementById('forgeV2Result');if(!box)return;
    box.className='forge-v2-result '+kind+' forge-v2-roll';box.textContent=text;
  }

  function intercept(){
    document.addEventListener('click',e=>{
      const b=e.target.closest?.('#p4ForgeBtn,#p4ForgeBtn2');
      if(!b)return;
      e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();open();
    },true);
  }

  style();intercept();watchDemonVictory();
})();

(()=>{
  if(window.__arenaCursedRuins)return;
  window.__arenaCursedRuins=true;

  const ZONE={id:'cursed_ruins',name:'Ruínas Amaldiçoadas',icon:'☠️',min:50,color:'Corrupção',monsters:[
    ['Cultista Amaldiçoado','🧙',1850,680,1250,1850],
    ['Guardião Profano','🗿',2300,790,1650,2350],
    ['Arauto da Ruína','👹',2900,930,2200,3100]
  ]};
  if(typeof ZONES!=='undefined'&&Array.isArray(ZONES)&&!ZONES.some(z=>z.id===ZONE.id))ZONES.push(ZONE);

  function style(){
    if(document.getElementById('cursedRuinsStyle'))return;
    const s=document.createElement('style');s.id='cursedRuinsStyle';s.textContent=`
      .cursed-ruins-panel{margin:0 0 14px;padding:14px;border:1px solid #4a3158;background:linear-gradient(145deg,#17101d,#0c0e10);box-shadow:0 14px 45px rgba(45,12,60,.18)}
      .cursed-ruins-head{display:flex;justify-content:space-between;gap:14px;align-items:center}.cursed-ruins-head strong{color:#cba9df;font-family:Cinzel,serif;font-size:.75rem}.cursed-ruins-head span{color:#81758a;font-size:.52rem}
      .corruption-bar{height:9px;border:1px solid #3d2947;background:#0a0b0d;margin-top:9px}.corruption-bar i{display:block;height:100%;width:0;background:linear-gradient(90deg,#5c3c72,#bd5ad7,#ef7b9c);transition:width .25s}
      .corruption-copy{display:flex;justify-content:space-between;margin-top:5px;font-size:.5rem;color:#827589}.corruption-copy b{color:#d7b7e5}
      .cursed-event{margin-top:9px;padding:8px;border:1px solid #533560;background:#140e18;color:#c99bdd;font-size:.52rem;line-height:1.45}
      .cursed-map-card{margin-top:14px;padding:14px;border:1px solid #4a3158;background:radial-gradient(circle at 50% 0,#21132a,#0c0e10)}.cursed-map-card h3{margin:0;color:#d7b8e7;font-family:Cinzel,serif}.cursed-map-card p{color:#80758a;font-size:.58rem;line-height:1.5}.cursed-map-card img{display:block;width:100%;margin:12px 0;border:1px solid #35263d}.cursed-map-card .rule{display:grid;grid-template-columns:repeat(3,1fr);gap:7px}.cursed-map-card .rule div{padding:8px;border:1px solid #35263d;background:#111015}.cursed-map-card .rule b{display:block;color:#cba9df;font-size:.58rem}.cursed-map-card .rule span{display:block;color:#706878;font-size:.47rem;margin-top:3px;line-height:1.35}
      @media(max-width:760px){.cursed-map-card .rule{grid-template-columns:1fr}}
    `;document.head.appendChild(s);
  }

  function getBattle(){return window.__arenaBattleRef||(typeof battle!=='undefined'?battle:null)}

  const oldStart=window.startBattle;
  if(typeof oldStart==='function')window.startBattle=function(zoneIndex,monsterIndex){
    const out=oldStart.apply(this,arguments),b=getBattle();
    if(b&&Number(zoneIndex)===ZONES.length-1){
      b.isCursedRuins=true;b.corruption=0;b.corruptionSurge=false;b.corruptionRewarded=false;
      window.__arenaBattleRef=b;window.__lastCursedCorruption=0;renderCorruption();
    }
    return out;
  };

  const oldAttack=window.attack;
  if(typeof oldAttack==='function')window.attack=function(){
    const b=getBattle();
    if(!b||!b.isCursedRuins)return oldAttack.apply(this,arguments);
    b.corruption=Math.min(100,(Number(b.corruption)||0)+12);
    window.__lastCursedCorruption=b.corruption;
    const corruption=b.corruption;
    const damageBoost=1+(corruption/100)*.25;
    const enemyBoost=1+(corruption/100)*.40;
    const previousBase=b.baseAttack,previousAttack=b.attack,previousEnemyDamage=b.damage;
    b.baseAttack=Math.max(1,Math.floor(previousBase*damageBoost));
    b.attack=Math.max(1,Math.floor(previousAttack*damageBoost));
    b.damage=Math.max(1,Math.floor(previousEnemyDamage*enemyBoost));
    if(corruption>=100&&!b.corruptionSurge){
      b.corruptionSurge=true;b.enemyHp=Math.min(b.enemyMaxHp,Math.floor(b.enemyHp+b.enemyMaxHp*.18));
      if(typeof toast==='function')toast('SURTO DA CORRUPÇÃO — o inimigo recuperou parte da vida.');
    }
    renderCorruption();
    try{return oldAttack.apply(this,arguments)}finally{
      const current=getBattle();
      if(current===b){b.baseAttack=previousBase;b.attack=previousAttack;b.damage=previousEnemyDamage;renderCorruption();}
    }
  };

  function renderCorruption(){
    const b=getBattle();if(!b||!b.isCursedRuins)return;
    const area=document.getElementById('battleArea');if(!area)return;
    let panel=document.getElementById('cursedRuinsPanel');
    if(!panel){panel=document.createElement('div');panel.id='cursedRuinsPanel';panel.className='cursed-ruins-panel';area.prepend(panel)}
    const c=Math.max(0,Math.min(100,Number(b.corruption)||0)),reward=Math.round(c*.6);
    panel.innerHTML=`<div class="cursed-ruins-head"><strong>☠ Corrupção ${c}%</strong><span>Quanto maior, maior o risco e a recompensa.</span></div><div class="corruption-bar"><i style="width:${c}%"></i></div><div class="corruption-copy"><span>Estável</span><b>+${reward}% Gold</b><span>Colapso</span></div>${b.corruptionSurge?'<div class="cursed-event">SURTO ATIVO: o inimigo recuperou 18% da vida. O risco continua aumentando.</div>':''}`;
  }

  function watchVictory(){
    const area=document.getElementById('battleArea');if(!area)return;
    const obs=new MutationObserver(()=>{
      const b=getBattle();if(b&&b.isCursedRuins)return;
      if(!game||game.zone!==ZONES.length-1)return;
      const text=area.textContent||'';
      if(/Vitória|Vitoria|derrotado/i.test(text)&&document.body.dataset.cursedRewarded!=='1'){
        document.body.dataset.cursedRewarded='1';
        const c=Math.max(0,Math.min(100,Number(window.__lastCursedCorruption)||0));
        const bonus=Math.floor(1000*(c/100));
        if(bonus>0){game.gold=(Number(game.gold)||0)+bonus;if(typeof persist==='function')persist();}
      }
      if(!/Vitória|Vitoria|derrotado/i.test(text))document.body.dataset.cursedRewarded='0';
    });
    obs.observe(area,{childList:true,subtree:true,characterData:true});
  }

  function addMapCard(){
    style();const mapView=document.getElementById('arenaViewMap');if(!mapView||document.getElementById('cursedRuinsMapCard'))return;
    const card=document.createElement('section');card.id='cursedRuinsMapCard';card.className='cursed-map-card';
    card.innerHTML=`<h3>☠ Ruínas Amaldiçoadas</h3><p>Uma região fora da lógica normal da Arena. Você decide até onde consegue levar a Corrupção antes que ela volte contra você.</p><img src="arena-cursed-ruins.svg?v=cursed-ruins-20260914" alt="Mapa das Ruínas Amaldiçoadas"><div class="rule"><div><b>Corrupção</b><span>+12% por ataque. Mais Corrupção = mais dano, risco e Gold.</span></div><div><b>Surto</b><span>Em 100%, o inimigo recupera 18% da vida e a luta entra em estado crítico.</span></div><div><b>Recompensa</b><span>O Gold extra cresce com a Corrupção acumulada na luta.</span></div></div>`;
    mapView.appendChild(card);
  }

  style();
  const timer=setInterval(()=>{addMapCard();renderCorruption()},300);setTimeout(()=>clearInterval(timer),120000);watchVictory();
})();
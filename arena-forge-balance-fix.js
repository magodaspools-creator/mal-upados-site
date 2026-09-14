(()=>{
  if(window.__arenaForgeBalanceFix)return;
  window.__arenaForgeBalanceFix=true;

  const TIERS=[
    {tier:1,cost:15000,cores:2,chance:.90},
    {tier:2,cost:35000,cores:4,chance:.75},
    {tier:3,cost:70000,cores:7,chance:.60},
    {tier:4,cost:140000,cores:11,chance:.45},
    {tier:5,cost:280000,cores:16,chance:.30}
  ];
  const fmt=n=>new Intl.NumberFormat('pt-BR').format(Math.floor(Number(n)||0));

  function getForge(){
    if(!game)return null;
    game.forge=game.forge&&typeof game.forge==='object'?game.forge:{};
    game.forge.weapon=Math.max(0,Math.min(5,Number(game.forge.weapon)||0));
    game.forge.armor=Math.max(0,Math.min(5,Number(game.forge.armor)||0));
    game.forge.cores=Math.max(0,Number(game.forge.cores)||0);
    return game.forge;
  }

  function result(modal,text,ok){
    let box=modal.querySelector('#forgeBalanceResult');
    if(!box){box=document.createElement('div');box.id='forgeBalanceResult';box.className='forge-v2-result';const target=modal.querySelector('#forgeV2Result');(target||modal.querySelector('.forge-v2-grid'))?.before(box)}
    box.className=`forge-v2-result ${ok?'success':'fail'}`;
    box.textContent=text;
  }

  function refresh(modal){
    const f=getForge();if(!f)return;
    const cards=modal.querySelectorAll('.forge-v2-card');
    cards.forEach(card=>{
      const button=card.querySelector('[data-forge-v2]');if(!button)return;
      const type=button.dataset.forgeV2;
      const level=f[type]||0;
      if(level>=5)return;
      const t=TIERS[level];
      const tierEl=card.querySelector('.forge-v2-tier');
      if(tierEl)tierEl.innerHTML=`<b>Tier ${t.tier}</b><span>${Math.round(t.chance*100)}% de sucesso</span>`;
      const infos=card.querySelectorAll('.forge-v2-info b');
      if(infos[0])infos[0].textContent=fmt(t.cost);
      if(infos[1])infos[1].textContent=t.cores;
      const p=card.querySelector('p');
      if(p)p.innerHTML=type==='weapon'?`Próximo tier: <b>upgrade de combate</b>. Tentativa de ${t.tier}º tier.`:`Próximo tier: <b>upgrade defensivo</b>. Tentativa de ${t.tier}º tier.`;
    });
    const material=modal.querySelector('.forge-v2-material b');if(material)material.textContent=`◆ ${fmt(f.cores)} Núcleos da Forja`;
    const power=modal.querySelector('.forge-v2-power');
    if(power)power.dataset.balance='1';
  }

  function attempt(modal,type){
    const f=getForge();if(!f||!f.unlocked)return;
    const level=f[type]||0;if(level>=5)return;
    const t=TIERS[level];
    if(Number(game.gold||0)<t.cost){result(modal,`Gold insuficiente. Precisa de ${fmt(t.cost)} Gold.`,false);return}
    if(Number(f.cores||0)<t.cores){result(modal,`Núcleos insuficientes. Precisa de ${t.cores}.`,false);return}
    game.gold-=t.cost;f.cores-=t.cores;
    const success=Math.random()<t.chance;
    if(success){
      f[type]=level+1;
      result(modal,`FORJA BEM-SUCEDIDA — ${type==='weapon'?'Arma':'Armadura'} agora está no Tier ${level+1}.`,true);
    }else{
      result(modal,`FORJA FALHOU — você perdeu ${fmt(t.cost)} Gold e ${t.cores} Núcleos. O Tier permanece intacto.`,false);
    }
    if(typeof persist==='function')persist();
    refresh(modal);
    if(typeof window.renderAll==='function')window.renderAll();
  }

  function watch(){
    const modal=document.getElementById('arenaForgeV2Modal');if(!modal)return;
    refresh(modal);
    if(modal.dataset.balanceBound==='1')return;
    modal.dataset.balanceBound='1';
    modal.addEventListener('click',e=>{
      const btn=e.target.closest('.forge-v2-action[data-forge-v2]');
      if(!btn)return;
      e.preventDefault();e.stopImmediatePropagation();
      attempt(modal,btn.dataset.forgeV2);
    },true);
  }

  const obs=new MutationObserver(watch);obs.observe(document.body,{childList:true,subtree:true});
  const timer=setInterval(watch,300);setTimeout(()=>clearInterval(timer),120000);watch();
})();
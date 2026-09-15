// UI-only Arena fixes: account header, clean combat view and skill-training visibility.
(()=>{
  if(window.__arenaUiFix)return;
  window.__arenaUiFix=true;

  const setAccountLabel=async()=>{
    const el=document.getElementById('playerName');
    if(!el)return false;
    el.textContent='Faça login para jogar';
    const supabase=window.malUpadosSupabase;
    if(!supabase?.auth)return false;
    try{
      const {data}=await supabase.auth.getUser();
      const user=data?.user;
      if(!user){el.textContent='Faça login para jogar';return true}
      const username=String(user.user_metadata?.username||'').trim();
      el.textContent=username||'Escolha seu nome';
      return true;
    }catch{
      el.textContent='Faça login para jogar';
      return true;
    }
  };

  const setHeaderLabel=()=>{
    const eyebrow=document.querySelector('.game-topbar>div:first-child .eyebrow');
    if(eyebrow)eyebrow.textContent='Sua conta';
  };

  const applyView=(view,activeTarget)=>{
    const main=document.querySelector('main');
    if(!main)return;
    main.classList.remove('arena-view-combat','arena-view-shop','arena-view-daily','arena-view-progress','arena-view-ranking','arena-view-forge');
    main.classList.add(`arena-view-${view}`);
    const nav=document.getElementById('arenaSubnav');
    nav?.querySelectorAll('button[data-target]').forEach(b=>b.classList.toggle('active',b.dataset.target===activeTarget));
  };

  const ensureSkillTraining=()=>{
    const panel=document.querySelector('.character-panel');
    if(!panel)return false;
    if(document.getElementById('skillTrainBtn'))return true;
    const existing=document.querySelector('script[data-arena-skill-retry]');
    if(existing)return false;
    const s=document.createElement('script');
    s.src='arena-skills.js?v=skills-20260915';
    s.setAttribute('data-arena-skill-retry','1');
    document.body.appendChild(s);
    return false;
  };

  const bindNav=()=>{
    const nav=document.getElementById('arenaSubnav');
    if(!nav)return false;
    if(nav.dataset.uiFixBound==='1')return true;
    nav.dataset.uiFixBound='1';
    const views={arenaCombatSection:'combat',arenaActivitiesSection:'daily',arenaShopSection:'shop',arenaProgressSection:'progress',arenaRankingSection:'ranking',arenaForgeSection:'forge'};
    nav.querySelectorAll('button[data-target]').forEach(btn=>{
      const target=btn.dataset.target;
      if(target==='arenaMap'||!views[target])return;
      btn.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();applyView(views[target],target)},true);
    });
    applyView('combat','arenaCombatSection');
    return true;
  };

  const init=()=>{
    setHeaderLabel();setAccountLabel();
    window.addEventListener('mal-auth-changed',()=>setAccountLabel());
    window.malUpadosSupabase?.auth?.onAuthStateChange?.(()=>setTimeout(setAccountLabel,0));
    let tries=0;
    const timer=setInterval(()=>{
      tries++;setHeaderLabel();const navReady=bindNav();setAccountLabel();
      if(navReady&&!document.getElementById('skillTrainBtn'))ensureSkillTraining();
      if(navReady&&document.getElementById('skillTrainBtn'))clearInterval(timer);
      if(tries>120)clearInterval(timer);
    },100);
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();

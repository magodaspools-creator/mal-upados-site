// Arena submenu controller: one owner for normal tabs; Map stays specialized and Forge/Abyssal are tabs.
(()=>{
  if(window.__arenaUiFixV9)return;
  window.__arenaUiFixV9=true;

  const VIEW_CLASSES=[
    'arena-view-combat','arena-view-shop','arena-view-daily',
    'arena-view-progress','arena-view-ranking','arena-view-forge','arena-view-abyssal'
  ];
  const CLASS_MAP={
    arenaCombatSection:'arena-view-combat',
    arenaShopSection:'arena-view-shop',
    arenaActivitiesSection:'arena-view-daily',
    arenaProgressSection:'arena-view-progress',
    arenaRankingSection:'arena-view-ranking',
    arenaForgeSection:'arena-view-forge',
    abyssalGardens:'arena-view-abyssal'
  };

  function ensureIds(){
    const shell=document.querySelector('.game-shell');
    const shop=document.querySelector('.shop-section:not(.boss-token-shop)')||document.getElementById('arenaShopSection');
    const acts=document.querySelector('.activities');
    const prog=document.querySelector('.progress-section');
    const rank=document.querySelector('.arena-ranking');
    const forge=document.querySelector('.forge-section')||document.getElementById('arenaForgeSection');
    const abyssal=document.getElementById('abyssalGardens');
    if(shell)shell.id='arenaCombatSection';
    if(shop)shop.id='arenaShopSection';
    if(acts)acts.id='arenaActivitiesSection';
    if(prog)prog.id='arenaProgressSection';
    if(rank)rank.id='arenaRankingSection';
    if(forge)forge.id='arenaForgeSection';
    return {shell,shop,acts,prog,rank,forge,abyssal};
  }

  function ensureAbyssalButton(){
    const nav=document.getElementById('arenaSubnav');
    if(!nav||nav.querySelector('[data-target="abyssalGardens"]'))return;
    const btn=document.createElement('button');
    btn.type='button';
    btn.dataset.target='abyssalGardens';
    btn.textContent='☠ Abyssal Gardens';
    const ranking=nav.querySelector('[data-target="arenaRankingSection"]');
    if(ranking)nav.insertBefore(btn,ranking);
    else nav.appendChild(btn);
  }

  function setActiveButton(target){
    document.querySelectorAll('#arenaSubnav button[data-target]').forEach(btn=>{
      btn.classList.toggle('active',btn.dataset.target===target);
    });
  }

  function setView(target){
    const main=document.querySelector('main');
    const next=CLASS_MAP[target];
    if(!main||!next)return false;
    main.classList.remove(...VIEW_CLASSES);
    main.classList.add(next);
    main.dataset.arenaView=next;
    setActiveButton(target);
    return true;
  }

  function refresh(target){
    if(target==='arenaShopSection'&&typeof window.shopRender==='function'){
      try{window.shopRender()}catch(e){console.error('[Arena] shopRender',e)}
    }
    if(target==='arenaActivitiesSection'&&typeof window.renderArenaActivities==='function'){
      try{window.renderArenaActivities()}catch(e){console.error('[Arena] renderArenaActivities',e)}
    }
    if(target==='arenaForgeSection'&&window.arenaForgeV2?.render){
      try{window.arenaForgeV2.render()}catch(e){console.error('[Arena] forgeRender',e)}
    }
    if(target==='abyssalGardens'&&window.arenaDungeon?.render){
      try{window.arenaDungeon.render()}catch(e){console.error('[Arena] abyssalRender',e)}
    }
    if(typeof window.arenaSkillRender==='function'){
      try{window.arenaSkillRender()}catch(e){console.error('[Arena] arenaSkillRender',e)}
    }
  }

  function activate(target){
    ensureIds();
    ensureAbyssalButton();
    if(!setView(target))return false;
    refresh(target);
    return true;
  }

  function closeOverlays(){
    const characterModal=document.getElementById('arenaCharacterCreateModal');
    if(characterModal){
      if(typeof window.arenaCloseCharacterCreator==='function')return window.arenaCloseCharacterCreator();
      characterModal.remove();
      return true;
    }
    const ids=['arenaWorldModal','arenaMapModal','arenaForgeModal','arenaAccountModal'];
    for(const id of ids){
      const el=document.getElementById(id);
      if(el){el.remove();return true;}
    }
    return false;
  }

  function ensureCharacterCloseButton(){
    const modal=document.getElementById('arenaCharacterCreateModal');
    const box=modal?.querySelector('.arena-char-window');
    if(!box||box.querySelector('#arenaCharClose'))return;
    const close=document.createElement('button');
    close.type='button';
    close.id='arenaCharClose';
    close.className='arena-char-btn';
    close.textContent='✕ FECHAR';
    box.style.position='relative';
    close.style.cssText='position:absolute;right:18px;top:18px;z-index:2;margin:0;';
    close.onclick=e=>{e.preventDefault();e.stopPropagation();if(typeof window.arenaCloseCharacterCreator==='function')window.arenaCloseCharacterCreator();else modal.remove()};
    box.insertBefore(close,box.firstChild);
  }

  function prepareAccountV2(target){
    const body=document.getElementById('arenaAccountBody');
    if(!body)return;
    body.classList.add('arena-account-v2-pending');
    setTimeout(()=>{
      try{
        if(target==='achievements'&&typeof window.arenaAchievementsV2?.render==='function'){
          window.arenaAchievementsV2.render();
        }
        if(target==='ranking'&&typeof window.arenaRankingV2?.render==='function'){
          Promise.resolve(window.arenaRankingV2.render()).catch(()=>{});
        }
      }catch(e){}
      setTimeout(()=>body.classList.remove('arena-account-v2-pending','rank-v2-pending'),250);
      setTimeout(()=>body.classList.remove('arena-account-v2-pending','rank-v2-pending'),8000);
    },0);
  }

  function installModalSafety(){
    if(window.__arenaUiModalSafety)return;
    window.__arenaUiModalSafety=true;
    const style=document.createElement('style');
    style.id='arenaUiModalSafetyStyle';
    style.textContent='.arena-account-v2-pending{visibility:hidden!important}.arena-char-window{position:relative}.arena-char-window>#arenaCharClose{position:absolute!important;right:18px!important;top:18px!important;margin:0!important}';
    document.head.appendChild(style);
    document.addEventListener('keydown',event=>{
      if(event.key!=='Escape')return;
      if(closeOverlays()){
        event.preventDefault();
        event.stopPropagation();
      }
    },true);
    const observer=new MutationObserver(()=>ensureCharacterCloseButton());
    if(document.body)observer.observe(document.body,{childList:true,subtree:true});
    ensureCharacterCloseButton();
  }

  function bind(){
    if(window.__arenaUiFixNavCapture)return;
    window.__arenaUiFixNavCapture=true;
    document.addEventListener('click',event=>{
      const btn=event.target.closest?.('#arenaSubnav button[data-target]');
      if(btn){
        const target=btn.dataset.target;
        if(target!=='arenaMap'&&CLASS_MAP[target]){
          event.preventDefault();
          event.stopPropagation();
          event.stopImmediatePropagation();
          activate(target);
          return;
        }
      }
      const accountBtn=event.target.closest?.('#arenaAccountTools button[data-account],[data-tab="achievements"],[data-tab="ranking"]');
      if(accountBtn){
        const target=accountBtn.dataset.account||accountBtn.dataset.tab;
        if(target==='achievements'||target==='ranking')prepareAccountV2(target);
      }
    },true);
  }

  function init(){
    ensureIds();
    installModalSafety();
    bind();
    ensureAbyssalButton();
    activate('arenaCombatSection');
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();

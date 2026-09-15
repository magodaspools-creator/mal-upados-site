(()=>{
  if(window.__arenaCharacterSyncFix)return;
  window.__arenaCharacterSyncFix=true;

  const install=()=>{
    if(typeof syncCharacters!=='function')return false;
    window.arenaSyncCharacters=(preferredName=null)=>syncCharacters(preferredName);
    window.addEventListener('arena-character-created',event=>{
      const name=event.detail?.character?.name||null;
      setTimeout(()=>syncCharacters(name),0);
    });
    window.malUpadosSupabase?.auth?.onAuthStateChange?.((event)=>{
      if(event==='SIGNED_IN')setTimeout(()=>syncCharacters(),50);
    });
    return true;
  };

  if(install())return;
  let tries=0;
  const timer=setInterval(()=>{
    tries++;
    if(install()||tries>100)clearInterval(timer);
  },100);
})();

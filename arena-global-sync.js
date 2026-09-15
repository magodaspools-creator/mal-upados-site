(()=>{
  if(window.__arenaGlobalSync)return;
  window.__arenaGlobalSync=true;

  let timer=null;
  let originalPersist=null;

  const saveServer=async()=>{
    const supabase=window.malUpadosSupabase;
    if(!supabase?.auth||typeof game==='undefined'||!game)return;
    const {data:{user}}=await supabase.auth.getUser();
    if(!user)return;
    const character=Array.isArray(window.members)?window.members.find(m=>m.name===game.character):null;
    const characterId=character?.characterId;
    if(!characterId)return;

    const state={...game};
    const {error}=await supabase
      .from('arena_characters')
      .update({game_state:state,updated_at:new Date().toISOString()})
      .eq('id',characterId)
      .eq('user_id',user.id);

    if(error)console.warn('Arena global save:',error.message);
  };

  const install=()=>{
    if(typeof window.persist!=='function')return false;
    if(window.persist.__arenaGlobalWrapped)return true;
    originalPersist=window.persist;
    const wrapped=function(){
      const result=originalPersist.apply(this,arguments);
      clearTimeout(timer);
      timer=setTimeout(saveServer,250);
      return result;
    };
    wrapped.__arenaGlobalWrapped=true;
    window.persist=wrapped;
    window.arenaSaveGlobal=saveServer;
    setTimeout(saveServer,500);
    return true;
  };

  let tries=0;
  const timerInstall=setInterval(()=>{
    tries++;
    if(install()||tries>120)clearInterval(timerInstall);
  },100);

  window.addEventListener('mal-auth-changed',()=>setTimeout(()=>{
    install();
    saveServer();
  },100));
})();

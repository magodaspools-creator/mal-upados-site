(()=>{
  if(window.__arenaAuthLoaded)return;
  window.__arenaAuthLoaded=true;
  const SUPABASE_URL='https://qnfqeprgvmyapgagmcqf.supabase.co';
  const SUPABASE_KEY='sb_publishable_RmJoMDzSSqC46U1nNZR1XA_--7pm3y8';
  const STORAGE='malupados_arena_v1';
  const TABLE='arena_player_progress';
  const CDN='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
  window.__arenaAuthReady=new Promise(async resolve=>{
    try{
      const mod=await import(CDN);
      const supabase=window.malUpadosSupabase||mod.createClient(SUPABASE_URL,SUPABASE_KEY);
      window.arenaSupabase=supabase;
      let syncing=false;
      const localState=()=>{try{return JSON.parse(localStorage.getItem(STORAGE)||'{}')}catch{return {}}};
      const setLocalState=state=>localStorage.setItem(STORAGE,JSON.stringify(state||{}));
      const hasState=state=>state&&typeof state==='object'&&Object.keys(state).length>0;
      async function pullOrMigrate(user){
        const {data,error}=await supabase.from(TABLE).select('game_state').eq('user_id',user.id).maybeSingle();
        if(error){console.error('Arena cloud load:',error);return false}
        const local=localState();
        if(data?.game_state&&hasState(data.game_state)){setLocalState(data.game_state);return true}
        if(hasState(local)){const {error:upsertError}=await supabase.from(TABLE).upsert({user_id:user.id,game_state:local},{onConflict:'user_id'});if(upsertError)console.error('Arena migration:',upsertError)}
        return true;
      }
      async function push(){
        const user=(await supabase.auth.getUser()).data.user;if(!user||syncing)return;
        syncing=true;try{const state=localState();const {error}=await supabase.from(TABLE).upsert({user_id:user.id,game_state:state},{onConflict:'user_id'});if(error)console.error('Arena cloud save:',error);else window.__arenaLastCloudState=JSON.stringify(state)}finally{syncing=false}
      }
      const session=(await supabase.auth.getSession()).data.session;
      if(session?.user)await pullOrMigrate(session.user);
      resolve(true);
      setInterval(async()=>{const user=(await supabase.auth.getUser()).data.user;if(!user)return;const state=localState(),serialized=JSON.stringify(state);if(serialized!==window.__arenaLastCloudState)await push()},4000);
    }catch(e){console.error('Arena auth bootstrap:',e);resolve(false)}
  });
})();

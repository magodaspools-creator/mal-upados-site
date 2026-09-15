(()=>{
  if(window.__arenaCharacterSyncFix)return;
  window.__arenaCharacterSyncFix=true;

  const getClient=()=>window.malUpadosSupabase;
  const sync=async(preferredName=null)=>{
    const supabase=getClient();
    if(!supabase?.auth)return false;
    const {data:{user}}=await supabase.auth.getUser();
    if(!user)return false;

    const {data,error}=await supabase
      .from('arena_characters')
      .select('id,name,gender,vocation,game_state')
      .eq('user_id',user.id)
      .order('created_at',{ascending:true});

    if(error){
      console.error('Arena characters:',error);
      return false;
    }

    if(!data?.length){
      window.arenaOpenCharacterCreator?.();
      return true;
    }

    if(typeof members==='undefined'||!Array.isArray(members))return false;
    members.length=0;
    members.push(...data.map(c=>({name:c.name,vocation:c.vocation,gender:c.gender,characterId:c.id})));

    let all={};
    try{all=JSON.parse(localStorage.getItem('malupados_arena_v1')||'{}')}catch{}

    const fallback=data[0].name;
    const current=preferredName&&data.some(c=>c.name===preferredName)
      ?preferredName
      :(game?.character&&data.some(c=>c.name===game.character)?game.character:fallback);

    if(typeof loadGame==='function')loadGame(current);

    const record=data.find(c=>c.name===current);
    const server=record?.game_state;
    if(server&&typeof server==='object'&&typeof game!=='undefined'){
      const local=all[current];
      const serverLevel=Number(server.level||1);
      const localLevel=Number(local?.level||1);

      // Nunca sobrescreva um estado local do mesmo Level: o servidor pode estar
      // alguns segundos atrasado e isso podia apagar gold, kills, XP ou equipamento.
      // O estado remoto só assume o controle quando realmente está à frente.
      if(!local||localLevel<serverLevel){
        game={...game,...server,character:current,gender:server.gender||record?.gender,vocation:server.vocation||record?.vocation};
        if(typeof persist==='function')persist();
      }else{
        game={...game,character:current,gender:game.gender||record?.gender,vocation:game.vocation||record?.vocation};
      }
    }

    if(typeof window.__arenaCharacterDraw==='function')window.__arenaCharacterDraw();
    if(typeof renderAll==='function')renderAll();
    return true;
  };

  window.arenaSyncCharacters=sync;

  const resync=()=>setTimeout(()=>sync(),100);
  window.addEventListener('arena-character-created',event=>{
    const name=event.detail?.character?.name||null;
    setTimeout(()=>sync(name),0);
  });
  window.addEventListener('mal-auth-changed',resync);

  let tries=0;
  const timer=setInterval(()=>{
    tries++;
    if(window.malUpadosSupabase?.auth){
      window.malUpadosSupabase.auth.onAuthStateChange?.((event)=>{
        if(event==='SIGNED_IN')setTimeout(()=>sync(),50);
      });
      clearInterval(timer);
    }else if(tries>100){
      clearInterval(timer);
    }
  },100);
})();

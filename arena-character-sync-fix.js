(()=>{
  if(window.__arenaCharacterSyncFix)return;
  window.__arenaCharacterSyncFix=true;

  const getClient=()=>window.malUpadosSupabase;
  // Mantém o personagem explicitamente escolhido/criado como prioridade.
  // Isso evita uma sincronização antiga de inicialização devolver o personagem anterior.
  let activeCharacterName=null;
  let syncGeneration=0;
  const sync=async(preferredName=null)=>{
    if(preferredName)activeCharacterName=preferredName;
    const generation=++syncGeneration;
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
    const requestedName=activeCharacterName||preferredName||null;
    const current=requestedName&&data.some(c=>c.name===requestedName)
      ?requestedName
      :(game?.character&&data.some(c=>c.name===game.character)?game.character:fallback);

    // Se outra sincronização mais recente já escolheu um personagem, esta
    // resposta antiga não pode sobrescrevê-lo.
    if(generation!==syncGeneration)return false;

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

        // Mesmo no mesmo Level, uma skill de teste/treino pode ter sido
        // alterada no servidor. Não deixe o estado local padrão (ex.: skill 10)
        // apagar uma skill maior salva no personagem.
        const serverSkills=server?.skills&&typeof server.skills==='object'?server.skills:null;
        const localSkills=game?.skills&&typeof game.skills==='object'?game.skills:null;
        if(serverSkills&&localSkills){
          const vocationField=({Knight:'melee',Paladin:'distance',Sorcerer:'magic',Druid:'magic',Monk:'fist'})[record?.vocation]||'melee';
          const remoteSkill=Number(serverSkills[vocationField]);
          const localSkill=Number(localSkills[vocationField]);
          if(Number.isFinite(remoteSkill)&&(!Number.isFinite(localSkill)||remoteSkill>localSkill)){
            game.skills={...localSkills,...serverSkills};
            if(typeof persist==='function')persist();
          }
        }
      }
    }

    if(typeof window.__arenaCharacterDraw==='function')window.__arenaCharacterDraw();
    if(typeof renderAll==='function')renderAll();
    // Ao entrar com um personagem já existente, renderAll() desenha o mapa,
    // mas não abre a área selecionada. Garanta que a primeira área liberada
    // também seja carregada no painel de combate.
    if(typeof showZone==='function'&&typeof game!=='undefined'&&game){
      setTimeout(()=>showZone(game.zone),0);
    }
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

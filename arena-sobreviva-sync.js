(()=>{
  if(window.__arenaSobrevivaSync)return;
  window.__arenaSobrevivaSync=true;

  const STORAGE='malupados_arena_v1';
  const DEFAULT={
    character:'Aventureiro',level:1,xp:0,gold:0,wins:0,kills:0,damage:0,
    zone:0,weapon:0,armor:0,bestStreak:0,streak:0,lastChallenge:'',
    challengeProgress:0,challengeIndex:0,gender:'male',vocation:'Knight',
    arenaMode:{bestWave:0,runs:0,wins:0,arenaXp:0}
  };

  let members=[];
  let currentRecord=null;
  let currentUser=null;
  let saveTimer=null;
  let loading=false;

  // Mantemos um objeto global compatível com arena-game-mode.js.
  let game={...DEFAULT,arenaMode:{...DEFAULT.arenaMode}};
  // arena-game-mode.js espera o estado do personagem em uma variável global.
  // O sync mantém a fonte real dos dados, mas expõe a referência para o modo Sobreviva.
  window.game=game;
  window.arenaSurviveReady=false;

  const clone=v=>JSON.parse(JSON.stringify(v));
  const num=v=>Math.max(0,Number(v)||0);
  const fmt=n=>new Intl.NumberFormat('pt-BR').format(Math.floor(num(n)));

  function mergedState(record){
    const server=record?.game_state&&typeof record.game_state==='object'?record.game_state:{};
    const next={...DEFAULT,...server,character:record?.name||server.character||DEFAULT.character};
    next.gender=record?.gender||server.gender||DEFAULT.gender;
    next.vocation=record?.vocation||server.vocation||DEFAULT.vocation;
    next.arenaMode={...DEFAULT.arenaMode,...(server.arenaMode||{})};
    return next;
  }

  function renderAll(){
    const select=document.getElementById('surviveCharacterSelect');
    const stats=document.getElementById('surviveCharacterStats');
    if(select&&currentRecord){
      select.value=currentRecord.name;
      select.disabled=loading;
    }
    if(stats){
      if(currentRecord){
        stats.textContent='Level '+num(game.level)+' · Gold '+fmt(game.gold)+' · Recorde '+num(game.arenaMode?.bestWave);
      }else if(currentUser){
        stats.textContent='Nenhum personagem encontrado na Arena.';
      }else{
        stats.textContent='Faça login para carregar seus personagens da Arena.';
      }
    }
    const best=document.getElementById('arenaBestWave');
    if(best)best.textContent=fmt(game.arenaMode?.bestWave);
  }

  function cache(){
    try{
      const all=JSON.parse(localStorage.getItem(STORAGE)||'{}');
      if(game?.character)all[game.character]=clone(game);
      localStorage.setItem(STORAGE,JSON.stringify(all));
    }catch(e){}
  }

  async function saveServer(){
    if(!currentUser||!currentRecord)return;
    const supabase=window.malUpadosSupabase;
    if(!supabase)return;
    const state=clone(game);
    const {error}=await supabase
      .from('arena_characters')
      .update({game_state:state})
      .eq('id',currentRecord.id)
      .eq('user_id',currentUser.id);
    if(error)console.warn('[Sobreviva] erro ao salvar personagem:',error.message);
  }

  function persist(){
    cache();
    clearTimeout(saveTimer);
    saveTimer=setTimeout(saveServer,250);
    renderAll();
  }

  async function selectCharacter(name){
    const record=members.find(x=>x.name===name);
    if(!record)return;
    const running=document.getElementById('arenaGameRun')?.classList.contains('active');
    if(running){
      const select=document.getElementById('surviveCharacterSelect');
      if(select)select.value=currentRecord?.name||'';
      return;
    }
    currentRecord=record;
    game=mergedState(record);
    window.game=game;
    cache();
    renderAll();
    if(typeof window.arenaSurviveCharacterChanged==='function')window.arenaSurviveCharacterChanged();
  }

  function renderCharacters(){
    const select=document.getElementById('surviveCharacterSelect');
    if(!select)return;
    select.innerHTML='';
    members.forEach(m=>{
      const opt=document.createElement('option');
      opt.value=m.name;
      opt.textContent=m.name+' · '+(m.vocation||'Aventureiro');
      select.appendChild(opt);
    });
    select.disabled=false;
    select.onchange=()=>selectCharacter(select.value);
    if(currentRecord)select.value=currentRecord.name;
  }

  async function loadCharacters(){
    if(loading)return;
    loading=true;
    renderAll();

    let tries=0;
    while(!window.malUpadosSupabase?.auth&&tries<100){
      await new Promise(r=>setTimeout(r,100));
      tries++;
    }

    const supabase=window.malUpadosSupabase;
    if(!supabase?.auth){
      loading=false;
      renderAll();
      return;
    }

    const {data:{user},error:userError}=await supabase.auth.getUser();
    if(userError||!user){
      currentUser=null;
      currentRecord=null;
      loading=false;
      renderAll();
      return;
    }

    currentUser=user;
    const {data,error}=await supabase
      .from('arena_characters')
      .select('id,name,gender,vocation,game_state')
      .eq('user_id',user.id)
      .order('created_at',{ascending:true});

    if(error){
      console.error('[Sobreviva] personagens da Arena:',error);
      members=[];
      currentRecord=null;
      loading=false;
      renderAll();
      return;
    }

    members=(data||[]).map(c=>({
      id:c.id,name:c.name,gender:c.gender,vocation:c.vocation,game_state:c.game_state||{}
    }));

    if(members.length){
      const preferred=currentRecord?.name&&members.some(x=>x.name===currentRecord.name)
        ?currentRecord.name
        :members[0].name;
      currentRecord=members.find(x=>x.name===preferred)||members[0];
      game=mergedState(currentRecord);
      window.game=game;
      cache();
      renderCharacters();
    }else{
      currentRecord=null;
    }

    loading=false;
    window.arenaSurviveReady=Boolean(currentRecord);
    renderAll();
  }

  window.persist=persist;
  window.renderAll=renderAll;
  window.loadGame=async name=>selectCharacter(name);
  window.arenaSurviveMembers=()=>members;
  window.arenaSurviveCurrent=()=>currentRecord;

  window.arenaSurviveCharacterChanged=()=>{
    const best=document.getElementById('arenaBestWave');
    if(best)best.textContent=fmt(game.arenaMode?.bestWave);
  };

  window.addEventListener('mal-auth-changed',()=>setTimeout(loadCharacters,100));

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',loadCharacters,{once:true});
  }else{
    loadCharacters();
  }
})();
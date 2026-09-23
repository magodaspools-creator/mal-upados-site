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
    const picker=document.getElementById('surviveCharacterPicker');
    const pickerBtn=document.getElementById('surviveCharacterPickerBtn');
    const pickerName=document.getElementById('surviveCharacterPickerName');
    if(select){
      select.value=currentRecord?.name||'';
      select.disabled=loading;
    }
    if(pickerBtn){
      pickerBtn.disabled=loading||!members.length;
      pickerBtn.setAttribute('aria-expanded',picker?.classList.contains('open')?'true':'false');
    }
    if(pickerName){
      pickerName.textContent=currentRecord?.name||(
        loading?'Carregando personagens...':
        currentUser?'Nenhum personagem encontrado':
        'Faça login para carregar'
      );
    }
    if(picker){
      picker.querySelectorAll('.survive-character-picker-option').forEach(option=>{
        option.classList.toggle('selected',option.dataset.name===currentRecord?.name);
      });
    }
    const stats=document.getElementById('surviveCharacterStats');
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

  function closeCharacterPicker(){
    const picker=document.getElementById('surviveCharacterPicker');
    const btn=document.getElementById('surviveCharacterPickerBtn');
    if(!picker)return;
    picker.classList.remove('open');
    const menu=document.getElementById('surviveCharacterPickerMenu');
    if(menu)menu.hidden=true;
    if(btn)btn.setAttribute('aria-expanded','false');
  }

  function openCharacterPicker(){
    const picker=document.getElementById('surviveCharacterPicker');
    const btn=document.getElementById('surviveCharacterPickerBtn');
    const menu=document.getElementById('surviveCharacterPickerMenu');
    if(!picker||!btn||!menu||btn.disabled)return;
    const open=!picker.classList.contains('open');
    picker.classList.toggle('open',open);
    menu.hidden=!open;
    btn.setAttribute('aria-expanded',open?'true':'false');
  }

  function bindCharacterPicker(){
    const btn=document.getElementById('surviveCharacterPickerBtn');
    const menu=document.getElementById('surviveCharacterPickerMenu');
    if(!btn||!menu||btn.dataset.bound)return;
    btn.dataset.bound='1';
    btn.addEventListener('click',event=>{
      event.stopPropagation();
      openCharacterPicker();
    });
    menu.addEventListener('click',event=>{
      const option=event.target.closest('.survive-character-picker-option');
      if(!option)return;
      event.stopPropagation();
      closeCharacterPicker();
      selectCharacter(option.dataset.name);
    });
    document.addEventListener('click',event=>{
      const picker=document.getElementById('surviveCharacterPicker');
      if(picker&&!picker.contains(event.target))closeCharacterPicker();
    });
  }

  function renderCharacters(){
    const select=document.getElementById('surviveCharacterSelect');
    const menu=document.getElementById('surviveCharacterPickerMenu');
    if(!select||!menu)return;
    select.innerHTML='';
    menu.innerHTML='';
    members.forEach(m=>{
      const opt=document.createElement('option');
      opt.value=m.name;
      opt.textContent=m.name+' · '+(m.vocation||'Aventureiro');
      select.appendChild(opt);

      const option=document.createElement('button');
      option.type='button';
      option.className='survive-character-picker-option';
      option.dataset.name=m.name;
      option.setAttribute('role','option');
      option.textContent=m.name+' · '+(m.vocation||'Aventureiro');
      option.setAttribute('aria-selected',m.name===currentRecord?.name?'true':'false');
      menu.appendChild(option);
    });
    select.disabled=false;
    if(currentRecord)select.value=currentRecord.name;
    bindCharacterPicker();
    renderAll();
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
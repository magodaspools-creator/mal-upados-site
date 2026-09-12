// Sincronização automática da Arena com o ranking global Supabase.
(()=>{
  const SUPABASE_URL='https://tylyfkwfoqwsnrotmvzt.supabase.co';
  const FUNCTION_URL=SUPABASE_URL+'/functions/v1/arena-sync-ranking';
  const PUBLISHABLE_KEY='sb_publishable_SGwpPSRttuKAAI4pm2xi5g_Bd3mW95F';
  const INTERVAL=30000;
  let lastSignature='';
  let timer=null;
  let busy=false;

  const num=v=>Math.max(0,Number(v)||0);
  const completedBestiary=g=>{
    const names=['Rat','Troll','Orc','Orc Berserker','Orc Rider','Cyclops','Scorpion','Ancient Scarab','Dragon Hatchling','Dragon','Dragon Lord','Frost Dragon','Demon Skeleton','Hellhound','Demon','Deathbringer'];
    return names.filter(n=>num(g?.bestiary?.[n]?.kills??g?.bestiary?.[n]) >= (n==='Deathbringer'?5:25)).length;
  };
  const completedAchievements=g=>{
    const a=g?.achievementsV2;
    return a&&typeof a==='object'?Object.values(a).filter(x=>x&&x.completed).length:0;
  };
  const bossCount=g=>Math.floor(num(g?.bossKills??g?.bossesDefeated));

  function payload(){
    if(typeof game==='undefined'||!game?.character)return null;
    const g=game;
    const bestiary=Object.entries(g.bestiary||{}).map(([creature,v])=>({
      creature_name:creature,
      kills:Math.floor(num(v?.kills??v)),
      completed:num(v?.kills??v)>=(creature==='Deathbringer'?5:25)
    }));
    const player={
      character_name:String(g.character).trim(),
      vocation:String(g.vocation||'Aventureiro'),
      level:Math.floor(num(g.level)||1),
      xp:Math.floor(num(g.xp)),
      kills:Math.floor(num(g.kills)),
      wins:Math.floor(num(g.wins)),
      deaths:Math.floor(num(g.deaths)),
      best_streak:Math.floor(num(g.bestStreak)),
      gold:Math.floor(num(g.gold)),
      damage:Math.floor(num(g.damage)),
      bestiary_completed:completedBestiary(g),
      achievements_completed:completedAchievements(g),
      bosses_defeated:bossCount(g)
    };
    return {player,bestiary};
  }

  async function sync(force=false){
    if(busy||typeof game==='undefined'||!game?.character)return false;
    const data=payload();if(!data)return false;
    const signature=JSON.stringify(data);
    if(!force&&signature===lastSignature)return true;
    busy=true;
    try{
      const res=await fetch(FUNCTION_URL,{method:'POST',headers:{'Content-Type':'application/json','apikey':PUBLISHABLE_KEY,'Authorization':'Bearer '+PUBLISHABLE_KEY},body:JSON.stringify(data),keepalive:true});
      if(!res.ok)throw new Error('HTTP '+res.status);
      const result=await res.json();
      if(result?.ok)lastSignature=signature;
      window.dispatchEvent(new CustomEvent('arena:supabase-sync',{detail:{ok:!!result?.ok,character:data.player.character_name}}));
      return !!result?.ok;
    }catch(error){
      console.warn('[Arena] sincronização Supabase falhou:',error);
      return false;
    }finally{busy=false}
  }

  function start(){
    if(timer)clearInterval(timer);
    sync(true);
    timer=setInterval(()=>sync(false),INTERVAL);
    window.addEventListener('beforeunload',()=>{try{sync(false)}catch{}});
  }

  window.arenaSupabaseSync={sync,start,payload};
  const boot=()=>setTimeout(start,2500);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();

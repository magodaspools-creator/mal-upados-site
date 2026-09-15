(()=>{
  if(window.__arenaBugfixes20260915)return;
  window.__arenaBugfixes20260915=true;

  const CHALLENGE_BUCKETS='malupados_arena_challenge_buckets_v2';
  let lastCharacter='';
  let lastDay='';
  let bestiaryObserver=null;

  const day=()=>{
    const d=new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  };
  const read=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key)||JSON.stringify(fallback))}catch{return fallback}};
  const write=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value))}catch{}};
  const numericKeys=type=>({
    kills:`malupados_challenge_kills_${day()}`,
    gold:`malupados_challenge_gold_${day()}`,
    wins:`malupados_challenge_wins_${day()}`,
    zone:`malupados_challenge_zone_${day()}`
  })[type];

  function hash(text){
    let h=2166136261;
    for(let i=0;i<text.length;i++){h^=text.charCodeAt(i);h=Math.imul(h,16777619)}
    return h>>>0;
  }

  function dailyChallengeIndex(character){return hash(`${character}|${day()}`)%4;}

  function syncChallengeBucket(character,force=false){
    if(!character)return;
    const today=day();
    const buckets=read(CHALLENGE_BUCKETS,{});
    const previous=lastCharacter&&lastDay===today?buckets[lastCharacter]||{}:null;
    if(previous){['kills','gold','wins','zone'].forEach(type=>previous[type]=Number(localStorage.getItem(numericKeys(type))||0));}
    const bucket=buckets[character]&&buckets[character].day===today?buckets[character]:{day:today,kills:0,gold:0,wins:0,zone:0};
    ['kills','gold','wins','zone'].forEach(type=>{
      if(force||character!==lastCharacter||today!==lastDay)localStorage.setItem(numericKeys(type),String(Number(bucket[type])||0));
    });
    buckets[character]=bucket;
    write(CHALLENGE_BUCKETS,buckets);
    lastCharacter=character;
    lastDay=today;
  }

  function persistChallengeBucket(){
    if(!lastCharacter)return;
    const buckets=read(CHALLENGE_BUCKETS,{});
    const bucket=buckets[lastCharacter]&&buckets[lastCharacter].day===day()?buckets[lastCharacter]:{day:day(),kills:0,gold:0,wins:0,zone:0};
    ['kills','gold','wins','zone'].forEach(type=>bucket[type]=Number(localStorage.getItem(numericKeys(type))||0));
    buckets[lastCharacter]=bucket;
    write(CHALLENGE_BUCKETS,buckets);
  }

  function repairChallenge(){
    if(typeof game==='undefined'||!game||!game.character)return;
    const character=String(game.character);
    const today=day();
    const changed=character!==lastCharacter||today!==lastDay;
    syncChallengeBucket(character,changed);
    const expected=dailyChallengeIndex(character);
    if(Number(game.challengeIndex)!==expected||game.challengeDay!==today){
      game.challengeIndex=expected;
      game.challengeDay=today;
      if(typeof persist==='function')persist();
      if(typeof renderChallenge==='function')renderChallenge();
    }
    if(changed)persistChallengeBucket();
  }

  function bindChallenge(){
    const btn=document.getElementById('challengeBtn');
    if(!btn||btn.dataset.arenaBugfixBound==='1')return;
    btn.dataset.arenaBugfixBound='1';
    btn.addEventListener('click',()=>{
      repairChallenge();
      if(typeof claimChallenge==='function')claimChallenge();
      persistChallengeBucket();
    });
  }

  function repairMap(){
    if(typeof game==='undefined'||!game||typeof ZONES==='undefined')return;
    const maxUnlocked=ZONES.reduce((max,z,i)=>game.level>=Number(z.min)?i:max,-1);
    if(maxUnlocked<0)return;
    if(!Number.isInteger(game.manualZone)||game.manualZone<0||game.manualZone>maxUnlocked){
      game.manualZone=Math.min(Math.max(0,Number(game.zone)||0),maxUnlocked);
    }
    if(game.zone!==game.manualZone){
      game.zone=game.manualZone;
      if(typeof persist==='function')persist();
    }
    const map=document.getElementById('map');
    if(map){
      map.querySelectorAll('.zone:not(.locked)').forEach(card=>{
        if(card.dataset.arenaBugfixBound==='1')return;
        card.dataset.arenaBugfixBound='1';
        card.addEventListener('click',()=>{
          const index=Number(card.dataset.zone);
          if(Number.isInteger(index)&&index>=0&&index<=maxUnlocked){
            game.manualZone=index;
            game.zone=index;
            if(typeof persist==='function')persist();
          }
        },true);
      });
    }
    const next=document.getElementById('nextZoneBtn');
    if(next){
      const ni=game.manualZone+1;
      const available=ni<ZONES.length&&game.level>=Number(ZONES[ni].min);
      next.disabled=!available;
      next.textContent=available?`Próxima área → ${ZONES[ni].name}`:'Próxima área bloqueada';
      next.onclick=()=>{
        if(!available)return;
        game.manualZone=ni;
        game.zone=ni;
        if(typeof persist==='function')persist();
        if(typeof renderAll==='function')renderAll();
        if(typeof showZone==='function')showZone(ni);
      };
    }
  }

  function repairForgeLifesteal(){
    if(window.__arenaForgeLifestealBugfix)return true;
    if(typeof window.attack!=='function')return false;
    const original=window.attack;
    window.attack=function(...args){
      const b=(typeof battle!=='undefined'&&battle)||window.__arenaBattleRef||null;
      const before=b?Number(b.hp):NaN;
      const result=original.apply(this,args);
      try{
        const ls=b?Number(b.forgeLifesteal)||0:0;
        const after=b?Number(b.hp):NaN;
        if(b&&battle===b&&before>0&&Number.isFinite(after)&&after>0&&ls>0){
          const dealt=Math.max(0,before-after);
          if(dealt>0)b.playerHp=Math.min(Number(b.playerMax)||b.playerHp,b.playerHp+Math.max(1,Math.floor(dealt*ls/100)));
        }
      }catch{}
      return result;
    };
    window.__arenaForgeLifestealBugfix=true;
    return true;
  }

  function repairBestiaryRecording(){
    const area=document.getElementById('battleArea');
    if(!area||bestiaryObserver)return;
    bestiaryObserver=new MutationObserver(()=>{
      const result=area.querySelector('.battle-empty.result h3');
      const text=result?.textContent?.trim()||'';
      if(!result||!/derrotado!/i.test(text))return;
      if(area.dataset.bestiaryResult===text)return;
      area.dataset.bestiaryResult=text;
      const match=text.match(/^(.*?)\s+derrotado!/i);
      const name=match?.[1]?.trim();
      if(name&&typeof window.arenaRecordBestiaryKill==='function')window.arenaRecordBestiaryKill(name);
    });
    bestiaryObserver.observe(area,{childList:true,subtree:true,characterData:true});
  }

  function boot(){
    repairChallenge();
    bindChallenge();
    repairMap();
    repairForgeLifesteal();
    repairBestiaryRecording();
  }

  const observer=new MutationObserver(()=>{
    bindChallenge();
    repairMap();
    repairChallenge();
    repairForgeLifesteal();
    repairBestiaryRecording();
  });
  observer.observe(document.body,{childList:true,subtree:true});

  let tries=0;
  const timer=setInterval(()=>{
    tries++;
    if(typeof game!=='undefined'&&game){boot();if(tries>80)clearInterval(timer)}
    else if(tries>120)clearInterval(timer);
  },250);
})();

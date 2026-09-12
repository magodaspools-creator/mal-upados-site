// Correção de persistência do Bestiário.
// Mantém os registros por personagem e permite contagem infinita após a Platina.
(()=>{
  if(window.__arenaBestiaryCounterFixInstalled)return;
  window.__arenaBestiaryCounterFixInstalled=true;

  const ARENA='malupados_arena_v1';
  const FIX='malupados_bestiary_fix_v1';

  const read=(key, fallback={})=>{try{return JSON.parse(localStorage.getItem(key)||JSON.stringify(fallback))}catch{return fallback}};
  const write=(key,value)=>localStorage.setItem(key,JSON.stringify(value));
  const currentChar=()=>game?.character||document.getElementById('characterPickerName')?.textContent?.trim()||'default';

  function repair(name){
    const char=currentChar();
    if(!char||char==='Escolher personagem')return;

    const shadow=read(FIX,{});
    if(!shadow[char])shadow[char]={};
    const old=Number(shadow[char][name]?.kills||0);
    const next=old+1;
    shadow[char][name]={kills:next};
    write(FIX,shadow);

    const all=read(ARENA,{});
    if(!all[char])all[char]={};
    if(!all[char].bestiary)all[char].bestiary={};

    Object.keys(shadow[char]).forEach(m=>{
      const k=Number(shadow[char][m]?.kills||0);
      all[char].bestiary[m]={kills:k};
    });
    write(ARENA,all);

    const modal=document.getElementById('arenaBestiaryModal');
    if(modal){
      const active=modal.querySelector('.bf-maps button.active');
      if(active)active.click();
    }
  }

  window.addEventListener('arena:bestiary-kill',e=>{
    const name=e.detail?.name;
    if(name)repair(name);
  });
})();

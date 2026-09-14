(()=>{
  if(window.__arenaCharacterCreationUI)return;
  window.__arenaCharacterCreationUI=true;
  function install(){
    const picker=document.getElementById('characterPicker');
    if(!picker||document.getElementById('arenaCreateCharacterBtn'))return;
    const btn=document.createElement('button');
    btn.type='button';btn.id='arenaCreateCharacterBtn';btn.className='arena-char-create-small';btn.textContent='＋ CRIAR PERSONAGEM';
    btn.onclick=()=>window.arenaOpenCharacterCreator?.();
    picker.appendChild(btn);
  }
  const timer=setInterval(()=>{if(window.arenaOpenCharacterCreator&&document.getElementById('characterPicker')){install();clearInterval(timer)}},250);
  setTimeout(()=>clearInterval(timer),15000);
})();

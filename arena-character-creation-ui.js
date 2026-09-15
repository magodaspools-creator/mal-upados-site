(()=>{
  if(window.__arenaCharacterCreationUI)return;
  window.__arenaCharacterCreationUI=true;

  function fixMonkIcon(){
    document.querySelectorAll('[data-vocation="Monk"] .choice-icon').forEach(el=>{el.textContent='🖐️'});
    const preview=document.getElementById('arenaCharPreviewMeta');
    const avatar=document.getElementById('arenaCharPreviewAvatar');
    if(preview?.textContent?.includes('Monk')&&avatar)avatar.textContent='🖐️';
  }

  function install(){
    const picker=document.getElementById('characterPicker');
    if(!picker||document.getElementById('arenaCreateCharacterBtn'))return;
    const btn=document.createElement('button');
    btn.type='button';btn.id='arenaCreateCharacterBtn';btn.className='arena-char-create-small';btn.textContent='＋ CRIAR PERSONAGEM';
    btn.onclick=()=>window.arenaOpenCharacterCreator?.();
    picker.appendChild(btn);
  }

  const timer=setInterval(()=>{
    fixMonkIcon();
    if(window.arenaOpenCharacterCreator&&document.getElementById('characterPicker')){install();clearInterval(timer)}
  },250);
  setTimeout(()=>clearInterval(timer),15000);

  const observer=new MutationObserver(fixMonkIcon);
  if(document.body)observer.observe(document.body,{childList:true,subtree:true});
})();

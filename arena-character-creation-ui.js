(()=>{
  if(window.__arenaCharacterCreationUI)return;
  window.__arenaCharacterCreationUI=true;

  function fixMonkIcon(){
    document.querySelectorAll('[data-vocation="Monk"] .choice-icon').forEach(el=>{
      if(el.textContent!=='🖐️')el.textContent='🖐️';
    });
    const preview=document.getElementById('arenaCharPreviewMeta');
    const avatar=document.getElementById('arenaCharPreviewAvatar');
    if(preview?.textContent?.includes('Monk')&&avatar&&avatar.textContent!=='🖐️')avatar.textContent='🖐️';
  }

  function install(){
    const picker=document.getElementById('characterPicker');
    if(!picker||document.getElementById('arenaCreateCharacterBtn'))return;
    const btn=document.createElement('button');
    btn.type='button';
    btn.id='arenaCreateCharacterBtn';
    btn.className='arena-char-create-small';
    btn.textContent='＋ CRIAR PERSONAGEM';
    btn.addEventListener('click',e=>{
      e.preventDefault();
      e.stopPropagation();
      if(typeof window.arenaOpenCharacterCreator==='function')window.arenaOpenCharacterCreator();
    });
    picker.appendChild(btn);
  }

  function ready(){
    fixMonkIcon();
    if(window.arenaOpenCharacterCreator&&document.getElementById('characterPicker'))install();
  }

  const timer=setInterval(()=>{
    ready();
    if(window.arenaOpenCharacterCreator&&document.getElementById('arenaCreateCharacterBtn'))clearInterval(timer);
  },250);
  setTimeout(()=>clearInterval(timer),15000);

  // Do not observe the whole body: changing text inside the modal can retrigger
  // a childList MutationObserver indefinitely and freeze the page.
  const observer=new MutationObserver(()=>{
    if(document.getElementById('characterPicker')&&!document.getElementById('arenaCreateCharacterBtn'))install();
  });
  if(document.body)observer.observe(document.body,{childList:true,subtree:true});
})();

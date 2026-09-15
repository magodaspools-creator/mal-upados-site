(()=>{
  if(window.__arenaSkillCharacterFix)return;
  window.__arenaSkillCharacterFix=true;

  const refresh=()=>{
    try{
      if(typeof window.arenaSkillRender==='function')window.arenaSkillRender();
      const modal=document.getElementById('skillTrainModal');
      if(modal?.classList.contains('open')){
        modal.classList.remove('open');
        document.body.classList.remove('skill-modal-open');
      }
      if(typeof window.renderAll==='function')window.renderAll();
      if(typeof window.arenaSkillRender==='function')window.arenaSkillRender();
    }catch(error){
      console.warn('Arena skill character refresh:',error);
    }
  };

  document.addEventListener('click',event=>{
    const option=event.target.closest('#characterPickerMenu .character-option');
    if(!option)return;
    setTimeout(refresh,0);
  });

  window.addEventListener('arena-character-created',()=>setTimeout(refresh,50));
})();

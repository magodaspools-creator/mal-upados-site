// Arena — cutscenes narrativas compactas.
// Camada visual isolada: não altera combate, progressão ou Sobreviva.
(()=>{
  function esc(v){
    return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  function ensure(){
    let modal=document.getElementById('arenaCutscene');
    if(modal)return modal;
    modal=document.createElement('div');
    modal.id='arenaCutscene';
    modal.className='arena-cutscene';
    modal.setAttribute('aria-hidden','true');
    document.body.appendChild(modal);
    return modal;
  }

  function play(options={}){
    const modal=ensure();
    const steps=Array.isArray(options.steps)?options.steps.filter(Boolean):[];
    if(!steps.length)return;

    let index=0;
    let closed=false;

    const finish=()=>{
      if(closed)return;
      closed=true;
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden','true');
      document.body.classList.remove('arena-cutscene-active');
      window.removeEventListener('keydown',onKey);
      if(typeof options.onComplete==='function')options.onComplete();
    };

    const render=()=>{
      const step=steps[index]||{};
      const isNarrator=step.type==='narration';
      const speaker=step.speaker||options.speaker||'Kaelen';
      const role=step.role||options.role||'O Guia';
      const icon=step.icon||options.icon||'⚔';
      const last=index===steps.length-1;
      modal.innerHTML=
        '<div class="arena-cutscene-backdrop"></div>'+
        '<div class="arena-cutscene-stage" role="dialog" aria-modal="true" aria-label="Cutscene narrativa">'+
          '<div class="arena-cutscene-scene-mark">'+esc(options.chapter||'FLORESTA SOMBRIA')+'</div>'+
          '<div class="arena-cutscene-character '+(isNarrator?'narrator':'')+'">'+
            '<div class="arena-cutscene-avatar">'+esc(icon)+'</div>'+
            '<div><strong>'+esc(isNarrator?'Memória':speaker)+'</strong><small>'+esc(isNarrator?'A floresta observa.':role)+'</small></div>'+
          '</div>'+
          '<div class="arena-cutscene-text">'+esc(step.text||'')+'</div>'+
          '<div class="arena-cutscene-footer">'+
            '<span>'+(index+1)+' / '+steps.length+'</span>'+
            '<button type="button" class="btn active arena-cutscene-next">'+(last?'ENTENDI':'CONTINUAR')+'</button>'+
          '</div>'+
        '</div>';

      modal.querySelector('.arena-cutscene-next').onclick=()=>last?finish():(index++,render());
    };

    const onKey=e=>{
      if(e.key==='Escape'){e.preventDefault();finish()}
      if(e.key==='Enter'&&!closed){
        const next=modal.querySelector('.arena-cutscene-next');
        if(next)next.click();
      }
    };

    modal.onclick=e=>{
      if(e.target.classList.contains('arena-cutscene-backdrop'))finish();
    };

    window.addEventListener('keydown',onKey);
    document.body.classList.add('arena-cutscene-active');
    modal.classList.add('open');
    modal.setAttribute('aria-hidden','false');
    render();
  }

  window.ArenaCutscene={play};
})();
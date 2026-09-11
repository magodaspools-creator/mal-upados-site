(()=>{
  const init=()=>{
    const wrap=document.getElementById('characterPicker');
    const btn=document.getElementById('characterPickerBtn');
    const menu=document.getElementById('characterPickerMenu');
    const legacy=document.getElementById('characterSelect');
    if(!wrap||!btn||!menu)return;

    const draw=()=>{
      if(typeof members==='undefined'||!Array.isArray(members))return;
      menu.innerHTML=members.map(m=>{
        const selected=game&&m.name===game.character;
        return `<button type="button" class="character-option ${selected?'selected':''}" data-name="${esc(m.name)}" role="option"><span>${VOC_ICONS[m.vocation]||'⚔'}</span><span>${esc(m.name)}</span><small>${esc(m.vocation||'Aventureiro')}</small></button>`;
      }).join('');
      const current=game?.character||'';
      const label=document.getElementById('characterPickerName');
      if(label)label.textContent=current||'Escolher personagem';
      if(legacy)legacy.value=current;
      menu.querySelectorAll('.character-option').forEach(option=>option.addEventListener('click',e=>{
        e.stopPropagation();
        const name=option.dataset.name;
        if(!name||typeof loadGame!=='function')return;
        loadGame(name);
        if(legacy){legacy.value=name;legacy.dispatchEvent(new Event('change'));}
        wrap.classList.remove('open');
        btn.setAttribute('aria-expanded','false');
        draw();
      }));
    };

    btn.onclick=e=>{e.stopPropagation();const open=wrap.classList.toggle('open');btn.setAttribute('aria-expanded',String(open));};
    document.addEventListener('click',e=>{if(!wrap.contains(e.target)){wrap.classList.remove('open');btn.setAttribute('aria-expanded','false')}});
    draw();
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();

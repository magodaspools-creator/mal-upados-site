(()=>{
  const init=()=>{
    const wrap=document.getElementById('characterPicker');
    const btn=document.getElementById('characterPickerBtn');
    const menu=document.getElementById('characterPickerMenu');
    const legacy=document.getElementById('characterSelect');
    if(!wrap||!btn||!menu)return;

    const draw=()=>{
      if(typeof members==='undefined'||!Array.isArray(members)||members.length===0)return false;
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
      return true;
    };

    btn.onclick=e=>{e.stopPropagation();const open=wrap.classList.toggle('open');btn.setAttribute('aria-expanded',String(open));};
    document.addEventListener('click',e=>{if(!wrap.contains(e.target)){wrap.classList.remove('open');btn.setAttribute('aria-expanded','false')}});

    const timer=setInterval(()=>{if(draw())clearInterval(timer)},250);
    if(draw())clearInterval(timer);
    setTimeout(()=>clearInterval(timer),15000);
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();

// Carrega os recursos extras depois que a interface já existe.
(()=>{
  const files=[
    'arena-campaign-timer-fix.js?v=timer-fix-20260912c',
    'arena-bestiary-fix.js?v=bestiary-infinite-20260912a',
    'arena-bestiary-intro.js?v=bestiary-intro-20260912b',
    'arena-bestiary-counter-fix.js?v=bestiary-counter-infinite-20260912a',
    'arena-bestiary-platinum-popup.js?v=platinum-popup-20260912a',
    'arena-combat-final-fix.js?v=combat-fix-20260912',
    'arena-flee-fix.js?v=flee-fix-20260912',
    'arena-gold-universal.js?v=gold-universal-20260912',
    'arena-account-systems.js?v=account-systems-20260912a'
  ];
  const load=()=>files.forEach(src=>{
    if(document.querySelector(`script[data-arena-feature="${src}"]`))return;
    const s=document.createElement('script');s.src=src;s.dataset.arenaFeature=src;document.body.appendChild(s);
  });
  if(document.body)load();else document.addEventListener('DOMContentLoaded',load,{once:true});
})();

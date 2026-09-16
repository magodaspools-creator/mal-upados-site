(()=>{
  const init=()=>{
    const wrap=document.getElementById('characterPicker');
    const btn=document.getElementById('characterPickerBtn');
    const menu=document.getElementById('characterPickerMenu');
    const legacy=document.getElementById('characterSelect');
    if(!wrap||!btn||!menu)return;
    const vocationIcon=v=>{v=String(v||'').toLowerCase();if(v.includes('sorcerer'))return '🔥';if(v.includes('druid'))return '❄️';if(v.includes('knight'))return '⚔️';if(v.includes('paladin'))return '🏹';if(v.includes('monk'))return '🖐️';return '⚔'};
    const refresh=()=>setTimeout(()=>{try{if(typeof renderAll==='function')renderAll();if(typeof window.arenaSkillRender==='function')window.arenaSkillRender()}catch(error){console.warn('Arena character refresh:',error)}},0);
    const draw=()=>{if(typeof members==='undefined'||!Array.isArray(members)||!members.length)return false;menu.innerHTML=members.map(m=>{const selected=game&&m.name===game.character;return `<button type="button" class="character-option ${selected?'selected':''}" data-name="${esc(m.name)}" role="option"><span>${vocationIcon(m.vocation)}</span><span>${esc(m.name)}</span><small>${esc(m.vocation||'Aventureiro')}</small></button>`}).join('');const current=game?.character||'';const label=document.getElementById('characterPickerName');if(label)label.textContent=current||'Escolher personagem';if(legacy)legacy.value=current;menu.querySelectorAll('.character-option').forEach(option=>option.addEventListener('click',e=>{e.stopPropagation();const name=option.dataset.name;if(!name||typeof loadGame!=='function')return;loadGame(name);if(legacy){legacy.value=name;legacy.dispatchEvent(new Event('change'))}wrap.classList.remove('open');btn.setAttribute('aria-expanded','false');draw();refresh()}));return true};
    btn.onclick=e=>{e.stopPropagation();const open=wrap.classList.toggle('open');btn.setAttribute('aria-expanded',String(open))};
    document.addEventListener('click',e=>{if(!wrap.contains(e.target)){wrap.classList.remove('open');btn.setAttribute('aria-expanded','false')}});
    window.__arenaCharacterDraw=draw;window.addEventListener('arena-character-created',()=>setTimeout(draw,0));
    const start=document.getElementById('arenaStartBtn');if(start&&!start.dataset.arenaStartBound){start.dataset.arenaStartBound='1';start.addEventListener('click',()=>{document.querySelector('.game-shell')?.scrollIntoView({behavior:'smooth',block:'start'});setTimeout(()=>document.getElementById('characterPickerBtn')?.focus(),350)})}
    const timer=setInterval(()=>{if(draw())clearInterval(timer)},250);if(draw())clearInterval(timer);setTimeout(()=>clearInterval(timer),15000);
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();

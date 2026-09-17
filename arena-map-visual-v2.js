/* Arena Map Visual V2
 * Mapa ilustrado fica exclusivamente na aba MAPA.
 * A lógica existente de zonas/combate permanece intacta.
 */
(()=>{
  const RAW='https://raw.githubusercontent.com/magodaspools-creator/mal-upados-site/main/assets/arena-map/';
  const MAP_URL=RAW+'mapa%20arena%202048%20%C3%97%201024%20px.jpeg';
  const ZONE_POS=[
    {left:23,top:25,preview:'18% 28%',label:'Floresta Sombria'},
    {left:38,top:54,preview:'39% 58%',label:'Acampamento Orc'},
    {left:53,top:27,preview:'57% 27%',label:'Deserto Perdido'},
    {left:71,top:28,preview:'72% 28%',label:'Covil dos Dragões'},
    {left:89,top:30,preview:'91% 29%',label:'Abismo Demoníaco'}
  ];
  const NAV=[
    ['⚔','MAPA','map'],['⚒','FORGE','.forge-card'],['☠','DUNGEON','#arenaGameMode'],['♟','CRIAÇÃO','.character-panel'],
    ['⚔','COMBATE','combat'],['📖','BESTIÁRIO','.bestiary'],['▣','LOJA','.shop-section'],['●','CONTA','.character-panel']
  ];

  function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}

  function setView(view){
    const map=document.getElementById('map');
    const details=document.getElementById('arenaMapDetails');
    const battle=document.getElementById('battleArea');
    if(!map||!battle)return;
    const showMap=view==='map';
    map.style.display=showMap?'block':'none';
    if(details)details.style.display=showMap?'grid':'none';
    battle.style.display=showMap?'none':'block';
    document.querySelectorAll('#arenaMapNav button').forEach(btn=>btn.classList.toggle('active',btn.dataset.view===view));
  }

  function ensureShell(){
    const host=document.querySelector('.adventure-panel');
    const map=document.getElementById('map');
    if(!host||!map)return null;
    if(!document.getElementById('arenaMapNav')){
      const nav=document.createElement('nav');
      nav.id='arenaMapNav';
      nav.className='arena-map-nav';
      nav.innerHTML=NAV.map(n=>`<button type="button" class="${n[2]==='combat'?'active':''}" data-view="${n[2]}" data-target="${n[2].startsWith('.')||n[2].startsWith('#')?n[2]:''}"><span class="nav-icon">${n[0]}</span>${n[1]}</button>`).join('');
      host.insertBefore(nav,host.firstElementChild);
      nav.querySelectorAll('button').forEach(btn=>btn.addEventListener('click',()=>{
        const view=btn.dataset.view;
        if(view==='map'||view==='combat'){
          setView(view);
          if(view==='map')renderIllustratedMap();
          return;
        }
        nav.querySelectorAll('button').forEach(x=>x.classList.remove('active'));
        btn.classList.add('active');
        const target=btn.dataset.target;
        if(!target)return;
        const el=document.querySelector(target);
        if(el)el.scrollIntoView({behavior:'smooth',block:'start'});
      }));
    }
    map.classList.add('arena-map-stage');
    if(!map.dataset.backgroundBound){
      map.style.backgroundImage=`url("${MAP_URL}")`;
      map.dataset.backgroundBound='1';
    }
    if(!document.getElementById('arenaMapDetails')){
      const details=document.createElement('section');
      details.id='arenaMapDetails';
      details.className='arena-map-details';
      details.innerHTML=`<div class="arena-map-preview"></div><div class="arena-map-details-copy"><div class="eyebrow">Área selecionada</div><h3 id="arenaMapDetailName">Floresta Sombria</h3><div class="map-level" id="arenaMapDetailLevel">Level mínimo: 1+</div><p id="arenaMapDetailDesc">Uma floresta densa e perigosa. Escolha uma criatura abaixo para começar sua hunt.</p><div class="arena-map-meta" id="arenaMapDetailMeta"></div></div><div class="arena-map-go"><button type="button" class="btn active" id="arenaMapGoBtn">⚔ IR PARA ESTA ÁREA</button></div>`;
      map.insertAdjacentElement('afterend',details);
      document.getElementById('arenaMapGoBtn').onclick=()=>setView('combat');
    }
    return map;
  }

  function updateDetails(index){
    const details=document.getElementById('arenaMapDetails');
    if(!details||typeof ZONES==='undefined'||!ZONES[index])return;
    const z=ZONES[index], pos=ZONE_POS[index]||ZONE_POS[0];
    const preview=details.querySelector('.arena-map-preview');
    preview.style.backgroundImage=`url("${MAP_URL}")`;
    preview.style.backgroundPosition=pos.preview;
    const unlocked=typeof game!=='undefined'&&game?game.level>=z.min:false;
    document.getElementById('arenaMapDetailName').textContent=z.name;
    document.getElementById('arenaMapDetailLevel').textContent=`Level mínimo: ${z.min}+${unlocked?'':' · BLOQUEADA'}`;
    document.getElementById('arenaMapDetailDesc').textContent=({
      forest:'Uma floresta densa e perigosa, ideal para os primeiros passos do aventureiro.',
      orcs:'Um acampamento tomado por orcs. O perigo aumenta, mas as recompensas também.',
      desert:'Areias antigas escondem criaturas resistentes e uma progressão mais difícil.',
      dragon:'Montanhas dominadas por dragões. Prepare seu equipamento antes de avançar.',
      demon:'O limite da Arena. Criaturas demoníacas e as maiores recompensas do mapa.'
    })[z.id]||'Explore esta região da Arena e escolha sua próxima criatura.';
    document.getElementById('arenaMapDetailMeta').innerHTML=`<span>👹 ${z.monsters.map(m=>esc(m[0])).join(', ')}</span><span>★ ${esc(z.color)}</span><span>◆ XP + Gold</span>`;
  }

  function renderIllustratedMap(){
    const map=ensureShell();
    if(!map||typeof ZONES==='undefined'||typeof game==='undefined')return;
    const selected=Number(game.zone)||0;
    map.innerHTML=`<div class="arena-map-compass" aria-hidden="true"></div><div class="arena-map-you-are">VOCÊ ESTÁ AQUI</div><div class="arena-map-legend"><div><i></i> Região liberada</div><div><i class="lock"></i> Região bloqueada</div><div><i class="you"></i> Sua posição</div></div>`+
      ZONES.map((z,i)=>{
        const unlocked=game.level>=z.min;
        const p=ZONE_POS[i]||ZONE_POS[0];
        return `<button type="button" class="arena-zone ${i===selected?'selected':''} ${unlocked?'':'locked'}" data-zone="${i}" data-label="${esc(z.name)}" style="left:${p.left}%;top:${p.top}%" ${unlocked?'':'disabled'}><span class="zone-dot">${z.icon}</span><strong>${esc(z.name)}</strong><small>Lv. ${z.min}+ · ${esc(z.color)}</small>${unlocked?'':'<span class="lock-mark">🔒</span>'}</button>`;
      }).join('');

    map.querySelectorAll('.arena-zone').forEach(btn=>btn.addEventListener('click',()=>{
      const index=Number(btn.dataset.zone);
      if(typeof game==='undefined'||typeof persist!=='function'||typeof renderAll!=='function')return;
      game.manualZone=index;
      game.zone=index;
      persist();
      renderAll();
      if(typeof showZone==='function')showZone(index);
      updateDetails(index);
    }));
    updateDetails(selected);
  }

  function install(){
    if(window.__arenaMapVisualV2)return;
    if(typeof renderMap!=='function'||typeof ZONES==='undefined')return setTimeout(install,100);
    window.__arenaMapVisualV2=true;
    window.renderMap=renderIllustratedMap;
    ensureShell();
    renderIllustratedMap();
    setView('combat');
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});
  else install();
})();

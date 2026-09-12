// Bestiário da Arena — um único sistema de UI e registro.
(()=>{
  if(window.__arenaBestiaryFixInstalled)return;
  window.__arenaBestiaryFixInstalled=true;

  const STORE='malupados_arena_v1';
  const monsters=[
    ['Rat','🐀','Floresta Sombria','forest'],['Troll','👹','Floresta Sombria','forest'],['Orc','👺','Floresta Sombria','forest'],
    ['Orc Berserker','👺','Acampamento Orc','orcs'],['Orc Rider','🐗','Acampamento Orc','orcs'],['Cyclops','👁️','Acampamento Orc','orcs'],
    ['Scorpion','🦂','Deserto Perdido','desert'],['Ancient Scarab','🪲','Deserto Perdido','desert'],['Dragon Hatchling','🐲','Deserto Perdido','desert'],
    ['Dragon','🐉','Covil dos Dragões','dragon'],['Dragon Lord','🐲','Covil dos Dragões','dragon'],['Frost Dragon','🐉','Covil dos Dragões','dragon'],
    ['Demon Skeleton','💀','Abismo Demoníaco','demon'],['Hellhound','🐺','Abismo Demoníaco','demon'],['Demon','😈','Abismo Demoníaco','demon'],
    ['Deathbringer','☠️','Boss Final','boss']
  ];
  const maps=[
    ['forest','Mapa 1','Floresta Sombria'],['orcs','Mapa 2','Acampamento Orc'],['desert','Mapa 3','Deserto Perdido'],
    ['dragon','Mapa 4','Covil dos Dragões'],['demon','Mapa 5','Abismo Demoníaco'],['boss','Mapa 6','Boss Final']
  ];
  const lore={
    Rat:'Pequenos, rápidos e numerosos.',Troll:'Brutos das regiões esquecidas.',Orc:'Guerreiros selvagens do acampamento.',
    'Orc Berserker':'Um orc que luta até o último suspiro.','Orc Rider':'Caçadores montados que patrulham o acampamento.',
    Cyclops:'Gigante de um olho que guarda caminhos antigos.',Scorpion:'Predador do deserto com veneno letal.',
    'Ancient Scarab':'Criatura ancestral escondida sob as areias.','Dragon Hatchling':'Jovem dragão de força elemental assustadora.',
    Dragon:'O primeiro grande teste dracônico.','Dragon Lord':'Senhor dracônico que domina o covil.',
    'Frost Dragon':'Dragão conhecido por sobreviver a batalhas impossíveis.','Demon Skeleton':'Restos de guerreiros consumidos pelo Abismo.',
    Hellhound:'Caçador infernal do Abismo.',Demon:'Uma das criaturas mais brutais da Arena.',Deathbringer:'O verdadeiro guardião do fim.'
  };

  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const load=()=>{try{return JSON.parse(localStorage.getItem(STORE)||'{}')}catch{return {}}};
  const save=a=>localStorage.setItem(STORE,JSON.stringify(a));
  const char=()=>{
    const a=document.getElementById('playerName')?.textContent?.trim();
    const b=document.getElementById('characterPickerName')?.textContent?.trim();
    const c=document.getElementById('characterSelect')?.value?.trim();
    if(a&&a!=='Carregando...')return a;
    if(b&&b!=='Escolher personagem')return b;
    if(c)return c;
    return game?.character||'default';
  };
  const data=()=>{const all=load(),c=char();if(!all[c])all[c]={};if(!all[c].bestiary)all[c].bestiary={};return{all,c,g:all[c]}};
  const required=name=>name==='Deathbringer'?5:25;
  const count=name=>Math.min(required(name),Number(data().g.bestiary[name]?.kills||0));

  function record(name){
    name=String(name||'').replace(/\s+/g,' ').trim();
    const mob=monsters.find(m=>m[0].toLowerCase()===name.toLowerCase());
    if(!mob)return false;
    const d=data(),old=Number(d.g.bestiary[name]?.kills||0);
    if(old>=required(name))return false;
    d.g.bestiary[name]={kills:old+1};
    d.all[d.c]=d.g;
    save(d.all);
    window.dispatchEvent(new CustomEvent('arena:bestiary-kill',{detail:{name,kills:old+1}}));
    return true;
  }
  window.arenaRecordBestiaryKill=record;

  function close(){document.getElementById('arenaBestiaryModal')?.remove();document.body.classList.remove('bestiary-open')}
  // ESC fecha o Bestiário, como é esperado em interfaces de jogo.
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape' && document.getElementById('arenaBestiaryModal')){
      e.preventDefault();
      close();
    }
  });

  function open(){
    close();
    const modal=document.createElement('div');modal.id='arenaBestiaryModal';modal.className='bf-overlay';
    modal.innerHTML=`<div class="bf-backdrop"></div><section class="bf-modal" role="dialog" aria-modal="true" aria-label="Bestiário"><header><div><small>REGISTROS DA ARENA</small><h2>📖 BESTIÁRIO</h2><p>Conheça suas presas. Domine cada criatura. Conquiste a Platina.</p></div><button id="bfClose" aria-label="Fechar bestiário">×</button></header><div class="bf-summary"><div><b id="bfPlatinum">0/${monsters.length}</b><span>PLATINA</span></div><div><b id="bfKills">0</b><span>MORTES</span></div></div><nav class="bf-maps" aria-label="Mapas do bestiário">${maps.map((m,i)=>`<button type="button" data-map="${m[0]}" class="${i===0?'active':''}"><b>${m[1]}</b><span>${esc(m[2])}</span></button>`).join('')}</nav><div class="bf-current-map"></div><div class="bf-grid"></div></section>`;
    document.body.appendChild(modal);document.body.classList.add('bestiary-open');
    const draw=filter=>{
      const map=maps.find(x=>x[0]===filter)||maps[0],list=monsters.filter(m=>m[3]===map[0]);
      modal.querySelector('.bf-current-map').innerHTML=`<strong>${map[1]}</strong><span>${esc(map[2])} · ${list.length} criaturas</span>`;
      modal.querySelector('.bf-grid').innerHTML=list.map(m=>{const k=count(m[0]),req=required(m[0]),p=Math.min(100,Math.round(k/req*100));return `<article><div class="bf-top"><strong>${m[1]} ${esc(m[0])}</strong>${k>=req?'<em>PLATINA</em>':''}</div><small>${esc(m[2])}</small><p>${esc(lore[m[0]]||'Registro da Arena.')}</p><b>${k} / ${req}</b><div class="bf-bar"><i style="width:${p}%"></i></div><span>${p}%</span></article>`}).join('');
      modal.querySelectorAll('.bf-maps button').forEach(btn=>btn.classList.toggle('active',btn.dataset.map===map[0]));
      modal.querySelector('#bfPlatinum').textContent=`${monsters.filter(m=>count(m[0])>=required(m[0])).length}/${monsters.length}`;
      modal.querySelector('#bfKills').textContent=String(monsters.reduce((n,m)=>n+count(m[0]),0));
    };
    modal.querySelectorAll('.bf-maps button').forEach(btn=>btn.onclick=()=>draw(btn.dataset.map));
    modal.querySelector('#bfClose').onclick=close;modal.querySelector('.bf-backdrop').onclick=close;draw('forest');
  }

  function inject(){
    if(document.getElementById('arenaBestiaryButton'))return;
    const b=document.createElement('button');b.id='arenaBestiaryButton';b.className='btn bf-launch';b.type='button';b.innerHTML='📖 Bestiário';b.onclick=open;
    const target=document.querySelector('.map-controls');if(target)target.prepend(b);else document.body.appendChild(b);
  }

  // O motor base chama winBattle() localmente e, logo depois, troca o HTML da batalha.
  // Por isso não dependemos da tela de resultado. Capturamos o nome da criatura ANTES
  // do ataque e confirmamos a vitória pelo contador game.kills depois do ataque.
  let pendingKill=null;
  document.addEventListener('click',e=>{
    const btn=e.target.closest('#attackBtn');
    if(!btn||typeof game==='undefined')return;
    if(typeof battle==='undefined'||!battle)return;
    pendingKill={name:battle.name,killsBefore:Number(game.kills)||0,char:game.character};
    setTimeout(()=>{
      const p=pendingKill;
      pendingKill=null;
      if(!p)return;
      if(game.character!==p.char)return;
      if((Number(game.kills)||0)<=p.killsBefore)return;
      record(p.name);
    },0);
  },true);

  const st=document.createElement('style');st.textContent=`
    body.bestiary-open{overflow:hidden}.bf-launch{white-space:nowrap;min-height:42px;font-weight:800}.bf-overlay{position:fixed;inset:0;z-index:99999;display:grid;place-items:center;padding:24px;box-sizing:border-box}.bf-backdrop{position:absolute;inset:0;background:rgba(0,0,0,.78);backdrop-filter:blur(3px)}.bf-modal{position:relative;z-index:1;width:min(1080px,100%);max-height:min(86vh,900px);overflow:auto;box-sizing:border-box;background:#0e1012;border:1px solid #66582e;border-radius:14px;padding:24px;color:#ddd;box-shadow:0 24px 80px rgba(0,0,0,.75)}.bf-modal header{position:sticky;top:-24px;z-index:10;display:flex;justify-content:space-between;gap:20px;background:#0e1012;border-bottom:1px solid #292b2e;padding:24px 0 15px}.bf-modal h2{margin:5px 0;color:#eee}.bf-modal header p{margin:6px 0 0;color:#858a91}.bf-modal header small{color:#a89562;letter-spacing:.12em;font-weight:800}.bf-modal header button{flex:0 0 auto;width:40px;height:40px;background:#151618;color:#aaa;border:1px solid #343536;border-radius:8px;font-size:25px;line-height:1;cursor:pointer;position:sticky;top:0}.bf-summary{display:flex;gap:10px;margin:18px 0}.bf-summary div{background:#121315;border:1px solid #292a2b;border-radius:8px;padding:12px 25px;text-align:center}.bf-summary b,.bf-summary span{display:block}.bf-summary b{font-size:1.2rem;color:#e4d5a7}.bf-summary span{font-size:.6rem;color:#777}.bf-maps{display:flex;gap:8px;overflow-x:auto;padding:2px 0 12px;margin-bottom:4px;scrollbar-width:thin}.bf-maps button{flex:1 0 120px;min-height:54px;padding:8px 10px;background:#121315;border:1px solid #2d2f32;border-radius:8px;color:#858a91;cursor:pointer;text-align:left}.bf-maps button.active{border-color:#a89562;background:#211e16;color:#e4d5a7;box-shadow:inset 0 -2px 0 #a89562}.bf-maps button b,.bf-maps button span{display:block}.bf-maps button b{font-size:.72rem}.bf-maps button span{font-size:.58rem;margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.bf-current-map{display:flex;align-items:baseline;gap:10px;margin:5px 0 12px;padding:10px 12px;border-left:3px solid #a89562;background:#121315}.bf-current-map strong{font-size:.85rem;color:#e4d5a7}.bf-current-map span{font-size:.62rem;color:#777d84}.bf-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.bf-grid article{background:#151719;border:1px solid #292b2e;border-radius:9px;padding:14px}.bf-top{display:flex;justify-content:space-between;gap:10px}.bf-top strong{font-size:.9rem}.bf-top em{font-style:normal;color:#dfc675;font-size:.55rem}.bf-grid article>small,.bf-grid article>p,.bf-grid article>span{color:#777d84;font-size:.65rem}.bf-grid article p{min-height:30px}.bf-bar{height:6px;background:#242529;margin:7px 0;border-radius:4px;overflow:hidden}.bf-bar i{display:block;height:100%;background:linear-gradient(90deg,#6e5a2c,#d2b86d)}@media(max-width:700px){.bf-grid{grid-template-columns:1fr}.bf-overlay{padding:10px}.bf-modal{max-height:92vh;padding:16px}.bf-modal header{top:-16px;padding-top:16px}.bf-launch{padding-inline:12px}.bf-current-map{display:block}.bf-current-map span{display:block;margin-top:3px}}
  `;document.head.appendChild(st);inject();
})();
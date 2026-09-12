// Bestiário robusto: usa o storage da Arena e não depende de window.game/battle.
(()=>{
  const STORE='malupados_arena_v1';
  const monsters=[
    ['Rat','🐀','Floresta Sombria','forest'],['Troll','👹','Floresta Sombria','forest'],['Orc','👺','Floresta Sombria','forest'],
    ['Orc Berserker','👺','Acampamento Orc','orcs'],['Orc Rider','🐗','Acampamento Orc','orcs'],['Cyclops','👁️','Acampamento Orc','orcs'],
    ['Scorpion','🦂','Deserto Perdido','desert'],['Ancient Scarab','🪲','Deserto Perdido','desert'],['Dragon Hatchling','🐲','Deserto Perdido','desert'],
    ['Dragon','🐉','Covil dos Dragões','dragon'],['Dragon Lord','🐲','Covil dos Dragões','dragon'],['Frost Dragon','🐉','Covil dos Dragões','dragon'],
    ['Demon Skeleton','💀','Abismo Demoníaco','demon'],['Hellhound','🐺','Abismo Demoníaco','demon'],['Demon','😈','Abismo Demoníaco','demon'],
    ['Deathbringer','☠️','Boss Final','boss']
  ];
  const lore={Rat:'Pequenos, rápidos e numerosos.',Troll:'Brutos das regiões esquecidas.',Orc:'Guerreiros selvagens do acampamento.', 'Orc Berserker':'Um orc que luta até o último suspiro.','Orc Rider':'Caçadores montados que patrulham o acampamento.',Cyclops:'Gigante de um olho que guarda caminhos antigos.',Scorpion:'Predador do deserto com veneno letal.','Ancient Scarab':'Criatura ancestral escondida sob as areias.','Dragon Hatchling':'Jovem dragão de força elemental assustadora.',Dragon:'O primeiro grande teste dracônico.','Dragon Lord':'Senhor dracônico que domina o covil.','Frost Dragon':'Dragão conhecido por sobreviver a batalhas impossíveis.','Demon Skeleton':'Restos de guerreiros consumidos pelo Abismo.',Hellhound:'Caçador infernal do Abismo.',Demon:'Uma das criaturas mais brutais da Arena.',Deathbringer:'O verdadeiro guardião do fim.'};
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const char=()=>{const a=document.getElementById('characterSelect')?.value?.trim();const b=document.getElementById('characterPickerName')?.textContent?.trim();if(a)return a;if(b&&b!=='Escolher personagem')return b;try{const all=JSON.parse(localStorage.getItem(STORE)||'{}');return Object.keys(all)[0]||'default'}catch{return'default'}};
  const load=()=>{try{return JSON.parse(localStorage.getItem(STORE)||'{}')}catch{return {}}};
  const save=a=>localStorage.setItem(STORE,JSON.stringify(a));
  const data=()=>{const all=load(),c=char();if(!all[c])all[c]={};if(!all[c].bestiary)all[c].bestiary={};return{all,c,g:all[c]}};
  const count=m=>Math.min(m[0]==='Deathbringer'?5:25,Number(data().g.bestiary[m[0]]?.kills||0));

  const close=()=>{document.getElementById('arenaBestiaryModal')?.remove();document.body.classList.remove('bestiary-open')};

  const open=()=>{
    close();
    const modal=document.createElement('div');
    modal.id='arenaBestiaryModal';
    modal.className='bf-overlay';
    modal.innerHTML=`<div class="bf-backdrop"></div><section class="bf-modal" role="dialog" aria-modal="true" aria-label="Bestiário"><header><div><small>REGISTROS DA ARENA</small><h2>📖 BESTIÁRIO</h2><p>Conheça suas presas. Domine cada criatura. Conquiste a Platina.</p></div><button id="bfClose" aria-label="Fechar bestiário">×</button></header><div class="bf-summary"><div><b>${monsters.filter(m=>count(m)>=(m[0]==='Deathbringer'?5:25)).length}/${monsters.length}</b><span>PLATINA</span></div><div><b>${monsters.reduce((n,m)=>n+count(m),0)}</b><span>MORTES</span></div></div><div class="bf-grid"></div></section>`;
    document.body.appendChild(modal);
    document.body.classList.add('bestiary-open');

    const draw=(filter='all')=>{
      modal.querySelector('.bf-grid').innerHTML=monsters.filter(m=>filter==='all'||m[3]===filter).map(m=>{
        const req=m[0]==='Deathbringer'?5:25,k=count(m),p=Math.min(100,Math.round(k/req*100));
        return `<article><div class="bf-top"><strong>${m[1]} ${esc(m[0])}</strong>${k>=req?'<em>PLATINA</em>':''}</div><small>${esc(m[2])}</small><p>${esc(lore[m[0]]||'Registro da Arena.')}</p><b>${k} / ${req}</b><div class="bf-bar"><i style="width:${p}%"></i></div><span>${p}%</span></article>`
      }).join('')
    };
    draw();
    modal.querySelector('#bfClose').onclick=close;
    modal.querySelector('.bf-backdrop').onclick=close;
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.getElementById('arenaBestiaryModal'))close()},{once:true});
  };

  const inject=()=>{
    if(document.getElementById('arenaBestiaryButton'))return;
    const b=document.createElement('button');
    b.id='arenaBestiaryButton';
    b.className='btn bf-launch';
    b.type='button';
    b.innerHTML='📖 Bestiário';
    b.title='Abrir Bestiário';
    b.onclick=open;
    const target=document.querySelector('.map-controls');
    if(target) target.prepend(b);
    else document.body.appendChild(b);
  };

  const record=name=>{const m=monsters.find(x=>x[0]===name);if(!m)return;const d=data(),req=name==='Deathbringer'?5:25,old=Number(d.g.bestiary[name]?.kills||0);if(old>=req)return;d.g.bestiary[name]={kills:old+1};d.all[d.c]=d.g;save(d.all)};
  const area=document.getElementById('battleArea');
  if(area){let seen='';const obs=new MutationObserver(()=>{const h=area.querySelector('.result h3');if(!h)return;const t=h.textContent.trim();if(t===seen)return;seen=t;const m=t.match(/^(.+?)\s+derrotado!?$/i);if(m)record(m[1].trim())});obs.observe(area,{subtree:true,childList:true})}

  const st=document.createElement('style');
  st.textContent=`
    body.bestiary-open{overflow:hidden}
    .bf-launch{white-space:nowrap;min-height:42px;font-weight:800}
    .bf-overlay{position:fixed;inset:0;z-index:99999;display:grid;place-items:center;padding:24px;box-sizing:border-box}
    .bf-backdrop{position:absolute;inset:0;background:rgba(0,0,0,.78);backdrop-filter:blur(3px)}
    .bf-modal{position:relative;z-index:1;width:min(1080px,100%);max-height:min(86vh,900px);overflow:auto;box-sizing:border-box;background:#0e1012;border:1px solid #66582e;border-radius:14px;padding:24px;color:#ddd;box-shadow:0 24px 80px rgba(0,0,0,.75)}
    .bf-modal header{display:flex;justify-content:space-between;gap:20px;border-bottom:1px solid #292b2e;padding-bottom:15px}
    .bf-modal h2{margin:5px 0;color:#eee}.bf-modal header p{margin:6px 0 0;color:#858a91}.bf-modal header small{color:#a89562;letter-spacing:.12em;font-weight:800}
    .bf-modal header button{flex:0 0 auto;width:40px;height:40px;background:#151618;color:#aaa;border:1px solid #343536;border-radius:8px;font-size:25px;line-height:1;cursor:pointer}
    .bf-modal header button:hover{color:#fff;border-color:#817044}
    .bf-summary{display:flex;gap:10px;margin:18px 0}.bf-summary div{background:#121315;border:1px solid #292a2b;border-radius:8px;padding:12px 25px;text-align:center}.bf-summary b,.bf-summary span{display:block}.bf-summary b{font-size:1.2rem;color:#e4d5a7}.bf-summary span{font-size:.6rem;color:#777}
    .bf-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.bf-grid article{background:#151719;border:1px solid #292b2e;border-radius:9px;padding:14px}.bf-top{display:flex;justify-content:space-between;gap:10px}.bf-top strong{font-size:.9rem}.bf-top em{font-style:normal;color:#dfc675;font-size:.55rem}.bf-grid article>small,.bf-grid article>p,.bf-grid article>span{color:#777d84;font-size:.65rem}.bf-grid article p{min-height:30px}.bf-bar{height:6px;background:#242529;margin:7px 0;border-radius:4px;overflow:hidden}.bf-bar i{display:block;height:100%;background:linear-gradient(90deg,#6e5a2c,#d2b86d)}
    @media(max-width:700px){.bf-grid{grid-template-columns:1fr}.bf-overlay{padding:10px}.bf-modal{max-height:92vh;padding:16px}.bf-launch{padding-inline:12px}}
  `;
  document.head.appendChild(st);
  inject();
})();

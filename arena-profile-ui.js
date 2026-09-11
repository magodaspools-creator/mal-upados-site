// Painel de perfil da Arena: mostra o set completo e o XP total acumulado.
// Isolado para não alterar combate, loja ou progressão existentes.
(()=>{
  const STYLE_ID='arena-profile-ui-style';
  const SET_ID='arenaEquipmentSet';

  function totalXp(){
    if(typeof game==='undefined'||!game)return 0;
    const level=Math.max(1,Number(game.level)||1);
    const current=Math.max(0,Number(game.xp)||0);
    const completed=level-1;
    return Math.floor(100*completed + 65*completed*(completed-1)/2 + current);
  }

  function itemFor(slot){
    const id=game?.shopEquipped?.[slot];
    if(id&&typeof SHOP_ITEMS!=='undefined'){
      const item=SHOP_ITEMS.find(x=>x.id===id);
      if(item)return item;
    }
    const fallback={
      weapon:{name:'Espada de Bronze',icon:'⚔️',bonus:''},
      armor:{name:'Leather Armor',icon:'🛡️',bonus:''},
      legs:{name:'Nenhuma',icon:'—',bonus:''},
      boots:{name:'Nenhuma',icon:'—',bonus:''},
      helmets:{name:'Nenhum',icon:'—',bonus:''},
      rings:{name:'Nenhum',icon:'—',bonus:''}
    };
    return fallback[slot]||fallback.weapon;
  }

  function renderSet(){
    const box=document.getElementById(SET_ID);
    if(!box||typeof game==='undefined'||!game)return;
    const slots=[
      ['weapon','Arma'],
      ['armor','Armadura'],
      ['legs','Legs'],
      ['boots','Boots'],
      ['helmets','Helmet'],
      ['rings','Ring']
    ];
    box.innerHTML=slots.map(([slot,label])=>{
      const item=itemFor(slot);
      const bonus=item.bonus||'';
      return `<div class="arena-set-slot"><span class="arena-set-icon">${item.icon||'•'}</span><div><small>${label}</small><strong>${esc(item.name)}</strong>${bonus?`<em>${esc(bonus)}</em>`:''}</div></div>`;
    }).join('');
  }

  function installStyle(){
    if(document.getElementById(STYLE_ID))return;
    const style=document.createElement('style');
    style.id=STYLE_ID;
    style.textContent=`
      .character-panel>.equipment{display:none}
      .arena-set-details{margin:12px 0 2px;border:1px solid var(--line);background:#101216}
      .arena-set-details>summary{list-style:none;cursor:pointer;padding:10px 11px;color:var(--gold2);font-size:.64rem;font-weight:800;letter-spacing:1px;text-transform:uppercase}
      .arena-set-details>summary::-webkit-details-marker{display:none}
      .arena-set-details>summary::after{content:'+';float:right;color:var(--muted);font-size:.85rem}
      .arena-set-details[open]>summary::after{content:'−'}
      .arena-set-grid{display:grid;grid-template-columns:1fr 1fr;border-top:1px solid var(--line)}
      .arena-set-slot{display:flex;align-items:center;gap:8px;min-width:0;padding:9px;border-bottom:1px solid #202329}
      .arena-set-slot:nth-child(odd){border-right:1px solid #202329}
      .arena-set-slot:nth-last-child(-n+2){border-bottom:0}
      .arena-set-icon{width:26px;height:26px;display:grid;place-items:center;border:1px solid var(--line);background:#111318;font-size:.95rem;flex:0 0 26px}
      .arena-set-slot div{min-width:0}
      .arena-set-slot small,.arena-set-slot strong,.arena-set-slot em{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
      .arena-set-slot small{font-size:.5rem;color:var(--muted);text-transform:uppercase;letter-spacing:.7px}
      .arena-set-slot strong{font-size:.6rem;margin-top:2px}
      .arena-set-slot em{font-size:.48rem;color:var(--gold2);font-style:normal;margin-top:2px}
      @media(max-width:620px){.arena-set-grid{grid-template-columns:1fr}.arena-set-slot:nth-child(odd){border-right:0}.arena-set-slot:nth-last-child(-n+2){border-bottom:1px solid #202329}.arena-set-slot:last-child{border-bottom:0}}
    `;
    document.head.appendChild(style);
  }

  function installMarkup(){
    const grid=document.querySelector('.character-panel .stat-grid');
    if(!grid||document.querySelector('.arena-set-details'))return;
    const details=document.createElement('details');
    details.className='arena-set-details';
    details.innerHTML='<summary>Set equipado</summary><div class="arena-set-grid" id="'+SET_ID+'"></div>';
    grid.insertAdjacentElement('afterend',details);
    installStyle();
  }

  function updateTotalXp(){
    const el=document.getElementById('arenaXp');
    if(el)el.textContent=fmt(totalXp());
  }

  function init(){
    installMarkup();
    if(typeof window.renderPlayer==='function'&&!window.__arenaProfileWrapped){
      const original=window.renderPlayer;
      window.renderPlayer=function(){
        original();
        installMarkup();
        updateTotalXp();
        renderSet();
      };
      window.__arenaProfileWrapped=true;
    }
    updateTotalXp();
    renderSet();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
  setTimeout(init,300);
})();

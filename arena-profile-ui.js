// Painel de perfil da Arena: mostra o set completo e o XP total acumulado.
// Isolado para não alterar combate, loja ou progressão existentes.
(()=>{
  const STYLE_ID='arena-profile-ui-style';
  const SET_ID='arenaEquipmentSet';
  const TOTAL_XP_ID='arenaTotalXp';

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
      ['helmets','Helmet','top'],
      ['armor','Armadura','armor'],
      ['legs','Legs','legs'],
      ['boots','Boots','boots'],
      ['weapon','Arma','weapon'],
      ['rings','Ring','ring']
    ];
    const member=(typeof members!=='undefined'&&Array.isArray(members))?members.find(m=>m.name===game.character):null;
    const vocation=member?.vocation||'Aventureiro';
    box.innerHTML=`
      <div class="arena-equipment-stage">
        <div class="arena-slot-wrap slot-head">${slotHtml(slots[0])}</div>
        <div class="arena-slot-wrap slot-weapon">${slotHtml(slots[4])}</div>
        <div class="arena-character-core"><div class="arena-character-glow"></div><div class="arena-character-avatar">${VOC_ICONS[vocation]||'⚔'}</div><small>${esc(vocation)}</small></div>
        <div class="arena-slot-wrap slot-armor">${slotHtml(slots[1])}</div>
        <div class="arena-slot-wrap slot-ring">${slotHtml(slots[5])}</div>
        <div class="arena-slot-wrap slot-legs">${slotHtml(slots[2])}</div>
        <div class="arena-slot-wrap slot-boots">${slotHtml(slots[3])}</div>
      </div>`;
  }

  function slotHtml([slot,label,pos]){
    const item=itemFor(slot);
    const bonus=item.bonus||'';
    return `<div class="arena-equipment-slot" title="${esc(item.name)}"><div class="arena-item-icon">${item.icon||'•'}</div><small>${label}</small><strong>${esc(item.name)}</strong>${bonus?`<em>${esc(bonus)}</em>`:''}</div>`;
  }

  function installStyle(){
    if(document.getElementById(STYLE_ID))return;
    const style=document.createElement('style');
    style.id=STYLE_ID;
    style.textContent=`
      .arena-set-details{margin:12px 0 2px;border:1px solid #3b3e43;background:linear-gradient(145deg,#15171a,#0d0f11);box-shadow:inset 0 0 0 1px rgba(255,255,255,.025),0 8px 20px rgba(0,0,0,.22)}
      .arena-set-details>summary{list-style:none;cursor:pointer;padding:10px 11px;color:var(--gold2);font-size:.64rem;font-weight:800;letter-spacing:1px;text-transform:uppercase;border-bottom:1px solid transparent}
      .arena-set-details>summary::-webkit-details-marker{display:none}
      .arena-set-details>summary::after{content:'+';float:right;color:var(--muted);font-size:.85rem}
      .arena-set-details[open]>summary{border-bottom-color:#2b2e33}
      .arena-set-details[open]>summary::after{content:'−'}
      .arena-set-grid{padding:12px 8px 11px;background:radial-gradient(circle at 50% 45%,#1b1d20 0,#111315 48%,#0d0f11 100%)}
      .arena-equipment-stage{position:relative;display:grid;grid-template-columns:1fr 1.18fr 1fr;grid-template-rows:auto auto auto;gap:7px;align-items:center;min-height:292px;padding:4px 2px}
      .arena-slot-wrap{display:flex;justify-content:center;min-width:0}
      .arena-equipment-slot{width:74px;min-height:72px;padding:5px 3px 6px;box-sizing:border-box;border:2px solid #4b4e53;border-top-color:#666a70;border-left-color:#666a70;background:linear-gradient(145deg,#25282d 0,#17191c 55%,#111316 100%);box-shadow:inset 0 0 0 1px #0a0b0d,0 3px 7px rgba(0,0,0,.4);text-align:center;position:relative}
      .arena-equipment-slot:before{content:'';position:absolute;inset:2px;border:1px solid rgba(255,255,255,.035);pointer-events:none}
      .arena-item-icon{width:34px;height:34px;margin:1px auto 3px;display:grid;place-items:center;font-size:1.45rem;filter:drop-shadow(0 2px 2px rgba(0,0,0,.65))}
      .arena-equipment-slot small,.arena-equipment-slot strong,.arena-equipment-slot em{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;position:relative}
      .arena-equipment-slot small{font-size:.42rem;color:#858a92;text-transform:uppercase;letter-spacing:.55px}
      .arena-equipment-slot strong{font-size:.49rem;color:#d5d7db;margin-top:2px}
      .arena-equipment-slot em{font-size:.4rem;color:var(--gold2);font-style:normal;margin-top:2px}
      .slot-head{grid-column:2;grid-row:1}
      .slot-weapon{grid-column:1;grid-row:2}
      .slot-armor{grid-column:3;grid-row:2}
      .slot-ring{grid-column:1;grid-row:3}
      .slot-legs{grid-column:2;grid-row:3}
      .slot-boots{grid-column:3;grid-row:3}
      .arena-character-core{grid-column:2;grid-row:2;align-self:stretch;display:flex;flex-direction:column;align-items:center;justify-content:center;min-width:0;position:relative}
      .arena-character-core:before{content:'';position:absolute;width:86px;height:118px;border:1px solid #3c3f44;background:linear-gradient(180deg,rgba(255,255,255,.018),rgba(0,0,0,.12));clip-path:polygon(50% 0,72% 9%,85% 25%,77% 45%,73% 67%,90% 100%,10% 100%,27% 67%,23% 45%,15% 25%,28% 9%);opacity:.72}
      .arena-character-glow{position:absolute;width:72px;height:92px;background:radial-gradient(ellipse,rgba(206,167,76,.14),transparent 68%);filter:blur(3px)}
      .arena-character-avatar{position:relative;width:56px;height:70px;display:grid;place-items:center;font-size:2.7rem;border:1px solid #34373c;background:radial-gradient(circle at 50% 35%,#29251b,#121416 72%);box-shadow:inset 0 0 18px rgba(0,0,0,.45),0 0 12px rgba(197,155,59,.08);z-index:1}
      .arena-character-core small{position:relative;z-index:2;margin-top:5px;padding:2px 5px;border:1px solid #383b40;background:#0e1012;color:#999da5;font-size:.45rem;text-transform:uppercase;letter-spacing:.7px}
      @media(max-width:620px){.arena-equipment-stage{min-height:272px;gap:5px}.arena-equipment-slot{width:68px;min-height:68px}.arena-item-icon{font-size:1.3rem;width:30px;height:30px}.arena-character-avatar{width:50px;height:62px;font-size:2.35rem}.arena-character-core:before{width:76px;height:106px}}
    `;
    document.head.appendChild(style);
  }

  function installMarkup(){
    const grid=document.querySelector('.character-panel .stat-grid');
    if(!grid)return;
    let details=document.querySelector('.arena-set-details');
    if(!details){
      details=document.createElement('details');
      details.className='arena-set-details';
      details.innerHTML='<summary>Set equipado</summary><div class="arena-set-grid" id="'+SET_ID+'"></div>';
      grid.insertAdjacentElement('afterend',details);
    }
    installStyle();
  }

  function updateTotalXp(){
    const el=document.getElementById(TOTAL_XP_ID)||document.getElementById('arenaXp');
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

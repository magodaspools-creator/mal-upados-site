// Inventário visual da Backpack.
// Abre a mochila do personagem sem alterar as regras de combate ou compra.
(()=>{
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const empty=`<div class="backpack-empty-slot"><span>＋</span><small>Vazio</small></div>`;

  function item(id){
    return typeof SHOP_ITEMS!=='undefined'?SHOP_ITEMS.find(x=>x.id===id):null;
  }
  function ownedSpecials(){
    if(typeof game==='undefined'||!game||typeof SHOP_ITEMS==='undefined')return [];
    return SHOP_ITEMS.filter(x=>game.shopOwned?.includes(x.id)&&(x.category==='amulets'||x.category==='trinkets'));
  }
  function backpack(){return window.arenaBackpacks?.current?.()||null}

  function render(){
    const modal=document.getElementById('backpackModal');
    if(!modal||typeof game==='undefined'||!game)return;
    const bp=backpack();
    const capacity=bp?.slots||0;
    const items=ownedSpecials();
    const used=items.length;
    const content=document.getElementById('backpackContent');
    const title=document.getElementById('backpackTitle');
    const meta=document.getElementById('backpackMeta');
    if(title)title.textContent=bp?.name||'Backpack';
    if(meta)meta.innerHTML=bp?`<strong>${used}/${capacity}</strong> slots ocupados · ${Math.max(0,capacity-used)} livres`:'Equipe uma Backpack para abrir seu inventário.';
    if(!content)return;
    if(!bp){content.innerHTML=`<div class="backpack-locked"><div class="backpack-big-icon">🎒</div><strong>Nenhuma Backpack equipada</strong><span>Compre uma Backpack na loja para liberar seu inventário.</span></div>`;return;}
    const slots=[];
    for(let i=0;i<capacity;i++){
      const current=items[i];
      slots.push(current?`<div class="backpack-inv-slot filled"><div class="backpack-item-icon">${sprite(current)}</div><strong>${esc(current.name)}</strong><small>${esc(current.category==='amulets'?'Amuleto':'Trinket')}</small></div>`:empty);
    }
    content.innerHTML=`<div class="backpack-slots">${slots.join('')}</div><div class="backpack-note">O Amuleto equipado fica no seu equipamento. A Backpack guarda todos os Amuletos e Trinkets que você possui.</div>`;
  }

  function sprite(it){
    const n=String(it?.name||'').toLowerCase();
    let c='#aeb4bd';
    if(n.includes('earth'))c='#78a85d';else if(n.includes('fire'))c='#df7448';else if(n.includes('energy'))c='#6e91d9';else if(n.includes('frost'))c='#67b8d4';else if(n.includes('death'))c='#9f8bc4';else if(n.includes('demon'))c='#9f78c2';
    return `<svg viewBox="0 0 32 32" aria-hidden="true" shape-rendering="crispEdges"><path fill="#20242a" d="M16 3l9 8-3 14-6 4-6-4-3-14z"/><path fill="${c}" d="M16 6l6 6-2 10-4 3-4-3-2-10z"/><path fill="#e7eaee" d="M14 9h4v10h-4z"/></svg>`;
  }

  function open(){render();document.getElementById('backpackModal')?.classList.add('open');document.body.classList.add('backpack-modal-open')}
  function close(){document.getElementById('backpackModal')?.classList.remove('open');document.body.classList.remove('backpack-modal-open')}

  function install(){
    const panel=document.querySelector('.character-panel');
    if(!panel||document.getElementById('backpackOpenBtn'))return;
    const btn=document.createElement('button');
    btn.id='backpackOpenBtn';btn.type='button';btn.className='backpack-open-btn';btn.innerHTML='<span>🎒</span><span>ABRIR BACKPACK</span><b id="backpackQuickCount">0/0</b>';
    btn.addEventListener('click',open);
    const reset=document.getElementById('resetBtn');
    panel.insertBefore(btn,reset||null);

    const modal=document.createElement('div');
    modal.id='backpackModal';modal.className='backpack-modal';modal.innerHTML=`<div class="backpack-modal-backdrop" data-close-backpack></div><div class="backpack-window" role="dialog" aria-modal="true" aria-labelledby="backpackTitle"><div class="backpack-head"><div><div class="eyebrow">Inventário</div><h2 id="backpackTitle">Backpack</h2><p id="backpackMeta"></p></div><button type="button" class="backpack-close" data-close-backpack aria-label="Fechar">×</button></div><div id="backpackContent"></div></div>`;
    document.body.appendChild(modal);
    modal.querySelectorAll('[data-close-backpack]').forEach(x=>x.addEventListener('click',close));
    document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
    updateQuick();
  }

  function updateQuick(){
    const el=document.getElementById('backpackQuickCount');if(!el)return;
    const bp=backpack();const used=ownedSpecials().length;el.textContent=bp?`${used}/${bp.slots}`:'—';
  }

  function style(){
    if(document.getElementById('arena-backpack-ui-style'))return;
    const s=document.createElement('style');s.id='arena-backpack-ui-style';s.textContent=`
      .backpack-open-btn{width:100%;margin:10px 0 8px;padding:10px 12px;border:1px solid #514b3b;background:linear-gradient(145deg,#211f1a,#141311);color:var(--gold2);display:flex;align-items:center;gap:9px;cursor:pointer;font-size:.65rem;font-weight:800;letter-spacing:.8px}.backpack-open-btn span:first-child{font-size:1rem}.backpack-open-btn b{margin-left:auto;color:#d5d7db;font-size:.58rem}.backpack-open-btn:hover{border-color:#82734f;background:#242016}
      .backpack-modal{position:fixed;inset:0;z-index:99999;display:none;align-items:center;justify-content:center;padding:18px}.backpack-modal.open{display:flex}.backpack-modal-backdrop{position:absolute;inset:0;background:rgba(0,0,0,.76);backdrop-filter:blur(3px)}
      .backpack-window{position:relative;width:min(560px,100%);max-height:min(700px,90vh);overflow:auto;border:1px solid #57534a;background:linear-gradient(145deg,#17191c,#0d0f11);box-shadow:0 20px 70px rgba(0,0,0,.7);padding:18px;color:#d7d9dd}.backpack-head{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:1px solid #303338;padding-bottom:12px;margin-bottom:14px}.backpack-head h2{margin:2px 0 3px;font-family:Cinzel,serif}.backpack-head p{margin:0;color:#858a92;font-size:.68rem}.backpack-head p strong{color:var(--gold2)}.backpack-close{width:34px;height:34px;border:1px solid #3c4046;background:#111316;color:#aaaeb5;font-size:1.3rem;cursor:pointer}.backpack-close:hover{color:#fff;border-color:#777}
      .backpack-slots{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}.backpack-inv-slot,.backpack-empty-slot{min-height:102px;border:2px solid #41454b;background:linear-gradient(145deg,#24272c,#121417);display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:8px;box-sizing:border-box}.backpack-empty-slot{border-color:#292d32;opacity:.65}.backpack-empty-slot span{font-size:1.4rem;color:#454a51}.backpack-empty-slot small{color:#626770;font-size:.55rem;margin-top:5px}.backpack-item-icon{width:48px;height:48px;display:grid;place-items:center;margin-bottom:5px}.backpack-item-icon svg{width:44px;height:44px;image-rendering:pixelated;filter:drop-shadow(0 2px 3px #000)}.backpack-inv-slot strong{font-size:.56rem;color:#d9dce1;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.backpack-inv-slot small{font-size:.48rem;color:var(--gold2);margin-top:3px}.backpack-note{margin-top:12px;padding:10px;border:1px solid #292d32;background:#111316;color:#777d86;font-size:.62rem;line-height:1.5}.backpack-locked{min-height:180px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;border:1px dashed #3b3e43;color:#777d86}.backpack-big-icon{font-size:3rem;margin-bottom:8px}.backpack-locked strong{color:#d7d9dd}.backpack-locked span{font-size:.65rem;margin-top:5px}@media(max-width:620px){.backpack-modal{padding:10px}.backpack-window{padding:14px}.backpack-slots{grid-template-columns:repeat(3,minmax(0,1fr));gap:7px}.backpack-inv-slot,.backpack-empty-slot{min-height:92px;padding:5px}.backpack-item-icon{width:40px;height:40px}.backpack-item-icon svg{width:36px;height:36px}}
    `;document.head.appendChild(s)
  }

  function boot(){style();install();setInterval(()=>{updateQuick();if(document.getElementById('backpackModal')?.classList.contains('open'))render()},500)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();

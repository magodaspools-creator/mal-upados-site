// Fluxo dos itens especiais: Amuletos/Trinkets são equipados exclusivamente pela Backpack.
(()=>{
  const SPECIAL=['amulets','trinkets'];
  function item(id){return typeof SHOP_ITEMS!=='undefined'?SHOP_ITEMS.find(x=>x.id===id):null}
  function openBackpack(){document.getElementById('backpackOpenBtn')?.click()}
  function popup(it){
    document.getElementById('arenaSpecialPurchasePopup')?.remove();
    const el=document.createElement('div');el.id='arenaSpecialPurchasePopup';el.className='arena-special-popup-overlay';
    el.innerHTML=`<div class="arena-special-popup"><button class="arena-special-popup-close" type="button">×</button><div class="arena-special-popup-icon">${it.category==='amulets'?'✦':'◆'}</div><div class="eyebrow">Item adquirido</div><h2>${esc(it.name)}</h2><p>${esc(it.bonus||'Item especial da Arena')}</p><strong>Abra sua Backpack para equipar este item.</strong><button type="button" class="btn active" id="arenaOpenBackpackFromPopup">🎒 ABRIR BACKPACK</button></div>`;
    document.body.appendChild(el);const close=()=>el.remove();el.querySelector('.arena-special-popup-close').onclick=close;el.querySelector('#arenaOpenBackpackFromPopup').onclick=()=>{close();openBackpack()};el.addEventListener('click',e=>{if(e.target===el)close()});
  }
  function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
  function style(){if(document.getElementById('arena-special-items-ui-style'))return;const s=document.createElement('style');s.id='arena-special-items-ui-style';s.textContent=`.arena-special-popup-overlay{position:fixed;inset:0;z-index:100000;display:flex;align-items:center;justify-content:center;padding:18px;background:rgba(0,0,0,.76);backdrop-filter:blur(3px)}.arena-special-popup{position:relative;width:min(430px,100%);padding:24px 22px;text-align:center;border:1px solid #5d5748;background:linear-gradient(145deg,#1a1b1e,#0d0f11);box-shadow:0 20px 70px rgba(0,0,0,.8);color:#d8dbe0}.arena-special-popup-icon{font-size:2.4rem;color:var(--gold2);margin-bottom:6px}.arena-special-popup h2{font-family:Cinzel,serif;margin:5px 0}.arena-special-popup p{margin:6px 0 15px;color:#9da3ad;font-size:.7rem}.arena-special-popup strong{display:block;margin-bottom:16px;color:#d5d7db;font-size:.68rem}.arena-special-popup-close{position:absolute;right:10px;top:10px;width:30px;height:30px;border:1px solid #3c4046;background:#111316;color:#aaaeb5;font-size:1.2rem;cursor:pointer}.arena-special-popup-close:hover{color:#fff;border-color:#777}`;document.head.appendChild(s)}
  function install(){
    style();
    const box=document.getElementById('shopItems');if(!box||box.__specialUi)return;
    box.__specialUi=true;
    box.addEventListener('click',e=>{
      const btn=e.target.closest('button');if(!btn)return;const card=btn.closest('.shop-item');if(!card)return;const it=item(btn.dataset.id);if(!it||!SPECIAL.includes(it.category))return;
      const owned=game?.shopOwned?.includes(it.id);
      if(owned){e.preventDefault();e.stopImmediatePropagation();openBackpack();return;}
      setTimeout(()=>{if(game?.shopOwned?.includes(it.id))popup(it)},50);
    },true);
  }
  function refreshShopButtons(){
    const box=document.getElementById('shopItems');if(!box)return;
    box.querySelectorAll('.shop-item').forEach(card=>{const btn=card.querySelector('button');if(!btn)return;const it=item(btn.dataset.id);if(!it||!SPECIAL.includes(it.category)||!game?.shopOwned?.includes(it.id))return;btn.textContent='🎒 Abrir Backpack';btn.classList.remove('active');});
  }
  function boot(){install();refreshShopButtons();setInterval(()=>{install();refreshShopButtons()},700)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();

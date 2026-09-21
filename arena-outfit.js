(()=>{ 
 const STORAGE_KEY='mage_outfit_config';
 const DEFAULT={head:'#d6a06d',body:'#3f7cff',legs:'#7a4fd0',feet:'#8b5a2b',addons:{hat:false,weapon:false}};
 let ready=false;

 function readSaved(){
  try{
   const raw=localStorage.getItem(STORAGE_KEY);
   if(!raw)return null;
   const value=JSON.parse(raw);
   return value&&typeof value==='object'?value:null;
  }catch(e){return null}
 }

 function normalize(value){
  const saved=value&&typeof value==='object'?value:{};
  return {
   head:saved.head||DEFAULT.head,
   body:saved.body||DEFAULT.body,
   legs:saved.legs||saved.details||DEFAULT.legs,
   feet:saved.feet||DEFAULT.feet,
   addons:{
    ...DEFAULT.addons,
    ...(saved.addons&&typeof saved.addons==='object'?saved.addons:{})
   }
  };
 }

 function getPlayer(){
  if(typeof game!=='undefined'&&game)return game;
  return null;
 }

 function loadOutfitConfig(){
  const player=getPlayer();
  const saved=readSaved();
  if(!player)return false;
  player.outfit=normalize(saved||player.outfit);
  window.arenaMageColors={
   ...(window.arenaMageColors||{}),
   head:player.outfit.head,
   body:player.outfit.body,
   legs:player.outfit.legs,
   feet:player.outfit.feet,
   details:player.outfit.legs
  };
  return true;
 }

 function saveOutfitConfig(){
  const player=getPlayer();
  if(!player)return;
  player.outfit=normalize(player.outfit);
  localStorage.setItem(STORAGE_KEY,JSON.stringify(player.outfit));
  window.arenaMageColors={
   ...(window.arenaMageColors||{}),
   head:player.outfit.head,
   body:player.outfit.body,
   legs:player.outfit.legs,
   feet:player.outfit.feet,
   details:player.outfit.legs
  };
  try{if(typeof persist==='function')persist()}catch(e){}
  window.dispatchEvent(new CustomEvent('arena-outfit-changed',{detail:player.outfit}));
 }

 function ensureStyle(){
  if(document.getElementById('arena-outfit-style'))return;
  const style=document.createElement('style');
  style.id='arena-outfit-style';
  style.textContent=`
   #arenaOutfitModal{position:fixed;inset:0;z-index:10000;display:none;align-items:center;justify-content:center;padding:20px;background:rgba(0,0,0,.78)}
   #arenaOutfitModal.open{display:flex}
   .arena-outfit-card{width:min(620px,96vw);max-height:90vh;overflow:auto;background:#111316;border:1px solid rgba(190,151,78,.5);box-shadow:0 18px 60px rgba(0,0,0,.65);padding:22px}
   .arena-outfit-head{display:flex;align-items:flex-start;justify-content:space-between;gap:14px;border-bottom:1px solid #2b3037;padding-bottom:14px}
   .arena-outfit-head h2{margin:3px 0 0;color:#e7c66d;font:900 1.25rem Cinzel,serif}
   .arena-outfit-close{border:1px solid #45403a;background:#17150f;color:#d9dce0;padding:7px 11px;cursor:pointer}
   .arena-outfit-body{display:grid;grid-template-columns:180px 1fr;gap:22px;margin-top:18px}
   .arena-outfit-preview{display:flex;align-items:center;justify-content:center;min-height:180px;background:#0b0d0f;border:1px solid #2f3338;image-rendering:pixelated}
   #arenaOutfitCanvas{width:144px;height:144px;image-rendering:pixelated}
   .arena-outfit-fields{display:grid;gap:10px}
   .arena-outfit-color{display:grid;grid-template-columns:1fr auto;align-items:center;gap:10px;padding:9px 10px;border:1px solid #2b3037;background:#151719;color:#bfc4cb;font-size:.7rem;text-transform:uppercase}
   .arena-outfit-color input{width:48px;height:30px;padding:0;border:0;background:transparent;cursor:pointer}
   .arena-outfit-note{margin:14px 0 0;color:#747b84;font-size:.65rem;line-height:1.5}
   .arena-outfit-actions{display:flex;justify-content:flex-end;gap:8px;margin-top:18px}
   @media(max-width:600px){.arena-outfit-body{grid-template-columns:1fr}.arena-outfit-preview{min-height:150px}}
  `;
  document.head.appendChild(style);
 }

 function ensureModal(){
  if(document.getElementById('arenaOutfitModal'))return;
  ensureStyle();
  const modal=document.createElement('div');
  modal.id='arenaOutfitModal';
  modal.innerHTML=`
   <div class="arena-outfit-card" role="dialog" aria-modal="true" aria-labelledby="arenaOutfitTitle">
    <div class="arena-outfit-head">
     <div><div class="eyebrow">Personalização</div><h2 id="arenaOutfitTitle">Customizar Outfit</h2></div>
     <button type="button" class="arena-outfit-close" id="arenaOutfitClose">Fechar</button>
    </div>
    <div class="arena-outfit-body">
     <div class="arena-outfit-preview"><canvas id="arenaOutfitCanvas" width="96" height="96"></canvas></div>
     <div>
      <div class="arena-outfit-fields">
       <label class="arena-outfit-color">Cabeça / cabelo <input type="color" id="arenaOutfitHead"></label>
       <label class="arena-outfit-color">Peito / corpo <input type="color" id="arenaOutfitBody"></label>
       <label class="arena-outfit-color">Calça / perneiras <input type="color" id="arenaOutfitLegs"></label>
       <label class="arena-outfit-color">Pés / sapatos <input type="color" id="arenaOutfitFeet"></label>
      </div>
      <p class="arena-outfit-note">As cores ficam salvas neste navegador e continuam aplicadas quando você voltar ao jogo. O preview usa o mesmo renderizador do Mage da Arena.</p>
     </div>
    </div>
    <div class="arena-outfit-actions"><button type="button" class="btn active" id="arenaOutfitSave">Salvar Outfit</button></div>
   </div>`;
  document.body.appendChild(modal);
  modal.addEventListener('click',e=>{if(e.target===modal)closeOutfitModal()});
  document.getElementById('arenaOutfitClose').onclick=closeOutfitModal;
  document.getElementById('arenaOutfitSave').onclick=()=>{applyForm();saveOutfitConfig();renderPreview();closeOutfitModal()};
  ['arenaOutfitHead','arenaOutfitBody','arenaOutfitLegs','arenaOutfitFeet'].forEach(id=>document.getElementById(id).addEventListener('input',renderPreview));
 }

 function applyForm(){
  const player=getPlayer();
  if(!player)return;
  player.outfit=normalize({
   head:document.getElementById('arenaOutfitHead').value,
   body:document.getElementById('arenaOutfitBody').value,
   legs:document.getElementById('arenaOutfitLegs').value,
   feet:document.getElementById('arenaOutfitFeet').value,
   addons:player.outfit?.addons
  });
  window.arenaMageColors={...(window.arenaMageColors||{}),head:player.outfit.head,body:player.outfit.body,legs:player.outfit.legs,feet:player.outfit.feet,details:player.outfit.legs};
  if(typeof mageCanvasCache!=='undefined')mageCanvasCache.clear();
 }

 function renderPreview(){
  const canvas=document.getElementById('arenaOutfitCanvas');
  if(!canvas)return;
  const ctx=canvas.getContext('2d');
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.imageSmoothingEnabled=false;
  const dir=2;
  const frame=0;
  const src=typeof window.__arenaMageOutfitPreview==='function'?window.__arenaMageOutfitPreview(frame,dir):'';
  if(!src)return;
  const img=new Image();
  img.onload=()=>{ctx.clearRect(0,0,canvas.width,canvas.height);ctx.drawImage(img,0,0,canvas.width,canvas.height)};
  img.src=src;
 }

 function openOutfitModal(){
  ensureModal();
  loadOutfitConfig();
  const player=getPlayer();
  const outfit=normalize(player?.outfit);
  document.getElementById('arenaOutfitHead').value=outfit.head;
  document.getElementById('arenaOutfitBody').value=outfit.body;
  document.getElementById('arenaOutfitLegs').value=outfit.legs;
  document.getElementById('arenaOutfitFeet').value=outfit.feet;
  document.getElementById('arenaOutfitModal').classList.add('open');
  renderPreview();
 }

 function closeOutfitModal(){document.getElementById('arenaOutfitModal')?.classList.remove('open')}

 function boot(){
  ready=true;
  ensureStyle();
  loadOutfitConfig();
  if(typeof renderAll==='function')renderAll();
  let tries=0;
  const timer=setInterval(()=>{
   if(loadOutfitConfig()||++tries>100){clearInterval(timer);if(typeof renderAll==='function')renderAll()}
  },100);
 }

 window.saveOutfitConfig=saveOutfitConfig;
 window.openOutfitModal=openOutfitModal;
 window.closeOutfitModal=closeOutfitModal;
 window.loadOutfitConfig=loadOutfitConfig;
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
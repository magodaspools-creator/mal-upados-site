(()=> {
const ROOT='arena-godot/characters/';
const DIRS=['south','west','north','east'], DI={south:2,west:3,north:0,east:1};
const SETS={
 mage:[{base:6673,mask:6674},{base:6675,mask:6676},{base:6677,mask:6678}],
 paladin:[{base:6311,mask:6312},{base:6319,mask:6320},{base:6327,mask:6328}]
};
const DEF={direction:'south',addon1:false,addon2:false,colors:{head:'#d6a06d',body:'#3f7cff',legs:'#7a4fd0',feet:'#8b5a2b'}};
let temp=null,voc='mage',imgs=new Map();
const clone=x=>JSON.parse(JSON.stringify(x));
const rgb=h=>{const s=String(h||'').replace('#','');return /^[0-9a-fA-F]{6}$/.test(s)?[parseInt(s.slice(0,2),16),parseInt(s.slice(2,4),16),parseInt(s.slice(4,6),16)]:[255,255,255]};
const img=src=>{if(imgs.has(src))return imgs.get(src);const i=new Image();i.crossOrigin='anonymous';i.decoding='async';i.src=src;imgs.set(src,i);return i};
function getVoc(){try{const r=typeof window.arenaSurviveCurrent==='function'?window.arenaSurviveCurrent():null;const v=String(r?.vocation||'').toLowerCase();if(v.includes('paladin')||v.includes('paladino'))return'paladin';}catch(e){}return'mage'}
function visual(){return temp.addon2?2:temp.addon1?1:0}
function pair(){const set=SETS[voc]||SETS.mage,v=set[visual()]||set[0],d=DI[temp.direction]??2;return{base:ROOT+(v.base+d*2)+'.png',mask:ROOT+(v.mask+d*2)+'.png'}}
function render(){
 const c=document.getElementById('outfit-preview-canvas');if(!c||!temp)return;const x=c.getContext('2d');x.clearRect(0,0,c.width,c.height);
 const p=pair(),b=img(p.base),m=img(p.mask);if(!b.complete||!m.complete||!b.naturalWidth||!m.naturalWidth){b.onload=render;m.onload=render;return}
 const w=b.naturalWidth,h=b.naturalHeight,q=document.createElement('canvas');q.width=w;q.height=h;const z=q.getContext('2d');z.imageSmoothingEnabled=false;z.drawImage(b,0,0);
 const bi=z.getImageData(0,0,w,h),mc=document.createElement('canvas');mc.width=w;mc.height=h;const mx=mc.getContext('2d');mx.drawImage(m,0,0);const mi=mx.getImageData(0,0,w,h).data;
 const col={head:rgb(temp.colors.head),body:rgb(temp.colors.body),legs:rgb(temp.colors.legs),feet:rgb(temp.colors.feet)};
 for(let i=0;i<bi.data.length;i+=4){if(!mi[i+3])continue;const r=mi[i],g=mi[i+1],bb=mi[i+2];let t=null;if(r>180&&g>180&&bb<120)t=col.head;else if(r>180&&g<120&&bb<120)t=col.body;else if(r<120&&g>150&&bb<150)t=col.legs;else if(r<120&&g<150&&bb>150)t=col.feet;if(t){bi.data[i]=t[0];bi.data[i+1]=t[1];bi.data[i+2]=t[2]}}
 z.putImageData(bi,0,0);x.imageSmoothingEnabled=false;const s=Math.min(c.width/w,c.height/h),dw=w*s,dh=h*s;x.drawImage(q,(c.width-dw)/2,(c.height-dh)/2,dw,dh)
}
function read(){temp.addon1=document.getElementById('chk-addon1').checked;temp.addon2=document.getElementById('chk-addon2').checked;['head','body','legs','feet'].forEach(k=>temp.colors[k]=document.getElementById('color-'+k).value)}
function form(){document.getElementById('chk-addon1').checked=temp.addon1;document.getElementById('chk-addon2').checked=temp.addon2;['head','body','legs','feet'].forEach(k=>document.getElementById('color-'+k).value=temp.colors[k])}
window.updateOutfitPreview=()=>{if(!temp)return;read();render()};
window.rotatePreview=d=>{const i=DIRS.indexOf(temp.direction);temp.direction=DIRS[(i+(d==='right'?1:-1)+4)%4];render()};
window.openOutfitModal=()=>{voc=getVoc();const s=window.arenaOutfitConfig||window.game?.arenaMode?.outfit||{};temp=clone({...DEF,...s,colors:{...DEF.colors,...(s.colors||{})}});form();document.getElementById('outfit-modal').style.display='flex';render()};
window.closeOutfitModal=()=>{document.getElementById('outfit-modal').style.display='none';temp=null};
window.saveOutfitConfig=()=>{if(!temp)return;read();const s=clone(temp);s.visual=visual();window.arenaOutfitConfig=s;try{if(window.game){window.game.arenaMode=window.game.arenaMode||{};window.game.arenaMode.outfit=s;window.game.arenaMode.outfitColors={head:s.colors.head,body:s.colors.body,details:s.colors.legs,feet:s.colors.feet}}if(typeof window.persist==='function')window.persist()}catch(e){}window.dispatchEvent(new CustomEvent('arena:outfitChanged',{detail:s}));window.closeOutfitModal()};
function boot(){
 if(document.getElementById('outfit-modal'))return;
 const css=['#outfit-modal{position:fixed;inset:0;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,.76);z-index:9999;padding:18px}', '#outfit-modal .outfit-box{width:min(520px,96vw);background:#242424;border:2px solid #66583e;box-shadow:0 18px 55px rgba(0,0,0,.7);color:#eee;padding:14px;font:12px monospace,sans-serif}', '#outfit-modal h2{margin:0 0 12px;color:#dfc06a;font:700 18px Cinzel,serif}', '#outfit-modal .outfit-content{display:grid;grid-template-columns:150px 1fr;gap:16px}', '#outfit-modal .preview-container{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:190px;background:#171717;border:1px solid #464646;padding:10px}', '#outfit-modal #outfit-preview-canvas{width:128px;height:128px;image-rendering:pixelated}', '#outfit-modal .preview-controls{display:flex;gap:6px;margin-top:8px}', '#outfit-modal button{border:1px solid #5a5a5a;background:#353535;color:#eee;padding:6px 12px;cursor:pointer}', '#outfit-modal button:hover{background:#4a4a4a}', '#outfit-modal .outfit-options{display:flex;flex-direction:column;gap:12px}', '#outfit-modal h3{margin:0 0 6px;color:#c7a95b;font-size:12px;text-transform:uppercase}', '#outfit-modal label{display:flex;align-items:center;gap:7px;margin:6px 0}', '#outfit-modal .color-picker-row{display:flex;align-items:center;justify-content:space-between;margin:5px 0}', '#outfit-modal input[type=color]{width:32px;height:26px;padding:0;border:1px solid #555;background:transparent;cursor:pointer}', '#outfit-modal .modal-actions{display:flex;justify-content:flex-end;gap:8px;margin-top:14px;padding-top:10px;border-top:1px solid #444}', '#outfit-modal .btn-confirm{border-color:#8b7135;background:#4a3a1c;color:#efd27a}'].join('');
 const st=document.createElement('style');st.id='arena-outfit-modal-style';st.textContent=css;document.head.appendChild(st);
 document.body.insertAdjacentHTML('beforeend','<div id="outfit-modal"><div class="outfit-box" role="dialog" aria-modal="true"><h2>Personalizar Outfit</h2><div class="outfit-content"><div class="preview-container"><canvas id="outfit-preview-canvas" width="128" height="128"></canvas><div class="preview-controls"><button type="button" onclick="rotatePreview(\'left\')">◀</button><button type="button" onclick="rotatePreview(\'right\')">▶</button></div></div><div class="outfit-options"><div><h3>Addons</h3><label><input type="checkbox" id="chk-addon1" onchange="updateOutfitPreview()"> Addon 1</label><label><input type="checkbox" id="chk-addon2" onchange="updateOutfitPreview()"> Addon 2</label></div><div><h3>Cores</h3><div class="color-picker-row"><span>Cabelo / Cabeça</span><input type="color" id="color-head" value="#d6a06d"></div><div class="color-picker-row"><span>Corpo / Peito</span><input type="color" id="color-body" value="#3f7cff"></div><div class="color-picker-row"><span>Calça / Perneiras</span><input type="color" id="color-legs" value="#7a4fd0"></div><div class="color-picker-row"><span>Sapatos / Pés</span><input type="color" id="color-feet" value="#8b5a2b"></div></div></div></div><div class="modal-actions"><button type="button" onclick="closeOutfitModal()">Cancelar</button><button type="button" class="btn-confirm" onclick="saveOutfitConfig()">OK / Salvar</button></div></div></div>');
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.getElementById('outfit-modal')?.style.display==='flex')closeOutfitModal()});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
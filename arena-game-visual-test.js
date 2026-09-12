// Arena Visual Test — grounded combat loop: idle -> approach -> attack -> return
(()=>{
 const ID='arenaSceneCanvas';
 const FOREST='https://opengameart.org/sites/default/files/forest-level-4-sheet_0.png';
 const PLAYER_WALK='https://raw.githubusercontent.com/pierpo/phaser3-simple-rpg/master/assets/spritesheets/hero/walk/hero-walk-side.png';
 const PLAYER_ATTACK='https://raw.githubusercontent.com/pierpo/phaser3-simple-rpg/master/assets/spritesheets/hero/attack/hero-attack-side.png';
 const PLAYER_ATTACK_WEAPON='https://raw.githubusercontent.com/pierpo/phaser3-simple-rpg/master/assets/spritesheets/hero/attack-weapon/hero-attack-side-weapon.png';
 const NPC='https://raw.githubusercontent.com/pierpo/phaser3-simple-rpg/master/assets/npc.png';
 let forest=null,walk=null,attack=null,attackWeapon=null,npc=null,ready=false;
 let lastLog='',lastHp='',actionStart=0,actionUntil=0,hitUntil=0;
 const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
 const esc=v=>String(v??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
 const img=src=>{const i=new Image();i.crossOrigin='anonymous';i.src=src;return i};
 function css(){if(document.getElementById('arena-visual-test-style'))return;const s=document.createElement('style');s.id='arena-visual-test-style';s.textContent=`
 .arena-scene-wrap{position:relative;margin:14px 0;border:1px solid #57472d;background:#10170f;overflow:hidden;box-shadow:0 10px 35px rgba(0,0,0,.35)}
 #${ID}{display:block;width:100%;height:auto;aspect-ratio:16/7;image-rendering:pixelated;background:#1b2b18}
 .arena-scene-hud{position:absolute;inset:10px 12px auto;display:flex;justify-content:space-between;pointer-events:none;font:800 10px Inter,sans-serif;letter-spacing:.08em;text-transform:uppercase;text-shadow:0 2px 5px #000;color:#ead48a}
 .arena-scene-label{padding:5px 8px;background:rgba(9,14,8,.72);border:1px solid rgba(224,190,104,.35)}
 .arena-scene-note{margin-top:7px;color:#747c72;font-size:10px;text-align:center}
 .arena-fighter-icon{display:none!important}`;document.head.appendChild(s)}
 function setup(){css();const battle=document.querySelector('#arenaGameMode .arena-game-battle');if(!battle||document.getElementById(ID))return !!battle;const wrap=document.createElement('div');wrap.className='arena-scene-wrap';wrap.innerHTML=`<canvas id="${ID}" width="1280" height="560"></canvas><div class="arena-scene-hud"><span class="arena-scene-label">ARENA · FLORESTA</span><span class="arena-scene-label" id="arenaSceneWave">WAVE 1</span></div>`;battle.parentNode.insertBefore(wrap,battle);const note=document.createElement('div');note.className='arena-scene-note';note.textContent='Parado até atacar · aproximação · ataque · retorno';wrap.after(note);return true}
 function loadAssets(){
  const assets=[FOREST,PLAYER_WALK,PLAYER_ATTACK,PLAYER_ATTACK_WEAPON,NPC].map(img);
  [forest,walk,attack,attackWeapon,npc]=assets;let n=0;const done=()=>{if(++n>=assets.length){ready=true;render()}};assets.forEach(i=>{i.onload=done;i.onerror=done});
 }
 function safe(c,i,sx,sy,sw,sh,dx,dy,dw,dh){if(i&&i.complete&&i.naturalWidth)c.drawImage(i,sx,sy,sw,sh,dx,dy,dw,dh)}
 function drawForest(c,w,h){c.imageSmoothingEnabled=false;c.fillStyle='#6e8a43';c.fillRect(0,0,w,h);if(forest&&forest.naturalWidth){for(let y=0;y<h;y+=80)for(let x=0;x<w;x+=120){const ox=((x/120)|0)%3===0?0:32;safe(c,forest,ox,32,32,24,x,y,128,96)}const trees=[[0,0,32,32],[32,0,16,32],[48,0,32,32]],spots=[[45,28,3],[150,5,2.4],[280,35,3.1],[420,8,2.5],[580,28,3.2],[760,5,2.7],[910,30,3.1],[1090,8,2.6],[1190,34,3]];spots.forEach(([x,y,sc],idx)=>{const t=trees[idx%trees.length];safe(c,forest,t[0],t[1],t[2],t[3],x,y,t[2]*sc*2.8,t[3]*sc*2.8)});for(let i=0;i<22;i++){const x=(i*83)%w,y=360+((i*47)%150);safe(c,forest,0,32,16,16,x,y,48,48)}}c.fillStyle='rgba(83,105,53,.55)';c.beginPath();c.ellipse(w*.5,h*.75,w*.34,h*.17,0,0,Math.PI*2);c.fill()}
 function groundShadow(c,x,y,w){c.save();c.fillStyle='rgba(0,0,0,.48)';c.beginPath();c.ellipse(x,y,w,w*.22,0,0,Math.PI*2);c.fill();c.restore()}
 function playerSprite(c,x,y,state,frame){
  const fw=32,fh=32,scale=3,w=fw*scale,h=fh*scale;
  const sheet=state==='attack'?(attackWeapon&&attackWeapon.complete&&attackWeapon.naturalWidth?attackWeapon:attack):walk;
  const col=state==='attack'?(frame%3):0;
  groundShadow(c,x,y+1,38);
  c.save();c.translate(x,y);c.imageSmoothingEnabled=false;
  c.drawImage(sheet,col*fw,0,fw,fh,-w/2,-h,w,h);
  c.restore();
 }
 function npcSprite(c,x,y,frame,hit){
  const fw=16,fh=16,scale=3,w=fw*scale,h=fh*scale;
  groundShadow(c,x,y+1,38);
  const shake=hit?Math.sin(Date.now()/35)*5:0;
  c.save();c.translate(x+shake,y);c.imageSmoothingEnabled=false;
  c.drawImage(npc,(frame%3)*fw,0,fw,fh,-w/2,-h,w,h);
  if(hit){c.globalAlpha=.65;c.fillStyle='#fff';c.fillRect(-w/2,-h,w,h)}
  c.restore();
 }
 function startAction(){actionStart=Date.now();actionUntil=actionStart+700}
 function render(){
  const canvas=document.getElementById(ID);if(!canvas)return;const c=canvas.getContext('2d');const W=canvas.width,H=canvas.height;drawForest(c,W,H);
  const enemy=document.getElementById('arenaEnemyName')?.textContent||'Inimigo';
  const wave=document.getElementById('arenaWaveTitle')?.textContent||'Onda 1';
  const hpText=document.getElementById('arenaEnemyHpText')?.textContent||'';
  const log=document.getElementById('arenaGameLog')?.textContent||'';
  if(log!==lastLog){
   if(log.includes('Você causou'))startAction();
   else if(log.includes('causou'))hitUntil=Date.now()+220;
  }
  lastLog=log;
  const hpChanged=lastHp!==hpText;if(hpChanged&&lastHp)hitUntil=Date.now()+220;lastHp=hpText;
  const now=Date.now();
  if(actionUntil&&now>actionUntil){actionStart=0;actionUntil=0}
  const active=actionStart>0&&now<actionUntil;
  const elapsed=active?now-actionStart:0;
  let state='idle',frame=0,x=W*.29;
  // Idle: completely still. Only an attack input starts this sequence.
  // 0-260ms: walk toward the enemy. 260-500ms: attack. 500-700ms: walk back.
  if(active){
   if(elapsed<260){state='walk';frame=Math.floor(elapsed/90)%3;x=W*.29+(W*.09)*(elapsed/260)}
   else if(elapsed<500){state='attack';frame=Math.min(2,Math.floor((elapsed-260)/80));x=W*.29+W*.09}
   else {state='walk';frame=Math.floor((elapsed-500)/80)%3;x=W*.29+W*.09*(1-(elapsed-500)/200)}
  }
  const groundY=H*.82;
  playerSprite(c,x,groundY,state,frame);
  npcSprite(c,W*.71,groundY,0,now<hitUntil);
  if(active&&state==='attack'){
   const p=(elapsed-260)/240,ix=W*.38+(W*.33)*p;
   c.save();c.globalAlpha=Math.sin(Math.PI*p);c.fillStyle='#ffe9a3';c.beginPath();c.arc(ix,groundY-55,11+7*Math.sin(Math.PI*p),0,Math.PI*2);c.fill();c.fillStyle='#fff7d2';c.fillRect(ix-3,groundY-58,6,6);c.restore()
  }
  c.fillStyle='rgba(7,10,7,.76)';c.fillRect(W*.5-120,18,240,34);c.fillStyle='#e6cc7b';c.font='700 15px Cinzel,serif';c.textAlign='center';c.fillText(wave,W*.5,41);
  c.fillStyle='#f0dfb0';c.font='700 12px Inter,sans-serif';c.fillText(esc(enemy),W*.71,H*.18);
  const m=hpText.match(/([\d\.]+)\s*\/\s*([\d\.]+)/);if(m){const cur=parseFloat(m[1].replace(/\./g,''))||0,max=parseFloat(m[2].replace(/\./g,''))||1,bw=220,bh=10,bx=W*.71-bw/2,by=H*.25;c.fillStyle='#121714';c.fillRect(bx,by,bw,bh);c.fillStyle='#9f4c48';c.fillRect(bx,by,bw*clamp(cur/max,0,1),bh);c.strokeStyle='rgba(255,255,255,.2)';c.strokeRect(bx,by,bw,bh)}
  if(!ready){c.fillStyle='rgba(0,0,0,.6)';c.fillRect(0,0,W,H);c.fillStyle='#f0dfb0';c.font='700 18px Inter,sans-serif';c.textAlign='center';c.fillText('Carregando sprites...',W/2,H/2)}
 }
 function observe(){if(!setup())return setTimeout(observe,350);if(!forest)loadAssets();const root=document.getElementById('arenaGameMode');if(!root)return;new MutationObserver(render).observe(root,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['style','class']});window.addEventListener('resize',render);setInterval(render,50);render()}
 function boot(){if(!document.getElementById('arenaGameMode'))return setTimeout(boot,350);observe()};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
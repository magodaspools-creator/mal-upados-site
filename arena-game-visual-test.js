// Arena Visual Test — directional CC0 pixel-art sprites + battle animation
// Sources: ansimuz Tiny RPG Forest / phaser3-simple-rpg.
(()=>{
 const ID='arenaSceneCanvas';
 const FOREST='https://opengameart.org/sites/default/files/forest-level-4-sheet_0.png';
 const PLAYER_SIDE='https://raw.githubusercontent.com/pierpo/phaser3-simple-rpg/master/assets/spritesheets/hero/walk/hero-walk-side.png';
 const PLAYER_IDLE_SIDE='https://raw.githubusercontent.com/pierpo/phaser3-simple-rpg/master/assets/spritesheets/hero/idle/hero-idle-side.png';
 const PLAYER_ATTACK_SIDE='https://raw.githubusercontent.com/pierpo/phaser3-simple-rpg/master/assets/spritesheets/hero/attack-weapon/hero-attack-side-weapon.png';
 const PLAYER_DOWN='https://raw.githubusercontent.com/pierpo/phaser3-simple-rpg/master/assets/spritesheets/hero/walk/hero-walk-front.png';
 const MOLE_SIDE='https://raw.githubusercontent.com/pierpo/phaser3-simple-rpg/master/assets/spritesheets/mole/walk/mole-walk-side.png';
 const MOLE_IDLE='https://raw.githubusercontent.com/pierpo/phaser3-simple-rpg/master/assets/spritesheets/mole/idle/mole-idle-front.png';
 let forest=null,playerSide=null,playerIdle=null,playerAttack=null,playerDown=null,moleSide=null,moleIdle=null,ready=false,attackUntil=0,lastLog='';
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
 function setup(){css();const battle=document.querySelector('#arenaGameMode .arena-game-battle');if(!battle||document.getElementById(ID))return !!battle;const wrap=document.createElement('div');wrap.className='arena-scene-wrap';wrap.innerHTML=`<canvas id="${ID}" width="1280" height="560"></canvas><div class="arena-scene-hud"><span class="arena-scene-label">ARENA · FLORESTA</span><span class="arena-scene-label" id="arenaSceneWave">WAVE 1</span></div>`;battle.parentNode.insertBefore(wrap,battle);const note=document.createElement('div');note.className='arena-scene-note';note.textContent='Pixel-art CC0 · direção + idle + caminhada + ataque';wrap.after(note);return true}
 function loadAssets(){
  forest=img(FOREST);playerSide=img(PLAYER_SIDE);playerIdle=img(PLAYER_IDLE_SIDE);playerAttack=img(PLAYER_ATTACK_SIDE);playerDown=img(PLAYER_DOWN);moleSide=img(MOLE_SIDE);moleIdle=img(MOLE_IDLE);
  let n=0;const done=()=>{if(++n>=7){ready=true;render()}};
  [forest,playerSide,playerIdle,playerAttack,playerDown,moleSide,moleIdle].forEach(i=>{i.onload=done;i.onerror=done});
 }
 function drawImageSafe(c,i,sx,sy,sw,sh,dx,dy,dw,dh){if(i&&i.complete&&i.naturalWidth)c.drawImage(i,sx,sy,sw,sh,dx,dy,dw,dh)}
 function drawForest(c,w,h){c.imageSmoothingEnabled=false;c.fillStyle='#6e8a43';c.fillRect(0,0,w,h);if(forest&&forest.naturalWidth){for(let y=0;y<h;y+=80)for(let x=0;x<w;x+=120){const ox=((x/120)|0)%3===0?0:32;drawImageSafe(c,forest,ox,32,32,24,x,y,128,96)}const trees=[[0,0,32,32],[32,0,16,32],[48,0,32,32]],spots=[[45,28,3],[150,5,2.4],[280,35,3.1],[420,8,2.5],[580,28,3.2],[760,5,2.7],[910,30,3.1],[1090,8,2.6],[1190,34,3]];spots.forEach(([x,y,sc],idx)=>{const t=trees[idx%trees.length];drawImageSafe(c,forest,t[0],t[1],t[2],t[3],x,y,t[2]*sc*2.8,t[3]*sc*2.8)});for(let i=0;i<22;i++){const x=(i*83)%w,y=360+((i*47)%150);drawImageSafe(c,forest,0,32,16,16,x,y,48,48)}}c.fillStyle='rgba(83,105,53,.55)';c.beginPath();c.ellipse(w*.5,h*.73,w*.34,h*.19,0,0,Math.PI*2);c.fill();c.fillStyle='rgba(222,202,135,.16)';c.beginPath();c.ellipse(w*.5,h*.72,w*.22,h*.08,0,0,Math.PI*2);c.fill()}
 function shadow(c,x,y,w){c.fillStyle='rgba(0,0,0,.42)';c.beginPath();c.ellipse(x,y,w,w*.28,0,0,Math.PI*2);c.fill()}
 function drawSheet(c,i,x,y,frameW,frameH,cols,frame,scale,flip=false,attack=false,bob=true,tint=false){if(!i||!i.complete||!i.naturalWidth)return;const dw=frameW*scale,dh=frameH*scale;const by=bob?Math.sin(Date.now()/220)*1.5:0;shadow(c,x,y+2,Math.max(20,frameW*.75));c.save();c.imageSmoothingEnabled=false;c.translate(x,y+by);if(flip)c.scale(-1,1);if(tint)c.filter='hue-rotate(85deg) saturate(1.3) brightness(.82)';const col=frame%cols;c.drawImage(i,col*frameW,0,frameW,frameH,-dw/2,-dh,dw,dh);c.filter='none';c.restore()}
 function render(){const canvas=document.getElementById(ID);if(!canvas)return;const c=canvas.getContext('2d');const W=canvas.width,H=canvas.height;drawForest(c,W,H);const enemy=document.getElementById('arenaEnemyName')?.textContent||'Inimigo',wave=document.getElementById('arenaWaveTitle')?.textContent||'Onda 1',hpText=document.getElementById('arenaEnemyHpText')?.textContent||'',log=document.getElementById('arenaGameLog')?.textContent||'';if(log!==lastLog&&log.includes('dano'))attackUntil=Date.now()+480;lastLog=log;const now=Date.now(),attacking=now<attackUntil;const walkFrame=Math.floor(now/170)%3;const moleFrame=Math.floor(now/210)%4;
  const playerX=W*.29,enemyX=W*.71,baseY=H*.80;
  // Player always faces the enemy: right-facing side sprite. During attack use the dedicated weapon animation.
  if(attacking){const attackFrame=Math.floor((480-(attackUntil-now))/160)%3;drawSheet(c,playerAttack,playerX,baseY,32,32,3,attackFrame,3.35,false,true,true);}
  else {drawSheet(c,playerIdle,playerX,baseY,32,32,1,0,3.35,false,false,true);}
  // Enemy uses a real 4-frame side-walk sheet instead of flipping a generic 16x16 frame.
  drawSheet(c,moleSide,enemyX,baseY,24,24,4,moleFrame,3.9,true,false,true,true);
  if(attacking){c.fillStyle='rgba(255,239,170,.9)';c.fillRect(W*.49,H*.47,10,10);c.fillRect(W*.515,H*.445,6,6)}
  c.fillStyle='rgba(7,10,7,.76)';c.fillRect(W*.5-120,18,240,34);c.fillStyle='#e6cc7b';c.font='700 15px Cinzel,serif';c.textAlign='center';c.fillText(wave,W*.5,41);c.fillStyle='#f0dfb0';c.font='700 12px Inter,sans-serif';c.fillText(esc(enemy),enemyX,H*.18);const m=hpText.match(/([\d\.]+)\s*\/\s*([\d\.]+)/);if(m){const cur=parseFloat(m[1].replace(/\./g,''))||0,max=parseFloat(m[2].replace(/\./g,''))||1,bw=220,bh=10,bx=enemyX-bw/2,by=H*.25;c.fillStyle='#121714';c.fillRect(bx,by,bw,bh);c.fillStyle='#9f4c48';c.fillRect(bx,by,bw*clamp(cur/max,0,1),bh);c.strokeStyle='rgba(255,255,255,.2)';c.strokeRect(bx,by,bw,bh)}if(!ready){c.fillStyle='rgba(0,0,0,.6)';c.fillRect(0,0,W,H);c.fillStyle='#f0dfb0';c.font='700 18px Inter,sans-serif';c.textAlign='center';c.fillText('Carregando sprites...',W/2,H/2)}}
 function observe(){if(!setup())return setTimeout(observe,350);if(!forest)loadAssets();const root=document.getElementById('arenaGameMode');if(!root)return;new MutationObserver(render).observe(root,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['style','class']});window.addEventListener('resize',render);setInterval(render,60);render()}
 function boot(){if(!document.getElementById('arenaGameMode'))return setTimeout(boot,350);observe()};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
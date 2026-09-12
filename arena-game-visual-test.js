// Arena Visual Test — cena 2D original em Canvas, sem assets externos
(()=>{
 const ID='arenaSceneCanvas';
 const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
 const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function css(){
  if(document.getElementById('arena-visual-test-style'))return;
  const s=document.createElement('style');s.id='arena-visual-test-style';s.textContent=`
   .arena-scene-wrap{position:relative;margin:14px 0;border:1px solid #4a3d2b;background:#080b10;overflow:hidden;box-shadow:inset 0 0 60px rgba(0,0,0,.65)}
   #${ID}{display:block;width:100%;height:auto;aspect-ratio:16/7;image-rendering:auto}
   .arena-scene-hud{position:absolute;inset:10px 12px auto;display:flex;justify-content:space-between;pointer-events:none;font:800 10px Inter,sans-serif;letter-spacing:.08em;text-transform:uppercase;text-shadow:0 2px 5px #000;color:#d8c27c}
   .arena-scene-label{padding:5px 8px;background:rgba(8,10,13,.62);border:1px solid rgba(185,151,84,.3);backdrop-filter:blur(3px)}
   .arena-scene-note{margin-top:7px;color:#6f7782;font-size:10px;text-align:center}
   .arena-fighter-icon{display:none!important}
  `;document.head.appendChild(s)
 }
 function setup(){
  css();
  const battle=document.querySelector('#arenaGameMode .arena-game-battle');
  if(!battle||document.getElementById(ID))return false;
  const wrap=document.createElement('div');wrap.className='arena-scene-wrap';
  wrap.innerHTML=`<canvas id="${ID}" width="1280" height="560"></canvas><div class="arena-scene-hud"><span class="arena-scene-label" id="arenaSceneZone">ARENA · CAMPO DE BATALHA</span><span class="arena-scene-label" id="arenaSceneWave">WAVE 1</span></div>`;
  battle.parentNode.insertBefore(wrap,battle);
  const note=document.createElement('div');note.className='arena-scene-note';note.textContent='Protótipo visual · cenário e personagens desenhados em Canvas 2D';wrap.after(note);
  render();
  return true;
 }
 function rounded(c,x,y,w,h,r){c.beginPath();c.roundRect(x,y,w,h,r);}
 function drawGround(c,w,h){
  const sky=c.createLinearGradient(0,0,0,h);sky.addColorStop(0,'#101b2b');sky.addColorStop(.52,'#172434');sky.addColorStop(1,'#080d12');c.fillStyle=sky;c.fillRect(0,0,w,h);
  const moon=c.createRadialGradient(w*.76,h*.2,5,w*.76,h*.2,75);moon.addColorStop(0,'rgba(238,220,164,.9)');moon.addColorStop(.2,'rgba(238,220,164,.2)');moon.addColorStop(1,'rgba(238,220,164,0)');c.fillStyle=moon;c.fillRect(0,0,w,h);
  c.fillStyle='#0a1018';for(let i=0;i<13;i++){const x=i*w/12;c.beginPath();c.moveTo(x,h*.56);c.lineTo(x+w*.025,h*.32-Math.sin(i)*20);c.lineTo(x+w*.06,h*.56);c.fill()}
  const g=c.createLinearGradient(0,h*.53,0,h);g.addColorStop(0,'#27322d');g.addColorStop(1,'#0d1414');c.fillStyle=g;c.fillRect(0,h*.52,w,h*.48);
  c.strokeStyle='rgba(190,171,123,.12)';c.lineWidth=2;for(let i=0;i<18;i++){const y=h*.58+i*i*1.05;c.beginPath();c.moveTo(0,y);c.lineTo(w,y-30);c.stroke()}
  // ruins
  c.fillStyle='#222b30';for(const r of [[80,235,85,105],[190,270,62,70],[1030,245,90,95],[1130,280,58,60]]){c.fillRect(...r);c.fillStyle='#303a3e';c.fillRect(r[0]+10,r[1]-14,r[2]-20,14);c.fillStyle='#222b30'}
  // torches
  for(const x of [125,1100]){c.fillStyle='#55452c';c.fillRect(x,h*.45,5,55);const f=c.createRadialGradient(x+2,h*.43,2,x+2,h*.43,38);f.addColorStop(0,'rgba(255,220,122,.95)');f.addColorStop(1,'rgba(255,120,40,0)');c.fillStyle=f;c.fillRect(x-35,h*.39,75,75)}
 }
 function shadow(c,x,y,rx,ry){c.fillStyle='rgba(0,0,0,.42)';c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fill()}
 function drawPlayer(c,x,y,scale,attack){
  c.save();c.translate(x,y);c.scale(scale,scale);shadow(c,0,38,55,13);
  // cape
  c.fillStyle='#4b2633';c.beginPath();c.moveTo(-24,-54);c.lineTo(-50,35);c.lineTo(5,43);c.lineTo(25,-42);c.closePath();c.fill();
  // legs
  c.fillStyle='#252b34';c.fillRect(-19,22,13,28);c.fillRect(7,22,13,28);
  // boots
  c.fillStyle='#15181d';c.fillRect(-23,45,20,8);c.fillRect(5,45,20,8);
  // torso armor
  const metal=c.createLinearGradient(-28,-30,28,30);metal.addColorStop(0,'#8e9aa1');metal.addColorStop(.45,'#4b5961');metal.addColorStop(1,'#202a30');c.fillStyle=metal;rounded(c,-28,-38,56,66,8);c.fill();
  // belt
  c.fillStyle='#9b783e';c.fillRect(-29,14,58,7);c.fillStyle='#d2ad5e';c.fillRect(-4,12,8,11);
  // head + helmet
  c.fillStyle='#c99772';c.beginPath();c.arc(0,-58,19,0,Math.PI*2);c.fill();c.fillStyle='#68757d';c.beginPath();c.arc(0,-62,22,Math.PI,Math.PI*2);c.fill();c.fillRect(-22,-63,44,8);
  // visor
  c.fillStyle='#1b2227';c.fillRect(-13,-61,26,7);
  // shield
  c.fillStyle='#7a3e39';c.beginPath();c.arc(-34,4,20,0,Math.PI*2);c.fill();c.strokeStyle='#b99655';c.lineWidth=3;c.stroke();
  // sword
  c.save();c.translate(29,2);c.rotate(attack?-0.65:-0.25);c.fillStyle='#d8dde0';c.beginPath();c.moveTo(0,-5);c.lineTo(55,-9);c.lineTo(62,0);c.lineTo(55,9);c.lineTo(0,5);c.closePath();c.fill();c.fillStyle='#9b783e';c.fillRect(-7,-5,10,10);c.restore();
  c.restore();
 }
 function drawEnemy(c,x,y,scale,boss,kind){
  c.save();c.translate(x,y);c.scale(scale,scale);shadow(c,0,40,60,14);
  const skin=boss?'#642e2d':'#4b5b46';
  // legs
  c.fillStyle='#20252a';c.fillRect(-24,20,16,31);c.fillRect(8,20,16,31);
  // body
  c.fillStyle=skin;rounded(c,-34,-40,68,72,12);c.fill();
  // shoulders
  c.fillStyle=boss?'#8c5b3c':'#566b54';c.beginPath();c.arc(-35,-15,17,0,Math.PI*2);c.arc(35,-15,17,0,Math.PI*2);c.fill();
  // head
  c.fillStyle=skin;c.beginPath();c.arc(0,-58,25,0,Math.PI*2);c.fill();
  // horns/crown for bosses
  if(boss){c.fillStyle='#c39b45';c.beginPath();c.moveTo(-23,-75);c.lineTo(-7,-94);c.lineTo(0,-77);c.lineTo(9,-94);c.lineTo(24,-75);c.closePath();c.fill()}
  // eyes
  c.fillStyle='#e7b34b';c.fillRect(-13,-60,8,6);c.fillRect(5,-60,8,6);
  // mouth
  c.fillStyle='#1a1516';c.fillRect(-13,-46,26,7);
  // weapon
  c.strokeStyle=boss?'#d0a45b':'#9aa3a7';c.lineWidth=8;c.beginPath();c.moveTo(27,5);c.lineTo(72,-43);c.stroke();c.lineWidth=3;c.strokeStyle='#e1e5e6';c.beginPath();c.moveTo(48,-19);c.lineTo(86,-58);c.stroke();
  // scale accent by creature family
  if(kind.includes('Dragon')){c.fillStyle='rgba(120,180,200,.55)';for(let i=0;i<5;i++)c.fillRect(-25+i*12,-10,7,7)}
  if(kind.includes('Demon')||kind.includes('Death')){c.fillStyle='#8d3d35';c.beginPath();c.arc(-30,-5,6,0,7);c.arc(30,-5,6,0,7);c.fill()}
  c.restore();
 }
 function render(){
  const canvas=document.getElementById(ID);if(!canvas)return;const c=canvas.getContext('2d');const w=canvas.width,h=canvas.height;drawGround(c,w,h);
  const enemy=document.getElementById('arenaEnemyName')?.textContent||'Inimigo';const boss=(document.getElementById('arenaWaveTitle')?.textContent||'').includes('BOSS');const wave=document.getElementById('arenaWaveTitle')?.textContent||'Onda 1';
  const hpText=document.getElementById('arenaEnemyHpText')?.textContent||'';const attack=(document.getElementById('arenaGameLog')?.textContent||'').includes('causou');
  drawPlayer(c,w*.27,h*.73,1.12,attack);drawEnemy(c,w*.73,h*.73,boss?1.22:1.05,boss,enemy);
  c.fillStyle='rgba(0,0,0,.5)';rounded(c,w*.5-95,24,190,34,5);c.fill();c.fillStyle='#e4c775';c.font='700 15px Cinzel,serif';c.textAlign='center';c.fillText(wave,w*.5,47);
  c.fillStyle='#9ea5ad';c.font='11px Inter,sans-serif';c.fillText(esc(enemy),w*.73,h*.18);
  // enemy health bar
  const maxText=hpText.match(/([\d\.]+)\s*\/\s*([\d\.]+)/);if(maxText){const cur=parseFloat(maxText[1].replace('.','').replace(',','.'))||0,max=parseFloat(maxText[2].replace('.','').replace(',','.'))||1;const bw=230,bh=9,bx=w*.73-bw/2,by=h*.28;c.fillStyle='#171a1d';c.fillRect(bx,by,bw,bh);c.fillStyle=boss?'#b44c45':'#8e4b45';c.fillRect(bx,by,bw*clamp(cur/max,0,1),bh)}
 }
 function observe(){
  const root=document.getElementById('arenaGameMode');if(!root)return;setup();const observer=new MutationObserver(()=>render());observer.observe(root,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['style','class']});window.addEventListener('resize',render);render();
 }
 function boot(){if(!document.getElementById('arenaGameMode')){setTimeout(boot,300);return}observe()}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();

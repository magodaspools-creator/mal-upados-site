// Arena Visual Test — real CC0 pixel-art assets
// Sources: ansimuz Tiny RPG Forest / phaser3-simple-rpg + Pav Creations forest sheet.
(()=>{
  const ID='arenaSceneCanvas';
  const FOREST='https://opengameart.org/sites/default/files/forest-level-4-sheet_0.png';
  const PLAYER='https://raw.githubusercontent.com/pierpo/phaser3-simple-rpg/master/assets/player.png';
  const NPC='https://raw.githubusercontent.com/pierpo/phaser3-simple-rpg/master/assets/npc.png';
  let forest=null,player=null,npc=null,ready=false,attackUntil=0,flashUntil=0;
  const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const img=(src)=>{const i=new Image();i.crossOrigin='anonymous';i.src=src;return i};
  function css(){
    if(document.getElementById('arena-visual-test-style'))return;
    const s=document.createElement('style');s.id='arena-visual-test-style';s.textContent=`
      .arena-scene-wrap{position:relative;margin:14px 0;border:1px solid #57472d;background:#10170f;overflow:hidden;box-shadow:0 10px 35px rgba(0,0,0,.35)}
      #${ID}{display:block;width:100%;height:auto;aspect-ratio:16/7;image-rendering:pixelated;background:#1b2b18}
      .arena-scene-hud{position:absolute;inset:10px 12px auto;display:flex;justify-content:space-between;pointer-events:none;font:800 10px Inter,sans-serif;letter-spacing:.08em;text-transform:uppercase;text-shadow:0 2px 5px #000;color:#ead48a}
      .arena-scene-label{padding:5px 8px;background:rgba(9,14,8,.72);border:1px solid rgba(224,190,104,.35)}
      .arena-scene-note{margin-top:7px;color:#747c72;font-size:10px;text-align:center}
      .arena-fighter-icon{display:none!important}
    `;document.head.appendChild(s)
  }
  function setup(){
    css();
    const battle=document.querySelector('#arenaGameMode .arena-game-battle');
    if(!battle||document.getElementById(ID))return !!battle;
    const wrap=document.createElement('div');wrap.className='arena-scene-wrap';
    wrap.innerHTML=`<canvas id="${ID}" width="1280" height="560"></canvas><div class="arena-scene-hud"><span class="arena-scene-label" id="arenaSceneZone">ARENA · FLORESTA</span><span class="arena-scene-label" id="arenaSceneWave">WAVE 1</span></div>`;
    battle.parentNode.insertBefore(wrap,battle);
    const note=document.createElement('div');note.className='arena-scene-note';note.textContent='Teste visual com sprites pixel-art CC0 reais · primeira versão';wrap.after(note);
    return true;
  }
  function loadAssets(){
    forest=img(FOREST);player=img(PLAYER);npc=img(NPC);
    let n=0;const done=()=>{n++;if(n>=3){ready=true;render()}};
    [forest,player,npc].forEach(i=>{i.onload=done;i.onerror=done});
  }
  function drawImageSafe(c,i,sx,sy,sw,sh,dx,dy,dw,dh){if(i&&i.complete&&i.naturalWidth)c.drawImage(i,sx,sy,sw,sh,dx,dy,dw,dh)}
  function drawForest(c,w,h){
    c.imageSmoothingEnabled=false;
    c.fillStyle='#b8a66f';c.fillRect(0,0,w,h);
    c.fillStyle='#6e8a43';c.fillRect(0,0,w,h);
    // pixel-art grass texture
    if(forest&&forest.naturalWidth){
      for(let y=0;y<h;y+=80)for(let x=0;x<w;x+=120){
        const ox=((x/120)|0)%3===0?0:32;
        drawImageSafe(c,forest,ox,32,32,24,x,y,128,96);
      }
      const trees=[[0,0,32,32],[32,0,16,32],[48,0,32,32]];
      const spots=[[45,28,3],[150,5,2.4],[280,35,3.1],[420,8,2.5],[580,28,3.2],[760,5,2.7],[910,30,3.1],[1090,8,2.6],[1190,34,3]];
      spots.forEach(([x,y,sc],idx)=>{const t=trees[idx%trees.length];drawImageSafe(c,forest,t[0],t[1],t[2],t[3],x,y,t[2]*sc*2.8,t[3]*sc*2.8)});
      for(let i=0;i<22;i++){const x=(i*83)%w,y=360+((i*47)%150);drawImageSafe(c,forest,0,32,16,16,x,y,48,48)}
    }
    // playable clearing
    c.fillStyle='rgba(83,105,53,.55)';c.beginPath();c.ellipse(w*.5,h*.73,w*.34,h*.19,0,0,Math.PI*2);c.fill();
    c.fillStyle='rgba(222,202,135,.16)';c.beginPath();c.ellipse(w*.5,h*.72,w*.22,h*.08,0,0,Math.PI*2);c.fill();
  }
  function shadow(c,x,y,w){c.fillStyle='rgba(0,0,0,.34)';c.beginPath();c.ellipse(x,y,w,w*.28,0,0,Math.PI*2);c.fill()}
  function drawFighter(c,i,x,y,scale,flip=false,tint=false){
    if(!i||!i.complete||!i.naturalWidth)return;
    const w=48*scale,h=64*scale;shadow(c,x,y+26*scale,26*scale);
    c.save();c.imageSmoothingEnabled=false;c.translate(x,y);if(flip)c.scale(-1,1);
    if(tint){c.globalCompositeOperation='source-over';c.filter='hue-rotate(90deg) saturate(1.25) brightness(.8)'}
    const lunge=Date.now()<attackUntil?(flip?-10:10):0;c.drawImage(i,0,0,48,64,-w/2+lunge,-h,w,h);c.filter='none';c.restore();
  }
  function render(){
    const canvas=document.getElementById(ID);if(!canvas)return;const c=canvas.getContext('2d');const w=canvas.width,h=canvas.height;
    drawForest(c,w,h);
    const enemy=document.getElementById('arenaEnemyName')?.textContent||'Inimigo';
    const wave=document.getElementById('arenaWaveTitle')?.textContent||'Onda 1';
    const hpText=document.getElementById('arenaEnemyHpText')?.textContent||'';
    const log=document.getElementById('arenaGameLog')?.textContent||'';
    const attacking=log.includes('dano');
    if(attacking)attackUntil=Date.now()+170;
    drawFighter(c,player,w*.29,h*.73,2.05,false,false);
    drawFighter(c,npc,w*.71,h*.73,2.05,true,true);
    if(Date.now()<attackUntil){c.fillStyle='rgba(255,239,170,.8)';c.fillRect(w*.49,h*.48,8,8);c.fillRect(w*.515,h*.455,5,5)}
    c.fillStyle='rgba(7,10,7,.76)';c.fillRect(w*.5-120,18,240,34);c.fillStyle='#e6cc7b';c.font='700 15px Cinzel,serif';c.textAlign='center';c.fillText(wave,w*.5,41);
    c.fillStyle='#f0dfb0';c.font='700 12px Inter,sans-serif';c.fillText(esc(enemy),w*.71,h*.18);
    const m=hpText.match(/([\d\.]+)\s*\/\s*([\d\.]+)/);if(m){const cur=parseFloat(m[1].replace(/\./g,''))||0,max=parseFloat(m[2].replace(/\./g,''))||1;const bw=220,bh=10,bx=w*.71-bw/2,by=h*.25;c.fillStyle='#121714';c.fillRect(bx,by,bw,bh);c.fillStyle='#9f4c48';c.fillRect(bx,by,bw*clamp(cur/max,0,1),bh);c.strokeStyle='rgba(255,255,255,.2)';c.strokeRect(bx,by,bw,bh)}
    if(!ready){c.fillStyle='rgba(0,0,0,.6)';c.fillRect(0,0,w,h);c.fillStyle='#f0dfb0';c.font='700 18px Inter,sans-serif';c.textAlign='center';c.fillText('Carregando sprites...',w/2,h/2)}
  }
  function observe(){
    if(!setup())return setTimeout(observe,350);
    if(!forest)loadAssets();
    const root=document.getElementById('arenaGameMode');if(!root)return;
    const observer=new MutationObserver(()=>render());observer.observe(root,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['style','class']});
    window.addEventListener('resize',render);setInterval(render,180);render();
  }
  function boot(){if(!document.getElementById('arenaGameMode'))return setTimeout(boot,350);observe()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
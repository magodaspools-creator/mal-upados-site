// Rat sprite replacement for Waves.
// Uses the grey Rat SV battler from hiddenone's Resource Warehouse.
// Source: https://www.hiddenone-sprites.com/mv-enemy-sv-battlers.html
(()=>{
  const SRC='https://www.hiddenone-sprites.com/uploads/7/1/8/7/71878507/published/rat-grey-sv_2.png?1550287821=';
  const FRAME_W=64, FRAME_H=96, FRAMES=9, RATE=120;
  let frame=0, lastName='';

  function style(){
    if(document.getElementById('arena-rat-sprite-style'))return;
    const s=document.createElement('style');
    s.id='arena-rat-sprite-style';
    s.textContent=`
      #arenaGameMode .arena-fighter-icon.rat-sprite-override{background-image:none!important;}
      #arenaGameMode .arena-fighter-icon.rat-sprite-override::after{
        content:'';
        position:absolute;
        left:16px;
        top:0;
        width:${FRAME_W}px;
        height:${FRAME_H}px;
        background-image:url("${SRC}");
        background-repeat:no-repeat;
        background-size:576px 576px;
        background-position:calc(-${FRAME_W}px * var(--rat-frame,0)) 0;
        image-rendering:pixelated;
        pointer-events:none;
        z-index:5;
      }
    `;
    document.head.appendChild(s);
  }

  function tick(){
    const icon=document.getElementById('arenaEnemyIcon');
    const name=String(document.getElementById('arenaEnemyName')?.textContent||'').toLowerCase();
    if(!icon)return;
    const isRat=name.includes('rat');
    if(isRat){
      icon.classList.add('rat-sprite-override');
      if(name!==lastName){frame=0;lastName=name}
      icon.style.setProperty('--rat-frame',frame);
      frame=(frame+1)%FRAMES;
    }else{
      icon.classList.remove('rat-sprite-override');
      lastName=name;
    }
  }

  function boot(){
    style();
    tick();
    setInterval(tick,RATE);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();

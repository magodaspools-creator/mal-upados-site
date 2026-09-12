// Arena Phaser Renderer — real game loop: idle -> approach -> attack -> return
(()=>{
  const CDN='https://cdn.jsdelivr.net/npm/phaser@3.90.0/dist/phaser.min.js';
  const PLAYER_WALK='https://raw.githubusercontent.com/pierpo/phaser3-simple-rpg/master/assets/spritesheets/hero/walk/hero-walk-side.png';
  const PLAYER_ATTACK='https://raw.githubusercontent.com/pierpo/phaser3-simple-rpg/master/assets/spritesheets/hero/attack/hero-attack-side.png';
  const PLAYER_ATTACK_WEAPON='https://raw.githubusercontent.com/pierpo/phaser3-simple-rpg/master/assets/spritesheets/hero/attack-weapon/hero-attack-side-weapon.png';
  const ENEMY_WALK='https://raw.githubusercontent.com/pierpo/phaser3-simple-rpg/master/assets/spritesheets/mole/walk/mole-walk-side.png';
  const ID='arenaPhaserCanvas';
  let booted=false,sceneRef=null,queued=false;

  function css(){
    if(document.getElementById('arena-phaser-style'))return;
    const s=document.createElement('style');s.id='arena-phaser-style';s.textContent=`
      .arena-phaser-wrap{position:relative;margin:14px 0;border:1px solid #57472d;background:#10170f;overflow:hidden;box-shadow:0 10px 35px rgba(0,0,0,.35)}
      #${ID}{display:block;width:100%;height:auto;image-rendering:pixelated}
      .arena-phaser-badge{position:absolute;left:12px;top:10px;padding:5px 8px;background:rgba(9,14,8,.76);border:1px solid rgba(224,190,104,.35);color:#ead48a;font:800 10px Inter,sans-serif;letter-spacing:.08em;text-transform:uppercase;pointer-events:none}
      .arena-phaser-help{margin-top:7px;text-align:center;color:#747c72;font-size:10px}
    `;document.head.appendChild(s)
  }

  function loadPhaser(done){
    if(window.Phaser)return done();
    const old=document.querySelector('script[data-arena-phaser-cdn]');
    if(old){old.addEventListener('load',done,{once:true});return}
    const s=document.createElement('script');s.src=CDN;s.dataset.arenaPhaserCdn='1';s.onload=done;s.onerror=()=>console.warn('[Arena Phaser] CDN failed');document.head.appendChild(s);
  }

  function mount(){
    const root=document.getElementById('arenaGameMode');
    const battle=root?.querySelector('.arena-game-battle');
    if(!root||!battle)return false;
    css();
    if(document.getElementById(ID))return true;
    const oldCanvas=document.getElementById('arenaSceneCanvas');
    const oldWrap=oldCanvas?.closest('.arena-scene-wrap');
    if(oldWrap)oldWrap.remove();
    const wrap=document.createElement('div');wrap.className='arena-phaser-wrap';
    wrap.innerHTML=`<div id="${ID}"></div><div class="arena-phaser-badge">ARENA · COMBATE</div>`;
    battle.parentNode.insertBefore(wrap,battle);
    const note=document.createElement('div');note.className='arena-phaser-help';note.textContent='Parado até atacar · aproximação · ataque · retorno';wrap.after(note);
    battle.style.display='none';
    return true;
  }

  function build(){
    if(booted)return;
    if(!mount())return setTimeout(build,300);
    booted=true;
    const config={
      type:Phaser.CANVAS,
      parent:ID,
      width:960,
      height:420,
      transparent:false,
      backgroundColor:'#344f2b',
      pixelArt:true,
      render:{antialias:false,roundPixels:true},
      scene:{preload(){
        this.load.spritesheet('heroWalk',PLAYER_WALK,{frameWidth:32,frameHeight:32});
        this.load.spritesheet('heroAttack',PLAYER_ATTACK,{frameWidth:32,frameHeight:32});
        this.load.spritesheet('heroAttackWeapon',PLAYER_ATTACK_WEAPON,{frameWidth:32,frameHeight:32});
        this.load.spritesheet('moleWalk',ENEMY_WALK,{frameWidth:24,frameHeight:24});
      },create(){
        sceneRef=this;
        const w=this.scale.width,h=this.scale.height;
        this.add.rectangle(w/2,h/2,w,h,0x4f7138);
        for(let i=0;i<28;i++){
          const x=(i*137)%w,y=40+((i*83)%(h-80));
          this.add.circle(x,y,2+(i%3),0x718b49,0.65);
        }
        this.add.ellipse(w/2,h*.79,w*.7,h*.28,0x395329,0.6);
        this.player=this.add.sprite(w*.27,h*.72,'heroWalk',0).setScale(3.1).setOrigin(.5,1);
        this.enemy=this.add.sprite(w*.73,h*.72,'moleWalk',0).setScale(3.7).setOrigin(.5,1);
        this.playerHomeX=this.player.x;this.enemyHomeX=this.enemy.x;this.busy=false;
        this.add.ellipse(this.player.x,h*.72+2,74,18,0x000000,0.4);
        this.playerShadow=this.add.ellipse(this.player.x,h*.72+2,74,18,0x000000,0.4);
        this.enemyShadow=this.add.ellipse(this.enemy.x,h*.72+2,70,17,0x000000,0.4);
        this.playerShadow.setDepth(-1);this.enemyShadow.setDepth(-1);
        this.anims.create({key:'hero-walk',frames:this.anims.generateFrameNumbers('heroWalk',{start:0,end:2}),frameRate:8,repeat:-1});
        this.anims.create({key:'hero-attack',frames:this.anims.generateFrameNumbers('heroAttackWeapon',{start:0,end:2}),frameRate:9,repeat:0});
        this.anims.create({key:'hero-attack-fallback',frames:this.anims.generateFrameNumbers('heroAttack',{start:0,end:2}),frameRate:9,repeat:0});
        this.anims.create({key:'mole-idle',frames:[{key:'moleWalk',frame:0}],frameRate:1,repeat:-1});
        this.anims.create({key:'mole-hit',frames:[{key:'moleWalk',frame:1},{key:'moleWalk',frame:0}],frameRate:8,repeat:0});
        this.player.play('hero-walk');this.player.anims.stop();this.player.setFrame(0);
        this.enemy.play('mole-idle');this.enemy.anims.stop();this.enemy.setFrame(0);
        this.tweens.add({targets:this.playerShadow,scaleX:1,scaleY:1,duration:1});
        this.refreshShadows();
        if(queued){queued=false;this.playAttack()}
      },update(){this.refreshShadows()}}
    };
    try{new Phaser.Game(config)}catch(e){console.error('[Arena Phaser] boot failed',e)}
  }

  function refreshText(scene){
    const wave=document.getElementById('arenaWaveTitle')?.textContent||'Onda 1';
    if(!scene.waveText)scene.waveText=scene.add.text(scene.scale.width/2,24,wave,{fontFamily:'Cinzel',fontSize:'18px',fontStyle:'bold',color:'#e6cc7b'}).setOrigin(.5);
    else scene.waveText.setText(wave);
  }

  function playAttack(){
    if(!sceneRef){queued=true;return}
    const s=sceneRef;if(s.busy)return;
    s.busy=true;
    refreshText(s);
    const start=s.playerHomeX,target=s.enemyHomeX-105;
    s.player.anims.stop();
    s.player.play('hero-walk',true);
    s.tweens.add({targets:s.player,x:target,duration:360,ease:'Sine.easeInOut',onComplete:()=>{
      s.player.anims.stop();s.player.play('hero-attack',true);
      s.enemy.play('mole-hit',true);
      s.tweens.add({targets:s.enemy,x:s.enemyHomeX+10,duration:70,yoyo:true,repeat:1,ease:'Sine.easeOut'});
      s.time.delayedCall(340,()=>{
        s.player.play('hero-walk',true);
        s.tweens.add({targets:s.player,x:start,duration:360,ease:'Sine.easeInOut',onComplete:()=>{
          s.player.anims.stop();s.player.setFrame(0);s.busy=false;refreshText(s);
        }});
      });
    }});
  }

  function bindAttack(){
    const btn=document.getElementById('arenaAttackBtn');
    if(!btn||btn.dataset.phaserBound)return false;
    btn.dataset.phaserBound='1';
    btn.addEventListener('click',()=>playAttack(),true);
    return true;
  }

  function wait(){
    if(!document.getElementById('arenaGameMode'))return setTimeout(wait,300);
    if(!bindAttack())setTimeout(wait,300);
    loadPhaser(build);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wait,{once:true});else wait();
  window.arenaPhaserCombat={playAttack};
})();

// D6 3D da Arena — dado realmente tridimensional em CSS 3D.
(()=>{
  if(window.__arenaCrit3DInstalled)return;
  window.__arenaCrit3DInstalled=true;

  const FACES={1:[4],2:[0,8],3:[0,4,8],4:[0,2,6,8],5:[0,2,4,6,8],6:[0,2,3,5,6,8]};

  const dots=n=>`<div class="arena3d-dots">${Array.from({length:9},(_,i)=>`<i class="${FACES[n].includes(i)?'on':''}"></i>`).join('')}</div>`;
  const cube=n=>`
    <div class="arena3d-cube">
      <div class="arena3d-face front">${dots(n)}</div>
      <div class="arena3d-face back">${dots(n)}</div>
      <div class="arena3d-face right">${dots(n)}</div>
      <div class="arena3d-face left">${dots(n)}</div>
      <div class="arena3d-face top">${dots(n)}</div>
      <div class="arena3d-face bottom">${dots(n)}</div>
    </div>`;

  function installStyle(){
    if(document.getElementById('arena-3d-dice-style'))return;
    const s=document.createElement('style');s.id='arena-3d-dice-style';
    s.textContent=`
      #battleArea{position:relative}
      .arena3d-overlay{position:absolute;inset:0;z-index:999;display:flex;align-items:center;justify-content:center;background:radial-gradient(circle at 50% 35%,rgba(105,72,25,.18),rgba(5,3,8,.9) 72%);backdrop-filter:blur(3px);overflow:hidden}
      .arena3d-modal{width:min(410px,92%);padding:20px 20px 22px;border:1px solid rgba(235,197,103,.7);border-radius:17px;background:linear-gradient(150deg,#241b20,#100c12 62%,#07060a);box-shadow:0 24px 80px rgba(0,0,0,.85),0 0 45px rgba(222,179,72,.12);text-align:center;color:#f7e9c8;font-family:Cinzel,serif}
      .arena3d-title{font-size:1.75rem;font-weight:900;letter-spacing:2px;color:#f04b45;text-shadow:0 3px 0 #5e0e0b,0 0 18px rgba(255,62,52,.38)}
      .arena3d-sub{margin:5px auto 0;max-width:310px;font:700 .72rem/1.45 Arial,sans-serif;color:#d7ccba}
      .arena3d-stage{position:relative;height:225px;margin:2px 0 0;perspective:700px;perspective-origin:50% 43%;transform-style:preserve-3d;overflow:visible}
      .arena3d-table{position:absolute;left:7%;right:7%;bottom:20px;height:84px;border-radius:50%;background:radial-gradient(ellipse at center,rgba(218,181,91,.25),rgba(76,54,29,.18) 44%,rgba(8,7,10,0) 72%);border-bottom:2px solid rgba(226,193,105,.28);box-shadow:0 17px 32px rgba(0,0,0,.72);transform:rotateX(64deg);transform-origin:center;z-index:1}
      .arena3d-shadow{position:absolute;left:50%;bottom:38px;width:102px;height:28px;border-radius:50%;background:rgba(0,0,0,.65);filter:blur(8px);transform:translateX(-50%) rotateX(66deg);z-index:2}
      .arena3d-hand{position:absolute;left:50%;bottom:70px;width:122px;height:100px;z-index:5;transform:translateX(-50%) rotate(-8deg);filter:drop-shadow(0 10px 9px rgba(0,0,0,.52));transform-origin:50% 100%}
      .arena3d-hand .palm{position:absolute;left:28px;bottom:0;width:72px;height:54px;border:2px solid #663b2d;border-radius:36px 32px 24px 25px;background:linear-gradient(145deg,#e6b487,#925541);transform:rotate(-7deg)}
      .arena3d-hand .finger{position:absolute;bottom:30px;width:22px;border:2px solid #663b2d;border-radius:15px 15px 7px 7px;background:linear-gradient(145deg,#e8b78b,#965744);transform-origin:bottom center}
      .arena3d-hand .f1{left:19px;height:49px;transform:rotate(-24deg)}.arena3d-hand .f2{left:38px;height:62px;transform:rotate(-9deg)}.arena3d-hand .f3{left:58px;height:60px;transform:rotate(5deg)}.arena3d-hand .f4{left:78px;height:50px;transform:rotate(18deg)}
      .arena3d-hand .thumb{position:absolute;left:11px;bottom:12px;width:37px;height:24px;border:2px solid #663b2d;border-radius:18px;background:linear-gradient(145deg,#e4b082,#925541);transform:rotate(-30deg)}

      /* O dado é um cubo de 6 faces reais: cada face ocupa uma posição no espaço 3D. */
      .arena3d-die{position:absolute;left:50%;bottom:75px;width:86px;height:86px;z-index:7;transform-style:preserve-3d;transform:translateX(-50%) rotateX(25deg) rotateY(-32deg) rotateZ(-8deg);}
      .arena3d-cube{position:absolute;inset:0;width:86px;height:86px;transform-style:preserve-3d;}
      .arena3d-face{position:absolute;inset:0;width:86px;height:86px;box-sizing:border-box;border:3px solid #f0d991;border-radius:14px;background:linear-gradient(145deg,#fff9df 0%,#e7d18f 53%,#a57e39 100%);box-shadow:inset 0 2px 1px rgba(255,255,255,.95),inset -7px -8px 13px rgba(82,55,13,.2);backface-visibility:hidden;}
      .arena3d-face.front{transform:translateZ(43px)}
      .arena3d-face.back{transform:rotateY(180deg) translateZ(43px)}
      .arena3d-face.right{transform:rotateY(90deg) translateZ(43px)}
      .arena3d-face.left{transform:rotateY(-90deg) translateZ(43px)}
      .arena3d-face.top{transform:rotateX(90deg) translateZ(43px)}
      .arena3d-face.bottom{transform:rotateX(-90deg) translateZ(43px)}
      .arena3d-dots{position:absolute;inset:11px;display:grid;grid-template-columns:repeat(3,1fr);grid-template-rows:repeat(3,1fr);gap:3px;transform:translateZ(1px)}
      .arena3d-dots i{width:12px;height:12px;align-self:center;justify-self:center;border-radius:50%;background:transparent}
      .arena3d-dots i.on{background:#201a20;box-shadow:inset 0 1px 1px rgba(255,255,255,.2),0 2px 2px rgba(0,0,0,.4)}
      .arena3d-cube:after{content:"";position:absolute;inset:-2px;border-radius:16px;box-shadow:0 0 16px rgba(242,205,113,.18);transform:translateZ(0)}

      .arena3d-result{position:absolute;left:0;right:0;bottom:13px;z-index:20;font:900 3.2rem/1 Arial,sans-serif;color:#fff;text-shadow:0 3px 18px rgba(255,255,255,.32);opacity:0;transform:scale(.55)}
      .arena3d-mult{min-height:23px;margin-top:0;font:900 .86rem Arial,sans-serif;color:#e6c66f;letter-spacing:.3px}
      .arena3d-roll{width:100%;margin-top:14px;padding:14px 18px;border:2px solid #e2bd62;border-radius:10px;background:linear-gradient(180deg,#725426,#382714);color:#ffeca9;font:900 .98rem Arial,sans-serif;letter-spacing:1px;cursor:pointer;box-shadow:0 7px 18px rgba(0,0,0,.48);transition:transform .12s,filter .12s}.arena3d-roll:hover{filter:brightness(1.15);transform:translateY(-1px)}.arena3d-roll:disabled{opacity:.65;cursor:default;transform:none}

      .arena3d-overlay.rolling .arena3d-hand{animation:arena3dHand .82s cubic-bezier(.2,.7,.2,1) 1}
      .arena3d-overlay.rolling .arena3d-die{animation:arena3dThrow 1.58s cubic-bezier(.12,.7,.16,1) forwards}
      .arena3d-overlay.rolling .arena3d-shadow{animation:arena3dShadow 1.58s ease-out forwards}
      .arena3d-overlay.rolling .arena3d-cube{animation:arena3dCubeRoll 1.58s cubic-bezier(.1,.62,.18,1) forwards}
      .arena3d-overlay.resolved .arena3d-die{animation:arena3dLand .28s ease-out forwards}
      .arena3d-overlay.resolved .arena3d-result{opacity:1;animation:arena3dResult .45s cubic-bezier(.2,.8,.2,1) forwards}

      @keyframes arena3dHand{0%{transform:translateX(-50%) rotate(-8deg)}22%{transform:translateX(-50%) translateY(-13px) rotate(-20deg)}48%{transform:translateX(-50%) translateY(6px) rotate(14deg)}72%{transform:translateX(-50%) translateY(-8px) rotate(-15deg)}100%{transform:translateX(-50%) rotate(-8deg)}}
      @keyframes arena3dThrow{0%{bottom:77px;transform:translateX(-50%) rotateX(25deg) rotateY(-32deg) rotateZ(-8deg) scale(.76)}18%{bottom:142px;transform:translateX(-50%) rotateX(25deg) rotateY(-32deg) rotateZ(-8deg) scale(.84)}44%{bottom:124px;transform:translateX(-50%) rotateX(25deg) rotateY(-32deg) rotateZ(-8deg) scale(1)}70%{bottom:70px;transform:translateX(-50%) rotateX(25deg) rotateY(-32deg) rotateZ(-8deg) scale(1.04)}86%{bottom:79px;transform:translateX(-50%) rotateX(25deg) rotateY(-32deg) rotateZ(-8deg) scale(1)}100%{bottom:73px;transform:translateX(-50%) rotateX(25deg) rotateY(-32deg) rotateZ(-8deg) scale(1)}}
      @keyframes arena3dCubeRoll{0%{transform:rotateX(0) rotateY(0) rotateZ(0)}18%{transform:rotateX(115deg) rotateY(145deg) rotateZ(65deg)}42%{transform:rotateX(290deg) rotateY(355deg) rotateZ(175deg)}67%{transform:rotateX(510deg) rotateY(590deg) rotateZ(310deg)}84%{transform:rotateX(650deg) rotateY(755deg) rotateZ(420deg)}100%{transform:rotateX(735deg) rotateY(840deg) rotateZ(500deg)}}
      @keyframes arena3dShadow{0%{transform:translateX(-50%) rotateX(66deg) scale(.42);opacity:.18}42%{transform:translateX(-50%) rotateX(66deg) scale(.72);opacity:.38}70%{transform:translateX(-50%) rotateX(66deg) scale(1.24);opacity:.8}100%{transform:translateX(-50%) rotateX(66deg) scale(1);opacity:.64}}
      @keyframes arena3dLand{from{transform:translateX(-50%) rotateX(25deg) rotateY(-32deg) rotateZ(-8deg) scale(1)}to{transform:translateX(-50%) rotateX(25deg) rotateY(-32deg) rotateZ(-8deg) scale(1.05)}}
      @keyframes arena3dResult{from{opacity:0;transform:scale(.45) translateY(8px)}to{opacity:1;transform:scale(1) translateY(0)}}
      @media(max-width:620px){.arena3d-modal{width:min(335px,91%);padding:18px 16px 20px}.arena3d-stage{height:195px;perspective:620px}.arena3d-die,.arena3d-cube,.arena3d-face{width:78px;height:78px}.arena3d-face.front{transform:translateZ(39px)}.arena3d-face.back{transform:rotateY(180deg) translateZ(39px)}.arena3d-face.right{transform:rotateY(90deg) translateZ(39px)}.arena3d-face.left{transform:rotateY(-90deg) translateZ(39px)}.arena3d-face.top{transform:rotateX(90deg) translateZ(39px)}.arena3d-face.bottom{transform:rotateX(-90deg) translateZ(39px)}.arena3d-die{bottom:72px;transform:translateX(-50%) rotateX(25deg) rotateY(-32deg) rotateZ(-8deg) scale(.9)}.arena3d-hand{transform:translateX(-50%) scale(.9) rotate(-8deg)}}
    `;
    document.head.appendChild(s);
  }

  function open(baseAttack,bonus,innerAttack){
    const area=document.getElementById('battleArea');
    if(!area){window.__arenaCritRolling=false;return}
    area.querySelector('.arena3d-overlay')?.remove();

    const el=document.createElement('div');
    el.className='arena3d-overlay';
    el.innerHTML=`<div class="arena3d-modal"><div class="arena3d-title">CRÍTICO!</div><div class="arena3d-sub">Sua Critical Eye ativou.<br>Jogue o D6 manualmente para definir o multiplicador do dano.</div><div class="arena3d-stage"><div class="arena3d-table"></div><div class="arena3d-shadow"></div><div class="arena3d-hand"><div class="palm"></div><div class="finger f1"></div><div class="finger f2"></div><div class="finger f3"></div><div class="finger f4"></div><div class="thumb"></div></div><div class="arena3d-die">${cube(1)}</div><div class="arena3d-result">?</div></div><div class="arena3d-mult">D6 maior = dano maior</div><button type="button" class="arena3d-roll">🎲 ROLAR O D6</button></div>`;
    area.appendChild(el);

    const btn=el.querySelector('.arena3d-roll');
    const die=el.querySelector('.arena3d-die');
    const result=el.querySelector('.arena3d-result');
    const mult=el.querySelector('.arena3d-mult');

    btn.addEventListener('click',()=>{
      if(btn.disabled)return;
      btn.disabled=true;
      btn.textContent='🎲 ROLANDO...';
      el.classList.add('rolling');

      const roll=1+Math.floor(Math.random()*6);
      const multiplier=1+(roll*.25);

      setTimeout(()=>{die.innerHTML=cube(roll)},1580);
      setTimeout(()=>{
        result.textContent=roll;
        mult.textContent=`DANO CRÍTICO: x${multiplier.toFixed(2)}`;
        el.classList.remove('rolling');
        el.classList.add('resolved');

        setTimeout(()=>{
          el.remove();
          if(!battle){window.__arenaCritRolling=false;return}

          const oldAttack=battle.attack;
          battle.attack=Math.floor(baseAttack*multiplier);
          const oldRandom=Math.random;
          let first=true;
          Math.random=()=>{if(first){first=false;return .999999}return oldRandom()};
          try{innerAttack()}
          finally{
            Math.random=oldRandom;
            battle.attack=oldAttack;
            window.__arenaCritRolling=false;
          }
          battleLog(`<span class="loot">CRÍTICO! D6 = ${roll} · x${multiplier.toFixed(2)} dano</span>`);
        },700);
      },1830);
    });
  }

  window.__arenaRollCrit3D=function(baseAttack,bonus,innerAttack){
    if(window.__arenaCritRolling)return;
    window.__arenaCritRolling=true;
    installStyle();
    open(baseAttack,bonus,innerAttack);
  };

  installStyle();
})();

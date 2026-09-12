// D6 3D da Arena — sistema novo, isolado e manual.
(()=>{
  if(window.__arenaCrit3DInstalled)return;
  window.__arenaCrit3DInstalled=true;

  const FACES={1:[4],2:[0,8],3:[0,4,8],4:[0,2,6,8],5:[0,2,4,6,8],6:[0,2,3,5,6,8]};
  const face=n=>`<div class="arena3d-die-face"><div class="arena3d-dots">${Array.from({length:9},(_,i)=>`<i class="${FACES[n].includes(i)?'on':''}"></i>`).join('')}</div></div>`;

  function installStyle(){
    if(document.getElementById('arena-3d-dice-style'))return;
    const s=document.createElement('style');s.id='arena-3d-dice-style';
    s.textContent=`
      #battleArea{position:relative}
      .arena3d-overlay{position:absolute;inset:0;z-index:999;display:flex;align-items:center;justify-content:center;background:radial-gradient(circle at 50% 38%,rgba(80,54,24,.22),rgba(5,3,8,.86) 72%);backdrop-filter:blur(3px);overflow:hidden}
      .arena3d-modal{width:min(390px,92%);padding:20px 20px 22px;border:1px solid rgba(235,197,103,.72);border-radius:16px;background:linear-gradient(150deg,#211923 0%,#100c13 60%,#08070b 100%);box-shadow:0 22px 70px rgba(0,0,0,.8),0 0 45px rgba(222,179,72,.13);text-align:center;color:#f7e9c8;font-family:Cinzel,serif}
      .arena3d-title{font-size:1.75rem;font-weight:900;letter-spacing:2px;color:#f04b45;text-shadow:0 3px 0 #5e0e0b,0 0 18px rgba(255,62,52,.38)}
      .arena3d-sub{margin:5px auto 0;max-width:300px;font:700 .72rem/1.45 Arial,sans-serif;color:#d7ccba}
      .arena3d-stage{position:relative;height:205px;margin:6px 0 2px;perspective:850px;overflow:hidden}
      .arena3d-table{position:absolute;left:8%;right:8%;bottom:22px;height:76px;border-radius:50%;background:radial-gradient(ellipse at center,rgba(218,181,91,.26),rgba(76,54,29,.22) 45%,rgba(8,7,10,0) 73%);border-bottom:2px solid rgba(226,193,105,.3);box-shadow:0 16px 30px rgba(0,0,0,.7);transform:rotateX(61deg);transform-origin:center}
      .arena3d-shadow{position:absolute;left:50%;bottom:36px;width:92px;height:25px;border-radius:50%;background:rgba(0,0,0,.58);filter:blur(7px);transform:translateX(-50%) rotateX(65deg);transition:transform .25s,opacity .25s}
      .arena3d-hand{position:absolute;left:50%;bottom:74px;width:120px;height:96px;z-index:5;transform:translateX(-50%) rotate(-8deg);filter:drop-shadow(0 9px 8px rgba(0,0,0,.5));transform-origin:50% 100%}
      .arena3d-hand .palm{position:absolute;left:29px;bottom:0;width:70px;height:52px;border:2px solid #6b3e2e;border-radius:36px 32px 24px 25px;background:linear-gradient(145deg,#e0ad7e,#9a5b43);transform:rotate(-7deg)}
      .arena3d-hand .finger{position:absolute;bottom:30px;width:22px;border:2px solid #6b3e2e;border-radius:15px 15px 7px 7px;background:linear-gradient(145deg,#e5b382,#9d6047);transform-origin:bottom center}
      .arena3d-hand .f1{left:20px;height:48px;transform:rotate(-24deg)}.arena3d-hand .f2{left:38px;height:61px;transform:rotate(-9deg)}.arena3d-hand .f3{left:57px;height:59px;transform:rotate(5deg)}.arena3d-hand .f4{left:76px;height:49px;transform:rotate(18deg)}
      .arena3d-hand .thumb{position:absolute;left:12px;bottom:12px;width:36px;height:23px;border:2px solid #6b3e2e;border-radius:18px;background:linear-gradient(145deg,#e0aa7a,#9a5b43);transform:rotate(-30deg)}
      .arena3d-die{position:absolute;left:50%;bottom:76px;width:82px;height:82px;z-index:7;transform:translateX(-50%) rotateX(24deg) rotateY(-28deg) rotateZ(-10deg);transform-style:preserve-3d;transition:transform .2s}
      .arena3d-die-face{position:absolute;inset:0;border:3px solid #ead38c;border-radius:13px;background:linear-gradient(145deg,#fff8dc 0%,#e5cf8c 55%,#ad8c49 100%);box-shadow:inset 0 2px 0 rgba(255,255,255,.9),inset -6px -8px 12px rgba(92,64,20,.18),0 12px 20px rgba(0,0,0,.55);transform:translateZ(41px);backface-visibility:hidden}
      .arena3d-dots{position:absolute;inset:10px;display:grid;grid-template-columns:repeat(3,1fr);grid-template-rows:repeat(3,1fr);gap:3px}
      .arena3d-dots i{width:11px;height:11px;align-self:center;justify-self:center;border-radius:50%;background:transparent}.arena3d-dots i.on{background:#211a20;box-shadow:inset 0 1px 1px rgba(255,255,255,.22),0 1px 1px rgba(0,0,0,.35)}
      .arena3d-die:before,.arena3d-die:after{content:"";position:absolute;inset:5px;border-radius:10px;pointer-events:none}.arena3d-die:before{transform:translateZ(35px);background:rgba(255,255,255,.08)}.arena3d-die:after{transform:rotateY(90deg) translateZ(41px);background:linear-gradient(145deg,#d4b86e,#8d6b32);border:3px solid #c7a961;box-sizing:border-box}
      .arena3d-result{position:absolute;left:0;right:0;bottom:15px;z-index:20;font:900 3.1rem/1 Arial,sans-serif;color:#fff;text-shadow:0 3px 18px rgba(255,255,255,.3);opacity:0;transform:scale(.65)}
      .arena3d-mult{min-height:23px;margin-top:1px;font:900 .86rem Arial,sans-serif;color:#e6c66f;letter-spacing:.3px}
      .arena3d-roll{width:100%;margin-top:14px;padding:14px 18px;border:2px solid #e2bd62;border-radius:10px;background:linear-gradient(180deg,#725426,#382714);color:#ffeca9;font:900 .98rem Arial,sans-serif;letter-spacing:1px;cursor:pointer;box-shadow:0 7px 18px rgba(0,0,0,.48);transition:transform .12s,filter .12s}.arena3d-roll:hover{filter:brightness(1.15);transform:translateY(-1px)}.arena3d-roll:disabled{opacity:.65;cursor:default;transform:none}
      .arena3d-overlay.rolling .arena3d-hand{animation:arena3dHand .7s ease-in-out 1}
      .arena3d-overlay.rolling .arena3d-die{animation:arena3dThrow 1.5s cubic-bezier(.12,.72,.18,1) forwards}
      .arena3d-overlay.rolling .arena3d-shadow{animation:arena3dShadow 1.5s ease-out forwards}
      .arena3d-overlay.resolved .arena3d-die{animation:arena3dFinal .35s ease-out forwards}
      .arena3d-overlay.resolved .arena3d-result{opacity:1;animation:arena3dResult .45s cubic-bezier(.2,.8,.2,1) forwards}
      @keyframes arena3dHand{0%{transform:translateX(-50%) rotate(-8deg)}25%{transform:translateX(-50%) translateY(-12px) rotate(-19deg)}50%{transform:translateX(-50%) translateY(5px) rotate(13deg)}75%{transform:translateX(-50%) translateY(-7px) rotate(-14deg)}100%{transform:translateX(-50%) rotate(-8deg)}}
      @keyframes arena3dThrow{0%{bottom:77px;transform:translateX(-50%) translateY(0) rotateX(24deg) rotateY(-28deg) rotateZ(-10deg) scale(.78)}15%{bottom:139px;transform:translateX(-50%) translateY(-8px) rotateX(90deg) rotateY(120deg) rotateZ(80deg) scale(.9)}35%{bottom:119px;transform:translateX(-50%) translateY(0) rotateX(190deg) rotateY(250deg) rotateZ(210deg) scale(1)}55%{bottom:67px;transform:translateX(-50%) rotateX(310deg) rotateY(420deg) rotateZ(370deg) scale(1.03)}72%{bottom:78px;transform:translateX(-50%) rotateX(455deg) rotateY(590deg) rotateZ(540deg) scale(1)}86%{bottom:69px;transform:translateX(-50%) rotateX(535deg) rotateY(690deg) rotateZ(635deg) scale(1.02)}100%{bottom:70px;transform:translateX(-50%) rotateX(590deg) rotateY(760deg) rotateZ(700deg) scale(1)}}
      @keyframes arena3dShadow{0%,45%{transform:translateX(-50%) rotateX(65deg) scale(.55);opacity:.25}70%{transform:translateX(-50%) rotateX(65deg) scale(1.2);opacity:.75}100%{transform:translateX(-50%) rotateX(65deg) scale(1);opacity:.62}}
      @keyframes arena3dFinal{from{transform:translateX(-50%) rotateX(590deg) rotateY(760deg) rotateZ(700deg) scale(1)}to{transform:translateX(-50%) rotateX(600deg) rotateY(780deg) rotateZ(720deg) scale(1.04)}}
      @keyframes arena3dResult{from{opacity:0;transform:scale(.45) translateY(8px)}to{opacity:1;transform:scale(1) translateY(0)}}
      @media(max-width:620px){.arena3d-modal{width:min(330px,91%);padding:18px 16px 20px}.arena3d-stage{height:185px}.arena3d-hand{transform:translateX(-50%) scale(.9) rotate(-8deg)}.arena3d-die{transform:translateX(-50%) scale(.9) rotateX(24deg) rotateY(-28deg) rotateZ(-10deg)}}
    `;
    document.head.appendChild(s);
  }

  function open(baseAttack,bonus,innerAttack){
    const area=document.getElementById('battleArea');if(!area){window.__arenaCritRolling=false;return}
    area.querySelector('.arena3d-overlay')?.remove();
    const el=document.createElement('div');el.className='arena3d-overlay';
    el.innerHTML=`<div class="arena3d-modal"><div class="arena3d-title">CRÍTICO!</div><div class="arena3d-sub">Sua Critical Eye ativou.<br>Jogue o D6 manualmente para definir o multiplicador do dano.</div><div class="arena3d-stage"><div class="arena3d-table"></div><div class="arena3d-shadow"></div><div class="arena3d-hand"><div class="palm"></div><div class="finger f1"></div><div class="finger f2"></div><div class="finger f3"></div><div class="finger f4"></div><div class="thumb"></div></div><div class="arena3d-die">${face(1)}</div><div class="arena3d-result">?</div></div><div class="arena3d-mult">D6 maior = dano maior</div><button type="button" class="arena3d-roll">🎲 ROLAR O D6</button></div>`;
    area.appendChild(el);
    const btn=el.querySelector('.arena3d-roll');const die=el.querySelector('.arena3d-die');const result=el.querySelector('.arena3d-result');const mult=el.querySelector('.arena3d-mult');
    btn.addEventListener('click',()=>{
      if(btn.disabled)return;
      btn.disabled=true;btn.textContent='🎲 ROLANDO...';el.classList.add('rolling');
      const roll=1+Math.floor(Math.random()*6);const multiplier=1+(roll*.25);
      setTimeout(()=>{die.innerHTML=face(roll)},1500);
      setTimeout(()=>{
        result.textContent=roll;mult.textContent=`DANO CRÍTICO: x${multiplier.toFixed(2)}`;el.classList.remove('rolling');el.classList.add('resolved');
        setTimeout(()=>{
          el.remove();
          if(!battle){window.__arenaCritRolling=false;return}
          const oldAttack=battle.attack;battle.attack=Math.floor(baseAttack*multiplier);
          const oldRandom=Math.random;let first=true;Math.random=()=>{if(first){first=false;return .999999}return oldRandom()};
          try{innerAttack()}finally{Math.random=oldRandom;battle.attack=oldAttack;window.__arenaCritRolling=false}
          battleLog(`<span class="loot">CRÍTICO! D6 = ${roll} · x${multiplier.toFixed(2)} dano</span>`);
        },700);
      },1750);
    });
  }

  window.__arenaRollCrit3D=function(baseAttack,bonus,innerAttack){
    if(window.__arenaCritRolling)return;
    window.__arenaCritRolling=true;installStyle();open(baseAttack,bonus,innerAttack);
  };

  installStyle();
})();

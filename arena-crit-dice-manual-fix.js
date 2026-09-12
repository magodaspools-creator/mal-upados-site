// D6 manual para críticos: o jogador decide quando rolar.
(()=>{
  if(window.__arenaManualCritInstalled)return;
  window.__arenaManualCritInstalled=true;

  const FACES={1:[4],2:[0,8],3:[0,4,8],4:[0,2,6,8],5:[0,2,4,6,8] ,6:[0,2,3,5,6,8]};
  const face=(n)=>`<div class="arena-manual-d6-face"><div class="d6-side d6-front">${new Array(9).fill('').map((_,i)=>`<i class="${FACES[n].includes(i)?'':'empty'}"></i>`).join('')}</div></div>`;

  function style(){
    if(document.getElementById('arena-manual-crit-style'))return;
    const s=document.createElement('style');s.id='arena-manual-crit-style';
    s.textContent=`
      .arena-manual-crit-overlay{position:absolute;inset:0;z-index:100;display:flex;align-items:center;justify-content:center;background:rgba(7,4,10,.74);backdrop-filter:blur(3px);overflow:hidden}
      .arena-manual-crit-modal{width:min(350px,90%);padding:20px;border:2px solid #d9b85f;border-radius:14px;background:linear-gradient(145deg,#241b28,#0d090f);box-shadow:0 16px 50px rgba(0,0,0,.75),0 0 30px rgba(218,180,80,.2);text-align:center;color:#f8e9c5;font-family:Cinzel,serif;overflow:hidden}
      .arena-manual-crit-title{font-size:1.7rem;font-weight:900;letter-spacing:2px;color:#e33434;text-shadow:0 2px 0 #620909}
      .arena-manual-crit-sub{margin-top:5px;font:700 .74rem/1.4 Arial,sans-serif;color:#d5caba}
      .arena-manual-table{position:relative;height:180px;margin:10px -5px 0;perspective:700px;display:flex;align-items:flex-end;justify-content:center;overflow:hidden}
      .arena-manual-surface{position:absolute;left:8%;right:8%;bottom:12px;height:68px;border-radius:50%;background:radial-gradient(ellipse at center,rgba(183,145,70,.36),rgba(70,49,26,.18) 52%,transparent 72%);box-shadow:0 12px 22px rgba(0,0,0,.5);transform:rotateX(58deg);border-bottom:2px solid rgba(224,190,108,.35)}
      .arena-manual-hand{position:absolute;left:50%;bottom:56px;width:112px;height:76px;transform:translateX(-50%) rotate(-7deg);z-index:4;filter:drop-shadow(0 8px 7px rgba(0,0,0,.45));transition:transform .2s}
      .arena-manual-hand .palm{position:absolute;left:28px;bottom:0;width:66px;height:48px;border-radius:35px 30px 24px 24px;background:linear-gradient(145deg,#d9a878,#9b6045);border:2px solid #70402f;transform:rotate(-8deg)}
      .arena-manual-hand .finger{position:absolute;bottom:28px;width:22px;height:54px;border-radius:15px 15px 7px 7px;background:linear-gradient(145deg,#e0ad7d,#a46449);border:2px solid #70402f;transform-origin:bottom center}
      .arena-manual-hand .f1{left:22px;transform:rotate(-24deg);height:46px}.arena-manual-hand .f2{left:39px;transform:rotate(-10deg);height:57px}.arena-manual-hand .f3{left:56px;transform:rotate(3deg);height:55px}.arena-manual-hand .f4{left:73px;transform:rotate(17deg);height:46px}
      .arena-manual-hand .thumb{position:absolute;left:15px;bottom:10px;width:34px;height:22px;border-radius:18px;background:linear-gradient(145deg,#dda97b,#a36348);border:2px solid #70402f;transform:rotate(-30deg)}
      .arena-manual-d6-wrap{position:absolute;left:50%;bottom:62px;width:90px;height:90px;transform:translateX(-50%);z-index:6;display:flex;align-items:center;justify-content:center;transition:opacity .2s}
      .arena-manual-d6-face{position:relative;width:68px;height:68px;transform-style:preserve-3d;transform:rotateX(18deg) rotateY(-28deg) rotateZ(-9deg);transition:transform .2s}
      .arena-manual-d6-face:before,.arena-manual-d6-face:after{content:"";position:absolute;inset:0;border-radius:10px;box-sizing:border-box}
      .arena-manual-d6-face:before{background:linear-gradient(145deg,#fff4d0,#b69d5b);border:3px solid #ead596;box-shadow:inset 0 2px 0 rgba(255,255,255,.75),0 9px 18px rgba(0,0,0,.5)}
      .d6-front{position:absolute;inset:0;padding:10px;display:grid;grid-template-columns:repeat(3,1fr);grid-template-rows:repeat(3,1fr);gap:4px;z-index:2}
      .d6-front i{display:block;width:10px;height:10px;align-self:center;justify-self:center;border-radius:50%;background:#251e23;box-shadow:inset 0 1px 1px rgba(255,255,255,.18)}.d6-front i.empty{opacity:0}
      .arena-manual-result{font-size:3rem;line-height:1;font-weight:900;color:#fff;text-shadow:0 3px 12px rgba(255,255,255,.25);position:absolute;left:0;right:0;bottom:8px;z-index:9;opacity:0}
      .arena-manual-mult{min-height:22px;margin-top:3px;font:900 .9rem Arial,sans-serif;color:#e8c76c}
      .arena-manual-roll-btn{width:100%;margin-top:14px;padding:13px 16px;border:2px solid #e2bd62;border-radius:9px;background:linear-gradient(180deg,#674b20,#382714);color:#ffe9aa;font:900 .95rem Arial,sans-serif;letter-spacing:1px;cursor:pointer;box-shadow:0 6px 16px rgba(0,0,0,.45);transition:transform .12s,filter .12s}.arena-manual-roll-btn:hover{filter:brightness(1.16);transform:translateY(-1px)}.arena-manual-roll-btn:disabled{opacity:.62;cursor:default;transform:none}
      .arena-manual-crit-overlay.rolling .arena-manual-hand{animation:arenaHandShake .55s ease-in-out 2}.arena-manual-crit-overlay.rolling .arena-manual-d6-wrap{animation:arenaDieThrow 1.15s cubic-bezier(.15,.75,.2,1) forwards}.arena-manual-crit-overlay.rolling .arena-manual-surface{animation:arenaSurfacePulse 1.15s ease-out forwards}
      .arena-manual-crit-overlay.rolling .arena-manual-result{opacity:0}
      .arena-manual-crit-overlay.resolved .arena-manual-d6-wrap{animation:arenaDieStop .45s ease-out forwards}.arena-manual-crit-overlay.resolved .arena-manual-result{opacity:1;animation:arenaManualNumber .45s ease-out}
      @keyframes arenaHandShake{0%,100%{transform:translateX(-50%) rotate(-7deg)}25%{transform:translateX(-50%) rotate(-18deg) translateY(-7px)}50%{transform:translateX(-50%) rotate(10deg) translateY(4px)}75%{transform:translateX(-50%) rotate(-15deg) translateY(-4px)}}
      @keyframes arenaDieThrow{0%{bottom:58px;transform:translateX(-50%) translateY(0) scale(.78) rotate(0deg);opacity:1}18%{bottom:115px;transform:translateX(-50%) translateY(-12px) scale(.92) rotate(70deg)}42%{bottom:92px;transform:translateX(-50%) translateY(0) scale(1) rotate(210deg)}65%{bottom:48px;transform:translateX(-50%) translateY(0) scale(1.03) rotate(420deg)}82%{bottom:57px;transform:translateX(-50%) translateY(0) scale(1) rotate(560deg)}100%{bottom:57px;transform:translateX(-50%) scale(1) rotate(700deg)}}
      @keyframes arenaDieStop{from{transform:translateX(-50%) rotate(700deg) scale(1)}to{transform:translateX(-50%) rotate(720deg) scale(1.06)}}
      @keyframes arenaSurfacePulse{0%,60%{opacity:.6}72%{opacity:1;transform:rotateX(58deg) scale(1.12)}100%{opacity:.9;transform:rotateX(58deg) scale(1)}}
      @keyframes arenaManualNumber{from{transform:scale(.65);opacity:.1}to{transform:scale(1);opacity:1}}
      @media(max-width:620px){.arena-manual-crit-modal{width:min(310px,90%);padding:17px}.arena-manual-table{height:160px}.arena-manual-hand{transform:translateX(-50%) scale(.9) rotate(-7deg)}.arena-manual-d6-wrap{transform:translateX(-50%) scale(.9)}@keyframes arenaHandShake{0%,100%{transform:translateX(-50%) scale(.9) rotate(-7deg)}25%{transform:translateX(-50%) scale(.9) rotate(-18deg) translateY(-7px)}50%{transform:translateX(-50%) scale(.9) rotate(10deg) translateY(4px)}75%{transform:translateX(-50%) scale(.9) rotate(-15deg) translateY(-4px)}}}
    `;document.head.appendChild(s);
  }

  function openDice(baseAttack,critBonus,innerAttack){
    const area=document.getElementById('battleArea');if(!area){window.__arenaCritRolling=false;return;}
    area.querySelector('.arena-manual-crit-overlay')?.remove();
    const el=document.createElement('div');el.className='arena-manual-crit-overlay';
    el.innerHTML=`<div class="arena-manual-crit-modal"><div class="arena-manual-crit-title">CRÍTICO!</div><div class="arena-manual-crit-sub">Sua Critical Eye ativou!<br>Você decide quando rolar o D6.</div><div class="arena-manual-table"><div class="arena-manual-surface></div><div class="arena-manual-hand"><div class="palm"></div><div class="finger f1"></div><div class="finger f2"></div><div class="finger f3"></div><div class="finger f4"></div><div class="thumb"></div></div><div class="arena-manual-d6-wrap">${face(1)}</div><div class="arena-manual-result">?</div></div><div class="arena-manual-mult">Quanto maior o número, maior o dano.</div><button type="button" class="arena-manual-roll-btn">🎲 ROLAR O D6</button></div>`;
    area.appendChild(el);
    const btn=el.querySelector('.arena-manual-roll-btn');const wrap=el.querySelector('.arena-manual-d6-wrap');const result=el.querySelector('.arena-manual-result');const mult=el.querySelector('.arena-manual-mult);
    btn.addEventListener('click',()=>{
      if(btn.disabled)return;
      btn.disabled=true;btn.textContent='🎲 ROLANDO...';el.classList.add('rolling');
      const roll=1+Math.floor(Math.random()*6);const multiplier=1+(roll*.25);
      setTimeout(()=>{wrap.innerHTML=face(roll)},1150);
      setTimeout(()=>{
        result.textContent=roll;mult.textContent=`DANO CRÍTICO: x${multiplier.toFixed(2)}`;el.classList.remove('rolling');el.classList.add('resolved');
        setTimeout(()=>{
          el.remove();
          if(!battle){window.__arenaCritRolling=false;return;}
          const oldAttack=battle.attack;battle.attack=Math.floor(baseAttack*multiplier);
          let firstRandom=true;const oldRandom=Math.random;Math.random=()=>{if(firstRandom){firstRandom=false;return .999999}return oldRandom()};
          window.__arenaCritRolling=false;
          try{innerAttack()}finally{Math.random=oldRandom;battle.attack=oldAttack;window.__arenaCritRolling=false}
          battleLog(`<span class="loot">CRÍTICO! D6 = ${roll} · x${multiplier.toFixed(2)} dano</span>`);
        },1000);
      },1350);
    });
  }

  function install(){
    style();
    if(typeof window.attack!=='function'||window.__arenaManualCritAttackWrapped)return;
    const innerAttack=window.attack;
    window.attack=function(){
      if(!battle||window.__arenaCritRolling)return;
      const b=window.arenaTrinkets?.bonuses?.()||{crit:0};
      const baseAttack=battle.attack;
      const critical=b.crit>0&&Math.random()*100<b.crit;
      if(!critical){innerAttack();return}
      window.__arenaCritRolling=true;
      openDice(baseAttack,b.crit,innerAttack);
    };
    window.__arenaManualCritAttackWrapped=true;

    // IMPORTANTE: renderBattle captura `attack` no onclick no momento em que cria o botão.
    // Como este arquivo é carregado depois, precisamos religar o botão atual e todos os futuros.
    const previousRender=typeof window.renderBattle==='function'?window.renderBattle:null;
    if(previousRender&&!window.__arenaManualCritRenderWrapped){
      window.renderBattle=function(){
        previousRender();
        const btn=document.getElementById('attackBtn');
        if(btn)btn.onclick=window.attack;
      };
      window.__arenaManualCritRenderWrapped=true;
      const currentBtn=document.getElementById('attackBtn');
      if(currentBtn)currentBtn.onclick=window.attack;
    }
  }
  install();window.addEventListener('load',install);setTimeout(install,700);
})();
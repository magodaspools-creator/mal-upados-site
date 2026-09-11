// D6 manual para críticos: o jogador decide quando rolar.
(()=>{
  if(window.__arenaManualCritInstalled)return;
  window.__arenaManualCritInstalled=true;

  const FACES={1:[4],2:[0,8],3:[0,4,8],4:[0,2,6,8],5:[0,2,4,6,8],6:[0,2,3,5,6,8]};
  const face=(n)=>`<div class="arena-manual-d6-face">${new Array(9).fill('').map((_,i)=>`<i class="${FACES[n].includes(i)?'':'empty'}"></i>`).join('')}</div>`;

  function style(){
    if(document.getElementById('arena-manual-crit-style'))return;
    const s=document.createElement('style');s.id='arena-manual-crit-style';
    s.textContent=`
      .arena-manual-crit-overlay{position:absolute;inset:0;z-index:100;display:flex;align-items:center;justify-content:center;background:rgba(7,4,10,.72);backdrop-filter:blur(3px)}
      .arena-manual-crit-modal{width:min(330px,88%);padding:20px;border:2px solid #d9b85f;border-radius:14px;background:linear-gradient(145deg,#241b28,#0d090f);box-shadow:0 16px 50px rgba(0,0,0,.75),0 0 30px rgba(218,180,80,.2);text-align:center;color:#f8e9c5;font-family:Cinzel,serif}
      .arena-manual-crit-title{font-size:1.7rem;font-weight:900;letter-spacing:2px;color:#e33434;text-shadow:0 2px 0 #620909}
      .arena-manual-crit-sub{margin-top:5px;font:700 .74rem/1.4 Arial,sans-serif;color:#d5caba}
      .arena-manual-d6-wrap{height:112px;margin:14px auto 5px;display:flex;align-items:center;justify-content:center}
      .arena-manual-d6-face{width:82px;height:82px;padding:10px;box-sizing:border-box;display:grid;grid-template-columns:repeat(3,1fr);grid-template-rows:repeat(3,1fr);gap:4px;border:3px solid #ead596;border-radius:14px;background:linear-gradient(145deg,#fff4d0,#b69d5b);box-shadow:0 10px 25px rgba(0,0,0,.55),inset 0 2px 0 rgba(255,255,255,.7);transform:rotate(-5deg);animation:arenaManualDiceShake .18s linear infinite}
      .arena-manual-d6-face i{display:block;width:11px;height:11px;align-self:center;justify-self:center;border-radius:50%;background:#251e23;box-shadow:inset 0 1px 1px rgba(255,255,255,.18)}
      .arena-manual-d6-face i.empty{opacity:0}
      .arena-manual-result{font-size:3rem;line-height:1;font-weight:900;color:#fff;text-shadow:0 3px 12px rgba(255,255,255,.25)}
      .arena-manual-mult{min-height:22px;margin-top:7px;font:900 .9rem Arial,sans-serif;color:#e8c76c}
      .arena-manual-roll-btn{width:100%;margin-top:14px;padding:13px 16px;border:2px solid #e2bd62;border-radius:9px;background:linear-gradient(180deg,#674b20,#382714);color:#ffe9aa;font:900 .95rem Arial,sans-serif;letter-spacing:1px;cursor:pointer;box-shadow:0 6px 16px rgba(0,0,0,.45);transition:transform .12s,filter .12s}
      .arena-manual-roll-btn:hover{filter:brightness(1.16);transform:translateY(-1px)}
      .arena-manual-roll-btn:disabled{opacity:.62;cursor:default;transform:none}
      .arena-manual-crit-overlay.rolling .arena-manual-mult{animation:arenaManualPulse .45s ease-in-out infinite}
      .arena-manual-crit-overlay.resolved .arena-manual-d6-face{animation:arenaManualResult .45s ease-out forwards}
      .arena-manual-crit-overlay.resolved .arena-manual-result{animation:arenaManualNumber .45s ease-out}
      @keyframes arenaManualDiceShake{0%{transform:rotate(-7deg) translate(-2px,-1px)}50%{transform:rotate(6deg) translate(2px,1px)}100%{transform:rotate(-5deg) translate(0,0)}}
      @keyframes arenaManualResult{to{transform:rotate(0) scale(1.1)}}
      @keyframes arenaManualNumber{from{transform:scale(.65);opacity:.1}to{transform:scale(1);opacity:1}}
      @keyframes arenaManualPulse{50%{opacity:.4}}
      @media(max-width:620px){.arena-manual-crit-modal{width:min(300px,88%);padding:17px}.arena-manual-d6-face{width:72px;height:72px}.arena-manual-d6-wrap{height:96px}}
    `;document.head.appendChild(s);
  }

  function openDice(baseAttack,critBonus,innerAttack){
    const area=document.getElementById('battleArea');if(!area){window.__arenaCritRolling=false;return;}
    area.querySelector('.arena-manual-crit-overlay')?.remove();
    const el=document.createElement('div');el.className='arena-manual-crit-overlay';
    el.innerHTML=`<div class="arena-manual-crit-modal"><div class="arena-manual-crit-title">CRÍTICO!</div><div class="arena-manual-crit-sub">Sua Critical Eye ativou!<br>Você decide quando rolar o D6.</div><div class="arena-manual-d6-wrap">${face(1)}</div><div class="arena-manual-result">?</div><div class="arena-manual-mult">Quanto maior o número, maior o dano.</div><button type="button" class="arena-manual-roll-btn">🎲 ROLAR O D6</button></div>`;
    area.appendChild(el);
    const btn=el.querySelector('.arena-manual-roll-btn');const wrap=el.querySelector('.arena-manual-d6-wrap');const result=el.querySelector('.arena-manual-result');const mult=el.querySelector('.arena-manual-mult');
    btn.addEventListener('click',()=>{
      if(btn.disabled)return;
      btn.disabled=true;btn.textContent='🎲 ROLANDO...';el.classList.add('rolling');
      const roll=1+Math.floor(Math.random()*6);const multiplier=1+(roll*.25);let ticks=0;const totalTicks=24;
      const timer=setInterval(()=>{
        ticks++;wrap.innerHTML=face(1+Math.floor(Math.random()*6));
        if(ticks>=totalTicks){
          clearInterval(timer);wrap.innerHTML=face(roll);result.textContent=roll;mult.textContent=`DANO CRÍTICO: x${multiplier.toFixed(2)}`;el.classList.remove('rolling');el.classList.add('resolved');
          setTimeout(()=>{
            el.remove();
            if(!battle){window.__arenaCritRolling=false;return;}
            const oldAttack=battle.attack;battle.attack=Math.floor(baseAttack*multiplier);
            let firstRandom=true;const oldRandom=Math.random;
            Math.random=()=>{if(firstRandom){firstRandom=false;return .999999}return oldRandom()};
            window.__arenaCritRolling=false;
            try{innerAttack()}finally{Math.random=oldRandom;battle.attack=oldAttack;window.__arenaCritRolling=false}
            battleLog(`<span class="loot">CRÍTICO! D6 = ${roll} · x${multiplier.toFixed(2)} dano</span>`);
          },900);
        }
      },140);
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
  }
  install();window.addEventListener('load',install);setTimeout(install,700);
})();
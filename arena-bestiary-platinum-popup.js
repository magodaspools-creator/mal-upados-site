// Popup de Platina do Bestiário — aparece uma única vez quando cada criatura é completada.
(()=>{
  if(window.__arenaBestiaryPlatinumPopupInstalled)return;
  window.__arenaBestiaryPlatinumPopupInstalled=true;

  const STORE='malupados_arena_v1';
  const REQUIRED=name=>name==='Deathbringer'?5:25;
  const MONSTERS={
    Rat:['🐀','Rat'],Troll:['👹','Troll'],Orc:['👺','Orc'],
    'Orc Berserker':['👺','Orc Berserker'],'Orc Rider':['🐗','Orc Rider'],Cyclops:['👁️','Cyclops'],
    Scorpion:['🦂','Scorpion'],'Ancient Scarab':['🪲','Ancient Scarab'],'Dragon Hatchling':['🐲','Dragon Hatchling'],
    Dragon:['🐉','Dragon'],'Dragon Lord':['🐲','Dragon Lord'],'Frost Dragon':['🐉','Frost Dragon'],
    'Demon Skeleton':['💀','Demon Skeleton'],Hellhound:['🐺','Hellhound'],Demon:['😈','Demon'],
    Deathbringer:['☠️','Deathbringer']
  };

  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const char=()=>game?.character||document.getElementById('characterPickerName')?.textContent?.trim()||'default';
  const key=name=>`malupados_bestiary_platinum_${char()}_${name}`;

  function show(name){
    const info=MONSTERS[name]||['🏆',name];
    document.getElementById('arenaBestiaryPlatinumPopup')?.remove();
    const el=document.createElement('div');
    el.id='arenaBestiaryPlatinumPopup';
    el.innerHTML=`<div class="bp-backdrop"></div><section class="bp-card" role="alertdialog" aria-label="Bestiário completo"><button class="bp-close" aria-label="Fechar">×</button><div class="bp-crown">🏆</div><div class="bp-icon">${info[0]}</div><small>BESTIÁRIO COMPLETO</small><h2>${esc(info[1])}</h2><div class="bp-platinum">PLATINA CONQUISTADA</div><p>Você derrotou <b>${REQUIRED(name)}</b> ${esc(info[1])}${REQUIRED(name)>1?'s':''} e completou o registro desta criatura.</p><div class="bp-reward">✦ REGISTRO DE PLATINA ✦</div><button class="bp-ok">CONTINUAR AVENTURA</button></section>`;
    document.body.appendChild(el);
    document.body.classList.add('bestiary-platinum-open');
    const close=()=>{el.remove();document.body.classList.remove('bestiary-platinum-open')};
    el.querySelector('.bp-close').onclick=close;
    el.querySelector('.bp-ok').onclick=close;
    el.querySelector('.bp-backdrop').onclick=close;
    el._close=close;
    setTimeout(()=>el.querySelector('.bp-ok')?.focus(),50);
  }

  window.addEventListener('arena:bestiary-kill',e=>{
    const name=e.detail?.name;
    const kills=Number(e.detail?.kills)||0;
    if(!name||kills!==REQUIRED(name))return;
    const k=key(name);
    if(localStorage.getItem(k)==='1')return;
    localStorage.setItem(k,'1');
    setTimeout(()=>show(name),120);
  });

  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'){
      const el=document.getElementById('arenaBestiaryPlatinumPopup');
      if(el?._close)el._close();
    }
  });

  const st=document.createElement('style');
  st.textContent=`
    body.bestiary-platinum-open{overflow:hidden}
    #arenaBestiaryPlatinumPopup{position:fixed;inset:0;z-index:100001;display:grid;place-items:center;padding:20px;box-sizing:border-box}
    .bp-backdrop{position:absolute;inset:0;background:rgba(0,0,0,.84);backdrop-filter:blur(5px)}
    .bp-card{position:relative;z-index:1;width:min(430px,100%);box-sizing:border-box;padding:32px 30px 28px;text-align:center;background:linear-gradient(180deg,#18170f,#0e1012 72%);border:1px solid #a89562;border-radius:16px;box-shadow:0 30px 100px rgba(0,0,0,.85),0 0 45px rgba(168,149,98,.18);animation:bpIn .35s ease-out}
    .bp-close{position:absolute;right:12px;top:10px;width:34px;height:34px;border:1px solid #383832;border-radius:8px;background:#151618;color:#aaa;font-size:22px;cursor:pointer}
    .bp-crown{font-size:30px;margin-bottom:2px}.bp-icon{font-size:64px;line-height:1.1;margin-bottom:10px;filter:drop-shadow(0 5px 12px rgba(0,0,0,.5))}
    .bp-card>small{color:#a89562;font-size:.65rem;letter-spacing:.16em;font-weight:900}.bp-card h2{margin:7px 0 10px;font-size:2rem;color:#f0e3b9}
    .bp-platinum{display:inline-block;padding:7px 13px;border:1px solid #a89562;border-radius:999px;color:#dfc675;font-size:.68rem;font-weight:900;letter-spacing:.08em}
    .bp-card p{color:#9a9da2;line-height:1.55;font-size:.8rem;margin:18px 8px}.bp-card p b{color:#ddd}
    .bp-reward{color:#cdb873;font-size:.62rem;font-weight:800;letter-spacing:.08em;margin:15px 0 20px}
    .bp-ok{width:100%;min-height:44px;border:1px solid #a89562;border-radius:8px;background:#211e16;color:#e4d5a7;font-weight:900;cursor:pointer}.bp-ok:hover{background:#2b271c}
    @keyframes bpIn{from{opacity:0;transform:translateY(12px) scale(.96)}to{opacity:1;transform:none}}
  `;
  document.head.appendChild(st);
})();

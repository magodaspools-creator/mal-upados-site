/*
 * Sistema de morte / Bless da Arena.
 * Isolado do combate principal: não altera dano, XP de vitória ou loot das hunts.
 * A Backpack nunca é perdida.
 */
(function(){
  const BLESS_ITEMS=[
    {id:'bless-basic',name:'Bless of Protection',icon:'🕊️',category:'bless',price:250,attack:0,defense:0,minLevel:1,bonus:'10% de proteção contra perda de item'},
    {id:'bless-greater',name:'Greater Bless',icon:'✨',category:'bless',price:900,attack:0,defense:0,minLevel:8,bonus:'25% de proteção contra perda de item'},
    {id:'bless-supreme',name:'Supreme Bless',icon:'🌟',category:'bless',price:2500,attack:0,defense:0,minLevel:20,bonus:'50% de proteção contra perda de item'}
  ];
  const BLESS_CATEGORY={id:'bless',label:'Bless'};

  function ensure(){
    if(typeof game==='undefined'||!game)return;
    game.blesses=game.blesses||{};
    BLESS_ITEMS.forEach(x=>{game.blesses[x.id]=Math.max(0,Number(game.blesses[x.id])||0)});
  }

  function addCatalog(){
    if(typeof SHOP_CATEGORIES!=='undefined'&&!SHOP_CATEGORIES.some(x=>x.id==='bless'))SHOP_CATEGORIES.push(BLESS_CATEGORY);
    if(typeof SHOP_ITEMS!=='undefined')BLESS_ITEMS.forEach(item=>{if(!SHOP_ITEMS.some(x=>x.id===item.id))SHOP_ITEMS.push(item)});
  }

  function totalBlesses(){ensure();return BLESS_ITEMS.reduce((n,x)=>n+(game.blesses[x.id]||0),0)}
  function bestBless(){
    ensure();
    return BLESS_ITEMS.reduce((best,x)=>{
      if((game.blesses[x.id]||0)>0)return !best||x.minLevel>best.minLevel?x:best;
      return best;
    },null);
  }
  function protectionPercent(){
    const b=bestBless();
    if(!b)return 0;
    return b.id==='bless-basic'?10:b.id==='bless-greater'?25:50;
  }
  function consumeBless(){
    ensure();
    const b=bestBless();
    if(!b)return null;
    game.blesses[b.id]=Math.max(0,(game.blesses[b.id]||0)-1);
    return b;
  }

  function setBonusLabel(item){
    if(item.category!=='bless')return item.bonus;
    const owned=game?.blesses?.[item.id]||0;
    return `${item.bonus} · ${owned} disponível${owned===1?'':'eis'}`;
  }

  function buyOrEquipBless(item){
    ensure();
    if(game.level<item.minLevel){toast(`Você precisa do Level ${item.minLevel}.`);return true}
    if(game.gold<item.price){toast('Gold insuficiente para comprar esta Bless.');return true}
    game.gold-=item.price;
    game.blesses[item.id]=(game.blesses[item.id]||0)+1;
    persist();
    toast(`${item.name} adquirida. Será consumida quando uma morte precisar de proteção contra perda de item.`);
    shopRender();
    return true;
  }

  function installShop(){
    addCatalog();
    if(typeof shopRender!=='function'||window.__arenaBlessShopInstalled)return;
    window.__arenaBlessShopInstalled=true;
    const original=shopRender;
    window.shopRender=function(){
      ensure();
      original();
      const box=document.getElementById('shopItems');
      if(!box)return;
      box.querySelectorAll('.shop-item').forEach(card=>{
        const name=card.querySelector('.shop-info strong')?.textContent||card.querySelector('h3')?.textContent;
        const item=BLESS_ITEMS.find(x=>x.name===name);
        if(!item)return;
        const button=card.querySelector('button');
        if(button){
          button.textContent=`Comprar · ${fmt(item.price)} gold`;
          button.disabled=false;
          button.onclick=()=>buyOrEquipBless(item);
        }
        const bonus=card.querySelector('.shop-bonus');
        if(bonus)bonus.textContent=setBonusLabel(item);
        card.classList.toggle('bless-owned',!!(game.blesses[item.id]||0));
      });
    };
    window.shopRender();
  }

  function itemLossPool(){
    if(typeof SHOP_ITEMS==='undefined')return [];
    const equipped=game.shopEquipped||{};
    return SHOP_ITEMS.filter(item=>
      item.category!=='backpacks' &&
      item.category!=='bless' &&
      item.category!=='amulets' &&
      item.category!=='trinkets' &&
      Object.values(equipped).includes(item.id)
    );
  }

  function removeItem(item){
    const slot=item.category==='weapons'||item.category==='wands'?'weapon':item.category;
    if(game.shopOwned)game.shopOwned=game.shopOwned.filter(id=>id!==item.id);
    if(game.shopEquipped&&game.shopEquipped[slot]===item.id)game.shopEquipped[slot]=null;
  }

  function deathPenalty(){
    ensure();
    const roll=Math.random();
    let result={type:'gold',message:'',protected:false,bless:null};

    if(roll<0.45){
      const pool=itemLossPool();
      if(!pool.length){
        result.type='gold';
        const lost=Math.max(10,Math.floor(game.gold*(0.08+Math.random()*0.08)));
        game.gold=Math.max(0,game.gold-lost);
        result.lost=lost;
        result.message=`Você perdeu ${fmt(lost)} gold.`;
      }else{
        const item=pool[Math.floor(Math.random()*pool.length)];
        const bless=consumeBless();
        if(bless){
          result.type='protected';
          result.protected=true;
          result.bless=bless;
          result.item=item;
          result.message=`${bless.name} protegeu seu ${item.name}! A Bless foi consumida.`;
        }else{
          removeItem(item);
          result.type='item';
          result.item=item;
          result.message=`Você perdeu ${item.name}. A Backpack não pode ser perdida.`;
        }
      }
    }else if(roll<0.85){
      const lost=Math.max(10,Math.floor(game.gold*(0.08+Math.random()*0.08)));
      game.gold=Math.max(0,game.gold-lost);
      result.type='gold';
      result.lost=lost;
      result.message=`Você perdeu ${fmt(lost)} gold.`;
    }else{
      const lostXP=Math.max(10,Math.floor((100+((game.level-1)*65))*0.20));
      if(game.xp>=lostXP)game.xp-=lostXP;
      else if(game.level>1){game.level--;game.xp=0}
      else game.xp=0;
      result.type='xp';
      result.lost=lostXP;
      result.message=game.level>1?`Você perdeu ${fmt(lostXP)} XP.`:`Você perdeu ${fmt(lostXP)} XP. O Level não pode cair abaixo de 1.`;
    }
    return result;
  }

  function showDeathPopup(result){
    document.getElementById('arenaDeathPopup')?.remove();
    const labels={
      item:{icon:'⚠️',title:'VOCÊ MORREU',headline:'ITEM PERDIDO',className:'danger'},
      protected:{icon:'🛡️',title:'VOCÊ MORREU',headline:'ITEM PROTEGIDO',className:'protected'},
      gold:{icon:'💰',title:'VOCÊ MORREU',headline:'GOLD PERDIDO',className:'warning'},
      xp:{icon:'💀',title:'VOCÊ MORREU',headline:'XP PERDIDO',className:'danger'}
    };
    const cfg=labels[result.type]||labels.gold;
    let detail=result.message;
    if(result.type==='item')detail=`Você perdeu o item <strong>${esc(result.item?.name||'do equipamento')}</strong>.`;
    if(result.type==='protected')detail=`A <strong>${esc(result.bless?.name||'Bless')}</strong> protegeu o item <strong>${esc(result.item?.name||'do equipamento')}</strong>.`;
    if(result.type==='gold')detail=`Você perdeu <strong>${fmt(result.lost||0)} gold</strong>.`;
    if(result.type==='xp')detail=`Você perdeu <strong>${fmt(result.lost||0)} XP</strong>.`;
    const el=document.createElement('div');
    el.id='arenaDeathPopup';
    el.className=`arena-death-overlay ${cfg.className}`;
    el.innerHTML=`<div class="arena-death-modal" role="dialog" aria-modal="true" aria-labelledby="arenaDeathTitle"><button class="arena-death-close" aria-label="Fechar">×</button><div class="arena-death-icon">${cfg.icon}</div><div class="arena-death-kicker">${cfg.title}</div><h2 id="arenaDeathTitle">${cfg.headline}</h2><p class="arena-death-detail">${detail}</p><p class="arena-death-note">A Backpack está sempre protegida.</p><button class="btn active arena-death-ok">ENTENDI</button></div></div>`;
    document.body.appendChild(el);
    const close=()=>el.remove();
    el.querySelector('.arena-death-close').onclick=close;
    el.querySelector('.arena-death-ok').onclick=close;
    el.addEventListener('click',e=>{if(e.target===el)close()});
    const escClose=e=>{if(e.key==='Escape'){close();document.removeEventListener('keydown',escClose)}};
    document.addEventListener('keydown',escClose);
  }

  function installDeath(){
    if(typeof loseBattle!=='function'||window.__arenaBlessDeathInstalled)return;
    window.__arenaBlessDeathInstalled=true;
    const original=loseBattle;
    window.loseBattle=function(){
      const result=deathPenalty();
      game.streak=0;
      persist();
      original();
      const resultBox=document.querySelector('#battleArea .battle-empty.result');
      if(resultBox){
        const p=resultBox.querySelector('p');
        if(p)p.innerHTML=`<strong class="death-penalty">${esc(result.message)}</strong><br><span>Seu equipamento e progresso podem sofrer consequências. A Backpack está protegida.</span>`;
        const title=resultBox.querySelector('h3');
        if(title)title.textContent=result.type==='protected'?'Você caiu, mas a Bless protegeu seu set.':'Você caiu.';
        const icon=resultBox.querySelector('.battle-icon');
        if(icon)icon.textContent=result.type==='protected'?'🛡️':'💀';
      }
      if(typeof shopRender==='function')shopRender();
      if(typeof renderAll==='function')renderAll();
      showDeathPopup(result);
      renderProtectionStatus();
    };
  }

  function renderProtectionStatus(){
    const wrap=document.getElementById('arenaBlessStatus');
    if(!wrap||typeof game==='undefined')return;
    ensure();
    const active=BLESS_ITEMS.filter(x=>game.blesses[x.id]>0);
    const parts=active.map(x=>`${x.name}: ${game.blesses[x.id]}`).join(' · ');
    const pct=protectionPercent();
    wrap.innerHTML=`<div><strong>Proteção de morte</strong><span>${parts||'Nenhuma Bless ativa'}</span></div><b>${pct}%</b>`;
  }

  function addDeathPanel(){
    if(typeof game==='undefined')return;
    const panel=document.querySelector('.character-panel');
    if(!panel)return;
    let wrap=document.getElementById('arenaBlessStatus');
    if(!wrap){
      wrap=document.createElement('div');
      wrap.id='arenaBlessStatus';
      wrap.className='arena-bless-status';
      panel.appendChild(wrap);
    }else if(wrap.parentElement!==panel){
      panel.appendChild(wrap);
    }
    renderProtectionStatus();
  }

  window.arenaDeathBless={BLESS_ITEMS,ensure,totalBlesses,protectionPercent,deathPenalty};
  function boot(){ensure();addCatalog();installShop();installDeath();addDeathPanel();}
  document.addEventListener('DOMContentLoaded',boot);
  window.addEventListener('load',boot);
  setInterval(addDeathPanel,800);
  setInterval(renderProtectionStatus,500);
})();

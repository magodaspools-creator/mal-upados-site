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
    if(typeof SHOP_ITEMS!=='undefined'){
      BLESS_ITEMS.forEach(item=>{if(!SHOP_ITEMS.some(x=>x.id===item.id))SHOP_ITEMS.push(item)});
    }
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
    toast(`${item.name} adquirida. Ela será consumida ao morrer se proteger uma perda de item.`);
    shopRender();
    return true;
  }

  function installShop(){
    addCatalog();
    if(typeof shopRender!=='function')return;
    const original=shopRender;
    window.shopRender=function(){
      ensure();
      original();
      const box=document.getElementById('shopItems');
      if(!box)return;
      box.querySelectorAll('.shop-item').forEach(card=>{
        const name=card.querySelector('h3')?.textContent;
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

  function loseRandomSetItem(){
    const pool=itemLossPool();
    if(!pool.length)return null;
    const item=pool[Math.floor(Math.random()*pool.length)];
    const slot=item.category==='weapons'||item.category==='wands'?'weapon':item.category;
    if(game.shopOwned)game.shopOwned=game.shopOwned.filter(id=>id!==item.id);
    if(game.shopEquipped&&game.shopEquipped[slot]===item.id)game.shopEquipped[slot]=null;
    return item;
  }

  function deathPenalty(){
    ensure();
    const roll=Math.random();
    let result={type:'gold',message:'',protected:false,bless:null};

    // 45% item, 40% gold, 15% level/XP.
    if(roll<0.45){
      const item=loseRandomSetItem();
      if(!item){
        result.type='gold';
      }else{
        const bless=consumeBless();
        if(bless){
          result.type='protected';
          result.protected=true;
          result.bless=bless;
          result.message=`${bless.name} protegeu seu ${item.name}! A Bless foi consumida.`;
        }else{
          result.type='item';
          result.item=item;
          result.message=`Você perdeu ${item.name}. A Backpack não pode ser perdida.`;
        }
      }
    }

    if(result.type==='gold'){
      const lost=Math.max(10,Math.floor(game.gold*(0.08+Math.random()*0.08)));
      game.gold=Math.max(0,game.gold-lost);
      result.lost=lost;
      result.message=`Você perdeu ${fmt(lost)} gold.`;
    }

    if(roll>=0.85){
      const lostXP=Math.max(10,Math.floor((100+((game.level-1)*65))*0.20));
      if(game.xp>=lostXP){
        game.xp-=lostXP;
      }else if(game.level>1){
        game.level--;
        game.xp=Math.max(0,xpNeed()-lostXP);
      }else{
        game.xp=0;
      }
      result.type='xp';
      result.message=`A morte também fez você perder ${fmt(lostXP)} XP.`;
    }

    return result;
  }

  function installDeath(){
    if(typeof loseBattle!=='function')return;
    const original=loseBattle;
    window.loseBattle=function(){
      const result=deathPenalty();
      game.streak=0;
      persist();
      original();
      const resultBox=document.querySelector('#battleArea .battle-empty.result');
      if(!resultBox)return;
      const p=resultBox.querySelector('p');
      if(p){
        p.innerHTML=`<strong class="death-penalty">${esc(result.message)}</strong><br><span>Seu equipamento e progresso podem sofrer consequências. A Backpack está protegida.</span>`;
      }
      const title=resultBox.querySelector('h3');
      if(title)title.textContent=result.type==='protected'?'Você caiu, mas a Bless protegeu seu set.':'Você caiu.';
      const icon=resultBox.querySelector('.battle-icon');
      if(icon)icon.textContent=result.type==='protected'?'🛡️':'💀';
      if(typeof shopRender==='function')shopRender();
      if(typeof renderAll==='function')renderAll();
    };
  }

  function addDeathPanel(){
    if(document.getElementById('arenaBlessStatus')||typeof game==='undefined')return;
    const panel=document.querySelector('.character-panel');
    if(!panel)return;
    const wrap=document.createElement('div');
    wrap.id='arenaBlessStatus';
    wrap.className='arena-bless-status';
    panel.appendChild(wrap);
    function render(){
      ensure();
      const parts=BLESS_ITEMS.filter(x=>game.blesses[x.id]>0).map(x=>`${x.name}: ${game.blesses[x.id]}`).join(' · ');
      wrap.innerHTML=`<div><strong>Proteção de morte</strong><span>${parts||'Nenhuma Bless ativa'}</span></div><b>${protectionPercent()}%</b>`;
    }
    render();
    setInterval(render,500);
  }

  window.arenaDeathBless={BLESS_ITEMS,ensure,totalBlesses,protectionPercent,deathPenalty};
  document.addEventListener('DOMContentLoaded',()=>{
    ensure();
    addCatalog();
    installShop();
    installDeath();
    addDeathPanel();
  });
  window.addEventListener('load',()=>{
    ensure();
    addCatalog();
    installShop();
    installDeath();
    addDeathPanel();
  });
})();

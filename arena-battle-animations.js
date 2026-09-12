/* Arena Battle — sequência visual de ataque sem alterar as regras de combate */
(function(){
  let busy=false;
  function particles(area){
    for(let i=0;i<9;i++){
      const p=document.createElement('i');
      p.className='arena-particle';
      p.style.left=(55+Math.random()*12)+'%';
      p.style.top=(40+Math.random()*12)+'%';
      p.style.setProperty('--dx',((Math.random()-.5)*150)+'px');
      p.style.setProperty('--dy',((Math.random()-.5)*100)+'px');
      area.appendChild(p);
      setTimeout(()=>p.remove(),650);
    }
  }
  function effects(){
    const area=document.getElementById('battleArea');
    if(!area)return;
    area.classList.remove('arena-attacking');
    void area.offsetWidth;
    area.classList.add('arena-attacking');
    const slash=document.createElement('div');slash.className='arena-slash';area.appendChild(slash);
    const hit=document.createElement('div');hit.className='arena-hit';hit.textContent='HIT!';area.appendChild(hit);
    const impact=document.createElement('div');impact.className='arena-impact';area.appendChild(impact);
    particles(area);
    setTimeout(()=>area.classList.remove('arena-attacking'),650);
    setTimeout(()=>slash.remove(),600);
    setTimeout(()=>hit.remove(),850);
    setTimeout(()=>impact.remove(),600);
  }
  document.addEventListener('click',function(e){
    const btn=e.target.closest('#attackBtn');
    if(!btn||btn.disabled||busy)return;
    e.preventDefault();e.stopImmediatePropagation();busy=true;btn.disabled=true;
    effects();
    setTimeout(function(){
      if(typeof window.attack==='function')window.attack();
      busy=false;
      setTimeout(function(){
        const area=document.getElementById('battleArea');
        if(area&&area.querySelector('.battle-card')&&document.querySelector('.fighter')){
          area.classList.add('arena-counter');
          setTimeout(()=>area.classList.remove('arena-counter'),650);
        }
      },45);
    },520);
  },true);
})();

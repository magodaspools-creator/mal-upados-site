/* Arena Battle Animations — intercepta ATACAR sem alterar a lógica de combate */
(function(){
  function effects(){
    const area=document.getElementById('battleArea');
    if(!area) return;
    area.classList.add('arena-attacking');
    const slash=document.createElement('div'); slash.className='arena-slash'; area.appendChild(slash);
    const hit=document.createElement('div'); hit.className='arena-hit'; hit.textContent='HIT!'; area.appendChild(hit);
    const impact=document.createElement('div'); impact.className='arena-impact'; area.appendChild(impact);
    setTimeout(()=>slash.remove(),500);
    setTimeout(()=>hit.remove(),800);
    setTimeout(()=>impact.remove(),500);
  }
  document.addEventListener('click',function(e){
    const btn=e.target.closest('#attackBtn');
    if(!btn || btn.disabled) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    btn.disabled=true;
    effects();
    setTimeout(function(){
      if(typeof window.attack==='function') window.attack();
    },420);
  },true);
})();

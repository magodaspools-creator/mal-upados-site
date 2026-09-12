// Loader isolado dos sistemas de campanha da Arena.
// Não altera loja, armas, personagens ou motor de combate.
(()=>{
  const load=(src)=>{
    if(document.querySelector(`script[data-arena-feature="${src}"]`))return;
    const s=document.createElement('script');
    s.src=src;
    s.dataset.arenaFeature=src;
    document.body.appendChild(s);
  };
  load('arena-campaign-timer.js?v=timer-20260912');
  load('arena-bestiary.js?v=bestiary-20260912');
})();

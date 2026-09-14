(()=>{
  if(window.__arenaCursedRuinsUI)return;
  window.__arenaCursedRuinsUI=true;
  const s=document.createElement('style');
  s.id='arenaCursedRuinsUIStyle';
  s.textContent=`
    .map{grid-template-columns:repeat(6,minmax(0,1fr))!important}
    .arena-map-board{grid-template-columns:repeat(6,1fr)!important}
    @media(max-width:900px){.map{grid-template-columns:repeat(3,minmax(0,1fr))!important}.arena-map-board{grid-template-columns:repeat(3,1fr)!important}}
    @media(max-width:760px){.map{grid-template-columns:1fr 1fr!important}.arena-map-board{grid-template-columns:1fr!important}}
  `;
  document.head.appendChild(s);
  const timer=setInterval(()=>{
    const h=document.querySelector('#arenaMapModal .arena-map-modal-head h3');
    if(h)h.textContent='As seis regiões da Arena';
    const p=document.querySelector('#arenaMapModal .arena-map-modal-head p');
    if(p)p.textContent='Escolha uma área desbloqueada. As Ruínas Amaldiçoadas adicionam uma regra própria de combate.';
  },300);
  setTimeout(()=>clearInterval(timer),120000);
})();
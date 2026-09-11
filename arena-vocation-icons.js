// Ícones das vocações no avatar principal da Arena. Isolado da lógica do jogo.
(()=>{
  function iconFor(vocation){
    const v=String(vocation||'').toLowerCase();
    if(v.includes('sorcerer')||v.includes('master sorcerer')) return '🔥';
    if(v.includes('druid')) return '❄️';
    if(v.includes('knight')) return '⚔️';
    if(v.includes('monk')) return '🖐️';
    return '⚔';
  }
  function apply(){
    const el=document.getElementById('avatar');
    if(!el||typeof game==='undefined'||!game||typeof members==='undefined'||!Array.isArray(members))return;
    const member=members.find(m=>m.name===game.character);
    el.textContent=iconFor(member?.vocation);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply);else apply();
  setInterval(apply,500);
})();

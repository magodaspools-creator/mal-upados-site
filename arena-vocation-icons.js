// Avatar da vocação: este arquivo é a única camada responsável por manter o ícone visual da vocação.
// O equipamento (luvas, armas etc.) não deve alterar o avatar principal.
(()=>{
  if(window.__arenaVocationAvatarFix)return;
  window.__arenaVocationAvatarFix=true;

  function iconFor(vocation){
    const v=String(vocation||'').toLowerCase();
    if(v.includes('sorcerer')||v.includes('master sorcerer')) return '🔥';
    if(v.includes('druid')) return '❄️';
    if(v.includes('knight')) return '⚔️';
    if(v.includes('paladin')) return '🏹';
    if(v.includes('monk')) return '🖐️';
    return '⚔';
  }

  function apply(){
    const el=document.getElementById('avatar');
    if(!el||typeof game==='undefined'||!game||typeof members==='undefined'||!Array.isArray(members))return;
    const member=members.find(m=>m.name===game.character);
    if(!member?.vocation)return;
    el.textContent=iconFor(member.vocation);
  }

  // Mantém o avatar estável, mas não usa equipamento para decidir a imagem.
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});
  else apply();
  setInterval(apply,500);
})();

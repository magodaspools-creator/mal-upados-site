// Avatar da vocação: esta é a única camada visual que reforça o ícone da vocação.
// Equipamentos, luvas e armas não podem trocar o avatar principal.
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

  // arena.js renderPlayer() também toca no avatar. Em vez de dois intervalos
  // brigando pelo DOM, este módulo só reforça o avatar imediatamente depois do
  // renderPlayer original e quando um personagem novo é criado.
  const hookRenderPlayer=()=>{
    if(typeof window.renderPlayer!=='function')return false;
    if(window.__arenaVocationRenderHook)return true;
    const original=window.renderPlayer;
    window.renderPlayer=function(...args){
      const result=original.apply(this,args);
      apply();
      return result;
    };
    window.__arenaVocationRenderHook=true;
    apply();
    return true;
  };

  const boot=()=>{if(hookRenderPlayer())return;setTimeout(boot,150)};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  window.addEventListener('arena-character-created',()=>setTimeout(apply,0));
})();

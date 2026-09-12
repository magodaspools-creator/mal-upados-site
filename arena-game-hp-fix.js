// Correção visual do HP do inimigo do modo de ondas.
(()=>{
 const sync=()=>{
  const text=document.getElementById('arenaEnemyHpText'),bar=document.getElementById('arenaEnemyHpBar');
  if(!text||!bar)return;
  const m=text.textContent.match(/([\d.]+)\s*\/\s*([\d.]+)/);if(!m)return;
  const current=Number(m[1].replace(/\./g,''))||0,max=Number(m[2].replace(/\./g,''))||0;
  bar.style.width=`${max?Math.max(0,Math.min(100,current/max*100)):0}%`;
 };
 const watch=()=>{if(!document.getElementById('arenaGameMode'))return;sync();const target=document.getElementById('arenaEnemyHpText');if(target&&!target.dataset.hpObserver){new MutationObserver(sync).observe(target,{childList:true,characterData:true,subtree:true});target.dataset.hpObserver='1'}};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',watch,{once:true});else watch();
 setInterval(watch,500);
})();
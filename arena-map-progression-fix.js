// Corrige a progressao entre mapas da Arena.
// Cada area tem 3 criaturas: ao vencer as 3, aparece um botao claro para avancar.
(()=>{
  if(window.__arenaMapProgressionFix)return;
  window.__arenaMapProgressionFix=true;

  function ensure(){
    if(typeof game==='undefined'||!game||typeof ZONES==='undefined')return;
    const map=document.getElementById('map');
    if(!map)return;

    const current=Math.min(Number(game.zone)||0,ZONES.length-1);
    const kills=Number(game.kills)||0;
    const required=(current+1)*3;
    const next=current+1;
    const old=document.getElementById('arenaNextZoneFix');
    if(old)old.remove();

    if(next>=ZONES.length||kills<required)return;

    const zone=ZONES[next];
    const levelOk=(Number(game.level)||1)>=Number(zone.min||1);
    const wrap=document.createElement('div');
    wrap.id='arenaNextZoneFix';
    wrap.style.cssText='margin:14px 0;padding:14px;border:1px solid rgba(255,255,255,.12);border-radius:12px;background:rgba(0,0,0,.22);text-align:center;';
    wrap.innerHTML=`<div style="font-weight:800;margin-bottom:8px">AREA CONCLUIDA</div><div style="font-size:13px;opacity:.8;margin-bottom:10px">Você derrotou as 3 criaturas desta área.</div><button class="btn active big" id="arenaNextZoneBtn">IR PARA ${String(zone.name).toUpperCase()} →</button>`;
    map.parentNode.insertBefore(wrap,map.nextSibling);

    const btn=document.getElementById('arenaNextZoneBtn');
    btn.onclick=()=>{
      if(!levelOk){
        if(typeof toast==='function')toast(`Você precisa chegar ao Level ${zone.min} para entrar em ${zone.name}.`);
        return;
      }
      game.zone=next;
      if(typeof persist==='function')persist();
      if(typeof renderAll==='function')renderAll();
      if(typeof showZone==='function')showZone(next);
    };
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(ensure,300));
  else setTimeout(ensure,300);
  setInterval(ensure,700);
})();

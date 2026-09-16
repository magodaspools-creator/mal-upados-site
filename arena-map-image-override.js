(()=>{
  if(window.__arenaMapImageOverride)return;
  window.__arenaMapImageOverride=true;
  const RAW='https://raw.githubusercontent.com/magodaspools-creator/mal-upados-site/main/assets/arena-map/';

  async function applyNewMap(){
    const img=document.querySelector('#arenaMapTabImage');
    if(!img)return;
    img.style.opacity='0';
    try{
      const r=await fetch(`${RAW}mapa-arena-upados.b64?v=mapa-ilustrado-20260916`,{cache:'no-store'});
      if(!r.ok)throw new Error(`mapa-arena-upados.b64 ${r.status}`);
      const b64=(await r.text()).trim();
      if(!b64.startsWith('/9j/'))throw new Error('novo mapa não é JPEG em base64');
      const raw=atob(b64),bytes=new Uint8Array(raw.length);
      for(let i=0;i<raw.length;i++)bytes[i]=raw.charCodeAt(i);
      const blobUrl=URL.createObjectURL(new Blob([bytes],{type:'image/jpeg'}));
      img.onload=()=>{
        img.style.opacity='1';
        const loading=img.parentElement?.querySelector('.arena-map-tab-loading');
        loading?.remove();
        setTimeout(()=>URL.revokeObjectURL(blobUrl),1000);
      };
      img.onerror=()=>{img.style.opacity='1';URL.revokeObjectURL(blobUrl)};
      img.src=blobUrl;
    }catch(err){
      console.error('[Arena Map] Novo mapa ilustrado falhou:',err);
      img.style.opacity='1';
    }
  }

  function hook(){
    if(!window.arenaMapTab){setTimeout(hook,100);return}
    if(window.arenaMapTab.__imageOverride)return;
    const originalRender=window.arenaMapTab.render;
    const originalActivate=window.arenaMapTab.activate;
    window.arenaMapTab.render=function(){
      const result=originalRender.apply(this,arguments);
      setTimeout(applyNewMap,20);
      return result;
    };
    window.arenaMapTab.activate=function(){
      const result=originalActivate.apply(this,arguments);
      setTimeout(applyNewMap,20);
      return result;
    };
    window.arenaMapTab.__imageOverride=true;
    setTimeout(applyNewMap,50);
  }
  hook();
})();
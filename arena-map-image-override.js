(()=>{
  if(window.__arenaMapImageOverride)return;
  window.__arenaMapImageOverride=true;

  const MAP_URL='https://raw.githubusercontent.com/magodaspools-creator/mal-upados-site/main/assets/arena-map/mapa%20arena%202048%20%C3%97%201024%20px.jpeg?v=arena-map-original-20260917';

  function applyNewMap(){
    const img=document.querySelector('#arenaMapTabImage');
    if(!img)return;

    const loading=img.parentElement?.querySelector('.arena-map-tab-loading');

    img.removeAttribute('width');
    img.removeAttribute('height');
    img.decoding='async';
    img.loading='eager';
    img.fetchPriority='high';
    img.style.opacity='1';
    img.style.imageRendering='auto';
    img.style.filter='none';
    img.style.transform='none';
    img.src=MAP_URL;

    img.onload=()=>{
      img.style.opacity='1';
      loading?.remove();
      console.log('[Arena Map] original JPEG carregado:', img.naturalWidth+'x'+img.naturalHeight, 'render:', img.clientWidth+'x'+img.clientHeight);
    };
    img.onerror=()=>{
      img.style.opacity='1';
      if(loading)loading.textContent='MAPA INDISPONÍVEL';
      console.error('[Arena Map] falha ao carregar JPEG original');
    };
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
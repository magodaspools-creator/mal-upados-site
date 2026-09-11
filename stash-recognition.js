(function(){
  // A extração da grade agora acontece em stash.js.
  // Este arquivo fica como camada de integração do reconhecimento de sprites,
  // sem repetir o processamento pesado da imagem.
  window.StashRecognition={
    version:'2026.09.11',
    getReports:function(){return window.__stashReports||[];},
    status:'ready-for-sprite-matching'
  };
})();
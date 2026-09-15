// Obsoleto por design.
// A Arena usa uma única Home com navegação/scroll e o mapa permanece na Home.
// Este arquivo fica como no-op para evitar que versões antigas do startup
// consigam recriar as views dinamicamente e causar a piscada da segunda tela.
(()=>{
  window.__arenaViewsDisabled=true;
})();

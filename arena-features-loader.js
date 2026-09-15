// Obsoleto.
// Este loader apontava para arena-campaign-timer.js e arena-bestiary.js,
// módulos antigos que não fazem parte mais da arquitetura atual da Arena.
// Os sistemas atuais são carregados pelo arena-startup-fix.js e pelos scripts
// estáticos de arena.html. Mantemos o arquivo como no-op para evitar que uma
// referência antiga reintroduza módulos quebrados ou duplicados.
(()=>{
  window.__arenaFeaturesLoaderDisabled=true;
})();

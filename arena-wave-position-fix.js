// Mantém o modo Waves depois da Loja, para o jogador não precisar rolar entre batalha e equipamentos.
(()=>{
  function moveWaves(){
    const waves=document.getElementById('arenaGameMode');
    const shop=document.querySelector('.boss-token-shop') || document.querySelector('.shop-section');
    if(!waves || !shop)return;
    if(shop.nextElementSibling!==waves) shop.insertAdjacentElement('afterend',waves);
  }
  moveWaves();
  const observer=new MutationObserver(moveWaves);
  observer.observe(document.body,{childList:true,subtree:true});
  setTimeout(()=>observer.disconnect(),10000);

  // Carrega o normalizador das sprites mesmo sem alterar o HTML da Arena.
  function loadSpriteNormalizer(){
    if(document.getElementById('arena-game-sprite-normalize'))return;
    const s=document.createElement('script');
    s.id='arena-game-sprite-normalize';
    s.src='arena-game-sprite-normalize.js?v=sprite-normalize-20260912';
    document.body.appendChild(s);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',loadSpriteNormalizer);else loadSpriteNormalizer();
})();

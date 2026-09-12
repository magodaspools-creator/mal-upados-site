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
})();

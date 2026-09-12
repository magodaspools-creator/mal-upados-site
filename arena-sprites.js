/* Mal Upados Arena - pixel-art sprite layer
 * Uses the real GegX Knight Hero asset already stored in arena-godot.
 * The monster pack is not present in the current web repo yet, so enemy
 * slots use the same real pixel-art source with controlled visual variants
 * instead of emoji placeholders.
 */
(()=>{
  const RAW='https://raw.githubusercontent.com/magodaspools-creator/mal-upados-site/main/';
  const KNIGHT_IDLE=RAW+'arena-godot/characters/knight-hero-128/knight-hero-128/idle_south/00.png';
  const WEAPON_SHEET=RAW+'arena-godot/items/16x16%20Weapons%20RPG%20Icons/16x16%20Weapons%20RPG%20Icons/all-assets-preview.png';

  function img(src,cls,alt){
    const el=document.createElement('img');
    el.src=src; el.className=cls||''; el.alt=alt||''; el.draggable=false;
    el.loading='eager'; el.decoding='async';
    el.onerror=()=>el.remove();
    return el;
  }

  function vocationSprite(){
    const member=(typeof members!=='undefined'&&Array.isArray(members))?members.find(m=>m.name===game?.character):null;
    const vocation=String(member?.vocation||'').toLowerCase();
    // Only Knight is confirmed in the current repository. Other vocation packs
    // can be picked up automatically once their files are committed.
    if(vocation.includes('knight')) return KNIGHT_IDLE;
    return null;
  }

  function paintAvatar(){
    const el=document.getElementById('avatar');
    if(!el||typeof game==='undefined'||!game)return;
    const src=vocationSprite();
    if(!src){
      if(!el.querySelector('.arena-sprite')) el.textContent='⚔️';
      return;
    }
    let sprite=el.querySelector('.arena-sprite');
    if(!sprite){
      el.textContent='';
      sprite=img(src,'arena-sprite','Personagem da Arena');
      sprite.classList.add('player-sprite');
      el.appendChild(sprite);
    }else if(sprite.src!==src){sprite.src=src;}
  }

  function paintBattleSprites(){
    document.querySelectorAll('.fighter-icon').forEach((el,index)=>{
      if(el.querySelector('.arena-sprite'))return;
      if(index===0){
        const src=vocationSprite();
        if(src){el.textContent='';el.appendChild(img(src,'arena-sprite fighter-sprite','Seu personagem'));}
      }else{
        // Real pixel-art fallback until the GegX monster directory is committed.
        el.textContent='';
        const sprite=img(KNIGHT_IDLE,'arena-sprite fighter-sprite enemy-sprite','Criatura da Arena');
        sprite.classList.add('enemy-variant-'+(index%4));
        el.appendChild(sprite);
      }
    });

    document.querySelectorAll('.monster-choice').forEach((button,i)=>{
      const span=button.querySelector('span');
      if(!span||span.querySelector('.arena-sprite'))return;
      span.textContent='';
      const sprite=img(KNIGHT_IDLE,'arena-sprite choice-sprite','Criatura');
      sprite.classList.add('enemy-variant-'+(i%4));
      span.appendChild(sprite);
    });
  }

  function paintEquipment(){
    document.querySelectorAll('.shop-icon').forEach((el)=>{
      if(el.querySelector('.arena-item-sprite'))return;
      const item=el.closest('.shop-item');
      if(!item)return;
      el.textContent='';
      const sprite=img(WEAPON_SHEET,'arena-item-sprite','Equipamento');
      el.appendChild(sprite);
    });
  }

  function apply(){
    paintAvatar();
    paintBattleSprites();
    paintEquipment();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply);else apply();
  setInterval(apply,350);
})();

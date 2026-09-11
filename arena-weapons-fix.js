// Arsenal extra da Arena: armas para todas as vocações.
const CLASS_WEAPONS=[
  {id:'knight-sword',name:'Executioner Sword',icon:'⚔️',category:'weapons',class:'Knight',price:420,attack:16,defense:0,minLevel:6,bonus:'+16 ataque · Knight'},
  {id:'knight-axe',name:'Dragon Slayer',icon:'🪓',category:'weapons',class:'Knight',price:620,attack:19,defense:0,minLevel:9,bonus:'+19 ataque · Knight'},
  {id:'knight-club',name:'Blessed Sceptre',icon:'🔨',category:'weapons',class:'Knight',price:880,attack:23,defense:2,minLevel:13,bonus:'+23 ataque · +2 defesa · Knight'},
  {id:'knight-demon',name:'Demon Slayer',icon:'⚔️',category:'weapons',class:'Knight',price:1450,attack:29,defense:3,minLevel:20,bonus:'+29 ataque · +3 defesa · Knight'},
  {id:'paladin-bow',name:'Composite Hornbow',icon:'🏹',category:'weapons',class:'Paladin',price:430,attack:16,defense:0,minLevel:6,bonus:'+16 ataque · Paladin'},
  {id:'paladin-crossbow',name:'Arbalest',icon:'🏹',category:'weapons',class:'Paladin',price:650,attack:20,defense:0,minLevel:10,bonus:'+20 ataque · Paladin'},
  {id:'paladin-holy',name:'Divine Bow',icon:'✨',category:'weapons',class:'Paladin',price:980,attack:25,defense:2,minLevel:15,bonus:'+25 ataque · +2 defesa · Paladin'},
  {id:'paladin-demon',name:'Royal Crossbow',icon:'🏹',category:'weapons',class:'Paladin',price:1550,attack:31,defense:3,minLevel:22,bonus:'+31 ataque · +3 defesa · Paladin'},
  {id:'sorcerer-wand',name:'Wand of Voodoo',icon:'🪄',category:'wands',class:'Sorcerer',price:430,attack:16,defense:0,minLevel:6,bonus:'+16 ataque · Sorcerer'},
  {id:'sorcerer-destruction',name:'Wand of Destruction',icon:'💥',category:'wands',class:'Sorcerer',price:760,attack:22,defense:0,minLevel:10,bonus:'+22 ataque · Sorcerer'},
  {id:'sorcerer-supreme',name:'Wand of Cosmic Energy',icon:'🌌',category:'wands',class:'Sorcerer',price:1200,attack:28,defense:1,minLevel:16,bonus:'+28 ataque · +1 defesa · Sorcerer'},
  {id:'sorcerer-abyss',name:'Wand of the Abyss',icon:'🌀',category:'wands',class:'Sorcerer',price:1800,attack:35,defense:2,minLevel:24,bonus:'+35 ataque · +2 defesa · Sorcerer'},
  {id:'druid-rod',name:'Underworld Rod',icon:'🪄',category:'wands',class:'Druid',price:420,attack:15,defense:1,minLevel:6,bonus:'+15 ataque · +1 defesa · Druid'},
  {id:'druid-rod-destruction',name:'Rod of Destruction',icon:'❄️',category:'wands',class:'Druid',price:740,attack:21,defense:1,minLevel:10,bonus:'+21 ataque · +1 defesa · Druid'},
  {id:'druid-supreme',name:'Rod of Nature',icon:'🌿',category:'wands',class:'Druid',price:1180,attack:27,defense:3,minLevel:16,bonus:'+27 ataque · +3 defesa · Druid'},
  {id:'druid-abyss',name:'Rod of the Abyss',icon:'❄️',category:'wands',class:'Druid',price:1780,attack:34,defense:4,minLevel:24,bonus:'+34 ataque · +4 defesa · Druid'}
];
if(typeof SHOP_ITEMS!=='undefined'){
  CLASS_WEAPONS.forEach(item=>{if(!SHOP_ITEMS.some(x=>x.id===item.id))SHOP_ITEMS.push(item);});
}

function arenaWeaponClass(){
  const member=(typeof members!=='undefined'&&Array.isArray(members))?members.find(m=>m.name===game?.character):null;
  return member?.vocation||'';
}

function arenaWeaponBonus(){
  if(typeof game==='undefined'||!game)return {attack:0,defense:0};
  let attack=0,defense=0;
  if(typeof SHOP_ITEMS!=='undefined'&&game.shopEquipped){
    const ids=Object.values(game.shopEquipped).filter(Boolean);
    SHOP_ITEMS.forEach(item=>{
      if(ids.includes(item.id)){
        const cls=item.class;
        if(!cls||cls===arenaWeaponClass()){
          attack+=Number(item.attack)||0;
          defense+=Number(item.defense)||0;
        }
      }
    });
  }
  return {attack,defense};
}

function arenaEquippedWeaponName(){
  const id=game?.shopEquipped?.weapon;
  if(id&&typeof SHOP_ITEMS!=='undefined'){
    const item=SHOP_ITEMS.find(x=>x.id===id);
    if(item)return item.name;
  }
  return WEAPONS[game?.weapon||0]?.[0]||'Espada de Bronze';
}

if(typeof renderPlayer==='function'){
  window.renderPlayer=function(){
    document.getElementById('playerName').textContent=game.character;
    document.getElementById('arenaLevel').textContent=fmt(game.level);
    document.getElementById('arenaXp').textContent=fmt(game.xp);
    document.getElementById('gold').textContent=fmt(game.gold);
    document.getElementById('wins').textContent=fmt(game.wins);
    document.getElementById('weapon').textContent=arenaEquippedWeaponName();
    document.getElementById('armor').textContent=WEAPONS && game?.shopEquipped?.armor ? (SHOP_ITEMS.find(x=>x.id===game.shopEquipped.armor)?.name||'Leather Armor') : (ARMORS[game.armor]?.[0]||'Leather Armor');
    const member=(typeof members!=='undefined'&&Array.isArray(members))?members.find(m=>m.name===game.character):null;
    document.getElementById('avatar').textContent=VOC_ICONS[member?.vocation]||'⚔';
    const need=xpNeed();
    document.getElementById('xpText').textContent=`${fmt(game.xp)} / ${fmt(need)}`;
    document.getElementById('xpBar').style.width=Math.min(100,game.xp/need*100)+'%';
    document.getElementById('classLine').textContent=member?.vocation||'Aventureiro';
  };
}

if(typeof startBattle==='function'){
  window.startBattle=function(zoneIndex,monsterIndex){
    const m=ZONES[zoneIndex].monsters[monsterIndex];
    const baseWeapon=WEAPONS[game.weapon]?.[1]||0;
    const baseArmor=ARMORS[game.armor]?.[1]||0;
    const bonus=arenaWeaponBonus();
    const attackBonus=baseWeapon+bonus.attack;
    const defenseBonus=baseArmor+bonus.defense;
    battle={
      zoneIndex,monsterIndex,name:m[0],icon:m[1],
      maxHp:m[2]+game.level*8,hp:m[2]+game.level*8,
      damage:m[3]+Math.floor(game.level*1.7),
      gold:m[4]+game.level*3,xp:m[5]+game.level*12,
      playerHp:110+game.level*12+defenseBonus*3,
      playerMax:110+game.level*12+defenseBonus*3,
      attack:15+game.level*4+attackBonus*3,
      enemyDelay:0,log:[]
    };
    renderBattle();
  };
}

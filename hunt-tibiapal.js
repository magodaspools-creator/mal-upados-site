/*
 * FONTE EXTERNA: TibiaPal — Hunting Places
 * https://tibiapal.com/hunting
 *
 * Os nomes, níveis mínimos, XP/h, loot/h e tipo de dano abaixo são
 * referências do TibiaPal. O site Mal Upados apenas filtra e ordena
 * esses dados pelo level/vocação/objetivo informado pelo jogador.
 */
const TIBIAPAL_URL='https://tibiapal.com/hunting';
const huntSource={
Knight:[
{min:8,n:'Rotworms Liberty Bay/Darashia',type:'Physical'},
{min:16,n:'Tarantulas Port Hope',type:'Physical'},
{min:20,n:'Stonerefiners (Stealth Ring)',type:'Physical'},
{min:30,n:'Coryms Port Hope',type:'Physical'},
{min:35,n:'Mother of Scarabs Lair -3',type:'Physical'},
{min:50,n:'Darashia Dragon Lair',type:'Physical'},
{min:70,n:'Yalahar Bog Raiders Central',type:'Physical'},
{min:90,n:'Nightmare Scions Krailos',type:'Physical'},
{min:100,n:'Exotic Cave',type:'Physical'},
{min:130,n:'Oramond West',type:'Physical'},
{min:150,n:'Oramond Minos',type:'Physical'},
{min:185,n:'Deeplings Library',type:'Physical'},
{min:200,n:'Glooth Tower',type:'Physical, Energy'},
{min:250,n:"Carnivora's Rock",type:'Fire, Ice'},
{min:300,n:'Asura Palace',type:'Energy'},
{min:300,n:'Deeper Banuta (Bottom Floor)',type:'Energy'},
{min:350,n:'Lower Rosha',type:'Physical, Ice'},
{min:400,n:'Prison -1',type:'Physical, Energy'},
{min:400,n:'Winter Court',type:'Fire'},
{min:450,n:'Nagas',type:'Earth, Energy'},
{min:500,n:'Issavi Crypts (Sphinx, Wardens)',type:'Death'}
],
Paladin:[
{min:8,n:'Swamp Trolls Port Hope/Venore',xp:30,loot:55,style:'Spears'},
{min:15,n:'Edron Tomb',xp:55,loot:30,style:'Arrows'},
{min:23,n:'Stonerefiners (Stealth Ring)',xp:210,loot:140,style:'Sniper Arrows'},
{min:23,n:'Mutated Humans Yalahar',xp:150,loot:70,style:'Sniper Arrows'},
{min:25,n:'Coryms Port Hope (Stealth Ring)',xp:160,loot:120,style:'Sniper Arrows'},
{min:40,n:'Yalahar Dragons',xp:250,loot:10,style:'Onyx Arrows'},
{min:50,n:'Krailos Surface',xp:230,loot:250,style:'Onyx Arrows'},
{min:60,n:'Forbidden Temple (Ankrahmun Cults)',xp:400,loot:400,style:'Shatterstorm Arrows, Ethereal'},
{min:70,n:'Iksupan',xp:950,loot:200,style:'Drill Bolts, Ethereal, Divine'},
{min:90,n:'Edron South Were',xp:1550,loot:400,style:'Crystalline Arrows, Ethereal, Divine'},
{min:90,n:'Exotic Cave',xp:1500,loot:300,style:'Crystalline Arrows, Ethereal'},
{min:120,n:'Oramond West (Quara Raid)',xp:2300,loot:200,style:'Shatterstorm Arrows, Ethereal'},
{min:150,n:'Yalahar Grim Reapers',xp:2750,loot:-400,style:'Firestorm Arrows, Divine'},
{min:180,n:'Oramond Wildlife Raid (Active)',xp:4500,loot:1000,style:'Diamond Arrows, Ethereal'},
{min:200,n:'Werehyaenas South',xp:3100,loot:300,style:'Diamond Arrows, Divine'},
{min:200,n:'Asura Palace',xp:3100,loot:100,style:'Diamond Arrows, Ethereal'},
{min:230,n:'Warzone 5',xp:4300,loot:800,style:'Diamond Arrows, Ethereal'},
{min:250,n:'Asura Mirror',style:'Diamond Arrows, Ethereal'},
{min:300,n:'Oramond Fury Dungeon',style:'Diamond Arrows, Ethereal'},
{min:400,n:'Port Hope Flimsies -1 only',xp:6000,loot:1000,style:'Firestorm Arrows, Divine'},
{min:500,n:'Venore Flimsies -1 and -2',xp:8800,loot:1500,style:'Firestorm Arrows, Divine'}
],
Monk:[
{min:8,n:'Rotworms Liberty Bay/Darashia',xp:40,loot:0,style:'N/A'},
{min:13,n:'Cyclops Mistrock',xp:75,loot:15,style:'N/A'},
{min:20,n:'Edron Earth Elementals',xp:150,loot:10,style:'Fire'},
{min:28,n:'Gargoyle Cave Meriana',xp:210,loot:300,style:'Fire'},
{min:30,n:'Upper Spike',xp:290,loot:250,style:'Energy'},
{min:30,n:'Chor',xp:325,loot:-10,style:'Fire'},
{min:30,n:'Coryms Port Hope',xp:300,loot:300,style:'Fire'},
{min:50,n:'Middle Spike',xp:750,loot:150,style:'Fire'},
{min:55,n:'Water Elementals Port Hope',xp:670,loot:100,style:'Energy'},
{min:70,n:'Krailos Ogres Surface',xp:420,loot:450,style:'Energy'},
{min:80,n:'Iksupan',xp:1050,loot:400,style:'Energy'},
{min:100,n:'Ravenous Lava Lurkers',style:'Energy, Earth'},
{min:120,n:'Lizard City',xp:1200,loot:200,style:'Death'},
{min:150,n:'Oramond West (Quara Raid)',xp:2200,loot:300,style:'Energy'},
{min:175,n:'Brimstone Bugs WOTE',style:'Energy'},
{min:200,n:'Werehyaenas',style:'Physical'},
{min:220,n:'Book World: Chapter III',style:'Physical, Earth, Energy'},
{min:250,n:'Asura Palace',style:'Physical, Energy'},
{min:270,n:'Asura Mirror',style:'Energy'},
{min:300,n:'Winter Court',style:'Earth'},
{min:350,n:'Buried Cathedral',style:'Earth'},
{min:400,n:'Upper Roshamuul',style:'Energy'},
{min:450,n:'Azzilon Castle',style:'Energy'},
{min:500,n:'Cobra Bastion',style:'Energy'}
],
Sorcerer:[
{min:8,n:'Rotworms Liberty Bay/Darashia',xp:40,loot:0,style:'Single Target Strike Spells'},
{min:28,n:'Upper Spike',xp:320,style:'Thunderstorm, GFB, Avalanche'},
{min:30,n:'Chor',xp:290,loot:-20,style:'GFB'},
{min:30,n:'Coryms Port Hope (AOE)',xp:260,style:'GFB'},
{min:50,n:'Yalahar Cults',xp:290,loot:400,style:'Thunderstorm'},
{min:70,n:'Krailos Ogres Surface',xp:530,loot:300,style:'Thunderstorm'},
{min:80,n:'Issavi Surface (SD)',xp:830,loot:-200,style:'SD'},
{min:100,n:'Grimvale -4',xp:1000,loot:500,style:'Strong Ice Wave + Forked Glacier'},
{min:100,n:'Ravenous Lava Lurkers',style:'Forked Thorns + Forked Glacier'},
{min:120,n:'Lizard City',xp:1350,loot:1000,style:'Strong Ice Wave + Forked Glacier'},
{min:150,n:'Oramond West (Quara Raid)',xp:2000,loot:-100,style:'Thunderstorm'},
{min:200,n:'Yalahar Grim Reapers',xp:3200,loot:-50,style:'Thunderstorm'},
{min:200,n:'Werehyaenas South',xp:2600,loot:400,style:'Death'},
{min:275,n:'Winter Court (Castle Only)',xp:4400,loot:1000,style:'Fire'},
{min:300,n:'Asura Mirror',xp:4400,loot:400,style:'Energy'},
{min:300,n:'Oramond Fury',xp:3500,loot:500,style:'Energy'},
{min:400,n:'Falcons',xp:5900,loot:1500,style:'Fire/Energy'},
{min:400,n:'Winter Court (Full Lap)',xp:5600,loot:1000,style:'Fire'},
{min:500,n:'Cobra Bastion',xp:7200,loot:1200,style:'Death'},
{min:500,n:'Warzone 3',xp:6700,loot:2000,style:'Energy'}
],
Druid:null
};
// TibiaPal publica uma tabela conjunta para Sorcerer/Druid ("Both Forks only").
huntSource.Druid=huntSource.Sorcerer.map(h=>({...h}));

function huntNum(v){
 if(v==null||v==='-'||v==='')return null;
 const s=String(v).replace(',','.').trim().toLowerCase();
 const n=parseFloat(s);
 return Number.isFinite(n)?(s.includes('kk')?n*1000:n):null;
}
function huntFmt(v){
 if(v==null)return '—';
 return v>=1000?(v/1000).toFixed(v%1000?2:0)+'kk':v+'k';
}
function huntRank(rows,level,goal){
 return rows.map(h=>{
  const gap=Math.max(0,level-h.min);
  const xp=huntNum(h.xp),loot=huntNum(h.loot);
  let score=100-gap*0.35;
  if(goal==='xp'&&xp!=null)score+=xp*0.02;
  if(goal==='profit'&&loot!=null)score+=loot*0.03;
  if(goal==='balance'){if(xp!=null)score+=xp*0.012;if(loot!=null)score+=loot*0.018;}
  score-=Math.max(0,h.min-level)*4;
  return {...h,score};
 }).sort((a,b)=>b.score-a.score).slice(0,3);
}
function calcHuntFromTibiaPal(){
 const level=Math.max(8,Number(document.getElementById('huntLevel')?.value||8));
 const voc=document.getElementById('huntVoc')?.value||'Knight';
 const goal=document.getElementById('huntGoal')?.value||'balance';
 const rows=huntSource[voc]||huntSource.Knight;
 let eligible=rows.filter(h=>h.min<=level);
 if(!eligible.length)eligible=rows;
 const ranked=huntRank(eligible,level,goal);
 const goalLabel={xp:'XP',profit:'profit',balance:'equilíbrio',safe:'proximidade ao level'}[goal]||'equilíbrio';
 const el=document.getElementById('huntResult');
 if(!el)return;
 el.innerHTML=`<div class="eyebrow">${esc(voc)} · Level ${fmt(level)}</div><p><strong>Fonte:</strong> <a href="${TIBIAPAL_URL}" target="_blank" rel="noopener">TibiaPal — Hunting Places</a>. As hunts abaixo são registros da fonte; não são sugestões inventadas pelo Mal Upados. Ordenação: ${goalLabel}.</p>${ranked.map((h,i)=>`<div class="hunt-card" style="margin:10px 0;padding:14px;border:1px solid var(--line,#333);border-radius:10px"><div><span class="tag">${i===0?'RECOMENDADA':'ALTERNATIVA'}</span> <strong>${esc(h.n)}</strong></div><div class="small" style="margin-top:7px">TibiaPal: <strong>Level ${h.min}+</strong>${h.xp!=null?' · XP: '+huntFmt(h.xp)+'/h':''}${h.loot!=null?' · Loot: '+huntFmt(h.loot)+'/h':''}</div>${h.type?`<div class="small">Tipo: ${esc(h.type)}</div>`:''}${h.style?`<div class="small">Método/arma: ${esc(h.style)}</div>`:''}<div class="small">Distância do mínimo indicado pela fonte: ${Math.max(0,level-h.min)} levels.</div></div>`).join('')}`;
}

window.addEventListener('DOMContentLoaded',()=>{
 const btn=document.getElementById('huntBtn');
 if(btn)btn.onclick=calcHuntFromTibiaPal;
 const note=document.querySelector('#huntResult');
 setTimeout(calcHuntFromTibiaPal,50);
});

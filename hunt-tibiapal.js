/*
 * FONTE EXTERNA: TibiaPal — Hunting Places (OLD)
 * https://tibiapal.com/hunting-old
 *
 * Base histórica escolhida pelo Mal Upados por ser muito mais completa.
 * Os valores abaixo são transcritos da tabela do TibiaPal. O site não inventa XP/loot.
 * O próprio TibiaPal informa que esta página é anterior ao Vocation Rebalance 2026.
 */
const TIBIAPAL_URL='https://tibiapal.com/hunting-old';
const TIBIAPAL_LABEL='TibiaPal — Hunting Places (Old)';
const huntSource={
Knight:[
{min:8,n:'Rotworms Liberty Bay/Darashia',xp:35,loot:5,style:'Physical'},
{min:16,n:'Tarantulas Port Hope',xp:55,loot:10,style:'Physical'},
{min:20,n:'Stonerefiners (Stealth Ring)',xp:100,loot:20,style:'Physical'},
{min:30,n:'Coryms Port Hope',xp:150,loot:-30,style:'Physical'},
{min:35,n:'Mother of Scarabs Lair -3',xp:200,loot:150,style:'Physical'},
{min:35,n:'Pirates Yalahar',xp:180,loot:90,style:'Physical'},
{min:50,n:"Lion's Rock",xp:500,loot:65,style:'Physical'},
{min:50,n:'Darashia Dragon Lair',xp:250,loot:20,style:'Physical'},
{min:70,n:'Yalahar Bog Raiders Central',xp:600,loot:20,style:'Physical'},
{min:70,n:'Hive Surface',xp:450,loot:100,style:'Physical'},
{min:90,n:'Carlin Cults',xp:1300,loot:75,style:'Physical'},
{min:90,n:'Nightmare Scions Krailos',xp:1250,loot:0,style:'Physical'},
{min:90,n:'Edron Heroes -2/-3',xp:1200,loot:150,style:'Physical'},
{min:130,n:'Ravenous Lava Lurkers',xp:2100,loot:-200,style:'Physical'},
{min:130,n:'Oramond West',xp:1900,loot:50,style:'Physical'},
{min:150,n:'Barkless Ab Cults',xp:2200,loot:-250,style:'Physical'},
{min:150,n:'Lower Spike',xp:1900,loot:100,style:'Physical'},
{min:150,n:'Oramond Minos',xp:1500,loot:150,style:'Physical'},
{min:200,n:'Yalahar Grim Reapers',xp:3500,loot:0,style:'Fire, Energy'},
{min:200,n:'Werehyaenas South',xp:2600,loot:250,style:'Ice'},
{min:200,n:'Glooth Tower',xp:2050,loot:250,style:'Physical, Energy'},
{min:250,n:"Carnivora's Rock",xp:2000,loot:800,style:'Fire, Ice'},
{min:300,n:'Warzone 4',xp:3500,loot:600,style:'Fire'},
{min:300,n:'Asura Palace',xp:3400,loot:550,style:'Energy'},
{min:300,n:'Deeper Banuta (Bottom Floor)',xp:3000,loot:800,style:'Energy'},
{min:350,n:'Asura Mirror -1',xp:5700,loot:800,style:'Energy, Ice'},
{min:350,n:'Warzone 5',xp:3900,loot:800,style:'Ice, Fire'},
{min:400,n:'Buried Cathedral -1',xp:4500,loot:750,style:'Ice'},
{min:400,n:'Prison -1',xp:4100,loot:850,style:'Physical, Energy'},
{min:450,n:'Nagas',xp:5000,loot:500,style:'Earth, Energy'},
{min:500,n:'Issavi Crypts (Sphinx, Wardens)',xp:6200,loot:500,style:'Death'},
{min:500,n:'Summer Court full boxing',xp:6000,loot:1000,style:'Ice'}
],
Paladin:[
{min:8,n:'Swamp Trolls Port Hope/Venore',xp:30,loot:55,style:'Spears'},
{min:8,n:'Crocodiles Port Hope',xp:30,loot:5,style:'Spears'},
{min:15,n:'Edron Tomb',xp:55,loot:30,style:'Arrows'},
{min:15,n:'Amazon Camp',xp:35,loot:60,style:'Spears'},
{min:20,n:'Minotaurs Yalahar',xp:60,loot:0,style:'Arrows'},
{min:25,n:'Stonerefiners (Stealth Ring)',xp:180,loot:40,style:'Royal Spears'},
{min:25,n:'Mutated Humans Yalahar',xp:110,loot:5,style:'Royal Spears'},
{min:40,n:'Zombies Cemetery Yalahar',xp:160,loot:-10,style:'Onyx Arrows'},
{min:40,n:'Pirates Yalahar',xp:110,loot:60,style:'Onyx Arrows'},
{min:50,n:'Ramoa Bonebeast Island',xp:350,loot:0,style:'Onyx Arrows, Avalanche'},
{min:50,n:'Ankrahmun Cults & Lizards',xp:230,loot:200,style:'Onyx Arrows, Thunderstorm'},
{min:70,n:'Iksupan',xp:525,loot:100,style:'Drill Bolts, Avalanche'},
{min:90,n:'Nightmare Scions Krailos',xp:850,loot:0,style:'Crystalline Arrows, Avalanche'},
{min:90,n:'Edron South Were',xp:800,loot:75,style:'Crystalline Arrows, GFB'},
{min:90,n:'Werehyaenas -1',xp:750,loot:100,style:'Crystalline Arrows, Avalanche'},
{min:90,n:'Oramond Minos',xp:700,loot:100,style:'Crystalline Arrows, Avalanche'},
{min:100,n:'Ravenous Lava Lurkers',xp:1100,loot:-200,style:'Burst Arrows, Avalanche'},
{min:130,n:'Banuta -1 (Hydras/SS/Medusa)',xp:750,loot:200,style:'Crystalline Arrows, Thunderstorm'},
{min:150,n:'Ravenous Lava Lurkers',xp:2000,loot:-250,style:'Avalanche'},
{min:150,n:'Yalahar Sunken Quarter',xp:1500,loot:80,style:'Thunderstorm'},
{min:150,n:'Deeplings Library',xp:1400,loot:0,style:'Thunderstorm'},
{min:200,n:'Yalahar Grim Reapers',xp:2700,loot:-300,style:'GFB'},
{min:200,n:'Werehyaenas North',xp:2000,loot:250,style:'Avalanche'},
{min:200,n:'Oramond West',xp:2000,loot:0,style:'Thunderstorm, GFB'},
{min:250,n:'Werehyaenas South',xp:2600,loot:500,style:'Avalanche'},
{min:250,n:'Medusa Tower',xp:2400,loot:450,style:'Thunderstorm, GFB'},
{min:300,n:'Oramond Wildlife Raid',xp:3700,loot:900,style:'Avalanche'},
{min:300,n:'Asura Palace',xp:3100,loot:350,style:'Avalanche'},
{min:300,n:'Werelions -1',xp:2750,loot:700,style:'Avalanche'},
{min:350,n:'Asura Mirror',xp:4500,loot:300,style:'Avalanche'},
{min:400,n:'Oramond Catacombs',xp:5000,loot:850,style:'Avalanche'},
{min:450,n:'Rosha West',xp:5200,loot:1000,style:'Avalanche'},
{min:500,n:'Summer Court',xp:5300,loot:850,style:'Avalanche'}
],
Druid:[
{min:8,n:'Rotworms Liberty Bay/Darashia',xp:null,loot:null,style:'N/A'},
{min:12,n:'Edron Forgotten Tomb',xp:75,loot:50,style:'N/A'},
{min:14,n:'Coryms Port Hope (Stealth Ring)',xp:100,loot:-5,style:'N/A'},
{min:15,n:'Elves Yalahar',xp:80,loot:150,style:'N/A'},
{min:20,n:'Edron Earth Elementals',xp:150,loot:10,style:'N/A'},
{min:28,n:'Upper Spike',xp:320,loot:75,style:'Thunderstorm, GFB, Avalanche'},
{min:30,n:'Chor',xp:290,loot:-20,style:'GFB'},
{min:30,n:'Coryms Port Hope (AOE)',xp:260,loot:-100,style:'GFB'},
{min:50,n:'Mother of Scarabs Lair',xp:680,loot:-10,style:'GFB'},
{min:50,n:'Nibelor Crystal Spiders',xp:450,loot:-10,style:'Thunderstorm'},
{min:60,n:'Middle Spike',xp:800,loot:-20,style:'GFB'},
{min:70,n:'Krailos Ogres Surface',xp:530,loot:300,style:'Thunderstorm'},
{min:80,n:'Issavi Surface (SD)',xp:830,loot:-200,style:'SD'},
{min:80,n:'Muggy Plains',xp:700,loot:-50,style:'Avalanche'},
{min:100,n:'Ravenous Lava Lurkers',xp:1800,loot:-100,style:'Avalanche'},
{min:100,n:'Sunken Quarter',xp:1300,loot:0,style:'Thunderstorm'},
{min:100,n:'Edron Old Fortress -2 (Hero)',xp:1200,loot:100,style:'Avalanche'},
{min:110,n:'Edron Were South',xp:1400,loot:100,style:'GFB'},
{min:120,n:'Carlin Cults',xp:1200,loot:-100,style:'Avalanche'},
{min:130,n:'Goroma Medusa/Serpents (Talahu)',xp:800,loot:100,style:'SD'},
{min:150,n:'Oramond West',xp:2000,loot:-100,style:'GFB, Thunderstorm'},
{min:150,n:'Deeplings Library',xp:1300,loot:100,style:'Thunderstorm'},
{min:200,n:'Goroma Demons Avalanche',xp:950,loot:200,style:'Avalanche'},
{min:250,n:'Yalahar Grim Reapers',xp:3500,loot:300,style:'GFB'},
{min:250,n:'Werehyaenas North',xp:2200,loot:600,style:'Avalanche'},
{min:300,n:'Lower Spike',xp:3500,loot:300,style:'Avalanche'},
{min:300,n:'Candia Nibblemaws',xp:3200,loot:600,style:'Thunderstorm'},
{min:300,n:'Werelions',xp:3000,loot:800,style:'Avalanche'},
{min:400,n:'Winter Court',xp:4500,loot:900,style:'GFB'},
{min:400,n:'Summer Court',xp:4500,loot:900,style:'Avalanche'},
{min:400,n:'Falcons',xp:5500,loot:1300,style:'Avalanche, GFB'},
{min:500,n:'Otherworld',xp:3200,loot:700,style:'Stoneshower'},
{min:500,n:'Oramond Catacombs',xp:5000,loot:500,style:'Avalanche'},
{min:500,n:'Issavi Goannas',xp:5500,loot:700,style:'Thunderstorm'},
{min:600,n:'Warzone 3',xp:null,loot:null,style:'Thunderstorm'}
],
Sorcerer:[],
Monk:[
{min:8,n:'Rotworms Liberty Bay/Darashia',xp:35,loot:5,style:'Energy'},
{min:8,n:'Swamp Trolls Port Hope/Venore',xp:25,loot:50,style:'Energy'},
{min:14,n:'Edron Forgotten Tomb',xp:60,loot:80,style:'Energy'},
{min:15,n:'Elves Yalahar',xp:50,loot:100,style:'Earth'},
{min:20,n:'Stonerefiners (Stealth Ring)',xp:140,loot:25,style:'Energy'},
{min:30,n:'Chor (Runes)',xp:230,loot:-25,style:'Physical'},
{min:30,n:'Banuta Apes (Runes)',xp:110,loot:100,style:'Physical'},
{min:35,n:'Coryms PH (Runes)',xp:250,loot:-80,style:'Physical'},
{min:35,n:'Upper Spike (Runes)',xp:250,loot:10,style:'Physical'},
{min:35,n:'Laguna Blood Crabs (Runes)',xp:160,loot:350,style:'Physical'},
{min:40,n:'Yalahar Cults',xp:180,loot:250,style:'Physical'},
{min:50,n:'Wyrms LB',xp:420,loot:-50,style:'Physical'},
{min:60,n:'Water Elementals South Port Hope',xp:650,loot:80,style:'Energy'},
{min:70,n:'Nightmare Scions Krailos',xp:900,loot:-150,style:'Physical, Energy'},
{min:70,n:'Iksupan Entrance',xp:750,loot:200,style:'Energy'},
{min:80,n:'Carlin Cults',xp:1300,loot:100,style:'Physical'},
{min:80,n:'Yielothaxes',xp:900,loot:250,style:'Physical'},
{min:90,n:'Oramond West',xp:1800,loot:-100,style:'Energy'},
{min:100,n:'Ravenous Lava Lurkers',xp:2100,loot:-50,style:'Energy, Earth'},
{min:100,n:'Exotic Cave',xp:1300,loot:400,style:'Physical'},
{min:130,n:'Barkless Elves Ab',xp:2200,loot:-400,style:'Physical, Earth'},
{min:130,n:'Deeplings Library',xp:1650,loot:0,style:'Energy'},
{min:150,n:'Yalahar Grim Reapers',xp:3100,loot:-100,style:'Energy'},
{min:150,n:'Glooth Tower',xp:2100,loot:50,style:'Energy'},
{min:200,n:'Wildlife Raid (Active)',xp:2700,loot:600,style:'Physical'},
{min:200,n:'Werehyaenas',xp:2400,loot:550,style:'Physical'},
{min:200,n:'Medusa Tower',xp:2400,loot:500,style:'Physical, Energy'},
{min:220,n:'Book World: Chapter III',xp:2900,loot:450,style:'Physical, Earth, Energy'},
{min:250,n:'Book World: Chapter IV',xp:3500,loot:600,style:'Earth'},
{min:250,n:'Weretigers -1',xp:3400,loot:750,style:'Earth'},
{min:270,n:'Asura Mirror',xp:5100,loot:500,style:'Energy'},
{min:270,n:'Warzone 5',xp:3700,loot:1000,style:'Earth'},
{min:300,n:'Marapur Nagas',xp:4800,loot:400,style:'Earth'},
{min:300,n:'Roshamuul Mines',xp:4600,loot:750,style:'Energy'},
{min:300,n:'Winter Court',xp:4500,loot:750,style:'Earth'},
{min:350,n:'Iksupan Occupied Sanctuary',xp:5000,loot:750,style:'Energy'},
{min:350,n:'Buried Cathedral',xp:4800,loot:300,style:'Earth'},
{min:400,n:'Cobra Bastion -1 (Basement)',xp:6100,loot:700,style:'Energy'},
{min:400,n:'Crypt Warriors',xp:5700,loot:700,style:'Energy'},
{min:400,n:'Upper Roshamuul',xp:5500,loot:1100,style:'Energy'},
{min:400,n:'Falcons',xp:5300,loot:1300,style:'Energy, Earth'},
{min:450,n:'Azzilon Castle',xp:6000,loot:600,style:'Energy'},
{min:500,n:'Cobra Bastion',xp:6700,loot:700,style:'Energy'},
{min:500,n:'Warzone 2',xp:5000,loot:2000,style:'Physical, Energy'},
{min:600,n:'Norcferatu Fortress',xp:7900,loot:1600,style:'Earth'},
{min:600,n:"Nimmersatt's Dragons -7 (Bottom Floor)",xp:7600,loot:1400,style:'Earth'},
{min:600,n:'Roshamuul West',xp:7400,loot:2300,style:'Physical'}
]};
/* A tabela do TibiaPal OLD para Druid/Sorcerer é conjunta (Both Forks). */
huntSource.Sorcerer=huntSource.Druid.map(h=>({...h}));

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
 const pool=rows.filter(h=>h.min<=level);
 const eligible=pool.length?pool:rows;
 return eligible.map(h=>{
   const xp=huntNum(h.xp),loot=huntNum(h.loot);
   let score;
   if(goal==='xp')score=xp==null?-1:xp;
   else if(goal==='profit')score=loot==null?-1:loot;
   else score=(xp==null?-1:xp)+(loot==null?0:loot*1.5);
   return {...h,score};
 }).sort((a,b)=>b.score-a.score||b.xp-a.xp||b.min-a.min).slice(0,3);
}
function calcHuntFromTibiaPal(){
 const level=Math.max(8,Number(document.getElementById('huntLevel')?.value||8));
 const voc=document.getElementById('huntVoc')?.value||'Knight';
 const goal=document.getElementById('huntGoal')?.value||'balance';
 const ranked=huntRank(huntSource[voc]||huntSource.Knight,level,goal);
 const goalLabel={xp:'maior XP/h registrada',profit:'maior loot/h registrado',balance:'melhor combinação de XP/h + loot/h'}[goal]||'melhor combinação';
 const el=document.getElementById('huntResult');
 if(!el)return;
 el.innerHTML=`<div class="eyebrow">${esc(voc)} · Level ${fmt(level)}</div><p><strong>Fonte:</strong> <a href="${TIBIAPAL_URL}" target="_blank" rel="noopener">${TIBIAPAL_LABEL}</a>. Esta é a base histórica mais completa do TibiaPal. O próprio TibiaPal avisa que ela é anterior ao Vocation Rebalance 2026. Ordenação: ${goalLabel}. Nada abaixo foi inventado pelo Mal Upados.</p>${ranked.map((h,i)=>`<div class="hunt-card" style="margin:10px 0;padding:14px;border:1px solid var(--line,#333);border-radius:10px"><div><span class="tag">${i===0?'RECOMENDADA':'ALTERNATIVA'}</span> <strong>${esc(h.n)}</strong></div><div class="small" style="margin-top:7px">TibiaPal: <strong>Level ${h.min}+</strong>${h.xp!=null?' · XP: '+huntFmt(h.xp)+'/h':''}${h.loot!=null?' · Loot: '+huntFmt(h.loot)+'/h':''}</div>${h.style?`<div class="small">Método/arma/runa: ${esc(h.style)}</div>`:''}<div class="small">Seu level: ${fmt(level)} · mínimo da fonte: ${h.min}+</div></div>`).join('')}`;
}
window.addEventListener('DOMContentLoaded',()=>{
 const btn=document.getElementById('huntBtn');
 if(btn)btn.onclick=calcHuntFromTibiaPal;
 setTimeout(calcHuntFromTibiaPal,50);
});

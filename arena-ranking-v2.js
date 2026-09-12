// Ranking V2 — leaderboard global da Arena via Supabase.
(()=>{
 const STYLE='arena-ranking-v2-style';
 const SUPABASE_URL='https://tylyfkwfoqwsnrotmvzt.supabase.co';
 const SUPABASE_KEY='sb_publishable_SGwpPSRttuKAAI4pm2xi5g_Bd3mW95F';
 const CREATURES=['Rat','Troll','Orc','Orc Berserker','Orc Rider','Cyclops','Scorpion','Ancient Scarab','Dragon Hatchling','Dragon','Dragon Lord','Frost Dragon','Demon Skeleton','Hellhound','Demon','Deathbringer'];
 const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const fmt=n=>new Intl.NumberFormat('pt-BR').format(Math.floor(Number(n)||0));
 let currentMetric='level', currentCreature='Rat', cache=null, cacheAt=0, loading=false;
 const req=n=>String(n)==='Deathbringer'?5:25;
 const headers={'apikey':SUPABASE_KEY,'Authorization':`Bearer ${SUPABASE_KEY}`};
 async function getGlobalRecords(){
  if(cache&&Date.now()-cacheAt<15000)return cache;
  if(loading)return cache||[];
  loading=true;
  try{
   const [pRes,bRes]=await Promise.all([
    fetch(`${SUPABASE_URL}/rest/v1/arena_players?select=*`,{headers}),
    fetch(`${SUPABASE_URL}/rest/v1/arena_bestiary?select=player_id,creature_name,kills,completed`,{headers})
   ]);
   if(!pRes.ok)throw new Error(`players ${pRes.status}`);
   if(!bRes.ok)throw new Error(`bestiary ${bRes.status}`);
   const players=await pRes.json();
   const bestiary=await bRes.json();
   const byPlayer={};
   bestiary.forEach(b=>{(byPlayer[b.player_id]??=[]).push(b)});
   cache=players.map(g=>{
    const list=byPlayer[g.id]||[];
    const bm={};list.forEach(b=>bm[b.creature_name]={kills:Number(b.kills)||0,completed:Boolean(b.completed)});
    const completed=list.filter(b=>(Number(b.kills)||0)>=req(b.creature_name)).length;
    return {character:g.character_name,raw:{bestiary:bm},vocation:g.vocation||'Aventureiro',level:Number(g.level)||1,xp:Number(g.xp)||0,totalXp:Number(g.xp)||0,gold:Number(g.gold)||0,kills:Number(g.kills)||0,wins:Number(g.wins)||0,streak:Number(g.best_streak)||0,damage:Number(g.damage)||0,bestiary:Number(g.bestiary_completed)||completed,achievements:Number(g.achievements_completed)||0};
   });
   cacheAt=Date.now();
   return cache;
  }catch(err){console.warn('[Arena Ranking] Supabase indisponível:',err);return cache||[]}
  finally{loading=false}
 }
 const killsFor=(g,n)=>Math.max(0,Number(g?.bestiary?.[n]?.kills??g?.bestiary?.[n])||0);
 const metrics={level:{label:'Level',icon:'⭐',get:r=>r.level},xp:{label:'XP total',icon:'✨',get:r=>r.totalXp},kills:{label:'Kills',icon:'☠️',get:r=>r.kills},gold:{label:'Gold',icon:'💰',get:r=>r.gold},wins:{label:'Vitórias',icon:'🏆',get:r=>r.wins},streak:{label:'Melhor streak',icon:'🔥',get:r=>r.streak},bestiary:{label:'Bestiários',icon:'📖',get:r=>r.bestiary},achievements:{label:'Conquistas',icon:'🏅',get:r=>r.achievements},damage:{label:'Dano',icon:'⚔️',get:r=>r.damage}};
 function installStyle(){if(document.getElementById(STYLE))return;const s=document.createElement('style');s.id=STYLE;s.textContent=`
 .rank-v2-head{display:flex;justify-content:space-between;align-items:end;gap:12px;margin-bottom:12px}.rank-v2-title{font:900 .86rem Cinzel,serif;color:#d9bd70;text-transform:uppercase;letter-spacing:.8px}.rank-v2-sub{color:#727983;font-size:.58rem;margin-top:3px}.rank-v2-local{border:1px solid #66532f;color:#cdb16c;padding:6px 8px;font:800 .52rem Inter,sans-serif;text-transform:uppercase;white-space:nowrap}.rank-v2-metrics{display:flex;gap:5px;overflow:auto;margin-bottom:10px;padding-bottom:2px}.rank-v2-metrics button,.rank-v2-creature{border:1px solid #34383e;background:#17191d;color:#969da6;padding:7px 9px;border-radius:3px;font:800 .56rem Inter,sans-serif;text-transform:uppercase;white-space:nowrap;cursor:pointer}.rank-v2-metrics button.active,.rank-v2-creature:focus{border-color:#987535;color:#f0ce78;background:#211c13}.rank-v2-creature-wrap{display:none;margin-bottom:10px}.rank-v2-creature-wrap.show{display:flex;gap:7px;align-items:center}.rank-v2-creature-wrap label{color:#777e87;font-size:.55rem;text-transform:uppercase}.rank-v2-creature{outline:none}.rank-v2-podium{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin-bottom:12px}.rank-v2-podium-card{border:1px solid #34383e;background:#141619;padding:10px;text-align:center;min-width:0}.rank-v2-podium-card:nth-child(1){border-color:#8b6b31;background:linear-gradient(145deg,#251f14,#141619)}.rank-v2-podium-pos{font:900 .62rem Inter,sans-serif;color:#777e87}.rank-v2-podium-name{font:900 .76rem Cinzel,serif;color:#dedfe2;margin-top:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.rank-v2-podium-voc{font-size:.53rem;color:#777e87;margin-top:2px}.rank-v2-podium-value{font:900 1rem Inter,sans-serif;color:#e6c56f;margin-top:6px}.rank-v2-table{width:100%;border-collapse:collapse}.rank-v2-table th,.rank-v2-table td{padding:9px 7px;border-bottom:1px solid #292d32;text-align:left}.rank-v2-table th{color:#707780;font:800 .51rem Inter,sans-serif;text-transform:uppercase;letter-spacing:.5px}.rank-v2-table td{color:#d3d6da;font-size:.64rem}.rank-v2-table tr.current td{color:#f0ce78}.rank-v2-pos{width:34px;font-weight:900;color:#777e87}.rank-v2-char{font-weight:800}.rank-v2-voc{display:block;color:#707780;font-size:.52rem;font-weight:400;margin-top:2px}.rank-v2-value{text-align:right!important;font-weight:900;color:#d9b963!important}.rank-v2-empty{padding:20px;text-align:center;border:1px dashed #34383e;color:#777e87;font-size:.65rem}@media(max-width:650px){.rank-v2-head{align-items:start}.rank-v2-podium-card{padding:8px 5px}.rank-v2-podium-name{font-size:.67rem}.rank-v2-table th,.rank-v2-table td{padding:8px 5px}.rank-v2-voc{display:none}}
 `;document.head.appendChild(s)}
 async function render(){const body=document.getElementById('arenaAccountBody'),title=document.getElementById('arenaAccountTitle');if(!body||!title||title.textContent.trim()!=='Ranking')return;const rows=await getGlobalRecords();const metric=metrics[currentMetric],creatureMode=currentMetric==='creature';const values=creatureMode?rows.map(r=>({...r,rankValue:killsFor(r.raw,currentCreature)})):rows.map(r=>({...r,rankValue:metric.get(r)}));values.sort((a,b)=>b.rankValue-a.rankValue||b.level-a.level||a.character.localeCompare(b.character,'pt-BR'));
 body.innerHTML=`<div class="rank-v2-head"><div><div class="rank-v2-title">Ranking Global da Arena</div><div class="rank-v2-sub">Competição entre todos os personagens registrados.</div></div><div class="rank-v2-local">GLOBAL</div></div><div class="rank-v2-metrics">${Object.entries(metrics).map(([id,m])=>`<button data-rank-metric="${id}" class="${currentMetric===id?'active':''}">${m.icon} ${m.label}</button>`).join('')}<button data-rank-metric="creature" class="${creatureMode?'active':''}">☠️ Por criatura</button></div><div class="rank-v2-creature-wrap ${creatureMode?'show':''}"><label for="rankCreature">Criatura</label><select id="rankCreature" class="rank-v2-creature">${CREATURES.map(n=>`<option value="${esc(n)}" ${n===currentCreature?'selected':''}>${esc(n)}</option>`).join('')}</select></div>${values.length?`<div class="rank-v2-podium">${[0,1,2].map(i=>values[i]?`<div class="rank-v2-podium-card"><div class="rank-v2-podium-pos">#${i+1}</div><div class="rank-v2-podium-name">${esc(values[i].character)}</div><div class="rank-v2-podium-voc">${esc(values[i].vocation)}</div><div class="rank-v2-podium-value">${fmt(values[i].rankValue)}</div></div>`:'').join('')}</div>`:'<div class="rank-v2-empty">Ainda não há personagens registrados no ranking global.</div>'}<table class="rank-v2-table"><thead><tr><th>#</th><th>Personagem</th><th style="text-align:right">${creatureMode?esc(currentCreature):metric.label}</th></tr></thead><tbody>${values.map((r,i)=>`<tr class="${typeof game!=='undefined'&&game?.character===r.character?'current':''}"><td class="rank-v2-pos">${i+1}</td><td class="rank-v2-char">${esc(r.character)}<span class="rank-v2-voc">${esc(r.vocation)}</span></td><td class="rank-v2-value">${fmt(r.rankValue)}</td></tr>`).join('')}</tbody></table>`;
 body.querySelectorAll('[data-rank-metric]').forEach(b=>b.onclick=()=>{currentMetric=b.dataset.rankMetric;render()});const sel=body.querySelector('#rankCreature');if(sel)sel.onchange=()=>{currentCreature=sel.value;render()};
 }
 function watch(){installStyle();document.addEventListener('click',e=>{const b=e.target.closest?.('[data-tab="ranking"],[data-account="ranking"]');if(b){cache=null;setTimeout(render,0)}});setInterval(()=>{if(document.getElementById('arenaAccountModal')&&document.getElementById('arenaAccountTitle')?.textContent.trim()==='Ranking')render()},15000)}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',watch,{once:true});else watch();window.arenaRankingV2={render,getRecords:getGlobalRecords};
})();
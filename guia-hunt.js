function guiaScore(rows, goal){
  if(!rows.length)return new Map();
  if(goal==='xp')return new Map(rows.map(h=>[h, h.xp==null?-Infinity:Number(h.xp)]));
  if(goal==='profit')return new Map(rows.map(h=>[h, h.loot==null?-Infinity:Number(h.loot)]));
  const xpVals=rows.map(h=>Number(h.xp)).filter(Number.isFinite);
  const lootVals=rows.map(h=>Number(h.loot)).filter(Number.isFinite);
  if(!xpVals.length && !lootVals.length)return new Map(rows.map((h,i)=>[h,-i]));
  const maxXp=Math.max(...xpVals,1), maxLoot=Math.max(...lootVals,1);
  return new Map(rows.map(h=>{
    const xp=h.xp==null?0:Number(h.xp), loot=h.loot==null?0:Number(h.loot);
    return [h,(xp/maxXp)*50+(loot/maxLoot)*50];
  }));
}
function huntCurrentRows(mode,voc,level,search){
  let source=mode==='duo'?huntDuoSource:mode==='team'?huntTeamSource:(huntSource[voc]||[]);
  return source.filter(h=>h.min<=level && (!search||String(h.n).toLowerCase().includes(search)||String(h.style||'').toLowerCase().includes(search)));
}
function guiaRender(){
  const mode=document.getElementById('huntMode')?.value||'solo';
  const level=Math.max(8,Number(document.getElementById('huntLevel')?.value||8));
  const voc=document.getElementById('huntVoc')?.value||'Knight';
  const goal=document.getElementById('huntGoal')?.value||'balance';
  const search=(document.getElementById('huntSearch')?.value||'').trim().toLowerCase();
  const filtered=huntCurrentRows(mode,voc,level,search);
  const score=guiaScore(filtered,goal);
  const rows=[...filtered].sort((a,b)=>score.get(b)-score.get(a)||((b.xp??-Infinity)-(a.xp??-Infinity))||b.min-a.min);
  const stats=document.getElementById('huntStats'),result=document.getElementById('huntResult'),highlights=document.getElementById('huntHighlights');
  if(!stats||!result||!highlights)return;
  const maxXp=Math.max(...rows.map(h=>Number(h.xp)).filter(Number.isFinite),0), maxLoot=Math.max(...rows.map(h=>Number(h.loot)).filter(Number.isFinite),0);
  const groupMode=mode!=='solo';
  stats.innerHTML=`<div class="stat"><div class="num">${rows.length}</div><div class="label">HUNTS ENCONTRADAS</div></div><div class="stat"><div class="num">${groupMode?'—':(maxXp?huntFmt(maxXp):'—')}</div><div class="label">MAIOR XP/H</div></div><div class="stat"><div class="num">${groupMode?'—':(maxLoot?huntFmt(maxLoot):'—')}</div><div class="label">MAIOR LOOT/H</div></div><div class="stat"><div class="num">${level}</div><div class="label">SEU LEVEL</div></div>`;
  if(!rows.length){highlights.innerHTML='<div class="small">Nenhuma hunt encontrada para esses filtros.</div>';result.innerHTML='';return;}
  if(groupMode){
    const top=rows.slice(0,6);
    highlights.innerHTML=`<div class="hunt-section-head"><div><div class="eyebrow">${mode==='duo'?'Duo':'Teamhunt'}</div><h3>Recomendações por level</h3></div><div class="small">Fonte: <a href="${TIBIAPAL_URL}" target="_blank" rel="noopener">TibiaPal Old</a></div></div><div class="hunt-highlight-grid"><div>${top.map((h,i)=>`<div class="hunt-mini"><span class="tag">${i+1}</span><strong>${esc(h.n)}</strong><span>Level ${h.min}+</span></div>`).join('')}</div></div>`;
  }else{
    const topXp=[...rows].filter(h=>h.xp!=null).sort((a,b)=>b.xp-a.xp).slice(0,3),topLoot=[...rows].filter(h=>h.loot!=null).sort((a,b)=>b.loot-a.loot).slice(0,3),topBalance=rows.slice(0,3);
    const mini=(h,label)=>`<div class="hunt-mini"><span class="tag">${label}</span><strong>${esc(h.n)}</strong><span>Level ${h.min}+ · XP ${huntFmt(h.xp)}/h · Loot ${huntFmt(h.loot)}/h</span></div>`;
    highlights.innerHTML=`<div class="hunt-section-head"><div><div class="eyebrow">Destaques</div><h3>Três jeitos de olhar para a mesma base</h3></div><div class="small">Fonte: <a href="${TIBIAPAL_URL}" target="_blank" rel="noopener">TibiaPal Old</a></div></div><div class="hunt-highlight-grid"><div><h3>Mais XP</h3>${topXp.map(h=>mini(h,'XP')).join('')}</div><div><h3>Mais Loot</h3>${topLoot.map(h=>mini(h,'LOOT')).join('')}</div><div><h3>Equilíbrio</h3>${topBalance.map(h=>mini(h,'BALANÇO')).join('')}</div></div>`;
  }
  const title=mode==='solo'?`${voc} · Level ${level}`:mode==='duo'?'Duo':`Teamhunt`;
  const goalLabel=groupMode?'ordem por level mínimo':({xp:'XP/h',profit:'Loot/h',balance:'equilíbrio XP + loot'}[goal]);
  result.innerHTML=`<div class="hunt-result-head"><div><div class="eyebrow">${esc(title)}</div><h3>${rows.length} hunt${rows.length===1?'':'s'} encontrada${rows.length===1?'':'s'}</h3></div><div class="small">${goalLabel}</div></div><div class="hunt-list">${rows.map((h,i)=>`<article class="hunt-card"><div class="hunt-card-main"><div class="hunt-position">${i+1}</div><div><div class="hunt-title">${esc(h.n)}</div><div class="hunt-meta">Level ${h.min}+${h.style?' · '+esc(h.style):''}</div></div></div><div class="hunt-metrics"><div><span>XP/h</span><strong>${groupMode?'—':huntFmt(h.xp)}</strong></div><div><span>Loot/h</span><strong>${groupMode?'—':huntFmt(h.loot)}</strong></div><div><span>${groupMode?'Fonte':'Margem'}</span><strong>${groupMode?'TibiaPal Old':(h.loot==null?'—':(h.loot<0?'Prejuízo':'Positivo'))}</strong></div></div><div class="hunt-card-foot"><span>${groupMode?'Tabela de grupo do TibiaPal':'Referência histórica do TibiaPal'}</span>${i===0?'<span class="badge">PRIMEIRA OPÇÃO</span>':''}</div></article>`).join('')}</div>`;
}
function guiaModeSync(){
  const mode=document.getElementById('huntMode')?.value||'solo';
  const wrap=document.getElementById('huntVocWrap');
  if(wrap)wrap.style.display=mode==='solo'?'':'none';
  const goal=document.getElementById('huntGoal');
  if(goal){goal.disabled=mode!=='solo';if(mode!=='solo')goal.value='balance';}
  guiaRender();
}
window.addEventListener('DOMContentLoaded',()=>{
  ['huntLevel','huntSearch'].forEach(id=>document.getElementById(id)?.addEventListener('input',guiaRender));
  ['huntVoc','huntGoal'].forEach(id=>document.getElementById(id)?.addEventListener('change',guiaRender));
  document.getElementById('huntMode')?.addEventListener('change',guiaModeSync);
  document.getElementById('huntBtn')?.addEventListener('click',guiaRender);
  guiaModeSync();
});

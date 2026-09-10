function guiaScore(rows, goal){
  if(!rows.length)return new Map();
  if(goal==='xp')return new Map(rows.map(h=>[h, h.xp==null?-Infinity:Number(h.xp)]));
  if(goal==='profit')return new Map(rows.map(h=>[h, h.loot==null?-Infinity:Number(h.loot)]));
  const xpVals=rows.map(h=>Number(h.xp)).filter(Number.isFinite);
  const lootVals=rows.map(h=>Number(h.loot)).filter(Number.isFinite);
  const maxXp=Math.max(...xpVals,1), maxLoot=Math.max(...lootVals,1);
  return new Map(rows.map(h=>{
    const xp=h.xp==null?0:Number(h.xp);
    const loot=h.loot==null?0:Number(h.loot);
    return [h,(xp/maxXp)*50+(loot/maxLoot)*50];
  }));
}

function guiaRender(){
  const level=Math.max(8,Number(document.getElementById('huntLevel')?.value||8));
  const voc=document.getElementById('huntVoc')?.value||'Knight';
  const goal=document.getElementById('huntGoal')?.value||'balance';
  const search=(document.getElementById('huntSearch')?.value||'').trim().toLowerCase();
  const source=(huntSource[voc]||[]).filter(h=>h.min<=level);
  const filtered=source.filter(h=>!search||String(h.n).toLowerCase().includes(search)||String(h.style||'').toLowerCase().includes(search));
  const score=guiaScore(filtered,goal);
  const rows=[...filtered].sort((a,b)=>score.get(b)-score.get(a)||Number(b.xp||-Infinity)-Number(a.xp||-Infinity)||b.min-a.min);
  const maxXp=Math.max(...rows.map(h=>Number(h.xp)).filter(Number.isFinite),0);
  const maxLoot=Math.max(...rows.map(h=>Number(h.loot)).filter(Number.isFinite),0);
  const stats=document.getElementById('huntStats');
  const result=document.getElementById('huntResult');
  const highlights=document.getElementById('huntHighlights');
  if(!stats||!result||!highlights)return;

  stats.innerHTML=`<div class="stat"><div class="num">${rows.length}</div><div class="label">HUNTS ENCONTRADAS</div></div><div class="stat"><div class="num">${maxXp?huntFmt(maxXp):'—'}</div><div class="label">MAIOR XP/H</div></div><div class="stat"><div class="num">${maxLoot?huntFmt(maxLoot):'—'}</div><div class="label">MAIOR LOOT/H</div></div><div class="stat"><div class="num">${level}</div><div class="label">SEU LEVEL</div></div>`;

  if(!rows.length){
    highlights.innerHTML='<div class="small">Nenhuma hunt encontrada para esse level, vocação e busca. Tente retirar o texto da busca ou aumentar o level.</div>';
    result.innerHTML='';
    return;
  }

  const topXp=[...rows].filter(h=>h.xp!=null).sort((a,b)=>b.xp-a.xp).slice(0,3);
  const topLoot=[...rows].filter(h=>h.loot!=null).sort((a,b)=>b.loot-a.loot).slice(0,3);
  const topBalance=rows.slice(0,3);
  const mini=(h,label)=>`<div class="hunt-mini"><span class="tag">${label}</span><strong>${esc(h.n)}</strong><span>Level ${h.min}+ · XP ${huntFmt(h.xp)}/h · Loot ${huntFmt(h.loot)}/h</span></div>`;
  highlights.innerHTML=`<div class="hunt-section-head"><div><div class="eyebrow">Destaques</div><h3>Três jeitos de olhar para a mesma base</h3></div><div class="small">Fonte: <a href="${TIBIAPAL_URL}" target="_blank" rel="noopener">TibiaPal Old</a></div></div><div class="hunt-highlight-grid"><div><h3>Mais XP</h3>${topXp.map(h=>mini(h,'XP')).join('')}</div><div><h3>Mais Loot</h3>${topLoot.map(h=>mini(h,'LOOT')).join('')}</div><div><h3>Equilíbrio</h3>${topBalance.map(h=>mini(h,'BALANÇO')).join('')}</div></div>`;

  const goalLabel={xp:'XP/h',profit:'Loot/h',balance:'equilíbrio XP + loot'}[goal];
  result.innerHTML=`<div class="hunt-result-head"><div><div class="eyebrow">${esc(voc)} · Level ${level}</div><h3>${rows.length} hunt${rows.length===1?'':'s'} compatível${rows.length===1?'':'is'}</h3></div><div class="small">Ordenado por ${goalLabel}</div></div><div class="hunt-list">${rows.map((h,i)=>`<article class="hunt-card"><div class="hunt-card-main"><div class="hunt-position">${i+1}</div><div><div class="hunt-title">${esc(h.n)}</div><div class="hunt-meta">Level ${h.min}+ · ${esc(h.style||'Método não informado')}</div></div></div><div class="hunt-metrics"><div><span>XP/h</span><strong>${huntFmt(h.xp)}</strong></div><div><span>Loot/h</span><strong>${huntFmt(h.loot)}</strong></div><div><span>Margem</span><strong>${h.loot==null?'—':(h.loot<0?'Prejuízo':'Positivo')}</strong></div></div><div class="hunt-card-foot"><span>Referência histórica do TibiaPal</span>${i===0?'<span class="badge">DESTAQUE PELO FILTRO</span>':''}</div></article>`).join('')}</div>`;
}

window.addEventListener('DOMContentLoaded',()=>{
  ['huntLevel','huntVoc','huntGoal','huntSearch'].forEach(id=>document.getElementById(id)?.addEventListener('input',guiaRender));
  ['huntVoc','huntGoal'].forEach(id=>document.getElementById(id)?.addEventListener('change',guiaRender));
  document.getElementById('huntBtn')?.addEventListener('click',guiaRender);
  guiaRender();
});

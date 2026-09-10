const huntVideos={
  "Coryms Port Hope":"https://youtu.be/bnzv7VVCKZQ",
  "Mother of Scarabs Lair -3":"https://youtu.be/0SRlRK_7Flg",
  "Mutated Humans Yalahar":"https://youtu.be/BmLScxZQ9Vk",
  "Blood Crabs Laguna Islands":"https://youtu.be/3mcY_eNBThg",
  "Laguna Islands":"https://youtu.be/hg5Tgj_bubU",
  "Lion's Rock":"https://youtu.be/xTQ6dk8LvlQ",
  "Nibelor Crystal Spiders":"https://youtu.be/bY6IJrqDAaY",
  "Vengoth Haunted Treelings":"https://youtu.be/MzHX_f4jK-0",
  "Yalahar Alchemist Outskirts":"https://youtu.be/L16-bc9CP5Q",
  "Hive Surface":"https://youtu.be/p2HPO2i4IWw",
  "Carlin Cults":"https://youtu.be/shFG3_qgkT0",
  "Nightmare Scions Krailos":"https://youtu.be/JnwY4WAKX24",
  "Edron Heroes -2/-3":"https://youtu.be/Blmm8zBjKRg",
  "Fenrock Dragon Lords":"https://youtu.be/8XYare-fX6A",
  "Edron Vampire Crypt":"https://youtu.be/F_d9LzRCACw",
  "Inner Hive Stage2 East":"https://youtu.be/2bqsbJWm1og",
  "Krailos Bug Cave":"https://youtu.be/-9-sCX_V1Q8",
  "Ravenous Lava Lurkers":"https://youtu.be/caQBlOhC5vY",
  "Oramond West":"https://youtu.be/oPCujZNnN9k",
  "Yalahar Sunken Quarter":"https://youtu.be/SD2Ete6ZUpQ",
  "Okolnir":"https://youtu.be/a8tJcIpDARk",
  "Grimvale -4":"https://youtu.be/KRcizvzF0sM",
  "Edron Orc Cults":"https://youtu.be/4TjwgLYvmmw",
  "Barkless Ab Cults":"https://youtu.be/1Up6TcdEWCU",
  "Lower Spike":"https://youtu.be/qmU9s79Y1NU",
  "Elder Wyrms Drefia":"https://youtu.be/KYit9Ogcfdc",
  "Edron South Werecreatures":"https://youtu.be/ByrANFDESa8",
  "Oramond Minos":"https://youtu.be/QY5J9Yv36Y8",
  "Otherworld (Kazo)":"https://youtu.be/p84-jPg3_D8",
  "Iksupan":"https://youtu.be/zBhplhuKXIY",
  "Deeplings Library":"https://youtu.be/3tpY677sesw",
  "Seacrest Serpents":"https://youtu.be/wBK-Zsv4pGY",
  "Draken Walls":"https://youtu.be/_Nl5iLP_ysw",
  "Asura Palace":"https://youtu.be/D-tKd-2-aP8",
  "Deeper Banuta (Bottom Floor)":"https://youtu.be/C3HBF3noWV0",
  "Werelions -1":"https://youtu.be/7lL9Eu4gEfY",
  "Warzone 5":"https://youtu.be/xDNZPhIDBfE",
  "POI Infernatil Seal (Fire)":"https://youtu.be/ZjtdCId8l_M",
  "POI Dark Torturer Seal":"https://youtu.be/vlOWwyJpEZI",
  "POI Verminor Seal":"https://youtu.be/SwhH7mfXKWA",
  "Marapur Turtles and Foam Stalkers":"https://youtu.be/n0UFwT3P6Pc",
  "POI Infernatil + DT Seals":"https://youtu.be/p_Fy4LA8UaI",
  "Nagas":"https://youtu.be/Y8VtANmM6WY",
  "Issavi Crypts (Sphinx, Wardens)":"https://youtu.be/p-kD2EpGF8g"
};

function esc(v){return String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','\"':'&quot;'}[c]));}

function guiaScore(rows,goal){
  if(!rows.length)return new Map();
  if(goal==='xp')return new Map(rows.map(h=>[h,h.xp==null?-Infinity:Number(h.xp)]));
  if(goal==='profit')return new Map(rows.map(h=>[h,h.loot==null?-Infinity:Number(h.loot)]));
  const xpVals=rows.map(h=>Number(h.xp)).filter(Number.isFinite),lootVals=rows.map(h=>Number(h.loot)).filter(Number.isFinite);
  if(!xpVals.length&&!lootVals.length)return new Map(rows.map((h,i)=>[h,-i]));
  const maxXp=Math.max(...xpVals,1),maxLoot=Math.max(...lootVals,1);
  return new Map(rows.map(h=>{const xp=h.xp==null?0:Number(h.xp),loot=h.loot==null?0:Number(h.loot);return [h,(xp/maxXp)*50+(loot/maxLoot)*50]}));
}
function huntCurrentRows(mode,voc,level,search){
  const source=mode==='duo'?huntDuoSource:mode==='team'?huntTeamSource:(huntSource[voc]||[]);
  return source.filter(h=>h.min<=level&&(!search||String(h.n).toLowerCase().includes(search)||String(h.style||'').toLowerCase().includes(search)));
}
function huntVideoButton(name){const url=huntVideos[name];return url?`<a class="hunt-video" href="${url}" target="_blank" rel="noopener">▶ Ver vídeo</a>`:'';}
function guiaRender(){
  const mode=document.getElementById('huntMode')?.value||'solo',level=Math.max(8,Number(document.getElementById('huntLevel')?.value||8)),voc=document.getElementById('huntVoc')?.value||'Knight',goal=document.getElementById('huntGoal')?.value||'balance',search=(document.getElementById('huntSearch')?.value||'').trim().toLowerCase();
  const filtered=huntCurrentRows(mode,voc,level,search),score=guiaScore(filtered,goal),rows=[...filtered].sort((a,b)=>score.get(b)-score.get(a)||((b.xp??-Infinity)-(a.xp??-Infinity))||b.min-a.min);
  const stats=document.getElementById('huntStats'),result=document.getElementById('huntResult'),highlights=document.getElementById('huntHighlights');
  if(!stats||!result||!highlights)return;
  const maxXp=Math.max(...rows.map(h=>Number(h.xp)).filter(Number.isFinite),0),maxLoot=Math.max(...rows.map(h=>Number(h.loot)).filter(Number.isFinite),0),groupMode=mode!=='solo';
  stats.innerHTML=`<div class="stat"><div class="num">${rows.length}</div><div class="label">HUNTS ENCONTRADAS</div></div><div class="stat"><div class="num">${groupMode?'—':(maxXp?huntFmt(maxXp):'—')}</div><div class="label">MAIOR XP/H</div></div><div class="stat"><div class="num">${groupMode?'—':(maxLoot?huntFmt(maxLoot):'—')}</div><div class="label">MAIOR LOOT/H</div></div><div class="stat"><div class="num">${level}</div><div class="label">SEU LEVEL</div></div>`;
  if(!rows.length){highlights.innerHTML='<div class="small">Nenhuma hunt encontrada para esses filtros.</div>';result.innerHTML='';return;}
  if(groupMode){const top=rows.slice(0,6);highlights.innerHTML=`<div class="hunt-section-head"><div><div class="eyebrow">${mode==='duo'?'Duo':'Teamhunt'}</div><h3>Recomendações por level</h3></div><div class="small">Fonte: <a href="${TIBIAPAL_URL}" target="_blank" rel="noopener">TibiaPal Old</a></div></div><div class="hunt-highlight-grid"><div>${top.map((h,i)=>`<div class="hunt-mini"><span class="tag">${i+1}</span><strong>${esc(h.n)}</strong><span>Level ${h.min}+</span></div>`).join('')}</div></div>`;
  }else{const topXp=[...rows].filter(h=>h.xp!=null).sort((a,b)=>b.xp-a.xp).slice(0,3),topLoot=[...rows].filter(h=>h.loot!=null).sort((a,b)=>b.loot-a.loot).slice(0,3),topBalance=rows.slice(0,3),mini=(h,label)=>`<div class="hunt-mini"><span class="tag">${label}</span><strong>${esc(h.n)}</strong><span>Level ${h.min}+ · XP ${huntFmt(h.xp)}/h · Loot ${huntFmt(h.loot)}/h</span>${huntVideoButton(h.n)}</div>`;highlights.innerHTML=`<div class="hunt-section-head"><div><div class="eyebrow">Destaques</div><h3>Três jeitos de olhar para a mesma base</h3></div><div class="small">Fonte: <a href="${TIBIAPAL_URL}" target="_blank" rel="noopener">TibiaPal Old</a></div></div><div class="hunt-highlight-grid"><div><h3>Mais XP</h3>${topXp.map(h=>mini(h,'XP')).join('')}</div><div><h3>Mais Loot</h3>${topLoot.map(h=>mini(h,'LOOT')).join('')}</div><div><h3>Equilíbrio</h3>${topBalance.map(h=>mini(h,'BALANÇO')).join('')}</div></div>`;}
  const title=mode==='solo'?`${voc} · Level ${level}`:mode==='duo'?'Duo':'Teamhunt',goalLabel=groupMode?'ordem por level mínimo':({xp:'XP/h',profit:'Loot/h',balance:'equilíbrio XP + loot'}[goal]);
  result.innerHTML=`<div class="hunt-result-head"><div><div class="eyebrow">${esc(title)}</div><h3>${rows.length} hunt${rows.length===1?'':'s'} encontrada${rows.length===1?'':'s'}</h3></div><div class="small">${goalLabel}</div></div><div class="hunt-list">${rows.map((h,i)=>`<article class="hunt-card"><div class="hunt-card-main"><div class="hunt-position">${i+1}</div><div><div class="hunt-title">${esc(h.n)}</div><div class="hunt-meta">Level ${h.min}+${h.style?' · '+esc(h.style):''}</div></div></div><div class="hunt-metrics"><div><span>XP/h</span><strong>${groupMode?'—':huntFmt(h.xp)}</strong></div><div><span>Loot/h</span><strong>${groupMode?'—':huntFmt(h.loot)}</strong></div><div><span>${groupMode?'Fonte':'Margem'}</span><strong>${groupMode?'TibiaPal Old':(h.loot==null?'—':(h.loot<0?'Prejuízo':'Positivo'))}</strong></div></div><div class="hunt-card-foot"><span>${groupMode?'Tabela de grupo do TibiaPal':'Referência histórica do TibiaPal'}</span><span>${huntVideoButton(h.n)}</span>${i===0?'<span class="badge">PRIMEIRA OPÇÃO</span>':''}</div></article>`).join('')}</div>`;
}
function guiaModeSync(){const mode=document.getElementById('huntMode')?.value||'solo',wrap=document.getElementById('huntVocWrap'),goal=document.getElementById('huntGoal');if(wrap)wrap.style.display=mode==='solo'?'':'none';if(goal){goal.disabled=mode!=='solo';if(mode!=='solo')goal.value='balance';}guiaRender();}
window.addEventListener('DOMContentLoaded',()=>{['huntLevel','huntSearch'].forEach(id=>document.getElementById(id)?.addEventListener('input',guiaRender));['huntVoc','huntGoal'].forEach(id=>document.getElementById(id)?.addEventListener('change',guiaRender));document.getElementById('huntMode')?.addEventListener('change',guiaModeSync);document.getElementById('huntBtn')?.addEventListener('click',guiaRender);guiaModeSync();});

(()=>{
  if(typeof game==='undefined')return;
  const VF=v=>{const s=String(v||'').toLowerCase();if(s.includes('sorcerer'))return 'Sorcerer';if(s.includes('druid'))return 'Druid';if(s.includes('paladin'))return 'Paladin';if(s.includes('knight'))return 'Knight';if(s.includes('monk'))return 'Monk';return '';};
  const SN={Knight:'Melee Fighting',Paladin:'Distance',Sorcerer:'Magic Level',Druid:'Magic Level',Monk:'Fist Fighting'};
  const SF={Knight:'melee',Paladin:'distance',Sorcerer:'magic',Druid:'magic',Monk:'fist'};
  const icon={Knight:'⚔',Paladin:'🏹',Sorcerer:'✨',Druid:'❄️',Monk:'✊'};
  function voc(){const m=typeof members!=='undefined'&&Array.isArray(members)?members.find(x=>x.name===game?.character):null;return VF(m?.vocation||'');}
  function ensure(){if(!game.skills||typeof game.skills!=='object')game.skills={};const v=voc()||'Knight',f=SF[v]||'melee';if(!Number.isFinite(Number(game.skills[f])))game.skills[f]=10;if(!Number.isFinite(Number(game.skills[f+'_progress'])))game.skills[f+'_progress']=0;return {v,field:f,value:Math.max(1,Math.floor(Number(game.skills[f])||1))};}
  function need(s){s=Math.max(1,Math.floor(Number(s)||1));return Math.max(40,Math.floor(80*Math.pow(1.06,Math.max(0,s-10))));}
  function progress(){const x=ensure();return Math.max(0,Number(game.skills[x.field+'_progress'])||0);}
  function train(n=1){const x=ensure();game.skills[x.field+'_progress']=progress()+n;let ups=0;while(game.skills[x.field+'_progress']>=need(x.value)){game.skills[x.field+'_progress']-=need(x.value);game.skills[x.field]++;x.value++;ups++;toast(`SKILL UP! ${SN[x.v]} ${x.value}.`);}if(typeof persist==='function')persist();renderCompact();return ups;}
  function bonus(){const x=ensure();return Math.max(0,x.value-10);}

  function installCompact(){
    const panel=document.querySelector('.character-panel .stat-grid');
    if(panel&&!document.getElementById('profileSkill')){
      const d=document.createElement('div');d.className='profile-skill-stat';d.id='profileSkill';d.innerHTML='<span>SKILL</span><strong id="profileSkillValue">10</strong><small id="profileSkillName">Combat</small>';
      panel.appendChild(d);
    }
    if(!document.getElementById('skillMiniStyle')){
      const st=document.createElement('style');st.id='skillMiniStyle';st.textContent='.profile-skill-stat{position:relative}.profile-skill-stat small{display:block;font-size:9px;line-height:1.1;opacity:.58;margin-top:2px;white-space:nowrap}.training-section{margin-top:28px}.training-card{position:relative;overflow:hidden}.training-grid{display:grid;grid-template-columns:minmax(0,1fr) 240px;gap:22px;align-items:stretch}.training-arena{border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:20px;background:rgba(15,15,20,.62)}.training-head{display:flex;justify-content:space-between;align-items:center;gap:15px}.training-skill{font-size:30px;font-weight:900}.training-meter{height:18px;border-radius:99px;background:rgba(255,255,255,.08);overflow:hidden;margin:18px 0 8px}.training-meter i{display:block;height:100%;width:0;border-radius:99px;background:linear-gradient(90deg,#8b5cf6,#f59e0b);transition:width .12s linear}.training-target{height:44px;border-radius:12px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.035);position:relative;overflow:hidden;margin:14px 0}.training-target button{position:absolute;top:4px;width:62px;height:34px;border:0;border-radius:9px;background:#f59e0b;color:#17110a;font-weight:900;cursor:pointer;transition:left .08s linear}.training-target button:disabled{opacity:.45;cursor:default}.training-result{min-height:22px;font-size:13px;color:rgba(255,255,255,.72)}.training-info{border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:18px;background:rgba(15,15,20,.42)}.training-info strong{display:block;font-size:18px;margin-bottom:8px}.training-info p{font-size:12px;line-height:1.5;color:rgba(255,255,255,.58);margin:0 0 12px}.training-info ul{padding-left:18px;margin:0;color:rgba(255,255,255,.7);font-size:12px;line-height:1.8}@media(max-width:760px){.training-grid{grid-template-columns:1fr}.profile-skill-stat small{font-size:8px}}';document.head.appendChild(st);
    }
  }

  function installTraining(){
    if(document.getElementById('trainingGrounds'))return;
    const activities=document.querySelector('.activities');if(!activities)return;
    const s=document.createElement('section');s.className='progress-section training-section';s.id='trainingGrounds';s.innerHTML='<div class="section-head"><div><div class="eyebrow">Training Grounds</div><h2>Treinamento de Skill</h2></div><div class="small">Treine sem gastar gold</div></div><div class="training-grid"><div class="training-arena"><div class="training-head"><div><div class="eyebrow" id="trainingSkillName">Combat Skill</div><div class="training-skill" id="trainingSkillValue">Skill 10</div></div><button class="btn active" id="trainingStart">Começar treino</button></div><div class="training-meter"><i id="trainingProgressBar"></i></div><div class="small" id="trainingProgressText">0 / 40 para o próximo skill</div><div class="training-target"><button id="trainingTarget" disabled>ACERTE</button></div><div class="training-result" id="trainingResult">Clique em Começar e acerte o alvo no centro para ganhar treino.</div></div><div class="training-info"><strong>Como funciona</strong><p>Um mini-game rápido para transformar treino em uma atividade real da Arena.</p><ul><li>10 acertos por sessão</li><li>Acerto perfeito dá mais progresso</li><li>Erro não perde skill</li><li>Quanto maior a skill, mais difícil evoluir</li></ul></div></div>';
    activities.parentNode.insertBefore(s,activities);
    document.getElementById('trainingStart').onclick=startTraining;
    document.getElementById('trainingTarget').onclick=hitTarget;
  }

  let training=null;
  function startTraining(){
    if(training?.timer)clearInterval(training.timer);
    training={hits:0,total:10,pos:0,dir:1,timer:null,started:Date.now()};
    const target=document.getElementById('trainingTarget'),start=document.getElementById('trainingStart');
    start.disabled=true;target.disabled=false;document.getElementById('trainingResult').textContent='Acerte o alvo quando ele estiver perto do centro.';
    training.timer=setInterval(()=>{if(!training)return;training.pos+=training.dir*4;if(training.pos>=92){training.pos=92;training.dir=-1}if(training.pos<=0){training.pos=0;training.dir=1}target.style.left=training.pos+'%';},35);
  }
  function hitTarget(){
    if(!training)return;
    const target=document.getElementById('trainingTarget');
    const center=Math.abs(training.pos-50);
    const gain=center<=7?8:center<=16?5:center<=27?3:1;
    training.hits++;
    train(gain);
    document.getElementById('trainingResult').textContent=(gain>=8?'PERFEITO! ':'Bom! ')+`+${gain} treino · ${training.hits}/${training.total}`;
    if(training.hits>=training.total)finishTraining();
  }
  function finishTraining(){
    if(!training)return;
    if(training.timer)clearInterval(training.timer);
    const old=training;training=null;
    const target=document.getElementById('trainingTarget'),start=document.getElementById('trainingStart');
    target.disabled=true;start.disabled=false;document.getElementById('trainingResult').textContent=`Treino concluído: ${old.hits} acertos. Volte quando quiser treinar novamente.`;renderCompact();
  }

  function renderCompact(){
    const x=ensure(),s=x.value,r=need(s),p=progress();
    const val=document.getElementById('profileSkillValue'),name=document.getElementById('profileSkillName');
    if(val)val.textContent=s;if(name)name.textContent=SN[x.v]||'Combat';
    const tn=document.getElementById('trainingSkillName'),tv=document.getElementById('trainingSkillValue'),bar=document.getElementById('trainingProgressBar'),txt=document.getElementById('trainingProgressText');
    if(tn)tn.textContent=`${icon[x.v]||'⚔'} ${SN[x.v]||'Combat Skill'}`;if(tv)tv.textContent=`Skill ${s}`;if(bar)bar.style.width=Math.min(100,p/r*100)+'%';if(txt)txt.textContent=`${fmt(p)} / ${fmt(r)} para Skill ${s+1}`;
  }

  function patch(){
    if(typeof startBattle==='function'&&!window.__arenaSkillBattlePatch){window.__arenaSkillBattlePatch=true;const old=startBattle;window.startBattle=function(...a){old(...a);if(battle)battle.attack+=bonus();};}
    if(typeof attack==='function'&&!window.__arenaSkillAttackPatch){window.__arenaSkillAttackPatch=true;const old=attack;window.attack=function(...a){if(!battle)return old(...a);const hp=battle.hp;const r=old(...a);if(hp>battle.hp)train(1);return r;};}
  }
  window.arenaSkillBonus=bonus;window.arenaSkillTrain=train;window.arenaSkillRender=renderCompact;
  const nr=typeof normalizeGame==='function'?normalizeGame:null;if(nr&&!window.__arenaSkillNormalizePatch){window.__arenaSkillNormalizePatch=true;window.normalizeGame=function(){nr();ensure();};}
  const ra=typeof renderAll==='function'?renderAll:null;if(ra&&!window.__arenaSkillRenderPatch){window.__arenaSkillRenderPatch=true;window.renderAll=function(...a){const r=ra(...a);installCompact();installTraining();renderCompact();return r;};}
  installCompact();installTraining();patch();ensure();renderCompact();
})();

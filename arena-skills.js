(()=>{
  if(typeof game==='undefined')return;
  const VF=v=>{const s=String(v||'').toLowerCase();if(s.includes('sorcerer'))return 'Sorcerer';if(s.includes('druid'))return 'Druid';if(s.includes('paladin'))return 'Paladin';if(s.includes('knight'))return 'Knight';if(s.includes('monk'))return 'Monk';return '';};
  const SN={Knight:'Melee Fighting',Paladin:'Distance',Sorcerer:'Magic Level',Druid:'Magic Level',Monk:'Fist Fighting'};
  const SF={Knight:'melee',Paladin:'distance',Sorcerer:'magic',Druid:'magic',Monk:'fist'};
  const ICON={Knight:'⚔',Paladin:'🏹',Sorcerer:'✨',Druid:'❄️',Monk:'✊'};
  function voc(){const m=typeof members!=='undefined'&&Array.isArray(members)?members.find(x=>x.name===game?.character):null;return VF(m?.vocation||'');}
  function ensure(){if(!game.skills||typeof game.skills!=='object')game.skills={};const v=voc()||'Knight',f=SF[v]||'melee';if(!Number.isFinite(Number(game.skills[f])))game.skills[f]=10;if(!Number.isFinite(Number(game.skills[f+'_progress'])))game.skills[f+'_progress']=0;return {v,field:f,value:Math.max(1,Math.floor(Number(game.skills[f])||1))};}
  function need(s){s=Math.max(1,Math.floor(Number(s)||1));if(s<=20)return 20;if(s<=30)return 30;if(s<=40)return 45;if(s<=50)return 65;if(s<=60)return 90;if(s<=70)return 125;if(s<=80)return 170;if(s<=90)return 230;return Math.floor(300*Math.pow(1.08,s-90));}
  function progress(){const x=ensure();return Math.max(0,Number(game.skills[x.field+'_progress'])||0);}
  function train(n=1){const x=ensure();game.skills[x.field+'_progress']=progress()+n;let ups=0;while(game.skills[x.field+'_progress']>=need(x.value)){game.skills[x.field+'_progress']-=need(x.value);game.skills[x.field]++;x.value++;ups++;toast(`SKILL UP! ${SN[x.v]} ${x.value}.`);}if(typeof persist==='function')persist();renderCompact();return ups;}

  // Skill is the main combat-power multiplier. Level provides the base attack;
  // skill determines how effectively that base is converted into real damage.
  function skillMultiplier(value){
    const s=Math.max(10,Number(value)||10);
    if(s<=20)return 1+(s-10)*0.03;
    if(s<=30)return 1.3+(s-20)*0.04;
    if(s<=40)return 1.7+(s-30)*0.05;
    if(s<=50)return 2.2+(s-40)*0.06;
    if(s<=60)return 2.8+(s-50)*0.07;
    if(s<=70)return 3.5+(s-60)*0.08;
    if(s<=80)return 4.3+(s-70)*0.09;
    if(s<=90)return 5.2+(s-80)*0.10;
    return 6.2+(s-90)*0.11;
  }
  function bonus(){
    const x=ensure();
    const base=battle&&Number.isFinite(Number(battle.baseAttack))?Number(battle.baseAttack):battle&&Number.isFinite(Number(battle.attack))?Number(battle.attack):0;
    return Math.max(0,Math.floor(base*(skillMultiplier(x.value)-1)));
  }
  function current(){const x=ensure();return {v:x.v,field:x.field,value:x.value,progress:progress(),need:need(x.value),name:SN[x.v]||'Combat Skill',multiplier:skillMultiplier(x.value)};}

  function installCompact(){
    const panel=document.querySelector('.character-panel .stat-grid');
    if(panel&&!document.getElementById('profileSkill')){const d=document.createElement('div');d.className='profile-skill-stat';d.id='profileSkill';d.innerHTML='<span>SKILL</span><strong id="profileSkillValue">10</strong><small id="profileSkillName">Combat</small>';panel.appendChild(d);}
    if(!document.getElementById('skillMiniStyle')){const st=document.createElement('style');st.id='skillMiniStyle';st.textContent='.profile-skill-stat{position:relative}.profile-skill-stat small{display:block;font-size:9px;line-height:1.1;opacity:.58;margin-top:2px;white-space:nowrap}.skill-train-btn{width:100%;margin:10px 0 8px;padding:10px 12px;border:1px solid #514b3b;background:linear-gradient(145deg,#211f1a,#141311);color:var(--gold2);display:flex;align-items:center;justify-content:center;gap:8px;cursor:pointer;font-size:.65rem;font-weight:800;letter-spacing:.8px}.skill-train-btn:hover{border-color:#9a8350;background:#242016}.skill-modal{position:fixed;inset:0;z-index:100000;display:none;align-items:center;justify-content:center;padding:18px}.skill-modal.open{display:flex}.skill-modal-backdrop{position:absolute;inset:0;background:rgba(0,0,0,.78);backdrop-filter:blur(4px)}.skill-window{position:relative;width:min(650px,100%);border:1px solid #57534a;background:linear-gradient(145deg,#191b1f,#0c0e10);box-shadow:0 24px 90px rgba(0,0,0,.78);padding:22px;color:#d7d9dd}.skill-head{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:1px solid #303338;padding-bottom:14px;margin-bottom:18px}.skill-head h2{margin:2px 0 4px;font-family:Cinzel,serif}.skill-head p{margin:0;color:#858a92;font-size:.68rem}.skill-close{width:34px;height:34px;border:1px solid #3c4046;background:#111316;color:#aaaeb5;font-size:1.3rem;cursor:pointer}.skill-close:hover{color:#fff;border-color:#777}.skill-session{border:1px solid #34383e;background:rgba(255,255,255,.025);padding:18px}.skill-session-top{display:flex;justify-content:space-between;gap:15px;align-items:center}.skill-big{font-size:30px;font-weight:900}.skill-stats{display:flex;gap:18px;color:#858a92;font-size:.65rem;text-align:right}.skill-stats strong{display:block;color:#d7d9dd;font-size:.9rem}.skill-timing{margin:24px 0 12px}.skill-timing-label{display:flex;justify-content:space-between;font-size:.65rem;color:#858a92;margin-bottom:7px}.skill-timing-bar{position:relative;height:34px;border-radius:8px;border:1px solid #444950;background:linear-gradient(90deg,#191b1f,#29231a,#191b1f);overflow:hidden}.skill-marker{position:absolute;top:3px;width:5px;height:26px;border-radius:3px;background:#e2e5e9;box-shadow:0 0 10px rgba(255,255,255,.45);transform:translateX(-50%)}.skill-perfect-zone{position:absolute;top:4px;height:24px;border-radius:5px;background:rgba(215,183,94,.72);box-shadow:0 0 12px rgba(215,183,94,.25)}.skill-space{width:100%;height:58px;border:1px solid #6f5d35;background:linear-gradient(145deg,#272116,#16130f);color:#e3c46e;font-size:1rem;font-weight:900;letter-spacing:1px;cursor:pointer;margin-top:12px}.skill-space:hover{border-color:#b49550;background:#30281a}.skill-space:active{transform:translateY(1px)}.skill-space:disabled{opacity:.5;cursor:default}.skill-result{height:28px;margin-top:10px;text-align:center;font-weight:800;font-size:.78rem}.skill-session-foot{display:flex;justify-content:space-between;align-items:center;margin-top:14px;color:#777d86;font-size:.62rem}.skill-start{padding:9px 16px}.skill-note{margin-top:14px;color:#686e77;font-size:.62rem;line-height:1.5;text-align:center}@media(max-width:620px){.skill-window{padding:14px}.skill-session-top{align-items:flex-start}.skill-stats{gap:10px}.skill-big{font-size:25px}}';document.head.appendChild(st);}
  }

  let session=null;
  function installModal(){
    if(document.getElementById('skillTrainBtn'))return;
    const panel=document.querySelector('.character-panel');if(!panel)return;
    const backpack=document.getElementById('backpackOpenBtn');
    const btn=document.createElement('button');btn.type='button';btn.id='skillTrainBtn';btn.className='skill-train-btn';btn.innerHTML=`<span>${ICON[ensure().v]||'⚔'}</span><span>TREINAR SKILL</span>`;btn.onclick=openModal;
    if(backpack)panel.insertBefore(btn,backpack);else{const reset=document.getElementById('resetBtn');panel.insertBefore(btn,reset||null);}
    const modal=document.createElement('div');modal.id='skillTrainModal';modal.className='skill-modal';modal.innerHTML=`<div class="skill-modal-backdrop" data-close-skill></div><div class="skill-window" role="dialog" aria-modal="true" aria-labelledby="skillTrainTitle"><div class="skill-head"><div><div class="eyebrow">Training Grounds</div><h2 id="skillTrainTitle">Treinamento de Skill</h2><p id="skillModalMeta">Treine seu personagem por uma sessão curta.</p></div><button type="button" class="skill-close" data-close-skill aria-label="Fechar">×</button></div><div class="skill-session"><div class="skill-session-top"><div><div class="eyebrow" id="skillModalName">⚔ Melee Fighting</div><div class="skill-big" id="skillModalValue">Skill 10</div></div><div class="skill-stats"><div>COMBO<strong id="skillCombo">0</strong></div><div>PRECISÃO<strong id="skillAccuracy">0%</strong></div></div></div><div class="skill-timing"><div class="skill-timing-label"><span>Timing</span><span id="skillAttempts">20 tentativas</span></div><div class="skill-timing-bar" id="skillTimingBar"><i class="skill-perfect-zone" id="skillPerfectZone"></i><i class="skill-marker" id="skillMarker"></i></div><button type="button" class="skill-space" id="skillSpace" disabled>APERTE ESPAÇO</button><div class="skill-result" id="skillResult">Clique em começar para iniciar o treino.</div></div><div class="skill-session-foot"><span id="skillProgressText">0 / 20 para Skill 11</span><button type="button" class="btn active skill-start" id="skillStart">Começar treino</button></div></div><div class="skill-note">A zona perfeita muda a cada tentativa. O ritmo também varia para impedir padrões automáticos.</div></div>`;document.body.appendChild(modal);
    modal.querySelectorAll('[data-close-skill]').forEach(x=>x.addEventListener('click',closeModal));document.addEventListener('keydown',onKey);document.getElementById('skillStart').onclick=startSession;document.getElementById('skillSpace').onclick=hit;renderCompact();
  }
  function openModal(){renderCompact();document.getElementById('skillTrainModal')?.classList.add('open');document.body.classList.add('skill-modal-open');resetSessionUI();}
  function closeModal(){if(session)finishSession();document.getElementById('skillTrainModal')?.classList.remove('open');document.body.classList.remove('skill-modal-open');}
  function onKey(e){const modal=document.getElementById('skillTrainModal');if(!modal?.classList.contains('open'))return;if(e.key==='Escape'){closeModal();return}if(e.code==='Space'){e.preventDefault();if(!document.getElementById('skillSpace')?.disabled)hit();}}
  function resetSessionUI(){if(session)finishSession();document.getElementById('skillSpace').disabled=true;document.getElementById('skillStart').disabled=false;document.getElementById('skillStart').textContent='Começar treino';document.getElementById('skillResult').textContent='Clique em começar para iniciar o treino.';document.getElementById('skillCombo').textContent='0';document.getElementById('skillAccuracy').textContent='0%';}
  function startSession(){if(session)finishSession();const attempts=20;session={attempts,total:attempts,combo:0,good:0,pos:0,dir:1,zone:50,zoneSize:14,speed:3,timer:null,last:0};document.getElementById('skillStart').disabled=true;document.getElementById('skillSpace').disabled=false;document.getElementById('skillResult').textContent='Aperte ESPAÇO quando o marcador estiver dentro da zona dourada.';nextTarget(true);session.timer=setInterval(tick,35);}
  function tick(){if(!session)return;const now=performance.now();const delta=Math.min(2,(now-session.last||now)/100);session.last=now;session.pos+=session.dir*session.speed*delta;if(session.pos>=98){session.pos=98;session.dir=-1}if(session.pos<=2){session.pos=2;session.dir=1}const marker=document.getElementById('skillMarker');if(marker)marker.style.left=session.pos+'%';}
  function nextTarget(first=false){if(!session)return;let previous=session.zone;let zone;do{zone=10+Math.random()*80}while(!first&&Math.abs(zone-previous)<18);session.zone=zone;const skill=ensure().value;session.zoneSize=Math.max(7,15-Math.min(7,Math.floor((skill-10)/15)));session.speed=5.5+Math.random()*3.5+Math.min(2,skill/80);session.dir=Math.random()<.5?-1:1;session.pos=Math.random()<.5?2:98;session.last=performance.now();const z=document.getElementById('skillPerfectZone');if(z){z.style.width=session.zoneSize+'%';z.style.left=(session.zone-session.zoneSize/2)+'%';}const marker=document.getElementById('skillMarker');if(marker)marker.style.left=session.pos+'%';}
  function hit(){if(!session)return;const center=Math.abs(session.pos-session.zone);const half=session.zoneSize/2;let gain=0,label='ERROU';if(center<=half*.32){gain=12;label='PERFEITO!';session.good++;session.combo++;}else if(center<=half*.65){gain=8;label='ÓTIMO!';session.good++;session.combo++;}else if(center<=half){gain=4;label='BOM!';session.good++;session.combo++;}else{session.combo=0;}if(gain>0)train(gain);session.attempts--;document.getElementById('skillCombo').textContent=session.combo;document.getElementById('skillAccuracy').textContent=Math.round(session.good/(session.total-session.attempts)*100)+'%';document.getElementById('skillResult').textContent=gain>0?`${label} +${gain} treino · ${session.attempts} restantes`:`${label} · 0 treino · ${session.attempts} restantes`;if(session.attempts<=0){finishSession();return}nextTarget();}
  function finishSession(){if(!session)return;const done=session;session=null;if(done.timer)clearInterval(done.timer);const start=document.getElementById('skillStart'),space=document.getElementById('skillSpace');if(start){start.disabled=false;start.textContent='Treinar novamente';}if(space)space.disabled=true;const acc=Math.round(done.good/done.total*100);const result=document.getElementById('skillResult');if(result)result.textContent=`Sessão concluída · ${acc}% de precisão · ${done.total} tentativas`;renderCompact();}

  function renderCompact(){
    const x=ensure(),s=x.value,r=need(s),p=progress();
    const val=document.getElementById('profileSkillValue'),name=document.getElementById('profileSkillName');if(val)val.textContent=s;if(name)name.textContent=SN[x.v]||'Combat';
    const btn=document.getElementById('skillTrainBtn');if(btn)btn.querySelector('span').textContent=ICON[x.v]||'⚔';
    const mn=document.getElementById('skillModalName'),mv=document.getElementById('skillModalValue'),pt=document.getElementById('skillProgressText');if(mn)mn.textContent=`${ICON[x.v]||'⚔'} ${SN[x.v]||'Combat Skill'}`;if(mv)mv.textContent=`Skill ${s}`;if(pt)pt.textContent=`${fmt(p)} / ${fmt(r)} para Skill ${s+1}`;
  }
  function patch(){
    if(typeof startBattle==='function'&&!window.__arenaSkillBattlePatch){window.__arenaSkillBattlePatch=true;const old=startBattle;window.startBattle=function(...a){old(...a);if(battle){const x=ensure();battle.baseAttack=Number(battle.attack)||0;battle.attack=Math.floor(battle.baseAttack*skillMultiplier(x.value));}};}
    if(typeof attack==='function'&&!window.__arenaSkillAttackPatch){window.__arenaSkillAttackPatch=true;const old=attack;window.attack=function(...a){if(!battle)return old(...a);const hp=battle.hp;const r=old(...a);if(hp>battle.hp)train(2);return r;};}
  }
  window.arenaSkillBonus=bonus;
  window.arenaSkillMultiplier=skillMultiplier;
  window.arenaSkillTrain=train;
  window.arenaSkillRender=renderCompact;
  window.arenaSkillCurrent=current;
  window.arenaSkills={get:current};
  const nr=typeof normalizeGame==='function'?normalizeGame:null;if(nr&&!window.__arenaSkillNormalizePatch){window.__arenaSkillNormalizePatch=true;window.normalizeGame=function(){nr();ensure();};}
  const ra=typeof renderAll==='function'?renderAll:null;if(ra&&!window.__arenaSkillRenderPatch){window.__arenaSkillRenderPatch=true;window.renderAll=function(...a){const r=ra(...a);installCompact();installModal();renderCompact();return r;};}
  installCompact();installModal();patch();ensure();renderCompact();
})();

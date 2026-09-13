(()=>{
  if(typeof game==='undefined')return;

  const SKILL_KEY='skills';
  const VOC_FAMILY=v=>{
    const s=String(v||'').toLowerCase();
    if(s.includes('sorcerer'))return 'Sorcerer';
    if(s.includes('druid'))return 'Druid';
    if(s.includes('paladin'))return 'Paladin';
    if(s.includes('knight'))return 'Knight';
    if(s.includes('monk'))return 'Monk';
    return '';
  };
  const SKILL_NAME={Knight:'Melee Fighting',Paladin:'Distance',Sorcerer:'Magic Level',Druid:'Magic Level',Monk:'Fist Fighting'};
  const SKILL_FIELD={Knight:'melee',Paladin:'distance',Sorcerer:'magic',Druid:'magic',Monk:'fist'};

  function vocation(){
    const m=typeof members!=='undefined'&&Array.isArray(members)?members.find(x=>x.name===game?.character):null;
    return VOC_FAMILY(m?.vocation||'');
  }
  function ensure(){
    if(!game.skills||typeof game.skills!=='object')game.skills={};
    const v=vocation()||'Knight',field=SKILL_FIELD[v]||'melee';
    if(!Number.isFinite(Number(game.skills[field])))game.skills[field]=10;
    if(!Number.isFinite(Number(game.skills[field+'_tries'])))game.skills[field+'_tries']=0;
    return {v,field,value:Math.max(1,Math.floor(Number(game.skills[field])||1))};
  }
  function need(skill){
    const s=Math.max(1,Math.floor(Number(skill)||1));
    return Math.max(40,Math.floor(80*Math.pow(1.06,Math.max(0,s-10))));
  }
  function totalProgress(skill){
    let total=0;for(let s=1;s<skill;s++)total+=need(s);return total;
  }
  function pointsIntoLevel(){
    const x=ensure(), tries=Math.max(0,Number(game.skills[x.field+'_tries'])||0);
    return tries-totalProgress(x.value);
  }
  function train(amount=1){
    const x=ensure();
    game.skills[x.field+'_tries']=(Number(game.skills[x.field+'_tries'])||0)+amount;
    let leveled=0;
    while(pointsIntoLevel()>=need(x.value)){
      game.skills[x.field+'_tries']-=need(x.value);
      game.skills[x.field]++;
      leveled++;
      toast(`SKILL UP! ${SKILL_NAME[x.v]} ${game.skills[x.field]}.`);
    }
    if(typeof persist==='function')persist();
    render();
    return leveled;
  }
  function bonus(){
    const x=ensure();
    return Math.max(0,(x.value-10));
  }
  function patchBattle(){
    if(typeof startBattle!=='function'||window.__arenaSkillBattlePatch)return;
    window.__arenaSkillBattlePatch=true;
    const original=startBattle;
    window.startBattle=function(...args){
      original(...args);
      if(battle){
        const b=bonus();
        battle.attack+=b;
        battle.skillBonus=b;
      }
    };
    if(typeof attack==='function'&&!window.__arenaSkillAttackPatch){
      window.__arenaSkillAttackPatch=true;
      const originalAttack=attack;
      window.attack=function(...args){
        if(!battle)return originalAttack(...args);
        const before=battle.hp;
        const result=originalAttack(...args);
        if(before>battle.hp||!battle)train(1);
        return result;
      };
    }
  }
  function render(){
    const box=document.getElementById('arenaSkills');if(!box)return;
    const x=ensure(),skill=x.value,req=need(skill),inside=Math.max(0,pointsIntoLevel()),pct=Math.min(100,inside/req*100);
    box.innerHTML=`<div class="skill-card"><div class="skill-head"><div><div class="eyebrow">Treinamento</div><h2>${SKILL_NAME[x.v]||'Combat Skill'}</h2></div><div class="skill-value">${skill}</div></div><div class="skill-meta"><span>Vocação: ${x.v||'Aventureiro'}</span><span>+${bonus()} dano</span></div><div class="skill-track"><i style="width:${pct}%"></i></div><div class="skill-progress">${fmt(inside)} / ${fmt(req)} para Skill ${skill+1}</div><p class="skill-note">A skill sobe durante os ataques. Nos níveis altos, cada avanço exige muito mais treinamento.</p></div>`;
  }

  window.arenaSkillBonus=bonus;
  window.arenaSkillTrain=train;
  window.arenaSkillRender=render;

  const oldNormalize=typeof normalizeGame==='function'?normalizeGame:null;
  if(oldNormalize&&!window.__arenaSkillNormalizePatch){
    window.__arenaSkillNormalizePatch=true;
    window.normalizeGame=function(){oldNormalize();ensure();};
  }

  const oldRenderAll=typeof renderAll==='function'?renderAll:null;
  if(oldRenderAll&&!window.__arenaSkillRenderPatch){
    window.__arenaSkillRenderPatch=true;
    window.renderAll=function(...args){const r=oldRenderAll(...args);render();return r;};
  }

  patchBattle();
  ensure();
  render();
})();

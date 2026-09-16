(()=>{
  if(window.__arenaCharacterCreation)return;
  window.__arenaCharacterCreation=true;
  const VOCATIONS={
    Knight:{icon:'⚔️',desc:'Resistente e focado em combate corpo a corpo.',weapons:'Espadas, machados e armas pesadas.'},
    Paladin:{icon:'🏹',desc:'Atacante à distância, equilibrado entre dano e resistência.',weapons:'Arcos e armas de distância.'},
    Sorcerer:{icon:'🔥',desc:'Especialista em dano mágico e elementos ofensivos.',weapons:'Wands e armas mágicas.'},
    Druid:{icon:'❄️',desc:'Especialista em magia elemental, suporte e controle.',weapons:'Rods e armas mágicas.'},
    Monk:{icon:'🥊',desc:'Lutador ágil de combate desarmado e golpes poderosos.',weapons:'Punhos e armas de duas mãos.'}
  };
  const GENDER={male:'♂ Masculino',female:'♀ Feminino'};
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const supabaseReady=()=>window.malUpadosSupabase&&typeof window.malUpadosSupabase.auth?.getUser==='function';
  let modal=null,creating=false;

  function style(){
    if(document.getElementById('arena-character-creation-style'))return;
    const s=document.createElement('style');s.id='arena-character-creation-style';
    s.textContent=`.arena-char-gate{position:fixed;inset:0;z-index:100050;background:rgba(4,6,10,.9);backdrop-filter:blur(9px);display:flex;align-items:center;justify-content:center;padding:20px}.arena-char-window{width:min(760px,100%);max-height:92vh;overflow:auto;background:linear-gradient(145deg,#17191e,#0c0e12);border:1px solid rgba(180,139,60,.55);border-radius:12px;box-shadow:0 30px 100px rgba(0,0,0,.7);padding:28px;color:#fff}.arena-char-window h2{font:900 27px Cinzel,serif;color:#e8c66f;margin:0 0 7px}.arena-char-window .intro{color:#9da3ac;font-size:14px;line-height:1.5;margin:0 0 20px}.arena-char-field{margin-top:16px}.arena-char-field label{display:block;color:#cdd1d6;font:800 12px Inter,sans-serif;margin-bottom:7px;text-transform:uppercase;letter-spacing:.7px}.arena-char-input{width:100%;box-sizing:border-box;background:#080b10;border:1px solid #383d44;color:#fff;border-radius:8px;padding:13px;font:600 14px Inter,sans-serif;outline:none}.arena-char-input:focus{border-color:#c69b46}.arena-char-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.arena-char-choice{appearance:none;text-align:left;border:1px solid #343941;background:#121519;color:#d7dbe0;border-radius:9px;padding:14px;cursor:pointer;transition:.15s}.arena-char-choice:hover{border-color:#80632f;background:#191714}.arena-char-choice.selected{border-color:#c49a4b;background:linear-gradient(145deg,#241e14,#15171b);box-shadow:inset 0 0 0 1px rgba(196,154,75,.18)}.arena-char-choice .choice-title{font:900 14px Inter,sans-serif}.arena-char-choice .choice-desc{display:block;color:#8e959e;font-size:12px;line-height:1.4;margin-top:5px}.arena-char-choice .choice-icon{font-size:23px;float:right;margin-left:8px}.arena-vocation-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:8px}.arena-vocation{min-height:125px}.arena-vocation .choice-icon{float:none;display:block;margin:0 0 8px;font-size:27px}.arena-vocation .choice-title{display:block}.arena-vocation .choice-desc{font-size:11px}.arena-char-preview{display:flex;align-items:center;gap:14px;padding:13px;border:1px solid #2e3339;background:#111418;border-radius:9px;margin-top:16px}.arena-char-preview-avatar{width:58px;height:58px;display:grid;place-items:center;border-radius:50%;background:#1c2026;border:1px solid #4b5159;font-size:31px}.arena-char-preview strong{display:block;color:#e4e7eb}.arena-char-preview span{display:block;color:#8b929b;font-size:12px;margin-top:3px}.arena-char-actions{display:flex;justify-content:flex-end;gap:9px;margin-top:20px}.arena-char-btn{border:1px solid #4b4f56;background:#171a1e;color:#d8dbe0;border-radius:7px;padding:11px 16px;font:900 12px Inter,sans-serif;cursor:pointer}.arena-char-btn.primary{background:linear-gradient(180deg,#b98d3d,#765622);border-color:#d1ab62;color:#fff}.arena-char-btn:disabled{opacity:.45;cursor:not-allowed}.arena-char-msg{min-height:20px;margin-top:10px;color:#c9a55e;font-size:12px}.arena-char-msg.error{color:#e58d83}.arena-char-create-small{display:inline-flex;align-items:center;gap:7px;margin:10px 0 0;padding:9px 12px;border:1px solid #7d6332;background:#1c1811;color:#e5c675;border-radius:7px;font:900 11px Inter,sans-serif;cursor:pointer}@media(max-width:720px){.arena-vocation-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.arena-char-grid{grid-template-columns:1fr}.arena-char-window{padding:20px}}`;
    document.head.appendChild(s);
  }

  function close(){
    if(creating)return false;
    const current=modal||document.getElementById('arenaCharacterCreateModal');
    if(current)current.remove();
    modal=null;
    return true;
  }

  function openCreate(){
    if(modal||creating)return;
    style();
    modal=document.createElement('div');modal.className='arena-char-gate';modal.id='arenaCharacterCreateModal';
    modal.innerHTML=`<div class="arena-char-window" role="dialog" aria-modal="true"><div class="eyebrow">NOVO PERSONAGEM</div><h2>Criar personagem</h2><p class="intro">Crie o herói que vai entrar na Arena.</p><div class="arena-char-field"><label for="arenaCharName">Nome do personagem</label><input id="arenaCharName" class="arena-char-input" maxlength="24" autocomplete="off" placeholder="Ex: Talles Knight"></div><div class="arena-char-field"><label>Sexo</label><div class="arena-char-grid"><button type="button" class="arena-char-choice selected" data-gender="male"><span class="choice-icon">♂</span><span class="choice-title">Masculino</span><span class="choice-desc">Outfit masculino.</span></button><button type="button" class="arena-char-choice" data-gender="female"><span class="choice-icon">♀</span><span class="choice-title">Feminino</span><span class="choice-desc">Outfit feminino.</span></button></div></div><div class="arena-char-field"><label>Vocação</label><div class="arena-vocation-grid">${Object.entries(VOCATIONS).map(([name,v],i)=>`<button type="button" class="arena-char-choice arena-vocation ${i===0?'selected':''}" data-vocation="${name}"><span class="choice-icon">${v.icon}</span><span class="choice-title">${name}</span><span class="choice-desc">${v.desc}</span></button>`).join('')}</div></div><div class="arena-char-preview"><div class="arena-char-preview-avatar" id="arenaCharPreviewAvatar">⚔️</div><div><strong id="arenaCharPreviewName">Novo personagem</strong><span id="arenaCharPreviewMeta">Masculino · Knight</span></div></div><div class="arena-char-msg" id="arenaCharMsg"></div><div class="arena-char-actions"><button type="button" class="arena-char-btn" id="arenaCharCancel">CANCELAR</button><button type="button" class="arena-char-btn primary" id="arenaCharCreate">CRIAR PERSONAGEM</button></div></div>`;
    document.body.appendChild(modal);
    let gender='male',vocation='Knight';
    const nameInput=document.getElementById('arenaCharName'),msg=document.getElementById('arenaCharMsg');
    const updatePreview=()=>{const n=nameInput.value.trim()||'Novo personagem';document.getElementById('arenaCharPreviewName').textContent=n;document.getElementById('arenaCharPreviewMeta').textContent=`${GENDER[gender]} · ${vocation}`;document.getElementById('arenaCharPreviewAvatar').textContent=VOCATIONS[vocation].icon};
    modal.querySelectorAll('[data-gender]').forEach(b=>b.onclick=e=>{e.preventDefault();e.stopPropagation();gender=b.dataset.gender;modal.querySelectorAll('[data-gender]').forEach(x=>x.classList.toggle('selected',x===b));updatePreview()});
    modal.querySelectorAll('[data-vocation]').forEach(b=>b.onclick=e=>{e.preventDefault();e.stopPropagation();vocation=b.dataset.vocation;modal.querySelectorAll('[data-vocation]').forEach(x=>x.classList.toggle('selected',x===b));updatePreview()});
    nameInput.addEventListener('input',updatePreview);
    document.getElementById('arenaCharCancel').onclick=e=>{e.preventDefault();e.stopPropagation();close()};
    document.getElementById('arenaCharCreate').onclick=e=>{e.preventDefault();e.stopPropagation();createCharacter(nameInput.value.trim(),gender,vocation,msg)};
    modal.addEventListener('click',e=>e.stopPropagation());
    modal.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();close()}if(e.key==='Enter'&&e.target===nameInput){e.preventDefault();document.getElementById('arenaCharCreate').click()}});
    setTimeout(()=>nameInput.focus(),30);
  }

  async function createCharacter(name,gender,vocation,msg){
    if(creating)return;
    if(!supabaseReady()){msg.textContent='Conta ainda não está pronta. Tente novamente.';msg.className='arena-char-msg error';return}
    if(name.length<3||name.length>24){msg.textContent='O nome precisa ter entre 3 e 24 caracteres.';msg.className='arena-char-msg error';return}
    if(!/^[\p{L}_ -]+$/u.test(name)){msg.textContent='Use apenas letras, espaços, _ ou - no nome.';msg.className='arena-char-msg error';return}
    const btn=document.getElementById('arenaCharCreate');if(!btn)return;
    creating=true;btn.disabled=true;msg.textContent='Verificando conta...';msg.className='arena-char-msg';
    try{
      const {data:{user}}=await window.malUpadosSupabase.auth.getUser();
      if(!user)throw new Error('Faça login novamente para criar o personagem.');
      const initial={character:name,level:1,xp:0,gold:100,wins:0,kills:0,damage:0,zone:0,weapon:0,armor:0,bestStreak:0,streak:0,lastChallenge:'',challengeProgress:0,challengeIndex:Math.floor(Math.random()*4),gender,vocation};
      msg.textContent='Criando personagem...';
      const operation=window.malUpadosSupabase.from('arena_characters').insert({user_id:user.id,name,gender,vocation,game_state:initial}).select('id,name,gender,vocation,game_state').single();
      const timeout=new Promise((_,reject)=>setTimeout(()=>reject(new Error('A criação demorou mais que o esperado. Verifique sua conexão e tente novamente.')),12000));
      const {data,error}=await Promise.race([operation,timeout]);
      if(error)throw error;
      if(!data?.id||!data?.name)throw new Error('O servidor não retornou o personagem criado.');
      if(typeof members!=='undefined'&&Array.isArray(members)){members.length=0;members.push({name:data.name,vocation:data.vocation,gender:data.gender,characterId:data.id})}
      if(typeof loadGame==='function')loadGame(data.name);
      if(typeof game!=='undefined'&&game){game.gender=gender;game.vocation=vocation;if(typeof persist==='function')persist()}
      creating=false;close();
      if(typeof renderAll==='function')renderAll();
      if(typeof showZone==='function')showZone(typeof game!=='undefined'?game.zone:0);
      window.dispatchEvent(new CustomEvent('arena-character-created',{detail:{character:data}}));
    }catch(error){
      console.error('Arena character creation:',error);
      creating=false;
      const code=error?.code||'';
      msg.textContent=code==='23505'?'Esse nome de personagem já está em uso. Escolha outro.':(error?.message||'Não foi possível criar o personagem. Tente novamente.');
      msg.className='arena-char-msg error';
      btn.disabled=false;
    }
  }

  async function init(){style()}
  window.arenaOpenCharacterCreator=openCreate;
  window.arenaCloseCharacterCreator=close;
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();

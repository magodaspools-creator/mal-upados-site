(()=>{
  if(window.__arenaCharacterDelete)return;
  window.__arenaCharacterDelete=true;

  const style=()=>{
    if(document.getElementById('arena-delete-style'))return;
    const s=document.createElement('style');s.id='arena-delete-style';s.textContent='
      .arena-delete-btn{width:100%;margin-top:8px;padding:9px 12px;border:1px solid #5b3030;background:#171012;color:#d99a9a;cursor:pointer;font:800 10px Inter,sans-serif;letter-spacing:.7px}
      .arena-delete-btn:hover{border-color:#9b4d4d;background:#211316;color:#f0b1b1}
      .arena-delete-modal{position:fixed;inset:0;z-index:100060;display:none;align-items:center;justify-content:center;padding:18px;background:rgba(0,0,0,.82);backdrop-filter:blur(7px)}
      .arena-delete-modal.open{display:flex}
      .arena-delete-window{width:min(480px,100%);padding:24px;border:1px solid #6a3838;background:linear-gradient(145deg,#1b1416,#0d0f12);box-shadow:0 25px 90px rgba(0,0,0,.8);color:#ddd}
      .arena-delete-window h2{margin:4px 0 8px;color:#e6b0b0;font:900 23px Cinzel,serif}
      .arena-delete-warning{margin:0 0 16px;color:#aaa;font-size:12px;line-height:1.55}
      .arena-delete-name{color:#fff;font-weight:900}
      .arena-delete-input{width:100%;box-sizing:border-box;padding:12px;background:#080a0d;border:1px solid #444;color:#fff;outline:none;font-weight:700}
      .arena-delete-input:focus{border-color:#a85c5c}
      .arena-delete-actions{display:flex;justify-content:flex-end;gap:8px;margin-top:14px}
      .arena-delete-cancel,.arena-delete-confirm{padding:10px 14px;border:1px solid #45484d;background:#15181c;color:#ccc;cursor:pointer;font-weight:800}
      .arena-delete-confirm{border-color:#7b3c3c;background:#391b1e;color:#f1b5b5}
      .arena-delete-confirm:disabled{opacity:.35;cursor:not-allowed}
    ';document.head.appendChild(s);
  };

  function currentName(){return typeof game!=='undefined'&&game?.character?String(game.character):''}
  function currentRecord(){const name=currentName();return typeof members!=='undefined'&&Array.isArray(members)?members.find(m=>m.name===name):null}

  async function removeCharacter(){
    const name=currentName(),record=currentRecord(),supabase=window.malUpadosSupabase;
    if(!name||!record?.characterId){toast('Personagem não encontrado.');return false}
    if(!supabase){toast('A conta ainda não está pronta.');return false}
    const {data:{user}}=await supabase.auth.getUser();
    if(!user){toast('Faça login novamente.');return false}
    const {error}=await supabase.from('arena_characters').delete().eq('id',record.characterId).eq('user_id',user.id);
    if(error){console.error('Arena character delete:',error);toast('Não foi possível excluir o personagem.');return false}

    let all={};try{all=JSON.parse(localStorage.getItem('malupados_arena_v1')||'{}')}catch{}
    delete all[name];localStorage.setItem('malupados_arena_v1',JSON.stringify(all));
    if(Array.isArray(members)){const i=members.findIndex(m=>m.name===name);if(i>=0)members.splice(i,1)}
    const next=Array.isArray(members)&&members.length?members[0]:null;
    if(next&&typeof loadGame==='function')loadGame(next.name);
    if(typeof renderAll==='function')renderAll();
    if(!next)window.arenaOpenCharacterCreator?.();
    toast('Personagem "'+name+'" excluído.');
    return true;
  }

  function close(){document.getElementById('arenaDeleteModal')?.classList.remove('open')}
  function update(){
    const modal=document.getElementById('arenaDeleteModal');if(!modal)return;
    const name=currentName(),input=modal.querySelector('#arenaDeleteInput'),btn=modal.querySelector('#arenaDeleteConfirm');
    btn.disabled=input.value!==name;
  }
  function open(){
    const name=currentName();if(!name)return;
    let modal=document.getElementById('arenaDeleteModal');
    if(!modal){
      modal=document.createElement('div');modal.id='arenaDeleteModal';modal.className='arena-delete-modal';
      modal.innerHTML='<div class="arena-delete-window" role="dialog" aria-modal="true"><div class="eyebrow">AÇÃO IRREVERSÍVEL</div><h2>Excluir personagem?</h2><p class="arena-delete-warning">Isso apagará permanentemente <span class="arena-delete-name" id="arenaDeleteCharacter"></span> e todo o progresso dele. Para evitar um clique acidental, digite o nome exato do personagem abaixo.</p><input class="arena-delete-input" id="arenaDeleteInput" autocomplete="off" spellcheck="false" placeholder="Digite o nome exato"><div class="arena-delete-actions"><button type="button" class="arena-delete-cancel" id="arenaDeleteCancel">Cancelar</button><button type="button" class="arena-delete-confirm" id="arenaDeleteConfirm" disabled>EXCLUIR PERMANENTEMENTE</button></div></div>';
      document.body.appendChild(modal);
      modal.addEventListener('click',e=>{if(e.target===modal)close()});
      modal.querySelector('#arenaDeleteCancel').onclick=close;
      modal.querySelector('#arenaDeleteInput').addEventListener('input',update);
      modal.querySelector('#arenaDeleteConfirm').onclick=async()=>{
        const btn=modal.querySelector('#arenaDeleteConfirm');if(btn.disabled)return;
        btn.disabled=true;const ok=await removeCharacter();if(ok)close();else update();
      };
    }
    modal.querySelector('#arenaDeleteCharacter').textContent=name;
    const input=modal.querySelector('#arenaDeleteInput');input.value='';
    modal.querySelector('#arenaDeleteConfirm').disabled=true;
    modal.classList.add('open');setTimeout(()=>input.focus(),30);
  }

  function install(){
    style();
    const panel=document.querySelector('.character-panel');if(!panel)return;
    if(document.getElementById('arenaDeleteCharacterBtn'))return;
    const btn=document.createElement('button');btn.type='button';btn.id='arenaDeleteCharacterBtn';btn.className='arena-delete-btn';btn.textContent='EXCLUIR PERSONAGEM';
    const reset=document.getElementById('resetBtn');if(reset)reset.insertAdjacentElement('afterend',btn);else panel.appendChild(btn);
    btn.onclick=open;
  }
  window.arenaDeleteCharacter=open;
  install();setInterval(install,1000);
})();
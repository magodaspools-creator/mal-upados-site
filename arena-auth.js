(()=>{
  if(window.__arenaAuthLoaded)return;
  window.__arenaAuthLoaded=true;
  const SUPABASE_URL='https://qnfqeprgvmyapgagmcqf.supabase.co';
  const SUPABASE_KEY='sb_publishable_RmJoMDzSSqC46U1nNZR1XA_--7pm3y8';
  const STORAGE='malupados_arena_v1';
  const TABLE='arena_player_progress';
  const CDN='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

  window.__arenaAuthReady=new Promise(async resolve=>{
    try{
      const mod=await import(CDN);
      const supabase=mod.createClient(SUPABASE_URL,SUPABASE_KEY);
      window.arenaSupabase=supabase;
      let syncing=false;

      const localState=()=>{try{return JSON.parse(localStorage.getItem(STORAGE)||'{}')}catch{return {}}};
      const setLocalState=state=>localStorage.setItem(STORAGE,JSON.stringify(state||{}));
      const hasState=state=>state&&typeof state==='object'&&Object.keys(state).length>0;

      async function pullOrMigrate(user){
        const {data,error}=await supabase.from(TABLE).select('game_state').eq('user_id',user.id).maybeSingle();
        if(error){console.error('Arena cloud load:',error);return false;}
        const local=localState();
        if(data?.game_state && hasState(data.game_state)){
          setLocalState(data.game_state);
          return true;
        }
        if(hasState(local)){
          const {error:upsertError}=await supabase.from(TABLE).upsert({user_id:user.id,game_state:local},{onConflict:'user_id'});
          if(upsertError)console.error('Arena migration:',upsertError);
        }
        return true;
      }

      async function push(){
        const user=(await supabase.auth.getUser()).data.user;
        if(!user||syncing)return;
        syncing=true;
        try{
          const state=localState();
          const {error}=await supabase.from(TABLE).upsert({user_id:user.id,game_state:state},{onConflict:'user_id'});
          if(error)console.error('Arena cloud save:',error);
          else window.__arenaLastCloudState=JSON.stringify(state);
        }finally{syncing=false}
      }

      function style(){
        if(document.getElementById('arena-auth-style'))return;
        const s=document.createElement('style');s.id='arena-auth-style';s.textContent=`
          .arena-account{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-left:auto}
          .arena-account-status{font-size:12px;color:rgba(255,255,255,.68);max-width:230px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
          .arena-auth-btn{border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.05);color:#fff;border-radius:9px;padding:8px 12px;font-weight:800;cursor:pointer}
          .arena-auth-btn.primary{background:rgba(196,145,72,.2);border-color:rgba(196,145,72,.5)}
          .arena-auth-modal{position:fixed;inset:0;background:rgba(3,5,9,.78);backdrop-filter:blur(7px);display:flex;align-items:center;justify-content:center;padding:20px;z-index:99999}
          .arena-auth-card{width:min(440px,100%);background:#10131a;border:1px solid rgba(196,145,72,.35);border-radius:16px;box-shadow:0 25px 80px rgba(0,0,0,.6);padding:24px;color:#fff}
          .arena-auth-card h2{margin:0 0 7px;font-family:Cinzel,serif}.arena-auth-card p{color:rgba(255,255,255,.68);font-size:14px;line-height:1.5}
          .arena-auth-card label{display:block;font-size:12px;font-weight:800;margin:14px 0 6px;color:rgba(255,255,255,.75)}
          .arena-auth-card input{width:100%;box-sizing:border-box;background:#080b10;border:1px solid rgba(255,255,255,.14);color:#fff;border-radius:9px;padding:11px 12px}
          .arena-auth-actions{display:flex;gap:8px;margin-top:18px}.arena-auth-actions button{flex:1}
          .arena-auth-message{min-height:20px;margin-top:12px;font-size:13px;color:#d8bd8a}.arena-auth-close{background:transparent!important}
          @media(max-width:700px){.arena-account{width:100%;margin-left:0}.arena-account-status{max-width:180px}}
        `;document.head.appendChild(s)
      }

      function modal(){
        style();
        document.getElementById('arenaAuthModal')?.remove();
        const el=document.createElement('div');el.id='arenaAuthModal';el.className='arena-auth-modal';
        el.innerHTML=`<div class="arena-auth-card"><div class="eyebrow">CONTA GLOBAL</div><h2>Seu progresso, em qualquer lugar.</h2><p>Crie uma conta ou entre para salvar personagens, equipamentos, gold, skills e progresso da Arena no servidor.</p><label for="arenaAuthEmail">E-mail</label><input id="arenaAuthEmail" type="email" autocomplete="email" placeholder="voce@email.com"><label for="arenaAuthPassword">Senha</label><input id="arenaAuthPassword" type="password" autocomplete="current-password" placeholder="Mínimo de 6 caracteres"><div class="arena-auth-actions"><button class="arena-auth-btn primary" id="arenaLogin">Entrar</button><button class="arena-auth-btn" id="arenaSignup">Criar conta</button></div><div class="arena-auth-message" id="arenaAuthMessage"></div><div class="arena-auth-actions"><button class="arena-auth-btn arena-auth-close" id="arenaAuthClose">Continuar como visitante</button></div></div>`;
        document.body.appendChild(el);
        const msg=t=>{document.getElementById('arenaAuthMessage').textContent=t};
        const creds=()=>({email:document.getElementById('arenaAuthEmail').value.trim(),password:document.getElementById('arenaAuthPassword').value});
        document.getElementById('arenaLogin').onclick=async()=>{const {email,password}=creds();if(!email||password.length<6)return msg('Informe e-mail e senha (mínimo 6 caracteres).');msg('Entrando...');const {error}=await supabase.auth.signInWithPassword({email,password});if(error)return msg(error.message);await pullOrMigrate((await supabase.auth.getUser()).data.user);location.reload()};
        document.getElementById('arenaSignup').onclick=async()=>{const {email,password}=creds();if(!email||password.length<6)return msg('Informe e-mail e senha (mínimo 6 caracteres).');msg('Criando conta...');const {data,error}=await supabase.auth.signUp({email,password});if(error)return msg(error.message);if(data.session){await pullOrMigrate(data.user);location.reload()}else msg('Conta criada. Se o Supabase pedir confirmação, confira seu e-mail e depois entre.');};
        document.getElementById('arenaAuthClose').onclick=()=>el.remove();
      }

      function accountUI(){
        style();
        const top=document.querySelector('.game-topbar');if(!top)return;
        let box=document.getElementById('arenaAccount');
        if(!box){box=document.createElement('div');box.id='arenaAccount';box.className='arena-account';top.appendChild(box)}
        supabase.auth.getUser().then(({data})=>{
          const user=data.user;
          if(user){
            box.innerHTML=`<span class="arena-account-status" title="${user.email||''}">Conta: ${user.email||'conectada'}</span><button class="arena-auth-btn" id="arenaLogout">Sair</button>`;
            document.getElementById('saveNote').textContent='Progresso salvo na conta global';
            document.getElementById('arenaLogout').onclick=async()=>{await push();await supabase.auth.signOut();location.reload()};
          }else{
            box.innerHTML='<button class="arena-auth-btn primary" id="arenaOpenAuth">ENTRAR / CRIAR CONTA</button>';
            document.getElementById('saveNote').textContent='Visitante · progresso salvo neste navegador';
            document.getElementById('arenaOpenAuth').onclick=modal;
          }
        });
      }

      const session=(await supabase.auth.getSession()).data.session;
      if(session?.user)await pullOrMigrate(session.user);
      else if(!hasState(localState()))setLocalState({});
      resolve(true);

      setTimeout(accountUI,900);
      setInterval(async()=>{
        const user=(await supabase.auth.getUser()).data.user;
        if(!user)return;
        const state=localState(),serialized=JSON.stringify(state);
        if(serialized!==window.__arenaLastCloudState)await push();
      },4000);

      supabase.auth.onAuthStateChange((event)=>{
        if(event==='SIGNED_IN'||event==='SIGNED_OUT')setTimeout(()=>location.reload(),150);
      });
    }catch(e){
      console.error('Arena auth bootstrap:',e);
      resolve(false);
    }
  });
})();

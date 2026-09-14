(()=>{
  if(window.__malUpadosSiteAuth)return;
  window.__malUpadosSiteAuth=true;
  const SUPABASE_URL='https://qnfqeprgvmyapgagmcqf.supabase.co';
  const SUPABASE_KEY='sb_publishable_RmJoMDzSSqC46U1nNZR1XA_--7pm3y8';
  const CDN='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

  const style=()=>{
    if(document.getElementById('mal-site-auth-style'))return;
    const s=document.createElement('style');s.id='mal-site-auth-style';
    s.textContent=`
      .mal-account{display:flex;align-items:center;gap:8px;margin-left:14px;white-space:nowrap}
      .mal-account-btn{appearance:none;border:1px solid rgba(240,196,92,.38);background:rgba(240,196,92,.08);color:#f5f2ea;border-radius:8px;padding:8px 12px;font:800 12px Inter,sans-serif;cursor:pointer;transition:.18s}
      .mal-account-btn:hover{background:rgba(240,196,92,.16);border-color:rgba(240,196,92,.65)}
      .mal-account-btn.login{background:transparent;border-color:rgba(255,255,255,.15)}
      .mal-account-user{max-width:190px;overflow:hidden;text-overflow:ellipsis;color:rgba(255,255,255,.8);font:800 12px Inter,sans-serif}
      .mal-auth-modal{position:fixed;inset:0;z-index:100000;background:rgba(3,5,9,.82);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;padding:20px}
      .mal-auth-card{position:relative;width:min(430px,100%);box-sizing:border-box;background:#10131a;border:1px solid rgba(240,196,92,.34);border-radius:16px;box-shadow:0 28px 90px rgba(0,0,0,.65);padding:26px;color:#fff}
      .mal-auth-close{position:absolute;right:12px;top:10px;width:36px;height:36px;border:0;background:transparent;color:rgba(255,255,255,.65);font-size:27px;line-height:1;cursor:pointer;border-radius:8px}
      .mal-auth-close:hover{background:rgba(255,255,255,.07);color:#fff}
      .mal-auth-card h2{margin:4px 42px 8px 0;font-family:Cinzel,serif;font-size:26px}
      .mal-auth-card p{color:rgba(255,255,255,.68);font-size:14px;line-height:1.5;margin:0 0 18px}
      .mal-auth-tabs{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:16px}
      .mal-auth-tabs button{border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.035);color:rgba(255,255,255,.7);padding:10px;border-radius:8px;font-weight:800;cursor:pointer}
      .mal-auth-tabs button.active{background:rgba(240,196,92,.12);border-color:rgba(240,196,92,.4);color:#fff}
      .mal-auth-card label{display:block;font-size:12px;font-weight:800;margin:12px 0 6px;color:rgba(255,255,255,.76)}
      .mal-auth-card input{width:100%;box-sizing:border-box;background:#080b10;border:1px solid rgba(255,255,255,.14);color:#fff;border-radius:9px;padding:12px;font:500 14px Inter,sans-serif;outline:none}
      .mal-auth-card input:focus{border-color:rgba(240,196,92,.55)}
      .mal-auth-submit{width:100%;margin-top:18px}
      .mal-auth-message{min-height:20px;margin-top:12px;font-size:13px;color:#d8bd8a;line-height:1.45}
      .mal-auth-message.error{color:#e88d82}
      .mal-auth-success{text-align:center;padding:12px 4px 4px}
      .mal-auth-success .success-mark{font-size:42px;line-height:1;margin:4px 0 14px}
      .mal-auth-success h2{margin:0 0 10px}
      .mal-auth-success p{margin-bottom:20px}
      @media(max-width:850px){.mal-account{margin-left:0}.mal-account-user{max-width:130px}}
    `;document.head.appendChild(s)
  };

  const openModal=(mode='signup')=>{
    style();document.getElementById('malAuthModal')?.remove();
    const el=document.createElement('div');el.id='malAuthModal';el.className='mal-auth-modal';
    el.innerHTML='<div class="mal-auth-card" role="dialog" aria-modal="true" aria-labelledby="malAuthTitle"><button class="mal-auth-close" id="malAuthClose" aria-label="Fechar">×</button><div class="eyebrow">CONTA MAL UPADOS</div><div id="malAuthContent"></div></div>';
    document.body.appendChild(el);
    const $=id=>document.getElementById(id);let current=mode;

    const close=()=>el.remove();

    const renderUsernameRequired=()=>{
      $('malAuthContent').innerHTML='<div class="mal-auth-success" style="text-align:left"><h2 id="malAuthTitle">Escolha seu nome de usuário</h2><p>Esse nome aparecerá no topo do site no lugar do seu e-mail.</p><label for="malAuthUsername">Nome de usuário</label><input id="malAuthUsername" type="text" autocomplete="username" maxlength="24" placeholder="Ex: Texugo do mel"><button class="mal-account-btn mal-auth-submit" id="malAuthSaveUsername">SALVAR NOME</button><div class="mal-auth-message" id="malAuthMessage"></div></div>';
      $('malAuthSaveUsername').onclick=saveUsername;setTimeout(()=>$('malAuthUsername').focus(),30)
    };

    const saveUsername=async()=>{
      const input=$('malAuthUsername'),msg=$('malAuthMessage'),username=input.value.trim();
      if(!username||username.length<3){msg.textContent='Escolha um nome de usuário com pelo menos 3 caracteres.';msg.className='mal-auth-message error';input.focus();return}
      if(!/^[\p{L}\p{N}_ -]+$/u.test(username)){msg.textContent='Use apenas letras, números, espaços, _ ou -.';msg.className='mal-auth-message error';input.focus();return}
      $('malAuthSaveUsername').disabled=true;msg.textContent='Salvando...';
      const result=await window.malUpadosSupabase.auth.updateUser({data:{username}});
      if(result.error){msg.textContent=result.error.message;msg.className='mal-auth-message error';$('malAuthSaveUsername').disabled=false;return}
      close();window.dispatchEvent(new CustomEvent('mal-auth-changed',{detail:{user:result.data.user}}));
    };

    const renderSuccess=()=>{
      $('malAuthContent').innerHTML='<div class="mal-auth-success"><div class="success-mark">✓</div><h2 id="malAuthTitle">Conta criada</h2><p>Sua conta foi criada com sucesso. Agora entre para acessar sua conta.</p><button class="mal-account-btn mal-auth-submit" id="malAuthGoLogin">ENTRAR</button></div>';
      $('malAuthGoLogin').onclick=()=>{current='login';render()}
    };

    const submit=async()=>{
      if($('malAuthSubmit')?.disabled)return;
      const identifier=$('malAuthIdentifier').value.trim(),password=$('malAuthPassword').value;
      const username=current==='signup'?$('malAuthUsername').value.trim():'';
      const confirmPassword=current==='signup'?$('malAuthPasswordConfirm').value:'';
      const email=current==='signup'?identifier:'';const msg=$('malAuthMessage');

      if(current==='signup'&&(!username||username.length<3)){msg.textContent='Escolha um nome de usuário com pelo menos 3 caracteres.';msg.className='mal-auth-message error';$('malAuthUsername').focus();return}
      if(current==='signup'&&!/^[\p{L}\p{N}_ -]+$/u.test(username)){msg.textContent='Use apenas letras, números, espaços, _ ou -.';msg.className='mal-auth-message error';$('malAuthUsername').focus();return}
      if(current==='signup'&&(!email||!email.includes('@'))){msg.textContent='Informe um e-mail válido.';msg.className='mal-auth-message error';$('malAuthIdentifier').focus();return}
      if(password.length<6){msg.textContent='A senha precisa ter pelo menos 6 caracteres.';msg.className='mal-auth-message error';return}
      if(current==='signup'&&password!==confirmPassword){msg.textContent='As senhas não coincidem. Digite as duas senhas novamente.';msg.className='mal-auth-message error';$('malAuthPasswordConfirm').focus();return}

      $('malAuthSubmit').disabled=true;msg.textContent=current==='signup'?'Criando conta...':'Entrando...';
      let result;
      if(current==='signup'){
        result=await window.malUpadosSupabase.auth.signUp({email,password,options:{data:{username}}});
      }else if(identifier.includes('@')){
        result=await window.malUpadosSupabase.auth.signInWithPassword({email:identifier,password});
      }else{
        try{
          const response=await fetch(`${SUPABASE_URL}/functions/v1/login-username`,{method:'POST',headers:{'Content-Type':'application/json',apikey:SUPABASE_KEY},body:JSON.stringify({username:identifier,password})});
          const payload=await response.json().catch(()=>({}));
          if(!response.ok||!payload.session){result={error:{message:payload.error||'Usuário ou senha inválidos.'}}}
          else{
            const sessionResult=await window.malUpadosSupabase.auth.setSession({access_token:payload.session.access_token,refresh_token:payload.session.refresh_token});
            result={data:{user:payload.user||sessionResult.data.user},error:sessionResult.error}
          }
        }catch(e){result={error:{message:'Não foi possível entrar agora. Tente novamente.'}}}
      }

      if(result.error){msg.textContent=result.error.message;msg.className='mal-auth-message error';$('malAuthSubmit').disabled=false;return}
      if(current==='signup'){renderSuccess();return}
      if(!result.data?.user?.user_metadata?.username){renderUsernameRequired();return}
      close();window.dispatchEvent(new CustomEvent('mal-auth-changed',{detail:{user:result.data.user}}));
    };

    const render=()=>{
      if(current==='username'){renderUsernameRequired();return}
      const signup=current==='signup';
      $('malAuthContent').innerHTML=`<h2 id="malAuthTitle">${signup?'Criar sua conta':'Entrar na sua conta'}</h2><p id="malAuthIntro">${signup?'Seu progresso e sua conta ficam disponíveis em qualquer navegador ou dispositivo.':'Entre com seu e-mail ou nome de usuário para acessar seu progresso.'}</p><div class="mal-auth-tabs"><button id="malTabLogin" class="${signup?'':'active'}">Entrar</button><button id="malTabSignup" class="${signup?'active':''}">Criar conta</button></div>${signup?'<label for="malAuthUsername">Nome de usuário</label><input id="malAuthUsername" type="text" autocomplete="username" maxlength="24" placeholder="Ex: Texugo do mel">':''}<label for="malAuthIdentifier">${signup?'E-mail':'E-mail ou nome de usuário'}</label><input id="malAuthIdentifier" type="${signup?'email':'text'}" autocomplete="${signup?'email':'username'}" placeholder="${signup?'voce@email.com':'E-mail ou nome de usuário'}"><label for="malAuthPassword">Senha</label><input id="malAuthPassword" type="password" autocomplete="${signup?'new-password':'current-password'}" placeholder="Mínimo de 6 caracteres">${signup?'<label for="malAuthPasswordConfirm">Confirmar senha</label><input id="malAuthPasswordConfirm" type="password" autocomplete="new-password" placeholder="Digite a senha novamente">':''}<button class="mal-account-btn mal-auth-submit" id="malAuthSubmit">${signup?'CRIAR CONTA':'ENTRAR'}</button><div class="mal-auth-message" id="malAuthMessage"></div>`;
      $('malTabLogin').onclick=()=>{current='login';render()};$('malTabSignup').onclick=()=>{current='signup';render()};$('malAuthSubmit').onclick=submit;
      setTimeout(()=>$(signup?'malAuthUsername':'malAuthIdentifier').focus(),30)
    };

    $('malAuthClose').onclick=close;el.addEventListener('click',e=>{if(e.target===el)close()});el.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();close();return}if(e.key==='Enter'&&e.target.matches('input')){e.preventDefault();if($('malAuthSubmit'))submit();else if($('malAuthSaveUsername'))saveUsername()}});
    render();
  };

  const setupHeader=(supabase)=>{
    style();const nav=document.querySelector('header.top .nav');if(!nav)return false;
    let box=document.getElementById('malAccount');
    if(!box){box=document.createElement('div');box.id='malAccount';box.className='mal-account';nav.appendChild(box)}
    const draw=async()=>{
      const {data}=await supabase.auth.getUser();const user=data?.user;
      if(user){
        const username=(user.user_metadata?.username||'').trim();
        if(username){
          box.innerHTML=`<span class="mal-account-user" title="${username}">${username}</span><button class="mal-account-btn" id="malLogout">SAIR</button>`;
          document.getElementById('malLogout').onclick=async()=>{await supabase.auth.signOut();location.reload()}
        }else{
          box.innerHTML='<button class="mal-account-btn" id="malChooseUsername">ESCOLHER NOME</button><button class="mal-account-btn" id="malLogout">SAIR</button>';
          document.getElementById('malChooseUsername').onclick=()=>openModal('username');
          document.getElementById('malLogout').onclick=async()=>{await supabase.auth.signOut();location.reload()}
        }
      }else{
        box.innerHTML='<button class="mal-account-btn login" id="malLogin">ENTRAR</button><button class="mal-account-btn" id="malSignup">CRIAR CONTA</button>';
        document.getElementById('malLogin').onclick=()=>openModal('login');document.getElementById('malSignup').onclick=()=>openModal('signup')
      }
    };
    draw();supabase.auth.onAuthStateChange(()=>setTimeout(draw,50));window.addEventListener('mal-auth-open',e=>openModal(e.detail||'signup'));window.addEventListener('mal-auth-changed',draw);return true
  };

  (async()=>{try{const mod=await import(CDN);const supabase=mod.createClient(SUPABASE_URL,SUPABASE_KEY);window.malUpadosSupabase=supabase;setupHeader(supabase)}catch(e){console.error('Mal Upados account:',e)}})();
})();
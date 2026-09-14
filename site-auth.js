(()=>{
  if(window.__malUpadosSiteAuth)return;
  window.__malUpadosSiteAuth=true;
  const SUPABASE_URL='https://qnfqeprgvmyapgagmcqf.supabase.co';
  const SUPABASE_KEY='sb_publishable_RmJoMDzSSqC46U1nNZR1XA_--7pm3y8';
  const CDN='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
  const style=()=>{
    if(document.getElementById('mal-site-auth-style'))return;
    const s=document.createElement('style');s.id='mal-site-auth-style';s.textContent=`
      .mal-account{display:flex;align-items:center;gap:8px;margin-left:14px;white-space:nowrap}
      .mal-account-btn{appearance:none;border:1px solid rgba(240,196,92,.38);background:rgba(240,196,92,.08);color:#f5f2ea;border-radius:8px;padding:8px 12px;font:800 12px Inter,sans-serif;cursor:pointer;transition:.18s}
      .mal-account-btn:hover{background:rgba(240,196,92,.16);border-color:rgba(240,196,92,.65)}
      .mal-account-btn.login{background:transparent;border-color:rgba(255,255,255,.15)}
      .mal-account-user{max-width:190px;overflow:hidden;text-overflow:ellipsis;color:rgba(255,255,255,.72);font:600 12px Inter,sans-serif}
      .mal-auth-modal{position:fixed;inset:0;z-index:100000;background:rgba(3,5,9,.82);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;padding:20px}
      .mal-auth-card{position:relative;width:min(430px,100%);box-sizing:border-box;background:#10131a;border:1px solid rgba(240,196,92,.34);border-radius:16px;box-shadow:0 28px 90px rgba(0,0,0,.65);padding:26px;color:#fff}
      .mal-auth-close{position:absolute;right:12px;top:10px;width:36px;height:36px;border:0;background:transparent;color:rgba(255,255,255,.65);font-size:27px;line-height:1;cursor:pointer;border-radius:8px}
      .mal-auth-close:hover{background:rgba(255,255,255,.07);color:#fff}
      .mal-auth-card h2{margin:4px 42px 8px 0;font-family:Cinzel,serif;font-size:26px}.mal-auth-card p{color:rgba(255,255,255,.68);font-size:14px;line-height:1.5;margin:0 0 18px}
      .mal-auth-tabs{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:16px}.mal-auth-tabs button{border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.035);color:rgba(255,255,255,.7);padding:10px;border-radius:8px;font-weight:800;cursor:pointer}.mal-auth-tabs button.active{background:rgba(240,196,92,.12);border-color:rgba(240,196,92,.4);color:#fff}
      .mal-auth-card label{display:block;font-size:12px;font-weight:800;margin:12px 0 6px;color:rgba(255,255,255,.76)}
      .mal-auth-card input{width:100%;box-sizing:border-box;background:#080b10;border:1px solid rgba(255,255,255,.14);color:#fff;border-radius:9px;padding:12px;font:500 14px Inter,sans-serif;outline:none}.mal-auth-card input:focus{border-color:rgba(240,196,92,.55)}
      .mal-auth-submit{width:100%;margin-top:18px}.mal-auth-message{min-height:20px;margin-top:12px;font-size:13px;color:#d8bd8a;line-height:1.45}.mal-auth-message.error{color:#e88d82}
      @media(max-width:850px){.mal-account{margin-left:0}.mal-account-user{max-width:130px}}
    `;document.head.appendChild(s)
  };
  const openModal=(mode='signup')=>{
    style();document.getElementById('malAuthModal')?.remove();
    const el=document.createElement('div');el.id='malAuthModal';el.className='mal-auth-modal';
    el.innerHTML=`<div class="mal-auth-card" role="dialog" aria-modal="true" aria-labelledby="malAuthTitle"><button class="mal-auth-close" id="malAuthClose" aria-label="Fechar">×</button><div class="eyebrow">CONTA MAL UPADOS</div><h2 id="malAuthTitle"></h2><p id="malAuthIntro"></p><div class="mal-auth-tabs"><button id="malTabLogin">Entrar</button><button id="malTabSignup">Criar conta</button></div><label for="malAuthEmail">E-mail</label><input id="malAuthEmail" type="email" autocomplete="email" placeholder="voce@email.com"><label for="malAuthPassword">Senha</label><input id="malAuthPassword" type="password" autocomplete="current-password" placeholder="Mínimo de 6 caracteres"><button class="mal-account-btn mal-auth-submit" id="malAuthSubmit"></button><div class="mal-auth-message" id="malAuthMessage"></div></div>`;
    document.body.appendChild(el);
    const $=id=>document.getElementById(id);let current=mode;
    const render=()=>{const signup=current==='signup';$('malAuthTitle').textContent=signup?'Criar sua conta':'Entrar na sua conta';$('malAuthIntro').textContent=signup?'Seu progresso e sua conta ficam disponíveis em qualquer navegador ou dispositivo.':'Entre para acessar seu progresso global em qualquer navegador ou dispositivo.';$('malTabSignup').classList.toggle('active',signup);$('malTabLogin').classList.toggle('active',!signup);$('malAuthSubmit').textContent=signup?'CRIAR CONTA':'ENTRAR';$('malAuthPassword').autocomplete=signup?'new-password':'current-password';$('malAuthMessage').textContent='';$('malAuthMessage').className='mal-auth-message'};
    const close=()=>el.remove();$('malAuthClose').onclick=close;$('malTabLogin').onclick=()=>{current='login';render();$('malAuthEmail').focus()};$('malTabSignup').onclick=()=>{current='signup';render();$('malAuthEmail').focus()};el.addEventListener('click',e=>{if(e.target===el)close()});
    $('malAuthSubmit').onclick=async()=>{const email=$('malAuthEmail').value.trim(),password=$('malAuthPassword').value;if(!email||password.length<6){$('malAuthMessage').textContent='Informe um e-mail válido e uma senha com pelo menos 6 caracteres.';return}const msg=$('malAuthMessage');$('malAuthSubmit').disabled=true;msg.textContent=current==='signup'?'Criando conta...':'Entrando...';const result=current==='signup'?await window.malUpadosSupabase.auth.signUp({email,password}):await window.malUpadosSupabase.auth.signInWithPassword({email,password});if(result.error){msg.textContent=result.error.message;msg.className='mal-auth-message error';$('malAuthSubmit').disabled=false;return}if(current==='signup'&&!result.data.session){msg.textContent='Conta criada. Confira seu e-mail se a confirmação estiver habilitada e depois entre.';$('malAuthSubmit').disabled=false;return}close();window.dispatchEvent(new CustomEvent('mal-auth-changed',{detail:{user:result.data.user}}));};
    el.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();close()}});render();setTimeout(()=>$('malAuthEmail').focus(),30);
  };
  const setupHeader=(supabase)=>{
    style();const nav=document.querySelector('header.top .nav');if(!nav)return;let box=document.getElementById('malAccount');if(!box){box=document.createElement('div');box.id='malAccount';box.className='mal-account';nav.appendChild(box)}
    const draw=async()=>{const {data}=await supabase.auth.getUser();const user=data?.user;if(user){box.innerHTML=`<span class="mal-account-user" title="${user.email||''}">${user.email||'Conta conectada'}</span><button class="mal-account-btn" id="malLogout">SAIR</button>`;document.getElementById('malLogout').onclick=async()=>{await supabase.auth.signOut();location.reload()}}else{box.innerHTML='<button class="mal-account-btn login" id="malLogin">ENTRAR</button><button class="mal-account-btn" id="malSignup">CRIAR CONTA</button>';document.getElementById('malLogin').onclick=()=>openModal('login');document.getElementById('malSignup').onclick=()=>openModal('signup')}};
    draw();supabase.auth.onAuthStateChange(()=>setTimeout(draw,50));window.addEventListener('mal-auth-open',e=>openModal(e.detail||'signup'));
  };
  (async()=>{try{const mod=await import(CDN);const supabase=mod.createClient(SUPABASE_URL,SUPABASE_KEY);window.malUpadosSupabase=supabase;setupHeader(supabase)}catch(e){console.error('Mal Upados account:',e)}})();
})();

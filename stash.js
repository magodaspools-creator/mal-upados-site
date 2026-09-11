(function(){
  const filesInput=document.getElementById('stashFiles');
  const drop=document.getElementById('dropzone');
  const preview=document.getElementById('stashFilesPreview');
  const world=document.getElementById('stashWorld');
  const analyze=document.getElementById('analyzeBtn');
  let files=[];

  function esc(v){return String(v??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]))}
  function money(v){return v==null?'—':new Intl.NumberFormat('pt-BR').format(Math.round(v))+' gp'}

  async function loadWorlds(){
    try{
      const r=await fetch('https://api.tibiadata.com/v4/worlds?'+Date.now());
      if(!r.ok) throw Error();
      const d=await r.json();
      const list=d?.worlds?.regular_worlds||d?.worlds?.regular||d?.worlds||[];
      const arr=Array.isArray(list)?list:list.world||[];
      const names=arr.map(x=>typeof x==='string'?x:x.name).filter(Boolean).sort((a,b)=>a.localeCompare(b));
      world.innerHTML='<option value="">Selecione seu mundo</option>'+names.map(n=>`<option value="${esc(n)}">${esc(n)}</option>`).join('');
    }catch(e){
      world.innerHTML='<option value="">Não foi possível carregar</option>';
    }
  }

  function render(){
    preview.innerHTML='';
    files.forEach((file,i)=>{
      const url=URL.createObjectURL(file);
      const card=document.createElement('div');card.className='stash-thumb';
      card.innerHTML=`<button type="button" title="Remover">×</button><img src="${url}" alt="Print ${i+1}"><span>${esc(file.name)}</span>`;
      card.querySelector('button').onclick=()=>{files.splice(i,1);render()};
      preview.appendChild(card);
    });
  }
  function add(list){
    const incoming=[...list].filter(f=>/^image\/(png|jpeg|webp)$/.test(f.type));
    files=[...files,...incoming].slice(0,12);render();
  }
  filesInput.addEventListener('change',e=>add(e.target.files));
  drop.addEventListener('click',e=>{if(e.target.closest('button'))return;filesInput.click()});
  ['dragenter','dragover'].forEach(ev=>drop.addEventListener(ev,e=>{e.preventDefault();drop.classList.add('drag')}));
  ['dragleave','drop'].forEach(ev=>drop.addEventListener(ev,e=>{e.preventDefault();drop.classList.remove('drag')}));
  drop.addEventListener('drop',e=>add(e.dataTransfer.files));

  analyze.addEventListener('click',()=>{
    if(!world.value){alert('Escolha o mundo do personagem primeiro.');return}
    if(!files.length){alert('Envie pelo menos um print do Stash.');return}
    const result=document.getElementById('stashResult');
    result.innerHTML=`<strong>${files.length} print${files.length===1?'':'s'} recebido${files.length===1?'':'s'}.</strong><br><span class="stash-note">Mundo: ${esc(world.value)}. O próximo módulo vai reconhecer os sprites, consolidar quantidades e consultar NPC × Market Buy.</span>`;
    document.getElementById('npcTotal').textContent='—';
    document.getElementById('marketTotal').textContent='—';
    document.getElementById('bestTotal').textContent='—';
  });

  loadWorlds();
})();
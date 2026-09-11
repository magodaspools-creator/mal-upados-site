(function(){
  const filesInput=document.getElementById('stashFiles');
  const drop=document.getElementById('dropzone');
  const preview=document.getElementById('stashFilesPreview');
  const world=document.getElementById('stashWorld');
  const analyze=document.getElementById('analyzeBtn');
  const result=document.getElementById('stashResult');
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

  function loadImage(file){
    return new Promise((resolve,reject)=>{
      const img=new Image();
      img.onload=()=>resolve(img);
      img.onerror=reject;
      img.src=URL.createObjectURL(file);
    });
  }

  function luminance(r,g,b){return .2126*r+.7152*g+.0722*b}

  // The Stash grid is based on a fixed 37px slot pitch in an original Tibia screenshot.
  // We do NOT assume the monitor resolution or a fixed X/Y position. Instead we estimate
  // the repeating pitch from the image itself. This also lets us recognize scaled images
  // by measuring the pitch rather than hard-coding screen coordinates.
  function estimatePitch(canvas){
    const ctx=canvas.getContext('2d',{willReadFrequently:true});
    const maxW=1100;
    const scale=Math.min(1,maxW/canvas.width);
    const w=Math.max(1,Math.round(canvas.width*scale));
    const h=Math.max(1,Math.round(canvas.height*scale));
    const small=document.createElement('canvas');small.width=w;small.height=h;
    const sctx=small.getContext('2d',{willReadFrequently:true});
    sctx.drawImage(canvas,0,0,w,h);
    const data=sctx.getImageData(0,0,w,h).data;
    const col=new Float32Array(w), row=new Float32Array(h);
    for(let y=1;y<h-1;y++){
      let sum=0;
      for(let x=1;x<w-1;x++){
        const i=(y*w+x)*4, j=i-4;
        sum+=Math.abs(luminance(data[i],data[i+1],data[i+2])-luminance(data[j],data[j+1],data[j+2]));
      }
      row[y]=sum/(w-2);
    }
    for(let x=1;x<w-1;x++){
      let sum=0;
      for(let y=1;y<h-1;y++){
        const i=(y*w+x)*4, j=i-w*4;
        sum+=Math.abs(luminance(data[i],data[i+1],data[i+2])-luminance(data[j],data[j+1],data[j+2]));
      }
      col[x]=sum/(h-2);
    }

    function score(profile,p){
      let a=0,b=0,c=0;
      for(let i=p;i<profile.length;i++){
        a+=profile[i]; b+=profile[i-p]; c++;
      }
      if(!c)return 0;
      const ma=a/c, mb=b/c;
      let num=0,da=0,db=0;
      for(let i=p;i<profile.length;i++){
        const x=profile[i]-ma, y=profile[i-p]-mb;
        num+=x*y; da+=x*x; db+=y*y;
      }
      return num/Math.sqrt((da||1)*(db||1));
    }

    // Test pitches around the known 37px native grid and its likely display scales.
    const candidates=[];
    for(let p=18;p<=74;p++){
      const sx=score(col,p), sy=score(row,p);
      candidates.push({p,sx,sy,score:(sx+sy)/2});
    }
    candidates.sort((a,b)=>b.score-a.score);
    const best=candidates[0];
    const scaleGuess=best.p/37;
    const confidence=Math.max(0,Math.min(1,(best.score-.05)/.55));
    return {pitch:best.p/scale, rawPitch:best.p, scale:scaleGuess, confidence, width:w, height:h};
  }

  function buildDetectorPanel(){
    let p=document.getElementById('stashDetector');
    if(p)return p;
    p=document.createElement('div');
    p.id='stashDetector';
    p.className='panel';
    p.style.marginTop='14px';
    result.parentElement.insertBefore(p,result);
    return p;
  }

  async function inspectFile(file){
    const img=await loadImage(file);
    const c=document.createElement('canvas');c.width=img.naturalWidth;c.height=img.naturalHeight;
    const ctx=c.getContext('2d');ctx.drawImage(img,0,0);
    const d=estimatePitch(c);
    const nativeError=Math.abs(d.rawPitch-37);
    const likelyScale=d.rawPitch/37;
    const originalLikely=Math.abs(likelyScale-1)<.08;
    return {file,imgWidth:img.naturalWidth,imgHeight:img.naturalHeight,detector:d,nativeLikely:originalLikely,nativeError};
  }

  analyze.addEventListener('click',async()=>{
    if(!world.value){alert('Escolha o mundo do personagem primeiro.');return}
    if(!files.length){alert('Envie pelo menos um print do Stash.');return}

    analyze.disabled=true;
    analyze.textContent='Detectando grade…';
    result.innerHTML='<strong>Processando os prints…</strong><br><span class="stash-note">Estamos medindo a grade pela própria imagem. Nenhuma coordenada fixa de monitor é usada.</span>';

    try{
      const reports=[];
      for(const file of files) reports.push(await inspectFile(file));
      const detector=buildDetectorPanel();
      detector.innerHTML=`<div class="eyebrow">Detector de imagem</div><h3 style="margin:4px 0 12px">Grade encontrada sem depender da resolução</h3>${reports.map((r,i)=>{
        const d=r.detector;
        const pct=Math.round(d.confidence*100);
        const status=d.confidence>=.45?'Grade provável':'Baixa confiança';
        return `<div style="padding:12px 0;border-top:1px solid var(--line)"><strong>${i+1}. ${esc(r.file.name)}</strong><br><span class="stash-note">Imagem: ${r.imgWidth}×${r.imgHeight}px · passo estimado: ${d.rawPitch}px · escala relativa: ${d.scale.toFixed(2)}× · confiança: ${pct}% · ${status}</span></div>`;
      }).join('')}`;

      const good=reports.filter(r=>r.detector.confidence>=.45).length;
      result.innerHTML=`<strong>${files.length} print${files.length===1?'':'s'} analisado${files.length===1?'':'s'}.</strong><br><span class="stash-note">Mundo: ${esc(world.value)} · ${good}/${reports.length} imagens têm uma grade com confiança suficiente para a próxima etapa.</span><br><span class="stash-note">Próxima etapa: cortar os slots detectados, normalizar a escala e comparar os sprites dos itens. O sistema vai marcar incertezas para revisão em vez de inventar um item.</span>`;
      document.getElementById('npcTotal').textContent='—';
      document.getElementById('marketTotal').textContent='—';
      document.getElementById('bestTotal').textContent='—';
    }catch(e){
      console.error(e);
      result.innerHTML='<strong>Não consegui ler a imagem.</strong><br><span class="stash-note">Use o PNG original gerado pelo Tibia, sem redimensionar ou comprimir.</span>';
    }finally{
      analyze.disabled=false;
      analyze.textContent='Analisar Stash';
    }
  });

  loadWorlds();
})();
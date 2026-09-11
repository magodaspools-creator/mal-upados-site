(function(){
  const filesInput=document.getElementById('stashFiles');
  const drop=document.getElementById('dropzone');
  const preview=document.getElementById('stashFilesPreview');
  const world=document.getElementById('stashWorld');
  const analyze=document.getElementById('analyzeBtn');
  const result=document.getElementById('stashResult');
  let files=[];

  const esc=v=>String(v??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));

  async function loadWorlds(){
    try{
      const r=await fetch('https://api.tibiadata.com/v4/worlds?'+Date.now());
      if(!r.ok)throw Error();
      const d=await r.json();
      const list=d?.worlds?.regular_worlds||d?.worlds?.regular||d?.worlds||[];
      const arr=Array.isArray(list)?list:list.world||[];
      const names=arr.map(x=>typeof x==='string'?x:x.name).filter(Boolean).sort((a,b)=>a.localeCompare(b));
      world.innerHTML='<option value="">Selecione seu mundo</option>'+names.map(n=>`<option value="${esc(n)}">${esc(n)}</option>`).join('');
    }catch(e){world.innerHTML='<option value="">Não foi possível carregar</option>';}
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
  drop.addEventListener('click',e=>{if(!e.target.closest('button'))filesInput.click()});
  ['dragenter','dragover'].forEach(ev=>drop.addEventListener(ev,e=>{e.preventDefault();drop.classList.add('drag')}));
  ['dragleave','drop'].forEach(ev=>drop.addEventListener(ev,e=>{e.preventDefault();drop.classList.remove('drag')}));
  drop.addEventListener('drop',e=>add(e.dataTransfer.files));

  function loadImage(file){return new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=reject;img.src=URL.createObjectURL(file);});}
  function lum(r,g,b){return .2126*r+.7152*g+.0722*b;}

  // Fast pitch detector. The previous version called getImageData hundreds of times
  // for every candidate grid position, which could freeze the browser on large PNGs.
  // Here we downsample once and correlate one-dimensional edge profiles.
  function estimatePitch(canvas){
    const maxW=1000;
    const scale=Math.min(1,maxW/canvas.width);
    const w=Math.max(1,Math.round(canvas.width*scale));
    const h=Math.max(1,Math.round(canvas.height*scale));
    const small=document.createElement('canvas');small.width=w;small.height=h;
    const sctx=small.getContext('2d',{willReadFrequently:true});
    sctx.drawImage(canvas,0,0,w,h);
    const data=sctx.getImageData(0,0,w,h).data;
    const col=new Float32Array(w),row=new Float32Array(h);
    for(let y=1;y<h-1;y++){
      let sum=0;
      for(let x=1;x<w;x++){
        const i=(y*w+x)*4,j=i-4;
        sum+=Math.abs(lum(data[i],data[i+1],data[i+2])-lum(data[j],data[j+1],data[j+2]));
      }
      row[y]=sum/(w-1);
    }
    for(let x=1;x<w-1;x++){
      let sum=0;
      for(let y=1;y<h;y++){
        const i=(y*w+x)*4,j=i-w*4;
        sum+=Math.abs(lum(data[i],data[i+1],data[i+2])-lum(data[j],data[j+1],data[j+2]));
      }
      col[x]=sum/(h-1);
    }
    function corr(a,p){
      let ma=0,mb=0,n=a.length-p;
      if(n<20)return 0;
      for(let i=p;i<a.length;i++){ma+=a[i];mb+=a[i-p];}
      ma/=n;mb/=n;
      let num=0,da=0,db=0;
      for(let i=p;i<a.length;i++){const x=a[i]-ma,y=a[i-p]-mb;num+=x*y;da+=x*x;db+=y*y;}
      return num/Math.sqrt((da||1)*(db||1));
    }
    let best={p:37,score:-1};
    for(let p=20;p<=60;p++){
      const score=(corr(col,p)+corr(row,p))/2;
      if(score>best.score)best={p,score};
    }
    const confidence=Math.max(0,Math.min(1,(best.score-.08)/.55));
    return {pitch:best.p/scale,rawPitch:best.p,scale:best.p/37,confidence};
  }

  function findGrid(canvas,pitch){
    const ctx=canvas.getContext('2d',{willReadFrequently:true});
    const slot=Math.max(12,Math.round(pitch*.86));
    const configs=[{cols:10,rows:22},{cols:11,rows:20}];
    let best=null;
    for(const cfg of configs){
      const gw=cfg.cols*pitch,gh=cfg.rows*pitch;
      if(gw>canvas.width||gh>canvas.height)continue;
      const step=Math.max(8,Math.round(pitch/2));
      // Sample only a small number of positions. The old implementation evaluated
      // every pixel-scale offset and became prohibitively expensive.
      for(let y=0;y+gh<=canvas.height;y+=step){
        for(let x=0;x+gw<=canvas.width;x+=step){
          let total=0,active=0;
          for(let r=0;r<cfg.rows;r+=2){
            for(let c=0;c<cfg.cols;c+=2){
              const sx=Math.round(x+c*pitch+(pitch-slot)/2);
              const sy=Math.round(y+r*pitch+(pitch-slot)/2);
              const d=ctx.getImageData(sx,sy,slot,slot).data;
              let sum=0,sum2=0,n=d.length/4;
              for(let i=0;i<d.length;i+=4){const v=lum(d[i],d[i+1],d[i+2]);sum+=v;sum2+=v*v;}
              const sd=Math.sqrt(Math.max(0,sum2/n-(sum/n)*(sum/n)));
              total+=sd;if(sd>18)active++;
            }
          }
          const samples=Math.ceil(cfg.rows/2)*Math.ceil(cfg.cols/2);
          const density=active/samples;
          if(density<.03||density>.99)continue;
          const score=total/samples+density*35;
          if(!best||score>best.score)best={...cfg,x,y,pitch,score,density};
        }
      }
    }
    return best;
  }

  function makePanel(id,title){
    let p=document.getElementById(id);
    if(p)return p;
    p=document.createElement('div');p.id=id;p.className='panel';p.style.marginTop='14px';
    result.parentElement.insertBefore(p,result);return p;
  }

  async function inspect(file){
    const img=await loadImage(file);
    const c=document.createElement('canvas');c.width=img.naturalWidth;c.height=img.naturalHeight;
    c.getContext('2d').drawImage(img,0,0);
    const d=estimatePitch(c);
    const g=findGrid(c,d.pitch);
    return {file,img,c,d,g};
  }

  function drawGrid(report,panel,index){
    const g=report.g;
    const block=document.createElement('div');
    block.style.cssText='margin-top:14px;padding-top:14px;border-top:1px solid var(--line)';
    if(!g){block.innerHTML=`<strong>Print ${index+1}</strong><br><span class="stash-note">Não encontrei uma grade confiável nesta imagem.</span>`;panel.appendChild(block);return;}
    block.innerHTML=`<strong>Print ${index+1}</strong><br><span class="stash-note">${g.cols}×${g.rows} slots · passo ${Math.round(g.pitch)}px · confiança da grade ${Math.round(report.d.confidence*100)}%</span>`;
    const grid=document.createElement('div');
    grid.style.cssText=`display:grid;grid-template-columns:repeat(${g.cols},32px);gap:3px;margin-top:10px;max-height:360px;overflow:auto;padding:6px;background:#080a0d;border:1px solid var(--line);border-radius:10px`;
    const ctx=report.c.getContext('2d');
    for(let n=0;n<g.cols*g.rows;n++){
      const col=n%g.cols,row=Math.floor(n/g.cols);
      const sx=Math.round(g.x+col*g.pitch+(g.pitch-g.pitch*.86)/2);
      const sy=Math.round(g.y+row*g.pitch+(g.pitch-g.pitch*.86)/2);
      const tile=document.createElement('canvas');tile.width=32;tile.height=32;tile.title=`Slot ${n+1}`;
      tile.style.cssText='width:32px;height:32px;image-rendering:pixelated;border:1px solid rgba(255,255,255,.08);background:#111';
      tile.getContext('2d').drawImage(report.c,sx,sy,Math.round(g.pitch*.86),Math.round(g.pitch*.86),0,0,32,32);
      grid.appendChild(tile);
    }
    block.appendChild(grid);panel.appendChild(block);
  }

  analyze.addEventListener('click',async()=>{
    if(!world.value){alert('Escolha o mundo do personagem primeiro.');return;}
    if(!files.length){alert('Envie pelo menos um print do Stash.');return;}
    analyze.disabled=true;analyze.textContent='Analisando…';
    result.innerHTML='<strong>Lendo o print…</strong><br><span class="stash-note">Detectando a grade sem travar a página.</span>';
    try{
      const reports=[];
      for(const file of files){reports.push(await inspect(file));await new Promise(r=>setTimeout(r,0));}
      const detector=makePanel('stashDetector');
      detector.innerHTML='<div class="eyebrow">Scanner</div><h3 style="margin:4px 0 8px">Grade do Stash detectada</h3><p class="stash-note">A grade é localizada pela própria imagem. Os recortes abaixo são a entrada do reconhecimento de sprites.</p>';
      reports.forEach((r,i)=>drawGrid(r,detector,i));
      window.__stashReports=reports;
      const good=reports.filter(r=>r.g).length;
      result.innerHTML=`<strong>${files.length} print${files.length===1?'':'s'} processado${files.length===1?'':'s'}.</strong><br><span class="stash-note">Mundo: ${esc(world.value)} · ${good}/${reports.length} grades localizadas.</span><br><span class="stash-note">A próxima camada deve comparar cada recorte com sprites reais, exatamente no modelo usado pelo TibiaCardinal/Tibia do Zero: sem chute quando houver ambiguidade.</span>`;
      document.getElementById('npcTotal').textContent='—';document.getElementById('marketTotal').textContent='—';document.getElementById('bestTotal').textContent='—';
    }catch(e){console.error(e);result.innerHTML='<strong>Falha ao analisar a imagem.</strong><br><span class="stash-note">Use o PNG original do Tibia, sem redimensionar.</span>'}
    finally{analyze.disabled=false;analyze.textContent='Analisar Stash';}
  });
  loadWorlds();
})();
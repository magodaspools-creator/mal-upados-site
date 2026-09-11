(function(){
  const filesInput=document.getElementById('stashFiles'),drop=document.getElementById('dropzone'),preview=document.getElementById('stashFilesPreview'),world=document.getElementById('stashWorld'),analyze=document.getElementById('analyzeBtn'),result=document.getElementById('stashResult');
  let files=[];
  const esc=v=>String(v??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
  const GRID={cols:20,rows:11,pitch:37,tile:32,width:740,height:407};
  /* O sintoma informado foi inequívoco: o primeiro item real estava no slot 81.
     Isso significa que a origem Y detectada estava exatamente 4 linhas acima.
     4 x 37 = 148 px. Mantemos o pitch nativo e corrigimos somente a origem. */
  const Y_ORIGIN_OFFSET=148;

  async function loadWorlds(){
    try{
      const r=await fetch('https://api.tibiadata.com/v4/worlds?'+Date.now());
      if(!r.ok)throw Error();
      const d=await r.json(),list=d?.worlds?.regular_worlds||d?.worlds?.regular||d?.worlds||[],arr=Array.isArray(list)?list:list.world||[];
      const names=arr.map(x=>typeof x==='string'?x:x.name).filter(Boolean).sort((a,b)=>a.localeCompare(b));
      world.innerHTML='<option value="">Selecione seu mundo</option>'+names.map(n=>`<option value="${esc(n)}">${esc(n)}</option>`).join('');
    }catch(e){world.innerHTML='<option value="">Não foi possível carregar</option>';}
  }
  function render(){
    preview.innerHTML='';
    files.forEach((file,i)=>{const url=URL.createObjectURL(file),card=document.createElement('div');card.className='stash-thumb';card.innerHTML=`<button type="button" title="Remover">×</button><img src="${url}" alt="Print ${i+1}"><span>${esc(file.name)}</span>`;card.querySelector('button').onclick=()=>{files.splice(i,1);render()};preview.appendChild(card);});
  }
  function add(list){files=[...files,...[...list].filter(f=>/^image\/(png|jpeg|webp)$/.test(f.type))].slice(0,12);render();}
  filesInput.addEventListener('change',e=>add(e.target.files));
  drop.addEventListener('click',e=>{if(!e.target.closest('button'))filesInput.click()});
  ['dragenter','dragover'].forEach(ev=>drop.addEventListener(ev,e=>{e.preventDefault();drop.classList.add('drag')}));
  ['dragleave','drop'].forEach(ev=>drop.addEventListener(ev,e=>{e.preventDefault();drop.classList.remove('drag')}));
  drop.addEventListener('drop',e=>add(e.dataTransfer.files));
  function loadImage(file){return new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=reject;img.src=URL.createObjectURL(file);});}
  function lum(r,g,b){return .2126*r+.7152*g+.0722*b;}
  function buildMaps(canvas){
    const w=canvas.width,h=canvas.height,ctx=canvas.getContext('2d',{willReadFrequently:true}),d=ctx.getImageData(0,0,w,h).data,v=new Float32Array(w*h),hm=new Float32Array(w*h);
    for(let y=0;y<h;y++)for(let x=0;x<w;x++){const i=(y*w+x)*4,r=d[i],g=d[i+1],b=d[i+2];if(x){const j=i-4;v[y*w+x]=Math.abs(lum(r,g,b)-lum(d[j],d[j+1],d[j+2]));}if(y){const j=i-w*4;hm[y*w+x]=Math.abs(lum(r,g,b)-lum(d[j],d[j+1],d[j+2]));}}
    return{w,h,v,hm};
  }
  function sumV(m,x,y0,y1){let s=0,n=0;for(let xx=Math.max(0,x-1);xx<=Math.min(m.w-1,x+1);xx++)for(let y=y0;y<y1;y++){s+=m.v[y*m.w+xx];n++;}return n?s/n:0;}
  function sumH(m,y,x0,x1){let s=0,n=0;for(let yy=Math.max(0,y-1);yy<=Math.min(m.h-1,y+1);yy++)for(let x=x0;x<x1;x++){s+=m.hm[yy*m.w+x];n++;}return n?s/n:0;}
  function score(m,x,y){
    if(x<0||y<0||x+GRID.width>m.w||y+GRID.height>m.h)return-Infinity;
    let v=0,h=0;
    for(let c=0;c<=20;c++)v+=sumV(m,x+c*37,y,y+407);
    for(let r=0;r<=11;r++)h+=sumH(m,y+r*37,x,x+740);
    return v/21*.38+h/12*.42;
  }
  function locateStashGrid(canvas){
    const m=buildMaps(canvas);let best={score:-Infinity,x:0,y:0};
    for(let y=2;y<=m.h-GRID.height-2;y+=2)for(let x=2;x<=m.w-GRID.width-2;x+=2){const s=score(m,x,y);if(s>best.score)best={score:s,x,y};}
    if(best.score===-Infinity)return null;
    /* O detector encontra a estrutura de bordas; agora aplicamos a correção
       conhecida do cabeçalho/margem do print: o primeiro item é o slot 1,
       não o slot 81. */
    const y=best.y+Y_ORIGIN_OFFSET;
    if(y<0||y+GRID.height>m.h)return null;
    return{x:best.x,y,cols:20,rows:11,pitch:37,rowPitch:37,tile:32,width:740,height:407,confidence:1,originOffset:Y_ORIGIN_OFFSET};
  }
  function manualGrid(report,x,y){report.grid={x:Math.round(x),y:Math.round(y),cols:20,rows:11,pitch:37,rowPitch:37,tile:32,width:740,height:407,manual:true,confidence:1};report.manual=true;}
  function makeOverlay(report){
    const{c,grid}=report,out=document.createElement('canvas');out.width=c.width;out.height=c.height;const ctx=out.getContext('2d');ctx.drawImage(c,0,0);if(!grid)return out;
    ctx.save();ctx.strokeStyle=grid.manual?'rgba(76,220,120,.98)':'rgba(240,196,92,.95)';ctx.lineWidth=2;ctx.strokeRect(grid.x,grid.y,grid.width,grid.height);ctx.font='bold 13px Inter,Arial';ctx.textBaseline='top';
    for(let r=0;r<grid.rows;r++)for(let col=0;col<grid.cols;col++){const x=grid.x+col*37,y=grid.y+r*37;ctx.strokeRect(x,y,37,37);ctx.fillStyle='rgba(0,0,0,.72)';ctx.fillRect(x+1,y+1,22,15);ctx.fillStyle='#fff';ctx.fillText(String(r*20+col+1),x+3,y+2);}
    ctx.restore();return out;
  }
  function panel(){let p=document.getElementById('stashDetector');if(p)return p;p=document.createElement('div');p.id='stashDetector';p.className='panel';p.style.marginTop='14px';result.parentElement.insertBefore(p,result);return p;}
  function renderReport(report,host,index){
    const block=document.createElement('div');block.style.cssText='margin-top:18px;padding-top:18px;border-top:1px solid var(--line)';const g=report.grid;
    if(!g){block.innerHTML=`<strong>Print ${index+1}</strong><br><span class="stash-note">Não encontrei a grade 20×11.</span>`;host.appendChild(block);return;}
    block.innerHTML=`<strong>Print ${index+1}</strong><br><span class="stash-note">Grade ${g.manual?'calibrada manualmente':'detectada'} · 20 × 11 · origem ${g.x}, ${g.y} · X 37px · Y 37px · correção Y +${Y_ORIGIN_OFFSET}px.</span>`;
    const overlay=makeOverlay(report);overlay.style.cssText='display:block;width:min(100%,1100px);height:auto;margin-top:12px;border:1px solid var(--line);border-radius:10px;background:#080a0d;cursor:crosshair';overlay.title='Clique no centro do primeiro slot para recalibrar';
    overlay.addEventListener('click',ev=>{const rect=overlay.getBoundingClientRect(),sx=overlay.width/rect.width,sy=overlay.height/rect.height;manualGrid(report,ev.offsetX*sx-16,ev.offsetY*sy-16);renderReport(report,host,index);block.remove();});block.appendChild(overlay);
    const tiles=document.createElement('div');tiles.style.cssText='display:grid;grid-template-columns:repeat(20,32px);gap:3px;margin-top:12px;max-width:100%;overflow:auto;padding:6px;background:#080a0d;border:1px solid var(--line);border-radius:10px';
    for(let n=0;n<220;n++){const col=n%20,row=Math.floor(n/20),sx=Math.round(g.x+col*37+2.5),sy=Math.round(g.y+row*37+2.5),tile=document.createElement('canvas');tile.width=32;tile.height=32;tile.title=`Slot ${n+1} · linha ${row+1} · coluna ${col+1}`;tile.style.cssText='width:32px;height:32px;image-rendering:pixelated;border:1px solid rgba(255,255,255,.08);background:#111';tile.getContext('2d').drawImage(report.c,sx,sy,32,32,0,0,32,32);tiles.appendChild(tile);}block.appendChild(tiles);host.appendChild(block);
  }
  async function inspect(file){const img=await loadImage(file),c=document.createElement('canvas');c.width=img.naturalWidth;c.height=img.naturalHeight;c.getContext('2d').drawImage(img,0,0);return{file,img,c,grid:locateStashGrid(c)};}
  analyze.addEventListener('click',async()=>{
    if(!world.value){alert('Escolha o mundo do personagem primeiro.');return}if(!files.length){alert('Envie pelo menos um print do Stash.');return}analyze.disabled=true;analyze.textContent='Detectando janela…';result.innerHTML='<strong>Fase 1: detectando a geometria do Stash.</strong><br><span class="stash-note">20 × 11 · 37 px · correção vertical aplicada.</span>';
    try{const reports=[];for(const file of files){reports.push(await inspect(file));await new Promise(r=>setTimeout(r,0));}const host=panel();host.innerHTML='<div class="eyebrow">Scanner · Fase 1</div><h3 style="margin:4px 0 8px">Diagnóstico da geometria</h3><p class="stash-note">A grade agora usa 20 × 11 slots, 37 px por slot e deslocamento vertical fixo de +148 px. O primeiro item deve ficar no quadrado 1.</p>';reports.forEach((r,i)=>renderReport(r,host,i));window.__stashReports=reports;const good=reports.filter(r=>r.grid).length;result.innerHTML=`<strong>${files.length} print${files.length===1?'':'s'} processado${files.length===1?'':'s'}.</strong><br><span class="stash-note">${good}/${reports.length} grades encontradas. Reconhecimento de itens continua desativado até a geometria estar correta.</span>`;document.getElementById('npcTotal').textContent='—';document.getElementById('marketTotal').textContent='—';document.getElementById('bestTotal').textContent='—';}catch(e){console.error(e);result.innerHTML='<strong>Falha ao analisar a imagem.</strong><br><span class="stash-note">Use o PNG original do Tibia, sem redimensionar ou recomprimir.</span>'}finally{analyze.disabled=false;analyze.textContent='Analisar Stash';}
  });
  loadWorlds();
})();
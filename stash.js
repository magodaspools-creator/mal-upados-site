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
  function add(list){files=[...files,...[...list].filter(f=>/^image\/(png|jpeg|webp)$/.test(f.type))].slice(0,12);render();}
  filesInput.addEventListener('change',e=>add(e.target.files));
  drop.addEventListener('click',e=>{if(!e.target.closest('button'))filesInput.click()});
  ['dragenter','dragover'].forEach(ev=>drop.addEventListener(ev,e=>{e.preventDefault();drop.classList.add('drag')}));
  ['dragleave','drop'].forEach(ev=>drop.addEventListener(ev,e=>{e.preventDefault();drop.classList.remove('drag')}));
  drop.addEventListener('drop',e=>add(e.dataTransfer.files));

  function loadImage(file){return new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=reject;img.src=URL.createObjectURL(file);});}
  function lum(r,g,b){return .2126*r+.7152*g+.0722*b;}

  /*
   * FASE 1 — GEOMETRIA.
   *
   * Não tentamos reconhecer item aqui.
   * O cliente do Tibia trabalha em escala nativa e a grade do Stash usa
   * passo de 37 px. O problema anterior era procurar uma grade arbitrária
   * em toda a imagem e depois redimensionar a busca. Agora trabalhamos no
   * PNG original e procuramos a assinatura periódica de 20 x 11 células.
   *
   * 20 colunas x 11 linhas = 220 slots.
   * O sprite útil de cada célula será extraído depois em 32 x 32.
   */
  const GRID={cols:20,rows:11,pitch:37,tile:32};

  function buildEdgeMaps(canvas){
    const w=canvas.width,h=canvas.height;
    const ctx=canvas.getContext('2d',{willReadFrequently:true});
    const data=ctx.getImageData(0,0,w,h).data;
    const v=new Float32Array(w*h);
    const hmap=new Float32Array(w*h);
    for(let y=0;y<h;y++){
      for(let x=1;x<w;x++){
        const a=(y*w+x)*4,b=(y*w+x-1)*4;
        const dl=Math.abs(lum(data[a],data[a+1],data[a+2])-lum(data[b],data[b+1],data[b+2]));
        v[y*w+x]=dl;
      }
    }
    for(let y=1;y<h;y++){
      for(let x=0;x<w;x++){
        const a=(y*w+x)*4,b=((y-1)*w+x)*4;
        const dl=Math.abs(lum(data[a],data[a+1],data[a+2])-lum(data[b],data[b+1],data[b+2]));
        hmap[y*w+x]=dl;
      }
    }
    return {w,h,v,hmap};
  }

  function columnIntegral(map){
    const {w,h}=map;
    const out=new Float32Array(w*(h+1));
    for(let x=0;x<w;x++){
      let s=0;
      const base=x*(h+1);
      for(let y=0;y<h;y++){s+=map[y*w+x];out[base+y+1]=s;}
    }
    return out;
  }

  function rowIntegral(map){
    const {w,h}=map;
    const out=new Float32Array(h*(w+1));
    for(let y=0;y<h;y++){
      let s=0;
      const base=y*(w+1),src=y*w;
      for(let x=0;x<w;x++){s+=map[src+x];out[base+x+1]=s;}
    }
    return out;
  }

  function colSum(integral,h,x,y0,y1){
    if(x<0)return 0;
    const base=x*(h+1);
    return integral[base+y1]-integral[base+y0];
  }
  function rowSum(integral,w,y,x0,x1){
    if(y<0)return 0;
    const base=y*(w+1);
    return integral[base+x1]-integral[base+x0];
  }

  function locateStashGrid(canvas){
    const {w,h,v,hmap}=buildEdgeMaps(canvas);
    const vi=columnIntegral(v,h);
    const hi=rowIntegral(hmap,w);
    const gw=GRID.cols*GRID.pitch;
    const gh=GRID.rows*GRID.pitch;
    if(w<gw+20||h<gh+20)return null;

    let candidates=[];
    const xStart=4,xEnd=w-gw-4,yStart=4,yEnd=h-gh-4;

    /*
     * Primeiro encontramos picos periódicos nas bordas verticais e horizontais.
     * A integral torna a busca barata: não percorremos milhares de pixels para
     * cada candidato. Isso também elimina a dependência do conteúdo dos itens.
     */
    for(let y=yStart;y<=yEnd;y+=2){
      for(let x=xStart;x<=xEnd;x+=2){
        let vs=0,hs=0;
        for(let c=0;c<=GRID.cols;c++){
          const xx=x+c*GRID.pitch;
          vs+=colSum(vi,h,xx,y,y+gh);
        }
        for(let r=0;r<=GRID.rows;r++){
          const yy=y+r*GRID.pitch;
          hs+=rowSum(hi,w,yy,x,x+gw);
        }
        const vnorm=vs/((GRID.cols+1)*gh);
        const hnorm=hs/((GRID.rows+1)*gw);
        const score=vnorm*0.9+hnorm*1.1;
        candidates.push({x,y,score,vnorm,hnorm});
      }
    }

    candidates.sort((a,b)=>b.score-a.score);
    candidates=candidates.slice(0,80);

    /* Reclassifica os melhores candidatos procurando uma assinatura de painel:
       bordas fortes e relativamente contínuas nas quatro extremidades. */
    let best=null;
    for(const c of candidates){
      const top=rowSum(hi,w,c.y,c.x,c.x+gw)/gw;
      const bottom=rowSum(hi,w,c.y+gh,c.x,c.x+gw)/gw;
      const left=colSum(vi,h,c.x,c.y,c.y+gh)/gh;
      const right=colSum(vi,h,c.x+gw,c.y,c.y+gh)/gh;
      const border=(top+bottom+left+right)/4;
      const finalScore=c.score+border*0.75;
      if(!best||finalScore>best.score)best={...c,score:finalScore,top,bottom,left,right};
    }
    if(!best)return null;
    return {...best,cols:GRID.cols,rows:GRID.rows,pitch:GRID.pitch,tile:GRID.tile,width:gw,height:gh};
  }

  function makeOverlay(report){
    const {c,grid}=report;
    const out=document.createElement('canvas');
    out.width=c.width;out.height=c.height;
    const ctx=out.getContext('2d');ctx.drawImage(c,0,0);
    if(!grid)return out;
    ctx.save();
    ctx.strokeStyle='rgba(240,196,92,.95)';ctx.lineWidth=2;
    ctx.strokeRect(grid.x,grid.y,grid.width,grid.height);
    ctx.font='bold 13px Inter,Arial';ctx.textBaseline='top';
    for(let r=0;r<grid.rows;r++)for(let col=0;col<grid.cols;col++){
      const x=grid.x+col*grid.pitch,y=grid.y+r*grid.pitch;
      ctx.strokeRect(x,y,grid.pitch,grid.pitch);
      ctx.fillStyle='rgba(0,0,0,.72)';ctx.fillRect(x+1,y+1,22,15);
      ctx.fillStyle='#fff';ctx.fillText(String(r*grid.cols+col+1),x+3,y+2);
    }
    ctx.restore();
    return out;
  }

  function panel(){
    let p=document.getElementById('stashDetector');
    if(p)return p;
    p=document.createElement('div');p.id='stashDetector';p.className='panel';p.style.marginTop='14px';
    result.parentElement.insertBefore(p,result);return p;
  }

  async function inspect(file){
    const img=await loadImage(file);
    const c=document.createElement('canvas');c.width=img.naturalWidth;c.height=img.naturalHeight;
    c.getContext('2d').drawImage(img,0,0);
    return {file,img,c,grid:locateStashGrid(c)};
  }

  function showReport(report,host,index){
    const block=document.createElement('div');
    block.style.cssText='margin-top:18px;padding-top:18px;border-top:1px solid var(--line)';
    const g=report.grid;
    if(!g){
      block.innerHTML=`<strong>Print ${index+1}</strong><br><span class="stash-note">Não encontrei uma assinatura confiável de grade 20×11 em escala nativa.</span>`;
      host.appendChild(block);return;
    }
    block.innerHTML=`<strong>Print ${index+1}</strong><br><span class="stash-note">Grade detectada: ${g.cols} × ${g.rows} · origem ${g.x}, ${g.y} · passo ${g.pitch}px · área ${g.width}×${g.height}px.</span>`;
    const overlay=makeOverlay(report);
    overlay.style.cssText='display:block;width:min(100%,1100px);height:auto;margin-top:12px;border:1px solid var(--line);border-radius:10px;background:#080a0d;image-rendering:auto';
    overlay.title='Diagnóstico: amarelo = grade detectada';
    block.appendChild(overlay);

    const tiles=document.createElement('div');
    tiles.style.cssText='display:grid;grid-template-columns:repeat(20,32px);gap:3px;margin-top:12px;max-width:100%;overflow:auto;padding:6px;background:#080a0d;border:1px solid var(--line);border-radius:10px';
    for(let n=0;n<220;n++){
      const col=n%20,row=Math.floor(n/20);
      const sx=Math.round(g.x+col*g.pitch+(g.pitch-GRID.tile)/2);
      const sy=Math.round(g.y+row*g.pitch+(g.pitch-GRID.tile)/2);
      const tile=document.createElement('canvas');tile.width=32;tile.height=32;
      tile.title=`Slot ${n+1} · linha ${row+1} · coluna ${col+1}`;
      tile.style.cssText='width:32px;height:32px;image-rendering:pixelated;border:1px solid rgba(255,255,255,.08);background:#111';
      tile.getContext('2d').drawImage(report.c,sx,sy,32,32,0,0,32,32);
      tiles.appendChild(tile);
    }
    block.appendChild(tiles);
    host.appendChild(block);
  }

  analyze.addEventListener('click',async()=>{
    if(!world.value){alert('Escolha o mundo do personagem primeiro.');return}
    if(!files.length){alert('Envie pelo menos um print do Stash.');return}
    analyze.disabled=true;analyze.textContent='Detectando janela…';
    result.innerHTML='<strong>Fase 1: detectando a geometria do Stash.</strong><br><span class="stash-note">PNG original · escala nativa · 20 colunas × 11 linhas · passo de 37 px. Ainda não estamos tentando adivinhar itens.</span>';
    try{
      const reports=[];
      for(const file of files){reports.push(await inspect(file));await new Promise(r=>setTimeout(r,0));}
      const host=panel();
      host.innerHTML='<div class="eyebrow">Scanner · Fase 1</div><h3 style="margin:4px 0 8px">Diagnóstico da geometria</h3><p class="stash-note">O amarelo mostra exatamente onde o algoritmo acredita que está a grade. Só avançaremos para reconhecimento de sprites quando essa caixa estiver alinhada com o Stash real.</p>';
      reports.forEach((r,i)=>showReport(r,host,i));
      window.__stashReports=reports;
      const good=reports.filter(r=>r.grid).length;
      result.innerHTML=`<strong>${files.length} print${files.length===1?'':'s'} processado${files.length===1?'':'s'}.</strong><br><span class="stash-note">${good}/${reports.length} grades encontradas. Reconhecimento de itens ainda não foi ativado de propósito.</span>`;
      document.getElementById('npcTotal').textContent='—';
      document.getElementById('marketTotal').textContent='—';
      document.getElementById('bestTotal').textContent='—';
    }catch(e){
      console.error(e);
      result.innerHTML='<strong>Falha ao analisar a imagem.</strong><br><span class="stash-note">Use o PNG original do Tibia, sem redimensionar ou recomprimir.</span>';
    }finally{
      analyze.disabled=false;analyze.textContent='Analisar Stash';
    }
  });
  loadWorlds();
})();
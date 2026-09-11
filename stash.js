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
   * O 37px é o passo nativo descrito pelo TibiaStash, mas NÃO usamos mais
   * 37px como tamanho absoluto da janela nem como escala da imagem.
   *
   * O problema observado nos testes foi exatamente este: os recortes de 32x32
   * estavam bons, mas a área total da grade ficava menor que a Stash real.
   *
   * Agora fazemos duas medições independentes:
   *   1) tamanho do sprite/slot: 32px, preservado no PNG original;
   *   2) distância entre slots: descoberta na própria imagem, procurando
   *      periodicidade de bordas entre 34 e 56px.
   *
   * Assim uma screenshot em escala diferente não é comprimida para caber numa
   * grade artificial de 37px.
   */
  function locateStashGrid(canvas){
    const maxW=1400;
    const scale=Math.min(1,maxW/canvas.width);
    const w=Math.round(canvas.width*scale),h=Math.round(canvas.height*scale);
    const small=document.createElement('canvas');small.width=w;small.height=h;
    const sctx=small.getContext('2d',{willReadFrequently:true});sctx.drawImage(canvas,0,0,w,h);
    const data=sctx.getImageData(0,0,w,h).data;
    const cols=10,minRows=5,maxRows=14;
    const pitches=[];
    for(let p=34;p<=56;p+=1)pitches.push(p*scale);

    function L(x,y){
      x=Math.max(0,Math.min(w-1,Math.round(x)));y=Math.max(0,Math.min(h-1,Math.round(y)));
      const i=(y*w+x)*4;return lum(data[i],data[i+1],data[i+2]);
    }
    function edgeV(x,y0,y1){let s=0,n=0;for(let y=y0;y<=y1;y+=4){s+=Math.abs(L(x,y)-L(x-1,y));n++;}return s/(n||1);}
    function edgeH(y,x0,x1){let s=0,n=0;for(let x=x0;x<=x1;x+=4){s+=Math.abs(L(x,y)-L(x,y-1));n++;}return s/(n||1);}
    function variance(x,y,size){
      let sum=0,sum2=0,n=0;
      for(let yy=y;yy<y+size;yy+=5)for(let xx=x;xx<x+size;xx+=5){const v=L(xx,yy);sum+=v;sum2+=v*v;n++;}
      if(!n)return 0;const m=sum/n;return Math.sqrt(Math.max(0,sum2/n-m*m));
    }

    let globalBest=null;
    for(const pitch of pitches){
      const gridW=cols*pitch;
      if(gridW>=w*.85)continue;

      // Build cheap border profiles for this candidate pitch.
      const xCandidates=[];
      const yCandidates=[];
      const xMin=20*scale,xMax=w-gridW-20*scale;
      const yMin=25*scale,yMax=h-minRows*pitch-15*scale;

      for(let x=xMin;x<=xMax;x+=3){
        let s=0;
        for(let c=0;c<=cols;c++)s+=edgeV(x+c*pitch,yMin,Math.min(h-1,yMin+maxRows*pitch));
        xCandidates.push({v:x,s:s/(cols+1)});
      }
      for(let y=yMin;y<=yMax;y+=3){
        let s=0;
        for(let r=0;r<=maxRows;r++)s+=edgeH(y+r*pitch,xMin,Math.min(w-1,xMin+gridW));
        yCandidates.push({v:y,s:s/(maxRows+1)});
      }
      xCandidates.sort((a,b)=>b.s-a.s);yCandidates.sort((a,b)=>b.s-a.s);

      for(const xc of xCandidates.slice(0,18))for(const yc of yCandidates.slice(0,18)){
        for(let rows=minRows;rows<=maxRows;rows++){
          const x=xc.v,y=yc.v,gridH=rows*pitch;
          if(x+gridW>=w-3||y+gridH>=h-3)continue;

          let vertical=0,horizontal=0;
          for(let c=0;c<=cols;c++)vertical+=edgeV(x+c*pitch,y,y+gridH);
          for(let r=0;r<=rows;r++)horizontal+=edgeH(y+r*pitch,x,x+gridW);

          // Validate actual slot interiors. We do not require them to be filled:
          // empty slots are legitimate. What matters is that the borders repeat.
          let active=0,total=0;
          for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){
            const vv=variance(x+c*pitch+2*scale,y+r*pitch+2*scale,32*scale);
            if(vv>5)active++;total++;
          }
          const density=active/(total||1);

          // Penalize a candidate that is simply a tiny periodic patch in the
          // middle of the screenshot. Prefer the largest coherent rectangle.
          const area=gridW*gridH;
          const borderScore=vertical/(cols+1)+horizontal/(rows+1)*1.15;
          const sizeBonus=Math.log1p(area)*1.8;
          const densityBonus=density*18;
          const score=borderScore+sizeBonus+densityBonus;

          if(!globalBest||score>globalBest.score){
            globalBest={x,y,rows,cols,pitch,score,density,scale,gridW,gridH};
          }
        }
      }
    }

    if(!globalBest||globalBest.density<0.015)return null;

    // Convert the detected geometry back to original PNG coordinates. The
    // image itself is never resized; only the search copy is downsampled.
    return {
      x:Math.round(globalBest.x/scale),
      y:Math.round(globalBest.y/scale),
      rows:globalBest.rows,
      cols:globalBest.cols,
      pitch:Math.round(globalBest.pitch/scale),
      score:globalBest.score,
      density:globalBest.density,
      scale
    };
  }

  function panel(){
    let p=document.getElementById('stashDetector');
    if(p)return p;
    p=document.createElement('div');p.id='stashDetector';p.className='panel';p.style.marginTop='14px';
    result.parentElement.insertBefore(p,result);return p;
  }

  async function inspect(file){
    const img=await loadImage(file);
    const c=document.createElement('canvas');c.width=img.naturalWidth;c.height=img.naturalHeight;c.getContext('2d').drawImage(img,0,0);
    return {file,img,c,grid:locateStashGrid(c)};
  }

  function showReport(report,host,index){
    const g=report.grid;
    const block=document.createElement('div');block.style.cssText='margin-top:14px;padding-top:14px;border-top:1px solid var(--line)';
    if(!g){block.innerHTML=`<strong>Print ${index+1}</strong><br><span class="stash-note">Não encontrei uma janela Stash válida. Nenhum slot será inventado.</span>`;host.appendChild(block);return;}
    block.innerHTML=`<strong>Print ${index+1}</strong><br><span class="stash-note">Grade localizada em ${Math.round(g.x)}, ${Math.round(g.y)} · passo detectado ${g.pitch}px · 10×${g.rows} slots visíveis.</span>`;
    const grid=document.createElement('div');grid.style.cssText='display:grid;grid-template-columns:repeat(10,32px);gap:3px;margin-top:10px;max-height:420px;overflow:auto;padding:6px;background:#080a0d;border:1px solid var(--line);border-radius:10px';
    for(let n=0;n<g.cols*g.rows;n++){
      const col=n%g.cols,row=Math.floor(n/g.cols),sx=Math.round(g.x+col*g.pitch+2),sy=Math.round(g.y+row*g.pitch+2);
      const tile=document.createElement('canvas');tile.width=32;tile.height=32;tile.title=`Slot ${n+1}`;tile.style.cssText='width:32px;height:32px;image-rendering:pixelated;border:1px solid rgba(255,255,255,.08);background:#111';
      tile.getContext('2d').drawImage(report.c,sx,sy,32,32,0,0,32,32);grid.appendChild(tile);
    }
    block.appendChild(grid);host.appendChild(block);
  }

  analyze.addEventListener('click',async()=>{
    if(!world.value){alert('Escolha o mundo do personagem primeiro.');return}
    if(!files.length){alert('Envie pelo menos um print do Stash.');return}
    analyze.disabled=true;analyze.textContent='Localizando janela…';
    result.innerHTML='<strong>Localizando a janela do Stash…</strong><br><span class="stash-note">Detectando a escala real da grade. O PNG original não será redimensionado.</span>';
    try{
      const reports=[];for(const file of files){reports.push(await inspect(file));await new Promise(r=>setTimeout(r,0));}
      const host=panel();host.innerHTML='<div class="eyebrow">Scanner</div><h3 style="margin:4px 0 8px">Grade real do Stash</h3><p class="stash-note">O tamanho do sprite continua 32×32, mas o espaçamento da grade é medido na própria screenshot em vez de ser imposto como 37px.</p>';
      reports.forEach((r,i)=>showReport(r,host,i));
      window.__stashReports=reports;
      const good=reports.filter(r=>r.grid).length;
      result.innerHTML=`<strong>${files.length} print${files.length===1?'':'s'} processado${files.length===1?'':'s'}.</strong><br><span class="stash-note">Mundo: ${esc(world.value)} · ${good}/${reports.length} grades localizadas.</span><br><span class="stash-note">Reconhecimento de item continua separado: comparação com sprites reais, sem chute.</span>`;
      document.getElementById('npcTotal').textContent='—';document.getElementById('marketTotal').textContent='—';document.getElementById('bestTotal').textContent='—';
    }catch(e){console.error(e);result.innerHTML='<strong>Falha ao analisar a imagem.</strong><br><span class="stash-note">Use o PNG original do Tibia, sem redimensionar.</span>';}
    finally{analyze.disabled=false;analyze.textContent='Analisar Stash';}
  });
  loadWorlds();
})();
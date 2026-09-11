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
   * O ponto que estava errado: 220 é a capacidade total do Stash, não a
   * quantidade de slots que aparece em um screenshot. A janela é rolável.
   * Portanto NUNCA devemos procurar uma grade 10x22.
   *
   * A ferramenta oficializada pelo TibiaStash usa passo nativo de 37 px.
   * Aqui procuramos a janela visível como um painel de 10 colunas e entre
   * 6 e 12 linhas, testando a estrutura repetitiva dos slots e o painel ao
   * redor. Só depois recortamos os 32x32 de cada slot.
   */
  function locateStashGrid(canvas){
    const maxW=1200;
    const scale=Math.min(1,maxW/canvas.width);
    const w=Math.round(canvas.width*scale),h=Math.round(canvas.height*scale);
    const small=document.createElement('canvas');small.width=w;small.height=h;
    const sctx=small.getContext('2d',{willReadFrequently:true});sctx.drawImage(canvas,0,0,w,h);
    const data=sctx.getImageData(0,0,w,h).data;
    const pitch=37*scale, cols=10;
    const minRows=6,maxRows=12;

    function px(x,y){
      x=Math.max(0,Math.min(w-1,Math.round(x)));y=Math.max(0,Math.min(h-1,Math.round(y)));
      const i=(y*w+x)*4;return [data[i],data[i+1],data[i+2]];
    }
    function L(x,y){const q=px(x,y);return lum(q[0],q[1],q[2]);}
    function edgeV(x,y0,y1){let s=0,n=0;for(let y=y0;y<=y1;y+=3){s+=Math.abs(L(x,y)-L(x-1,y));n++;}return s/(n||1);}
    function edgeH(y,x0,x1){let s=0,n=0;for(let x=x0;x<=x1;x+=3){s+=Math.abs(L(x,y)-L(x,y-1));n++;}return s/(n||1);}
    function patchVariance(x,y,size){
      let sum=0,sum2=0,n=0;
      for(let yy=y;yy<y+size;yy+=5)for(let xx=x;xx<x+size;xx+=5){const v=L(xx,yy);sum+=v;sum2+=v*v;n++;}
      if(!n)return 999;const m=sum/n;return Math.sqrt(Math.max(0,sum2/n-m*m));
    }

    // Candidates come from the 37px phase, not from arbitrary image origin.
    // We keep only positions with repeated vertical/horizontal slot borders.
    const xs=[],ys=[];
    const xMin=25*scale,xMax=w-10*pitch-25*scale;
    const yMin=30*scale,yMax=h-minRows*pitch-20*scale;
    for(let x=xMin;x<=xMax;x+=2){
      let s=0;for(let c=0;c<=cols;c++)s+=edgeV(x+c*pitch, yMin, Math.min(h-1,yMin+12*pitch));
      xs.push({x,score:s/(cols+1)});
    }
    for(let y=yMin;y<=yMax;y+=2){
      let s=0;for(let r=0;r<=maxRows;r++)s+=edgeH(y+r*pitch,xMin,Math.min(w-1,xMin+10*pitch));
      ys.push({y,score:s/(maxRows+1)});
    }
    xs.sort((a,b)=>b.score-a.score);ys.sort((a,b)=>b.score-a.score);

    let best=null;
    for(const xc of xs.slice(0,60)){
      for(const yc of ys.slice(0,60)){
        for(let rows=minRows;rows<=maxRows;rows++){
          const x=xc.x,y=yc.y,gridW=cols*pitch,gridH=rows*pitch;
          if(x+gridW>=w-5||y+gridH>=h-5)continue;

          let vEdges=0,hEdges=0;
          for(let c=0;c<=cols;c++)vEdges+=edgeV(x+c*pitch,y,y+gridH);
          for(let r=0;r<=rows;r++)hEdges+=edgeH(y+r*pitch,x,x+gridW);

          // Actual stash panels have a coherent dark UI background around the
          // grid. Random map textures usually have much higher variance.
          const outside=[];
          if(x>14)outside.push(patchVariance(x-14,y+10,Math.min(20,gridH-20)));
          if(x+gridW+14<w)outside.push(patchVariance(x+gridW-6,y+10,Math.min(20,gridH-20)));
          if(y>14)outside.push(patchVariance(x+10,y-14,Math.min(20,gridW-20)));
          const panelVar=outside.reduce((a,b)=>a+b,0)/(outside.length||1);

          // Measure activity inside slot centers. Empty UI regions tend to be
          // smooth; item slots have sprite pixels distributed through the grid.
          let active=0,total=0;
          for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){
            const v=patchVariance(x+c*pitch+3,y+r*pitch+3,31*scale);
            if(v>7)active++;total++;
          }
          const density=active/(total||1);
          const score=(vEdges/(cols+1))+(hEdges/(rows+1))*1.15+density*22-Math.min(panelVar,40)*.18;
          if(!best||score>best.score)best={x,y,rows,cols,pitch:37,score,density,panelVar,scale};
        }
      }
    }
    if(!best||best.density<0.04)return null;

    const ox=Math.round(best.x/scale),oy=Math.round(best.y/scale);
    return {...best,x:ox,y:oy,pitch:37};
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
    block.innerHTML=`<strong>Print ${index+1}</strong><br><span class="stash-note">Grade visível localizada em ${Math.round(g.x)}, ${Math.round(g.y)} · 37px · 10×${g.rows} slots visíveis.</span>`;
    const grid=document.createElement('div');grid.style.cssText='display:grid;grid-template-columns:repeat(10,32px);gap:3px;margin-top:10px;max-height:420px;overflow:auto;padding:6px;background:#080a0d;border:1px solid var(--line);border-radius:10px';
    for(let n=0;n<g.cols*g.rows;n++){
      const col=n%g.cols,row=Math.floor(n/g.cols),sx=Math.round(g.x+col*37+2),sy=Math.round(g.y+row*37+2);
      const tile=document.createElement('canvas');tile.width=32;tile.height=32;tile.title=`Slot ${n+1}`;tile.style.cssText='width:32px;height:32px;image-rendering:pixelated;border:1px solid rgba(255,255,255,.08);background:#111';
      tile.getContext('2d').drawImage(report.c,sx,sy,32,32,0,0,32,32);grid.appendChild(tile);
    }
    block.appendChild(grid);host.appendChild(block);
  }

  analyze.addEventListener('click',async()=>{
    if(!world.value){alert('Escolha o mundo do personagem primeiro.');return}
    if(!files.length){alert('Envie pelo menos um print do Stash.');return}
    analyze.disabled=true;analyze.textContent='Localizando janela…';
    result.innerHTML='<strong>Localizando a janela do Stash…</strong><br><span class="stash-note">Agora o detector considera somente a grade que realmente cabe na janela visível. 220 é a capacidade total, não 22 linhas na tela.</span>';
    try{
      const reports=[];for(const file of files){reports.push(await inspect(file));await new Promise(r=>setTimeout(r,0));}
      const host=panel();host.innerHTML='<div class="eyebrow">Scanner</div><h3 style="margin:4px 0 8px">Grade visível do Stash</h3><p class="stash-note">A janela é rolável. O scanner procura 10 colunas e 6–12 linhas, usando o passo nativo de 37px.</p>';
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
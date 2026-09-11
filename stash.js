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
   * Geometria real observada pelo usuário:
   * 20 itens por linha x 11 linhas visíveis.
   * O sprite continua sendo recortado em 32x32, mas o passo entre células
   * é medido na própria screenshot. Não redimensionamos o PNG original.
   */
  function locateStashGrid(canvas){
    const maxW=1600;
    const scale=Math.min(1,maxW/canvas.width);
    const w=Math.round(canvas.width*scale),h=Math.round(canvas.height*scale);
    const small=document.createElement('canvas');small.width=w;small.height=h;
    const ctx=small.getContext('2d',{willReadFrequently:true});ctx.drawImage(canvas,0,0,w,h);
    const data=ctx.getImageData(0,0,w,h).data;
    const cols=20,rows=11;

    function L(x,y){
      x=Math.max(0,Math.min(w-1,Math.round(x)));y=Math.max(0,Math.min(h-1,Math.round(y)));
      const i=(y*w+x)*4;return lum(data[i],data[i+1],data[i+2]);
    }
    function edgeV(x,y0,y1){let s=0,n=0;for(let y=y0;y<=y1;y+=4){s+=Math.abs(L(x,y)-L(x-1,y));n++;}return s/(n||1);}
    function edgeH(y,x0,x1){let s=0,n=0;for(let x=x0;x<=x1;x+=4){s+=Math.abs(L(x,y)-L(x,y-1));n++;}return s/(n||1);}
    function variance(x,y,size){
      let sum=0,sum2=0,n=0;
      for(let yy=y;yy<y+size;yy+=4)for(let xx=x;xx<x+size;xx+=4){const v=L(xx,yy);sum+=v;sum2+=v*v;n++;}
      if(!n)return 0;const m=sum/n;return Math.sqrt(Math.max(0,sum2/n-m*m));
    }

    let best=null;
    // 37px é usado como referência, não como obrigação. A escala do cliente
    // pode deslocar o passo real; por isso testamos uma faixa ao redor dele.
    for(let pitch=34;pitch<=56;pitch+=1){
      const p=pitch*scale;
      const gridW=cols*p,gridH=rows*p;
      if(gridW>=w-20||gridH>=h-20)continue;

      const xLimit=w-gridW-8,yLimit=h-gridH-8;
      for(let y=18*scale;y<=yLimit;y+=4){
        for(let x=18*scale;x<=xLimit;x+=4){
          let v=0,hz=0;
          for(let c=0;c<=cols;c++)v+=edgeV(x+c*p,y,y+gridH);
          for(let r=0;r<=rows;r++)hz+=edgeH(y+r*p,x,x+gridW);

          // Slots podem estar vazios. Medimos a variação apenas como sinal
          // auxiliar, nunca como requisito para considerar uma célula válida.
          let active=0;
          for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){
            if(variance(x+c*p+2*scale,y+r*p+2*scale,32*scale)>5)active++;
          }
          const density=active/(cols*rows);
          const score=(v/(cols+1))+(hz/(rows+1))*1.15+Math.log1p(gridW*gridH)*2+density*12;
          if(!best||score>best.score)best={x,y,pitch:p,score,density};
        }
      }
    }

    if(!best)return null;
    return {
      x:Math.round(best.x/scale),
      y:Math.round(best.y/scale),
      cols,
      rows,
      pitch:Math.max(32,Math.round(best.pitch/scale)),
      density:best.density
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
    const c=document.createElement('canvas');c.width=img.naturalWidth;c.height=img.naturalHeight;
    c.getContext('2d').drawImage(img,0,0);
    return {file,img,c,grid:locateStashGrid(c)};
  }

  function showReport(report,host,index){
    const g=report.grid;
    const block=document.createElement('div');block.style.cssText='margin-top:14px;padding-top:14px;border-top:1px solid var(--line)';
    if(!g){block.innerHTML=`<strong>Print ${index+1}</strong><br><span class="stash-note">Não encontrei uma grade válida.</span>`;host.appendChild(block);return;}

    block.innerHTML=`<strong>Print ${index+1}</strong><br><span class="stash-note">Grade: ${g.cols} colunas × ${g.rows} linhas · início ${g.x}, ${g.y} · passo ${g.pitch}px.</span>`;
    const grid=document.createElement('div');
    grid.style.cssText='display:grid;grid-template-columns:repeat(20,32px);gap:3px;margin-top:10px;max-width:100%;overflow:auto;padding:6px;background:#080a0d;border:1px solid var(--line);border-radius:10px';

    for(let n=0;n<g.cols*g.rows;n++){
      const col=n%g.cols,row=Math.floor(n/g.cols);
      const sx=Math.round(g.x+col*g.pitch+2),sy=Math.round(g.y+row*g.pitch+2);
      const tile=document.createElement('canvas');tile.width=32;tile.height=32;tile.title=`Slot ${n+1} · linha ${row+1} · coluna ${col+1}`;
      tile.style.cssText='width:32px;height:32px;image-rendering:pixelated;border:1px solid rgba(255,255,255,.08);background:#111';
      tile.getContext('2d').drawImage(report.c,sx,sy,32,32,0,0,32,32);
      grid.appendChild(tile);
    }
    block.appendChild(grid);host.appendChild(block);
  }

  analyze.addEventListener('click',async()=>{
    if(!world.value){alert('Escolha o mundo do personagem primeiro.');return}
    if(!files.length){alert('Envie pelo menos um print do Stash.');return}
    analyze.disabled=true;analyze.textContent='Localizando Stash…';
    result.innerHTML='<strong>Localizando a grade real do Stash…</strong><br><span class="stash-note">20 itens por linha × 11 linhas. O PNG original não será redimensionado.</span>';
    try{
      const reports=[];
      for(const file of files){reports.push(await inspect(file));await new Promise(r=>setTimeout(r,0));}
      const host=panel();
      host.innerHTML='<div class="eyebrow">Scanner</div><h3 style="margin:4px 0 8px">Grade do Stash</h3><p class="stash-note">20 colunas × 11 linhas visíveis. O tamanho do item permanece 32×32; somente o espaçamento é medido na imagem.</p>';
      reports.forEach((r,i)=>showReport(r,host,i));
      window.__stashReports=reports;
      const good=reports.filter(r=>r.grid).length;
      result.innerHTML=`<strong>${files.length} print${files.length===1?'':'s'} processado${files.length===1?'':'s'}.</strong><br><span class="stash-note">Mundo: ${esc(world.value)} · ${good}/${reports.length} grades localizadas.</span><br><span class="stash-note">Reconhecimento de itens continua separado e não inventa nomes.</span>`;
      document.getElementById('npcTotal').textContent='—';
      document.getElementById('marketTotal').textContent='—';
      document.getElementById('bestTotal').textContent='—';
    }catch(e){
      console.error(e);
      result.innerHTML='<strong>Falha ao analisar a imagem.</strong><br><span class="stash-note">Use o PNG original do Tibia, sem redimensionar.</span>';
    }finally{
      analyze.disabled=false;analyze.textContent='Analisar Stash';
    }
  });
  loadWorlds();
})();
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

  const GRID={cols:20,rows:11,pitch:37,tile:32,width:740,height:407};

  /*
   * FASE 1 — GEOMETRIA REAL.
   *
   * A regra do Stash é conhecida: 220 slots, 20 x 11, passo nativo de 37 px.
   * O erro da versão anterior era escolher um retângulo apenas porque tinha
   * muitas bordas periódicas. Menus, minimap e outros elementos do cliente
   * também produzem padrões periódicos.
   *
   * Agora a busca usa quatro sinais ao mesmo tempo:
   *  1) bordas nos 21 limites verticais;
   *  2) bordas nos 12 limites horizontais;
   *  3) continuidade das bordas nos dois sentidos;
   *  4) textura de cada célula, descartando regiões que parecem barras/painéis
   *     vazios em vez de uma grade de slots.
   *
   * Também guardamos os melhores candidatos. Se a automação não tiver confiança
   * suficiente, o usuário pode clicar no PRIMEIRO SLOT do Stash e a grade inteira
   * é derivada matematicamente. Não existe chute de item nessa etapa.
   */

  function buildMaps(canvas){
    const w=canvas.width,h=canvas.height;
    const ctx=canvas.getContext('2d',{willReadFrequently:true});
    const d=ctx.getImageData(0,0,w,h).data;
    const v=new Float32Array(w*h), hm=new Float32Array(w*h), sat=new Float32Array(w*h);
    for(let y=0;y<h;y++)for(let x=0;x<w;x++){
      const i=(y*w+x)*4;
      const r=d[i],g=d[i+1],b=d[i+2];
      const mx=Math.max(r,g,b),mn=Math.min(r,g,b);
      sat[y*w+x]=mx-mn;
      if(x){
        const j=i-4;
        v[y*w+x]=Math.abs(lum(r,g,b)-lum(d[j],d[j+1],d[j+2]));
      }
      if(y){
        const j=i-w*4;
        hm[y*w+x]=Math.abs(lum(r,g,b)-lum(d[j],d[j+1],d[j+2]));
      }
    }
    return {w,h,v,hm,sat,d};
  }

  function sumV(m,x,y0,y1,half=1){
    let s=0,n=0;
    for(let xx=Math.max(0,x-half);xx<=Math.min(m.w-1,x+half);xx++)
      for(let y=y0;y<y1;y++){s+=m.v[y*m.w+xx];n++;}
    return n?s/n:0;
  }
  function sumH(m,y,x0,x1,half=1){
    let s=0,n=0;
    for(let yy=Math.max(0,y-half);yy<=Math.min(m.h-1,y+half);yy++)
      for(let x=x0;x<x1;x++){s+=m.hm[yy*m.w+x];n++;}
    return n?s/n:0;
  }
  function interiorTexture(m,x,y){
    let edge=0, sat=0, n=0;
    const x0=x+4,y0=y+4,x1=x+33,y1=y+33;
    for(let yy=y0;yy<y1;yy++)for(let xx=x0;xx<x1;xx++){
      const i=yy*m.w+xx;edge+=m.v[i]+m.hm[i];sat+=m.sat[i];n++;
    }
    return n?Math.min(1,(edge/n)/45)*.7+Math.min(1,(sat/n)/45)*.3:0;
  }

  function candidateScore(m,x,y){
    const gw=GRID.width,gh=GRID.height;
    let v=0,h=0;
    for(let c=0;c<=GRID.cols;c++)v+=sumV(m,x+c*GRID.pitch,y,y+gh,1);
    for(let r=0;r<=GRID.rows;r++)h+=sumH(m,y+r*GRID.pitch,x,x+gw,1);
    v/=GRID.cols+1; h/=GRID.rows+1;

    let continuity=0;
    for(let c=0;c<=GRID.cols;c++){
      const xx=x+c*GRID.pitch;
      continuity+=Math.min(1,sumV(m,xx,y,y+gh,1)/55);
    }
    for(let r=0;r<=GRID.rows;r++){
      const yy=y+r*GRID.pitch;
      continuity+=Math.min(1,sumH(m,yy,x,x+gw,1)/55);
    }
    continuity/=42;

    let texture=0;
    for(let r=0;r<GRID.rows;r+=2)for(let c=0;c<GRID.cols;c+=2)
      texture+=interiorTexture(m,x+c*GRID.pitch,y+r*GRID.pitch);
    texture/=60;

    /* O sinal de textura é deliberadamente pequeno: a geometria manda. */
    return {
      score:(v*.38+h*.42)+continuity*34+texture*5,
      v,h,continuity,texture
    };
  }

  function locateStashGrid(canvas){
    const m=buildMaps(canvas),w=m.w,h=m.h;
    if(w<GRID.width+8||h<GRID.height+8)return null;

    const candidates=[];
    /* Busca em passo 2 px; depois refinamos o melhor em janela de ±3 px. */
    for(let y=2;y<=h-GRID.height-2;y+=2){
      for(let x=2;x<=w-GRID.width-2;x+=2){
        const q=candidateScore(m,x,y);
        candidates.push({x,y,...q});
      }
    }
    candidates.sort((a,b)=>b.score-a.score);
    const top=candidates.slice(0,12);

    let best=null;
    for(const base of top){
      for(let dy=-3;dy<=3;dy++)for(let dx=-3;dx<=3;dx++){
        const x=base.x+dx,y=base.y+dy;
        if(x<0||y<0||x+GRID.width>w||y+GRID.height>h)continue;
        const q=candidateScore(m,x,y);
        if(!best||q.score>best.score)best={x,y,...q};
      }
    }
    if(!best)return null;

    const second=top.find(c=>Math.abs(c.x-best.x)>8||Math.abs(c.y-best.y)>8);
    const gap=second?best.score-second.score:best.score;
    /* Confiança baixa significa que a imagem tem vários falsos candidatos. */
    const confidence=Math.max(0,Math.min(1,(gap/25)*.55+best.continuity*.45));
    return {
      ...best,
      confidence,
      candidates:top.slice(0,5).map(c=>({x:c.x,y:c.y,score:c.score})),
      cols:GRID.cols,rows:GRID.rows,pitch:GRID.pitch,tile:GRID.tile,
      width:GRID.width,height:GRID.height
    };
  }

  function manualGrid(report,x,y){
    const g={x:Math.round(x),y:Math.round(y),cols:20,rows:11,pitch:37,tile:32,width:740,height:407,manual:true,confidence:1};
    report.grid=g;report.manual=true;
    return g;
  }

  function makeOverlay(report){
    const {c,grid}=report;
    const out=document.createElement('canvas');out.width=c.width;out.height=c.height;
    const ctx=out.getContext('2d');ctx.drawImage(c,0,0);
    if(!grid)return out;
    ctx.save();
    ctx.strokeStyle=grid.manual?'rgba(76,220,120,.98)':'rgba(240,196,92,.95)';ctx.lineWidth=2;
    ctx.strokeRect(grid.x,grid.y,grid.width,grid.height);
    ctx.font='bold 13px Inter,Arial';ctx.textBaseline='top';
    for(let r=0;r<20?false:0;r++){}
    for(let r=0;r<grid.rows;r++)for(let col=0;col<grid.cols;col++){
      const x=grid.x+col*grid.pitch,y=grid.y+r*grid.pitch;
      ctx.strokeRect(x,y,grid.pitch,grid.pitch);
      ctx.fillStyle='rgba(0,0,0,.72)';ctx.fillRect(x+1,y+1,22,15);
      ctx.fillStyle='#fff';ctx.fillText(String(r*grid.cols+col+1),x+3,y+2);
    }
    ctx.restore();return out;
  }

  function panel(){
    let p=document.getElementById('stashDetector');
    if(p)return p;
    p=document.createElement('div');p.id='stashDetector';p.className='panel';p.style.marginTop='14px';
    result.parentElement.insertBefore(p,result);return p;
  }

  function renderReport(report,host,index){
    const block=document.createElement('div');
    block.style.cssText='margin-top:18px;padding-top:18px;border-top:1px solid var(--line)';
    const g=report.grid;
    if(!g){
      block.innerHTML=`<strong>Print ${index+1}</strong><br><span class="stash-note">Não encontrei a grade 20×11 com confiança suficiente.</span>`;
      host.appendChild(block);return;
    }
    block.innerHTML=`<strong>Print ${index+1}</strong><br><span class="stash-note">${g.manual?'Grade calibrada manualmente':'Grade detectada automaticamente'} · ${g.cols} × ${g.rows} · origem ${g.x}, ${g.y} · passo ${g.pitch}px · confiança ${Math.round((g.confidence||0)*100)}%.</span>`;
    const overlay=makeOverlay(report);
    overlay.style.cssText='display:block;width:min(100%,1100px);height:auto;margin-top:12px;border:1px solid var(--line);border-radius:10px;background:#080a0d;image-rendering:auto;cursor:crosshair';
    overlay.title='Clique no centro do primeiro slot para recalibrar';
    overlay.addEventListener('click',ev=>{
      const rect=overlay.getBoundingClientRect();
      const sx=overlay.width/rect.width,sy=overlay.height/rect.height;
      /* O clique marca o CENTRO do primeiro slot; convertemos para a origem da célula. */
      const px=ev.offsetX*sx,py=ev.offsetY*sy;
      manualGrid(report,px-16,py-16);
      renderReport(report,host,index);
      block.remove();
    });
    block.appendChild(overlay);

    const tiles=document.createElement('div');
    tiles.style.cssText='display:grid;grid-template-columns:repeat(20,32px);gap:3px;margin-top:12px;max-width:100%;overflow:auto;padding:6px;background:#080a0d;border:1px solid var(--line);border-radius:10px';
    for(let n=0;n<220;n++){
      const col=n%20,row=Math.floor(n/20),sx=Math.round(g.x+col*g.pitch+(g.pitch-32)/2),sy=Math.round(g.y+row*g.pitch+(g.pitch-32)/2);
      const tile=document.createElement('canvas');tile.width=32;tile.height=32;
      tile.title=`Slot ${n+1} · linha ${row+1} · coluna ${col+1}`;
      tile.style.cssText='width:32px;height:32px;image-rendering:pixelated;border:1px solid rgba(255,255,255,.08);background:#111';
      tile.getContext('2d').drawImage(report.c,sx,sy,32,32,0,0,32,32);tiles.appendChild(tile);
    }
    block.appendChild(tiles);
    host.appendChild(block);
  }

  async function inspect(file){
    const img=await loadImage(file);
    const c=document.createElement('canvas');c.width=img.naturalWidth;c.height=img.naturalHeight;c.getContext('2d').drawImage(img,0,0);
    return {file,img,c,grid:locateStashGrid(c)};
  }

  analyze.addEventListener('click',async()=>{
    if(!world.value){alert('Escolha o mundo do personagem primeiro.');return}
    if(!files.length){alert('Envie pelo menos um print do Stash.');return}
    analyze.disabled=true;analyze.textContent='Detectando janela…';
    result.innerHTML='<strong>Fase 1: detectando a geometria do Stash.</strong><br><span class="stash-note">PNG original · escala nativa · 20 × 11 · passo 37 px.</span>';
    try{
      const reports=[];
      for(const file of files){reports.push(await inspect(file));await new Promise(r=>setTimeout(r,0));}
      const host=panel();
      host.innerHTML='<div class="eyebrow">Scanner · Fase 1</div><h3 style="margin:4px 0 8px">Diagnóstico da geometria</h3><p class="stash-note">Amarelo = detecção automática. Verde = grade calibrada por clique. Se a detecção errar, clique no <strong>centro do primeiro item</strong>; o restante da grade é calculado em 37 px, sem procurar ou adivinhar.</p>';
      reports.forEach((r,i)=>renderReport(r,host,i));
      window.__stashReports=reports;
      const good=reports.filter(r=>r.grid).length;
      result.innerHTML=`<strong>${files.length} print${files.length===1?'':'s'} processado${files.length===1?'':'s'}.</strong><br><span class="stash-note">${good}/${reports.length} grades encontradas. Reconhecimento de itens continua desativado até a geometria estar correta.</span>`;
      document.getElementById('npcTotal').textContent='—';document.getElementById('marketTotal').textContent='—';document.getElementById('bestTotal').textContent='—';
    }catch(e){
      console.error(e);result.innerHTML='<strong>Falha ao analisar a imagem.</strong><br><span class="stash-note">Use o PNG original do Tibia, sem redimensionar ou recomprimir.</span>';
    }finally{analyze.disabled=false;analyze.textContent='Analisar Stash';}
  });
  loadWorlds();
})();
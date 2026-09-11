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
   * TibiaStash informa que a grade do Stash usa passo FIXO de 37 px.
   * O erro anterior era procurar a grade no screenshot inteiro e aceitar o
   * primeiro padrão que parecesse periódico. Aqui fazemos diferente:
   * 1) fixamos 37 px;
   * 2) procuramos onde existe uma sequência de 10 colunas x 22 linhas;
   * 3) só então extraímos os tiles 32x32.
   * Assim o canto do screenshot nunca vira automaticamente o início do Stash.
   */
  function locateStashGrid(canvas){
    const maxW=960;
    const scale=Math.min(1,maxW/canvas.width);
    const w=Math.round(canvas.width*scale),h=Math.round(canvas.height*scale);
    const small=document.createElement('canvas');small.width=w;small.height=h;
    const sctx=small.getContext('2d',{willReadFrequently:true});sctx.drawImage(canvas,0,0,w,h);
    const data=sctx.getImageData(0,0,w,h).data;
    const pitch=37*scale, cols=10, rows=22;
    const gridW=cols*pitch,gridH=rows*pitch;

    function p(x,y){
      x=Math.max(0,Math.min(w-1,x));y=Math.max(0,Math.min(h-1,y));
      const i=(Math.round(y)*w+Math.round(x))*4;
      return lum(data[i],data[i+1],data[i+2]);
    }

    // Edge profiles: cheap and deterministic. They tell us where long repeated
    // slot borders exist without testing every possible rectangle in full detail.
    const vx=new Float32Array(w),hy=new Float32Array(h);
    for(let y=0;y<h;y++)for(let x=1;x<w;x++)vx[x]+=Math.abs(p(x,y)-p(x-1,y));
    for(let x=0;x<w;x++)for(let y=1;y<h;y++)hy[y]+=Math.abs(p(x,y)-p(x,y-1));
    for(let x=0;x<w;x++)vx[x]/=h;
    for(let y=0;y<h;y++)hy[y]/=w;

    function topCandidates(profile,period,count,min,max){
      const arr=[];
      for(let start=min;start<=max;start+=2){
        let s=0;
        for(let k=0;k<=period;k++)s+=profile[Math.min(profile.length-1,Math.round(start+k*37*scale))];
        s+=profile[Math.min(profile.length-1,Math.round(start+10*37*scale))];
        arr.push({start,score:s});
      }
      arr.sort((a,b)=>b.score-a.score);
      return arr.slice(0,count);
    }

    const xs=topCandidates(vx,10,24,8*scale,Math.max(8*scale,w-gridW-8*scale));
    const ys=topCandidates(hy,22,24,45*scale,Math.max(45*scale,h-gridH-8*scale));

    let best=null;
    for(const xc of xs)for(const yc of ys){
      const x=xc.start,y=yc.start;
      let border=0,inside=0,empty=0;
      for(let c=0;c<=cols;c++)border+=vx[Math.min(w-1,Math.round(x+c*pitch))];
      for(let r=0;r<=rows;r++)border+=hy[Math.min(h-1,Math.round(y+r*pitch))];

      // Sample slot interiors. Real Stash slots contain sprites/quantities; the
      // surrounding panel generally does not repeat this 37px structure.
      for(let r=0;r<rows;r+=2)for(let c=0;c<cols;c+=2){
        const cx=Math.round(x+c*pitch+pitch*.5),cy=Math.round(y+r*pitch+pitch*.5);
        let sum=0,sum2=0,n=0;
        for(let yy=-5;yy<=5;yy+=2)for(let xx=-5;xx<=5;xx+=2){const v=p(cx+xx,cy+yy);sum+=v;sum2+=v*v;n++;}
        const mean=sum/n,sd=Math.sqrt(Math.max(0,sum2/n-mean*mean));
        if(sd>10)inside++;else empty++;
      }
      const density=inside/(inside+empty||1);
      const score=border/(cols+rows+2)+density*18-(x<15*scale?5:0)-(y<55*scale?5:0);
      if(!best||score>best.score)best={x,y,pitch:37,cols,rows,score,density,scale};
    }

    if(!best||best.density<.03)return null;

    // Convert the coarse coordinate back to the original PNG and refine only a
    // tiny neighborhood. This keeps the browser responsive even on 4K screenshots.
    const ox=Math.round(best.x/scale),oy=Math.round(best.y/scale);
    let final={...best,x:ox,y:oy,pitch:37};
    const ctx=canvas.getContext('2d',{willReadFrequently:true});
    function refineScore(x,y){
      let s=0;
      for(let c=0;c<=10;c++){
        const xx=x+c*37;
        for(let r=0;r<22;r+=2){
          const yy=y+r*37+18;
          if(xx<1||xx>=canvas.width-1||yy<0||yy>=canvas.height)continue;
          const a=ctx.getImageData(xx-1,yy,3,1).data;
          s+=Math.abs(lum(a[0],a[1],a[2])-lum(a[8],a[9],a[10]));
        }
      }
      return s;
    }
    let bestRef=refineScore(ox,oy);
    for(let dy=-3;dy<=3;dy++)for(let dx=-3;dx<=3;dx++){
      const x=ox+dx,y=oy+dy;if(x<8||y<45||x+370>canvas.width||y+814>canvas.height)continue;
      const s=refineScore(x,y);if(s>bestRef){bestRef=s;final.x=x;final.y=y;}
    }
    final.refineScore=bestRef;
    return final;
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
    if(!g){block.innerHTML=`<strong>Print ${index+1}</strong><br><span class="stash-note">Janela do Stash não localizada. Nenhum slot será inventado.</span>`;host.appendChild(block);return;}
    block.innerHTML=`<strong>Print ${index+1}</strong><br><span class="stash-note">Grade localizada em ${Math.round(g.x)}, ${Math.round(g.y)} · passo nativo 37px · 10×22 slots</span>`;
    const grid=document.createElement('div');grid.style.cssText='display:grid;grid-template-columns:repeat(10,32px);gap:3px;margin-top:10px;max-height:360px;overflow:auto;padding:6px;background:#080a0d;border:1px solid var(--line);border-radius:10px';
    for(let n=0;n<220;n++){
      const col=n%10,row=Math.floor(n/10),sx=Math.round(g.x+col*37+2),sy=Math.round(g.y+row*37+2);
      const tile=document.createElement('canvas');tile.width=32;tile.height=32;tile.title=`Slot ${n+1}`;tile.style.cssText='width:32px;height:32px;image-rendering:pixelated;border:1px solid rgba(255,255,255,.08);background:#111';
      tile.getContext('2d').drawImage(report.c,sx,sy,32,32,0,0,32,32);grid.appendChild(tile);
    }
    block.appendChild(grid);host.appendChild(block);
  }

  analyze.addEventListener('click',async()=>{
    if(!world.value){alert('Escolha o mundo do personagem primeiro.');return}
    if(!files.length){alert('Envie pelo menos um print do Stash.');return}
    analyze.disabled=true;analyze.textContent='Localizando Stash…';
    result.innerHTML='<strong>Localizando a janela do Stash…</strong><br><span class="stash-note">A grade começa dentro da janela do Stash, não no início do screenshot.</span>';
    try{
      const reports=[];for(const file of files){reports.push(await inspect(file));await new Promise(r=>setTimeout(r,0));}
      const host=panel();host.innerHTML='<div class="eyebrow">Scanner</div><h3 style="margin:4px 0 8px">Grade do Stash</h3><p class="stash-note">Passo fixo de 37px e recortes de 32×32. Primeiro localizamos a grade; depois reconhecemos os sprites.</p>';
      reports.forEach((r,i)=>showReport(r,host,i));
      window.__stashReports=reports;
      const good=reports.filter(r=>r.grid).length;
      result.innerHTML=`<strong>${files.length} print${files.length===1?'':'s'} processado${files.length===1?'':'s'}.</strong><br><span class="stash-note">Mundo: ${esc(world.value)} · ${good}/${reports.length} grades localizadas.</span><br><span class="stash-note">Reconhecimento de item será por comparação de sprite. Sem palpite em caso de ambiguidade.</span>`;
      document.getElementById('npcTotal').textContent='—';document.getElementById('marketTotal').textContent='—';document.getElementById('bestTotal').textContent='—';
    }catch(e){console.error(e);result.innerHTML='<strong>Falha ao analisar a imagem.</strong><br><span class="stash-note">Use o PNG original do Tibia, sem redimensionar.</span>';}
    finally{analyze.disabled=false;analyze.textContent='Analisar Stash';}
  });
  loadWorlds();
})();
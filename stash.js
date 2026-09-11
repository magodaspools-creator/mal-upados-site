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

  /*
   * IMPORTANTE:
   * Não procuramos mais uma grade começando no canto da imagem.
   * O Tibia usa uma grade nativa de 37 px por slot. O reconhecimento correto
   * precisa primeiro localizar a JANELA do Stash e só depois recortar os slots.
   *
   * O detector abaixo procura a assinatura repetitiva das bordas dos slots:
   * 10 colunas x 22 linhas, passo nativo 37 px, com os tiles de item dentro.
   * A imagem é reduzida apenas durante a busca; os recortes finais continuam
   * sendo feitos no PNG original.
   */
  function locateStashGrid(canvas){
    const maxW=960;
    const scale=Math.min(1,maxW/canvas.width);
    const w=Math.max(1,Math.round(canvas.width*scale));
    const h=Math.max(1,Math.round(canvas.height*scale));
    const small=document.createElement('canvas');
    small.width=w;small.height=h;
    const sctx=small.getContext('2d',{willReadFrequently:true});
    sctx.drawImage(canvas,0,0,w,h);
    const data=sctx.getImageData(0,0,w,h).data;

    const pitch=37*scale;
    const cols=10;
    const rows=22;
    const gridW=cols*pitch;
    const gridH=rows*pitch;

    function px(x,y){
      x=Math.max(0,Math.min(w-1,x));
      y=Math.max(0,Math.min(h-1,y));
      const i=(y*w+x)*4;
      return lum(data[i],data[i+1],data[i+2]);
    }
    function edgeV(x,y){return Math.abs(px(x-1,y)-px(x+1,y));}
    function edgeH(x,y){return Math.abs(px(x,y-1)-px(x,y+1));}

    let best=null;
    const step=3;

    for(let y=45*scale;y+gridH<=h-8*scale;y+=step){
      for(let x=8*scale;x+gridW<=w-8*scale;x+=step){
        let border=0, samples=0, active=0;

        // Vertical slot borders. Sample the middle of every other row.
        for(let c=0;c<=cols;c++){
          const bx=x+c*pitch;
          for(let r=1;r<rows;r+=2){
            const by=y+r*pitch-pitch*.5;
            border+=edgeV(bx,by);samples++;
          }
        }

        // Horizontal slot borders. Sample the middle of every other column.
        for(let r=0;r<=rows;r++){
          const by=y+r*pitch;
          for(let c=1;c<cols;c+=2){
            const bx=x+c*pitch-pitch*.5;
            border+=edgeH(bx,by);samples++;
          }
        }

        // Item activity: real stash slots contain sprites, while the empty panel
        // around the stash is mostly uniform. We sample the center of each slot.
        for(let r=0;r<rows;r+=2){
          for(let c=0;c<cols;c+=2){
            const cx=Math.round(x+c*pitch+pitch*.5);
            const cy=Math.round(y+r*pitch+pitch*.5);
            let sum=0,sum2=0,n=0;
            for(let yy=-5;yy<=5;yy+=2){
              for(let xx=-5;xx<=5;xx+=2){
                const v=px(cx+xx,cy+yy);sum+=v;sum2+=v*v;n++;
              }
            }
            const mean=sum/n;
            const sd=Math.sqrt(Math.max(0,sum2/n-mean*mean));
            if(sd>12)active++;
          }
        }

        const borderScore=border/(samples||1);
        const density=active/Math.ceil(rows/2)/Math.ceil(cols/2);

        // The first item row sits well below the Stash title/filter area.
        // Penalize impossible starts near the image edge instead of assuming (0,0).
        const marginPenalty=(x<15*scale?8:0)+(y<55*scale?8:0);
        const score=borderScore+density*18-marginPenalty;

        if(!best||score>best.score){
          best={x,y,pitch,cols,rows,score,borderScore,density,scale};
        }
      }
    }

    if(!best)return null;

    // Refine around the best coarse candidate at 1-pixel native resolution.
    const bx=Math.round(best.x/scale),by=Math.round(best.y/scale);
    const refine=5;
    let refined=best;
    for(let oy=-refine;oy<=refine;oy++){
      for(let ox=-refine;ox<=refine;ox++){
        const x=bx+ox,y=by+oy;
        if(x<8||y<45||x+370>canvas.width||y+814>canvas.height)continue;
        let s=0,n=0;
        for(let c=0;c<=10;c++){
          const xx=x+c*37;
          for(let r=1;r<22;r+=2){
            const yy=y+r*37-18;
            const a=canvas.getContext('2d').getImageData(Math.max(0,xx-1),Math.max(0,yy),3,1).data;
            if(a.length>=12){
              s+=Math.abs(lum(a[0],a[1],a[2])-lum(a[8],a[9],a[10]));n++;
            }
          }
        }
        const score=s/(n||1);
        if(score>(refined.refineScore||-1))refined={...best,x,y,pitch:37,refineScore:score};
      }
    }
    return refined;
  }

  function makePanel(id){
    let p=document.getElementById(id);
    if(p)return p;
    p=document.createElement('div');p.id=id;p.className='panel';p.style.marginTop='14px';
    result.parentElement.insertBefore(p,result);return p;
  }

  async function inspect(file){
    const img=await loadImage(file);
    const c=document.createElement('canvas');c.width=img.naturalWidth;c.height=img.naturalHeight;
    c.getContext('2d').drawImage(img,0,0);
    const grid=locateStashGrid(c);
    return {file,img,c,grid};
  }

  function drawGrid(report,panel,index){
    const g=report.grid;
    const block=document.createElement('div');
    block.style.cssText='margin-top:14px;padding-top:14px;border-top:1px solid var(--line)';
    if(!g){
      block.innerHTML=`<strong>Print ${index+1}</strong><br><span class="stash-note">Não encontrei a janela do Stash. O scanner não vai inventar uma grade em outra parte do print.</span>`;
      panel.appendChild(block);return;
    }

    block.innerHTML=`<strong>Print ${index+1}</strong><br><span class="stash-note">Stash localizado · início da grade: ${Math.round(g.x)}, ${Math.round(g.y)} · passo: 37px · 10×22 slots</span>`;

    const grid=document.createElement('div');
    grid.style.cssText='display:grid;grid-template-columns:repeat(10,32px);gap:3px;margin-top:10px;max-height:360px;overflow:auto;padding:6px;background:#080a0d;border:1px solid var(--line);border-radius:10px';
    const ctx=report.c.getContext('2d');

    for(let n=0;n<220;n++){
      const col=n%10,row=Math.floor(n/10);
      const sx=Math.round(g.x+col*37+2);
      const sy=Math.round(g.y+row*37+2);
      const tile=document.createElement('canvas');
      tile.width=32;tile.height=32;tile.title=`Slot ${n+1}`;
      tile.style.cssText='width:32px;height:32px;image-rendering:pixelated;border:1px solid rgba(255,255,255,.08);background:#111';
      tile.getContext('2d').drawImage(report.c,sx,sy,32,32,0,0,32,32);
      grid.appendChild(tile);
    }
    block.appendChild(grid);panel.appendChild(block);
  }

  analyze.addEventListener('click',async()=>{
    if(!world.value){alert('Escolha o mundo do personagem primeiro.');return}
    if(!files.length){alert('Envie pelo menos um print do Stash.');return}

    analyze.disabled=true;analyze.textContent='Localizando Stash…';
    result.innerHTML='<strong>Localizando a janela do Stash…</strong><br><span class="stash-note">Não vou usar o canto da imagem como início da grade.</span>';

    try{
      const reports=[];
      for(const file of files){
        reports.push(await inspect(file));
        await new Promise(r=>setTimeout(r,0));
      }

      const detector=makePanel('stashDetector');
      detector.innerHTML='<div class="eyebrow">Scanner</div><h3 style="margin:4px 0 8px">Janela do Stash localizada</h3><p class="stash-note">Usando a grade nativa de 37 px do Tibia. Só depois de localizar a grade os slots são recortados.</p>';
      reports.forEach((r,i)=>drawGrid(r,detector,i));

      window.__stashReports=reports;
      const good=reports.filter(r=>r.grid).length;
      result.innerHTML=`<strong>${files.length} print${files.length===1?'':'s'} processado${files.length===1?'':'s'}.</strong><br><span class="stash-note">Mundo: ${esc(world.value)} · ${good}/${reports.length} janelas do Stash localizadas.</span><br><span class="stash-note">Próxima camada: comparar os 32×32 recortes com sprites reais. Se houver sprite ambígua, o resultado será ambíguo — nunca um chute.</span>`;
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
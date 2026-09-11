(function(){
  const preview=document.getElementById('stashFilesPreview');
  const analyze=document.getElementById('analyzeBtn');
  const world=document.getElementById('stashWorld');
  const result=document.getElementById('stashResult');
  if(!preview||!analyze)return;

  const esc=v=>String(v??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));

  function loadImage(src){return new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=reject;img.src=src;});}

  function scoreCrop(ctx,x,y,w,h){
    const sx=Math.max(0,Math.floor(x)),sy=Math.max(0,Math.floor(y));
    if(sx+w>ctx.canvas.width||sy+h>ctx.canvas.height)return 0;
    const d=ctx.getImageData(sx,sy,w,h).data;
    let sum=0,sum2=0,n=0;
    for(let i=0;i<d.length;i+=4){
      const v=(d[i]*.2126+d[i+1]*.7152+d[i+2]*.0722);
      sum+=v;sum2+=v*v;n++;
    }
    const mean=sum/n;
    return Math.sqrt(Math.max(0,sum2/n-mean*mean));
  }

  function findGrid(canvas,pitch){
    const ctx=canvas.getContext('2d',{willReadFrequently:true});
    const nativePitch=pitch;
    const slot=Math.max(12,Math.round(nativePitch*.86));
    const configs=[{cols:10,rows:22},{cols:11,rows:20}];
    let best=null;
    for(const cfg of configs){
      const gw=cfg.cols*nativePitch,gh=cfg.rows*nativePitch;
      if(gw>canvas.width||gh>canvas.height)continue;
      const step=Math.max(3,Math.round(nativePitch/3));
      for(let y=0;y+gh<=canvas.height;y+=step){
        for(let x=0;x+gw<=canvas.width;x+=step){
          let active=0,total=0,edge=0;
          for(let r=0;r<cfg.rows;r++){
            for(let c=0;c<cfg.cols;c++){
              const cx=x+c*nativePitch+(nativePitch-slot)/2;
              const cy=y+r*nativePitch+(nativePitch-slot)/2;
              const s=scoreCrop(ctx,cx,cy,slot,slot);
              total+=s;
              if(s>18)active++;
            }
          }
          const density=active/(cfg.rows*cfg.cols);
          if(density<.04||density>.98)continue;
          const score=(total/(cfg.rows*cfg.cols))*0.7+density*45;
          if(!best||score>best.score)best={...cfg,x,y,pitch:nativePitch,score,density};
        }
      }
    }
    return best;
  }

  function makePanel(){
    let p=document.getElementById('stashSlotsPanel');
    if(p)return p;
    p=document.createElement('div');p.id='stashSlotsPanel';p.className='panel';p.style.marginTop='14px';
    result.parentElement.insertBefore(p,result);
    return p;
  }

  async function inspect(src,pitch){
    const img=await loadImage(src);
    const c=document.createElement('canvas');c.width=img.naturalWidth;c.height=img.naturalHeight;
    c.getContext('2d').drawImage(img,0,0);
    const g=findGrid(c,pitch);
    return {img,c,g};
  }

  analyze.addEventListener('click',async()=>{
    setTimeout(async()=>{
      const detector=document.getElementById('stashDetector');
      if(!detector)return;
      const text=detector.innerText||'';
      const m=text.match(/passo estimado:\s*(\d+)px/i);
      if(!m)return;
      const pitch=Number(m[1]);
      const imgs=[...preview.querySelectorAll('img')];
      if(!imgs.length)return;
      try{
        const reports=[];
        for(const img of imgs)reports.push(await inspect(img.src,pitch));
        const panel=makePanel();
        panel.innerHTML='<div class="eyebrow">2 · Slots detectados</div><h3 style="margin:4px 0 8px">Extração da grade</h3><p class="stash-note">Agora o scanner recorta os slots usando a escala encontrada na própria imagem. Nesta etapa, nenhum item é inventado: slots aguardam comparação com a base de sprites.</p>';
        reports.forEach((r,idx)=>{
          const g=r.g;
          const block=document.createElement('div');block.style.cssText='margin-top:14px;padding-top:14px;border-top:1px solid var(--line)';
          if(!g){block.innerHTML='<strong>Print '+(idx+1)+'</strong><br><span class="stash-note">Não consegui localizar uma grade completa nesta imagem.</span>';panel.appendChild(block);return;}
          const count=g.cols*g.rows;
          block.innerHTML='<strong>Print '+(idx+1)+'</strong><br><span class="stash-note">Grade candidata: '+g.cols+'×'+g.rows+' · '+count+' slots · posição relativa '+g.x+'×'+g.y+' · densidade '+Math.round(g.density*100)+'%</span>';
          const grid=document.createElement('div');grid.style.cssText='display:grid;grid-template-columns:repeat('+g.cols+',minmax(24px,1fr));gap:3px;margin-top:10px;max-height:360px;overflow:auto;padding:5px;background:#080a0d;border:1px solid var(--line);border-radius:10px';
          const ctx=r.c.getContext('2d');
          for(let n=0;n<count;n++){
            const col=n%g.cols,row=Math.floor(n/g.cols);
            const sx=Math.round(g.x+col*g.pitch+(g.pitch-g.pitch*.86)/2);
            const sy=Math.round(g.y+row*g.pitch+(g.pitch-g.pitch*.86)/2);
            const tile=document.createElement('canvas');tile.width=32;tile.height=32;tile.title='Slot '+(n+1)+' · revisão';
            tile.style.cssText='width:32px;height:32px;image-rendering:pixelated;border:1px solid rgba(255,255,255,.08);background:#111';
            tile.getContext('2d').drawImage(r.c,sx,sy,Math.round(g.pitch*.86),Math.round(g.pitch*.86),0,0,32,32);
            grid.appendChild(tile);
          }
          block.appendChild(grid);
          panel.appendChild(block);
        });
        result.innerHTML='<strong>Slots recortados com sucesso.</strong><br><span class="stash-note">Mundo: '+esc(world.value)+' · próxima camada: comparar cada recorte com o banco de sprites e então consultar NPC × Market.</span>';
      }catch(e){console.error(e)}
    },80);
  });
})();

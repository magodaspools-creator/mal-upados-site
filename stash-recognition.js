(function(){
  'use strict';

  const VERSION='2026.09.11-stage2';
  const COLS=20;
  const ROWS=11;
  const PITCH=37;
  const TILE=32;
  const SPRITE_X=2.5;
  const SPRITE_Y=2.5;

  let latestReports=[];

  function hashPixels(data){
    // FNV-1a 32-bit. O hash serve como identificador rápido do recorte;
    // a decisão final de identidade do item virá do matcher de sprites.
    let h=2166136261;
    for(let i=0;i<data.length;i+=4){
      h^=data[i];h=Math.imul(h,16777619);
      h^=data[i+1];h=Math.imul(h,16777619);
      h^=data[i+2];h=Math.imul(h,16777619);
    }
    return ('00000000'+(h>>>0).toString(16)).slice(-8);
  }

  function analyzeCrop(ctx){
    const image=ctx.getImageData(0,0,TILE,TILE).data;
    let sum=0,sumSq=0,count=0,edge=0;
    for(let y=1;y<TILE-1;y++){
      for(let x=1;x<TILE-1;x++){
        const i=(y*TILE+x)*4;
        const lum=.2126*image[i]+.7152*image[i+1]+.0722*image[i+2];
        sum+=lum;sumSq+=lum*lum;count++;
        const left=(y*TILE+x-1)*4;
        const up=((y-1)*TILE+x)*4;
        const ll=.2126*image[left]+.7152*image[left+1]+.0722*image[left+2];
        const ul=.2126*image[up]+.7152*image[up+1]+.0722*image[up+2];
        edge+=Math.abs(lum-ll)+Math.abs(lum-ul);
      }
    }
    const mean=sum/count;
    const variance=Math.max(0,sumSq/count-mean*mean);
    return {
      mean,
      variance,
      edge,
      // Isto é somente uma indicação visual para a etapa de extração.
      // NÃO é usado para dar nome ao item.
      visualContent:variance>90 || edge>7000
    };
  }

  function extractGrid(report){
    if(!report||!report.grid||!report.c)return null;
    const g=report.grid;
    const source=report.c;
    const sourceCtx=source.getContext('2d',{willReadFrequently:true});
    const slots=[];

    for(let row=0;row<ROWS;row++){
      for(let col=0;col<COLS;col++){
        const slot=row*COLS+col+1;
        const x=Math.round(g.x+col*PITCH+SPRITE_X);
        const y=Math.round(g.y+row*PITCH+SPRITE_Y);
        const crop=document.createElement('canvas');
        crop.width=TILE;
        crop.height=TILE;
        const ctx=crop.getContext('2d',{willReadFrequently:true});
        ctx.imageSmoothingEnabled=false;
        ctx.drawImage(source,x,y,TILE,TILE,0,0,TILE,TILE);
        const stats=analyzeCrop(ctx);
        const pixels=ctx.getImageData(0,0,TILE,TILE).data;
        slots.push({
          slot,
          row:row+1,
          col:col+1,
          x,
          y,
          crop,
          dataUrl:crop.toDataURL('image/png'),
          fingerprint:hashPixels(pixels),
          mean:stats.mean,
          variance:stats.variance,
          edge:stats.edge,
          visualContent:stats.visualContent
        });
      }
    }

    return {
      version:VERSION,
      total:slots.length,
      rows:ROWS,
      cols:COLS,
      pitch:PITCH,
      slots,
      // Índice rápido para descobrir recortes repetidos entre prints.
      fingerprintCounts:slots.reduce((acc,s)=>{acc[s.fingerprint]=(acc[s.fingerprint]||0)+1;return acc;},{}),
      visualSlots:slots.filter(s=>s.visualContent).length
    };
  }

  function summarize(reports){
    const valid=reports.filter(r=>r&&r.grid&&r.stashExtraction);
    const total=valid.reduce((n,r)=>n+r.stashExtraction.total,0);
    const visual=valid.reduce((n,r)=>n+r.stashExtraction.visualSlots,0);
    const fingerprints=new Map();
    valid.forEach(r=>r.stashExtraction.slots.forEach(s=>fingerprints.set(s.fingerprint,(fingerprints.get(s.fingerprint)||0)+1)));
    let repeated=0;
    fingerprints.forEach(n=>{if(n>1)repeated+=n-1;});
    return {prints:valid.length,totalSlots:total,visualSlots:visual,repeatedCrops:repeated};
  }

  function updatePanel(reports){
    const panel=document.getElementById('stashDetector');
    if(!panel)return;
    const s=summarize(reports);
    let box=document.getElementById('stashExtractionStatus');
    if(!box){
      box=document.createElement('div');
      box.id='stashExtractionStatus';
      box.style.cssText='margin-top:14px;padding:12px 14px;border:1px solid var(--line);border-radius:10px;background:rgba(255,255,255,.025)';
      panel.appendChild(box);
    }
    box.innerHTML=`<strong>Etapa 2 · 220 recortes extraídos</strong><br><span class="stash-note">${s.totalSlots} slots preparados em ${s.prints} print${s.prints===1?'':'s'} · ${s.visualSlots} com conteúdo visual detectado · ${s.repeatedCrops} recorte${s.repeatedCrops===1?'':'s'} repetido${s.repeatedCrops===1?'':'s'}.</span>`;
  }

  async function processReports(reports){
    latestReports=Array.isArray(reports)?reports:[];
    latestReports.forEach(report=>{
      if(report&&report.grid)report.stashExtraction=extractGrid(report);
    });
    updatePanel(latestReports);
    return latestReports;
  }

  window.StashRecognition={
    version:VERSION,
    status:'slot-extraction-ready',
    getReports:function(){return latestReports.length?latestReports:(window.__stashReports||[]);},
    getSlots:function(printIndex=0){return latestReports[printIndex]?.stashExtraction?.slots||[];},
    processReports,
    extractGrid
  };

  // stash.js publica os relatórios depois de localizar a grade. O setter faz
  // a etapa 2 começar automaticamente, sem botão, calibração ou ação manual.
  try{
    Object.defineProperty(window,'__stashReports',{
      configurable:true,
      get:function(){return latestReports;},
      set:function(value){processReports(value);}
    });
  }catch(e){
    console.warn('StashRecognition: não foi possível instalar o observador de relatórios.',e);
  }
})();

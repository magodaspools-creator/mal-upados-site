(function(){
  'use strict';

  const VERSION='2026.09.11-stage3';
  const COLS=20;
  const ROWS=11;
  const PITCH=37;
  const TILE=32;
  const SPRITE_X=2.5;
  const SPRITE_Y=2.5;
  const MASK_BOTTOM=5;
  const MASK_RIGHT=2;

  let latestReports=[];
  let spriteIndex=null;

  function hashBytes(data){
    let h=2166136261;
    for(let i=0;i<data.length;i++){
      h^=data[i];
      h=Math.imul(h,16777619);
    }
    return ('00000000'+(h>>>0).toString(16)).slice(-8);
  }

  function imageDataFingerprint(imageData){
    const d=imageData.data;
    const w=imageData.width,h=imageData.height;
    const bytes=[];
    for(let y=0;y<h;y++){
      for(let x=0;x<w;x++){
        if(y>=h-MASK_BOTTOM||x>=w-MASK_RIGHT)continue;
        const i=(y*w+x)*4;
        // Fundo transparente/fúcsia não deve pesar na identidade.
        const a=d[i+3];
        if(a===0){bytes.push(0,0,0,0);continue;}
        bytes.push(d[i],d[i+1],d[i+2],255);
      }
    }
    return hashBytes(bytes);
  }

  function imageDistance(a,b){
    if(!a||!b||a.width!==b.width||a.height!==b.height)return Infinity;
    const ad=a.data,bd=b.data;
    let sum=0,count=0;
    for(let y=0;y<a.height-MASK_BOTTOM;y++){
      for(let x=0;x<a.width-MASK_RIGHT;x++){
        const i=(y*a.width+x)*4;
        const aa=ad[i+3],ba=bd[i+3];
        if(!aa&&!ba)continue;
        const ar=ad[i],ag=ad[i+1],ab=ad[i+2];
        const br=bd[i],bg=bd[i+1],bb=bd[i+2];
        sum+=Math.abs(ar-br)+Math.abs(ag-bg)+Math.abs(ab-bb);
        count+=3;
      }
    }
    return count?sum/count:255;
  }

  function analyzeCrop(ctx){
    const image=ctx.getImageData(0,0,TILE,TILE).data;
    let sum=0,sumSq=0,count=0,edge=0;
    for(let y=1;y<TILE-1;y++)for(let x=1;x<TILE-1;x++){
      const i=(y*TILE+x)*4;
      const lum=.2126*image[i]+.7152*image[i+1]+.0722*image[i+2];
      sum+=lum;sumSq+=lum*lum;count++;
      const left=(y*TILE+x-1)*4,up=((y-1)*TILE+x)*4;
      const ll=.2126*image[left]+.7152*image[left+1]+.0722*image[left+2];
      const ul=.2126*image[up]+.7152*image[up+1]+.0722*image[up+2];
      edge+=Math.abs(lum-ll)+Math.abs(lum-ul);
    }
    const mean=sum/count;
    const variance=Math.max(0,sumSq/count-mean*mean);
    return {mean,variance,edge,visualContent:variance>90||edge>7000};
  }

  function extractGrid(report){
    if(!report||!report.grid||!report.c)return null;
    const g=report.grid,source=report.c,slots=[];
    for(let row=0;row<ROWS;row++)for(let col=0;col<COLS;col++){
      const slot=row*COLS+col+1;
      const x=Math.round(g.x+col*PITCH+SPRITE_X),y=Math.round(g.y+row*PITCH+SPRITE_Y);
      const crop=document.createElement('canvas');crop.width=TILE;crop.height=TILE;
      const ctx=crop.getContext('2d',{willReadFrequently:true});ctx.imageSmoothingEnabled=false;
      ctx.drawImage(source,x,y,TILE,TILE,0,0,TILE,TILE);
      const pixels=ctx.getImageData(0,0,TILE,TILE),stats=analyzeCrop(ctx);
      slots.push({slot,row:row+1,col:col+1,x,y,crop,dataUrl:crop.toDataURL('image/png'),fingerprint:imageDataFingerprint(pixels),mean:stats.mean,variance:stats.variance,edge:stats.edge,visualContent:stats.visualContent});
    }
    return {version:VERSION,total:slots.length,rows:ROWS,cols:COLS,pitch:PITCH,slots,fingerprintCounts:slots.reduce((a,s)=>(a[s.fingerprint]=(a[s.fingerprint]||0)+1,a),{}),visualSlots:slots.filter(s=>s.visualContent).length};
  }

  function normalizeSpriteSource(source){
    if(source instanceof HTMLImageElement){
      const c=document.createElement('canvas');c.width=TILE;c.height=TILE;const x=c.getContext('2d',{willReadFrequently:true});x.imageSmoothingEnabled=false;x.drawImage(source,0,0,TILE,TILE);return x.getImageData(0,0,TILE,TILE);
    }
    if(source instanceof HTMLCanvasElement)return source.getContext('2d',{willReadFrequently:true}).getImageData(0,0,TILE,TILE);
    return null;
  }

  function buildSpriteIndex(entries){
    const list=[];
    (Array.isArray(entries)?entries:[]).forEach((entry,i)=>{
      const data=normalizeSpriteSource(entry.image||entry.src||entry.canvas);
      if(!data)return;
      list.push({id:entry.id??entry.itemId??i,name:entry.name||'',data,fingerprint:imageDataFingerprint(data),npcPrice:Number(entry.npcPrice||0)||0,marketPrice:Number(entry.marketPrice||0)||0});
    });
    const buckets=new Map();list.forEach(s=>{if(!buckets.has(s.fingerprint))buckets.set(s.fingerprint,[]);buckets.get(s.fingerprint).push(s);});
    spriteIndex={version:VERSION,total:list.length,list,buckets};
    return spriteIndex;
  }

  function registerSprites(entries){
    return buildSpriteIndex(entries);
  }

  function matchSlot(slot,options={}){
    if(!spriteIndex||!slot?.crop)return {status:'no-sprite-database',slot:slot?.slot??null,candidates:[]};
    const ctx=slot.crop.getContext('2d',{willReadFrequently:true}),data=ctx.getImageData(0,0,TILE,TILE),fp=imageDataFingerprint(data);
    const exact=spriteIndex.buckets.get(fp)||[];
    if(exact.length)return {status:exact.length===1?'matched':'ambiguous',slot:slot.slot,candidates:exact.map(s=>({id:s.id,name:s.name,distance:0,npcPrice:s.npcPrice,marketPrice:s.marketPrice}))};
    const limit=Math.max(1,Number(options.limit||5));
    const ranked=spriteIndex.list.map(s=>({s,distance:imageDistance(data,s.data)})).sort((a,b)=>a.distance-b.distance).slice(0,limit);
    const threshold=Number(options.threshold??18);
    const candidates=ranked.filter(x=>x.distance<=threshold).map(x=>({id:x.s.id,name:x.s.name,distance:Number(x.distance.toFixed(3)),npcPrice:x.s.npcPrice,marketPrice:x.s.marketPrice}));
    return {status:candidates.length?(candidates.length===1?'matched':'ambiguous'):'unknown',slot:slot.slot,candidates};
  }

  function matchAll(options={}){
    return latestReports.flatMap((report,printIndex)=>report?.stashExtraction?.slots?.map(slot=>({...matchSlot(slot,options),printIndex,row:slot.row,col:slot.col}))||[]);
  }

  function summarize(reports){
    const valid=reports.filter(r=>r&&r.grid&&r.stashExtraction);
    const total=valid.reduce((n,r)=>n+r.stashExtraction.total,0);
    const visual=valid.reduce((n,r)=>n+r.stashExtraction.visualSlots,0);
    const fingerprints=new Map();valid.forEach(r=>r.stashExtraction.slots.forEach(s=>fingerprints.set(s.fingerprint,(fingerprints.get(s.fingerprint)||0)+1)));
    let repeated=0;fingerprints.forEach(n=>{if(n>1)repeated+=n-1;});
    return {prints:valid.length,totalSlots:total,visualSlots:visual,repeatedCrops:repeated};
  }

  function updatePanel(reports){
    const panel=document.getElementById('stashDetector');if(!panel)return;
    const s=summarize(reports);let box=document.getElementById('stashExtractionStatus');
    if(!box){box=document.createElement('div');box.id='stashExtractionStatus';box.style.cssText='margin-top:14px;padding:12px 14px;border:1px solid var(--line);border-radius:10px;background:rgba(255,255,255,.025)';panel.appendChild(box);}
    box.innerHTML=`<strong>Etapa 3 · matcher preparado</strong><br><span class="stash-note">${s.totalSlots} slots extraídos em ${s.prints} print${s.prints===1?'':'s'} · comparação pixel a pixel pronta para a base de sprites · sem chute de nome.</span>`;
  }

  async function processReports(reports){
    latestReports=Array.isArray(reports)?reports:[];
    latestReports.forEach(report=>{if(report&&report.grid)report.stashExtraction=extractGrid(report);});
    updatePanel(latestReports);return latestReports;
  }

  window.StashRecognition={
    version:VERSION,status:'sprite-matcher-ready',
    getReports:()=>latestReports.length?latestReports:(window.__stashReports||[]),
    getSlots:(printIndex=0)=>latestReports[printIndex]?.stashExtraction?.slots||[],
    processReports,extractGrid,registerSprites,buildSpriteIndex,matchSlot,matchAll,
    getSpriteIndex:()=>spriteIndex
  };

  try{Object.defineProperty(window,'__stashReports',{configurable:true,get:()=>latestReports,set:value=>processReports(value)});}catch(e){console.warn('StashRecognition: observador indisponível.',e);}
})();

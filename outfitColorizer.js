(()=>{if(window.__arenaOutfitColorizer)return;window.__arenaOutfitColorizer=true;
const cache=new Map(),hex=v=>{const s=String(v||'').replace('#','');return/^[0-9a-f]{6}$/i.test(s)?[parseInt(s.slice(0,2),16),parseInt(s.slice(2,4),16),parseInt(s.slice(4,6),16)]:[255,255,255]};
const load=src=>new Promise((ok,no)=>{const i=new Image();i.decoding='async';i.crossOrigin='anonymous';i.onload=()=>ok(i);i.onerror=no;i.src=src});
async function colorize(baseSrc,maskSrc,colors){
 const key=[baseSrc,maskSrc,colors.head,colors.body,colors.legs,colors.feet].join('|');if(cache.has(key))return cache.get(key);
 const [base,mask]=await Promise.all([load(baseSrc),load(maskSrc)]),w=base.naturalWidth||base.width,h=base.naturalHeight||base.height;
 const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d',{willReadFrequently:true});x.imageSmoothingEnabled=false;
 x.drawImage(base,0,0,w,h);const bd=x.getImageData(0,0,w,h);x.clearRect(0,0,w,h);x.drawImage(mask,0,0,w,h);const md=x.getImageData(0,0,w,h),col={head:hex(colors.head),body:hex(colors.body),legs:hex(colors.legs),feet:hex(colors.feet)};
 for(let i=0;i<bd.data.length;i+=4){if(!bd.data[i+3])continue;const r=md.data[i],g=md.data[i+1],b=md.data[i+2];let t=null;
  if(r>200&&g<50&&b<50)t=col.head;else if(r>200&&g>200&&b<50)t=col.body;else if(r<50&&g>200&&b<50)t=col.legs;else if(r<50&&g<50&&b>200)t=col.feet;
  if(t){bd.data[i]=bd.data[i]*t[0]/255;bd.data[i+1]=bd.data[i+1]*t[1]/255;bd.data[i+2]=bd.data[i+2]*t[2]/255}
 }
 x.putImageData(bd,0,0);cache.set(key,c);return c;
}
window.arenaOutfitColorizer={colorize,clear:()=>cache.clear()};
})();
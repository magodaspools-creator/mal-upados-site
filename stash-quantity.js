(function(){
'use strict';
const W=32,H=32;
function gray(d,x,y){const i=(y*W+x)*4;return .2126*d[i]+.7152*d[i+1]+.0722*d[i+2];}
function detect(slot){
 if(!slot?.crop)return null;
 const c=slot.crop,d=c.getContext('2d',{willReadFrequently:true}).getImageData(0,0,W,H).data;
 let bright=0;
 for(let y=19;y<32;y++)for(let x=20;x<32;x++){const v=gray(d,x,y);if(v>185&&v>gray(d,Math.max(0,x-1),y)+28)bright++;}
 if(bright<2)return 1;
 return null;
}
window.StashQuantity={version:'2026.09.11-quantity-ocr',detect};
})();

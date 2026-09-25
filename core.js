/* shared helpers, state and dom access used by every stage */

/* ---------- helpers ---------- */
export var lerp=function(a,b,t){return a+(b-a)*t;};
export var clamp=function(v,a,b){return v<a?a:(v>b?b:v);};
export var easeInOut=function(t){return t<0.5?2*t*t:1-Math.pow(-2*t+2,2)/2;};
export var mixC=function(a,b,t){return [lerp(a[0],b[0],t),lerp(a[1],b[1],t),lerp(a[2],b[2],t)];};
export var rgba=function(c,a){return 'rgba('+(c[0]|0)+','+(c[1]|0)+','+(c[2]|0)+','+a+')';};

/* ---------- state ---------- */
export var S={
  stage:'intro',
  glitch:1, glitchT:1,
  warmth:0, warmthT:0,
  fill:0, fillT:0,
  morph:0, morphT:0,
  breath:0, open:0, phase:'', rounds:5,
  holding:false, anchor:0, lastStep:-1, chosen:'',
  particles:[], figPts:null,
  slices:[], sliceAt:0, noiseAt:0, noiseX:0, noiseY:0,
  cx:0, cy:0, size:0, scale:1,
  last:0, t:0, tookHold:false
};
for(var si=0;si<18;si++) S.slices.push(0);

/* ---------- dom ---------- */
export var $=function(id){return document.getElementById(id);};
var screens={intro:$('s-intro'),breath:$('s-breath'),quiz:$('s-quiz'),anchor:$('s-anchor'),final:$('s-final')};
export function show(name){
  for(var k in screens){ screens[k].classList.remove('on'); screens[k].classList.remove('fade'); }
  if(screens[name]){ screens[name].classList.add('on'); void screens[name].offsetWidth; screens[name].classList.add('fade'); }
}
export function dots(n){
  $('steps').classList.toggle('hide',n===0);
  $('d1').classList.toggle('at',n>=1); $('d2').classList.toggle('at',n>=2); $('d3').classList.toggle('at',n>=3);
}

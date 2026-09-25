/* engine: canvas, figure, render loop, input, and the flow between stages */
import {S,$,show,dots,lerp,clamp,easeInOut,mixC,rgba} from './core.js';
import {AU,HP,audioStart,audioFrame,chord,buzz} from './audio.js';
import {startBreath,resetBreath,breathFrame} from './breath.js';
import {startQuiz,resetQuiz} from './quiz.js';
import {startAnchor,resetAnchor,anchorFrame,anchorFor,ANCHOR_TIME} from './anchor.js';

/* ---------- palette ---------- */
var COLD_TOP=[9,13,22], COLD_BOT=[16,23,38];
var WARM_TOP=[26,18,16], WARM_BOT=[52,32,20];
var STROKE_COLD=[159,182,214], STROKE_WARM=[255,196,124];
var GLOW=[255,186,104];

/* ---------- canvas ---------- */
var cv=document.getElementById('stage'), ctx=cv.getContext('2d');
var off=document.createElement('canvas'), octx=off.getContext('2d');
var W=0,H=0,DPR=1;
function resize(){
  DPR=Math.min(window.devicePixelRatio||1,2);
  W=window.innerWidth; H=window.innerHeight;
  cv.width=Math.floor(W*DPR); cv.height=Math.floor(H*DPR);
  off.width=cv.width; off.height=cv.height;
  ctx.setTransform(DPR,0,0,DPR,0,0);
  octx.setTransform(DPR,0,0,DPR,0,0);
}
window.addEventListener('resize',resize);
window.addEventListener('orientationchange',function(){setTimeout(resize,120);});

/* noise tile */
var tile=document.createElement('canvas'); tile.width=tile.height=150;
(function(){
  var c=tile.getContext('2d'), img=c.createImageData(150,150), d=img.data;
  for(var i=0;i<d.length;i+=4){var v=180+Math.random()*75;d[i]=v;d[i+1]=v;d[i+2]=v;d[i+3]=Math.random()*70;}
  c.putImageData(img,0,0);
})();

/* ---------- shapes ---------- */
var N=220;
function addArc(p,cx,cy,r,a0,a1,steps){
  for(var i=0;i<=steps;i++){var a=a0+(a1-a0)*i/steps;p.push({x:cx+Math.cos(a)*r,y:cy+Math.sin(a)*r});}
}
function addLine(p,A,B,steps){
  for(var i=1;i<=steps;i++){var t=i/steps;p.push({x:lerp(A.x,B.x,t),y:lerp(A.y,B.y,t)});}
}
function addCubic(p,A,B,C,D,steps){
  for(var i=1;i<=steps;i++){
    var t=i/steps,u=1-t;
    p.push({
      x:u*u*u*A.x+3*u*u*t*B.x+3*u*t*t*C.x+t*t*t*D.x,
      y:u*u*u*A.y+3*u*u*t*B.y+3*u*t*t*C.y+t*t*t*D.y
    });
  }
}
function resample(p,n){
  var d=[0],L=0,i;
  for(i=1;i<=p.length;i++){
    var a=p[i-1],b=p[i%p.length];
    L+=Math.hypot(b.x-a.x,b.y-a.y); d.push(L);
  }
  var out=[],j=0;
  for(i=0;i<n;i++){
    var target=L*i/n;
    while(j<d.length-2&&d[j+1]<target)j++;
    var seg=d[j+1]-d[j],t=seg>0?(target-d[j])/seg:0;
    var A=p[j],B=p[(j+1)%p.length];
    out.push({x:lerp(A.x,B.x,t),y:lerp(A.y,B.y,t)});
  }
  return out;
}
function buildFigure(){
  var p=[];
  addArc(p,100,56,33,-Math.PI/2,Math.PI/3,44);                 // top of head → right of neck
  addLine(p,{x:116.5,y:84.6},{x:116,y:95},5);
  addCubic(p,{x:116,y:95},{x:146,y:103},{x:170,y:125},{x:176,y:168},26);
  addLine(p,{x:176,y:168},{x:180,y:266},18);
  addCubic(p,{x:180,y:266},{x:182,y:292},{x:166,y:300},{x:142,y:300},16);
  addLine(p,{x:142,y:300},{x:58,y:300},10);
  addCubic(p,{x:58,y:300},{x:34,y:300},{x:18,y:292},{x:20,y:266},16);
  addLine(p,{x:20,y:266},{x:24,y:168},18);
  addCubic(p,{x:24,y:168},{x:30,y:125},{x:54,y:103},{x:84,y:95},26);
  addLine(p,{x:84,y:95},{x:83.5,y:84.6},5);
  addArc(p,100,56,33,Math.PI*2/3,Math.PI*1.5,44);              // left of neck → top of head
  return resample(p,N);
}
function buildCircle(){
  var p=[];
  for(var i=0;i<N*2;i++){
    var a=-Math.PI/2+2*Math.PI*i/(N*2);
    p.push({x:100+Math.cos(a)*99,y:160+Math.sin(a)*99});
  }
  return resample(p,N);
}
var FIG=buildFigure(), CIR=buildCircle();

/* ---------- flow ---------- */
var KEPT_NOTE="It's in there now. Stay as long as you like — the light doesn't run out.";
var ENDED="That's all for now.", ENDED_NOTE="Stay as long as you like.";

function toBreath(){ startBreath(toQuiz); }
function toQuiz(){ startQuiz(toAnchor); }
function toAnchor(picks){
  var id=anchorFor(picks);
  if(id) startAnchor(id,toFinal);
  else toFinal(true);            /* "Finish here": no anchoring; A17 only if they ask */
}
/* kept: the chosen line filled the figure; otherwise it ended without one */
function toFinal(offer){
  var kept=S.chosen;
  S.stage='final'; S.fillT=kept?1:0; S.warmthT=kept?1:0.72; S.glitchT=0;
  $('finalPhrase').textContent=kept||ENDED;
  $('finalNote').textContent=kept?KEPT_NOTE:ENDED_NOTE;
  $('thoughtBtn').style.display=offer?'':'none';
  show('final'); dots(3);
  if(kept){ chord(); buzz([60,90,80,110,120,140,160,200,120]); }
}

/* ---------- draw ---------- */
function drawBackground(){
  var top=mixC(COLD_TOP,WARM_TOP,S.warmth), bot=mixC(COLD_BOT,WARM_BOT,S.warmth);
  var g=ctx.createLinearGradient(0,0,0,H);
  g.addColorStop(0,rgba(top,1)); g.addColorStop(1,rgba(bot,1));
  ctx.fillStyle=g; ctx.fillRect(0,0,W,H);

  var halo=ctx.createRadialGradient(S.cx,S.cy,4,S.cx,S.cy,S.size*1.5);
  halo.addColorStop(0,rgba(mixC([70,100,150],GLOW,S.warmth),0.14+0.22*S.warmth));
  halo.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=halo; ctx.fillRect(0,0,W,H);

  if(S.glitch>0.02){
    ctx.save(); ctx.globalAlpha=0.10*S.glitch;
    var p=ctx.createPattern(tile,'repeat');
    ctx.translate(S.noiseX,S.noiseY); ctx.fillStyle=p; ctx.fillRect(-160,-160,W+320,H+320);
    ctx.restore();
  }
}
function currentPoints(){
  var pts=[],m=S.morph,s=S.size/280;
  for(var i=0;i<N;i++){
    var a=CIR[i],b=FIG[i];
    var x=lerp(a.x,b.x,m), y=lerp(a.y,b.y,m);
    pts.push({x:S.cx+(x-100)*s*S.scale, y:S.cy+(y-160)*s*S.scale});
  }
  return pts;
}
function tracePath(c,pts){
  c.beginPath(); c.moveTo(pts[0].x,pts[0].y);
  for(var i=1;i<pts.length;i++){
    var a=pts[i], b=pts[(i+1)%pts.length];
    c.quadraticCurveTo(a.x,a.y,(a.x+b.x)/2,(a.y+b.y)/2);
  }
  c.closePath();
}
function drawFigure(){
  var pts=currentPoints();
  octx.clearRect(0,0,W,H);
  var stroke=mixC(STROKE_COLD,STROKE_WARM,S.warmth);

  S.figPts=pts;
  tracePath(octx,pts);

  var inner=octx.createRadialGradient(S.cx,S.cy+S.size*0.08,2,S.cx,S.cy,S.size*0.78);
  if(S.fill>0.01){
    inner.addColorStop(0,rgba(GLOW,0.15+0.80*S.fill));
    inner.addColorStop(0.55,rgba(mixC([90,120,170],GLOW,S.warmth),0.10+0.42*S.fill));
    inner.addColorStop(1,rgba(GLOW,0.04*S.fill));
  } else {
    inner.addColorStop(0,rgba(mixC([70,95,140],[150,110,70],S.warmth),0.20));
    inner.addColorStop(1,'rgba(0,0,0,0)');
  }
  octx.fillStyle=inner; octx.fill();

  octx.save();
  octx.globalCompositeOperation='lighter';
  var dx=8*S.glitch;
  if(dx>0.3){
    octx.lineWidth=1.6;
    octx.strokeStyle='rgba(60,190,225,'+(0.45*S.glitch)+')';
    octx.save(); octx.translate(-dx,S.glitch*1.5); tracePath(octx,pts); octx.stroke(); octx.restore();
    octx.strokeStyle='rgba(235,80,175,'+(0.40*S.glitch)+')';
    octx.save(); octx.translate(dx,-S.glitch*1.5); tracePath(octx,pts); octx.stroke(); octx.restore();
  }
  octx.restore();

  octx.save();
  octx.lineWidth=lerp(1.4,2.4,S.warmth);
  octx.strokeStyle=rgba(stroke,lerp(0.55,0.95,1-S.glitch*0.5));
  octx.shadowColor=rgba(mixC([120,160,210],GLOW,S.warmth),0.9);
  octx.shadowBlur=10+26*S.warmth+20*S.fill;
  tracePath(octx,pts); octx.stroke();
  octx.restore();

  if(S.glitch>0.03){
    var bands=S.slices.length, bh=H/bands;
    for(var i=0;i<bands;i++){
      var o=S.slices[i]*S.glitch;
      ctx.drawImage(off, 0, i*bh*DPR, W*DPR, bh*DPR+1, o, i*bh, W, bh+0.6);
    }
  } else {
    ctx.drawImage(off,0,0,W*DPR,H*DPR,0,0,W,H);
  }
}
function drawParticles(dt){
  for(var i=S.particles.length-1;i>=0;i--){
    var p=S.particles[i];
    p.t+=dt/p.dur;
    if(p.t>=1){ S.particles.splice(i,1); continue; }
    var e=easeInOut(p.t);
    var x=lerp(p.x,p.tx,e)+Math.sin(p.t*Math.PI)*p.sw*(1-e)*0.5;
    var y=lerp(p.y,p.ty,e)-Math.sin(p.t*Math.PI)*24;
    var a=Math.sin(p.t*Math.PI)*0.9;
    var g=ctx.createRadialGradient(x,y,0,x,y,p.r*5);
    g.addColorStop(0,rgba(GLOW,a));
    g.addColorStop(1,'rgba(255,186,104,0)');
    ctx.fillStyle=g; ctx.beginPath(); ctx.arc(x,y,p.r*5,0,6.284); ctx.fill();
  }
}
function drawHoldRing(){
  if(S.stage!=='anchor'||!S.chosen||S.anchor<=0.01) return;
  var r=S.size*0.62, a=S.anchor/ANCHOR_TIME;
  ctx.save();
  ctx.strokeStyle=rgba(GLOW,0.55); ctx.lineWidth=2; ctx.lineCap='round';
  ctx.beginPath(); ctx.arc(S.cx,S.cy,r,-Math.PI/2,-Math.PI/2+6.284*a); ctx.stroke();
  ctx.restore();
}

/* ---------- loop ---------- */
function frame(now){
  requestAnimationFrame(frame);
  if(!S.last) S.last=now;
  var dt=Math.min(0.05,(now-S.last)/1000); S.last=now; S.t+=dt;

  S.size=clamp(Math.min(W*0.66,H*0.36),150,330);
  S.cx=W*0.5; S.cy=H*0.315;

  if(S.stage==='breath') breathFrame(dt);
  if(S.stage==='anchor') anchorFrame(dt);
  if(S.stage!=='breath') S.scale=lerp(S.scale,1,Math.min(1,dt*2.2));

  var k=Math.min(1,dt*1.1);
  S.glitch=lerp(S.glitch,S.glitchT,k);
  S.warmth=lerp(S.warmth,S.warmthT,k);
  S.morph=lerp(S.morph,S.morphT,Math.min(1,dt*1.3));
  S.fill=lerp(S.fill,S.fillT,Math.min(1,dt*2.5));

  if(S.t>S.sliceAt){
    S.sliceAt=S.t+0.11;
    for(var i=0;i<S.slices.length;i++) S.slices[i]=Math.random()<0.34?(Math.random()-0.5)*34:0;
  }
  if(S.t>S.noiseAt){ S.noiseAt=S.t+0.09; S.noiseX=Math.random()*150; S.noiseY=Math.random()*150; }

  ctx.clearRect(0,0,W,H);
  drawBackground();
  drawFigure();
  drawHoldRing();
  drawParticles(dt);
  audioFrame();
}

/* ---------- input ---------- */
function interactive(t){ return t && t.closest && t.closest('button,input,a,label'); }
window.addEventListener('pointerdown',function(e){
  if(interactive(e.target)) return;
  S.holding=true;
  if(S.stage==='breath'&&!S.tookHold) audioStart();
},{passive:true});
['pointerup','pointercancel','pointerleave'].forEach(function(ev){
  window.addEventListener(ev,function(){ S.holding=false; },{passive:true});
});
document.addEventListener('contextmenu',function(e){e.preventDefault();});

$('begin').addEventListener('click',function(){
  audioStart(); buzz(20); toBreath();
});
$('thoughtBtn').addEventListener('click',function(){ startAnchor('A17',toFinal); });
$('again').addEventListener('click',function(){
  resetBreath(); resetQuiz(); resetAnchor();
  S.glitchT=1; S.warmthT=0; S.fillT=0; S.morphT=0; S.scale=1;
  toBreath();
});
$('pSound').addEventListener('click',function(){
  AU.on=!AU.on; $('pSound').classList.toggle('off',!AU.on);
  if(AU.ready){ AU.master.gain.setTargetAtTime(AU.on?0.85:0.0001,AU.ac.currentTime,0.3); }
  else if(AU.on) audioStart();
});
$('pBuzz').addEventListener('click',function(){
  HP.on=!HP.on; $('pBuzz').classList.toggle('off',!HP.on);
  if(HP.on) buzz(20); else if(navigator.vibrate) navigator.vibrate(0);
});

/* ---------- go ---------- */
resize();
dots(0);
requestAnimationFrame(frame);

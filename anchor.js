/* stage 3: anchor — select a thought, edit or skip, then hold the thought until the ring fills */
import {S,$,show,dots} from './core.js';
import {tone,buzz} from './audio.js';
import {Anchors,AnchorRules} from './questions.js';

export var ANCHOR_TIME=4.2;
var TITLE='Choose a thought to keep';
var HOLD='Press and hold the thought until the ring fills.';
var line='', mode='', spawnAt=0, onDone=null;

/* the anchor a finished walk ('node.answer' ids) leads to, or '' when it ended with "Finish here" */
export function anchorFor(picks){
  var last=picks[picks.length-1];
  var hit=AnchorRules.find(function(r){
    return r.last.indexOf(last)>=0 &&
      (!r.after||r.after.some(function(p){ return picks.indexOf(p)>=0; }));
  });
  return hit?hit.anchor:'';
}

export function startAnchor(id,done){
  resetAnchor();
  onDone=done; line=Anchors[id];
  S.stage='anchor'; S.chosen=''; S.glitchT=0; S.warmthT=0.72; dots(3); show('anchor');
  $('phrase').textContent=line;
  card('suggest');
}
export function resetAnchor(){
  S.chosen=''; S.anchor=0; S.fillT=0; S.holding=false; S.lastStep=-1; S.particles=[];
}

/* suggest: click to select; edit: rewrite it; hold: press the selected thought to fill */
function card(m){
  mode=m;
  $('anchorSay').textContent= m==='hold'?HOLD:m==='edit'?'Write your own thought':TITLE;
  $('thoughtCard').style.display= m==='edit'?'none':'';
  $('thoughtCard').classList.toggle('chosen',m==='hold');
  $('phrase').setAttribute('aria-pressed',m==='hold'?'true':'false');
  $('ownWrap').style.display= m==='edit'?'block':'none';
  $('keepBtn').style.display= m==='edit'?'':'none';
  $('editBtn').style.display= m==='hold'?'':'none';
}
function keep(){
  var txt= mode==='edit'?$('own').value.trim():$('phrase').textContent;
  if(!txt){ $('own').focus(); return; }
  S.chosen=txt; $('phrase').textContent=txt; $('own').blur();
  card('hold');
  tone(523.25,1.8,0.08,'sine');
}

/* ---------- card actions ---------- */
$('keepBtn').addEventListener('click',keep);
$('phrase').addEventListener('click',function(){
  if(S.stage==='anchor'&&mode==='suggest') keep();
});
$('phrase').addEventListener('pointerdown',function(e){
  if(S.stage!=='anchor'||mode!=='hold'||!e.isPrimary||e.button!==0) return;
  S.holding=true;
  this.setPointerCapture(e.pointerId);
});
$('phrase').addEventListener('lostpointercapture',function(){ S.holding=false; });
$('phrase').addEventListener('keydown',function(e){
  if(S.stage==='anchor'&&mode==='hold'&&(e.key===' '||e.key==='Enter')){
    e.preventDefault(); S.holding=true;
  }
});
$('phrase').addEventListener('keyup',function(e){
  if(e.key===' '||e.key==='Enter') S.holding=false;
});
$('phrase').addEventListener('blur',function(){ S.holding=false; });
window.addEventListener('blur',function(){ S.holding=false; });
$('editBtn').addEventListener('click',function(){
  var own=$('own'), txt=$('phrase').textContent;
  resetAnchor(); own.value=txt;
  card('edit');
  own.focus(); own.setSelectionRange(txt.length,txt.length);
});
$('skipBtn').addEventListener('click',function(){
  resetAnchor(); onDone();
});
$('own').addEventListener('keydown',function(e){
  if(e.key==='Enter'){ e.preventDefault(); keep(); }
});

/* ---------- holding ---------- */
export function anchorFrame(dt){
  if(!S.chosen) return;
  if(S.holding){
    S.anchor=Math.min(ANCHOR_TIME,S.anchor+dt);
    S.fillT=S.anchor/ANCHOR_TIME;
    S.warmthT=0.72+0.28*(S.anchor/ANCHOR_TIME);
    if(S.t>spawnAt){ spawnAt=S.t+0.07; spawnParticles(2); }
    var step=Math.floor(S.anchor/0.7);
    if(step!==S.lastStep){ S.lastStep=step; buzz(16+step*10); }
    if(S.anchor>=ANCHOR_TIME){ S.holding=false; onDone(); }
  } else {
    S.anchor=Math.max(0,S.anchor-dt*0.35);
    S.fillT=S.anchor/ANCHOR_TIME;
  }
}
function spawnParticles(n){
  var el=document.querySelector('.phrase.chosen');
  var ox=window.innerWidth*0.5, oy=window.innerHeight*0.78;
  if(el){ var r=el.getBoundingClientRect(); ox=r.left+r.width*(0.2+Math.random()*0.6); oy=r.top+r.height*0.5; }
  for(var i=0;i<n;i++){
    var tgt=insidePoint();
    S.particles.push({
      x:ox+(Math.random()-0.5)*20, y:oy+(Math.random()-0.5)*14,
      tx:tgt.x, ty:tgt.y, t:0, dur:1.1+Math.random()*0.9,
      r:1+Math.random()*2.1, sw:(Math.random()-0.5)*90
    });
  }
}
function inPoly(pts,x,y){
  var inside=false;
  for(var i=0,j=pts.length-1;i<pts.length;j=i++){
    var xi=pts[i].x,yi=pts[i].y,xj=pts[j].x,yj=pts[j].y;
    if(((yi>y)!==(yj>y)) && (x < (xj-xi)*(y-yi)/((yj-yi)||1e-6)+xi)) inside=!inside;
  }
  return inside;
}
function insidePoint(){
  var pts=S.figPts;
  if(!pts) return {x:S.cx,y:S.cy};
  for(var i=0;i<26;i++){
    var x=S.cx+(Math.random()-0.5)*S.size*0.66;
    var y=S.cy+(Math.random()-0.5)*S.size*1.0;
    if(inPoly(pts,x,y)) return {x:x,y:y};
  }
  return {x:S.cx,y:S.cy+S.size*0.12};
}

/* stage 3: affirmation — pick (or write) a line, then hold the figure until it fills */
import {S,$,show,dots} from './core.js';
import {tone,buzz} from './audio.js';
import {pickLines} from './quiz.js';

export var ANCHOR_TIME=4.2;
var SAY="Take the sentence you'd like to keep.";
var spawnAt=0, onDone=null;

export function startAnchor(done){
  onDone=done;
  S.stage='anchor'; S.glitchT=0; S.warmthT=0.72; dots(3); show('anchor');
  var lines=pickLines(), box=$('phrases'); box.innerHTML='';
  lines.forEach(function(txt){
    var b=document.createElement('button');
    b.className='phrase'; b.type='button'; b.textContent=txt;
    b.addEventListener('click',function(){ choose(b,txt); });
    box.appendChild(b);
  });
  $('ownBtn').style.display='';
  $('ownWrap').style.display='none';
  $('anchorHint').textContent='';
}
export function resetAnchor(){
  S.chosen=''; S.anchor=0; S.lastStep=-1; S.particles=[];
  $('anchorSay').textContent=SAY;
  $('own').value=''; $('own').classList.remove('chosen');
}

/* el is a .phrase button or the #own input */
function choose(el,txt){
  S.chosen=txt;
  var all=document.querySelectorAll('.phrase');
  for(var i=0;i<all.length;i++){
    all[i].classList.remove('chosen');
    all[i].classList.toggle('dim',all[i]!==el);
  }
  $('own').classList.remove('chosen');
  if(el) el.classList.add('chosen');
  $('anchorSay').textContent='Now press and hold the figure until the words are inside.';
  $('anchorHint').textContent='Four seconds, more or less.';
  $('ownBtn').style.display='none';
  tone(523.25,1.8,0.08,'sine');
}

/* ---------- own phrase ---------- */
$('ownBtn').addEventListener('click',function(){
  $('ownWrap').style.display='block'; $('ownBtn').style.display='none'; $('own').focus();
});
$('own').addEventListener('keydown',function(e){ if(e.key==='Enter') $('own').blur(); });
$('own').addEventListener('blur',function(){
  var v=$('own').value.trim();
  if(v) choose($('own'),v);
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
    if(S.anchor>=ANCHOR_TIME) onDone();
  } else {
    S.anchor=Math.max(0,S.anchor-dt*0.35);
    S.fillT=S.anchor/ANCHOR_TIME;
  }
}
function spawnParticles(n){
  var el=document.querySelector('.phrase.chosen')||document.querySelector('#own.chosen');
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

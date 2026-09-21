/* stage 2: quiz — a few questions; answers tag the lines the anchor stage offers */
import {S,$,show,dots} from './core.js';
import {tone,buzz} from './audio.js';

/* ---------- content ---------- */
var QUESTIONS=[
  { q:"What are you doing now that you couldn't do three years ago?",
    a:[{t:"Work that used to intimidate me",g:["growth","experience"]},
       {t:"Speaking up where I used to stay quiet",g:["belonging","growth"]},
       {t:"Carrying something that actually matters",g:["experience","enough"]}]},
  { q:"When the doubt talks, whose voice is it using?",
    a:[{t:"Someone else's, from a long time ago",g:["borrowed"]},
       {t:"A younger, more frightened me",g:["compassion","borrowed"]},
       {t:"I can't tell — it just sounds like the truth",g:["presence","borrowed"]}]},
  { q:"A friend feels exactly this today. What do you say to them?",
    a:[{t:"You're further along than you can see",g:["growth"]},
       {t:"Nobody starts out already knowing",g:["process","permission"]},
       {t:"You don't have to earn your place",g:["belonging","compassion"]}]},
  { q:"What would be enough for today?",
    a:[{t:"One honest step",g:["process","enough"]},
       {t:"Showing up at all",g:["enough","compassion"]},
       {t:"Finishing one small thing",g:["enough","growth"]}]}
];
var LINES={
  growth:"I have already come further than I can see.",
  experience:"What I've lived through is real.",
  belonging:"I belong in the rooms I'm in.",
  borrowed:"That voice is not mine to obey.",
  compassion:"I can meet myself the way I meet a friend.",
  process:"I don't have to know everything to begin.",
  permission:"I'm allowed to be new at this.",
  enough:"What I give today is enough.",
  presence:"I can trust what I notice."
};
var ORDER=["experience","growth","enough","permission","borrowed","compassion","process","belonging","presence"];
var tags={}, qi=0, onDone=null;

export function pickLines(){
  var scored=ORDER.map(function(k,i){return {k:k,s:(tags[k]||0)-i*0.01};});
  scored.sort(function(a,b){return b.s-a.s;});
  var out=[];
  for(var i=0;i<scored.length&&out.length<3;i++){
    if(scored[i].s>0) out.push(LINES[scored[i].k]);
  }
  var fallback=[LINES.experience,LINES.permission,LINES.enough];
  for(var j=0;out.length<3;j++) if(out.indexOf(fallback[j])<0) out.push(fallback[j]);
  return out;
}

/* ---------- flow ---------- */
export function startQuiz(done){
  onDone=done;
  S.stage='morph'; S.morphT=1; buzz(24); show('none');
  setTimeout(function(){
    S.stage='quiz'; qi=0; dots(2); show('quiz'); renderQuestion();
  },1700);
}
export function resetQuiz(){ tags={}; qi=0; }

function renderQuestion(){
  var Q=QUESTIONS[qi];
  $('question').textContent=Q.q;
  var box=$('opts'); box.innerHTML='';
  Q.a.forEach(function(opt){
    var b=document.createElement('button');
    b.className='opt'; b.type='button'; b.textContent=opt.t;
    b.addEventListener('click',function(){ answer(b,opt); });
    box.appendChild(b);
  });
  $('quizHint').textContent = qi===0 ? "Pick the one that's closest. Close is enough." : '';
}
function answer(el,opt){
  if(el.classList.contains('picked')) return;
  el.classList.add('picked');
  opt.g.forEach(function(g){ tags[g]=(tags[g]||0)+1; });
  tone([392,440,523.25,587.33][qi]||440,1.6,0.09,'sine');
  buzz([12,60,18]);
  qi++;
  S.glitchT=0.38*(1-qi/QUESTIONS.length);
  S.warmthT=0.30+0.38*(qi/QUESTIONS.length);
  setTimeout(function(){
    if(qi<QUESTIONS.length) renderQuestion();
    else onDone();
  },620);
}

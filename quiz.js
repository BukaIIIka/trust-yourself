/* stage 2: quiz — walk the question tree; the release node reached picks the lines the anchor stage offers */
import {S,$,show,dots} from './core.js';
import {tone,buzz} from './audio.js';
import {Questions,ReleasePhrases,BranchRelease} from './questions.js';

var DEPTH=8;                 /* a typical walk; progress effects saturate past it */
var node='root', path=[], release='', steps=0, onDone=null;

/* the release phrase first, then phrases of the branches walked most recently, up to 3 */
export function pickLines(){
  var types=[release];
  for(var i=path.length-1;i>=0;i--) types.push(BranchRelease[path[i].split('_')[0]]);
  var out=[];
  types.forEach(function(t){
    var p=ReleasePhrases[t];
    if(p&&out.indexOf(p)<0&&out.length<3) out.push(p);
  });
  if(!out.length) out.push(ReleasePhrases.meta);
  return out;
}

/* ---------- flow ---------- */
export function startQuiz(done){
  onDone=done;
  S.stage='morph'; S.morphT=1; buzz(24); show('none');
  setTimeout(function(){
    S.stage='quiz'; dots(2); show('quiz'); renderQuestion();
  },1700);
}
export function resetQuiz(){ node='root'; path=[]; release=''; steps=0; }

function renderQuestion(){
  var Q=Questions.get(node);
  $('question').textContent=Q.question;
  var box=$('opts'); box.innerHTML=''; box.scrollTop=0;
  Q.answers.forEach(function(opt){
    var b=document.createElement('button');
    b.className='opt'; b.type='button'; b.textContent=opt.text;
    b.addEventListener('click',function(){ answer(b,opt); });
    box.appendChild(b);
  });
  $('quizHint').textContent = node==='root' ? "Pick the one that's closest. Close is enough." : '';
}
function answer(el,opt){
  if(el.classList.contains('picked')) return;
  el.classList.add('picked');
  var Q=Questions.get(node);
  if(Q.release) release=Q.release;
  path.push(node); steps++;
  node=opt.next_option;
  tone([392,440,523.25,587.33][(steps-1)%4],1.6,0.09,'sine');
  buzz([12,60,18]);
  var p=Math.min(1,steps/DEPTH);
  S.glitchT=0.38*(1-p);
  S.warmthT=0.30+0.38*p;
  setTimeout(function(){
    if(node==='END') onDone();
    else renderQuestion();
  },620);
}

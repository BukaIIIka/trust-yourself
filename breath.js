/* stage 1: breath — press and hold, follow the circle for a few rounds */
import {S,$,show,dots,lerp,clamp,easeInOut} from './core.js';
import {buzz} from './audio.js';

var CYCLE=12, IN=4, OUT=8;
var TICK=12, TURN=[28,70,28]; /* soft tick each second; firmer double pulse when direction turns */
var NOTE="Keep your thumb anywhere on the screen. The circle will set the pace — follow it loosely, not perfectly.";
var onDone=null, lastSec=-1;

export function startBreath(done){
  onDone=done;
  S.stage='breath'; dots(1); show('breath');
  S.phase=''; $('phase').textContent='Press and hold';
  $('breathSkip').style.visibility='hidden';
}
export function resetBreath(){
  S.breath=0; S.tookHold=false; lastSec=-1;
  $('breathNote').textContent=NOTE;
}

export function breathFrame(dt){
  if(S.holding){
    S.breath+=dt;
    if(!S.tookHold){S.tookHold=true;$('breathNote').textContent="Follow the circle. In as it grows, out as it lets go.";}
  }
  var total=CYCLE*S.rounds;
  var p=clamp(S.breath/total,0,1);
  S.glitchT=1-0.62*p;
  S.warmthT=0.30*p;

  var local=S.breath%CYCLE, ph, e;
  if(local<IN){ ph='in'; e=easeInOut(local/IN); }
  else { ph='out'; e=1-easeInOut((local-IN)/OUT); }
  S.open=e;
  S.scale=lerp(S.scale,0.66+0.40*e,Math.min(1,dt*7));

  var r=Math.min(S.rounds,Math.floor(S.breath/CYCLE)+1);
  $('round').textContent='Round '+r+' of '+S.rounds;

  /* skip is only offered while paused, once they've tried it */
  var skip=!S.holding&&S.tookHold?'visible':'hidden';
  if($('breathSkip').style.visibility!==skip) $('breathSkip').style.visibility=skip;

  if(!S.holding){
    if($('phase').textContent!=='Paused'){ $('phase').textContent='Paused'; }
    $('breathHint').textContent=S.tookHold?'Rest your thumb back whenever you want. Nothing is lost.':'';
  } else if(ph!==S.phase||$('phase').textContent==='Paused'){
    S.phase=ph; lastSec=Math.floor(S.breath);
    $('phase').textContent= ph==='in'?'Breathe in':'Let it out';
    $('breathHint').textContent='';
    buzz(TURN);
  } else if(Math.floor(S.breath)!==lastSec){
    lastSec=Math.floor(S.breath);
    buzz(TICK);
  }

  if(S.breath>=total) onDone();
}

/* skip: leave as if the rounds were finished */
$('breathSkip').addEventListener('click',function(){
  if(S.stage!=='breath') return;
  S.glitchT=0.38; S.warmthT=0.30;
  $('breathSkip').style.visibility='hidden';
  onDone();
});

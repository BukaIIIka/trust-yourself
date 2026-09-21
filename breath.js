/* stage 1: breath — press and hold, follow the circle for a few rounds */
import {S,$,show,dots,lerp,clamp,easeInOut} from './core.js';
import {buzz} from './audio.js';

var CYCLE=19, IN=4, HOLD=7, OUT=8;
var NOTE="Keep your thumb anywhere on the screen. The circle will set the pace — follow it loosely, not perfectly.";
var onDone=null;

export function startBreath(done){
  onDone=done;
  S.stage='breath'; dots(1); show('breath');
  S.phase=''; $('phase').textContent='Press and hold';
}
export function resetBreath(){
  S.breath=0; S.tookHold=false;
  $('breathNote').textContent=NOTE;
}

export function breathFrame(dt){
  if(S.holding){
    S.breath+=dt;
    if(!S.tookHold){S.tookHold=true;$('breathNote').textContent="Follow the circle. In as it grows, still as it holds, out as it lets go.";}
  }
  var total=CYCLE*S.rounds;
  var p=clamp(S.breath/total,0,1);
  S.glitchT=1-0.62*p;
  S.warmthT=0.30*p;

  var local=S.breath%CYCLE, ph, e;
  if(local<IN){ ph='in'; e=easeInOut(local/IN); }
  else if(local<IN+HOLD){ ph='hold'; e=1; }
  else { ph='out'; e=1-easeInOut((local-IN-HOLD)/OUT); }
  S.open=e;
  S.scale=lerp(S.scale,0.66+0.40*e,Math.min(1,dt*7));

  var r=Math.min(S.rounds,Math.floor(S.breath/CYCLE)+1);
  $('round').textContent='Round '+r+' of '+S.rounds;

  if(!S.holding){
    if($('phase').textContent!=='Paused'){ $('phase').textContent='Paused'; }
    $('breathHint').textContent=S.tookHold?'Rest your thumb back whenever you want. Nothing is lost.':'';
  } else if(ph!==S.phase||$('phase').textContent==='Paused'){
    S.phase=ph;
    $('phase').textContent= ph==='in'?'Breathe in':(ph==='hold'?'Hold, gently':'Let it out');
    $('breathHint').textContent='';
    if(ph==='in') buzz([14,150,14,150,16,150,18]);
    else if(ph==='out') buzz([10,260,10,260,10,260,10]);
    else buzz(8);
  }

  if(S.breath>=total) onDone();
}

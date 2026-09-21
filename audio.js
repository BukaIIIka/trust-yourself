import {S} from './core.js';

/* ---------- audio ---------- */
export var AU={on:true,ready:false};
export function audioStart(){
  if(!AU.on) return;
  if(AU.ready){ if(AU.ac.state==='suspended')AU.ac.resume(); return; }
  var AC=window.AudioContext||window.webkitAudioContext; if(!AC) return;
  var ac=new AC();
  var master=ac.createGain(); master.gain.value=0; master.connect(ac.destination);

  var lp=ac.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=320; lp.Q.value=.5;
  var dg=ac.createGain(); dg.gain.value=0; dg.connect(lp); lp.connect(master);
  var freqs=[55,110,164.81,220], amps=[.5,.32,.14,.08], oscs=[];
  for(var i=0;i<freqs.length;i++){
    var o=ac.createOscillator(); o.type='sine'; o.frequency.value=freqs[i]*(i===1?1.004:1);
    var g=ac.createGain(); g.gain.value=amps[i];
    o.connect(g); g.connect(dg); o.start(); oscs.push({o:o,g:g,f:freqs[i]});
  }
  var lfo=ac.createOscillator(); lfo.type='sine'; lfo.frequency.value=0.07;
  var lfoG=ac.createGain(); lfoG.gain.value=1.4;
  lfo.connect(lfoG); lfoG.connect(oscs[1].o.frequency); lfo.start();

  var len=Math.floor(ac.sampleRate*2), buf=ac.createBuffer(1,len,ac.sampleRate), ch=buf.getChannelData(0);
  for(var k=0;k<len;k++) ch[k]=(Math.random()*2-1)*0.45;
  var src=ac.createBufferSource(); src.buffer=buf; src.loop=true;
  var nf=ac.createBiquadFilter(); nf.type='bandpass'; nf.frequency.value=1500; nf.Q.value=.6;
  var ng=ac.createGain(); ng.gain.value=0;
  src.connect(nf); nf.connect(ng); ng.connect(master); src.start();

  AU.ac=ac; AU.master=master; AU.dg=dg; AU.lp=lp; AU.ng=ng; AU.ready=true;
  master.gain.setTargetAtTime(0.85,ac.currentTime,1.2);
  dg.gain.setTargetAtTime(0.34,ac.currentTime,2.0);
  ng.gain.setTargetAtTime(0.09,ac.currentTime,2.0);
}
export function audioFrame(){
  if(!AU.ready||!AU.on) return;
  var t=AU.ac.currentTime;
  AU.ng.gain.setTargetAtTime(0.10*S.glitch,t,0.7);
  AU.lp.frequency.setTargetAtTime(300+1100*S.warmth,t,0.9);
  AU.dg.gain.setTargetAtTime(0.28+0.22*S.open,t,0.35);
}
export function tone(freq,dur,vol,type){
  if(!AU.ready||!AU.on) return;
  var ac=AU.ac,t=ac.currentTime;
  var o=ac.createOscillator(); o.type=type||'triangle'; o.frequency.value=freq;
  var g=ac.createGain(); g.gain.setValueAtTime(0.0001,t);
  g.gain.exponentialRampToValueAtTime(vol,t+0.06);
  g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
  o.connect(g); g.connect(AU.master); o.start(t); o.stop(t+dur+0.1);
}
export function chord(){
  if(!AU.ready||!AU.on) return;
  var f=[261.63,329.63,392.00,493.88,523.25];
  for(var i=0;i<f.length;i++){
    (function(fr,d){setTimeout(function(){tone(fr,5.5,0.10,'sine');},d);})(f[i],i*260);
  }
}

/* ---------- haptics ---------- */
export var HP={on:true};
export function buzz(p){
  if(!HP.on||!navigator.vibrate) return;
  try{navigator.vibrate(p);}catch(e){}
}

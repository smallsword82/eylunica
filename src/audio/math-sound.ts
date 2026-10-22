// Original procedural tones; no recordings, artist samples or third-party music.
import {getSoundMode} from './index';
import {stopManifestAudio,getManifestPlayback} from './manifest';
let context:AudioContext|undefined,timer:ReturnType<typeof setInterval>|undefined;
let generation=0;
let master:GainNode|undefined,level=.12,enabled=true,ducked=false;
const playing=new Set<OscillatorNode>();
function audio(){context??=new AudioContext();if(!master){master=context.createGain();master.connect(context.destination);}master.gain.value=level*getManifestPlayback().volume*(ducked ? .15 : 1);return context;}
function note(hz:number,offset:number,duration:number,gain=.035){const c=audio(),osc=c.createOscillator(),g=c.createGain();osc.type='sine';osc.frequency.value=hz;const start=c.currentTime+offset;g.gain.setValueAtTime(0,start);g.gain.linearRampToValueAtTime(gain,start+.12);g.gain.exponentialRampToValueAtTime(.0001,start+duration);osc.connect(g);g.connect(master!);osc.start(start);osc.stop(start+duration+.1);playing.add(osc);osc.onended=()=>{playing.delete(osc);osc.disconnect();g.disconnect();};}
export async function startMathMusic(){stopManifestAudio();if(!enabled||getSoundMode()!=='music'||document.hidden)return;try{const ticket=generation,c=audio();await c.resume();if(ticket!==generation||document.hidden||getSoundMode()!=='music'||timer)return;let bar=0;const phrase=()=>{if(document.hidden)return;const roots=[130.81,146.83,164.81,146.83];const root=roots[bar++%roots.length];[1,1.5,2].forEach((ratio,i)=>note(root*ratio,i*.55,4.5,.022));};phrase();timer=setInterval(phrase,5500);}catch{/* audio permission can remain disabled */}}
export function stopMathMusic(){generation++;if(timer)clearInterval(timer);timer=undefined;for(const osc of playing){try{osc.stop();}catch{}}playing.clear();}
export function setMathVolume(value:number){level=Math.min(.3,Math.max(0,value));if(master)master.gain.value=level*getManifestPlayback().volume*(ducked ? .15 : 1);}
export function setMathMusic(value:boolean){enabled=value;if(!value)stopMathMusic();else void startMathMusic();}
export async function mathChime(correct=true){if(getSoundMode()==='silent'||document.hidden)return;try{const ticket=generation;await audio().resume();if(ticket!==generation||document.hidden||getSoundMode()==='silent')return;(correct?[523.25,659.25,783.99]:[293.66,261.63]).forEach((hz,i)=>note(hz,i*.1,.35,.12));}catch{}}

export function duckMathMusic(value:boolean){ducked=value;if(master)master.gain.value=level*getManifestPlayback().volume*(ducked ? .15 : 1);}

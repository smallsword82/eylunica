import {afterEach,beforeEach,expect,it,vi} from 'vitest';
const prefs=vi.hoisted(()=>({mode:'music',stop:vi.fn()}));
vi.mock('./index',()=>({getSoundMode:()=>prefs.mode}));
vi.mock('./manifest',()=>({stopManifestAudio:prefs.stop,getManifestPlayback:()=>({volume:.35})}));
let oscillators:any[]=[];
class FakeContext{
 currentTime=0;destination={};resume=vi.fn(async()=>{});
 createGain(){return {connect:vi.fn(),disconnect:vi.fn(),gain:{value:0,setValueAtTime:vi.fn(),linearRampToValueAtTime:vi.fn(),exponentialRampToValueAtTime:vi.fn()}};}
 createOscillator(){const osc={type:'',frequency:{value:0},connect:vi.fn(),disconnect:vi.fn(),start:vi.fn(),stop:vi.fn(),onended:null};oscillators.push(osc);return osc;}
}
beforeEach(()=>{vi.resetModules();vi.useFakeTimers();prefs.mode='music';prefs.stop.mockClear();oscillators=[];vi.stubGlobal('AudioContext',FakeContext);});
afterEach(async()=>{const sound=await import('./math-sound');sound.stopMathMusic();vi.useRealTimers();vi.unstubAllGlobals();});
it('uses original oscillator tones, stops Manifest and stops the looping music on exit',async()=>{
 const sound=await import('./math-sound');await sound.startMathMusic();expect(prefs.stop).toHaveBeenCalled();expect(oscillators).toHaveLength(3);vi.advanceTimersByTime(5500);expect(oscillators).toHaveLength(6);sound.stopMathMusic();const count=oscillators.length;vi.advanceTimersByTime(11000);expect(oscillators).toHaveLength(count);expect(oscillators.every(o=>o.stop.mock.calls.length>0)).toBe(true);
});
it('respects silent and effects-only settings without adding music controls',async()=>{
 const sound=await import('./math-sound');prefs.mode='silent';await sound.startMathMusic();await sound.mathChime();expect(oscillators).toHaveLength(0);prefs.mode='effects';await sound.startMathMusic();expect(oscillators).toHaveLength(0);await sound.mathChime(false);expect(oscillators).toHaveLength(2);
});

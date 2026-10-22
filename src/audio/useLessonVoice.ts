import {useEffect,useState} from 'react';
import {getSoundMode,subscribeSoundMode} from './index';
import {getNarration,loadLessonNarrationPreference,playNarration,stopNarration,subscribeNarration} from './narration';
import {duckMathMusic} from './math-sound';
/** Explicit lesson guidance: bundled speech, existing silent/off preferences, no device TTS. */
export function useLessonVoice(text:string,paused:boolean){
 const [automatic,setAutomatic]=useState<boolean|null>(null),[mode,setMode]=useState(getSoundMode),[visible,setVisible]=useState(()=>!document.hidden),[playback,setPlayback]=useState(getNarration);
 useEffect(()=>{let live=true;void loadLessonNarrationPreference().then(value=>{if(live)setAutomatic(value);}).catch(()=>{if(live)setAutomatic(false);});return()=>{live=false;};},[]);
 useEffect(()=>{const sync=()=>{const state=getNarration();setPlayback(state);duckMathMusic(state.playing);};const speech=subscribeNarration(sync),sound=subscribeSoundMode(()=>setMode(getSoundMode()));const visibility=()=>{setVisible(!document.hidden);if(document.hidden)stopNarration();};const blur=()=>{setVisible(false);stopNarration();};const focus=()=>setVisible(!document.hidden);document.addEventListener('visibilitychange',visibility);window.addEventListener('blur',blur);window.addEventListener('focus',focus);sync();return()=>{stopNarration();speech();sound();duckMathMusic(false);document.removeEventListener('visibilitychange',visibility);window.removeEventListener('blur',blur);window.removeEventListener('focus',focus);};},[]);
 useEffect(()=>{if(automatic&&!paused&&visible&&mode!=='silent')void playNarration(text);else stopNarration();return()=>stopNarration();},[text,automatic,paused,visible,mode]);
 return {visible,playing:playback.playing&&playback.text===text,error:playback.text===text?playback.error:'',silent:mode==='silent',repeat:()=>{if(!paused&&visible&&mode!=='silent')void playNarration(text);}};
}

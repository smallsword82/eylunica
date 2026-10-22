import {useEffect,useState} from 'react';
import {getSoundMode,subscribeSoundMode} from './index';
import {getNarration,loadLessonNarrationPreference,playNarrationSequence,stopNarration,subscribeNarration} from './narration';
import {duckMathMusic} from './math-sound';
/** Explicit lesson guidance: bundled speech, existing silent/off preferences, no device TTS. */
export function useLessonVoice(text:string,paused:boolean,enabled=true,intro=''){
 const [automatic,setAutomatic]=useState<boolean|null>(null),[mode,setMode]=useState(getSoundMode),[visible,setVisible]=useState(()=>!document.hidden),[playback,setPlayback]=useState(getNarration);
 useEffect(()=>{let live=true;void loadLessonNarrationPreference().then(value=>{if(live)setAutomatic(value);}).catch(()=>{if(live)setAutomatic(false);});return()=>{live=false;};},[]);
 useEffect(()=>{const sync=()=>{const state=getNarration();setPlayback(state);if(enabled)duckMathMusic(state.playing);};const speech=subscribeNarration(sync),sound=subscribeSoundMode(()=>setMode(getSoundMode()));const visibility=()=>{setVisible(!document.hidden);if(document.hidden&&enabled)stopNarration();};const blur=()=>{setVisible(false);if(enabled)stopNarration();};const focus=()=>setVisible(!document.hidden);document.addEventListener('visibilitychange',visibility);window.addEventListener('blur',blur);window.addEventListener('focus',focus);sync();return()=>{if(enabled){stopNarration();duckMathMusic(false);}speech();sound();document.removeEventListener('visibilitychange',visibility);window.removeEventListener('blur',blur);window.removeEventListener('focus',focus);};},[enabled]);
 useEffect(()=>{if(!enabled)return;if(automatic&&!paused&&visible&&mode!=='silent'&&text)void playNarrationSequence([intro,text].filter(Boolean));else stopNarration();return()=>stopNarration();},[text,intro,automatic,paused,visible,mode,enabled]);
 return {visible,automatic,playing:playback.playing&&(playback.text===text||playback.text===intro),error:playback.text===text||playback.text===intro?playback.error:'',silent:mode==='silent',repeat:()=>{if(enabled&&!paused&&visible&&mode!=='silent')void playNarrationSequence([intro,text].filter(Boolean));}};
}

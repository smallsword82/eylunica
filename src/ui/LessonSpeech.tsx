import {useLessonVoice} from '../audio/useLessonVoice';
/** Mount at a teaching boundary; question controls stay available while it speaks. */
export function LessonSpeech({text,paused,intro=''}:{text:string;paused:boolean;intro?:string}){
 const voice=useLessonVoice(text,paused,true,intro);
 return <button className="journey-voice-repeat" disabled={paused||voice.silent} onClick={voice.repeat} aria-label="Yönergeyi tekrar dinle">↻ {voice.error?'Sesi yeniden dene':'Tekrar dinle'}</button>;
}

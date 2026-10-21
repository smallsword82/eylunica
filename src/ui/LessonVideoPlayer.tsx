import {useEffect,useRef,useState} from 'react';

type Player = {destroy:()=>void;getIframe:()=>HTMLIFrameElement;getVideoUrl:()=>string};
type PlayerEvent = {target:Player};
type PlayerOptions = {host:string;videoId:string;playerVars:Record<string,string|number>;events:{onReady:(event:PlayerEvent)=>void;onStateChange:(event:PlayerEvent&{data:number})=>void;onError:()=>void}};
type YouTubeAPI = {Player:new(element:HTMLElement,options:PlayerOptions)=>Player};
declare global {interface Window {YT?:YouTubeAPI;onYouTubeIframeAPIReady?:()=>void}}
let loadingAPI:Promise<YouTubeAPI>|undefined;
function loadYouTubeAPI():Promise<YouTubeAPI>{
 if(window.YT?.Player)return Promise.resolve(window.YT);
 if(loadingAPI)return loadingAPI;
 loadingAPI=new Promise<YouTubeAPI>((resolve,reject)=>{
  const previous=window.onYouTubeIframeAPIReady;
  const script=document.createElement('script');script.src='https://www.youtube.com/iframe_api';script.async=true;
  const timeout=window.setTimeout(()=>fail(),12000);
  function fail(){window.clearTimeout(timeout);script.remove();window.onYouTubeIframeAPIReady=previous;reject(Error('Oynatıcı yüklenemedi'));}
  window.onYouTubeIframeAPIReady=()=>{window.clearTimeout(timeout);window.onYouTubeIframeAPIReady=previous;previous?.();if(window.YT?.Player)resolve(window.YT);else fail();};
  script.onerror=fail;document.head.append(script);
 }).catch(error=>{loadingAPI=undefined;throw error;});
 return loadingAPI;
}

// Use the supported IFrame API: preserve the standard controls, branding and ads.
// Unmount at ENDED, and stop if the player reports a video other than the selected one.
export function LessonVideoPlayer({videoId,onFinish}:{videoId:string;onFinish:()=>void}){
 const host=useRef<HTMLDivElement>(null),finish=useRef(onFinish);finish.current=onFinish;
 const [failed,setFailed]=useState(false),[loading,setLoading]=useState(true),[attempt,setAttempt]=useState(0);
 useEffect(()=>{
  let active=true,player:Player|undefined;setFailed(false);setLoading(true);
  const fail=()=>{if(!active)return;player?.destroy();player=undefined;setFailed(true);setLoading(false);};
  loadYouTubeAPI().then(api=>{
   if(!active||!host.current)return;
   const mount=document.createElement('div');host.current.replaceChildren(mount);
   player=new api.Player(mount,{host:'https://www.youtube-nocookie.com',videoId,playerVars:{autoplay:0,playsinline:1,rel:0,origin:window.location.origin},events:{
    onReady:event=>{if(!active)return;event.target.getIframe().title='Onaylı matematik videosu';event.target.getIframe().referrerPolicy='strict-origin-when-cross-origin';setLoading(false);},
    onStateChange:event=>{
     if(!active)return;
     if(event.data===0){finish.current();return;}
     if([1,2,3,5].includes(event.data)){
      let current:string|null=null;try{current=new URL(event.target.getVideoUrl()).searchParams.get('v');}catch{/* Unknown playback identity fails closed. */}
      if(current!==videoId)finish.current();
     }
    },onError:fail,
   }});
  }).catch(fail);
  return()=>{active=false;player?.destroy();};
 },[videoId,attempt]);
 return <div className="journey-video-player"><div ref={host} className="lesson-video-host"/>{loading&&<p className="lesson-video-status" role="status">Video hazırlanıyor…</p>}{failed&&<div className="lesson-video-status" role="status"><p>Video şu anda açılamadı.</p><button onClick={()=>setAttempt(n=>n+1)}>Yeniden dene</button></div>}</div>;
}

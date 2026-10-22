import {useEffect,useRef,useState} from 'react';
import type {ScienceFigure} from '../grade5/science-plans';
import {ScienceScene} from './ScienceScene';
/** A short observation, with fixed measurement data. Assessments retain a still diagram. */
export function ScienceQuestionFigure({figure,paused,motion,solution=false}:{figure:ScienceFigure;paused:boolean;motion:boolean;solution?:boolean}){
 const [frame,setFrame]=useState(0),[visible,setVisible]=useState(()=>!document.hidden);
 const elapsed=useRef(0);
 const reduced=typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches;
 useEffect(()=>{const hide=()=>setVisible(false),show=()=>setVisible(!document.hidden);window.addEventListener('blur',hide);window.addEventListener('focus',show);document.addEventListener('visibilitychange',show);return()=>{window.removeEventListener('blur',hide);window.removeEventListener('focus',show);document.removeEventListener('visibilitychange',show);};},[]);
 useEffect(()=>{if(paused||!motion||!visible||reduced||elapsed.current>=5000)return;let last=performance.now();const timer=setInterval(()=>{const now=performance.now();elapsed.current=Math.min(5000,elapsed.current+now-last);last=now;setFrame(elapsed.current/5000*3);if(elapsed.current===5000)clearInterval(timer);},90);return()=>clearInterval(timer);},[paused,motion,visible,reduced]);
 return <ScienceScene figure={figure} frame={frame} mode={solution?'solution':'question'} still={paused||!motion||reduced}/>;
}

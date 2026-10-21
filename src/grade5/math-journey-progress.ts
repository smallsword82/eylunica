export const journeyKey='eylunica-math-journey-v1';
export type TopicProgress={lesson:boolean;practice:boolean;test:boolean;bestScore:number};
export type JourneyProgress={version:1;topics:Record<string,TopicProgress>};
export const emptyTopic=():TopicProgress=>({lesson:false,practice:false,test:false,bestScore:0});
export function readJourney(raw:string|null):JourneyProgress{
 const empty:JourneyProgress={version:1,topics:{}};
 try{const p=JSON.parse(raw||'null');if(p?.version!==1||!p.topics||typeof p.topics!=='object')return empty;
 for(const [id,v] of Object.entries(p.topics)){const t=v as TopicProgress;if(t&&[t.lesson,t.practice,t.test].every(x=>typeof x==='boolean')&&Number.isFinite(t.bestScore)&&t.bestScore>=0&&t.bestScore<=100)empty.topics[id]={lesson:t.lesson,practice:t.practice,test:t.test,bestScore:t.bestScore};}
 }catch{}return empty;
}
export const graduated=(ids:string[],progress:JourneyProgress)=>ids.length>0&&ids.every(id=>progress.topics[id]?.test&&progress.topics[id]?.lesson&&progress.topics[id]?.practice);

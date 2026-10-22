import './DiscoveryCover.css';
export type DiscoveryScene='library'|'math'|'reading'|'attention'|'add'|'subtract'|'multiply'|'divide'|'strategy'|'mixed'|'shortReading'|'paragraphReading'|'deepReading'|'memory'|'pattern'|'instructions';
export const discoveryScenes:DiscoveryScene[]=['library','math','reading','attention','add','subtract','multiply','divide','strategy','mixed','shortReading','paragraphReading','deepReading','memory','pattern','instructions'];
/** One original local atlas, independently framed for each discovery. No remote images. */
export function DiscoveryCover({scene}:{scene:DiscoveryScene}){
 const index=discoveryScenes.indexOf(scene),x=index%4*100,y=Math.floor(index/4)*100;
 return <span className={`academy-cover-art cover-${scene}`} data-discovery-scene={scene} aria-hidden="true"><svg viewBox={`${x} ${y} 100 100`} preserveAspectRatio="xMidYMid slice" focusable="false"><image href="/discovery/academy-worlds.png" width="400" height="400"/></svg><span className="cover-spark spark-one">✦</span><span className="cover-spark spark-two">✧</span></span>;
}

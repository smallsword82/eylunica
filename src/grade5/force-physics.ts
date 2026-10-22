export type MotionState={x:number;v:number;t:number};
export type MotionParams={mass:number;force:number;muStatic:number;muKinetic:number};
export const gravity=9.81;
export function advanceMotion(s:MotionState,p:MotionParams,dt:number):MotionState{
 const normal=p.mass*gravity;
 const staticLimit=p.muStatic*normal;
 let friction=0;
 if(Math.abs(s.v)<1e-7){
  if(Math.abs(p.force)<=staticLimit)return {...s,v:0,t:s.t+dt};
  friction=-Math.sign(p.force)*p.muKinetic*normal;
 }else friction=-Math.sign(s.v)*p.muKinetic*normal;
 const acceleration=(p.force+friction)/p.mass;
 let nextV=s.v+acceleration*dt;
 if(s.v!==0&&Math.sign(nextV)!==Math.sign(s.v)){
  nextV=0;
 }
 const nextX=Math.max(0,s.x+(s.v+nextV)*0.5*dt);
 return {x:nextX,v:nextX===0&&nextV<0?0:nextV,t:s.t+dt};
}

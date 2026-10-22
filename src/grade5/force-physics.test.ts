import {describe,it,expect} from 'vitest';
import {advanceMotion,type MotionState} from './force-physics';
const start:MotionState={x:0,v:0,t:0};
describe('force motion',()=>{
 it('stays at rest below static friction',()=>{
  const s=advanceMotion(start,{mass:2,force:2,muStatic:0.4,muKinetic:0.2},0.01);
  expect(s.x).toBe(0);expect(s.v).toBe(0);
 });
 it('accelerates when applied force overcomes friction',()=>{
  const s=advanceMotion(start,{mass:2,force:20,muStatic:0.2,muKinetic:0.1},0.1);
  expect(s.v).toBeGreaterThan(0);expect(s.x).toBeGreaterThan(0);
 });
 it('slows and stops without applied force',()=>{
  let s:MotionState={x:1,v:0.1,t:0};
  s=advanceMotion(s,{mass:1,force:0,muStatic:0.4,muKinetic:0.2},0.1);
  expect(s.v).toBe(0);expect(s.x).toBeGreaterThanOrEqual(1);
 });
 it('a larger mass accelerates less for the same force and surface',()=>{
  const light=advanceMotion(start,{mass:1,force:30,muStatic:0.1,muKinetic:0.05},0.01);
  const heavy=advanceMotion(start,{mass:3,force:30,muStatic:0.1,muKinetic:0.05},0.01);
  expect(light.v).toBeGreaterThan(heavy.v);
 });
});

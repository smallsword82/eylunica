import { describe,it,expect } from 'vitest';
import official from './official-curriculum.json';
import { courses,topics,timetable } from './catalog';
describe('MEB kaynaklı 2026–2027 kataloğu',()=>{
 it('zorunlu çizelge saatleri ve seçmeli toplamı kaynakla tutarlıdır',()=>{
  expect(courses.filter(c=>c.category==='mandatory').reduce((n,c)=>n+(c.weeklyHours||0),0)).toBe(30);
  expect(timetable.decision).toBe('115');expect(timetable.totalHours).toBe(35);expect(timetable.electiveTotalHours).toBe(5);
  expect(timetable.pdfSha256).toMatch(/^[a-f\d]{64}$/);
 });
 it('programlar ve konular benzersizdir; bütün konu bağlantıları mevcut bir programa gider',()=>{
  expect(new Set(courses.map(c=>c.id)).size).toBe(courses.length);
  expect(new Set(topics.map(t=>t.id)).size).toBe(topics.length);
  expect(official.topics.length).toBeGreaterThan(700);
  for(const t of topics)expect(courses.some(c=>c.id===t.courseId)).toBe(true);
 });
 it('İngilizce modelleri ayrıdır; Almanca çoklu dil programıdır',()=>{
  expect(courses.find(c=>c.id==='course-4')?.model).toBe('standard');
  expect(courses.find(c=>c.id==='meb-course-35')?.model).toBe('multiple-language');
  expect(courses.find(c=>c.id==='course-5')?.model).toBe('multiple-language');
 });
 it('doğrulanmış konular resmî kaynak taşır ve hafta uydurmaz',()=>{
  for(const t of official.topics){expect(new URL(t.source.url).hostname).toBe('tymm.meb.gov.tr');expect(t.source.status).toBe('verified');expect(t.weeks.every(w=>Number.isInteger(w)&&w>=1&&w<=36)).toBe(true);}
  expect(official.topics.filter(t=>t.weeks.length).length).toBe(303);
  expect(official.units.every(u=>u.sourceSha256.length===64)).toBe(true);
 });
});

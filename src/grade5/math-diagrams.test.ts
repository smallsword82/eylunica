import {expect,it} from 'vitest';
import {mathJourneyQuestions} from './math-journey-bank';
import {diagramAnswer,evaluate,expr,expressionSteps} from './math-diagrams';
import {mathFilms} from './math-films';
import {lessonByTopic} from './content';
import {mathModels} from './math-models';
it('uses the exact question quantities and independently reproduces every non-angle answer',()=>{
 for(const q of mathJourneyQuestions){if(q.figure.kind==='angle')continue;expect(q.figure.diagram,q.id).toBeDefined();expect(String(diagramAnswer(q.figure.diagram!)),q.id+' '+q.prompt).toBe(q.answer);}
});
it('has a dedicated four-shot film for every explanation and worked step',()=>{
 for(const [id,model] of Object.entries(mathModels)){const film=mathFilms[id];expect(film,id+' '+model).toBeDefined();const lesson=lessonByTopic.get(id);if(!lesson)continue;const paragraphs=lesson.sections.flatMap(s=>s.body);expect(film.explain,id).toHaveLength(paragraphs.length);expect(film.example,id).toHaveLength(lesson.workedExample.steps.length);film.explain.forEach((s,i)=>expect(paragraphs[i].startsWith(s.anchor),id+' '+i+' '+paragraphs[i]).toBe(true));for(const scene of [...film.explain,...film.example]){expect(scene.diagrams).toHaveLength(4);expect(scene.captions).toHaveLength(4);expect(scene.captions.every(Boolean)).toBe(true);}}
});
it('evaluates operation trees in order without string eval',()=>{const tree=expr('−',30,expr('×',4,expr('+',2,3)));expect(evaluate(tree)).toBe(10);expect(expressionSteps(tree)).toEqual(['(30 − (4 × (2 + 3)))','(30 − (4 × 5))','(30 − 20)','10']);});
it('keeps the worked examples tied to their own numbers and preserves the unknown base in circle construction',()=>{
 const polygon=mathFilms['topic-c89c9fdbb63ce0ad'];for(const s of polygon.example)for(const d of s.diagrams){expect(d).toMatchObject({kind:'circlePair',radius:4,unknownBase:true,equilateral:false});}
 const reading=mathFilms['topic-a219ce03fcdfdad6'].explain[1];expect(reading.diagrams.map(d=>d.kind==='number'?d.selected:-1)).toEqual([0,1,2,0]);
 const distributed=mathFilms['topic-61b7fdd3038e685f'].explain[2];expect(distributed.diagrams.every(d=>diagramAnswer(d)===78)).toBe(true);
 expect(mathFilms['topic-6a97ba45a911803c'].explain[1].diagrams[0]).toMatchObject({kind:'fraction',representation:'numberLine',num:3,den:4});
 expect(mathFilms['topic-d170313ab769758e'].example[0].diagrams[0]).toMatchObject({kind:'chart',values:[9,6,5],labels:['Roman','Şiir','Öykü']});
});

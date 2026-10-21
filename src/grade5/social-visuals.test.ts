import {expect,it} from 'vitest';
import {socialVisualTopics} from './social-visuals';
import {topics} from './catalog';
import {matchesTerm} from './terms';
import {lessonByTopic} from './content';
it('provides distinct scene models for exactly the ten first-term social topics with preserved lessons',()=>{
 const first=topics.filter(t=>t.courseId==='course-3'&&matchesTerm(t,'first'));expect(first).toHaveLength(10);expect(new Set(Object.keys(socialVisualTopics))).toEqual(new Set(first.map(t=>t.id)));expect(new Set(Object.values(socialVisualTopics)).size).toBe(10);for(const t of first){const l=lessonByTopic.get(t.id)!;expect(l.sections.flatMap(s=>s.body)).toHaveLength(4);expect(l.workedExample.steps).toHaveLength(3);}
});

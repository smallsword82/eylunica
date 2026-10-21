import {fireEvent,render,screen,cleanup} from '@testing-library/react';
import {afterEach,expect,it,vi} from 'vitest';
import {topics,questionsByTopic} from '../grade5/catalog';
import {mathModels} from './math-visual-models';
import {MathVisualLesson} from './MathVisualLesson';
import {AngleLesson} from './AngleLesson';
vi.mock('../audio',()=>({playAnswerEffect:vi.fn()}));
afterEach(cleanup);
const transition=(action:()=>void)=>action();
it('covers every existing math topic, without routing to a separate demonstration',()=>{
 const math=topics.filter(t=>t.courseId==='course-1');
 expect(math).toHaveLength(20);
 for(const topic of math)expect(mathModels[topic.id],topic.title).toBeTruthy();
});
for(const mode of [...new Set(Object.values(mathModels))].filter(m=>m!=='angle')){
 it(`${mode}: shows the model, explanation and existing-topic task`,()=>{
  const topic=topics.find(t=>mathModels[t.id]===mode)!;
  const practice=vi.fn();
  const {container}=render(<MathVisualLesson topic={topic} paused={false} onPractice={practice} onTransition={transition}/>);
  expect(container.querySelector(`[data-model="${mode}"]`)).toBeInTheDocument();
  const expected:Record<string,string>={construction:'AB = 6 cm',polygon:'4 kenar · 4 köşe',reading:'4 025 308',place:'4 × 1.000 = 4.000',operations:'4 × 3 = 12 kalem',area:'Çevre: 14 cm · Alan: 12 cm²',fraction:'2/4 ≈ 0,5',fractionCompare:'4/8 > 3/8',data:'Toplam 9 oy',equality:'10 = 10',properties:'4 × (2 + 3) = 8 + 12 = 20',precedence:'4 + 2 × 3 = 4 + 6 = 10',pattern:'4, 7, 10, 13, … → sonraki 16',algorithm:"12 TL ile 3 TL'lik 4 defter alınır; 0 TL kalır.",chance:'4 sarı, 3 mor taş: sarı daha olası'};
  expect(container.querySelector('.math-model-equation')).toHaveTextContent(expected[mode]);
  expect(screen.getByRole('region',{name:'Konu keşif modeli'})).toBeInTheDocument();
  expect(screen.getByText(questionsByTopic.get(topic.id)![0].prompt)).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button',{name:'Konu alıştırmalarına geç →'}));
  expect(practice).toHaveBeenCalledOnce();
 });
}
it('computes area and perimeter from independently changed sides',()=>{
 const topic=topics.find(t=>mathModels[t.id]==='area')!;
 const {container,rerender}=render(<MathVisualLesson topic={topic} paused={false} onPractice={()=>{}} onTransition={transition}/>);
 fireEvent.change(screen.getByRole('slider',{name:/Uzunluk/}),{target:{value:'5'}});
 expect(container.querySelector('.math-model-equation')).toHaveTextContent('Çevre: 16 cm · Alan: 15 cm²');
 rerender(<MathVisualLesson topic={topic} paused onPractice={()=>{}} onTransition={transition}/>);
 expect(screen.getByRole('slider',{name:/Uzunluk/})).toBeDisabled();
});
it('fraction pieces maintain one whole and never select more than the denominator',()=>{
 const topic=topics.find(t=>mathModels[t.id]==='fraction')!;
 const {container}=render(<MathVisualLesson topic={topic} paused={false} onPractice={()=>{}} onTransition={transition}/>);
 fireEvent.click(screen.getByRole('button',{name:'3. eş parça'}));
 expect(container.querySelector('.math-model-equation')).toHaveTextContent('3/4 ≈ 0,75');
 fireEvent.change(screen.getByRole('slider',{name:/Eş parça sayısı/}),{target:{value:'2'}});
 expect(container.querySelector('.math-model-equation')).toHaveTextContent('2/2 ≈ 1');
});
it('measures and names boundary angles, completes missions and pauses controls',()=>{
 const {rerender}=render(<AngleLesson paused={false} onPractice={()=>{}} onTransition={transition}/>);
 for(const [angle,name] of [[0,'Sıfır açı'],[45,'Dar açı'],[90,'Dik açı'],[120,'Geniş açı'],[180,'Doğru açı']] as const){
  fireEvent.click(screen.getByRole('button',{name:`${angle}°`}));
  expect(screen.getByText(name,{exact:true})).toBeInTheDocument();
 }
 fireEvent.click(screen.getByRole('button',{name:'90°'}));
 fireEvent.click(screen.getByRole('button',{name:'Açımı kontrol et'}));
 expect(screen.getByRole('status')).toHaveTextContent('90° ile görevi tamamladın');
 rerender(<AngleLesson paused onPractice={()=>{}} onTransition={transition}/>);
 expect(screen.getByRole('slider',{name:/Işını hareket ettir/})).toBeDisabled();
});
it('changes between commutative, associative and distributive models',()=>{
 const topic=topics.find(t=>mathModels[t.id]==='properties')!;
 const {container}=render(<MathVisualLesson topic={topic} paused={false} onPractice={()=>{}} onTransition={transition}/>);
 fireEvent.click(screen.getByRole('button',{name:'Değişme'}));
 expect(container.querySelector('.math-model-equation')).toHaveTextContent('4 × 3 = 3 × 4 = 12');
 fireEvent.click(screen.getByRole('button',{name:'Birleşme'}));
 expect(container.querySelector('.math-model-equation')).toHaveTextContent('(4 × 2) × 3 = 4 × (2 × 3) = 24');
});

/** Recognition comes before units, angle classes and the protractor. */
export const angleCoachTexts={
 watchAnchor:'İki ışın aynı noktadan başlıyor. Bu noktaya köşe diyoruz. Mavi ışın sabit kalıyor.',
 watchMove:'Şimdi altın renkli ışını izle. Işın açılırken aradaki renkli açıklık büyüyor. Bu açıklığa açı diyoruz.',
 together:'Şimdi birlikte yapalım. Altın tutamaca dokun ve yukarı taşı. Renkli açıklığı büyüt.',
 togetherHint:'Altın halkayı yukarı doğru taşı. İstersen Aç düğmesine birkaç kez dokunabilirsin.',
 togetherSuccess:'Evet, açıklık büyüdü. Mavi ışın yerinde kaldı, altın ışın hareket etti. Şimdi sen dene.',
 try:'Şimdi sen dene. Altın tutamacı aşağıya taşı ve renkli açıklığı küçült.',
 tryHint:'Bu kez ışınları birbirine yaklaştır. Altın halkayı aşağı taşı veya Kapat düğmesine dokun.',
 complete:'Başardın! Açıklığı hem büyüttün hem küçülttün. Şimdi devam kapısından açılarla ilgili yeni bilgilere geçebilirsin.',
} as const;
export type AngleCoachCue=keyof typeof angleCoachTexts;
export type AngleCoachStage='watch'|'together'|'try';
export const angleCoach={origin:{x:160,y:205},radius:165,min:20,max:125,togetherStart:25,tryStart:105,togetherTarget:75,tryTarget:55};
export function coachPoint(angle:number,r=angleCoach.radius){const a=angle*Math.PI/180;return {x:angleCoach.origin.x+r*Math.cos(a),y:angleCoach.origin.y-r*Math.sin(a)};}
export function pointerAngle(x:number,y:number){const raw=Math.atan2(angleCoach.origin.y-y,x-angleCoach.origin.x)*180/Math.PI;return Math.max(angleCoach.min,Math.min(angleCoach.max,raw));}
export function coachGoal(stage:AngleCoachStage,angle:number,manipulated:boolean){return manipulated&&(stage==='together'?angle>=angleCoach.togetherTarget:stage==='try'?angle<=angleCoach.tryTarget:false);}
export function watchAngle(elapsed:number,anchorMs:number,moveMs:number){const t=Math.max(0,Math.min(1,(elapsed-anchorMs)/(moveMs*.8)));return 25+90*(t*t*(3-2*t));}

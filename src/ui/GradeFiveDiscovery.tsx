import {useEffect,type CSSProperties} from 'react';
import './GradeFiveDiscovery.css';
const books = [
 { id:'course-1', name:'Matematik', mark:'01', color:'#fbbd69', title:'Sayıların gizli dünyası', icon:'math', hint:'Dene, çöz, keşfet' },
 { id:'course-3', name:'Sosyal Bilgiler', mark:'02', color:'#91d4bc', title:'Dünyaya bir pencere aç', icon:'world', hint:'Geçmişten geleceğe' },
 { id:'course-2', name:'Fen Bilimleri', mark:'03', color:'#a7bafa', title:'Bir bilim insanı gibi düşün', icon:'science', hint:'Önce merak et' },
 { id:'course-0', name:'Türkçe', mark:'04', color:'#f6a7b9', title:'Her sözcük bir macera', icon:'story', hint:'Oku, hayal et, anlat' },
 { id:'course-4', name:'İngilizce', mark:'05', color:'#c3b0ef', title:'Hello, new adventures!', icon:'language', hint:'Yeni bir dil, yeni bir kapı' },
 { id:'course-5', name:'Almanca', mark:'06', color:'#f5cf81', title:'Hallo, neue Abenteuer!', icon:'language', hint:'Sözcüklerle dünyaya açıl' },
 { id:'course-6', name:'Din Kültürü ve Ahlak Bilgisi', mark:'07', color:'#9bd7e6', title:'İyiliğin izini sür', icon:'kindness', hint:'Düşün, anla, paylaş' },
];
function SchoolCover({id}:{id:string}){
 const index=['course-1','course-3','course-2','course-0','course-4','course-5','course-6'].indexOf(id);
 return <span className="subject-cover-art" aria-hidden="true"><svg viewBox={`${index%4*100} ${Math.floor(index/4)*100} 100 100`} preserveAspectRatio="xMidYMid slice" focusable="false"><image href="/discovery/school-worlds.png" width="400" height="200"/></svg></span>;
}
export function GradeFiveDiscovery({onBack,onCourse,paused,onTransition}:{onBack:()=>void;onCourse:(id:string)=>void;paused:boolean;onTransition:(action:()=>void,startsTask?:boolean)=>void}) {
 useEffect(()=>{document.body.classList.add('discovery-open');return()=>document.body.classList.remove('discovery-open');},[]);
 return <main className="subpage discovery">
 <button className="text-button" onClick={onBack}>← Okul ve akademi seçimine dön</button>
 <div className="discovery-kicker">EYLUNICA · 5. SINIF <span>KEŞİF KİTAPLIĞI</span></div>
 <><header className="discovery-header"><p className="discovery-eyebrow">BUGÜN NEYİ MERAK EDİYORSUN?</p><h1>Küçük bir merak,{' '}<br/><em>kocaman bir keşif.</em></h1><p>Bir kitap seç. Yeni bir dünyanın kapısını arala.</p><span className="discovery-pill">7 ana ders · İlk dönem odağı</span></header>
 <section className="discovery-books" aria-label="Yedi ana ders">{books.map(book=><button key={book.id} aria-label={`${book.name} ${book.hint}`} className="discovery-book" style={{'--book':book.color} as CSSProperties} onClick={()=>onCourse(book.id)}><span className="discovery-cover illustrated-subject"><span className="book-top">KEŞİF KİTAPLIĞI <b>{book.mark}</b></span><SchoolCover id={book.id}/><strong>{book.name}</strong><span className="book-subtitle">{book.title}</span><span className="book-line"/></span><span className="book-caption">{book.hint}<span aria-hidden="true">↗</span></span></button>)}</section>
</>
 </main>;
}

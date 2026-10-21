import { MathAdventure } from './MathAdventure';
import { useState, type CSSProperties } from 'react';
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
function CoverArt({ kind }: {kind:string}) {
 return <svg viewBox="0 0 240 160" aria-hidden="true" className="discovery-art"><circle cx="120" cy="82" r="62" fill="white" opacity=".22"/><g fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
 {kind==='math' ? <><rect x="58" y="43" width="58" height="76" rx="12" transform="rotate(-12 87 81)"/><path d="M74 72h25m-12-12v24m55-18 35 45h-55z"/><circle cx="157" cy="45" r="13"/><path d="m78 105 20-5"/></> : kind==='world' ? <><circle cx="120" cy="77" r="46"/><ellipse cx="120" cy="77" rx="20" ry="46"/><path d="M75 77h90m-80-23h70m-70 46h70m-35 24v14m-25 0h50"/></> : kind==='science' ? <><path d="M102 27h36m-28 0v42l-37 53q-7 12 9 12h77q16 0 9-12l-38-53V27M91 102h59"/><circle cx="116" cy="88" r="4"/><circle cx="129" cy="114" r="4"/><path d="m168 44 4-10 4 10 10 4-10 4-4 10-4-10-10-4z"/></> : kind==='story' ? <><path d="M120 53q-30-23-63-10v80q32-13 63 10 31-23 63-10V43q-33-13-63 10v80M72 62l31 8m-31 12 31 8m34-20 31-8m-31 28 31-8"/><path d="m119 21 3 8 9 2-9 3-3 8-3-8-9-3 9-2z"/></> : kind==='language' ? <><path d="M57 42h94v59H96l-23 19v-19H57zM166 67h20v64h-21l-18 13v-13h-24v-15"/><path d="m80 83 13-27 13 27m-20-10h14m22-17v27m0-14h12"/></> : <><path d="M120 88c-52-30-42-70-16-62q12 3 16 15 4-12 16-15c26-8 36 32-16 62zM58 110l31-14 31 12 31-12 31 14-40 25H98z"/></>}
 </g><circle cx="44" cy="31" r="4" fill="currentColor"/><path d="m194 108 3 8 8 3-8 3-3 8-3-8-8-3 8-3z" fill="currentColor"/></svg>;
}
export function GradeFiveDiscovery({onBack,onCourse,paused,onTransition}:{onBack:()=>void;onCourse:(id:string)=>void;paused:boolean;onTransition:(action:()=>void,startsTask?:boolean)=>void}) {
 const [lesson,setLesson]=useState(false);
 if(lesson) return <MathAdventure paused={paused} onBack={()=>setLesson(false)} onTopics={()=>onCourse('course-1')} onTransition={onTransition}/>;
 return <main className="subpage discovery">
 <button className="text-button" onClick={onBack}>← {lesson?'Kitaplığıma dön':'Akademilere dön'}</button>
 <div className="discovery-kicker">EYLUNICA · 5. SINIF <span>MATEMATİK KEŞİF DENEMESİ</span></div>
 {!lesson ? <><header className="discovery-header"><p className="discovery-eyebrow">BUGÜN NEYİ MERAK EDİYORSUN?</p><h1>Küçük bir merak,<br/><em>kocaman bir keşif.</em></h1><p>Bir kitap seç. Yeni bir dünyanın kapısını arala.</p><span className="discovery-pill">7 ana ders · İlk dönem odağı</span></header>
 <section className="discovery-books" aria-label="Yedi ana ders">{books.map(book=><button key={book.id} aria-label={`${book.name} ${book.hint}`} className="discovery-book" style={{'--book':book.color} as CSSProperties} onClick={()=>book.icon==='math'?onTransition(()=>setLesson(true),true):onCourse(book.id)}><span className="discovery-cover"><span className="book-top">KEŞİF KİTAPLIĞI <b>{book.mark}</b></span>{book.icon==='math'?<span className="math-book-illustration" aria-hidden="true"/>:<CoverArt kind={book.icon}/>}<strong>{book.name}</strong><span className="book-subtitle">{book.title}</span><span className="book-line"/></span><span className="book-caption">{book.hint}<span aria-hidden="true">↗</span></span></button>)}</section>
 <p className="discovery-footnote">Matematik kitabında yeni görselli konu örneğini deneyebilirsin. Diğer kitaplar mevcut ders içeriğine açılır.</p></> : null}
 </main>;
}

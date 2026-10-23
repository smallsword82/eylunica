import type { ReactNode } from 'react';
import './LessonShell.css';

export type LessonStep = { id: string; label: string; icon: string };

// One landscape stage for every course: steps on the left, content card in the
// middle, star path below. The page itself never scrolls; long content pages.
export function LessonShell({ crumb, title, steps, current, done, onStep, onBack, backLabel, children, footer, status }: {
  crumb: string; title: string; steps: LessonStep[]; current: string; done: Set<string>;
  onStep: (id: string) => void; onBack: () => void; backLabel: string; children: ReactNode; footer?: ReactNode; status?: string;
}) {
  const index = steps.findIndex(s => s.id === current);
  return <main className="ey-lesson">
    <div className="ey-stars" aria-hidden="true" />
    <header className="ey-head">
      <button className="ey-back" onClick={onBack}>← {backLabel}</button>
      <div><p className="ey-crumb">{crumb}</p><h1>{title}</h1></div>
    </header>
    <nav className="ey-steps" aria-label="Öğrenme adımları">
      {steps.map(s => <button key={s.id} aria-pressed={s.id === current} className={done.has(s.id) ? 'done' : undefined} onClick={() => onStep(s.id)}><span className="ey-icon" aria-hidden="true">{s.icon}</span>{s.label}</button>)}
    </nav>
    <section className="ey-card">{children}</section>
    <footer className="ey-path">
      <ol aria-label="İlerleme">{steps.map((s, i) => <li key={s.id} className={[i === index ? 'now' : '', done.has(s.id) ? 'done' : ''].join(' ')} aria-label={`${i + 1}. ${s.label}${done.has(s.id) ? ' · tamamlandı' : ''}`}><span aria-hidden="true">{i + 1}</span></li>)}</ol>
      <div className="ey-actions">{footer}</div>
      {status && <p className="ey-status" role="status">{status}</p>}
    </footer>
  </main>;
}

// Splits content into screen-sized pages with clear previous/next directions.
export function Pager({ page, pages, onPage, last }: { page: number; pages: number; onPage: (page: number) => void; last: ReactNode }) {
  return <nav className="ey-pager" aria-label="Sayfa yönlendirmesi">
    <button disabled={page === 0} onClick={() => onPage(page - 1)}><span aria-hidden="true">←</span> Önceki</button>
    <span>{page + 1}/{pages}</span>
    {page < pages - 1 ? <button className="ey-next" onClick={() => onPage(page + 1)}>Sonraki <span aria-hidden="true">→</span></button> : last}
  </nav>;
}

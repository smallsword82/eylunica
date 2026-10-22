import { act, fireEvent, render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { ForceExperiment } from './ForceExperiment';

it('freezes the experiment during a break or when the child leaves the window', () => {
  const frames = new Map<number, FrameRequestCallback>();let id=0;
  vi.stubGlobal('requestAnimationFrame', (cb:FrameRequestCallback) => {frames.set(++id,cb);return id;});
  vi.stubGlobal('cancelAnimationFrame', (id:number) => frames.delete(id));
  const step=(time:number)=>act(()=>{const callbacks=[...frames.values()];frames.clear();callbacks.forEach(cb=>cb(time));});
  try {
    const view=render(<ForceExperiment />);
    fireEvent.click(screen.getByRole('button',{name:'Başlat'}));
    step(1000);step(1050);
    expect(screen.getByRole('status')).not.toHaveTextContent('Süre: 0.00');
    const before=screen.getByRole('status').textContent;
    view.rerender(<ForceExperiment paused />);step(1100);
    expect(screen.getByRole('status').textContent).toBe(before);
    view.rerender(<ForceExperiment />);step(1200);step(1250);
    expect(screen.getByRole('status').textContent).not.toBe(before);
    act(()=>window.dispatchEvent(new Event('blur')));
    const hidden=screen.getByRole('status').textContent;step(1300);
    expect(screen.getByRole('status').textContent).toBe(hidden);
    view.unmount();expect(frames.size).toBe(0);
  } finally {vi.unstubAllGlobals();}
});

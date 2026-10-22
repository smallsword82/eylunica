import { act, render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { OfflineBanner } from './OfflineBanner';

it('keeps the offline notice visible if connectivity drops again during the recovery notice', () => {
  vi.useFakeTimers();
  try {
    const view = render(<OfflineBanner />);
    act(() => window.dispatchEvent(new Event('online')));
    act(() => vi.advanceTimersByTime(2000));
    act(() => window.dispatchEvent(new Event('offline')));
    act(() => vi.advanceTimersByTime(2000));
    expect(screen.getByRole('status')).toHaveTextContent('Çevrimdışısın');
    act(() => window.dispatchEvent(new Event('online')));
    view.unmount();
    expect(vi.getTimerCount()).toBe(0);
  } finally { vi.useRealTimers(); }
});

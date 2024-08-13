import { renderHook } from '@testing-library/react';
import { vi } from 'vitest';

import { useDocumentEvent } from './useDocumentEvent';

describe('useDocumentEvent', () => {
  it('attaches an event listener to the document', () => {
    const listener = vi.fn();
    renderHook(() => useDocumentEvent('click', listener));
    document.dispatchEvent(new Event('click'));
    expect(listener).toHaveBeenCalled();
  });

  it('does not trigger the listener for other events', () => {
    const listener = vi.fn();
    renderHook(() => useDocumentEvent('click', listener));
    document.dispatchEvent(new Event('keydown'));
    expect(listener).not.toHaveBeenCalled();
  });

  it('removes the event listener when unmounted', () => {
    const listener = vi.fn();
    const { unmount } = renderHook(() => useDocumentEvent('click', listener));
    unmount();
    document.dispatchEvent(new Event('click'));
    expect(listener).not.toHaveBeenCalled();
  });
});

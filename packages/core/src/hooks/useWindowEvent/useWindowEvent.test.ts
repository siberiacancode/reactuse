import { renderHook } from '@testing-library/react';
import { vi } from 'vitest';

import { useWindowEvent } from './useWindowEvent';

it('Should use window event', () => {
  const listener = vi.fn();
  renderHook(() => useWindowEvent('click', listener));
  window.dispatchEvent(new Event('click'));
  expect(listener).toHaveBeenCalled();
});

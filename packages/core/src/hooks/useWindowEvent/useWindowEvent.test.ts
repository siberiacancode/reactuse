import { renderHook } from '@testing-library/react';
import { vi } from 'vitest';

import { renderHookServer } from '@/tests';

import { useWindowEvent } from './useWindowEvent';

it('Should use window event', () => {
  const listener = vi.fn();
  renderHook(() => useWindowEvent('click', listener));

  window.dispatchEvent(new Event('click'));

  expect(listener).toHaveBeenCalledOnce();
});

it('Should use window event on server side', () => {
  const listener = vi.fn();
  renderHookServer(() => useWindowEvent('click', listener));

  window.dispatchEvent(new Event('click'));

  expect(listener).not.toHaveBeenCalledOnce();
});

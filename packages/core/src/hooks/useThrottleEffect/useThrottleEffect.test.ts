import { act, renderHook } from '@testing-library/react';
import { vi } from 'vitest';

import { renderHookServer } from '@/tests';

import { useThrottleEffect } from './useThrottleEffect';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

it('Should use throttle effect', () => {
  const effect = vi.fn();
  renderHook(() => useThrottleEffect(effect, 100, []));

  expect(effect).not.toHaveBeenCalled();
});

it('Should use throttle effect on server side', () => {
  const effect = vi.fn();
  renderHookServer(() => useThrottleEffect(effect, 100, []));

  expect(effect).not.toHaveBeenCalled();
});

it('Should throttle effect execution', () => {
  const effect = vi.fn();

  const { rerender } = renderHook((value) => useThrottleEffect(effect, 100, [value]), {
    initialProps: 'initial value'
  });

  expect(effect).not.toHaveBeenCalled();

  rerender('new value');
  expect(effect).toHaveBeenCalledOnce();

  act(() => vi.advanceTimersByTime(200));

  expect(effect).toHaveBeenCalledTimes(2);
});

it('Should cleanup on unmount', () => {
  const cleanup = vi.fn();
  const effect = vi.fn(() => cleanup);

  const { unmount, rerender } = renderHook((value) => useThrottleEffect(effect, 100, [value]), {
    initialProps: 'initial value'
  });

  expect(effect).not.toHaveBeenCalled();

  rerender('new value');

  unmount();

  expect(cleanup).toHaveBeenCalledOnce();
});

import { act, renderHook } from '@testing-library/react';

import { useIdle } from './useIdle';

beforeEach(() => {
  vi.useFakeTimers();
});

it('Should use idle', () => {
  const { result } = renderHook(useIdle);

  expect(result.current.idle).toBe(false);
  expect(result.current.lastActive).toBeLessThanOrEqual(Date.now());
});

it('Should be true after 60e3', () => {
  const { result } = renderHook(() => useIdle(60e3));

  expect(result.current.idle).toBe(false);

  act(() => {
    vi.advanceTimersByTime(60e3);
  });
  expect(result.current.idle).toBe(true);
});

it('Should be equal to initially passed state', () => {
  const { result } = renderHook(() => useIdle(60e3, { initialState: true }));

  expect(result.current.idle).toBe(true);
});

it('Should be false after interaction', () => {
  const { result } = renderHook(() => useIdle(60e3, { initialState: true }));

  expect(result.current.idle).toBe(true);

  act(() => {
    window.dispatchEvent(new Event('mousemove'));
  });
  expect(result.current.idle).toBe(false);
  expect(result.current.lastActive).toBeLessThanOrEqual(Date.now());
});

it('Should be false after visibilitychange', () => {
  const { result } = renderHook(() => useIdle(60e3, { initialState: true }));

  act(() => {
    document.dispatchEvent(new Event('visibilitychange'));
  });
  expect(result.current.idle).toBe(false);
  expect(result.current.lastActive).toBeLessThanOrEqual(Date.now());
});

it('Should not react to unexpected events', () => {
  const { result } = renderHook(() => useIdle(60e3, { initialState: true, events: ['click'] }));

  act(() => {
    window.dispatchEvent(new Event('mousemove'));
  });
  expect(result.current.idle).toBe(true);
});

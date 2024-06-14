import { act, renderHook } from '@testing-library/react';

import { useIdle } from './useIdle';

beforeEach(() => {
  vi.useFakeTimers();
});

it('Should use idle', () => {
  const { result } = renderHook(useIdle);

  expect(result.current.idle).toBeFalsy();
  expect(result.current.lastActive).toBeLessThanOrEqual(Date.now());
});

it('Should be true after 60e3', () => {
  const { result } = renderHook(useIdle);
  expect(result.current.idle).toBeFalsy();

  act(() => vi.advanceTimersByTime(60e3));
  expect(result.current.idle).toBeTruthy();
});

it('Should set initial state', () => {
  const { result } = renderHook(() => useIdle(60e3, { initialValue: true }));
  expect(result.current.idle).toBeTruthy();
});

it('Should be false after interaction', () => {
  const { result } = renderHook(() => useIdle(60e3));

  act(() => vi.advanceTimersByTime(60e3));
  expect(result.current.idle).toBeTruthy();

  act(() => window.dispatchEvent(new Event('mousemove')));

  expect(result.current.idle).toBeFalsy();
  expect(result.current.lastActive).toBeLessThanOrEqual(Date.now());
});

it('Should be false after visibilitychange event', () => {
  const { result } = renderHook(() => useIdle(60e3));

  act(() => vi.advanceTimersByTime(60e3));
  expect(result.current.idle).toBeTruthy();

  act(() => document.dispatchEvent(new Event('visibilitychange')));
  expect(result.current.idle).toBeFalsy();
  expect(result.current.lastActive).toBeLessThanOrEqual(Date.now());
});

it('Should work with custom events', () => {
  const { result } = renderHook(() => useIdle(60e3, { events: ['mousedown'] }));

  act(() => vi.advanceTimersByTime(60e3));
  expect(result.current.idle).toBeTruthy();

  act(() => window.dispatchEvent(new Event('mousedown')));
  expect(result.current.idle).toBeFalsy();

  act(() => vi.advanceTimersByTime(60e3));
  expect(result.current.idle).toBeTruthy();

  act(() => document.dispatchEvent(new Event('mousemove')));
  expect(result.current.idle).toBeTruthy();
});

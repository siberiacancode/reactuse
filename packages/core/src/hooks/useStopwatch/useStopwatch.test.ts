import { act, renderHook } from '@testing-library/react';
import { vi } from 'vitest';

import { renderHookServer } from '@/tests';

import { useStopwatch } from './useStopwatch';

beforeEach(vi.useFakeTimers);

afterEach(() => {
  vi.useRealTimers();
});

it('Should use stopwatch ', () => {
  const { result } = renderHook(useStopwatch);

  expect(result.current.days).toBe(0);
  expect(result.current.hours).toBe(0);
  expect(result.current.minutes).toBe(0);
  expect(result.current.seconds).toBe(0);
  expect(result.current.count).toBe(0);
  expect(result.current.paused).toBeTruthy();
  expect(result.current.start).toBeTypeOf('function');
  expect(result.current.pause).toBeTypeOf('function');
  expect(result.current.reset).toBeTypeOf('function');
  expect(result.current.toggle).toBeTypeOf('function');
});

it('Should use stopwatch on server side', () => {
  const { result } = renderHookServer(useStopwatch);

  expect(result.current.days).toBe(0);
  expect(result.current.hours).toBe(0);
  expect(result.current.minutes).toBe(0);
  expect(result.current.seconds).toBe(0);
  expect(result.current.count).toBe(0);
  expect(result.current.paused).toBeTruthy();
  expect(result.current.start).toBeTypeOf('function');
  expect(result.current.pause).toBeTypeOf('function');
  expect(result.current.reset).toBeTypeOf('function');
  expect(result.current.toggle).toBeTypeOf('function');
});

it('Should start counting when enabled', () => {
  const { result } = renderHook(useStopwatch);

  expect(result.current.seconds).toBe(0);

  act(() => result.current.start());

  expect(result.current.paused).toBeFalsy();

  act(() => vi.advanceTimersByTime(1000));

  expect(result.current.seconds).toBe(1);
  expect(result.current.minutes).toBe(0);
  expect(result.current.count).toBe(1);

  act(() => vi.advanceTimersByTime(59000));

  expect(result.current.seconds).toBe(0);
  expect(result.current.minutes).toBe(1);
  expect(result.current.count).toBe(60);
});

it('Should handle initial time correctly', () => {
  const { result } = renderHook(() => useStopwatch(90_061));

  expect(result.current.seconds).toBe(1);
  expect(result.current.minutes).toBe(1);
  expect(result.current.hours).toBe(1);
  expect(result.current.days).toBe(1);
  expect(result.current.count).toBe(90061);
});

it('Should handle initial time with options object', () => {
  const { result } = renderHook(() => useStopwatch({ initialTime: 90_061 }));

  expect(result.current.seconds).toBe(1);
  expect(result.current.minutes).toBe(1);
  expect(result.current.hours).toBe(1);
  expect(result.current.days).toBe(1);
  expect(result.current.count).toBe(90061);
});

it('Should respect immediately option', () => {
  const { result } = renderHook((immediately) => useStopwatch({ immediately, initialTime: 1000 }), {
    initialProps: true
  });

  expect(result.current.paused).toBeFalsy();
});

it('Should pause and resume correctly', () => {
  const { result } = renderHook(useStopwatch);

  act(() => result.current.start());

  act(() => vi.advanceTimersByTime(1000));

  expect(result.current.seconds).toBe(1);

  act(() => result.current.pause());

  act(() => vi.advanceTimersByTime(1000));

  expect(result.current.seconds).toBe(1);

  act(() => result.current.start());

  act(() => vi.advanceTimersByTime(1000));

  expect(result.current.seconds).toBe(2);
});

it('Should toggle pause state', () => {
  const { result } = renderHook(useStopwatch);

  expect(result.current.paused).toBeTruthy();

  act(() => vi.advanceTimersByTime(1000));

  expect(result.current.seconds).toBe(0);

  act(() => result.current.toggle());

  expect(result.current.paused).toBeFalsy();

  act(() => vi.advanceTimersByTime(1000));

  expect(result.current.seconds).toBe(1);

  act(() => result.current.toggle());

  act(() => vi.advanceTimersByTime(1000));

  expect(result.current.seconds).toBe(1);

  expect(result.current.paused).toBeTruthy();
});

it('Should reset to initial time', () => {
  const { result } = renderHook(() => useStopwatch(1));

  expect(result.current.seconds).toBe(1);

  act(() => result.current.start());

  act(() => vi.advanceTimersByTime(1000));

  expect(result.current.seconds).toBe(2);

  act(() => result.current.reset());

  expect(result.current.seconds).toBe(1);
});

[
  {
    beforeMs: 59_000,
    before: { days: 0, hours: 0, minutes: 0, seconds: 59 },
    after: { days: 0, hours: 0, minutes: 1, seconds: 0 }
  },
  {
    beforeMs: 3_599_000,
    before: { days: 0, hours: 0, minutes: 59, seconds: 59 },
    after: { days: 0, hours: 1, minutes: 0, seconds: 0 }
  },
  {
    beforeMs: 86_399_000,
    before: { days: 0, hours: 23, minutes: 59, seconds: 59 },
    after: { days: 1, hours: 0, minutes: 0, seconds: 0 }
  }
].forEach(({ beforeMs, before, after }) => {
  it(`Should correctly transition from ${beforeMs}ms to ${after.days} days ${after.hours} hours ${after.minutes} minutes ${after.seconds} seconds`, () => {
    const { result } = renderHook(useStopwatch);

    act(() => result.current.start());

    act(() => vi.advanceTimersByTime(beforeMs));

    expect(result.current.days).toBe(before.days);
    expect(result.current.hours).toBe(before.hours);
    expect(result.current.minutes).toBe(before.minutes);
    expect(result.current.seconds).toBe(before.seconds);

    act(() => vi.advanceTimersByTime(1_000));

    expect(result.current.days).toBe(after.days);
    expect(result.current.hours).toBe(after.hours);
    expect(result.current.minutes).toBe(after.minutes);
    expect(result.current.seconds).toBe(after.seconds);
  });
});

it('Should cleanup interval on unmount', () => {
  const clearIntervalSpy = vi.spyOn(window, 'clearInterval');
  const { result, unmount } = renderHook(useStopwatch);

  act(() => result.current.start());

  unmount();

  expect(clearIntervalSpy).toHaveBeenCalled();
  clearIntervalSpy.mockRestore();
});

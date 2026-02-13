import { act, renderHook } from '@testing-library/react';

import { renderHookServer } from '@/tests';

import { useProgress } from './useProgress';

beforeEach(vi.useFakeTimers);
afterEach(vi.clearAllTimers);

it('Should use progress', () => {
  const { result } = renderHook(useProgress);

  expect(result.current.value).toBe(0);
  expect(result.current.active).toBeFalsy();
  expect(result.current.start).toBeTypeOf('function');
  expect(result.current.done).toBeTypeOf('function');
  expect(result.current.inc).toBeTypeOf('function');
  expect(result.current.remove).toBeTypeOf('function');
});

it('Should use progress on server side', () => {
  const { result } = renderHookServer(useProgress);

  expect(result.current.value).toBe(0);
  expect(result.current.active).toBeFalsy();
});

it('Should auto increment and never complete without done', () => {
  const { result } = renderHook(useProgress);

  act(result.current.start);

  expect(result.current.active).toBeTruthy();
  expect(result.current.value).toBe(0);

  act(() => vi.advanceTimersByTime(60_000));

  expect(result.current.value).toBeLessThan(1);
  expect(result.current.value).toBeGreaterThan(0.9);
});

it('Should complete and reset after done', () => {
  const { result } = renderHook(() => useProgress(undefined, { speed: 200 }));

  act(result.current.start);

  expect(result.current.value).toBe(0);
  expect(result.current.active).toBeTruthy();

  act(result.current.done);

  expect(result.current.value).toBe(1);
  expect(result.current.active).toBeTruthy();

  act(() => vi.advanceTimersByTime(250));

  expect(result.current.active).toBeFalsy();
});

it('Should respect maximum option', () => {
  const { result } = renderHook(() => useProgress(0, { maximum: 0.7 }));

  act(result.current.start);

  act(() => vi.advanceTimersByTime(10_000));

  expect(result.current.value).toBeLessThanOrEqual(0.7);
});

it('Should respect speed option', () => {
  const { result } = renderHook(() => useProgress(0, { speed: 1000 }));

  act(result.current.start);

  act(() => vi.advanceTimersByTime(999));
  expect(result.current.value).toBe(0);

  act(() => vi.advanceTimersByTime(1));
  expect(result.current.value).toBeCloseTo(0.12, 0.13);
});

it('Should clamp rate option', () => {
  const randomMock = vi.spyOn(Math, 'random').mockReturnValue(1);
  const { result } = renderHook(() => useProgress(0, { rate: 100, speed: 700 }));

  act(result.current.start);

  act(() => vi.advanceTimersByTime(700));

  expect(result.current.value).toBeCloseTo(0.42, 0.43);

  randomMock.mockRestore();
});

it('Should start on mount when immediately enabled', () => {
  const { result } = renderHook(() => useProgress(0, { immediately: true }));

  expect(result.current.active).toBeTruthy();

  act(() => vi.advanceTimersByTime(1000));

  expect(result.current.value).toBeCloseTo(0.51, 0.53);
});

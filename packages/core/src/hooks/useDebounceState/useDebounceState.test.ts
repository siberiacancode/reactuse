import { act, renderHook } from '@testing-library/react';

import { renderHookServer } from '@/tests';

import { useDebounceState } from './useDebounceState';

beforeEach(vi.useFakeTimers);

afterEach(() => {
  vi.useRealTimers();
});

it('Should use debounce state', () => {
  const { result } = renderHook(() => useDebounceState('value', 100));

  expect(result.current[0]).toBe('value');
  expect(result.current[1]).toBeTypeOf('function');
  expect(result.current[1].cancel).toBeTypeOf('function');
});

it('Should use debounce state on server side', () => {
  const { result } = renderHookServer(() => useDebounceState('value', 100));

  expect(result.current[0]).toBe('value');
  expect(result.current[1]).toBeTypeOf('function');
  expect(result.current[1].cancel).toBeTypeOf('function');
});

it('Should update value after delay', () => {
  const { result } = renderHook(() => useDebounceState('first', 100));

  const setDebouncedValue = result.current[1];

  setDebouncedValue('second');

  act(() => vi.advanceTimersByTime(99));
  expect(result.current[0]).toBe('first');

  act(() => vi.advanceTimersByTime(1));
  expect(result.current[0]).toBe('second');
});

it('Should restart delay when state changes', () => {
  const { result } = renderHook(() => useDebounceState('first', 100));
  const setDebouncedValue = result.current[1];

  setDebouncedValue('second');

  act(() => vi.advanceTimersByTime(99));
  expect(result.current[0]).toBe('first');

  setDebouncedValue('third');

  act(() => vi.advanceTimersByTime(99));
  expect(result.current[0]).toBe('first');

  act(() => vi.advanceTimersByTime(1));
  expect(result.current[0]).toBe('third');
});

it('Should cancel pending state update', () => {
  const { result } = renderHook(() => useDebounceState('first', 100));

  result.current[1]('second');
  result.current[1].cancel();

  act(() => vi.advanceTimersByTime(100));

  expect(result.current[0]).toBe('first');
});

it('Should apply new delay when delay changes', () => {
  const { result, rerender } = renderHook((delay) => useDebounceState('first', delay), {
    initialProps: 100
  });
  const setDebouncedValue = result.current[1];

  rerender(200);
  setDebouncedValue('second');

  act(() => vi.advanceTimersByTime(199));
  expect(result.current[0]).toBe('first');

  act(() => vi.advanceTimersByTime(1));
  expect(result.current[0]).toBe('second');
});

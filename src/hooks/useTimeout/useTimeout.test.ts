import { act, renderHook } from '@testing-library/react';
import { beforeEach } from 'vitest';

import { useTimeout } from './useTimeout';

beforeEach(() => {
  vi.useFakeTimers();
});

it("Shouldn't be ready at the start", () => {
  const { result } = renderHook(() => useTimeout(() => {}, 5000));

  expect(result.current.ready).toBeFalsy();
});

it("Shouln't be ready unless the timer has expired", () => {
  const { result } = renderHook(() => useTimeout(() => {}, 5000));

  act(() => vi.advanceTimersByTime(4999));

  expect(result.current.ready).toBeFalsy();
});

it('Should be ready after the timer expires', () => {
  const { result } = renderHook(() => useTimeout(() => {}, 5000));

  act(() => vi.runAllTimers());

  expect(result.current.ready).toBeTruthy();
});

it('Should be ready after calling the cleaning function', () => {
  const { result } = renderHook(() => useTimeout(() => {}, 5000));

  act(() => result.current.clear());

  expect(result.current.ready).toBeTruthy();
});

import { act, renderHook } from '@testing-library/react';
import { vi } from 'vitest';

import { useThrottleValue } from './useThrottleValue';

beforeEach(vi.useFakeTimers);

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

// it("Should use throttle value", () => {
//   const { result } = renderHook(() => useThrottleValue("value", 100));

//   expect(result.current).toBe("value");
// });

// it("Should update value after delay", () => {
//   const { result, rerender } = renderHook(
//     ({ value, delay }) => useThrottleValue(value, delay),
//     {
//       initialProps: { value: "value", delay: 100 },
//     }
//   );

//   rerender({ value: "first", delay: 100 });
//   expect(result.current).toBe("first");

//   rerender({ value: "second", delay: 100 });
//   expect(result.current).not.toBe("second");

//   act(() => vi.advanceTimersByTime(100));
//   expect(result.current).toBe("second");
// });

it('Should apply new delay when delay changes', () => {
  const { result, rerender } = renderHook(({ value, delay }) => useThrottleValue(value, delay), {
    initialProps: { value: 'value', delay: 100 }
  });

  rerender({ value: 'first', delay: 100 });
  expect(result.current).toBe('first');

  rerender({ value: 'second', delay: 100 });
  expect(result.current).not.toBe('second');

  rerender({ value: 'third', delay: 200 });
  expect(result.current).toBe('third');

  act(() => vi.advanceTimersByTime(200));
  expect(result.current).toBe('third');
});

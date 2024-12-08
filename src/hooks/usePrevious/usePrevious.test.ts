import { renderHook } from '@testing-library/react';

import { usePrevious } from './usePrevious';

it('Should use previous', () => {
  const { result } = renderHook(() => usePrevious(0));

  expect(result.current).toBe(undefined);
});

it('Should return previous value after update', () => {
  const { result, rerender } = renderHook((state) => usePrevious(state), {
    initialProps: 0
  });

  expect(result.current).toBe(undefined);

  rerender(1);
  expect(result.current).toBe(0);

  rerender(Number.NaN);
  expect(result.current).toBe(1);

  rerender(0);
  expect(result.current).toBe(Number.NaN);

  rerender(-0);
  expect(result.current).toBe(0);

  rerender(1);
  expect(result.current).toBe(-0);
});

it('Should return previous object value after update', () => {
  const { result, rerender } = renderHook((state) => usePrevious(state), {
    initialProps: { count: 0 }
  });

  expect(result.current).toBe(undefined);

  rerender({ count: 1 });
  expect(result.current).toStrictEqual({ count: 0 });

  rerender({ count: 2 });
  expect(result.current).toStrictEqual({ count: 1 });
});

it('Should return previous object with custom options.equality', () => {
  const equality = (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next); // Deep equality check

  const { result, rerender } = renderHook((state) => usePrevious(state, { equality }), {
    initialProps: { count: 0, data: [1, 2, 3] }
  });

  expect(result.current).toBe(undefined);

  rerender({ count: 0, data: [1, 2, 3] });
  expect(result.current).toBe(undefined);

  rerender({ count: 1, data: [1, 2, 3] });
  expect(result.current).toStrictEqual({ count: 0, data: [1, 2, 3] });

  rerender({ count: 2, data: [4, 5, 6] });
  expect(result.current).toStrictEqual({ count: 1, data: [1, 2, 3] });
});

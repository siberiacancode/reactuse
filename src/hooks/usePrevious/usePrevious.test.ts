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

  rerender(2);
  expect(result.current).toBe(1);
});

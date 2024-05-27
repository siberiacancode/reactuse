import { renderHook } from '@testing-library/react';

import { usePrevious } from './usePrevious';

it('Should use previous value', () => {
  const { result } = renderHook(usePrevious);

  expect(result.current).toBe(undefined);
});

it('Should return previous value aftre update', () => {
  const { result, rerender } = renderHook(usePrevious);

  rerender(0);
  expect(result.current).toBe(undefined);

  rerender(2);
  expect(result.current).toBe(0);

  rerender(4);
  expect(result.current).toBe(2);
});

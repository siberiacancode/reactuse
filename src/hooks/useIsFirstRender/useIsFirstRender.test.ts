import { renderHook } from '@testing-library/react';

import { useIsFirstRender } from './useIsFirstRender';

it('Should return true on the first render', () => {
  const { result } = renderHook(useIsFirstRender);

  expect(result.current).toBe(true);
});

it('Should return false on subsequent renders', () => {
  const { result, rerender } = renderHook(useIsFirstRender);

  expect(result.current).toBe(true);

  rerender();
  expect(result.current).toBe(false);

  rerender();
  expect(result.current).toBe(false);
});

it('Should maintain state across multiple components', () => {
  const { result: result1, rerender: rerender1 } = renderHook(useIsFirstRender);
  const { result: result2, rerender: rerender2 } = renderHook(useIsFirstRender);

  expect(result1.current).toBe(true);
  expect(result2.current).toBe(true);

  rerender1();
  expect(result1.current).toBe(false);

  rerender2();
  expect(result2.current).toBe(false);
});

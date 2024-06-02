import { renderHook } from '@testing-library/react';

import { useIsFirstRender } from './useIsFirstRender';

it('Should use is first render', () => {
  const { result } = renderHook(useIsFirstRender);

  expect(result.current).toBe(true);
});

it('Should return false after render', () => {
  const { result, rerender } = renderHook(useIsFirstRender);

  expect(result.current).toBe(true);

  rerender();
  expect(result.current).toBe(false);

  rerender();
  expect(result.current).toBe(false);
});

import { renderHook } from '@testing-library/react';

import { useIsFirstRender } from './useIsFirstRender';

it('Should use is first render', () => {
  const { result } = renderHook(useIsFirstRender);

  expect(result.current).toBeTruthy();
});

it('Should return false after render', () => {
  const { result, rerender } = renderHook(useIsFirstRender);

  expect(result.current).toBeTruthy();

  rerender();
  expect(result.current).toBeFalsy();

  rerender();
  expect(result.current).toBeFalsy();
});

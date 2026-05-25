import { renderHook } from '@testing-library/react';

import { renderHookServer } from '@/tests';

import { useIsFirstRender } from './useIsFirstRender';

it('Should use is first render', () => {
  const { result } = renderHook(useIsFirstRender);

  expect(result.current).toBeTruthy();
});

it('Should use is first render on server side', () => {
  const { result } = renderHookServer(useIsFirstRender);

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

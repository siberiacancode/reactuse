import { renderHook } from '@testing-library/react';

import { useRenderCount } from './useRenderCount';

it('Should use render count', () => {
  const { result } = renderHook(useRenderCount);

  expect(result.current).toBe(0);
});

it('Should increment render count after component rerender', () => {
  const { result, rerender } = renderHook(useRenderCount);

  rerender();
  expect(result.current).toBe(1);

  rerender();
  expect(result.current).toBe(2);
});

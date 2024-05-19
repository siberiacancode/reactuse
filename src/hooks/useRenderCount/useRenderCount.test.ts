import { renderHook } from '@testing-library/react';

import { useRenderCount } from './useRenderCount';

it('Should be defined', () => {
  expect(useRenderCount).toBeDefined();
});

it('Should render with 0 value after first render', () => {
  const { result } = renderHook(() => useRenderCount());

  expect(result.current).toBe(0);
});

it('Should should increase render count by 1 after component rerender', () => {
  const { result, rerender } = renderHook(() => useRenderCount());

  rerender();

  expect(result.current).toBe(1);
});

it('Should should increase render count by 2 after component rerender twice', () => {
  const { result, rerender } = renderHook(() => useRenderCount());

  rerender();
  rerender();

  expect(result.current).toBe(2);
});

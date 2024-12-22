import { renderHook } from '@testing-library/react';

import { useElementSize } from './useElementSize';

it('Should use element size', () => {
  const { result } = renderHook(() => useElementSize());

  const { ref, value } = result.current;

  expect(typeof ref).toBe('function');
  expect(value).toEqual({ width: 0, height: 0 });
});

it('Should set initial value', () => {
  const { result } = renderHook(() => useElementSize({ width: 100, height: 100 }));

  expect(result.current.value).toEqual({ width: 100, height: 100 });
});

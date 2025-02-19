import { renderHook } from '@testing-library/react';

import { useConst } from './useConst';

it('Should use const', () => {
  const { result } = renderHook(() => useConst('value'));

  expect(result.current).toBe('value');
});

it('should return the same constant value', () => {
  const { result, rerender } = renderHook(() => useConst('value'));
  expect(result.current).toBe('value');

  rerender();

  expect(result.current).toBe('value');
});

it('Should call initializer function', () => {
  const init = vitest.fn(() => 99);
  const { result } = renderHook(() => useConst(init));

  expect(result.current).toBe(99);
  expect(init).toHaveBeenCalledOnce();
});

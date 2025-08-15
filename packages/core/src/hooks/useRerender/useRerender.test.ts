import { act, renderHook } from '@testing-library/react';

import { renderHookServer } from '@/tests';

import { useRerender } from './useRerender';

it('Should use rerender', () => {
  const { result } = renderHook(useRerender);

  expect(result.current).toBeTypeOf('function');
});

it('Should use rerender on server side', () => {
  const { result } = renderHookServer(useRerender);

  expect(result.current).toBeTypeOf('function');
});

it('Should trigger rerender when call rerender function', () => {
  let renderCount = 0;

  const { result } = renderHook(() => {
    renderCount++;
    return useRerender();
  });

  expect(renderCount).toBe(1);

  act(result.current);

  expect(renderCount).toBe(2);
});

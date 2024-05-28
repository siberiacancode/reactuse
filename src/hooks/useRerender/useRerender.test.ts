import { act, renderHook } from '@testing-library/react';

import { useRerender } from './useRerender';

it('Should use rerender', () => {
  const { result } = renderHook(useRerender);

  expect(typeof result.current.id).toBe('string');
});

it('Should update id on update call', () => {
  const { result } = renderHook(useRerender);
  const initialId = result.current.id;

  act(() => result.current.update());
  expect(result.current.id).not.toBe(initialId);
});

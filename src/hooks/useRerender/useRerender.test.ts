import { act } from 'react';
import { renderHook } from '@testing-library/react';

import { useRerender } from './useRerender';

it('Should initialize with id 0', () => {
  const { result } = renderHook(() => useRerender());

  expect(result.current.id).toBe(0);
});

it('Should update id on update call', () => {
  const { result } = renderHook(() => useRerender());
  const initialId = result.current.id;

  act(() => result.current.update());
  expect(result.current.id).not.toBe(initialId);
});

it('Should update id to a different value on multiple update calls', () => {
  const { result } = renderHook(() => useRerender());
  const initialId = result.current.id;

  act(() => result.current.update());
  const firstUpdateId = result.current.id;
  expect(result.current.id).not.toBe(initialId);

  act(() => result.current.update());
  expect(result.current.id).not.toBe(firstUpdateId);
});

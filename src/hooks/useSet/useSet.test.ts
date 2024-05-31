import { act, renderHook } from '@testing-library/react';

import { useSet } from './useSet';

it('Should use set', () => {
  const { result } = renderHook(() => useSet([1, 2, 3]));
  const set = result.current;

  expect(set.size).toBe(3);
  expect(typeof set.delete).toBe('function');
  expect(typeof set.clear).toBe('function');
  expect(typeof set.add).toBe('function');
});

it('Should add a new value and rerender', () => {
  const { result } = renderHook(() => useSet([1, 2, 3]));
  const set = result.current;

  act(() => set.add(4));

  expect(set.has(4)).toBe(true);
  expect(set.size).toBe(4);
});

it('Should delete a value and rerender', () => {
  const { result } = renderHook(() => useSet([1, 2, 3]));
  const set = result.current;

  act(() => set.delete(3));

  expect(set.has(3)).toBe(false);
  expect(set.size).toBe(2);
});

it('Should clear all values and rerender', () => {
  const { result } = renderHook(() => useSet([1, 2, 3]));
  const set = result.current;

  act(() => set.clear());

  expect(set.size).toBe(0);
});

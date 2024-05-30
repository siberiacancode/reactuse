import { act, renderHook } from '@testing-library/react';

import { useSet } from './useSet';

const SET_VALUES = [1, 2, 3];

const mocks = vi.hoisted(() => ({
  update: vi.fn()
}));

vi.mock('../useRerender/useRerender', () => ({
  useRerender: () => ({
    id: 'mock-id',
    update: mocks.update
  })
}));

beforeEach(() => {
  mocks.update.mockClear();
});

it('Should initialize with provided values', () => {
  const { result } = renderHook(() => useSet(SET_VALUES));
  const set = result.current;

  expect(set.has(1)).toBe(true);
  expect(set.has(2)).toBe(true);
  expect(set.has(3)).toBe(true);
});

it('Should add a new value and rerender', () => {
  const { result } = renderHook(() => useSet(SET_VALUES));
  const set = result.current;

  act(() => {
    set.add(4);
  });

  expect(set.has(4)).toBe(true);
  expect(mocks.update).toHaveBeenCalled();
});

it('Should delete a value and rerender', () => {
  const { result } = renderHook(() => useSet(SET_VALUES));
  const set = result.current;

  act(() => {
    set.delete(2);
  });

  expect(set.has(2)).toBe(false);
  expect(mocks.update).toHaveBeenCalled();
});

it('Should clear all values and rerender', () => {
  const { result } = renderHook(() => useSet(SET_VALUES));
  const set = result.current;

  act(() => {
    set.clear();
  });

  expect(set.size).toBe(0);
  expect(mocks.update).toHaveBeenCalled();
});

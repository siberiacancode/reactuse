import { act, renderHook } from '@testing-library/react';

import { useStateHistory } from './useStateHistory';

it('Should use useStateHistory', () => {
  const { result } = renderHook(() => useStateHistory(0));
  expect(result.current.value).toBe(0);
  expect(result.current.history).toEqual([0]);
  expect(result.current.index).toBe(0);
  expect(result.current.canUndo).toBe(false);
  expect(result.current.canRedo).toBe(false);
  expect(result.current.back).toBeTypeOf('function');
  expect(result.current.forward).toBeTypeOf('function');
  expect(result.current.reset).toBeTypeOf('function');
  expect(result.current.undo).toBeTypeOf('function');
  expect(result.current.redo).toBeTypeOf('function');
});

it('Should update value and history when pushing new value', () => {
  const { result } = renderHook(() => useStateHistory(0));

  act(() => result.current.set(1));

  expect(result.current.value).toBe(1);
  expect(result.current.history).toEqual([0, 1]);
  expect(result.current.index).toBe(1);
});

it('Should change canUndo flag when pushing new value', () => {
  const { result } = renderHook(() => useStateHistory(0));

  act(() => result.current.set(1));

  expect(result.current.canUndo).toBe(true);
});

it('Should respect history max size parameter', () => {
  const { result } = renderHook(() => useStateHistory(0, 3));

  act(() => {
    result.current.set(1);
    result.current.set(2);
    result.current.set(3);
  });

  expect(result.current.history.length).toBe(3);
  expect(result.current.history).toEqual([1, 2, 3]);
});

it('Should navigate history forward and backward', () => {
  const { result } = renderHook(() => useStateHistory(0));

  act(() => result.current.set(1));

  expect(result.current.value).toBe(1);
  expect(result.current.index).toBe(1);

  act(() => result.current.back());

  expect(result.current.value).toBe(0);
  expect(result.current.index).toBe(0);
});

it('Should reset to initial state', () => {
  const { result } = renderHook(() => useStateHistory(0));

  act(() => {
    result.current.set(1);
    result.current.reset();
  });

  expect(result.current.value).toBe(0);
  expect(result.current.history).toEqual([0]);
  expect(result.current.index).toBe(0);
});

it('Should undo last change', () => {
  const { result } = renderHook(() => useStateHistory(0));

  act(() => {
    result.current.set(1);
    result.current.undo();
  });

  expect(result.current.value).toBe(0);
  expect(result.current.history).toEqual([0]);
  expect(result.current.index).toBe(0);
});

it('Should redo last change', () => {
  const { result } = renderHook(() => useStateHistory(0));

  act(() => {
    result.current.set(1);
    result.current.undo();
    result.current.redo();
  });

  expect(result.current.value).toBe(1);
  expect(result.current.history).toEqual([0, 1]);
  expect(result.current.index).toBe(1);
});

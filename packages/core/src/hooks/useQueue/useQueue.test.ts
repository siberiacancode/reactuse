import { act, renderHook } from '@testing-library/react';

import { renderHookServer } from '@/tests';

import { useQueue } from './useQueue';

it('Should use queue', () => {
  const { result } = renderHook(() => useQueue());

  expect(Array.isArray(result.current.queue)).toBeTruthy();
  expect(result.current.first).toBeUndefined();
  expect(result.current.last).toBeUndefined();
  expect(result.current.size).toBe(0);
  expect(result.current.add).toBeTypeOf('function');
  expect(result.current.remove).toBeTypeOf('function');
  expect(result.current.clear).toBeTypeOf('function');
});

it('Should use queue on server side', () => {
  const { result } = renderHookServer(() => useQueue());

  expect(Array.isArray(result.current.queue)).toBeTruthy();
  expect(result.current.first).toBeUndefined();
  expect(result.current.last).toBeUndefined();
  expect(result.current.size).toBe(0);
  expect(result.current.add).toBeTypeOf('function');
  expect(result.current.remove).toBeTypeOf('function');
  expect(result.current.clear).toBeTypeOf('function');
});

it('Should initialize the queue with initial value', () => {
  const { result } = renderHook(() => useQueue([1, 2, 3]));

  expect(result.current.queue).toEqual([1, 2, 3]);
  expect(result.current.first).toBe(1);
  expect(result.current.last).toBe(3);
  expect(result.current.size).toBe(3);
});

it('Should add an element to the queue', () => {
  const { result } = renderHook(() => useQueue());

  act(() => result.current.add(1));

  expect(result.current.queue).toEqual([1]);
  expect(result.current.first).toBe(1);
  expect(result.current.last).toBe(1);
  expect(result.current.size).toBe(1);

  act(() => result.current.add(2));

  expect(result.current.queue).toEqual([1, 2]);
  expect(result.current.first).toBe(1);
  expect(result.current.last).toBe(2);
  expect(result.current.size).toBe(2);
});

it('Should remove an element from the queue and return it value', () => {
  const { result } = renderHook(() => useQueue([1, 2]));

  let removedElement;

  act(() => {
    removedElement = result.current.remove();
  });

  expect(removedElement).toBe(1);
  expect(result.current.queue).toEqual([2]);
  expect(result.current.first).toEqual(2);
  expect(result.current.last).toEqual(2);
  expect(result.current.size).toBe(1);

  act(() => {
    removedElement = result.current.remove();
  });

  expect(removedElement).toBe(2);
  expect(result.current.queue).toEqual([]);
  expect(result.current.first).toBeUndefined();
  expect(result.current.last).toBeUndefined();
  expect(result.current.size).toBe(0);
});

it('Should clear the queue', () => {
  const { result } = renderHook(() => useQueue([1, 2, 3]));

  act(result.current.clear);

  expect(result.current.queue).toEqual([]);
  expect(result.current.first).toBeUndefined();
  expect(result.current.last).toBeUndefined();
  expect(result.current.size).toBe(0);
});

it('Should handle removing from an empty queue', () => {
  const { result } = renderHook(() => useQueue());

  let removedElement;

  act(() => {
    removedElement = result.current.remove();
  });

  expect(removedElement).toBeUndefined();
  expect(result.current.queue).toEqual([]);
  expect(result.current.first).toBeUndefined();
  expect(result.current.last).toBeUndefined();
  expect(result.current.size).toBe(0);
});

it('Should maintain correct state across multiple operations', () => {
  const { result } = renderHook(() => useQueue<number>());

  act(() => {
    result.current.add(1);
    result.current.add(2);
    result.current.add(3);
    result.current.add(4);
  });

  expect(result.current.queue).toEqual([1, 2, 3, 4]);
  expect(result.current.first).toBe(1);
  expect(result.current.last).toBe(4);
  expect(result.current.size).toBe(4);

  const removedElementArray: number[] = [];

  Array.from({ length: 2 }).forEach(() => {
    act(() => {
      const removed = result.current.remove();
      removedElementArray.push(removed);
    });
  });

  expect(removedElementArray).toEqual([1, 2]);
  expect(result.current.queue).toEqual([3, 4]);
  expect(result.current.first).toBe(3);
  expect(result.current.last).toBe(4);
  expect(result.current.size).toBe(2);
});

import { act, renderHook } from '@testing-library/react';

import { renderHookServer } from '@/tests';

import { useObject } from './useObject';

it('Should use object', () => {
  const { result } = renderHook(() => useObject({ a: 1, b: 2, c: 3 }));

  expect(result.current.value).toEqual({ a: 1, b: 2, c: 3 });
  expect(result.current.set).toBeTypeOf('function');
  expect(result.current.reset).toBeTypeOf('function');
  expect(result.current.remove).toBeTypeOf('function');
  expect(result.current.clear).toBeTypeOf('function');
  expect(result.current.has).toBeTypeOf('function');
  expect(result.current.keys).toBeTypeOf('object');
  expect(result.current.empty).toBeTypeOf('boolean');
  expect(result.current.size).toBeTypeOf('number');
});

it('Should use object on server side', () => {
  const { result } = renderHookServer(() => useObject({ a: 1, b: 2, c: 3 }));

  expect(result.current.value).toEqual({ a: 1, b: 2, c: 3 });
  expect(result.current.set).toBeTypeOf('function');
  expect(result.current.reset).toBeTypeOf('function');
  expect(result.current.remove).toBeTypeOf('function');
  expect(result.current.clear).toBeTypeOf('function');
  expect(result.current.has).toBeTypeOf('function');
  expect(result.current.keys).toBeTypeOf('object');
  expect(result.current.empty).toBeTypeOf('boolean');
  expect(result.current.size).toBeTypeOf('number');
});

it('Should set initial value', () => {
  const { result } = renderHook(() => useObject({ name: 'John', age: 30 }));

  expect(result.current.value).toEqual({ name: 'John', age: 30 });
});

it('Should set partial object', () => {
  const { result } = renderHook(() => useObject({ a: 1, b: 2, c: 3 }));

  act(() => result.current.set({ a: 42 }));

  expect(result.current.value).toEqual({ a: 42, b: 2, c: 3 });
});

it('Should set multiple properties', () => {
  const { result } = renderHook(() => useObject({ a: 1, b: 2, c: 3 }));

  act(() => result.current.set({ a: 42, c: 99 }));

  expect(result.current.value).toEqual({ a: 42, b: 2, c: 99 });
});

it('Should reset object', () => {
  const { result } = renderHook(() => useObject({ a: 1, b: 2 }));

  act(() => result.current.set({ a: 99 }));
  act(() => result.current.reset());

  expect(result.current.value).toEqual({ a: 1, b: 2 });
});

it('Should remove property', () => {
  const { result } = renderHook(() => useObject({ a: 1, b: 2, c: 3 }));

  act(() => result.current.remove('b'));

  expect(result.current.value).toEqual({ a: 1, c: 3 });
});

it('Should not remove non-existing property', () => {
  const { result } = renderHook(() => useObject({ a: 1, b: 2 }));

  act(() => result.current.remove('c' as any));

  expect(result.current.value).toEqual({ a: 1, b: 2 });
});

it('Should clear object', () => {
  const { result } = renderHook(() => useObject({ a: 1, b: 2, c: 3 }));

  act(() => result.current.clear());

  expect(result.current.value).toEqual({});
});

it('Should check if property exists', () => {
  const { result } = renderHook(() => useObject({ a: 1, b: 2 }));

  expect(result.current.has('a')).toBeTruthy();
  expect(result.current.has('b')).toBeTruthy();
  expect(result.current.has('c' as any)).toBeFalsy();
});

it('Should return object keys', () => {
  const { result } = renderHook(() => useObject({ a: 1, b: 2, c: 3 }));

  expect(result.current.keys).toEqual(['a', 'b', 'c']);
});

it('Should update keys when object changes', () => {
  const { result } = renderHook(() => useObject({ a: 1, b: 2, c: 3 }));

  expect(result.current.keys).toEqual(['a', 'b', 'c']);

  act(() => result.current.remove('b'));

  expect(result.current.keys).toEqual(['a', 'c']);
});

it('Should check if object is empty', () => {
  const { result } = renderHook(() => useObject({}));

  expect(result.current.empty).toBeTruthy();

  act(() => result.current.set({ a: 1 }));

  expect(result.current.empty).toBeFalsy();
});

it('Should return object size', () => {
  const { result } = renderHook(() => useObject({ a: 1, b: 2, c: 3 }));

  expect(result.current.size).toBe(3);

  act(() => result.current.remove('b'));

  expect(result.current.size).toBe(2);
});

describe('Empty object', () => {
  it('Should handle empty initial object', () => {
    const { result } = renderHook(() => useObject({}));

    expect(result.current.value).toEqual({});
    expect(result.current.empty).toBeTruthy();
    expect(result.current.size).toBe(0);
    expect(result.current.keys).toEqual([]);
  });

  it('Should add properties to empty object', () => {
    const { result } = renderHook(() => useObject({}));

    act(() => result.current.set({ a: 1, b: 2 }));

    expect(result.current.value).toEqual({ a: 1, b: 2 });
    expect(result.current.empty).toBeFalsy();
    expect(result.current.size).toBe(2);
  });
});

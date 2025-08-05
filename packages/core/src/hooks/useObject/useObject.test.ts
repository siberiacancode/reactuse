import { act, renderHook } from '@testing-library/react';

import { useObject } from './useObject';

const INITIAL_OBJECT = { a: 1, b: 2, c: 3 };

describe('useObject', () => {
  it('Should use object', () => {
    const { result } = renderHook(() => useObject(INITIAL_OBJECT));
    const obj = result.current;

    expect(obj.state).toEqual(INITIAL_OBJECT);
    expect(obj.set).toBeTypeOf('function');
    expect(obj.get).toBeTypeOf('function');
    expect(obj.reset).toBeTypeOf('function');
    expect(obj.update).toBeTypeOf('function');
    expect(obj.merge).toBeTypeOf('function');
    expect(obj.remove).toBeTypeOf('function');
  });

  it('Should set property', () => {
    const { result } = renderHook(() => useObject(INITIAL_OBJECT));
    const obj = result.current;

    act(() => obj.set('a', 42));

    expect(result.current.state).toEqual({ a: 42, b: 2, c: 3 });
  });

  it('Should get property', () => {
    const { result } = renderHook(() => useObject(INITIAL_OBJECT));
    const obj = result.current;

    expect(obj.get('b')).toBe(2);
  });

  it('Should reset object', () => {
    const { result } = renderHook(() => useObject(INITIAL_OBJECT));
    const obj = result.current;

    act(() => obj.set('a', 99));
    act(() => obj.reset());

    expect(result.current.state).toEqual(INITIAL_OBJECT);
  });

  it('Should update object', () => {
    const { result } = renderHook(() => useObject(INITIAL_OBJECT));
    const obj = result.current;

    act(() => obj.update((prev) => ({ ...prev, d: 4 }) as typeof INITIAL_OBJECT & { d: number }));

    expect(result.current.state).toEqual({ a: 1, b: 2, c: 3, d: 4 });
  });

  it('Should merge object', () => {
    const { result } = renderHook(() => useObject(INITIAL_OBJECT));
    const obj = result.current;

    act(() => obj.merge({ b: 10 }));

    expect(result.current.state).toEqual({ a: 1, b: 10, c: 3 });
  });

  it('Should remove property', () => {
    const { result } = renderHook(() => useObject(INITIAL_OBJECT));
    const obj = result.current;

    act(() => obj.remove('b'));

    expect(result.current.state).toEqual({ a: 1, c: 3 });
  });
});

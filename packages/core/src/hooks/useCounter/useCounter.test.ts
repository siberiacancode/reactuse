import { act, renderHook } from '@testing-library/react';

import { renderHookServer } from '@/tests';

import { useCounter } from './useCounter';

it('Should use counter', () => {
  const { result } = renderHook(useCounter);

  expect(result.current.value).toBe(0);
  expect(result.current.inc).toBeTypeOf('function');
  expect(result.current.dec).toBeTypeOf('function');
  expect(result.current.reset).toBeTypeOf('function');
  expect(result.current.set).toBeTypeOf('function');
});

it('Should use counter on server side', () => {
  const { result } = renderHookServer(useCounter);

  expect(result.current.value).toBe(0);
  expect(result.current.inc).toBeTypeOf('function');
  expect(result.current.dec).toBeTypeOf('function');
  expect(result.current.reset).toBeTypeOf('function');
  expect(result.current.set).toBeTypeOf('function');
});

it('Should set initial value', () => {
  const { result } = renderHook(() => useCounter(5));

  expect(result.current.value).toBe(5);
});

it('Should reset counter', () => {
  const { result } = renderHook(useCounter);

  act(result.current.inc);
  expect(result.current.value).toBe(1);

  act(result.current.reset);
  expect(result.current.value).toBe(0);
});

it('Should set counter', () => {
  const { result } = renderHook(useCounter);

  act(() => result.current.set(5));
  expect(result.current.value).toBe(5);
});

it('Should set counter by callback', () => {
  const { result } = renderHook(useCounter);

  act(() => result.current.set((x) => x + 1));
  expect(result.current.value).toBe(1);

  act(() => result.current.set((x) => x - 1));
  expect(result.current.value).toBe(0);
});

it('Should decrement counter', () => {
  const { result } = renderHook(useCounter);

  act(result.current.dec);
  expect(result.current.value).toBe(-1);
});

it('Should decrement counter by value', () => {
  const { result } = renderHook(useCounter);

  act(() => result.current.dec(5));
  expect(result.current.value).toBe(-5);
});

it('Should increment counter', () => {
  const { result } = renderHook(useCounter);

  act(result.current.inc);
  expect(result.current.value).toBe(1);
});

it('Should increment counter by value', () => {
  const { result } = renderHook(useCounter);

  act(() => result.current.inc(5));
  expect(result.current.value).toBe(5);
});

it('Should not exceed the max limit', () => {
  const { result } = renderHook(() => useCounter(0, { max: 1 }));

  act(result.current.inc);
  expect(result.current.value).toBe(1);

  act(result.current.inc);
  expect(result.current.value).toBe(1);
});

it('Should set max limit if exceed limit', () => {
  const { result } = renderHook(() => useCounter(0, { max: 5 }));

  act(() => result.current.set(10));
  expect(result.current.value).toBe(5);
});

it('Should not exceed the min limit', () => {
  const { result } = renderHook(() => useCounter(1, { min: 0 }));

  act(result.current.dec);
  expect(result.current.value).toBe(0);

  act(result.current.dec);
  expect(result.current.value).toBe(0);
});

it('Should set min limit if exceed limit', () => {
  const { result } = renderHook(() => useCounter({ min: -5 }));

  act(() => result.current.set(-10));
  expect(result.current.value).toBe(-5);
});

describe('Value is object', () => {
  it('Should set initial value', () => {
    const { result } = renderHook(() => useCounter({ initialValue: 5 }));

    expect(result.current.value).toBe(5);
  });

  it('Should not exceed the max limit', () => {
    const { result } = renderHook(() => useCounter({ max: 1 }));

    act(result.current.inc);
    expect(result.current.value).toBe(1);

    act(result.current.inc);
    expect(result.current.value).toBe(1);
  });

  it('Should set max limit if exceed limit', () => {
    const { result } = renderHook(() => useCounter({ max: 5 }));

    act(() => result.current.set(10));
    expect(result.current.value).toBe(5);
  });

  it('Should not exceed the min limit', () => {
    const { result } = renderHook(() => useCounter({ min: 0 }));

    act(result.current.dec);
    expect(result.current.value).toBe(0);

    act(result.current.dec);
    expect(result.current.value).toBe(0);
  });

  it('Should set min limit if exceed limit', () => {
    const { result } = renderHook(() => useCounter({ min: -5 }));

    act(() => result.current.set(-10));
    expect(result.current.value).toBe(-5);
  });
});

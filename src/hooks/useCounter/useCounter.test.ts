import { act, renderHook } from '@testing-library/react';

import { useCounter } from './useCounter';

it('Should use counter', () => {
  const { result } = renderHook(useCounter);

  expect(result.current.count).toBe(0);
  expect(typeof result.current.inc).toBe('function');
  expect(typeof result.current.dec).toBe('function');
  expect(typeof result.current.reset).toBe('function');
  expect(typeof result.current.set).toBe('function');
});

it('Should set initial value', () => {
  const { result } = renderHook(() => useCounter(5));

  expect(result.current.count).toBe(5);
});

it('Should reset counter', () => {
  const { result } = renderHook(useCounter);

  act(result.current.inc);
  expect(result.current.count).toBe(1);

  act(result.current.reset);
  expect(result.current.count).toBe(0);
});

it('Should set counter', () => {
  const { result } = renderHook(useCounter);

  act(() => result.current.set(5));
  expect(result.current.count).toBe(5);
});

it('Should set counter by callback', () => {
  const { result } = renderHook(useCounter);

  act(() => result.current.set((x) => x + 1));
  expect(result.current.count).toBe(1);

  act(() => result.current.set((x) => x - 1));
  expect(result.current.count).toBe(0);
});

it('Should decrement counter', () => {
  const { result } = renderHook(useCounter);

  act(result.current.dec);
  expect(result.current.count).toBe(-1);
});

it('Should decrement counter by value', () => {
  const { result } = renderHook(useCounter);

  act(() => result.current.dec(5));
  expect(result.current.count).toBe(-5);
});

it('Should increment counter', () => {
  const { result } = renderHook(useCounter);

  act(result.current.inc);
  expect(result.current.count).toBe(1);
});

it('Should increment counter by value', () => {
  const { result } = renderHook(useCounter);

  act(() => result.current.inc(5));
  expect(result.current.count).toBe(5);
});

it('Should not exceed the max limit', () => {
  const { result } = renderHook(() => useCounter(0, { max: 1 }));

  act(result.current.inc);
  expect(result.current.count).toBe(1);

  act(result.current.inc);
  expect(result.current.count).toBe(1);
});

it('Should set max limit if exceed limit', () => {
  const { result } = renderHook(() => useCounter(0, { max: 5 }));

  act(() => result.current.set(10));
  expect(result.current.count).toBe(5);
});

it('Should not exceed the min limit', () => {
  const { result } = renderHook(() => useCounter(1, { min: 0 }));

  act(result.current.dec);
  expect(result.current.count).toBe(0);

  act(result.current.dec);
  expect(result.current.count).toBe(0);
});

it('Should set min limit if exceed limit', () => {
  const { result } = renderHook(() => useCounter({ min: -5 }));

  act(() => result.current.set(-10));
  expect(result.current.count).toBe(-5);
});

describe('Value is object', () => {
  it('Should set initial value', () => {
    const { result } = renderHook(() => useCounter({ initialValue: 5 }));

    expect(result.current.count).toBe(5);
  });

  it('Should not exceed the max limit', () => {
    const { result } = renderHook(() => useCounter({ max: 1 }));

    act(result.current.inc);
    expect(result.current.count).toBe(1);

    act(result.current.inc);
    expect(result.current.count).toBe(1);
  });

  it('Should set max limit if exceed limit', () => {
    const { result } = renderHook(() => useCounter({ max: 5 }));

    act(() => result.current.set(10));
    expect(result.current.count).toBe(5);
  });

  it('Should not exceed the min limit', () => {
    const { result } = renderHook(() => useCounter({ min: 0 }));

    act(result.current.dec);
    expect(result.current.count).toBe(0);

    act(result.current.dec);
    expect(result.current.count).toBe(0);
  });

  it('Should set min limit if exceed limit', () => {
    const { result } = renderHook(() => useCounter({ min: -5 }));

    act(() => result.current.set(-10));
    expect(result.current.count).toBe(-5);
  });
});

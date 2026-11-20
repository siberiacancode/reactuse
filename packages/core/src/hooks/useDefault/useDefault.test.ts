import { act, renderHook } from '@testing-library/react';

import { renderHookServer } from '@/tests';

import { useDefault } from './useDefault';

it('Should use default', () => {
  const { result } = renderHook(() => useDefault(5, 10));
  const [state, setState] = result.current;

  expect(state).toBe(5);
  expect(setState).toBeTypeOf('function');
});

it('Should use default on server side', () => {
  const { result } = renderHookServer(() => useDefault(5, 10));
  const [state, setState] = result.current;

  expect(state).toBe(5);
  expect(setState).toBeTypeOf('function');
});

it('Should return initial value', () => {
  const { result } = renderHook(() => useDefault(5, 10));
  expect(result.current[0]).toBe(5);
});

it('Should use lazy initial value', () => {
  const initialValue = vi.fn(() => 5);

  const { result, rerender } = renderHook(() => useDefault(initialValue, 10));

  expect(result.current[0]).toBe(5);
  expect(initialValue).toHaveBeenCalledOnce();

  rerender();

  expect(initialValue).toHaveBeenCalledOnce();
});

const emptyValues = [null, undefined];
emptyValues.forEach((emptyValue) => {
  it(`Should return default value when initial value is ${emptyValue}`, () => {
    const { result } = renderHook(() => useDefault(emptyValue, 1));
    expect(result.current[0]).toBe(1);
  });
});

it('Should set new value', () => {
  const { result } = renderHook(() => useDefault(5, 10));
  const [, setState] = result.current;

  act(() => setState(20));
  expect(result.current[0]).toBe(20);

  act(() => setState((prevState) => prevState! + 10));
  expect(result.current[0]).toBe(30);
});

emptyValues.forEach((emptyValue) => {
  it(`Should return default value when set value is ${emptyValue}`, () => {
    const { result } = renderHook(() => useDefault(5, 10));
    const [, setState] = result.current;

    act(() => setState(emptyValue));

    expect(result.current[0]).toBe(10);
  });
});

it('Should use latest default value', () => {
  const { result, rerender } = renderHook((defaultValue) => useDefault(undefined, defaultValue), {
    initialProps: 10
  });

  expect(result.current[0]).toBe(10);

  rerender(20);

  expect(result.current[0]).toBe(20);
});

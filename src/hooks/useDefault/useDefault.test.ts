import { act, renderHook } from '@testing-library/react';

import { useDefault } from './useDefault';

it('Should use default', () => {
  const { result } = renderHook(() => useDefault(5, 10));
  const [state, setState] = result.current;

  expect(state).toBe(5);
  expect(setState).toBeTypeOf('function');
});

it('Should return initial value', () => {
  const { result } = renderHook(() => useDefault(5, 10));
  expect(result.current[0]).toBe(5);
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

it('Should return default value when set new empty value', () => {
  const { result } = renderHook(() => useDefault(5, 10));
  const [, setState] = result.current;

  expect(result.current[0]).toBe(5);

  act(() => setState(undefined));

  expect(result.current[0]).toBe(10);
});

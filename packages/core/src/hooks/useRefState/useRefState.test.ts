import { act, renderHook } from '@testing-library/react';

import { renderHookServer } from '@/tests';

import { createRefState, useRefState } from './useRefState';

it('Should use ref state', () => {
  const { result } = renderHook(useRefState);

  expect(result.current.current).toBeUndefined();
  expect(result.current.state).toBeUndefined();
  expect(result.current).toBeTypeOf('function');
});

it('Should initialize with the given initial value', () => {
  const { result } = renderHook(() => useRefState(0));

  expect(result.current.current).toBe(0);
  expect(result.current.state).toBe(0);
  expect(result.current).toBeTypeOf('function');
});

it('Should use ref state on server side', () => {
  const { result } = renderHookServer(useRefState);

  expect(result.current.current).toBeUndefined();
  expect(result.current.state).toBeUndefined();
  expect(result.current).toBeTypeOf('function');
});

it('Should update the value when called as a function', () => {
  const { result } = renderHook(() => useRefState(0));

  act(() => result.current(1));

  expect(result.current.current).toBe(1);
  expect(result.current.state).toBe(1);
});

it('Should update the value when current is set directly', () => {
  const { result } = renderHook(() => useRefState(0));

  act(() => {
    result.current.current = 1;
  });

  expect(result.current.current).toBe(1);
  expect(result.current.state).toBe(1);
});

it('Should trigger rerender when the value is updated via function', () => {
  let renderCount = 0;
  const { result } = renderHook(() => {
    renderCount++;
    return useRefState(0);
  });

  expect(renderCount).toBe(1);

  act(() => result.current(1));

  expect(renderCount).toBe(2);
});

it('Should trigger rerender when the value is updated via current property', () => {
  let renderCount = 0;
  const { result } = renderHook(() => {
    renderCount++;
    return useRefState(0);
  });

  expect(renderCount).toBe(1);

  act(() => {
    result.current.current = 1;
  });

  expect(renderCount).toBe(2);
});

const values = [1, {}];
values.forEach((value) => {
  it(`Should trigger dont rerender when the value ${value} is equal to the current value`, () => {
    let renderCount = 0;
    const { result } = renderHook(() => {
      renderCount++;
      return useRefState(value);
    });

    expect(renderCount).toBe(1);

    act(() => {
      result.current.current = value;
    });

    expect(renderCount).toBe(1);
  });
});

it('Should create ref state', () => {
  const setState = vi.fn();
  const ref = createRefState(0, setState);
  const descriptor = Object.getOwnPropertyDescriptor(ref, 'current');

  expect(ref.current).toBe(0);
  expect(descriptor?.configurable).toBeTruthy();
  expect(descriptor?.enumerable).toBeTruthy();
});

it('Should not notify when the value is equal to the current value', () => {
  const value = {};
  const setState = vi.fn();
  const ref = createRefState(value, setState);

  ref(value);
  ref.current = value;

  expect(setState).not.toHaveBeenCalled();
});

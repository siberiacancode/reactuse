import { act, renderHook } from '@testing-library/react';

import { useRefState } from './useRefState';

it('Should initialize with the given initial value', () => {
  const { result } = renderHook(() => useRefState(0));

  expect(result.current.current).toBe(0);
  expect(result.current).toBeTypeOf('function');
});

it('Should update the value when called as a function', () => {
  const { result } = renderHook(() => useRefState(0));

  act(() => result.current(1));

  expect(result.current.current).toBe(1);
});

it('Should update the value when current is set directly', () => {
  const { result } = renderHook(() => useRefState(0));

  act(() => {
    result.current.current = 1;
  });

  expect(result.current.current).toBe(1);
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

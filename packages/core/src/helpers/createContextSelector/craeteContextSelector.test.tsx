import { act, renderHook } from '@testing-library/react';
import React, { useState } from 'react';

import { createContextSelector } from './createContextSelector';

interface ContextValue {
  counter1: number;
  counter2: number;
  setCounter1: React.Dispatch<React.SetStateAction<number>>;
  setCounter2: React.Dispatch<React.SetStateAction<number>>;
}

const { Provider, useSelector, useHasContext } = createContextSelector({} as ContextValue, {
  displayName: 'ContextValue',
  strict: true
});

it('Should return initial value from Provider', () => {
  const { result } = renderHook(() => useSelector((state) => state), {
    wrapper: ({ children }) => (
      <Provider
        value={{
          counter1: 10,
          counter2: 20,
          setCounter1: () => {},
          setCounter2: () => {}
        }}
      >
        {children}
      </Provider>
    )
  });

  expect(result.current.counter1).toBe(10);
  expect(result.current.counter2).toBe(20);
});

it('Should update value', () => {
  const { result } = renderHook(() => useSelector((state) => state), {
    wrapper: ({ children }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [counter1, setCounter1] = useState(0);
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [counter2, setCounter2] = useState(0);

      return (
        <Provider value={{ counter1, setCounter1, counter2, setCounter2 }}>{children}</Provider>
      );
    }
  });

  expect(result.current.counter1).toBe(0);
  expect(result.current.counter2).toBe(0);

  act(() => result.current.setCounter1(1));
  act(() => result.current.setCounter2(2));

  expect(result.current.counter1).toBe(1);
  expect(result.current.counter2).toBe(2);
});

it('Should detect context existence', () => {
  const { result } = renderHook(() => useHasContext());
  expect(result.current).toBe(false);

  const { result: withProviderResult } = renderHook(() => useHasContext(), {
    wrapper: ({ children }) => (
      <Provider
        value={{
          counter1: 1,
          counter2: 2,
          setCounter1: () => {},
          setCounter2: () => {}
        }}
      >
        {children}
      </Provider>
    )
  });
  expect(withProviderResult.current).toBe(true);
});

it('Should throw an error if the context is not found', () => {
  expect(() => renderHook(() => useSelector())).toThrow('Context ContextValue not found');
});

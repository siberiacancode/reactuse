import { act, renderHook } from '@testing-library/react';
import React, { useState } from 'react';

import { createReactiveContext } from './createReactiveContext';

interface ContextValue {
  counter1: number;
  counter2: number;
  setCounter1: React.Dispatch<React.SetStateAction<number>>;
  setCounter2: React.Dispatch<React.SetStateAction<number>>;
}

const { Provider, useSelector } = createReactiveContext({} as ContextValue, {
  name: 'ContextValue',
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
      const [counter1, setCounter1] = useState(0);
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

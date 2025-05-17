import { act, renderHook } from '@testing-library/react';

import { createContext } from './createContext';

const countContext = createContext<number>(0);

it('Should return initial value from provider', () => {
  const { result } = renderHook(() => countContext.useSelect(), {
    wrapper: ({ children }) => (
      <countContext.Provider initialValue={1}>{children}</countContext.Provider>
    )
  });

  expect(result.current.value).toBe(1);
  expect(result.current.set).toBeTypeOf('function');
});

it('Should update value', () => {
  const { result } = renderHook(() => countContext.useSelect(), {
    wrapper: ({ children }) => (
      <countContext.Provider initialValue={1}>{children}</countContext.Provider>
    )
  });

  expect(result.current.value).toBe(1);

  act(() => result.current.set(2));

  expect(result.current.value).toBe(2);
});

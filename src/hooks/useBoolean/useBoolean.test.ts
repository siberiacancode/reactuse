import { act, renderHook } from '@testing-library/react';

import { useBoolean } from './useBoolean';

it('Should use counter', () => {
  const { result } = renderHook(useBoolean);
  const [on, toggle] = result.current;

  expect(on).toBe(false);
  expect(typeof toggle).toBe('function');
});

it('Should set initial value', () => {
  const { result } = renderHook(() => useBoolean(true));
  const [on] = result.current;

  expect(on).toBe(true);
});

it('Should toggle boolean', () => {
  const { result } = renderHook(useBoolean);
  const toggle = result.current[1];

  act(() => toggle());
  expect(result.current[0]).toBe(true);

  act(() => toggle());
  expect(result.current[0]).toBe(false);

  act(() => toggle(false));
  expect(result.current[0]).toBe(false);

  act(() => toggle(true));
  expect(result.current[0]).toBe(true);
});

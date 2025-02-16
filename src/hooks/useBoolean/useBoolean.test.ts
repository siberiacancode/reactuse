import { act, renderHook } from '@testing-library/react';

import { useBoolean } from './useBoolean';

it('Should use counter', () => {
  const { result } = renderHook(useBoolean);
  const [on, toggle] = result.current;

  expect(on).toBeFalsy();
  expect(toggle).toBeTypeOf('function');
});

it('Should set initial value', () => {
  const { result } = renderHook(() => useBoolean(true));
  const [on] = result.current;

  expect(on).toBeTruthy();
});

it('Should toggle boolean', () => {
  const { result } = renderHook(useBoolean);
  const toggle = result.current[1];

  act(toggle);
  expect(result.current[0]).toBeTruthy();

  act(toggle);
  expect(result.current[0]).toBeFalsy();

  act(() => toggle(false));
  expect(result.current[0]).toBeFalsy();

  act(() => toggle(true));
  expect(result.current[0]).toBeTruthy();
});

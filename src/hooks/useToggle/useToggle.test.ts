import { act, renderHook } from '@testing-library/react';

import { useToggle } from './useToggle';

it('Should use toggle', () => {
  const { result } = renderHook(() => useToggle());
  const [on, toggle] = result.current;

  expect(on).toBeFalsy();
  expect(typeof toggle).toBe('function');
});

it('Should initialize the toggle with initial value', () => {
  const { result } = renderHook(() => useToggle(['dark', 'light'] as const));
  const [on] = result.current;

  expect(on).toBe('dark');
});

it('Should toggle value', () => {
  const { result } = renderHook(() => useToggle(['dark', 'light'] as const));
  const [, toggle] = result.current;

  expect(result.current[0]).toBe('dark');
  act(() => toggle());
  expect(result.current[0]).toBe('light');
});

it('Should allows to set value', () => {
  const { result } = renderHook(() => useToggle(['dark', 'light'] as const));
  const [, toggle] = result.current;

  act(() => toggle('dark'));
  expect(result.current[0]).toBe('dark');

  act(() => toggle('light'));
  expect(result.current[0]).toBe('light');
});

it('Should allows to set value with callback function', () => {
  const { result } = renderHook(() => useToggle(['dark', 'light'] as const));
  const [, toggle] = result.current;

  act(() => toggle((value) => value));
  expect(result.current[0]).toBe('dark');
});

it('Should correctly toggles more than two values', () => {
  const { result } = renderHook(() => useToggle(['dark', 'light', 'normal'] as const));
  const [, toggle] = result.current;

  act(() => toggle());
  expect(result.current[0]).toBe('light');

  act(() => toggle());
  expect(result.current[0]).toBe('normal');

  act(() => toggle());
  expect(result.current[0]).toBe('dark');

  act(() => toggle('normal'));
  expect(result.current[0]).toBe('normal');

  act(() => toggle());
  expect(result.current[0]).toBe('dark');
});

import { act } from 'react';
import { renderHook } from '@testing-library/react';

import { useDefault } from './useDefault';

it('Should use default', () => {
  const { result } = renderHook(() => useDefault(5, 10));
  const [state, setState] = result.current;

  expect(typeof state).toBe('number');
  expect(typeof setState).toBe('function');
});

it('Should return initial value', () => {
  const { result } = renderHook(() => useDefault(5, 10));

  expect(result.current[0]).toBe(5);
});

it('Should return default value', () => {
  const { result } = renderHook(() => useDefault(undefined, 10));

  expect(result.current[0]).toBe(10);
});

it('Should return default value', () => {
  const { result } = renderHook(() => useDefault(null, 10));

  expect(result.current[0]).toBe(10);
});

it('Should set new value', () => {
  const { result } = renderHook(() => useDefault(5, 10));

  act(() => result.current[1](20));
  expect(result.current[0]).toBe(20);
});

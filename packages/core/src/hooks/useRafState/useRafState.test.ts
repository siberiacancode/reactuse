import { act, renderHook } from '@testing-library/react';
import { vi } from 'vitest';

import { renderHookServer } from '@/tests';

import { useRafState } from './useRafState';

beforeEach(vi.useFakeTimers);
afterEach(vi.useRealTimers);

it('Should use raf state', () => {
  const { result } = renderHook(() => useRafState(0));
  const [value, setValue] = result.current;

  expect(value).toBe(0);
  expect(setValue).toBeTypeOf('function');
});

it('Should use raf state on server side', () => {
  const { result } = renderHookServer(() => useRafState(0));
  const [value, setValue] = result.current;

  expect(value).toBe(0);
  expect(setValue).toBeTypeOf('function');
});

it('Should handle function as initial value', () => {
  const { result } = renderHook(() => useRafState(() => 'value'));
  const [value] = result.current;

  expect(value).toBe('value');
});

it('Should set value using requestAnimationFrame', async () => {
  const requestAnimationFrame = vi.spyOn(window, 'requestAnimationFrame');
  const { result } = renderHook(() => useRafState(0));
  const [, setValue] = result.current;

  act(() => setValue(10));

  expect(requestAnimationFrame).toHaveBeenCalledOnce();
});

it('Should cleanup on unmount', () => {
  const cancelAnimationFrame = vi.spyOn(window, 'cancelAnimationFrame');
  const { unmount } = renderHook(() => useRafState(0));

  unmount();
  expect(cancelAnimationFrame).toHaveBeenCalledOnce();
});

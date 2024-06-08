import { renderHook } from '@testing-library/react';

import { useEvent } from './useEvent';

it('Should use event', () => {
  const { result } = renderHook(() => useEvent(() => {}));

  expect(result.current).toBeTypeOf('function');
});

it('Should return stable reference', () => {
  let callback = vi.fn();
  const { result, rerender } = renderHook(() => useEvent(callback));
  const firstCallbackReference = result.current;
  rerender();

  expect(result.current).toBe(firstCallbackReference);

  callback = vi.fn();
  rerender();

  expect(result.current).toBe(firstCallbackReference);
});

it('Should call the most recent callback', () => {
  let callback = vi.fn();
  const { result, rerender } = renderHook(() => useEvent(callback));
  result.current();

  expect(callback).toHaveBeenCalledTimes(1);

  callback = vi.fn();
  rerender();
  result.current();

  expect(callback).toHaveBeenCalledTimes(1);
});

it('Should handle changing callback with parameters', () => {
  let callback = vi.fn((num: number) => num * 2);
  const { result, rerender } = renderHook(() => useEvent(callback));

  expect(result.current(2)).toBe(4);

  callback = vi.fn((num: number) => num * 3);
  rerender();

  expect(result.current(2)).toBe(6);
});

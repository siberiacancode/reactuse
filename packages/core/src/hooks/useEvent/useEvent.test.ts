import { renderHook } from '@testing-library/react';

import { useEvent } from './useEvent';

it('Should use event', () => {
  const { result } = renderHook(() => useEvent(vi.fn));

  expect(result.current).toBeTypeOf('function');
});

it('Should return stable reference', () => {
  const firstCallback = vi.fn();
  const { result, rerender } = renderHook((callback) => useEvent(callback), {
    initialProps: firstCallback
  });

  const callbackReference = result.current;

  expect(result.current).toBe(callbackReference);

  const secondCallback = vi.fn();
  rerender(secondCallback);

  expect(result.current).toBe(callbackReference);
});

it('Should call the most recent callback', () => {
  const firstCallback = vi.fn();
  const { result, rerender } = renderHook((callback) => useEvent(callback), {
    initialProps: firstCallback
  });
  result.current();

  expect(firstCallback).toHaveBeenCalledTimes(1);

  const secondCallback = vi.fn();
  rerender(secondCallback);

  result.current();

  expect(secondCallback).toHaveBeenCalledTimes(1);
});

import { renderHook } from '@testing-library/react';

import { useUnmount } from './useUnmount';

it('Should use unmount', () => {
  const callback = jest.fn();
  const { unmount } = renderHook(() => useUnmount(callback));

  unmount();

  expect(callback).toHaveBeenCalled();
});

it('Should not call callback on mount', () => {
  const callback = jest.fn();
  renderHook(() => useUnmount(callback));

  expect(callback).not.toHaveBeenCalled();
});

it('Should not call callback after rerender', () => {
  const callback = jest.fn();
  const { rerender } = renderHook(() => useUnmount(callback));

  rerender();

  expect(callback).not.toHaveBeenCalled();
});

it('Should call callback if is has been changed', () => {
  const firstCallback = jest.fn();
  const secondCallback = jest.fn();
  const { unmount, rerender } = renderHook((callback) => useUnmount(callback), {
    initialProps: firstCallback
  });

  rerender(secondCallback);
  unmount();

  expect(firstCallback).not.toHaveBeenCalled();
  expect(secondCallback).toHaveBeenCalled();
});

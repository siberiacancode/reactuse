import { renderHook } from '@testing-library/react';

import { useUnmount } from './useUnmount';

it('Should use unmount', () => {
  const callback = vi.fn();
  const { unmount } = renderHook(() => useUnmount(callback));

  unmount();

  expect(callback).toHaveBeenCalled();
});

it('Should not call callback on mount', () => {
  const callback = vi.fn();
  renderHook(() => useUnmount(callback));

  expect(callback).not.toHaveBeenCalled();
});

it('Should not call callback after rerender', () => {
  const callback = vi.fn();
  const { rerender } = renderHook(() => useUnmount(callback));

  rerender();

  expect(callback).not.toHaveBeenCalled();
});

it('Should call callback if is has been changed', () => {
  const firstCallback = vi.fn();
  const secondCallback = vi.fn();
  const { unmount, rerender } = renderHook((callback) => useUnmount(callback), {
    initialProps: firstCallback
  });

  rerender(secondCallback);
  unmount();

  expect(firstCallback).not.toHaveBeenCalled();
  expect(secondCallback).toHaveBeenCalled();
});

import { renderHook } from '@testing-library/react';

import { useMount } from './useMount';

it('Should use mount', () => {
  const callback = vi.fn();
  renderHook(() => useMount(callback));

  expect(callback).toHaveBeenCalled();
});

it('Should not call callback after rerender', () => {
  const callback = vi.fn();
  const { rerender } = renderHook(() => useMount(callback));

  rerender();

  expect(callback).toHaveBeenCalledOnce();
});

it('Should not call callback on unmount', () => {
  const callback = vi.fn();
  const { unmount } = renderHook(() => useMount(callback));

  unmount();

  expect(callback).toHaveBeenCalledOnce();
});

import { renderHook } from '@testing-library/react';

import { useMount } from './useMount';

it('Should use mount', () => {
  const callback = jest.fn();
  renderHook(() => useMount(callback));

  expect(callback).toHaveBeenCalled();
});

it('Should not call callback after rerender', () => {
  const callback = jest.fn();
  const { rerender } = renderHook(() => useMount(callback));

  rerender();

  expect(callback).toHaveBeenCalledTimes(1);
});

it('Should not call callback on unmount', () => {
  const callback = jest.fn();
  const { unmount } = renderHook(() => useMount(callback));

  unmount();

  expect(callback).toHaveBeenCalledTimes(1);
});

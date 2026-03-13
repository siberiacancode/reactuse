import { renderHook } from '@testing-library/react';

import { renderHookServer } from '@/tests';

import { useMount } from './useMount';

it('Should use mount', () => {
  const callback = vi.fn();
  renderHook(() => useMount(callback));

  expect(callback).toHaveBeenCalled();
});

it('Should use mount on server side', () => {
  const callback = vi.fn();
  renderHookServer(() => useMount(callback));

  expect(callback).not.toHaveBeenCalled();
});

it('Should not call callback after rerender', () => {
  const callback = vi.fn();
  const { rerender } = renderHook(() => useMount(callback));

  expect(callback).toHaveBeenCalledOnce();

  rerender();

  expect(callback).toHaveBeenCalledOnce();
});

it('Should call callback on unmount', () => {
  const callback = vi.fn();
  const { unmount } = renderHook(() => useMount(() => callback));

  expect(callback).not.toHaveBeenCalled();

  unmount();

  expect(callback).toHaveBeenCalledOnce();
});

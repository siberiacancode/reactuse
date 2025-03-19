import { renderHook } from '@testing-library/react';

import { useOnce } from './useOnce';

it('Should use once', () => {
  const callback = vi.fn();
  renderHook(() => useOnce(callback));

  expect(callback).toHaveBeenCalled();
});

it('Should not call callback after rerender', () => {
  const callback = vi.fn();
  const { rerender } = renderHook(() => useOnce(callback));

  expect(callback).toHaveBeenCalledOnce();

  rerender();

  expect(callback).toHaveBeenCalledOnce();
});

it('Should call callback on unmount', () => {
  const callback = vi.fn();
  const { unmount, rerender } = renderHook(() => useOnce(() => callback));

  expect(callback).not.toHaveBeenCalled();

  rerender();
  unmount();

  expect(callback).toHaveBeenCalledOnce();
});

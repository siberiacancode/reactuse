import { act, renderHook } from '@testing-library/react';

import { usePageLeave } from './usePageLeave';

it('Should use page leave', () => {
  const callback = vi.fn();
  const { result } = renderHook(() => usePageLeave(callback));
  expect(typeof result.current).toBe('boolean');
});

it('Should call the callback on page leave', () => {
  const callback = vi.fn();
  const { result } = renderHook(() => usePageLeave(callback));
  expect(result.current).toBeFalsy();

  act(() => document.dispatchEvent(new Event('mouseleave')));
  expect(callback).toHaveBeenCalledOnce();
  expect(result.current).toBeTruthy();

  act(() => document.dispatchEvent(new Event('mouseenter')));
  expect(result.current).toBeFalsy();

  act(() => document.dispatchEvent(new Event('mouseleave')));
  expect(callback).toBeCalledTimes(2);
  expect(result.current).toBeTruthy();
});

it('Should cleanup up on unmount', () => {
  const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');
  const { unmount } = renderHook(usePageLeave);

  unmount();

  expect(removeEventListenerSpy).toHaveBeenCalledWith('mouseenter', expect.any(Function));
  expect(removeEventListenerSpy).toHaveBeenCalledWith('mouseleave', expect.any(Function));
});

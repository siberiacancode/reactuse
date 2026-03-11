import { act, renderHook } from '@testing-library/react';

import { renderHookServer } from '@/tests';

import { useWindowFocus } from './useWindowFocus';

it('Should use window focus', () => {
  const { result } = renderHook(useWindowFocus);

  expect(result.current).toBe(false);
});

it('Should use window focus on server side', () => {
  const { result } = renderHookServer(useWindowFocus);

  expect(result.current).toBe(false);
});

it('Should update state on focus and blur events', () => {
  const { result } = renderHook(useWindowFocus);

  expect(result.current).toBe(false);

  act(() => {
    window.dispatchEvent(new Event('focus'));
  });

  expect(result.current).toBe(true);

  act(() => {
    window.dispatchEvent(new Event('blur'));
  });

  expect(result.current).toBe(false);
});

it('Should cleanup on unmount', () => {
  const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
  const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

  const { unmount } = renderHook(useWindowFocus);

  expect(addEventListenerSpy).toHaveBeenCalledWith('focus', expect.any(Function));
  expect(addEventListenerSpy).toHaveBeenCalledWith('blur', expect.any(Function));

  unmount();

  expect(removeEventListenerSpy).toHaveBeenCalledWith('focus', expect.any(Function));
  expect(removeEventListenerSpy).toHaveBeenCalledWith('blur', expect.any(Function));
});

it('Should not update state after unmount', () => {
  const { result, unmount } = renderHook(useWindowFocus);

  unmount();

  act(() => {
    window.dispatchEvent(new Event('focus'));
  });

  expect(result.current).toBe(false);
});

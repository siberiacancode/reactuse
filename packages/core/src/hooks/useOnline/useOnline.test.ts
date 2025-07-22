import { act, renderHook } from '@testing-library/react';

import { renderHookServer } from '@/tests';

import { useOnline } from './useOnline';

const mockNavigatorOnline = vi.spyOn(navigator, 'onLine', 'get');

it('Should use online', () => {
  mockNavigatorOnline.mockReturnValue(true);
  const { result } = renderHook(useOnline);
  expect(result.current).toBeTruthy();
});

it('Should use network on server side', () => {
  const { result } = renderHookServer(useOnline);
  expect(result.current).toBeFalsy();
});

it('Should change value upon network events', () => {
  mockNavigatorOnline.mockReturnValue(true);
  const { result } = renderHook(useOnline);
  expect(result.current).toBeTruthy();

  mockNavigatorOnline.mockReturnValue(false);
  act(() => window.dispatchEvent(new Event('offline')));
  expect(result.current).toBeFalsy();

  mockNavigatorOnline.mockReturnValue(true);
  act(() => window.dispatchEvent(new Event('online')));
  expect(result.current).toBeTruthy();
});

it('Should cleanup up on unmount', () => {
  const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

  const { unmount } = renderHook(useOnline);

  unmount();

  expect(removeEventListenerSpy).toHaveBeenCalledWith('online', expect.any(Function));
  expect(removeEventListenerSpy).toHaveBeenCalledWith('offline', expect.any(Function));
});

import { act, renderHook } from '@testing-library/react';

import { renderHookServer } from '@/tests';

import { useNetwork } from './useNetwork';

const mockNavigatorOnline = vi.spyOn(navigator, 'onLine', 'get');

it('Should use network', () => {
  const { result } = renderHook(useNetwork);
  expect(result.current.online).toBeTruthy();
});

it('Should use network on server side', () => {
  const { result } = renderHookServer(useNetwork);
  expect(result.current).toEqual({
    online: false,
    type: undefined,
    effectiveType: undefined,
    saveData: false,
    downlink: 0,
    downlinkMax: 0,
    rtt: 0
  });
});

it('Should change state upon network events', () => {
  mockNavigatorOnline.mockReturnValue(true);
  const { result } = renderHook(useNetwork);
  expect(result.current.online).toBeTruthy();

  mockNavigatorOnline.mockReturnValue(false);
  act(() => window.dispatchEvent(new Event('offline')));
  expect(result.current.online).toBeFalsy();

  mockNavigatorOnline.mockReturnValue(true);
  act(() => window.dispatchEvent(new Event('online')));
  expect(result.current.online).toBeTruthy();
});

it('Should cleanup up on unmount', () => {
  const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

  const { unmount } = renderHook(useNetwork);

  unmount();

  expect(removeEventListenerSpy).toHaveBeenCalledWith('online', expect.any(Function));
  expect(removeEventListenerSpy).toHaveBeenCalledWith('offline', expect.any(Function));
});

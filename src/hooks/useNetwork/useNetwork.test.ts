import { act, renderHook } from '@testing-library/react';

import { renderHookServer } from '@/tests';

import { useNetwork } from './useNetwork';

it('Should use network', () => {
  const { result } = renderHook(useNetwork);

  expect(result.current.online).toBeTruthy();
});

it('Should use network on server', () => {
  const { result } = renderHookServer(() => useNetwork());

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
  const { result } = renderHook(useNetwork);

  expect(result.current.online).toBeTruthy();

  act(() => {
    Object.defineProperty(window.navigator, 'onLine', {
      get: () => false,
      configurable: true
    });
    window.dispatchEvent(new Event('offline'));
  });
  expect(result.current.online).toBeFalsy();

  act(() => {
    Object.defineProperty(window.navigator, 'onLine', {
      get: () => true,
      configurable: true
    });
    window.dispatchEvent(new Event('online'));
  });
  expect(result.current.online).toBeTruthy();
});

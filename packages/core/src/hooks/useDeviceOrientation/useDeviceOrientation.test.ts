import { act, renderHook } from '@testing-library/react';

import { renderHookServer } from '@/tests';

import { useDeviceOrientation } from './useDeviceOrientation';

beforeEach(() => {
  Object.assign(globalThis.window, {
    DeviceOrientationEvent: {}
  });
});

it('Should use on device orientation', () => {
  const { result } = renderHook(useDeviceOrientation);

  expect(result.current.supported).toBeTruthy();
  expect(result.current.value.alpha).toBeNull();
  expect(result.current.value.beta).toBeNull();
  expect(result.current.value.gamma).toBeNull();
  expect(result.current.value.absolute).toBeFalsy();
});

it('Should use on device orientation on server side', () => {
  const { result } = renderHookServer(useDeviceOrientation);

  expect(result.current.supported).toBeFalsy();
  expect(result.current.value.alpha).toBeNull();
  expect(result.current.value.beta).toBeNull();
  expect(result.current.value.gamma).toBeNull();
  expect(result.current.value.absolute).toBeFalsy();
});

it('Should use on device orientation for unsupported', () => {
  Object.assign(globalThis.window, {
    DeviceOrientationEvent: undefined
  });
  const { result } = renderHook(useDeviceOrientation);

  expect(result.current.supported).toBeFalsy();
});

it('Should set new values when device orientation change', () => {
  const { result } = renderHook(useDeviceOrientation);

  act(() => {
    const event = new Event('deviceorientation');
    Object.assign(event, {
      alpha: 30,
      beta: 60,
      gamma: 90,
      absolute: true
    });

    window.dispatchEvent(event);
  });

  expect(result.current.value.alpha).toBe(30);
  expect(result.current.value.beta).toBe(60);
  expect(result.current.value.gamma).toBe(90);
  expect(result.current.value.absolute).toBeTruthy();
});

it('Should cleanup on unmount', () => {
  const removeEventListenerSpy = vi.spyOn(globalThis.window, 'removeEventListener');
  const { unmount } = renderHook(useDeviceOrientation);

  unmount();

  expect(removeEventListenerSpy).toBeCalledWith('deviceorientation', expect.any(Function));
});

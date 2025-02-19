import { act, renderHook } from '@testing-library/react';

import { useDeviceOrientation } from './useDeviceOrientation';

beforeAll(() => {
  Object.defineProperty(window, 'DeviceOrientationEvent', {
    configurable: true,
    value: {},
    writable: true
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

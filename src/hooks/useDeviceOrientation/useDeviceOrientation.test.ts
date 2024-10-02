import { act, renderHook } from '@testing-library/react';

import { useDeviceOrientation } from './useDeviceOrientation';

it('Should use onDeviceOrientation', () => {
  const { result } = renderHook(useDeviceOrientation);

  expect(result.current.supported).toBe(true);
  expect(typeof result.current.onDeviceOrientation).toBe('function');
});

it('Should use initial values', () => {
  const { result } = renderHook(useDeviceOrientation);

  expect(result.current.value.alpha).toBeNull();
  expect(result.current.value.beta).toBeNull();
  expect(result.current.value.gamma).toBeNull();
  expect(result.current.value.absolute).toBeFalsy();
});

it('Should set new values', () => {
  const { result } = renderHook(useDeviceOrientation);

  const mockEvent = {
    alpha: 30,
    beta: 60,
    gamma: 90,
    absolute: true
  };

  act(() => {
    const event = new Event('deviceorientation');
    Object.assign(event, mockEvent);
    window.dispatchEvent(event);
  });

  expect(result.current.value.alpha).toContain(mockEvent.alpha);
  expect(result.current.value.beta).toContain(mockEvent.beta);
  expect(result.current.value.gamma).toContain(mockEvent.gamma);
  expect(result.current.value.absolute).toContain(mockEvent.absolute);
});

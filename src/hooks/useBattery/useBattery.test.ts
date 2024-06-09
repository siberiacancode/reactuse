import { act } from 'react';
import { renderHook, waitFor } from '@testing-library/react';

import { useBattery } from './useBattery';

let batteryManager = {
  level: 0.5,
  charging: true,
  chargingTime: 1000,
  dischargingTime: 1000,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn()
};
const mockBatteryManager = () => batteryManager;

beforeEach(() => {
  batteryManager = {
    level: 0.5,
    charging: true,
    chargingTime: 1000,
    dischargingTime: 1000,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn()
  };
  Object.defineProperty(navigator, 'getBattery', {
    writable: true,
    value: vi.fn().mockImplementationOnce(() => {
      return new Promise((resolve) => {
        resolve(mockBatteryManager());
      });
    })
  });
});

afterEach(() => {
  vi.clearAllMocks();
});

it('Should use battery', async () => {
  const batteryMock = mockBatteryManager();
  const { result, unmount } = renderHook(() => useBattery());

  expect(result.current).toEqual({
    supported: false,
    loading: true,
    level: 0,
    charging: false,
    chargingTime: 0,
    dischargingTime: 0
  });

  await waitFor(() => {
    expect(result.current).toEqual({
      supported: true,
      loading: true,
      level: batteryMock.level,
      charging: batteryMock.charging,
      chargingTime: batteryMock.chargingTime,
      dischargingTime: batteryMock.dischargingTime
    });
  });
  unmount();
});

it('Should update state when battery events change', async () => {
  const batteryMock = mockBatteryManager();
  const { result, unmount } = renderHook(() => useBattery());

  await waitFor(() => {
    expect(result.current).toEqual({
      supported: true,
      loading: true,
      level: batteryMock.level,
      charging: batteryMock.charging,
      chargingTime: batteryMock.chargingTime,
      dischargingTime: batteryMock.dischargingTime
    });
  });
  const listeners: Array<[string, () => void]> = batteryMock.addEventListener.mock.calls;
  const listenersDict = listeners.reduce<Record<string, () => void>>((acc, [type, listener]) => {
    return { ...acc, [type]: listener };
  }, {});

  act(() => {
    batteryMock.level = 0.8;
    listenersDict.levelchange?.();
  });

  await waitFor(() => {
    expect(result.current.level).toBe(0.8);
  });

  act(() => {
    batteryMock.charging = false;
    listenersDict.chargingchange?.();
  });

  await waitFor(() => {
    expect(result.current.charging).toBe(false);
  });

  act(() => {
    batteryMock.chargingTime = 500;
    listenersDict.chargingtimechange?.();
  });

  await waitFor(() => {
    expect(result.current.chargingTime).toBe(500);
  });

  act(() => {
    batteryMock.dischargingTime = 500;
    listenersDict.dischargingtimechange?.();
  });

  await waitFor(() => {
    expect(result.current.dischargingTime).toBe(500);
  });
  unmount();
});

it('should clean up event listeners on unmount', async () => {
  const batteryMock = mockBatteryManager();
  const { result, unmount } = renderHook(() => useBattery());

  await waitFor(() => {
    expect(result.current).toEqual({
      supported: true,
      loading: true,
      level: batteryMock.level,
      charging: batteryMock.charging,
      chargingTime: batteryMock.chargingTime,
      dischargingTime: batteryMock.dischargingTime
    });
  });

  unmount();

  batteryMock.addEventListener.mock.calls.forEach(([type, listener]) => {
    expect(batteryMock.removeEventListener).toHaveBeenCalledWith(type, listener);
  });
});

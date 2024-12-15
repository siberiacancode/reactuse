import { act, renderHook, waitFor } from '@testing-library/react';

import { useBattery } from './useBattery';

const events: Record<string, () => void> = {};
const batteryManager = {
  charging: true,
  chargingTime: 0,
  dischargingTime: 5,
  level: 1,
  addEventListener: (type: string, callback: () => void) => {
    events[type] = callback;
  },
  removeEventListener: (type: string, callback: () => void) => {
    if (events[type] === callback) {
      delete events[type];
    }
  },
  dispatchEvent: (event: Event) => {
    events[event.type]?.();
    return true;
  }
};

beforeEach(() => {
  const mockNavigatorGetBattery = vi.fn(() => Promise.resolve(batteryManager));
  Object.assign(navigator, {
    getBattery: mockNavigatorGetBattery
  });
});

it('Should use battery', async () => {
  const { result } = renderHook(useBattery);

  expect(result.current).toEqual({
    supported: false,
    loading: true,
    level: 0,
    charging: false,
    chargingTime: 0,
    dischargingTime: 0
  });

  expect(navigator.getBattery).toBeCalledTimes(1);

  await waitFor(() =>
    expect(result.current).toEqual({
      charging: true,
      chargingTime: 0,
      dischargingTime: 5,
      level: 1,
      loading: false,
      supported: true
    })
  );
});

it('Should handle levelchange event', async () => {
  const { result } = renderHook(useBattery);

  act(() => {
    batteryManager.level = 2;
    batteryManager.dispatchEvent(new Event('levelchange'));
  });

  await waitFor(() =>
    expect(result.current).toEqual({
      charging: true,
      chargingTime: 0,
      dischargingTime: 5,
      level: 2,
      loading: false,
      supported: true
    })
  );
});

it('Should handle chargingchange event', async () => {
  const { result } = renderHook(useBattery);

  act(() => {
    batteryManager.charging = false;
    batteryManager.dispatchEvent(new Event('chargingchange'));
  });

  await waitFor(() =>
    expect(result.current).toEqual({
      charging: false,
      chargingTime: 0,
      dischargingTime: 5,
      level: 2,
      loading: false,
      supported: true
    })
  );
});

it('Should handle chargingtimechange event', async () => {
  const { result } = renderHook(useBattery);

  act(() => {
    batteryManager.chargingTime = 1;
    batteryManager.dispatchEvent(new Event('chargingtimechange'));
  });

  await waitFor(() =>
    expect(result.current).toEqual({
      charging: false,
      chargingTime: 1,
      dischargingTime: 5,
      level: 2,
      loading: false,
      supported: true
    })
  );
});

it('Should handle dischargingtimechange event', async () => {
  const { result } = renderHook(useBattery);

  act(() => {
    batteryManager.dischargingTime = 6;
    batteryManager.dispatchEvent(new Event('dischargingtimechange'));
  });

  await waitFor(() =>
    expect(result.current).toEqual({
      charging: false,
      chargingTime: 1,
      dischargingTime: 6,
      level: 2,
      loading: false,
      supported: true
    })
  );
});

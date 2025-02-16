import { act, renderHook, waitFor } from '@testing-library/react';

import { useBattery } from './useBattery';

const events: Record<string, () => void> = {};
const mockBatteryManager = {
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
  const mockNavigatorGetBattery = vi.fn(() => Promise.resolve(mockBatteryManager));
  Object.assign(navigator, {
    getBattery: mockNavigatorGetBattery
  });
});

it('Should use battery', async () => {
  const { result } = renderHook(useBattery);

  expect(result.current).toEqual({
    supported: true,
    value: {
      loading: true,
      level: 0,
      charging: false,
      chargingTime: 0,
      dischargingTime: 0
    }
  });

  expect(navigator.getBattery).toBeCalledTimes(1);

  await waitFor(() =>
    expect(result.current).toEqual({
      supported: true,
      value: {
        charging: true,
        chargingTime: 0,
        dischargingTime: 5,
        level: 1,
        loading: false
      }
    })
  );
});

it('Should correct return for unsupported', async () => {
  Object.assign(navigator, {
    getBattery: undefined
  });
  const { result } = renderHook(useBattery);

  await waitFor(() =>
    expect(result.current).toEqual({
      supported: false,
      value: {
        charging: false,
        chargingTime: 0,
        dischargingTime: 0,
        level: 0,
        loading: false
      }
    })
  );
});

it('Should handle levelchange event', async () => {
  const { result } = renderHook(useBattery);

  act(() => {
    mockBatteryManager.level = 2;
    mockBatteryManager.dispatchEvent(new Event('levelchange'));
  });

  await waitFor(() =>
    expect(result.current).toEqual({
      supported: true,
      value: {
        charging: true,
        chargingTime: 0,
        dischargingTime: 5,
        level: 2,
        loading: false
      }
    })
  );
});

it('Should handle chargingchange event', async () => {
  const { result } = renderHook(useBattery);

  act(() => {
    mockBatteryManager.charging = false;
    mockBatteryManager.dispatchEvent(new Event('chargingchange'));
  });

  await waitFor(() =>
    expect(result.current).toEqual({
      supported: true,
      value: {
        charging: false,
        chargingTime: 0,
        dischargingTime: 5,
        level: 2,
        loading: false
      }
    })
  );
});

it('Should handle chargingtimechange event', async () => {
  const { result } = renderHook(useBattery);

  act(() => {
    mockBatteryManager.chargingTime = 1;
    mockBatteryManager.dispatchEvent(new Event('chargingtimechange'));
  });

  await waitFor(() =>
    expect(result.current).toEqual({
      supported: true,
      value: {
        charging: false,
        chargingTime: 1,
        dischargingTime: 5,
        level: 2,
        loading: false
      }
    })
  );
});

it('Should handle dischargingtimechange event', async () => {
  const { result } = renderHook(useBattery);

  act(() => {
    mockBatteryManager.dischargingTime = 6;
    mockBatteryManager.dispatchEvent(new Event('dischargingtimechange'));
  });

  await waitFor(() =>
    expect(result.current).toEqual({
      supported: true,
      value: {
        charging: false,
        chargingTime: 1,
        dischargingTime: 6,
        level: 2,
        loading: false
      }
    })
  );
});

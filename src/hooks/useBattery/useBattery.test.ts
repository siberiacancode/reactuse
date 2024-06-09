import { act, renderHook, waitFor } from '@testing-library/react';

import { useBattery } from './useBattery';

let battery: typeof batteryPreset;
let events: Record<string, () => void>;
const batteryPreset = {
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
  }
};

beforeEach(() => {
  events = {};
  battery = { ...batteryPreset };
  const mockNavigatorGetBattery = vi.fn(async () => Promise.resolve(battery));
  Object.assign(navigator, {
    getBattery: mockNavigatorGetBattery
  });
});

it('Should use battery', async () => {
  const { result } = renderHook(useBattery);

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
    battery.level = 2;
    battery.dispatchEvent(new Event('levelchange'));
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
    battery.charging = false;
    battery.dispatchEvent(new Event('chargingchange'));
  });

  await waitFor(() =>
    expect(result.current).toEqual({
      charging: false,
      chargingTime: 0,
      dischargingTime: 5,
      level: 1,
      loading: false,
      supported: true
    })
  );
});

it('Should handle chargingtimechange event', async () => {
  const { result } = renderHook(useBattery);

  act(() => {
    battery.chargingTime = 1;
    battery.dispatchEvent(new Event('chargingtimechange'));
  });

  await waitFor(() =>
    expect(result.current).toEqual({
      charging: true,
      chargingTime: 1,
      dischargingTime: 5,
      level: 1,
      loading: false,
      supported: true
    })
  );
});

it('Should handle dischargingtimechange event', async () => {
  const { result } = renderHook(useBattery);

  act(() => {
    battery.dischargingTime = 6;
    battery.dispatchEvent(new Event('dischargingtimechange'));
  });

  await waitFor(() =>
    expect(result.current).toEqual({
      charging: true,
      chargingTime: 0,
      dischargingTime: 6,
      level: 1,
      loading: false,
      supported: true
    })
  );
});

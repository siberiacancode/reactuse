import { act, renderHook, waitFor } from '@testing-library/react';

import { createTrigger, renderHookServer } from '@/tests';

import { useBattery } from './useBattery';

const trigger = createTrigger<string, () => void>();
const mockAddEventListener = vi.fn();
const mockRemoveEventListener = vi.fn();
const mockBatteryManager = {
  charging: true,
  chargingTime: 0,
  dischargingTime: 5,
  level: 1,
  addEventListener: (type: string, callback: () => void) => {
    mockAddEventListener(type, callback);
    trigger.add(type, callback);
  },
  removeEventListener: (type: string, callback: () => void) => {
    mockRemoveEventListener(type, callback);
    if (trigger.get(type) === callback) trigger.delete(type);
  },
  dispatchEvent: (event: Event) => {
    trigger.callback(event.type);
    return true;
  }
};

beforeEach(() => {
  const mockNavigatorGetBattery = vi.fn(() => Promise.resolve(mockBatteryManager));
  Object.assign(navigator, {
    getBattery: mockNavigatorGetBattery
  });
  trigger.clear();
});

it('Should use battery', async () => {
  const { result } = renderHook(useBattery);

  expect(result.current.supported).toBeTruthy();
  expect(result.current.value.loading).toBeTruthy();
  expect(result.current.value.level).toBe(0);
  expect(result.current.value.charging).toBeFalsy();
  expect(result.current.value.chargingTime).toBe(0);
  expect(result.current.value.dischargingTime).toBe(0);

  expect(navigator.getBattery).toHaveBeenCalledOnce();

  await waitFor(() => {
    expect(result.current.supported).toBeTruthy();
    expect(result.current.value.charging).toBeTruthy();
    expect(result.current.value.chargingTime).toBe(0);
    expect(result.current.value.dischargingTime).toBe(5);
    expect(result.current.value.level).toBe(1);
    expect(result.current.value.loading).toBeFalsy();
  });
});

it('Should use battery on server side', async () => {
  const { result } = renderHookServer(useBattery);

  expect(result.current.supported).toBeFalsy();
  expect(result.current.value.loading).toBeFalsy();
  expect(result.current.value.level).toBe(0);
  expect(result.current.value.charging).toBeFalsy();
  expect(result.current.value.chargingTime).toBe(0);
  expect(result.current.value.dischargingTime).toBe(0);
});

it('Should use battery for unsupported', async () => {
  Object.assign(navigator, {
    getBattery: undefined
  });
  const { result } = renderHook(useBattery);

  expect(result.current.supported).toBeFalsy();
  expect(result.current.value.loading).toBeFalsy();
  expect(result.current.value.level).toBe(0);
  expect(result.current.value.charging).toBeFalsy();
  expect(result.current.value.chargingTime).toBe(0);
  expect(result.current.value.dischargingTime).toBe(0);
});

it('Should handle levelchange event', async () => {
  const { result } = renderHook(useBattery);

  act(() => {
    mockBatteryManager.level = 2;
    mockBatteryManager.dispatchEvent(new Event('levelchange'));
  });

  await waitFor(() => {
    expect(result.current.supported).toBeTruthy();
    expect(result.current.value.charging).toBeTruthy();
    expect(result.current.value.chargingTime).toBe(0);
    expect(result.current.value.dischargingTime).toBe(5);
    expect(result.current.value.level).toBe(2);
    expect(result.current.value.loading).toBeFalsy();
  });
});

it('Should handle chargingchange event', async () => {
  const { result } = renderHook(useBattery);

  act(() => {
    mockBatteryManager.charging = false;
    mockBatteryManager.dispatchEvent(new Event('chargingchange'));
  });

  await waitFor(() => {
    expect(result.current.supported).toBeTruthy();
    expect(result.current.value.charging).toBeFalsy();
    expect(result.current.value.chargingTime).toBe(0);
    expect(result.current.value.dischargingTime).toBe(5);
    expect(result.current.value.level).toBe(2);
    expect(result.current.value.loading).toBeFalsy();
  });
});

it('Should handle chargingtimechange event', async () => {
  const { result } = renderHook(useBattery);

  act(() => {
    mockBatteryManager.chargingTime = 1;
    mockBatteryManager.dispatchEvent(new Event('chargingtimechange'));
  });

  await waitFor(() => {
    expect(result.current.supported).toBeTruthy();
    expect(result.current.value.charging).toBeFalsy();
    expect(result.current.value.chargingTime).toBe(1);
    expect(result.current.value.dischargingTime).toBe(5);
    expect(result.current.value.level).toBe(2);
    expect(result.current.value.loading).toBeFalsy();
  });
});

it('Should handle dischargingtimechange event', async () => {
  const { result } = renderHook(useBattery);

  act(() => {
    mockBatteryManager.dischargingTime = 6;
    mockBatteryManager.dispatchEvent(new Event('dischargingtimechange'));
  });

  await waitFor(() => {
    expect(result.current.supported).toBeTruthy();
    expect(result.current.value.charging).toBeFalsy();
    expect(result.current.value.chargingTime).toBe(1);
    expect(result.current.value.dischargingTime).toBe(6);
    expect(result.current.value.level).toBe(2);
    expect(result.current.value.loading).toBeFalsy();
  });
});

it('Should cleanup on unmount', async () => {
  const { unmount, result } = renderHook(useBattery);

  await waitFor(() => expect(result.current.value.loading).toBeFalsy());

  unmount();

  expect(mockRemoveEventListener).toHaveBeenCalledWith('chargingchange', expect.any(Function));
  expect(mockRemoveEventListener).toHaveBeenCalledWith('levelchange', expect.any(Function));
  expect(mockRemoveEventListener).toHaveBeenCalledWith('chargingtimechange', expect.any(Function));
  expect(mockRemoveEventListener).toHaveBeenCalledWith(
    'dischargingtimechange',
    expect.any(Function)
  );
});

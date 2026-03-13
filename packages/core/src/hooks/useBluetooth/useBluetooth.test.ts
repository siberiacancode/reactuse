import { act, renderHook } from '@testing-library/react';

import { createTrigger, renderHookServer } from '@/tests';

import { useBluetooth } from './useBluetooth';

const trigger = createTrigger<string, () => void>();
const mockRemoveEventListener = vi.fn();

const mockBluetoothDevice = {
  id: 'test-device',
  name: 'test-device',
  gatt: {
    connected: true,
    connect: vi.fn(() => Promise.resolve(mockBluetoothDevice.gatt)),
    disconnect: vi.fn()
  },
  addEventListener: (type: string, callback: () => void) => trigger.add(type, callback),
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
  Object.defineProperty(navigator, 'bluetooth', {
    value: {
      requestDevice: vi.fn(() => Promise.resolve(mockBluetoothDevice))
    },
    writable: true,
    configurable: true
  });

  vi.clearAllMocks();
  trigger.clear();
});

it('Should use bluetooth', () => {
  const { result } = renderHook(useBluetooth);

  expect(result.current).toEqual({
    supported: true,
    connected: false,
    device: undefined,
    server: undefined,
    requestDevice: expect.any(Function)
  });
});

it('Should use bluetooth on server side', () => {
  const { result } = renderHookServer(useBluetooth);

  expect(result.current).toEqual({
    supported: false,
    connected: false,
    device: undefined,
    server: undefined,
    requestDevice: expect.any(Function)
  });
});

it('Should use bluetooth for unsupported', () => {
  Object.defineProperty(navigator, 'bluetooth', {
    value: undefined,
    writable: true,
    configurable: true
  });

  const { result } = renderHook(useBluetooth);

  expect(result.current).toEqual({
    supported: false,
    connected: false,
    device: undefined,
    server: undefined,
    requestDevice: expect.any(Function)
  });
});

it('Should request device successfully', async () => {
  const { result } = renderHook(useBluetooth);

  await act(result.current.requestDevice);

  expect(navigator.bluetooth.requestDevice).toHaveBeenCalledWith({
    acceptAllDevices: false,
    optionalServices: undefined
  });

  expect(result.current.device).toBe(mockBluetoothDevice);
});

it('Should connect to GATT server after device selection', async () => {
  const { result } = renderHook(useBluetooth);

  await act(result.current.requestDevice);

  expect(mockBluetoothDevice.gatt.connect).toHaveBeenCalled();

  expect(result.current.connected).toBeTruthy();
  expect(result.current.server).toBe(mockBluetoothDevice.gatt);
});

it('Should handle device options correctly', async () => {
  const options = {
    acceptAllDevices: true,
    optionalServices: ['battery_service']
  };

  const { result } = renderHook(() => useBluetooth(options));

  await act(result.current.requestDevice);

  expect(navigator.bluetooth.requestDevice).toHaveBeenCalledWith({
    acceptAllDevices: true,
    optionalServices: ['battery_service']
  });
});

it('Should handle filters option correctly', async () => {
  const options = {
    filters: [{ name: 'test-device' }]
  };

  const { result } = renderHook(() => useBluetooth(options));

  await act(result.current.requestDevice);

  expect(navigator.bluetooth.requestDevice).toHaveBeenCalledWith({
    acceptAllDevices: false,
    filters: [{ name: 'test-device' }]
  });
});

it('Should handle gattserverdisconnected event', async () => {
  const { result } = renderHook(useBluetooth);

  await act(result.current.requestDevice);

  expect(result.current.connected).toBeTruthy();

  act(() => mockBluetoothDevice.dispatchEvent(new Event('gattserverdisconnected')));

  expect(result.current.connected).toBeFalsy();
  expect(result.current.device).toBeUndefined();
  expect(result.current.server).toBeUndefined();
});

it('Should cleanup on unmount', async () => {
  const { result, unmount } = renderHook(useBluetooth);

  await act(result.current.requestDevice);

  expect(result.current.connected).toBeTruthy();

  unmount();

  expect(mockRemoveEventListener).toHaveBeenCalledWith(
    'gattserverdisconnected',
    expect.any(Function)
  );
  expect(mockBluetoothDevice.gatt.disconnect).toHaveBeenCalled();
});

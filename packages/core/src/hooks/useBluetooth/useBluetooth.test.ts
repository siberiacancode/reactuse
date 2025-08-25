import { act, renderHook, waitFor } from '@testing-library/react';

import { createTrigger, renderHookServer } from '@/tests';

import { useBluetooth } from './useBluetooth';

const trigger = createTrigger<string, () => void>();

// Mock BluetoothRemoteGATTServer
const mockGattServer = {
  connected: true,
  connect: vi.fn(() => Promise.resolve(mockGattServer)),
  disconnect: vi.fn()
};

// Mock BluetoothDevice
const mockBluetoothDevice = {
  id: 'test-device-id',
  name: 'Test Device',
  gatt: mockGattServer,
  addEventListener: (type: string, callback: () => void) => trigger.add(type, callback),
  removeEventListener: (type: string, callback: () => void) => {
    if (trigger.get(type) === callback) trigger.delete(type);
  },
  dispatchEvent: (event: Event) => {
    trigger.callback(event.type);
    return true;
  }
};

// Mock navigator.bluetooth
const mockNavigatorBluetooth = {
  requestDevice: vi.fn(() => Promise.resolve(mockBluetoothDevice))
};

beforeEach(() => {
  Object.defineProperty(navigator, 'bluetooth', {
    value: mockNavigatorBluetooth,
    writable: true,
    configurable: true
  });

  vi.clearAllMocks();
  trigger.clear();
  mockGattServer.connected = true;
});

it('Should initialize with correct default values', () => {
  const { result } = renderHook(() => useBluetooth());

  expect(result.current).toEqual({
    supported: true,
    connected: false,
    device: undefined,
    server: undefined,
    requestDevice: expect.any(Function)
  });
});

it('Should detect when Bluetooth is not supported', () => {
  Object.defineProperty(navigator, 'bluetooth', {
    value: undefined,
    writable: true,
    configurable: true
  });

  const { result } = renderHook(() => useBluetooth());

  expect(result.current.supported).toBe(false);
});

it('Should use bluetooth on server side', () => {
  const { result } = renderHookServer(() => useBluetooth());

  expect(result.current).toEqual({
    supported: false,
    connected: false,
    device: undefined,
    server: undefined,
    requestDevice: expect.any(Function)
  });
});

it('Should request device successfully', async () => {
  const { result } = renderHook(() => useBluetooth());

  await act(async () => {
    await result.current.requestDevice();
  });

  expect(mockNavigatorBluetooth.requestDevice).toHaveBeenCalledWith({
    acceptAllDevices: false,
    optionalServices: undefined
  });

  await waitFor(() => {
    expect(result.current.device).toBe(mockBluetoothDevice);
  });
});

it('Should not request device when not supported', async () => {
  Object.defineProperty(navigator, 'bluetooth', {
    value: undefined,
    writable: true,
    configurable: true
  });

  const { result } = renderHook(() => useBluetooth());

  await act(async () => {
    await result.current.requestDevice();
  });

  expect(mockNavigatorBluetooth.requestDevice).not.toHaveBeenCalled();
});

it('Should connect to GATT server after device selection', async () => {
  const { result } = renderHook(() => useBluetooth());

  await act(async () => {
    await result.current.requestDevice();
  });

  await waitFor(() => {
    expect(mockGattServer.connect).toHaveBeenCalled();
    expect(result.current.connected).toBe(true);
    expect(result.current.server).toBe(mockGattServer);
  });
});

it('Should handle device options correctly', async () => {
  const options = {
    acceptAllDevices: true,
    optionalServices: ['battery_service' as BluetoothServiceUUID]
  };

  const { result } = renderHook(() => useBluetooth(options));

  await act(async () => {
    await result.current.requestDevice();
  });

  expect(mockNavigatorBluetooth.requestDevice).toHaveBeenCalledWith({
    acceptAllDevices: true,
    optionalServices: ['battery_service']
  });
});

it('Should handle filters option correctly', async () => {
  const options = {
    filters: [{ name: 'Test Device' }],
    optionalServices: ['battery_service' as BluetoothServiceUUID]
  };

  const { result } = renderHook(() => useBluetooth(options));

  await act(async () => {
    await result.current.requestDevice();
  });

  expect(mockNavigatorBluetooth.requestDevice).toHaveBeenCalledWith({
    acceptAllDevices: false,
    optionalServices: ['battery_service'],
    filters: [{ name: 'Test Device' }]
  });
});

it('Should handle gattserverdisconnected event', async () => {
  const { result } = renderHook(() => useBluetooth());

  await act(async () => {
    await result.current.requestDevice();
  });

  await waitFor(() => {
    expect(result.current.connected).toBe(true);
  });

  act(() => {
    mockBluetoothDevice.dispatchEvent(new Event('gattserverdisconnected'));
  });

  await waitFor(() => {
    expect(result.current.connected).toBe(false);
    expect(result.current.device).toBeUndefined();
    expect(result.current.server).toBeUndefined();
  });
});

it('Should cleanup on unmount', async () => {
  const removeEventListenerSpy = vi.spyOn(mockBluetoothDevice, 'removeEventListener');
  const disconnectSpy = vi.spyOn(mockGattServer, 'disconnect');

  const { result, unmount } = renderHook(() => useBluetooth());

  await act(async () => {
    await result.current.requestDevice();
  });

  await waitFor(() => {
    expect(result.current.connected).toBe(true);
  });

  unmount();

  expect(removeEventListenerSpy).toHaveBeenCalledWith(
    'gattserverdisconnected',
    expect.any(Function)
  );
  expect(disconnectSpy).toHaveBeenCalled();
});

it('Should handle device without GATT interface', async () => {
  const deviceWithoutGatt = {
    ...mockBluetoothDevice,
    gatt: undefined
  } as any;

  mockNavigatorBluetooth.requestDevice.mockResolvedValueOnce(deviceWithoutGatt);

  const { result } = renderHook(() => useBluetooth());

  await act(async () => {
    await result.current.requestDevice();
  });

  await waitFor(() => {
    expect(result.current.device).toBe(deviceWithoutGatt);
    expect(result.current.connected).toBe(false);
    expect(result.current.server).toBeUndefined();
  });
});

it('Should handle device request error', async () => {
  const requestError = new Error('Device request failed');
  mockNavigatorBluetooth.requestDevice.mockRejectedValueOnce(requestError);

  const { result } = renderHook(() => useBluetooth());

  await expect(async () => {
    await act(async () => {
      await result.current.requestDevice();
    });
  }).rejects.toThrow('Device request failed');

  // Device should not be set when request fails
  expect(result.current.device).toBeUndefined();
  expect(result.current.connected).toBe(false);
  expect(result.current.server).toBeUndefined();
});

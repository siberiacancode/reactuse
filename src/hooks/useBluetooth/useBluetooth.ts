import { useCallback, useEffect, useState } from 'react';

export interface UseBluetoothReturn {
  isSupported: boolean;
  isConnected: boolean;
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  device: BluetoothDevice | undefined;
  requestDevice: () => Promise<void>;
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  server: BluetoothRemoteGATTServer | undefined;
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  error: unknown | null;
}

export interface UseBluetoothRequestDeviceOptions {
  filters?: BluetoothLEScanFilter[] | undefined;
  optionalServices?: BluetoothServiceUUID[] | undefined;
}

export interface UseBluetoothOptions extends UseBluetoothRequestDeviceOptions {
  acceptAllDevices?: boolean;
  filters?: BluetoothLEScanFilter[] | undefined;
  optionalServices?: BluetoothServiceUUID[] | undefined;
}

/**
 * @name useBluetooth
 * @description - Hook for getting information about bluetooth
 * @category Browser
 *
 * @returns {UseBluetoothReturn} Object containing battery information & Battery API support
 *
 * @example
 * const { isSupported, requestDevice } = useBluetooth({ acceptAllDevices: true });
 */

export const useBluetooth = (options?: UseBluetoothOptions): UseBluetoothReturn => {
  const {
    acceptAllDevices = false,
    filters = undefined,
    optionalServices = undefined
  } = options || {};

  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  const [device, setDevice] = useState<BluetoothDevice | undefined>(undefined);
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  const [server, setServer] = useState<BluetoothRemoteGATTServer | undefined>(undefined);
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  const [error, setError] = useState<unknown | null>(null);

  useEffect(() => {
    setIsSupported(navigator && 'bluetooth' in navigator);
  }, [navigator]);

  const requestDevice = useCallback(async () => {
    if (!isSupported || !navigator?.bluetooth) {
      return;
    }

    setError(null);

    try {
      const selectedDevice = await navigator.bluetooth.requestDevice({
        acceptAllDevices,
        filters,
        optionalServices
      });

      setDevice(selectedDevice);
    } catch (err) {
      setError(err);
    }
  }, [acceptAllDevices, filters, optionalServices, isSupported, navigator]);

  // Connect to the GATT server
  useEffect(() => {
    const connectToBluetoothGATTServer = async () => {
      if (device?.gatt) {
        setError(null);

        try {
          const gattServer = await device.gatt.connect();
          setServer(gattServer);
          setIsConnected(gattServer.connected);
        } catch (err) {
          setError(err);
        }
      }
    };

    if (device) {
      device.addEventListener('gattserverdisconnected', () => setIsConnected(false));
      connectToBluetoothGATTServer();

      return () => {
        device.removeEventListener('gattserverdisconnected', () => setIsConnected(false));
        server?.disconnect();
      };
    }
  }, [device]);

  return {
    isSupported,
    isConnected,
    device,
    requestDevice,
    server,
    error
  };
};

import { useCallback, useEffect, useState } from 'react';

/** State for hook UseBluetooth */
export interface UseBluetoothReturn {
  /** Indicates if Bluetooth API is supported by the browser */
  isSupported: boolean;
  /** Indicates if Bluetooth device is currently connected */
  isConnected: boolean;
  /** Describe connected Bluetooth device */
  device: BluetoothDevice | undefined;
  /** Function to request Bluetooth device from the user */
  requestDevice: () => Promise<void>;
  /** The GATT server for connected Bluetooth device */
  server: BluetoothRemoteGATTServer | undefined;
  /** Any error that may have occurred */
  error: string | null;
}

/** Params for useBluetooth hook */
export interface UseBluetoothOptions {
  /** If true, hook will request all available Bluetooth devices */
  acceptAllDevices?: boolean;
  /** Array of filters to apply when scanning Bluetooth devices */
  filters?: BluetoothLEScanFilter[] | undefined;
  /** Array of optional services that the application can use */
  optionalServices?: BluetoothServiceUUID[] | undefined;
}

/**
 * @name useBluetooth
 * @description - Hook for getting information about bluetooth
 * @category Browser
 *
 * @param {boolean} [options.acceptAllDevices=false] The options to request all Bluetooth devices
 * @param {Array<keyof BluetoothLEScanFilter>} [options.filters=undefined] Array of filters to apply when scanning Bluetooth devices
 * @param {Array<keyof BluetoothServiceUUID>} [options.optionalServices=undefined] Array of optional services that the application can use
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

  const [isSupported, setIsSupported] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [device, setDevice] = useState<BluetoothDevice | undefined>(undefined);
  const [server, setServer] = useState<BluetoothRemoteGATTServer | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

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
      if (err instanceof Error) setError(err.message);
      else setError('Unknown error');
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
          if (err instanceof Error) setError(err.message);
          else setError('Unknown error');
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

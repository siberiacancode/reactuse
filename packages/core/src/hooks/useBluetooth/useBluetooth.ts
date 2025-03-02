import { useEffect, useState } from 'react';

/** The use bluetooth return type */
export interface UseBluetoothReturn {
  /** Indicates if bluetooth device is currently connected */
  connected: boolean;
  /** Describe connected bluetooth device */
  device?: BluetoothDevice;
  /** The GATT server for connected bluetooth device */
  server?: BluetoothRemoteGATTServer;
  /** Whether the bluetooth is supported*/
  supported: boolean;
  /** Function to request bluetooth device from the user */
  requestDevice: () => Promise<void>;
}

/** The use bluetooth options type */
export interface UseBluetoothOptions {
  /** The options to request all bluetooth devices */
  acceptAllDevices?: boolean;
  /** Array of filters to apply when scanning bluetooth devices */
  filters?: BluetoothLEScanFilter[];
  /** Array of optional services that the application can use */
  optionalServices?: BluetoothServiceUUID[];
}

/**
 * @name useBluetooth
 * @description - Hook for getting information about bluetooth
 * @category Browser
 *
 * @browserapi navigator.bluetooth https://developer.mozilla.org/en-US/docs/Web/API/Navigator/bluetooth
 *
 * @param {boolean} [options.acceptAllDevices=false] The options to request all Bluetooth devices
 * @param {Array<BluetoothLEScanFilter>} [options.filters] Array of filters to apply when scanning Bluetooth devices
 * @param {Array<BluetoothServiceUUID>} [options.optionalServices] Array of optional services that the application can use
 * @returns {UseBluetoothReturn} Object containing battery information & Battery API support
 *
 * @example
 * const { supported, connected, device, requestDevice, server } = useBluetooth(options);
 */
export const useBluetooth = (options?: UseBluetoothOptions): UseBluetoothReturn => {
  const supported = typeof navigator !== 'undefined' && 'bluetooth' in navigator;
  const { acceptAllDevices = false, filters, optionalServices } = options ?? {};

  const [connected, setIsConnected] = useState(false);
  const [device, setDevice] = useState<BluetoothDevice | undefined>(undefined);
  const [server, setServer] = useState<BluetoothRemoteGATTServer | undefined>(undefined);

  const requestDevice = async () => {
    if (!supported) return;

    const selectedDevice = await navigator.bluetooth.requestDevice({
      acceptAllDevices,
      optionalServices,
      ...(filters && { filters, acceptAllDevices: false })
    });

    setDevice(selectedDevice);
  };

  useEffect(() => {
    if (device && device.gatt) {
      const connectToBluetoothGATTServer = async () => {
        if (!device.gatt) return;
        const gattServer = await device.gatt.connect();
        setServer(gattServer);
        setIsConnected(gattServer.connected);
      };

      const reset = () => {
        setServer(undefined);
        setDevice(undefined);
        setIsConnected(false);
      };

      device.addEventListener('gattserverdisconnected', reset);
      connectToBluetoothGATTServer();

      return () => {
        device.removeEventListener('gattserverdisconnected', reset);
        device.gatt?.disconnect();
      };
    }
  }, [device]);

  return {
    supported,
    connected,
    device,
    requestDevice,
    server
  };
};

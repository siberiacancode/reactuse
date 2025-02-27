import { useEffect, useState } from 'react';
/**
 * @name useBluetooth
 * @description - Hook for getting information about bluetooth
 * @category Browser
 *
 * @param {boolean} [options.acceptAllDevices=false] The options to request all Bluetooth devices
 * @param {Array<BluetoothLEScanFilter>} [options.filters] Array of filters to apply when scanning Bluetooth devices
 * @param {Array<BluetoothServiceUUID>} [options.optionalServices] Array of optional services that the application can use
 * @returns {UseBluetoothReturn} Object containing battery information & Battery API support
 *
 * @example
 * const { supported, connected, device, requestDevice, server } = useBluetooth(options);
 */
export const useBluetooth = (options) => {
  const supported = typeof navigator !== 'undefined' && 'bluetooth' in navigator;
  const { acceptAllDevices = false, filters, optionalServices } = options ?? {};
  const [connected, setIsConnected] = useState(false);
  const [device, setDevice] = useState(undefined);
  const [server, setServer] = useState(undefined);
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

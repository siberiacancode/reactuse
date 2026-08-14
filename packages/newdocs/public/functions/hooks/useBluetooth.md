---
title: useBluetooth
description: Hook for getting information about bluetooth
category: browser
usage: low
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1756134040000
---

# useBluetooth

Hook for getting information about bluetooth

## Demo

```tsx
import { useBluetooth } from '@siberiacancode/reactuse';
import {
  Bluetooth,
  BluetoothConnected,
  BluetoothSearching,
  HeadphonesIcon,
  KeyboardIcon,
  MouseIcon,
  SmartphoneIcon,
  SpeakerIcon,
  WatchIcon
} from 'lucide-react';
import { useState } from 'react';

import { cn } from '@/utils/lib';

const getDeviceIcon = (name: string) => {
  const deviceName = name.toLowerCase();
  if (
    deviceName.includes('airpod') ||
    deviceName.includes('headphone') ||
    deviceName.includes('earbud') ||
    deviceName.includes('buds')
  )
    return HeadphonesIcon;
  if (deviceName.includes('keyboard')) return KeyboardIcon;
  if (deviceName.includes('mouse')) return MouseIcon;
  if (deviceName.includes('speaker') || deviceName.includes('soundbar')) return SpeakerIcon;
  if (deviceName.includes('watch')) return WatchIcon;
  if (
    deviceName.includes('phone') ||
    deviceName.includes('iphone') ||
    deviceName.includes('android')
  )
    return SmartphoneIcon;
  return Bluetooth;
};

const getCenterIcon = (scanning: boolean, connected: boolean) => {
  if (scanning) return BluetoothSearching;
  if (connected) return BluetoothConnected;
  return Bluetooth;
};

const getStatusLabel = (connected: boolean, hasDevice: boolean, scanning: boolean) => {
  if (connected) return 'Connected';
  if (hasDevice) return 'Not connected';
  if (scanning) return 'Searching...';
  return 'No device';
};

const Demo = () => {
  const [error, setError] = useState<string>();
  const [scanning, setScanning] = useState(false);
  const [device, setDevice] = useState<BluetoothDevice>();
  const [connected, setConnected] = useState(false);

  const bluetooth = useBluetooth({ acceptAllDevices: true });

  const onScan = async () => {
    try {
      setError(undefined);
      setScanning(true);

      const selectedDevice = await navigator.bluetooth.requestDevice({ acceptAllDevices: true });

      setConnected(false);
      setDevice(selectedDevice);

      selectedDevice.addEventListener(
        'gattserverdisconnected',
        () => {
          setConnected(false);
          setDevice(undefined);
        },
        { once: true }
      );

      if (selectedDevice.gatt) {
        try {
          const server = await selectedDevice.gatt.connect();
          setConnected(server.connected);
        } catch {
          // connection is optional
        }
      }
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setScanning(false);
    }
  };

  if (!bluetooth.supported)
    return (
      <p>
        API not supported, make sure to check for compatibility with different browsers when using
        this{' '}
        <a
          href='https://developer.mozilla.org/en-US/docs/Web/API/Navigator/bluetooth'
          rel='noreferrer'
          target='_blank'
        >
          API
        </a>
      </p>
    );

  const hasDevice = !!device;
  const DeviceIcon = getDeviceIcon(device?.name ?? '');
  const CenterIcon = getCenterIcon(scanning, connected);
  const statusLabel = getStatusLabel(connected, hasDevice, scanning);

  return (
    <section className='flex min-w-sm justify-center p-6'>
      <div className='flex w-72 flex-col items-center gap-5 rounded-2xl border p-6'>
        <div className='relative flex items-center justify-center'>
          {connected && (
            <span className='absolute size-14 animate-ping rounded-full bg-blue-500/20' />
          )}
          <div
            className={cn(
              'bg-muted flex size-16 items-center justify-center rounded-full',
              connected && 'bg-blue-500/10 text-blue-500',
              !connected && hasDevice && 'text-foreground',
              !connected && !hasDevice && 'text-muted-foreground'
            )}
          >
            {hasDevice && <DeviceIcon className='size-7' />}
            {!hasDevice && <CenterIcon className='size-7' />}
          </div>
        </div>

        <div className='flex flex-col items-center gap-1 text-center'>
          <p className='font-semibold'>{statusLabel}</p>
          {!hasDevice && (
            <p className='text-muted-foreground text-xs'>Tap scan to find nearby devices</p>
          )}
        </div>

        {hasDevice && (
          <div className='w-full rounded-xl border p-3'>
            <div className='flex items-center gap-3'>
              <div className='bg-muted flex size-9 shrink-0 items-center justify-center rounded-lg'>
                <DeviceIcon className='size-4' />
              </div>
              <div className='min-w-0 flex-1'>
                <p className='truncate text-sm font-medium'>{device?.name ?? 'Unknown device'}</p>
                <p className='text-muted-foreground text-[10px]'>{device?.id.slice(0, 12)}...</p>
              </div>
              <span
                className={cn(
                  'shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium',
                  connected ? 'bg-blue-500/10 text-blue-500' : 'bg-muted text-muted-foreground'
                )}
              >
                {connected && 'Connected'}
                {!connected && 'Disconnected'}
              </span>
            </div>
          </div>
        )}

        {error && <p className='text-muted-foreground text-center text-xs'>{error}</p>}

        <button
          className='w-full rounded-xl py-2 text-sm font-medium'
          disabled={scanning}
          type='button'
          onClick={onScan}
        >
          {hasDevice && 'Scan again'}
          {!hasDevice && 'Scan for devices'}
        </button>
      </div>
    </section>
  );
};

export default Demo;
```

## Installation

### Library

```bash
npm install @siberiacancode/reactuse
```

### CLI

```bash
npx useverse@latest add useBluetooth
```

### Manual

Copy and paste the following code into your project.

```tsx
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
 * @usage low
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
  const supported =
    typeof navigator !== 'undefined' && 'bluetooth' in navigator && !!navigator.bluetooth;
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
    if (!device?.gatt) return;

    const connectToBluetoothGATTServer = async () => {
      const gattServer = await device.gatt!.connect();
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
  }, [device]);

  return {
    supported,
    connected,
    device,
    requestDevice,
    server
  };
};
```

Update the import paths to match your project setup.

## Usage

```tsx
const { supported, connected, device, requestDevice, server } = useBluetooth(options);
```

## Type Declarations

```tsx
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

export interface UseBluetoothOptions {
  /** The options to request all bluetooth devices */
  acceptAllDevices?: boolean;
  /** Array of filters to apply when scanning bluetooth devices */
  filters?: BluetoothLEScanFilter[];
  /** Array of optional services that the application can use */
  optionalServices?: BluetoothServiceUUID[];
}
```

## API

### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| options.acceptAllDevices | `boolean` | false | The options to request all Bluetooth devices |
| options.filters | `Array<BluetoothLEScanFilter>` | - | Array of filters to apply when scanning Bluetooth devices |
| options.optionalServices | `Array<BluetoothServiceUUID>` | - | Array of optional services that the application can use |

### Returns

`UseBluetoothReturn` - Object containing battery information & Battery API support
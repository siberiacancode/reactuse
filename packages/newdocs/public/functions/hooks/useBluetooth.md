---
title: useBluetooth
description: Hook for getting information about bluetooth
category: browser
usage: low
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1794210880000
---

# useBluetooth

Hook for getting information about bluetooth

## Demo

```tsx
import { useBluetooth } from '@siberiacancode/reactuse';
import { BluetoothConnectedIcon, BluetoothIcon } from 'lucide-react';
import { useState } from 'react';

import { cn } from '@/utils/lib';

const Demo = () => {
  const bluetooth = useBluetooth({ acceptAllDevices: true });
  const [connecting, setConnecting] = useState(false);

  const onConnect = async () => {
    setConnecting(true);

    try {
      await bluetooth.requestDevice();
    } catch {
    } finally {
      setConnecting(false);
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

  const Icon = bluetooth.connected ? BluetoothConnectedIcon : BluetoothIcon;

  return (
    <section className='flex min-w-sm flex-col items-center gap-4 p-6 text-center'>
      <div
        className={cn(
          'bg-muted text-muted-foreground flex size-16 items-center justify-center rounded-full',
          bluetooth.connected && 'bg-blue-500/10 text-blue-500'
        )}
      >
        <Icon className='size-7' />
      </div>

      <div aria-live='polite' className='flex flex-col gap-1'>
        <p className='font-semibold'>
          {bluetooth.connected ? 'Bluetooth connected' : 'Connect Bluetooth'}
        </p>
        <p className='text-muted-foreground text-sm'>
          {bluetooth.connected
            ? (bluetooth.device?.name ?? 'Your device is ready to use')
            : 'Pair with a nearby device'}
        </p>
      </div>

      {!bluetooth.connected && (
        <button disabled={connecting} type='button' onClick={onConnect}>
          {connecting ? 'Connecting...' : 'Connect'}
        </button>
      )}
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
 *
 * @see {@link https://reactuse.org/functions/hooks/useBluetooth}
 */
export const useBluetooth = (options?: UseBluetoothOptions): UseBluetoothReturn => {
  const supported =
    typeof navigator !== 'undefined' && 'bluetooth' in navigator && !!navigator.bluetooth;
  const { acceptAllDevices = false, filters, optionalServices } = options ?? {};

  const [connected, setConnected] = useState(false);
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
      setConnected(gattServer.connected);
    };

    const reset = () => {
      setServer(undefined);
      setDevice(undefined);
      setConnected(false);
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
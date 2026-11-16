---
title: useNetwork
description: Hook to track network status
category: browser
usage: low
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1780745248000
---

# useNetwork

Hook to track network status

## Demo

```tsx
import { useNetwork } from '@siberiacancode/reactuse';
import { ActivityIcon, ArrowDownIcon, GaugeIcon, WifiIcon, WifiOffIcon } from 'lucide-react';

import { cn } from '@/utils/lib';

const Demo = () => {
  const network = useNetwork();

  return (
    <section className='flex w-full max-w-sm flex-col gap-4 p-4'>
      <div className='flex items-center gap-3'>
        <div
          className={cn(
            'flex size-11 shrink-0 items-center justify-center rounded-full',
            network.online ? 'bg-green-500/15 text-green-500' : 'bg-destructive/15 text-destructive'
          )}
        >
          {network.online && <WifiIcon className='size-5' />}
          {!network.online && <WifiOffIcon className='size-5' />}
        </div>

        <div className='flex flex-col leading-tight'>
          <span className='text-foreground text-base font-semibold'>
            {network.online && 'Connected'}
            {!network.online && 'No connection'}
          </span>
          <span className='text-muted-foreground text-sm'>
            {network.online && network.type && `Connected via ${network.type}`}
            {network.online && !network.type && "You're online"}
            {!network.online && 'Check your network and try again'}
          </span>
        </div>
      </div>

      {network.online && (
        <div className='grid grid-cols-3 gap-2'>
          <div className='bg-muted/50 flex flex-col gap-1 rounded-lg p-3'>
            <div className='text-muted-foreground flex items-center gap-1 text-[10px] tracking-wider uppercase'>
              <GaugeIcon className='size-3' />
              Quality
            </div>
            <span className='text-foreground text-sm font-semibold uppercase'>
              {network.effectiveType ?? '—'}
            </span>
          </div>

          <div className='bg-muted/50 flex flex-col gap-1 rounded-lg p-3'>
            <div className='text-muted-foreground flex items-center gap-1 text-[10px] tracking-wider uppercase'>
              <ArrowDownIcon className='size-3' />
              Speed
            </div>
            <span className='text-foreground text-sm font-semibold'>
              {typeof network.downlink === 'number' && `${network.downlink}`}
              {typeof network.downlink !== 'number' && '—'}
              {typeof network.downlink === 'number' && (
                <span className='text-muted-foreground text-xs font-normal'> Mb/s</span>
              )}
            </span>
          </div>

          <div className='bg-muted/50 flex flex-col gap-1 rounded-lg p-3'>
            <div className='text-muted-foreground flex items-center gap-1 text-[10px] tracking-wider uppercase'>
              <ActivityIcon className='size-3' />
              Ping
            </div>
            <span className='text-foreground text-sm font-semibold'>
              {typeof network.rtt === 'number' && `${network.rtt}`}
              {typeof network.rtt !== 'number' && '—'}
              {typeof network.rtt === 'number' && (
                <span className='text-muted-foreground text-xs font-normal'> ms</span>
              )}
            </span>
          </div>
        </div>
      )}

      <span className='text-muted-foreground text-xs'>
        Try toggling your wifi or airplane mode to see the status update live.
      </span>
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
npx useverse@latest add useNetwork
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useEffect, useRef, useState } from 'react';

export interface Connection extends EventTarget {
  readonly downlink: number;
  readonly downlinkMax: number;
  readonly effectiveType: '2g' | '3g' | '4g' | 'slow-2g';
  readonly rtt: number;
  readonly saveData: boolean;
  readonly type:
    | 'bluetooth'
    | 'cellular'
    | 'ethernet'
    | 'mixed'
    | 'none'
    | 'other'
    | 'unknown'
    | 'wifi'
    | 'wimax';
  onChange: (event: Event) => void;
}

declare global {
  interface Navigator {
    readonly connection: Connection;
    readonly mozConnection: Connection;
    readonly webkitConnection: Connection;
  }
}

/** The type of network connection */
export type ConnectionType = Connection['type'];
/** The effective type of connection */
export type ConnectionEffectiveType = Connection['effectiveType'];

/** The use network return type */
export interface UseNetworkReturn {
  /** The estimated downlink speed in megabits per seconds */
  downlink?: Connection['downlink'];
  /** The maximum downlink speed, if available */
  downlinkMax?: Connection['downlinkMax'];
  /** The effective type of connection (e.g., '2g', '3g', '4g') */
  effectiveType?: Connection['effectiveType'];
  /** Indicates if the device is currently online */
  online: boolean;
  /** The estimated round-trip time in milliseconds */
  rtt?: Connection['rtt'];
  /** Indicates if the user has enabled data saving mode */
  saveData?: Connection['saveData'];
  /** The type of network connection (e.g., 'wifi', 'cellular') */
  type?: Connection['type'];
}

export const getConnection = () =>
  navigator?.connection || navigator?.mozConnection || navigator?.webkitConnection;

const getNetworkState = (): UseNetworkReturn => {
  if (typeof navigator === 'undefined') {
    return {
      online: false,
      type: undefined,
      effectiveType: undefined,
      saveData: false,
      downlink: 0,
      downlinkMax: 0,
      rtt: 0
    };
  }

  const online = navigator.onLine;
  const connection = getConnection();

  return {
    online,
    downlink: connection?.downlink,
    downlinkMax: connection?.downlinkMax,
    effectiveType: connection?.effectiveType,
    rtt: connection?.rtt,
    saveData: connection?.saveData,
    type: connection?.type
  };
};

/**
 * @name useNetwork
 * @description - Hook to track network status
 * @category Browser
 * @usage low
 *
 * @browserapi navigator.connection https://developer.mozilla.org/en-US/docs/Web/API/Navigator/connection
 *
 * @param {(value: UseNetworkReturn) => void} [callback] The callback invoked when the network state changes
 * @returns {UseNetworkReturn} An object containing the network status
 *
 * @example
 * const { online, downlink, downlinkMax, effectiveType, rtt, saveData, type } = useNetwork();
 */
export const useNetwork = (callback?: (value: UseNetworkReturn) => void): UseNetworkReturn => {
  const [value, setValue] = useState(getNetworkState);
  const internalCallbackRef = useRef(callback);
  internalCallbackRef.current = callback;

  useEffect(() => {
    const handleChange = () => {
      const nextValue = getNetworkState();

      setValue(nextValue);
      internalCallbackRef.current?.(nextValue);
    };

    window.addEventListener('online', handleChange, { passive: true });
    window.addEventListener('offline', handleChange, { passive: true });

    const connection = getConnection();

    if (connection) {
      connection.addEventListener('change', handleChange, { passive: true });
    }

    return () => {
      window.removeEventListener('online', handleChange);
      window.removeEventListener('offline', handleChange);

      if (connection) {
        connection.removeEventListener('change', handleChange);
      }
    };
  }, []);

  return value;
};
```

Update the import paths to match your project setup.

## Usage

```tsx
const { online, downlink, downlinkMax, effectiveType, rtt, saveData, type } = useNetwork();
```

## Type Declarations

```tsx
export interface Connection extends EventTarget {
  readonly downlink: number;
  readonly downlinkMax: number;
  readonly effectiveType: '2g' | '3g' | '4g' | 'slow-2g';
  readonly rtt: number;
  readonly saveData: boolean;
  readonly type:
    | 'bluetooth'
    | 'cellular'
    | 'ethernet'
    | 'mixed'
    | 'none'
    | 'other'
    | 'unknown'
    | 'wifi'
    | 'wimax';
  onChange: (event: Event) => void;
}

interface Navigator {
    readonly connection: Connection;
    readonly mozConnection: Connection;
    readonly webkitConnection: Connection;
  }

export type ConnectionType = Connection['type'];

export type ConnectionEffectiveType = Connection['effectiveType'];

export interface UseNetworkReturn {
  /** The estimated downlink speed in megabits per seconds */
  downlink?: Connection['downlink'];
  /** The maximum downlink speed, if available */
  downlinkMax?: Connection['downlinkMax'];
  /** The effective type of connection (e.g., '2g', '3g', '4g') */
  effectiveType?: Connection['effectiveType'];
  /** Indicates if the device is currently online */
  online: boolean;
  /** The estimated round-trip time in milliseconds */
  rtt?: Connection['rtt'];
  /** Indicates if the user has enabled data saving mode */
  saveData?: Connection['saveData'];
  /** The type of network connection (e.g., 'wifi', 'cellular') */
  type?: Connection['type'];
}
```

## API

### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| callback | `(value: UseNetworkReturn) => void` | - | The callback invoked when the network state changes |

### Returns

`UseNetworkReturn` - An object containing the network status
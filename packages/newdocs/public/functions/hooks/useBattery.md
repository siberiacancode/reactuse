---
title: useBattery
description: Hook for getting information about battery status
category: browser
usage: low
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1781981977000
---

# useBattery

Hook for getting information about battery status

## Demo

```tsx
import { useBattery } from '@siberiacancode/reactuse';
import {
  BatteryChargingIcon,
  BatteryFullIcon,
  BatteryLowIcon,
  BatteryMediumIcon,
  BatteryWarningIcon,
  Loader2Icon
} from 'lucide-react';

import { cn } from '@/utils/lib';

const getBatteryIcon = (level: number) => {
  if (level > 80) return BatteryFullIcon;
  if (level > 40) return BatteryMediumIcon;
  if (level > 15) return BatteryLowIcon;
  return BatteryWarningIcon;
};

const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds) || seconds <= 0) return '--';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
};

const Demo = () => {
  const battery = useBattery();

  if (!battery.supported)
    return (
      <p>
        API not supported, make sure to check for compatibility with different browsers when using
        this{' '}
        <a
          href='https://developer.mozilla.org/en-US/docs/Web/API/Navigator/getBattery'
          rel='noreferrer'
          target='_blank'
        >
          API
        </a>
      </p>
    );

  if (battery.value.loading) {
    return (
      <section className='flex justify-center'>
        <div className='relative flex h-[520px] w-76 items-center justify-center rounded-4xl border pt-12'>
          <div className='bg-border absolute top-3 left-1/2 h-5 w-18 -translate-x-1/2 rounded-full' />
          <Loader2Icon className='size-5 animate-spin' />
        </div>
      </section>
    );
  }

  const level = Math.round((battery.value.level ?? 0) * 100);
  const Icon = battery.value.charging ? BatteryChargingIcon : getBatteryIcon(level);
  const lowBattery = level <= 15 && !battery.value.charging;

  return (
    <section className='flex justify-center'>
      <div className='relative flex h-[430px] w-70 flex-col gap-7 rounded-4xl border px-6 pt-10 pb-8'>
        <div className='bg-border absolute top-3 left-1/2 h-5 w-18 -translate-x-1/2 rounded-full' />

        <div className='flex h-full flex-col gap-6 pt-6'>
          <div className='flex flex-col items-center gap-2'>
            <Icon className={cn('ml-2 size-30', lowBattery ? 'text-red-500' : 'text-foreground')} />

            <div className='flex flex-col items-center gap-1'>
              <div className='text-5xl font-semibold tracking-tight'>{level}%</div>
              <span className='text-muted-foreground text-xs tracking-wider uppercase'>
                {battery.value.charging ? 'Charging' : 'Battery'}
              </span>
            </div>
          </div>

          <div className='mt-auto flex flex-col gap-2 border-t pt-4'>
            <div className='flex items-center justify-between text-xs'>
              <span className='text-muted-foreground'>Status</span>
              <span className='font-medium'>
                {battery.value.charging ? 'Charging' : 'Discharging'}
              </span>
            </div>
            <div className='flex items-center justify-between text-xs'>
              <span className='text-muted-foreground'>Charge time</span>
              <span className='font-medium'>
                {formatTime(battery.value.chargingTime ?? Infinity)}
              </span>
            </div>
            <div className='flex items-center justify-between text-xs'>
              <span className='text-muted-foreground'>Time left</span>
              <span className='font-medium'>
                {formatTime(battery.value.dischargingTime ?? Infinity)}
              </span>
            </div>
          </div>
        </div>
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
npx useverse@latest add useBattery
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useEffect, useState } from 'react';

export interface BatteryManager extends EventTarget {
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
  level: number;
}

declare global {
  interface Navigator {
    readonly getBattery: () => Promise<BatteryManager>;
  }
}

/** The use battery value type */
export interface UseBatteryValue {
  /** Is charging battery? */
  charging: boolean;
  /** Time until the battery is fully charged */
  chargingTime: number;
  /** Time until the battery is completely discharged */
  dischargingTime: number;
  /** Battery charge level from 0 to 1 */
  level: number;
  /** Is battery information loading? */
  loading: boolean;
}

/** The use battery return type */
export interface UseBatteryReturn {
  /** Whether the battery api is supported*/
  supported: boolean;
  /** The use battery value type  */
  value: UseBatteryValue;
}

/**
 * @name useBattery
 * @description - Hook for getting information about battery status
 * @category Browser
 * @usage low
 *
 * @browserapi navigator.getBattery https://developer.mozilla.org/en-US/docs/Web/API/Navigator/getBattery
 *
 * @returns {UseBatteryStateReturn} Object containing battery information & Battery API support
 *
 * @example
 * const { supported, loading, charging, chargingTime, dischargingTime, level } = useBattery();
 */
export const useBattery = (): UseBatteryReturn => {
  const supported =
    typeof navigator !== 'undefined' && 'getBattery' in navigator && !!navigator.getBattery;

  const [value, setValue] = useState<UseBatteryValue>({
    loading: supported,
    level: 0,
    charging: false,
    chargingTime: 0,
    dischargingTime: 0
  });

  useEffect(() => {
    if (!supported) return;

    let battery: BatteryManager | null;

    const onChange = () =>
      setValue({
        loading: false,
        level: battery?.level ?? 0,
        charging: battery?.charging ?? false,
        dischargingTime: battery?.dischargingTime ?? 0,
        chargingTime: battery?.chargingTime ?? 0
      });

    navigator.getBattery().then((batteryManager) => {
      battery = batteryManager;
      onChange();

      battery.addEventListener('levelchange', onChange);
      battery.addEventListener('chargingchange', onChange);
      battery.addEventListener('chargingtimechange', onChange);
      battery.addEventListener('dischargingtimechange', onChange);
    });

    return () => {
      if (!battery) return;
      battery.removeEventListener('levelchange', onChange);
      battery.removeEventListener('chargingchange', onChange);
      battery.removeEventListener('chargingtimechange', onChange);
      battery.removeEventListener('dischargingtimechange', onChange);
    };
  }, []);

  return { supported, value };
};
```

Update the import paths to match your project setup.

## Usage

```tsx
const { supported, loading, charging, chargingTime, dischargingTime, level } = useBattery();
```

## Type Declarations

```tsx
export interface BatteryManager extends EventTarget {
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
  level: number;
}

interface Navigator {
    readonly getBattery: () => Promise<BatteryManager>;
  }

export interface UseBatteryValue {
  /** Is charging battery? */
  charging: boolean;
  /** Time until the battery is fully charged */
  chargingTime: number;
  /** Time until the battery is completely discharged */
  dischargingTime: number;
  /** Battery charge level from 0 to 1 */
  level: number;
  /** Is battery information loading? */
  loading: boolean;
}

export interface UseBatteryReturn {
  /** Whether the battery api is supported*/
  supported: boolean;
  /** The use battery value type  */
  value: UseBatteryValue;
}
```

## API

### Returns

`UseBatteryStateReturn` - Object containing battery information & Battery API support
---
title: useDeviceMotion
description: Hook that work with device motion
category: sensors
usage: low
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1779453143000
---

# useDeviceMotion

Hook that work with device motion

## Demo

```tsx
import { useDeviceMotion } from '@siberiacancode/reactuse';
import { SmartphoneIcon } from 'lucide-react';

const CIRCLE_SIZE = 240;
const BUBBLE_SIZE = 22;
const MAX_OFFSET = CIRCLE_SIZE / 2 - BUBBLE_SIZE / 2 - 12;
const GRAVITY = 9.8;
const LEVEL_THRESHOLD = 2;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const Demo = () => {
  const deviceMotion = useDeviceMotion();
  const value = deviceMotion.watch();

  const x = value.accelerationIncludingGravity.x;
  const y = value.accelerationIncludingGravity.y;
  const hasData = x !== null && y !== null;

  const offsetX = hasData ? clamp((-x / GRAVITY) * MAX_OFFSET, -MAX_OFFSET, MAX_OFFSET) : 0;
  const offsetY = hasData ? clamp((y / GRAVITY) * MAX_OFFSET, -MAX_OFFSET, MAX_OFFSET) : 0;

  const tiltX = hasData ? (-x / GRAVITY) * 90 : 0;
  const tiltY = hasData ? (y / GRAVITY) * 90 : 0;

  const isLevel = hasData && Math.abs(tiltX) < LEVEL_THRESHOLD && Math.abs(tiltY) < LEVEL_THRESHOLD;

  const cx = CIRCLE_SIZE / 2;
  const cy = CIRCLE_SIZE / 2;
  const r = cx - 8;

  const formatTilt = (v: number) => {
    const sign = v < 0 ? '-' : '';
    return `${sign}${Math.abs(v).toFixed(1)} deg`;
  };

  return (
    <section className='flex flex-col items-center gap-6 p-4'>
      <div className='relative' style={{ width: CIRCLE_SIZE, height: CIRCLE_SIZE }}>
        <svg height={CIRCLE_SIZE} viewBox={`0 0 ${CIRCLE_SIZE} ${CIRCLE_SIZE}`} width={CIRCLE_SIZE}>
          <g className='text-border' stroke='currentColor' strokeLinecap='round' strokeWidth='1'>
            <line x1={cx} x2={cx} y1={0} y2={CIRCLE_SIZE} />
            <line x1={0} x2={CIRCLE_SIZE} y1={cy} y2={cy} />
          </g>

          <circle
            className='text-border'
            cx={cx}
            cy={cy}
            fill='transparent'
            r={r}
            stroke='currentColor'
            strokeWidth='1.5'
          />

          {hasData && (
            <circle
              className={isLevel ? 'fill-green-500' : 'fill-foreground'}
              cx={cx + offsetX}
              cy={cy + offsetY}
              r={BUBBLE_SIZE / 2}
              style={{ transition: 'all 120ms ease-out, fill 200ms ease-out' }}
            />
          )}
        </svg>

        {isLevel && (
          <div className='pointer-events-none absolute inset-x-0 -bottom-8 text-center'>
            <span className='font-mono text-xs font-semibold tracking-[0.2em] text-green-500'>
              LEVEL
            </span>
          </div>
        )}

        {!hasData && (
          <div className='absolute inset-0 flex flex-col items-center justify-center gap-2 px-10 text-center'>
            <SmartphoneIcon className='text-muted-foreground size-8' />
            <p className='text-muted-foreground text-xs'>
              Open on a mobile device to see the bubble move.
            </p>
          </div>
        )}
      </div>

      {hasData && (
        <div className='text-foreground flex items-center gap-3 pt-4 font-mono text-sm tracking-wider tabular-nums'>
          <span>X {formatTilt(tiltX)}</span>
          <span className='text-muted-foreground'>|</span>
          <span>Y {formatTilt(tiltY)}</span>
        </div>
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
npx useverse@latest add useDeviceMotion
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useEffect, useRef } from 'react';

import { useRerender } from '../useRerender/useRerender';

export interface UseDeviceMotionReturn {
  snapshot: UseDeviceMotionValue;
  watch: () => UseDeviceMotionValue;
}

export interface UseDeviceMotionValue {
  acceleration: DeviceMotionEventAcceleration;
  accelerationIncludingGravity: DeviceMotionEventAcceleration;
  interval: DeviceMotionEvent['interval'];
  rotationRate: DeviceMotionEventRotationRate;
}

export interface UseDeviceMotionOptions {
  /** Whether to enable the hook */
  enabled?: boolean;
  /** The callback function to be invoked */
  onChange?: (event: DeviceMotionEvent) => void;
}

export interface UseDeviceMotion {
  (callback?: (event: DeviceMotionEvent) => void): UseDeviceMotionReturn;

  (options?: UseDeviceMotionOptions): UseDeviceMotionReturn;
}

/**
 * @name useDeviceMotion
 * @description - Hook that work with device motion
 * @category Sensors
 * @usage low
 *
 * @browserapi DeviceMotionEvent https://developer.mozilla.org/en-US/docs/Web/API/DeviceMotionEvent/DeviceMotionEvent
 *
 * @overload
 * @param {(event: DeviceMotionEvent) => void} [callback] The callback function to be invoked
 * @returns {UseDeviceMotionReturn} Device motion controls with snapshot/watch API
 *
 * @example
 * const { interval, rotationRate, acceleration, accelerationIncludingGravity } = useDeviceMotion((event) => console.log(event)).watch();
 *
 * @overload
 * @param {UseDeviceMotionOptions} [options] Configuration options
 * @param {boolean} [options.enabled] Whether to enable the hook
 * @param {(event: DeviceMotionEvent) => void} [options.onChange] The callback function to be invoked
 * @returns {UseDeviceMotionReturn} Device motion controls with snapshot/watch API
 *
 * @example
 * const { interval, rotationRate, acceleration, accelerationIncludingGravity } = useDeviceMotion().watch();
 */
export const useDeviceMotion = ((...params: any[]) => {
  const callback = typeof params[0] === 'function' ? params[0] : params[0]?.onChange;
  const enabled = typeof params[0] === 'object' ? (params[0]?.enabled ?? true) : true;

  const snapshotRef = useRef<UseDeviceMotionValue>({
    interval: 0,
    rotationRate: { alpha: null, beta: null, gamma: null },
    acceleration: { x: null, y: null, z: null },
    accelerationIncludingGravity: { x: null, y: null, z: null }
  });

  const internalCallbackRef = useRef(callback);
  const watchingRef = useRef(false);
  const rerender = useRerender();

  internalCallbackRef.current = callback;

  const watch = () => {
    watchingRef.current = true;
    return snapshotRef.current;
  };

  const updateValue = (value: UseDeviceMotionValue) => {
    snapshotRef.current = value;
    if (watchingRef.current) rerender();
  };

  useEffect(() => {
    if (!enabled) return;

    const onDeviceMotion = (event: DeviceMotionEvent) => {
      internalCallbackRef.current?.(event);

      updateValue({
        interval: event.interval,
        rotationRate: {
          ...snapshotRef.current.rotationRate,
          ...event.rotationRate
        },
        acceleration: {
          ...snapshotRef.current.acceleration,
          ...event.acceleration
        },
        accelerationIncludingGravity: {
          ...snapshotRef.current.accelerationIncludingGravity,
          ...event.accelerationIncludingGravity
        }
      });
    };

    window.addEventListener('devicemotion', onDeviceMotion);

    return () => {
      window.removeEventListener('devicemotion', onDeviceMotion);
    };
  }, [enabled]);

  return {
    snapshot: snapshotRef.current,
    watch
  };
}) as UseDeviceMotion;
```

Update the import paths to match your project setup.

## Usage

```tsx
const { interval, rotationRate, acceleration, accelerationIncludingGravity } = useDeviceMotion((event) => console.log(event)).watch();
// or
const { interval, rotationRate, acceleration, accelerationIncludingGravity } = useDeviceMotion().watch();
```

## Type Declarations

```tsx
export interface UseDeviceMotionReturn {
  snapshot: UseDeviceMotionValue;
  watch: () => UseDeviceMotionValue;
}

export interface UseDeviceMotionValue {
  acceleration: DeviceMotionEventAcceleration;
  accelerationIncludingGravity: DeviceMotionEventAcceleration;
  interval: DeviceMotionEvent['interval'];
  rotationRate: DeviceMotionEventRotationRate;
}

export interface UseDeviceMotionOptions {
  /** Whether to enable the hook */
  enabled?: boolean;
  /** The callback function to be invoked */
  onChange?: (event: DeviceMotionEvent) => void;
}

export interface UseDeviceMotion {
  (callback?: (event: DeviceMotionEvent) => void): UseDeviceMotionReturn;

  (options?: UseDeviceMotionOptions): UseDeviceMotionReturn;
}
```

## API

### Overload 1

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| callback | `(event: DeviceMotionEvent) => void` | - | The callback function to be invoked |

#### Returns

`UseDeviceMotionReturn` - Device motion controls with snapshot/watch API

### Overload 2

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| options | `UseDeviceMotionOptions` | - | Configuration options |
| options.enabled | `boolean` | - | Whether to enable the hook |
| options.onChange | `(event: DeviceMotionEvent) => void` | - | The callback function to be invoked |

#### Returns

`UseDeviceMotionReturn` - Device motion controls with snapshot/watch API
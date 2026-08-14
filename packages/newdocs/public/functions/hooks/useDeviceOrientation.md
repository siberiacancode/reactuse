---
title: useDeviceOrientation
description: Hook that provides the current device orientation
category: sensors
usage: low
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1779453143000
---

# useDeviceOrientation

Hook that provides the current device orientation

## Demo

```tsx
import { useDeviceOrientation } from '@siberiacancode/reactuse';
import { SmartphoneIcon } from 'lucide-react';

const CIRCLE_SIZE = 260;

const getCardinal = (deg: number) => {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return dirs[Math.round(deg / 45) % 8];
};

const Demo = () => {
  const deviceOrientation = useDeviceOrientation();

  if (!deviceOrientation.supported) {
    return (
      <p>
        API not supported, make sure to check for compatibility with different browsers when using
        this{' '}
        <a
          href='https://developer.mozilla.org/en-US/docs/Web/API/Window/DeviceOrientationEvent'
          rel='noreferrer'
          target='_blank'
        >
          API
        </a>
      </p>
    );
  }

  const cx = CIRCLE_SIZE / 2;
  const cy = CIRCLE_SIZE / 2;
  const r = cx - 20;
  const hasData = deviceOrientation.value.alpha !== null;
  const alpha = deviceOrientation?.value.alpha ?? 0;
  const heading = Math.round(alpha);

  const ticks = Array.from({ length: 60 }, (_, i) => i * 6);

  const labelR = r * 0.45;
  const labels = [
    { text: 'N', angle: 0, isNorth: true },
    { text: 'E', angle: 90, isNorth: false },
    { text: 'S', angle: 180, isNorth: false },
    { text: 'W', angle: 270, isNorth: false }
  ];

  return (
    <section className='flex flex-col items-center gap-6 p-4'>
      <div className='relative' style={{ width: CIRCLE_SIZE, height: CIRCLE_SIZE }}>
        <svg
          className='absolute top-0 left-0 z-10'
          height={CIRCLE_SIZE}
          viewBox={`0 0 ${CIRCLE_SIZE} ${CIRCLE_SIZE}`}
          width={CIRCLE_SIZE}
        >
          <path
            className='fill-foreground'
            d={`M ${cx} ${cy - r - 4} L ${cx - 5} ${cy - r - 14} L ${cx + 5} ${cy - r - 14} Z`}
          />
        </svg>

        <svg height={CIRCLE_SIZE} viewBox={`0 0 ${CIRCLE_SIZE} ${CIRCLE_SIZE}`} width={CIRCLE_SIZE}>
          <g
            style={{
              transform: hasData ? `rotate(${-alpha}deg)` : undefined,
              transformOrigin: `${cx}px ${cy}px`,
              transition: 'transform 120ms ease-out'
            }}
          >
            <circle
              className='fill-card text-border'
              cx={cx}
              cy={cy}
              r={r}
              stroke='currentColor'
              strokeWidth='1'
            />

            <g className='text-muted-foreground' stroke='currentColor' strokeLinecap='round'>
              {ticks.map((deg) => {
                const isMajor = deg % 30 === 0;
                const len = isMajor ? 10 : 4;
                const width = isMajor ? 1.5 : 0.75;
                const rad = ((deg - 90) * Math.PI) / 180;
                const x1 = cx + Math.cos(rad) * r;
                const y1 = cy + Math.sin(rad) * r;
                const x2 = cx + Math.cos(rad) * (r - len);
                const y2 = cy + Math.sin(rad) * (r - len);
                return <line key={deg} strokeWidth={width} x1={x1} x2={x2} y1={y1} y2={y2} />;
              })}
            </g>

            {hasData &&
              labels.map(({ text, angle, isNorth }) => {
                const rad = ((angle - 90) * Math.PI) / 180;
                const x = cx + Math.cos(rad) * labelR;
                const y = cy + Math.sin(rad) * labelR;
                return (
                  <text
                    key={text}
                    className={
                      isNorth ? 'fill-primary text-base font-semibold' : 'fill-foreground text-sm'
                    }
                    dominantBaseline='central'
                    textAnchor='middle'
                    x={x}
                    y={y}
                  >
                    {text}
                  </text>
                );
              })}
          </g>

          {hasData && <circle className='fill-foreground' cx={cx} cy={cy} r='2.5' />}
        </svg>

        {!hasData && (
          <div className='absolute inset-0 flex flex-col items-center justify-center gap-2 px-10 text-center'>
            <SmartphoneIcon className='text-muted-foreground size-8' />
            <p className='text-muted-foreground text-xs'>
              Open on a mobile device to see the compass move.
            </p>
          </div>
        )}
      </div>

      {hasData && (
        <div className='text-foreground flex items-center gap-3 font-mono text-sm tracking-wider tabular-nums'>
          <span>{String(heading).padStart(3, '0')} deg</span>
          <span className='text-muted-foreground'>|</span>
          <span>{getCardinal(heading)}</span>
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
npx useverse@latest add useDeviceOrientation
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useEffect, useState } from 'react';

/* The use device orientation value type */
export interface UseDeviceOrientationValue {
  /** The current absolute value */
  absolute: boolean;
  /** A number representing the motion of the device around the z axis, express in degrees with values ranging from 0 to 360 */
  alpha: number | null;
  /** A number representing the motion of the device around the x axis, express in degrees with values ranging from -180 to 180 */
  beta: number | null;
  /** A number representing the motion of the device around the y axis, express in degrees with values ranging from -90 to 90 */
  gamma: number | null;
}

/* The use device orientation return type */
export interface UseDeviceOrientationReturn {
  /** Whether the device orientation is supported */
  supported: boolean;
  /** The current device orientation value */
  value: UseDeviceOrientationValue;
}

/**
 * @name useDeviceOrientation
 * @description - Hook that provides the current device orientation
 * @category Sensors
 * @usage low
 *
 * @browserapi DeviceOrientationEvent https://developer.mozilla.org/en-US/docs/Web/API/DeviceOrientationEvent/DeviceOrientationEvent
 *
 * @returns {UseDeviceOrientationReturn} The current device orientation
 *
 * @example
 * const { supported, value } = useDeviceOrientation();
 */
export const useDeviceOrientation = (): UseDeviceOrientationReturn => {
  const supported =
    typeof window !== 'undefined' &&
    'DeviceOrientationEvent' in window &&
    !!window.DeviceOrientationEvent;

  const [value, setValue] = useState<UseDeviceOrientationValue>({
    alpha: null,
    beta: null,
    gamma: null,
    absolute: false
  });

  useEffect(() => {
    if (!supported) return;

    const onDeviceOrientation = (event: DeviceOrientationEvent) =>
      setValue({
        alpha: event.alpha,
        beta: event.beta,
        gamma: event.gamma,
        absolute: event.absolute
      });

    window.addEventListener('deviceorientation', onDeviceOrientation);
    return () => {
      window.removeEventListener('deviceorientation', onDeviceOrientation);
    };
  }, []);

  return {
    supported,
    value
  };
};
```

Update the import paths to match your project setup.

## Usage

```tsx
const { supported, value } = useDeviceOrientation();
```

## Type Declarations

```tsx
export interface UseDeviceOrientationValue {
  /** The current absolute value */
  absolute: boolean;
  /** A number representing the motion of the device around the z axis, express in degrees with values ranging from 0 to 360 */
  alpha: number | null;
  /** A number representing the motion of the device around the x axis, express in degrees with values ranging from -180 to 180 */
  beta: number | null;
  /** A number representing the motion of the device around the y axis, express in degrees with values ranging from -90 to 90 */
  gamma: number | null;
}

export interface UseDeviceOrientationReturn {
  /** Whether the device orientation is supported */
  supported: boolean;
  /** The current device orientation value */
  value: UseDeviceOrientationValue;
}
```

## API

### Returns

`UseDeviceOrientationReturn` - The current device orientation
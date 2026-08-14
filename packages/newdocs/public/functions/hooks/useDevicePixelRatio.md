---
title: useDevicePixelRatio
description: Hook that returns the device's pixel ratio
category: utilities
usage: low
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1781981977000
---

# useDevicePixelRatio

Hook that returns the device's pixel ratio

## Demo

```tsx
import { useDevicePixelRatio } from '@siberiacancode/reactuse';

const getDisplayLabel = (ratio: number) => {
  if (ratio < 1) return 'Low DPI';
  if (ratio === 1) return 'Standard';
  if (ratio <= 2) return 'Retina';
  return 'Super Retina';
};

const Demo = () => {
  const devicePixelRatio = useDevicePixelRatio();

  if (!devicePixelRatio.supported) {
    return (
      <p>
        API not supported, make sure to check for compatibility with different browsers when using
        this{' '}
        <a
          href='https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio'
          rel='noreferrer'
          target='_blank'
        >
          API
        </a>
      </p>
    );
  }

  const gridLines = Array.from({ length: 11 }, (_, i) => i * 10);

  return (
    <section className='flex flex-col items-center gap-4 p-4'>
      <div className='border-border bg-card relative flex h-[200px] w-[200px] items-center justify-center overflow-hidden rounded-lg border'>
        <svg className='absolute inset-0' height='200' viewBox='0 0 200 200' width='200'>
          <g className='text-border' stroke='currentColor' strokeWidth='0.5'>
            {gridLines.map((pos) => (
              <line key={`v-${pos}`} x1={pos * 2} x2={pos * 2} y1={0} y2={200} />
            ))}
            {gridLines.map((pos) => (
              <line key={`h-${pos}`} x1={0} x2={200} y1={pos * 2} y2={pos * 2} />
            ))}
          </g>
        </svg>

        <div className='relative flex flex-col items-center gap-1'>
          <span className='text-foreground font-mono text-5xl font-semibold tabular-nums'>
            {devicePixelRatio.value.toFixed(2)}x
          </span>
          <span className='text-muted-foreground font-mono text-[10px] tracking-[0.15em] uppercase'>
            {getDisplayLabel(devicePixelRatio.value)}
          </span>
        </div>
      </div>

      <p className='text-muted-foreground text-center text-xs'>Try zooming the page in and out</p>
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
npx useverse@latest add useDevicePixelRatio
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useEffect, useRef, useState } from 'react';

/** The use device pixel ratio callback type */
export type UseDevicePixelRatioCallback = (value: number) => void;

/** The use device pixel ratio return type */
export interface UseDevicePixelRatioReturn {
  /** Whether the device pixel ratio is supported*/
  supported: boolean;
  /** The ratio of the resolution in physical pixels to the resolution in CSS pixels */
  value: number;
}

/**
 * @name useDevicePixelRatio
 * @description - Hook that returns the device's pixel ratio
 * @category Utilities
 * @usage low
 *
 * @browserapi window.devicePixelRatio https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio
 *
 * @param {(value: number) => void} [callback] The callback to execute when the device pixel ratio changes
 * @returns {UseDevicePixelRatioReturn} The ratio and supported flag
 *
 * @example
 * const { supported, value } = useDevicePixelRatio();
 */
export const useDevicePixelRatio = (
  callback?: UseDevicePixelRatioCallback
): UseDevicePixelRatioReturn => {
  const supported =
    typeof window !== 'undefined' &&
    'matchMedia' in window &&
    !!window.matchMedia &&
    'devicePixelRatio' in window &&
    typeof window.devicePixelRatio === 'number';

  const [value, setValue] = useState(supported ? window.devicePixelRatio : 1);

  const internalCallbackRef = useRef(callback);
  internalCallbackRef.current = callback;

  useEffect(() => {
    if (!supported) return;

    const onChange = () => {
      const nextValue = window.devicePixelRatio;
      setValue(nextValue);
      internalCallbackRef.current?.(nextValue);
    };

    const media = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
    media.addEventListener('change', onChange);
    return () => {
      media.removeEventListener('change', onChange);
    };
  }, [supported, value]);

  return { supported, value };
};
```

Update the import paths to match your project setup.

## Usage

```tsx
const { supported, value } = useDevicePixelRatio();
```

## Type Declarations

```tsx
export type UseDevicePixelRatioCallback = (value: number) => void;

export interface UseDevicePixelRatioReturn {
  /** Whether the device pixel ratio is supported*/
  supported: boolean;
  /** The ratio of the resolution in physical pixels to the resolution in CSS pixels */
  value: number;
}
```

## API

### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| callback | `(value: number) => void` | - | The callback to execute when the device pixel ratio changes |

### Returns

`UseDevicePixelRatioReturn` - The ratio and supported flag
---
title: useThrottleEffect
description: Hook that runs an effect at most once per delay period when dependencies change
category: utilities
usage: medium
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1768590847000
---

# useThrottleEffect

Hook that runs an effect at most once per delay period when dependencies change

## Demo

```tsx
import { useThrottleEffect } from '@siberiacancode/reactuse';
import { useState } from 'react';

const SETTINGS = [
  { key: 'quality', label: 'Quality', min: 10, max: 100 },
  { key: 'brightness', label: 'Brightness', min: 50, max: 150 },
  { key: 'contrast', label: 'Contrast', min: 50, max: 150 },
  { key: 'saturation', label: 'Saturation', min: 0, max: 200 }
] as const;

const DEFAULT_SETTINGS = { quality: 80, brightness: 100, contrast: 100, saturation: 100 };

const Demo = () => {
  const [values, setValues] = useState(DEFAULT_SETTINGS);
  const [applied, setApplied] = useState(DEFAULT_SETTINGS);

  useThrottleEffect(
    () => {
      setApplied(values);
    },
    100,
    [values]
  );

  const onChange = (key: string, value: number) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const sizeKb = Math.round(60 + (applied.quality / 100) * 1840);
  const blur = (100 - applied.quality) / 50;

  const filter = [
    `blur(${blur}px)`,
    `brightness(${applied.brightness}%)`,
    `contrast(${applied.contrast}%)`,
    `saturate(${applied.saturation}%)`
  ].join(' ');

  return (
    <section className='flex w-full max-w-sm flex-col p-4'>
      <div data-slot='card'>
        <div className='flex flex-col gap-4' data-slot='card-content'>
          <div className='bg-muted relative aspect-[4/3] w-full overflow-hidden rounded-xl'>
            <img
              alt='Tokyo'
              className='size-full object-cover transition-[filter] duration-200'
              src='/images/tokyo.png'
              style={{ filter }}
            />
            <span className='bg-background/85 text-foreground absolute top-2.5 left-2.5 rounded-md px-2 py-1 font-mono text-xs tabular-nums shadow-sm backdrop-blur'>
              {(sizeKb / 1024).toFixed(2)} MB
            </span>
          </div>

          <div className='flex flex-col gap-3'>
            {SETTINGS.map((setting) => {
              const value = values[setting.key as keyof typeof values];
              const progress = ((value - setting.min) / (setting.max - setting.min)) * 100;
              return (
                <div key={setting.key} className='flex flex-col gap-1.5'>
                  <div className='flex items-center justify-between text-sm'>
                    <span className='text-foreground font-medium'>{setting.label}</span>
                    <span className='text-muted-foreground font-mono text-xs tabular-nums'>
                      {value}
                      {setting.key === 'quality' ? '%' : ''}
                    </span>
                  </div>
                  <input
                    max={setting.max}
                    min={setting.min}
                    style={{ ['--range-progress' as string]: `${progress}%` }}
                    type='range'
                    value={value}
                    onChange={(event) => onChange(setting.key, Number(event.target.value))}
                  />
                </div>
              );
            })}
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
npx useverse@latest add useThrottleEffect
```

### Manual

Copy and paste the following code into your project.

```tsx
import type { DependencyList, EffectCallback } from 'react';

import { useEffect, useRef } from 'react';

/**
 * @name useThrottleEffect
 * @description – Hook that runs an effect at most once per delay period when dependencies change
 * @category Utilities
 * @usage medium
 *
 * @param {EffectCallback} effect The effect callback to run
 * @param {number} delay The delay in milliseconds
 * @param {DependencyList} deps The dependencies list for the effect
 *
 * @example
 * useThrottleEffect(() => console.log('effect'), 500, [value]);
 */
export const useThrottleEffect = (effect: EffectCallback, delay: number, deps?: DependencyList) => {
  const mountedRef = useRef(true);
  const cleanupRef = useRef<ReturnType<EffectCallback>>(undefined);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isCalledRef = useRef(false);

  const effectRef = useRef(effect);
  const delayRef = useRef(delay);

  effectRef.current = effect;
  delayRef.current = delay;

  useEffect(() => {
    if (mountedRef.current) {
      mountedRef.current = false;
      return;
    }

    if (isCalledRef.current) return;

    cleanupRef.current = effectRef.current();
    isCalledRef.current = true;

    setTimeout(() => {
      isCalledRef.current = false;

      timeoutRef.current = setTimeout(() => {
        cleanupRef.current = effectRef.current();
      }, delayRef.current);
    }, delayRef.current);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
      if (typeof cleanupRef.current === 'function') cleanupRef.current();
    };
  }, deps);
};
```

Update the import paths to match your project setup.

## Usage

```tsx
useThrottleEffect(() => console.log('effect'), 500, [value]);
```

## Type Declarations

```tsx
import type { DependencyList, EffectCallback } from 'react';
```

## API

### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| effect | `EffectCallback` | - | The effect callback to run |
| delay | `number` | - | The delay in milliseconds |
| deps | `DependencyList` | - | The dependencies list for the effect |
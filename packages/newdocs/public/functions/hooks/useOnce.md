---
title: useOnce
description: Hook that runs an effect only once. Please do not use it in production code!
category: humor
usage: low
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1754977987000
---

# useOnce

Hook that runs an effect only once. Please do not use it in production code!

> Warning: This hook will run effect only once even in strict mode. Please do not use it in production code!

## Demo

```tsx
import { useOnce } from '@siberiacancode/reactuse';

const Demo = () => {
  useOnce(() => {
    console.log('effect ran once');
  });

  return (
    <section className='flex w-full max-w-md flex-col items-center gap-3 p-6'>
      <div className='flex flex-col items-center gap-1 text-center'>
        <h2 className='text-foreground text-sm font-semibold'>This effect ran once</h2>
        <p className='text-muted-foreground text-xs'>
          With <b>useOnce</b> the effect fires a single time, even in Strict Mode where a regular
          effect would run twice. Open the console to see the log.
        </p>
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
npx useverse@latest add useOnce
```

### Manual

Copy and paste the following code into your project.

```tsx
import type { EffectCallback } from 'react';

import { useEffect, useRef } from 'react';

/**
 * @name useEffectOnce
 * @description - Hook that runs an effect only once. Please do not use it in production code!
 * @category Humor
 * @usage low
 *
 * @warning - This hook will run effect only once even in strict mode. Please do not use it in production code!
 *
 * @param {EffectCallback} effect The effect to run
 *
 * @example
 * useOnce(() => console.log('effect once'));
 */
export function useOnce(effect: EffectCallback) {
  const cleanupRef = useRef<ReturnType<EffectCallback>>(undefined);
  const hasRunRef = useRef(false);
  const hasRenderedAfterRun = useRef(false);

  if (hasRunRef.current) {
    hasRenderedAfterRun.current = true;
  }

  useEffect(() => {
    if (hasRunRef.current) return;

    hasRunRef.current = true;
    cleanupRef.current = effect();

    return () => {
      if (!hasRenderedAfterRun.current) return;

      if (typeof cleanupRef.current === 'function') {
        cleanupRef.current();
      }
    };
  }, []);
}
```

Update the import paths to match your project setup.

## Usage

```tsx
useOnce(() => console.log('effect once'));
```

## Type Declarations

```tsx
import type { EffectCallback } from 'react';
```

## API

### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| effect | `EffectCallback` | - | The effect to run |
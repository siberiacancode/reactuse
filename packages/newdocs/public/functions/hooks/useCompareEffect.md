---
title: useCompareEffect
description: Hook that executes an effect only when the compare function reports a dependency as changed
category: lifecycle
usage: low
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1794213760000
---

# useCompareEffect

Hook that executes an effect only when the compare function reports a dependency as changed

## Demo

```tsx
import { shallowEqual, useCompareEffect, useRerender } from '@siberiacancode/reactuse';
import { LayersIcon, RefreshCwIcon } from 'lucide-react';
import { useEffect, useRef } from 'react';

const Demo = () => {
  const rerender = useRerender();

  const filter = { role: 'admin', range: { from: 0, to: 10 } };

  const effectCountRef = useRef(0);
  const shallowCountRef = useRef(0);
  const deepCountRef = useRef(0);

  useEffect(() => {
    effectCountRef.current++;
  }, [filter]);

  useCompareEffect(
    () => {
      shallowCountRef.current++;
    },
    [filter],
    shallowEqual
  );

  useCompareEffect(() => {
    deepCountRef.current++;
  }, [filter]);

  return (
    <section className='flex w-full max-w-sm flex-col p-4'>
      <div className='bg-card flex flex-col gap-4 rounded-xl p-5 shadow-sm'>
        <div className='flex items-start gap-3'>
          <div className='bg-primary/15 text-primary flex size-10 shrink-0 items-center justify-center rounded-full'>
            <LayersIcon className='size-5' />
          </div>

          <div className='flex min-w-0 flex-1 flex-col gap-1 leading-tight'>
            <span className='text-foreground text-sm font-semibold'>Nested dependency</span>
            <span className='text-muted-foreground text-xs leading-relaxed'>
              The nested <b>range</b> object is rebuilt on every render, so only the default deep
              comparison sees the filter as unchanged.
            </span>
          </div>
        </div>

        <div className='border-border grid grid-cols-3 gap-3 border-t pt-3'>
          <div className='flex flex-col leading-tight'>
            <span className='text-muted-foreground text-[10px] tracking-wider uppercase'>
              useEffect
            </span>
            <span className='text-foreground font-mono text-lg font-semibold tabular-nums'>
              {effectCountRef.current}
            </span>
            <span className='text-muted-foreground mt-0.5 text-[10px] leading-tight'>
              every render
            </span>
          </div>

          <div className='flex flex-col leading-tight'>
            <span className='text-muted-foreground text-[10px] tracking-wider uppercase'>
              shallowEqual
            </span>
            <span className='text-foreground font-mono text-lg font-semibold tabular-nums'>
              {shallowCountRef.current}
            </span>
            <span className='text-muted-foreground mt-0.5 text-[10px] leading-tight'>
              nested ref differs
            </span>
          </div>

          <div className='flex flex-col leading-tight'>
            <span className='text-muted-foreground text-[10px] tracking-wider uppercase'>
              default
            </span>
            <span className='text-primary font-mono text-lg font-semibold tabular-nums'>
              {deepCountRef.current}
            </span>
            <span className='text-muted-foreground mt-0.5 text-[10px] leading-tight'>
              skips identical values
            </span>
          </div>
        </div>

        <div className='border-border flex items-center justify-end border-t pt-3'>
          <button data-size='sm' data-variant='outline' type='button' onClick={rerender}>
            <RefreshCwIcon className='size-3.5' />
            Re-render
          </button>
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
npx useverse@latest add useCompareEffect
```

### Manual

Copy and paste the following code into your project.

```tsx
import type { DependencyList, EffectCallback } from 'react';

import { useEffect, useRef } from 'react';

import { deepEqual } from '@/helpers/deepEqual/deepEqual';

/** The function that compares a dependency with its previous value */
export type CompareFunction = (current: any, previous: any) => boolean;

/**
 * @name useCompareEffect
 * @description - Hook that executes an effect only when the compare function reports a dependency as changed
 * @category Lifecycle
 * @usage low
 *
 * @param {EffectCallback} effect The effect callback
 * @param {DependencyList} [deps] The dependencies list for the effect
 * @param {CompareFunction} [compare=deepEqual] The function that returns `true` when a dependency is equal to its previous value
 *
 * @example
 * useCompareEffect(() => console.log("effect"), [user]);
 */
export const useCompareEffect = (
  effect: EffectCallback,
  deps?: DependencyList,
  compare: CompareFunction = deepEqual
) => {
  const committedRef = useRef<{ deps?: DependencyList; signal: number }>(undefined);

  const committed = committedRef.current;
  const committedDeps = committed?.deps;

  const equal =
    !!deps &&
    !!committedDeps &&
    deps.length === committedDeps.length &&
    deps.every((dep, index) => compare(dep, committedDeps[index]));

  const signal = (committed?.signal ?? 0) + (equal ? 0 : 1);

  useEffect(() => {
    committedRef.current = { deps, signal };
    return effect();
  }, [signal]);
};
```

Update the import paths to match your project setup.

## Usage

```tsx
useCompareEffect(() => console.log("effect"), [user]);
```

## Type Declarations

```tsx
import type { DependencyList, EffectCallback } from 'react';

export type CompareFunction = (current: any, previous: any) => boolean;
```

## API

### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| effect | `EffectCallback` | - | The effect callback |
| deps | `DependencyList` | - | The dependencies list for the effect |
| compare | `CompareFunction` | deepEqual | The function that returns `true` when a dependency is equal to its previous value |
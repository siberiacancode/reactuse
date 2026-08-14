---
title: useUnmount
description: Hook that defines the logic when unmounting a component
category: lifecycle
usage: necessary
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1754977987000
---

# useUnmount

Hook that defines the logic when unmounting a component

## Demo

```tsx
import { useBoolean, useCounter, useUnmount } from '@siberiacancode/reactuse';
import { PowerIcon, PowerOffIcon } from 'lucide-react';

import { cn } from '@/utils/lib';

interface LiveComponentProps {
  onUnmount: () => void;
}

const LiveComponent = ({ onUnmount }: LiveComponentProps) => {
  useUnmount(onUnmount);
  return null;
};

const Demo = () => {
  const [mounted, toggleMounted] = useBoolean(true);
  const unmountCount = useCounter(0);

  return (
    <section className='flex w-full max-w-sm flex-col p-4'>
      <div className='bg-card flex flex-col gap-4 rounded-xl p-5 shadow-sm'>
        <div className='flex items-start gap-3'>
          <div
            className={cn(
              'flex size-10 shrink-0 items-center justify-center rounded-full transition-colors',
              mounted
                ? 'bg-green-500/15 text-green-600 dark:text-green-500'
                : 'bg-muted text-muted-foreground'
            )}
          >
            {mounted ? <PowerIcon className='size-5' /> : <PowerOffIcon className='size-5' />}
          </div>

          <div className='flex min-w-0 flex-1 flex-col gap-1 leading-tight'>
            <span className='text-foreground text-sm font-semibold'>
              {mounted ? 'Component mounted' : 'Component unmounted'}
            </span>
            <span className='text-muted-foreground text-xs leading-relaxed'>
              {mounted
                ? 'The component is on the screen. Toggle it off to trigger the unmount cleanup.'
                : 'The component was removed and its useUnmount cleanup has run.'}
            </span>
          </div>
        </div>

        <div className='border-border flex items-center justify-between border-t pt-3'>
          <div className='flex flex-col leading-tight'>
            <span className='text-muted-foreground text-[10px] tracking-wider uppercase'>
              Cleanups run
            </span>
            <span className='text-foreground font-mono text-lg font-semibold tabular-nums'>
              {unmountCount.value}
            </span>
          </div>

          <button
            data-size='sm'
            data-variant={mounted ? 'outline' : 'default'}
            type='button'
            onClick={() => toggleMounted()}
          >
            {mounted ? <PowerOffIcon className='size-3.5' /> : <PowerIcon className='size-3.5' />}
            {mounted ? 'Unmount' : 'Mount'}
          </button>
        </div>
      </div>

      {mounted && <LiveComponent onUnmount={() => unmountCount.inc()} />}
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
npx useverse@latest add useUnmount
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useEffect, useRef } from 'react';

/**
 * @name useUnmount
 * @description - Hook that defines the logic when unmounting a component
 * @category Lifecycle
 * @usage necessary
 *
 * @param {() => void} callback The callback function to be invoked on component unmount
 * @returns {void}
 *
 * @example
 * useUnmount(() => console.log('This effect runs on component unmount'));
 */

export const useUnmount = (callback: () => void) => {
  const internalCallbackRef = useRef(callback);
  internalCallbackRef.current = callback;

  useEffect(
    () => () => {
      internalCallbackRef.current();
    },
    []
  );
};
```

Update the import paths to match your project setup.

## Usage

```tsx
useUnmount(() => console.log('This effect runs on component unmount'));
```

## API

### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| callback | `() => void` | - | The callback function to be invoked on component unmount |

### Returns

`void`
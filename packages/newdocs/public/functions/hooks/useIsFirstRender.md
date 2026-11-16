---
title: useIsFirstRender
description: Hook that returns true if the component is first render
category: lifecycle
usage: low
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1754977987000
---

# useIsFirstRender

Hook that returns true if the component is first render

## Demo

```tsx
import { useCounter, useIsFirstRender } from '@siberiacancode/reactuse';
import { RefreshCwIcon, RotateCwIcon, SparklesIcon } from 'lucide-react';

import { cn } from '@/utils/lib';

const Demo = () => {
  const isFirstRender = useIsFirstRender();
  const counter = useCounter(0);

  return (
    <section className='flex w-full max-w-sm flex-col p-4'>
      <div className='bg-card flex flex-col gap-4 rounded-xl p-5 shadow-sm'>
        <div className='flex items-start gap-3'>
          <div
            className={cn(
              'flex size-10 shrink-0 items-center justify-center rounded-full transition-colors',
              isFirstRender
                ? 'bg-green-500/15 text-green-600 dark:text-green-500'
                : 'bg-muted text-muted-foreground'
            )}
          >
            {isFirstRender ? (
              <SparklesIcon className='size-5' />
            ) : (
              <RotateCwIcon className='size-5' />
            )}
          </div>

          <div className='flex min-w-0 flex-1 flex-col gap-1 leading-tight'>
            <span className='text-foreground text-sm font-semibold'>
              {isFirstRender ? 'First render' : 'Subsequent render'}
            </span>
            <span className='text-muted-foreground text-xs leading-relaxed'>
              {isFirstRender
                ? 'The component just mounted — this is the initial render pass.'
                : 'The component has rendered before. Effects depending on values will fire normally now.'}
            </span>
          </div>
        </div>

        <div className='border-border flex items-center justify-between border-t pt-3'>
          <div className='flex flex-col leading-tight'>
            <span className='text-muted-foreground text-[10px] tracking-wider uppercase'>
              Re-renders
            </span>
            <span className='text-foreground font-mono text-lg font-semibold tabular-nums'>
              {counter.value}
            </span>
          </div>

          <button data-size='sm' data-variant='outline' type='button' onClick={() => counter.inc()}>
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
npx useverse@latest add useIsFirstRender
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useRef } from 'react';

/**
 * @name useIsFirstRender
 * @description - Hook that returns true if the component is first render
 * @category Lifecycle
 * @usage low
 *
 * @returns {boolean} True if the component is first render
 *
 * @example
 * const isFirstRender = useIsFirstRender();
 */
export const useIsFirstRender = () => {
  const renderRef = useRef(true);

  if (renderRef.current === true) {
    renderRef.current = false;
    return true;
  }

  return renderRef.current;
};
```

Update the import paths to match your project setup.

## Usage

```tsx
const isFirstRender = useIsFirstRender();
```

## API

### Returns

`boolean` - True if the component is first render
---
title: usePageLeave
description: Hook what calls given function when mouse leaves the page
category: sensors
usage: low
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1754977987000
---

# usePageLeave

Hook what calls given function when mouse leaves the page

## Demo

```tsx
import { useDisclosure, usePageLeave } from '@siberiacancode/reactuse';
import { SparklesIcon, XIcon } from 'lucide-react';

const Demo = () => {
  const dialog = useDisclosure();

  usePageLeave(dialog.open);

  return (
    <section className='flex w-full max-w-md flex-col gap-3 p-4'>
      <h2 className='text-foreground text-base font-semibold'>Catch leaving visitors</h2>
      <p className='text-muted-foreground text-sm leading-relaxed'>
        Move your cursor outside the page — when you're about to leave, an exit-intent offer
        appears, just like real checkout pages do.
      </p>

      {dialog.opened && (
        <div
          className='animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm duration-150'
          onClick={dialog.close}
        >
          <div
            className='animate-in fade-in zoom-in-95 border-border bg-card flex w-full max-w-sm flex-col items-center gap-3 rounded-xl border p-6 text-center shadow-2xl duration-200'
            onClick={(event) => event.stopPropagation()}
          >
            <button
              aria-label='Close'
              className='absolute top-3 right-3'
              data-size='icon-sm'
              data-variant='ghost'
              type='button'
              onClick={dialog.close}
            >
              <XIcon className='size-4' />
            </button>

            <div className='bg-primary/10 text-primary flex size-12 items-center justify-center rounded-full'>
              <SparklesIcon className='size-6' />
            </div>

            <div className='flex flex-col gap-1'>
              <h3 className='text-foreground text-lg font-semibold'>Wait — before you go!</h3>
              <p className='text-muted-foreground text-sm leading-relaxed'>
                Here's <strong className='text-foreground'>10% off</strong> your first order if you
                stay with us.
              </p>
            </div>

            <div className='mt-2 flex w-full items-center gap-2'>
              <button
                className='flex-1'
                data-variant='outline'
                type='button'
                onClick={dialog.close}
              >
                No thanks
              </button>
              <button className='flex-1' type='button' onClick={dialog.close}>
                Claim discount
              </button>
            </div>
          </div>
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
npx useverse@latest add usePageLeave
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useEffect, useState } from 'react';

import { useEvent } from '../useEvent/useEvent';

/**
 * @name usePageLeave
 * @description - Hook what calls given function when mouse leaves the page
 * @category Sensors
 * @usage low
 *
 * @param {() => void} [callback] The callback function what calls then mouse leaves the page
 * @returns {boolean} A boolean which determines if the mouse left the page
 *
 * @example
 * const isLeft = usePageLeave(() => console.log('on leave'))
 */
export const usePageLeave = (callback?: () => void) => {
  const [isLeft, setIsLeft] = useState(false);

  const onMouse = useEvent(() => {
    if (isLeft) return setIsLeft(false);
    callback?.();
    setIsLeft(true);
  });

  useEffect(() => {
    document.addEventListener('mouseleave', onMouse, { passive: true });
    document.addEventListener('mouseenter', onMouse, { passive: true });

    return () => {
      document.removeEventListener('mouseenter', onMouse);
      document.removeEventListener('mouseleave', onMouse);
    };
  }, []);

  return isLeft;
};
```

Update the import paths to match your project setup.

## Usage

```tsx
const isLeft = usePageLeave(() => console.log('on leave'))
```

## API

### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| callback | `() => void` | - | The callback function what calls then mouse leaves the page |

### Returns

`boolean` - A boolean which determines if the mouse left the page
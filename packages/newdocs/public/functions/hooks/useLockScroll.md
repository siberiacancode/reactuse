---
title: useLockScroll
description: Hook that locks scroll on an element or document body
category: elements
usage: medium
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1768553242000
---

# useLockScroll

Hook that locks scroll on an element or document body

## Demo

```tsx
import { useDisclosure, useLockScroll } from '@siberiacancode/reactuse';
import { XIcon } from 'lucide-react';

const Demo = () => {
  const dialog = useDisclosure();
  useLockScroll({ enabled: dialog.opened });

  return (
    <section className='flex w-full max-w-md flex-col gap-3 p-4'>
      <h2 className='text-foreground text-base font-semibold'>Lock the page scroll</h2>
      <p className='text-muted-foreground text-sm leading-relaxed'>
        Open the dialog below — while it is visible, the page behind it cannot be scrolled. Close
        the dialog and scrolling becomes available again.
      </p>

      <button className='self-start' data-size='sm' type='button' onClick={dialog.open}>
        Open dialog
      </button>

      {dialog.opened && (
        <div
          className='animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm duration-150'
          onClick={dialog.close}
        >
          <div
            className='animate-in fade-in zoom-in-95 border-border bg-card flex w-full max-w-sm flex-col gap-3 rounded-xl border p-5 shadow-2xl duration-200'
            onClick={(event) => event.stopPropagation()}
          >
            <div className='flex items-start justify-between gap-2'>
              <h3 className='text-foreground text-sm font-semibold'>Delete this project?</h3>
              <button
                aria-label='Close'
                data-size='icon'
                data-variant='ghost'
                type='button'
                onClick={dialog.close}
              >
                <XIcon className='size-3.5' />
              </button>
            </div>

            <p className='text-muted-foreground text-xs leading-relaxed'>
              This will permanently remove all data, comments, and history associated with this
              project. This action cannot be undone.
            </p>

            <div className='mt-2 flex items-center justify-end gap-2'>
              <button data-size='sm' data-variant='outline' type='button' onClick={dialog.close}>
                Cancel
              </button>
              <button
                data-size='sm'
                data-variant='destructive'
                type='button'
                onClick={dialog.close}
              >
                Delete project
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
npx useverse@latest add useLockScroll
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useRef, useState } from 'react';

import type { HookTarget } from '@/utils/helpers';

import { isTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

import { useIsomorphicLayoutEffect } from '../useIsomorphicLayoutEffect/useIsomorphicLayoutEffect';
import { useRefState } from '../useRefState/useRefState';

/** The use lock scroll options type */
export interface UseLockScrollOptions {
  /** Enable or disable scroll locking. Default: true */
  enabled?: boolean;
}

/** The use lock scroll return type */
export interface UseLockScrollReturn<Target extends Element> {
  /** The ref to attach to the element */
  ref: StateRef<Target>;
  /** The value of the lock state */
  value: boolean;
  /** Lock the scroll */
  lock: () => void;
  /** Toggle the scroll lock */
  toggle: (value?: boolean) => void;
  /** Unlock the scroll */
  unlock: () => void;
}

export interface UseLockScroll {
  (target: HookTarget, options?: UseLockScrollOptions): UseLockScrollReturn<Element>;

  <Target extends Element>(
    options?: UseLockScrollOptions,
    target?: never
  ): UseLockScrollReturn<Target> & { ref: StateRef<Target> };
}

/**
 * @name useLockScroll
 * @description - Hook that locks scroll on an element or document body
 * @category Elements
 * @usage medium
 *
 * @overload
 * @param {HookTarget} [target=document.body] The target element to lock scroll on
 * @param {UseLockScrollOptions} [options] The options for scroll locking
 * @returns {void}
 *
 * @example
 * const { lock, unlock, value, toggle } = useLockScroll(ref);
 *
 * @overload
 * @template Target The target element
 * @param {UseLockScrollOptions} [options] The options for scroll locking
 * @returns {StateRef<Target>} Ref to attach to element, or locks body scroll by default
 *
 * @example
 * const { ref, lock, unlock, value, toggle } = useLockScroll();
 */
export const useLockScroll = ((...params: any[]): any => {
  const target = (isTarget(params[0]) ? params[0] : undefined) as HookTarget | undefined;
  const options = (target ? params[1] : params[0]) as UseLockScrollOptions | undefined;

  const enabled = options?.enabled ?? true;
  const [locked, setLocked] = useState(enabled);

  const internalRef = useRefState<Element>();
  const elementRef = useRef<Element>(null);

  useIsomorphicLayoutEffect(() => {
    const element =
      ((target ? isTarget.getElement(target) : internalRef.current) as Element) ?? document.body;

    if (!(element instanceof HTMLElement)) return;

    elementRef.current = element;

    if (!enabled) return;

    const originalStyle = window.getComputedStyle(element).overflow;
    (elementRef.current as any).__originalOverflow = originalStyle;
    element.style.overflow = 'hidden';

    return () => {
      element.style.overflow = originalStyle;
      elementRef.current = null;
    };
  }, [target && isTarget.getRawElement(target), internalRef.state, enabled]);

  const lock = () => {
    if (!elementRef.current) return;
    const element = elementRef.current as HTMLElement;
    (elementRef.current as any).__originalOverflow = window.getComputedStyle(element).overflow;
    element.style.overflow = 'hidden';
    setLocked(true);
  };

  const unlock = () => {
    if (!elementRef.current) return;
    const element = elementRef.current as HTMLElement;
    element.style.overflow = (elementRef.current as any).__originalOverflow;
    setLocked(false);
  };

  const toggle = (value = !locked) => {
    if (value) return lock();
    return unlock();
  };

  if (target)
    return {
      value: locked,
      lock,
      unlock,
      toggle
    };
  return {
    ref: internalRef,
    value: locked,
    lock,
    unlock,
    toggle
  };
}) as UseLockScroll;
```

Update the import paths to match your project setup.

## Usage

```tsx
const { lock, unlock, value, toggle } = useLockScroll(ref);
// or
const { ref, lock, unlock, value, toggle } = useLockScroll();
```

## Type Declarations

```tsx
import type { HookTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

export interface UseLockScrollOptions {
  /** Enable or disable scroll locking. Default: true */
  enabled?: boolean;
}

export interface UseLockScrollReturn<Target extends Element> {
  /** The ref to attach to the element */
  ref: StateRef<Target>;
  /** The value of the lock state */
  value: boolean;
  /** Lock the scroll */
  lock: () => void;
  /** Toggle the scroll lock */
  toggle: (value?: boolean) => void;
  /** Unlock the scroll */
  unlock: () => void;
}

export interface UseLockScroll {
  (target: HookTarget, options?: UseLockScrollOptions): UseLockScrollReturn<Element>;

  <Target extends Element>(
    options?: UseLockScrollOptions,
    target?: never
  ): UseLockScrollReturn<Target> & { ref: StateRef<Target> };
}
```

## API

### Overload 1

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| target | `HookTarget` | document.body | The target element to lock scroll on |
| options | `UseLockScrollOptions` | - | The options for scroll locking |

#### Returns

`void`

### Overload 2

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| options | `UseLockScrollOptions` | - | The options for scroll locking |

#### Returns

`StateRef<Target>` - Ref to attach to element, or locks body scroll by default
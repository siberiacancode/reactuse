---
title: useScrollTo
description: Hook for scrolling to a specific element
category: sensors
usage: low
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1773843478000
---

# useScrollTo

Hook for scrolling to a specific element

## Demo

```tsx
import { useScrollTo } from '@siberiacancode/reactuse';
import { ArrowUpIcon, ClockIcon, UserIcon } from 'lucide-react';

const PARAGRAPHS = [
  'reactuse is a collection of essential React hooks for everyday development. Fully typed, tree-shakeable and built around a consistent API — whether you need debounce, local storage, media queries or device sensors, there is probably a hook for it.',
  'Every hook follows the same shape, so once you learn one you already know the rest. Options go in, a small object comes out, and the ref is always there when you need to attach to a DOM node.',
  'Take useScrollTo. It scrolls a container to an exact position. Give it x and y coordinates and it glides there — no scrollTop assignments, no behavior boilerplate scattered around your handlers.',
  'Unlike scrolling to an element, you control the precise point. Jump to the very top, restore a saved offset, or move to any coordinate you computed, all through a single trigger call.',
  'It also accepts immediately, scrolling to the position right after mount. That makes restoring a previous scroll offset trivial when a view first opens.',
  'Because the container is held inside the hook, you never reach for refs and manual math in every handler. One ref, one trigger, and the scrolling concern stays in a single place.',
  'That keeps components readable. The intent — scroll to this position — reads straight off the call site, instead of hiding behind imperative DOM access buried in an effect.',
  'You have reached the end of the article. Use the button below to glide all the way back to the top in a single smooth motion.'
];

const Demo = () => {
  const scrollTo = useScrollTo<HTMLDivElement>();

  return (
    <section className='flex min-w-xs flex-col gap-4 md:min-w-md'>
      <div className='relative overflow-hidden rounded-xl'>
        <div
          ref={scrollTo.ref}
          className='no-scrollbar flex h-96 flex-col gap-5 overflow-y-auto p-5'
        >
          <header className='flex flex-col gap-2'>
            <h1 className='text-foreground text-2xl leading-tight font-semibold'>
              Meet reactuse — a hooks library you will love
            </h1>
            <div className='text-muted-foreground flex items-center gap-3 text-sm'>
              <span className='flex items-center gap-1.5'>
                <UserIcon className='size-3.5' />
                reactuse
              </span>
              <span className='flex items-center gap-1.5'>
                <ClockIcon className='size-3.5' />3 min read
              </span>
            </div>
          </header>

          <article className='flex flex-col gap-4'>
            {PARAGRAPHS.map((text, index) => (
              <p key={index} className='text-foreground text-base leading-relaxed'>
                {text}
              </p>
            ))}
          </article>

          <div className='flex justify-center pt-2'>
            <button
              data-variant='outline'
              type='button'
              onClick={() => scrollTo.trigger({ x: 0, y: 0, behavior: 'smooth' })}
            >
              <ArrowUpIcon />
              Back to top
            </button>
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
npx useverse@latest add useScrollTo
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useRef } from 'react';

import type { HookTarget } from '@/utils/helpers';

import { isTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

import { useIsomorphicLayoutEffect } from '../useIsomorphicLayoutEffect/useIsomorphicLayoutEffect';
import { useRefState } from '../useRefState/useRefState';

/** The use scroll to options type */
export interface UseScrollToOptions {
  /** The scrolling behavior */
  behavior?: ScrollBehavior;
  /** Whether to immediately the scroll to */
  immediately?: boolean;
  /** The horizontal position to scroll to */
  x: number;
  /** The vertical position to scroll to */
  y: number;
}

/** The use scroll to return type */
export interface UseScrollToReturn {
  /** The state of scrolling */
  trigger: (params?: { x: number; y: number; behavior?: ScrollBehavior }) => void;
}

export interface UseScrollTo {
  <Target extends Element>(
    options?: UseScrollToOptions,
    target?: never
  ): UseScrollToReturn & { ref: StateRef<Target> };

  (target?: HookTarget, options?: UseScrollToOptions): UseScrollToReturn;
}

/**
 * @name useScrollTo
 * @description - Hook for scrolling to a specific element
 * @category Sensors
 * @usage low
 *
 * @overload
 * @param {HookTarget} [target=window] The target element for scrolling to
 * @param {boolean} [options.immediately=true] Whether to scroll immediately
 * @param {number} [options.x] The horizontal position to scroll to
 * @param {number} [options.y] The vertical position to scroll to
 * @param {ScrollBehavior} [options.behavior=auto] The scrolling behavior
 * @returns {UseScrollToReturn} The scroll trigger function
 *
 * @example
 * const trigger = useScrollTo(ref, options);
 *
 * @overload
 * @template Target The target element
 * @param {boolean} [options.immediately=true] Whether to scroll immediately
 * @param {number} [options.x] The horizontal position to scroll to
 * @param {number} [options.y] The vertical position to scroll to
 * @param {ScrollBehavior} [options.behavior=auto] The scrolling behavior
 * @returns {UseScrollToReturn & { ref: StateRef<Target> }} The scroll trigger function and ref
 *
 * @example
 * const { ref, trigger } = useScrollTo(options);
 */
export const useScrollTo = ((...params: any[]) => {
  const target = (isTarget(params[0]) ? params[0] : undefined) as HookTarget | undefined;
  const options = (target ? params[1] : params[0]) as UseScrollToOptions | undefined;
  const { x, y, behavior = 'auto', immediately = true } = options ?? {};
  const internalRef = useRefState<Element>();
  const elementRef = useRef<Element>(null);

  useIsomorphicLayoutEffect(() => {
    if (!immediately) return;

    const element =
      ((target ? isTarget.getElement(target) : internalRef.current) as Element) ?? window;

    elementRef.current = element;

    element.scrollTo({ top: y, left: x, behavior });
  }, [target && isTarget.getRawElement(target), internalRef.state]);

  const trigger = (params?: { x: number; y: number; behavior?: ScrollBehavior }) => {
    if (!elementRef.current) return;

    const { x, y, behavior } = params ?? {};

    elementRef.current.scrollTo({ left: x, top: y, behavior });
  };

  if (target) return { trigger };
  return { ref: internalRef, trigger };
}) as UseScrollTo;
```

Update the import paths to match your project setup.

## Usage

```tsx
const trigger = useScrollTo(ref, options);
// or
const { ref, trigger } = useScrollTo(options);
```

## Type Declarations

```tsx
import type { HookTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

export interface UseScrollToOptions {
  /** The scrolling behavior */
  behavior?: ScrollBehavior;
  /** Whether to immediately the scroll to */
  immediately?: boolean;
  /** The horizontal position to scroll to */
  x: number;
  /** The vertical position to scroll to */
  y: number;
}

export interface UseScrollToReturn {
  /** The state of scrolling */
  trigger: (params?: { x: number; y: number; behavior?: ScrollBehavior }) => void;
}

export interface UseScrollTo {
  <Target extends Element>(
    options?: UseScrollToOptions,
    target?: never
  ): UseScrollToReturn & { ref: StateRef<Target> };

  (target?: HookTarget, options?: UseScrollToOptions): UseScrollToReturn;
}
```

## API

### Overload 1

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| target | `HookTarget` | window | The target element for scrolling to |
| options.immediately | `boolean` | true | Whether to scroll immediately |
| options.x | `number` | - | The horizontal position to scroll to |
| options.y | `number` | - | The vertical position to scroll to |
| options.behavior | `ScrollBehavior` | auto | The scrolling behavior |

#### Returns

`UseScrollToReturn` - The scroll trigger function

### Overload 2

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| options.immediately | `boolean` | true | Whether to scroll immediately |
| options.x | `number` | - | The horizontal position to scroll to |
| options.y | `number` | - | The vertical position to scroll to |
| options.behavior | `ScrollBehavior` | auto | The scrolling behavior |

#### Returns

`UseScrollToReturn & { ref: StateRef<Target> }` - The scroll trigger function and ref
---
title: useWindowScroll
description: Hook that manages the window scroll position
category: sensors
usage: low
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1782054576000
---

# useWindowScroll

Hook that manages the window scroll position

## Demo

```tsx
import { useWindowScroll } from '@siberiacancode/reactuse';
import { ArrowUpIcon, ClockIcon, UserIcon } from 'lucide-react';

const PARAGRAPHS = [
  'reactuse is a collection of essential React hooks for everyday development. Fully typed, tree-shakeable and built around a consistent API — whether you need debounce, local storage, media queries or device sensors, there is probably a hook for it.',
  'Every hook follows the same shape, so once you learn one you already know the rest. Options go in, a small object comes out, and the ref is always there when you need to attach to a DOM node.',
  'Take useWindowScroll. It tracks the scroll position of the whole window and gives you back the current x and y offsets, updating as you scroll.',
  'Because the position lives in state, you can react to it — show a progress bar, reveal a floating button, or trigger something once the reader passes a certain point on the page.',
  'It also hands you a scrollTo helper. Pass the coordinates you want and the window glides there smoothly, without manual window.scrollTo calls scattered across your handlers.',
  'A classic use case is the back-to-top button. Watch the y offset, show the button once the reader has scrolled far enough, and scroll them home in a single smooth motion.',
  'That keeps the intent readable. The position is just a value, and scrolling is just a call — no event listeners or imperative DOM access living inside your components.',
  'You have reached the end of the article. Use the button in the corner to glide all the way back to the top in a single smooth motion.'
];

const Demo = () => {
  const windowScroll = useWindowScroll();
  const value = windowScroll.watch();
  const showBackToTop = value.y > 200;

  return (
    <section className='relative flex min-w-xs flex-col gap-4 md:min-w-md'>
      <div className='flex flex-col gap-5 p-5'>
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
      </div>

      {showBackToTop && (
        <button
          aria-label='Back to top'
          className='fixed right-6 bottom-6 z-50 rounded-full! shadow-md'
          data-size='icon-lg'
          data-variant='default'
          type='button'
          onClick={() => windowScroll.scrollTo({ y: 0, behavior: 'smooth' })}
        >
          <ArrowUpIcon className='size-5' />
        </button>
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
npx useverse@latest add useWindowScroll
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useEffect, useRef } from 'react';

import { useRerender } from '../useRerender/useRerender';

export interface ScrollPosition {
  x: number;
  y: number;
}

export interface UseWindowScrollReturn {
  /** Function to scroll window to a specific position */
  scrollTo: typeof scrollTo;
  /** The latest window scroll position snapshot */
  snapshot: ScrollPosition;
  /** Function to enable subscriptions and rerender on next updates */
  watch: () => ScrollPosition;
}

export type UseWindowScrollCallback = (value: ScrollPosition, event: Event) => void;

export const scrollTo = ({
  x,
  y,
  behavior = 'smooth'
}: Partial<ScrollPosition & ScrollOptions>) => {
  const scrollOptions: ScrollToOptions = { behavior };
  if (typeof x === 'number') scrollOptions.left = x;
  if (typeof y === 'number') scrollOptions.top = y;
  window.scrollTo(scrollOptions);
};

/**
 * @name useWindowScroll
 * @description - Hook that manages the window scroll position
 * @category Sensors
 * @usage low
 *
 * @param {(value: ScrollPosition, event: Event) => void} [callback] The callback to invoke on window scroll updates
 * @returns {UseWindowScrollReturn} An object containing the latest window scroll snapshot, watch function, and scrollTo helper
 *
 * @example
 * const { snapshot, scrollTo, watch } = useWindowScroll((value) => console.log(value));
 */
export const useWindowScroll = (callback?: UseWindowScrollCallback): UseWindowScrollReturn => {
  const getValue = (): ScrollPosition => {
    if (typeof window === 'undefined')
      return { x: Number.POSITIVE_INFINITY, y: Number.POSITIVE_INFINITY };
    return { x: window.scrollX, y: window.scrollY };
  };

  const snapshotRef = useRef<ScrollPosition>(getValue());
  const callbackRef = useRef(callback);
  const watchingRef = useRef(false);
  const rerender = useRerender();

  callbackRef.current = callback;

  const watch = () => {
    watchingRef.current = true;
    return snapshotRef.current;
  };

  useEffect(() => {
    const updateValue = () => {
      snapshotRef.current = getValue();
      if (watchingRef.current) rerender();
    };

    const onChange = (event: Event) => {
      updateValue();
      callbackRef.current?.(snapshotRef.current, event);
    };

    updateValue();

    if (typeof window === 'undefined') return;

    window.addEventListener('scroll', onChange);
    window.addEventListener('resize', onChange);
    return () => {
      window.removeEventListener('scroll', onChange);
      window.removeEventListener('resize', onChange);
    };
  }, []);

  return { snapshot: snapshotRef.current, scrollTo, watch };
};
```

Update the import paths to match your project setup.

## Usage

```tsx
const { snapshot, scrollTo, watch } = useWindowScroll((value) => console.log(value));
```

## Type Declarations

```tsx
export interface ScrollPosition {
  x: number;
  y: number;
}

export interface UseWindowScrollReturn {
  /** Function to scroll window to a specific position */
  scrollTo: typeof scrollTo;
  /** The latest window scroll position snapshot */
  snapshot: ScrollPosition;
  /** Function to enable subscriptions and rerender on next updates */
  watch: () => ScrollPosition;
}

export type UseWindowScrollCallback = (value: ScrollPosition, event: Event) => void;
```

## API

### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| callback | `(value: ScrollPosition, event: Event) => void` | - | The callback to invoke on window scroll updates |

### Returns

`UseWindowScrollReturn` - An object containing the latest window scroll snapshot, watch function, and scrollTo helper
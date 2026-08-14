---
title: useEventListener
description: Hook that attaches an event listener to the specified target
category: browser
usage: necessary
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1775226876000
---

# useEventListener

Hook that attaches an event listener to the specified target

## Demo

```tsx
import { useEventListener } from '@siberiacancode/reactuse';
import { useState } from 'react';

const VARIANTS = [
  { size: 24, points: 3 },
  { size: 36, points: 2 },
  { size: 52, points: 1 }
];

const PADDING = 16;

const Demo = () => {
  const [target, setTarget] = useState({ x: 100, y: 100, size: 36, points: 2 });
  const [score, setScore] = useState(0);

  const containerRef = useEventListener<HTMLDivElement>('click', (event) => {
    if (!(event.target as HTMLElement).dataset.target) return;

    const container = containerRef.current;
    if (!container) return;

    setScore((value) => value + target.points);

    const rect = container.getBoundingClientRect();
    const next = VARIANTS[Math.floor(Math.random() * VARIANTS.length)];
    const x = PADDING + Math.random() * (rect.width - next.size - PADDING * 2);
    const y = PADDING + Math.random() * (rect.height - next.size - PADDING * 2);

    setTarget({ x, y, ...next });
  });

  return (
    <section className='w-full'>
      <div
        ref={containerRef}
        className='bg-card relative h-[320px] w-full cursor-crosshair overflow-hidden rounded-xl shadow-sm select-none'
      >
        <div className='pointer-events-none absolute top-3 right-3 z-10 flex items-baseline gap-1.5 font-mono tabular-nums'>
          <span className='text-muted-foreground text-[10px] tracking-[0.15em] uppercase'>
            Score
          </span>
          <span className='text-foreground text-sm font-semibold'>
            {String(score).padStart(3, '0')}
          </span>
        </div>

        <div
          style={{
            left: target.x,
            top: target.y,
            width: target.size,
            height: target.size
          }}
          className='bg-foreground absolute rounded-full shadow-lg'
          data-target='true'
        />
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
npx useverse@latest add useEventListener
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useEffect, useRef } from 'react';

import type { HookTarget } from '@/utils/helpers';

import { isTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

import { useRefState } from '../useRefState/useRefState';

/** The use event listener options */
export type UseEventListenerOptions = {
  enabled?: boolean;
} & AddEventListenerOptions;

/** The use event listener return type */
export type UseEventListenerReturn<Target extends Element> = StateRef<Target>;

export interface UseEventListener {
  <Event extends keyof WindowEventMap = keyof WindowEventMap>(
    target: HookTarget,
    event: Event,
    listener: (this: Window, event: WindowEventMap[Event]) => void,
    options?: UseEventListenerOptions
  ): void;

  <Event extends keyof DocumentEventMap = keyof DocumentEventMap>(
    target: HookTarget,
    event: Event,
    listener: (this: Document, event: DocumentEventMap[Event]) => void,
    options?: UseEventListenerOptions
  ): void;

  <Event extends keyof HTMLElementEventMap = keyof HTMLElementEventMap>(
    target: HookTarget,
    event: Event,
    listener: (this: Element, event: HTMLElementEventMap[Event]) => void,
    options?: UseEventListenerOptions
  ): void;

  <Target extends Element, Event extends keyof HTMLElementEventMap = keyof HTMLElementEventMap>(
    event: Event,
    listener: (this: Target, event: HTMLElementEventMap[Event]) => void,
    options?: UseEventListenerOptions,
    target?: never
  ): UseEventListenerReturn<Target>;

  <
    Target extends Element,
    Event extends keyof MediaQueryListEventMap = keyof MediaQueryListEventMap
  >(
    event: Event,
    listener: (this: Target, event: MediaQueryListEventMap[Event]) => void,
    options?: UseEventListenerOptions,
    target?: never
  ): UseEventListenerReturn<Target>;
}

/**
 * @name useEventListener
 * @description - Hook that attaches an event listener to the specified target
 * @category Browser
 * @usage necessary
 *
 * @overload
 * @template Event Key of window event map
 * @template Target The target element
 * @param {HookTarget} target The target element to attach the event listener to
 * @param {Event | Event[]} event An array of event types to listen for
 * @param {(this: Target, event: HTMLElementEventMap[Event]) => void} handler The event handler function
 * @param {UseEventListenerOptions} [options] Options for the event listener
 * @returns {void}
 *
 * @example
 * useEventListener(ref, 'click', () => console.log('click'));
 *
 * @overload
 * @template Event Key of window event map
 * @template Target The target element
 * @param {Event | Event[]} event An array of event types to listen for
 * @param {(this: Target, event: HTMLElementEventMap[Event] | MediaQueryListEventMap[Event]) => void} handler The event handler function
 * @param {UseEventListenerOptions} [options] Options for the event listener
 * @returns {UseEventListenerReturn<Target>} A reference to the target element
 *
 * @example
 * const ref = useEventListener('click', () => console.log('click'));
 */
export const useEventListener = ((...params: any[]) => {
  const target = (isTarget(params[0]) ? params[0] : undefined) as HookTarget | undefined;
  const event = (target ? params[1] : params[0]) as string;
  const listener = (target ? params[2] : params[1]) as (...arg: any[]) => undefined | void;
  const options = (target ? params[3] : params[2]) as UseEventListenerOptions | undefined;

  const enabled = options?.enabled ?? true;

  const internalRef = useRefState();
  const internalListenerRef = useRef(listener);
  internalListenerRef.current = listener;
  const internalOptionsRef = useRef(options);
  internalOptionsRef.current = options;

  useEffect(() => {
    if (!enabled) return;

    const element =
      ((target ? isTarget.getElement(target) : internalRef.current) as Element) ?? window;

    const listener = (event: Event) => internalListenerRef.current(event);

    element.addEventListener(event, listener, options);
    return () => {
      element.removeEventListener(event, listener, options);
    };
  }, [target && isTarget.getRawElement(target), internalRef.state, event, enabled]);

  if (target) return;
  return internalRef;
}) as UseEventListener;
```

Update the import paths to match your project setup.

## Usage

```tsx
useEventListener(ref, 'click', () => console.log('click'));
// or
const ref = useEventListener('click', () => console.log('click'));
```

## Type Declarations

```tsx
import type { HookTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

export type UseEventListenerOptions = {
  enabled?: boolean;
} & AddEventListenerOptions;

export type UseEventListenerReturn<Target extends Element> = StateRef<Target>;

export interface UseEventListener {
  <Event extends keyof WindowEventMap = keyof WindowEventMap>(
    target: HookTarget,
    event: Event,
    listener: (this: Window, event: WindowEventMap[Event]) => void,
    options?: UseEventListenerOptions
  ): void;

  <Event extends keyof DocumentEventMap = keyof DocumentEventMap>(
    target: HookTarget,
    event: Event,
    listener: (this: Document, event: DocumentEventMap[Event]) => void,
    options?: UseEventListenerOptions
  ): void;

  <Event extends keyof HTMLElementEventMap = keyof HTMLElementEventMap>(
    target: HookTarget,
    event: Event,
    listener: (this: Element, event: HTMLElementEventMap[Event]) => void,
    options?: UseEventListenerOptions
  ): void;

  <Target extends Element, Event extends keyof HTMLElementEventMap = keyof HTMLElementEventMap>(
    event: Event,
    listener: (this: Target, event: HTMLElementEventMap[Event]) => void,
    options?: UseEventListenerOptions,
    target?: never
  ): UseEventListenerReturn<Target>;

  <
    Target extends Element,
    Event extends keyof MediaQueryListEventMap = keyof MediaQueryListEventMap
  >(
    event: Event,
    listener: (this: Target, event: MediaQueryListEventMap[Event]) => void,
    options?: UseEventListenerOptions,
    target?: never
  ): UseEventListenerReturn<Target>;
}
```

## API

### Overload 1

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| target | `HookTarget` | - | The target element to attach the event listener to |
| event | `Event \| Event[]` | - | An array of event types to listen for |
| handler | `(this: Target, event: HTMLElementEventMap[Event]) => void` | - | The event handler function |
| options | `UseEventListenerOptions` | - | Options for the event listener |

#### Returns

`void`

### Overload 2

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| event | `Event \| Event[]` | - | An array of event types to listen for |
| handler | `(this: Target, event: HTMLElementEventMap[Event] \| MediaQueryListEventMap[Event]) => void` | - | The event handler function |
| options | `UseEventListenerOptions` | - | Options for the event listener |

#### Returns

`UseEventListenerReturn<Target>` - A reference to the target element
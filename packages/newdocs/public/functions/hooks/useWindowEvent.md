---
title: useWindowEvent
description: Hook attaches an event listener to the window object for the specified event
category: sensors
usage: low
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1779456202000
---

# useWindowEvent

Hook attaches an event listener to the window object for the specified event

## Demo

```tsx
import { useCounter, useWindowEvent } from '@siberiacancode/reactuse';
import { useState } from 'react';

const Demo = () => {
  const coins = useCounter();
  const [pops, setPops] = useState<{ id: number; x: number; y: number }[]>([]);

  useWindowEvent('click', (event) => {
    const target = event.target;

    if (!(target instanceof Element) || !target.closest('[data-frog-target]')) return;

    coins.inc();

    const id = Math.random();
    setPops((current) => [...current, { id, x: event.clientX, y: event.clientY }]);

    setTimeout(() => {
      setPops((current) => current.filter((pop) => pop.id !== id));
    }, 800);
  });

  return (
    <section className='flex flex-col items-center gap-4 p-8 select-none'>
      <span
        data-frog-target
        className='cursor-pointer text-7xl transition-transform duration-100 active:scale-90'
      >
        🐸
      </span>

      <div className='flex flex-col items-center gap-1'>
        <span className='text-foreground font-mono text-5xl font-semibold tabular-nums'>
          {coins.value.toLocaleString()}
        </span>
        <span className='text-muted-foreground text-xs tracking-wider uppercase'>flies caught</span>
      </div>

      {pops.map((pop) => (
        <span
          key={pop.id}
          style={{
            left: pop.x,
            top: pop.y,
            animation: 'froggy-pop 800ms ease-out forwards'
          }}
          className='pointer-events-none fixed z-50 text-2xl'
        >
          🪰
        </span>
      ))}

      <style>{`
        @keyframes froggy-pop {
          0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
          20% { transform: translate(-50%, -60%) scale(1.1); opacity: 1; }
          100% { transform: translate(-50%, -120%) scale(0.9); opacity: 0; }
        }
      `}</style>
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
npx useverse@latest add useWindowEvent
```

### Manual

Copy and paste the following code into your project.

```tsx
import { isTarget } from '@/utils/helpers';

import type { UseEventListenerOptions } from '../useEventListener/useEventListener';

import { useEventListener } from '../useEventListener/useEventListener';

/**
 * @name useWindowEvent
 * @description - Hook attaches an event listener to the window object for the specified event
 * @category Sensors
 * @usage low
 *
 * @template Event Key of window event map.
 * @param {Event} event The event to listen for.
 * @param {(event: WindowEventMap[Event]) => void} listener The callback function to be executed when the event is triggered
 * @param {UseEventListenerOptions} [options] The options for the event listener
 * @returns {void}
 *
 * @example
 * useWindowEvent('click', () => console.log('clicked'));
 */
export const useWindowEvent = <Event extends keyof WindowEventMap>(
  event: Event,
  listener: (this: Window, event: WindowEventMap[Event]) => any,
  options?: UseEventListenerOptions
) =>
  useEventListener(
    isTarget.wrap(() => window),
    event,
    listener,
    options
  );
```

Update the import paths to match your project setup.

## Usage

```tsx
useWindowEvent('click', () => console.log('clicked'));
```

## Type Declarations

```tsx
import type { UseEventListenerOptions } from '../useEventListener/useEventListener';
```

## API

### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| event | `Event` | - | The event to listen for. |
| listener | `(event: WindowEventMap[Event]) => void` | - | The callback function to be executed when the event is triggered |
| options | `UseEventListenerOptions` | - | The options for the event listener |

### Returns

`void`
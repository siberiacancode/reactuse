---
title: useResizeObserver
description: Hook that gives you resize observer state
category: sensors
usage: low
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1781376500000
---

# useResizeObserver

Hook that gives you resize observer state

## Demo

```tsx
import type { PointerEvent } from 'react';

import { useResizeObserver } from '@siberiacancode/reactuse';
import { GripVerticalIcon } from 'lucide-react';
import { useRef, useState } from 'react';

import { cn } from '@/utils/lib';

interface Chat {
  id: string;
  initials: string;
  message: string;
  name: string;
  online?: boolean;
  time: string;
  unread?: number;
}

const CHATS: Chat[] = [
  {
    id: '1',
    name: 'Design Team',
    message: 'Daria: pushed the new icons 🎨',
    time: '23:05',
    initials: 'DT',
    unread: 3,
    online: true
  },
  {
    id: '2',
    name: 'Dmitry Babin',
    message: 'See you at the meeting tomorrow',
    time: '12:03',
    initials: 'AC',
    online: true
  },
  {
    id: '3',
    name: 'reactuse',
    message: 'You: just shipped useResizeObserver',
    time: '11:48',
    initials: 'RU',
    unread: 1
  }
];

const COLLAPSED_WIDTH = 66;
const EXPANDED_MIN = 240;
const EXPANDED_MAX = 420;
const SNAP_POINT = (COLLAPSED_WIDTH + EXPANDED_MIN) / 2;

const getEntryWidth = (entry: ResizeObserverEntry) =>
  entry.borderBoxSize[0]?.inlineSize ?? entry.contentRect.width;

const Demo = () => {
  const [width, setWidth] = useState(340);
  const [expanded, setExpanded] = useState(true);
  const draggingRef = useRef(false);
  const dragRef = useRef({ startWidth: 340, startX: 0 });

  const resizeObserver = useResizeObserver<HTMLDivElement>({
    box: 'border-box',
    onChange: ([entry]) => setExpanded(getEntryWidth(entry) >= EXPANDED_MIN)
  });

  const onPointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    draggingRef.current = true;
    dragRef.current = {
      startWidth: width,
      startX: event.clientX
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    if (!draggingRef.current) return;

    const rawWidth = Math.min(
      EXPANDED_MAX,
      Math.max(COLLAPSED_WIDTH, dragRef.current.startWidth + event.clientX - dragRef.current.startX)
    );

    setWidth(rawWidth < SNAP_POINT ? COLLAPSED_WIDTH : Math.max(EXPANDED_MIN, rawWidth));
  };

  const onPointerUp = (event: PointerEvent<HTMLButtonElement>) => {
    draggingRef.current = false;
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  return (
    <section className='flex flex-col items-center gap-3 p-4'>
      <div className='relative'>
        <div
          ref={resizeObserver.ref}
          className='bg-card no-scrollbar flex flex-col overflow-hidden rounded-2xl'
          style={{ width }}
        >
          {CHATS.map((chat) => (
            <div
              key={chat.id}
              className={cn(
                'hover:bg-muted/50 flex cursor-pointer items-center gap-3 py-2.5 transition-colors',
                expanded ? 'px-3' : 'justify-center px-0'
              )}
            >
              <div className='relative shrink-0'>
                <div data-size='lg' data-slot='avatar'>
                  <span data-slot='avatar-fallback'>{chat.initials}</span>
                </div>
                {chat.online && (
                  <span className='ring-card absolute right-0 bottom-0 size-3 rounded-full bg-green-500 ring-2' />
                )}
                {!expanded && !!chat.unread && (
                  <span className='bg-primary text-primary-foreground absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full text-[10px] font-semibold'>
                    {chat.unread}
                  </span>
                )}
              </div>

              {expanded && (
                <div className='flex min-w-0 flex-1 flex-col'>
                  <div className='flex items-center justify-between gap-2'>
                    <span className='text-foreground truncate text-sm font-medium'>
                      {chat.name}
                    </span>
                    <span className='text-muted-foreground shrink-0 text-xs'>{chat.time}</span>
                  </div>
                  <div className='flex items-center justify-between gap-2'>
                    <span className='text-muted-foreground truncate text-xs'>{chat.message}</span>
                    {!!chat.unread && (
                      <span className='bg-primary text-primary-foreground flex size-4 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold'>
                        {chat.unread}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          aria-label='Resize'
          className='border-border bg-card text-muted-foreground hover:text-foreground absolute top-1/2 -right-3 z-10 flex size-6 -translate-y-1/2 cursor-ew-resize touch-none items-center justify-center rounded-full border shadow-sm select-none'
          data-variant='unstyled'
          type='button'
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
        >
          <GripVerticalIcon className='size-3.5' />
        </button>
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
npx useverse@latest add useResizeObserver
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useEffect, useRef, useState } from 'react';

import type { HookTarget } from '@/utils/helpers';

import { isTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

import { useRefState } from '../useRefState/useRefState';

/** The resize observer callback type */
export type UseResizeObserverCallback = (
  entries: ResizeObserverEntry[],
  observer: ResizeObserver
) => void;

/** The resize observer options type */
export interface UseResizeObserverOptions extends ResizeObserverOptions {
  /** The enabled state of the resize observer */
  enabled?: boolean;
  /** The callback to execute when resize is detected */
  onChange?: UseResizeObserverCallback;
}

/** The resize observer return type */
export interface UseResizeObserverReturn {
  /** The resize observer entries */
  entries?: ResizeObserverEntry[];
  /** The resize observer instance */
  observer?: ResizeObserver;
}

export interface UseResizeObserver {
  <Target extends Element>(
    options?: UseResizeObserverOptions,
    target?: never
  ): UseResizeObserverReturn & { ref: StateRef<Target> };

  (target: HookTarget, options?: UseResizeObserverOptions): UseResizeObserverReturn;

  <Target extends Element>(
    callback: UseResizeObserverCallback,
    target?: never
  ): UseResizeObserverReturn & { ref: StateRef<Target> };

  (target: HookTarget, callback: UseResizeObserverCallback): UseResizeObserverReturn;
}

/**
 * @name useResizeObserver
 * @description - Hook that gives you resize observer state
 * @category Sensors
 * @usage low
 *
 * @browserapi ResizeObserver https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver
 *
 * @overload
 * @param {HookTarget} target The target element to observe
 * @param {boolean} [options.enabled=true] The enabled state of the resize observer
 * @param {ResizeObserverBoxOptions} [options.box] The box model to observe
 * @param {UseResizeObserverCallback} [options.onChange] The callback to execute when resize is detected
 * @returns {UseResizeObserverReturn} An object containing the resize observer state
 *
 * @example
 * const { entries, observer } = useResizeObserver(ref);
 *
 * @overload
 * @template Target The target element
 * @param {boolean} [options.enabled=true] The enabled state of the resize observer
 * @param {ResizeObserverBoxOptions} [options.box] The box model to observe
 * @param {UseResizeObserverCallback} [options.onChange] The callback to execute when resize is detected
 * @returns {UseResizeObserverReturn & { ref: StateRef<Target> }} A React ref to attach to the target element
 *
 * @example
 * const { ref, entries, observer } = useResizeObserver();
 *
 * @overload
 * @template Target The target element
 * @param {UseResizeObserverCallback} callback The callback to execute when resize is detected
 * @returns {UseResizeObserverReturn & { ref: StateRef<Target> }} A React ref to attach to the target element
 *
 * @example
 * const { ref, entries, observer } = useResizeObserver((entries) => console.log(entries));
 *
 * @overload
 * @param {HookTarget} target The target element to observe
 * @param {UseResizeObserverCallback} callback The callback to execute when resize is detected
 * @returns {UseResizeObserverReturn} An object containing the resize observer state
 *
 * @example
 * const { entries, observer } = useResizeObserver(ref, (entries) => console.log(entries));
 */
export const useResizeObserver = ((...params: any[]) => {
  const target = (isTarget(params[0]) ? params[0] : undefined) as HookTarget | undefined;

  const options = (
    target
      ? typeof params[1] === 'object'
        ? params[1]
        : { onChange: params[1] }
      : typeof params[0] === 'object'
        ? params[0]
        : { onChange: params[0] }
  ) as UseResizeObserverOptions | undefined;

  const callback = options?.onChange;
  const enabled = options?.enabled ?? true;

  const [observer, setObserver] = useState<ResizeObserver>();
  const [entries, setEntries] = useState<ResizeObserverEntry[]>();

  const internalRef = useRefState<Element>();
  const internalCallbackRef = useRef(callback);
  internalCallbackRef.current = callback;

  useEffect(() => {
    if (!enabled || (!target && !internalRef.state)) return;

    const element = target ? isTarget.getElement(target) : internalRef.current;
    if (!element) return;

    const observer = new ResizeObserver((entries, observer) => {
      setEntries(entries);
      internalCallbackRef.current?.(entries, observer);
    });

    setObserver(observer);
    observer.observe(element as Element, options);

    return () => {
      observer.disconnect();
    };
  }, [target && isTarget.getRawElement(target), internalRef.state, options?.box, enabled]);

  if (target) return { observer, entries };
  return {
    ref: internalRef,
    observer,
    entries
  };
}) as UseResizeObserver;
```

Update the import paths to match your project setup.

## Usage

```tsx
const { entries, observer } = useResizeObserver(ref);
// or
const { ref, entries, observer } = useResizeObserver();
// or
const { ref, entries, observer } = useResizeObserver((entries) => console.log(entries));
// or
const { entries, observer } = useResizeObserver(ref, (entries) => console.log(entries));
```

## Type Declarations

```tsx
import type { HookTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

export type UseResizeObserverCallback = (
  entries: ResizeObserverEntry[],
  observer: ResizeObserver
) => void;

export interface UseResizeObserverOptions extends ResizeObserverOptions {
  /** The enabled state of the resize observer */
  enabled?: boolean;
  /** The callback to execute when resize is detected */
  onChange?: UseResizeObserverCallback;
}

export interface UseResizeObserverReturn {
  /** The resize observer entries */
  entries?: ResizeObserverEntry[];
  /** The resize observer instance */
  observer?: ResizeObserver;
}

export interface UseResizeObserver {
  <Target extends Element>(
    options?: UseResizeObserverOptions,
    target?: never
  ): UseResizeObserverReturn & { ref: StateRef<Target> };

  (target: HookTarget, options?: UseResizeObserverOptions): UseResizeObserverReturn;

  <Target extends Element>(
    callback: UseResizeObserverCallback,
    target?: never
  ): UseResizeObserverReturn & { ref: StateRef<Target> };

  (target: HookTarget, callback: UseResizeObserverCallback): UseResizeObserverReturn;
}
```

## API

### Overload 1

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| target | `HookTarget` | - | The target element to observe |
| options.enabled | `boolean` | true | The enabled state of the resize observer |
| options.box | `ResizeObserverBoxOptions` | - | The box model to observe |
| options.onChange | `UseResizeObserverCallback` | - | The callback to execute when resize is detected |

#### Returns

`UseResizeObserverReturn` - An object containing the resize observer state

### Overload 2

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| options.enabled | `boolean` | true | The enabled state of the resize observer |
| options.box | `ResizeObserverBoxOptions` | - | The box model to observe |
| options.onChange | `UseResizeObserverCallback` | - | The callback to execute when resize is detected |

#### Returns

`UseResizeObserverReturn & { ref: StateRef<Target> }` - A React ref to attach to the target element

### Overload 3

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| callback | `UseResizeObserverCallback` | - | The callback to execute when resize is detected |

#### Returns

`UseResizeObserverReturn & { ref: StateRef<Target> }` - A React ref to attach to the target element

### Overload 4

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| target | `HookTarget` | - | The target element to observe |
| callback | `UseResizeObserverCallback` | - | The callback to execute when resize is detected |

#### Returns

`UseResizeObserverReturn` - An object containing the resize observer state
---
title: useContextMenu
description: Hook that handles custom context menus on desktop and long press on touch devices
category: elements
usage: low
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1781376500000
---

# useContextMenu

Hook that handles custom context menus on desktop and long press on touch devices

## Demo

```tsx
import { useClickOutside, useContextMenu } from '@siberiacancode/reactuse';
import {
  BookmarkIcon,
  HeartIcon,
  MapPinIcon,
  MessageCircleIcon,
  SendIcon,
  Share2Icon,
  Trash2Icon
} from 'lucide-react';

const Demo = () => {
  const contextMenu = useContextMenu<HTMLDivElement>();
  const menuRef = useClickOutside<HTMLDivElement>(() => contextMenu.close());

  return (
    <section className='flex flex-col items-center p-4'>
      <div
        ref={contextMenu.ref}
        className='bg-card w-full max-w-sm cursor-context-menu overflow-hidden rounded-2xl select-none'
      >
        <div className='flex items-center gap-3 px-4 py-3'>
          <div data-size='lg' data-slot='avatar'>
            <span data-slot='avatar-fallback'>TK</span>
          </div>
          <div className='flex flex-1 flex-col leading-tight'>
            <span className='text-foreground text-sm font-semibold'>reacuse</span>
            <span className='text-muted-foreground flex items-center gap-1 text-xs'>
              <MapPinIcon className='size-3' />
              Tokyo, Japan
            </span>
          </div>
        </div>

        <div className='relative aspect-square'>
          <img alt='Tokyo' className='size-full object-cover' src='/images/tokyo.png' />
        </div>

        <div className='flex items-center gap-4 px-4 pt-3'>
          <HeartIcon className='size-6' />
          <MessageCircleIcon className='size-6' />
          <SendIcon className='size-6' />
          <BookmarkIcon className='ml-auto size-6' />
        </div>

        <div className='flex flex-col gap-1 px-4 py-2'>
          <span className='text-foreground text-sm font-semibold'>284,910 likes</span>
          <p className='text-foreground text-sm'>
            <span className='font-semibold'>reacuse</span> Neon nights in Shibuya 🌃 Currently 18°C
            and clear.
          </p>
          <span className='text-muted-foreground text-xs'>
            9.7M residents · View all 1,204 comments
          </span>
        </div>
      </div>

      {contextMenu.opened && contextMenu.position && (
        <div
          ref={menuRef}
          className='fixed z-50 w-48'
          data-slot='dropdown-menu-content'
          style={{ top: contextMenu.position.y, left: contextMenu.position.x }}
        >
          <div data-slot='dropdown-menu-item'>
            <HeartIcon />
            Like post
          </div>
          <div data-slot='dropdown-menu-item'>
            <BookmarkIcon />
            Save
          </div>
          <div data-slot='dropdown-menu-item'>
            <Share2Icon />
            Share
            <span data-slot='dropdown-menu-shortcut'>⌘S</span>
          </div>
          <div data-slot='dropdown-menu-separator' />
          <div data-slot='dropdown-menu-item' data-variant='destructive'>
            <Trash2Icon />
            Remove
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
npx useverse@latest add useContextMenu
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useEffect, useRef, useState } from 'react';

import type { HookTarget } from '@/utils/helpers';

import { isTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

import { useRefState } from '../useRefState/useRefState';

/** The context menu event type */
export type ContextMenuEvent = MouseEvent | TouchEvent;

/** The context menu position type */
export interface ContextMenuPosition {
  /** The x coordinate of the event */
  x: number;
  /** The y coordinate of the event */
  y: number;
}

/** The context menu callback type */
export type UseContextMenuCallback = (
  position: ContextMenuPosition,
  event: ContextMenuEvent
) => void;

/** The context menu options type */
export interface UseContextMenuOptions {
  /** The long press delay on touch devices in milliseconds */
  delay?: number;
  /** The enabled state of the hook */
  enabled?: boolean;
  /** The callback function to be invoked when the menu opens */
  onOpen?: UseContextMenuCallback;
  /** The callback function to be invoked when the menu closes */
  onClose?: () => void;
  /** The callback function to be invoked when the interaction ends */
  onEnd?: (event: ContextMenuEvent) => void;
  /** The callback function to be invoked when the interaction starts */
  onStart?: (event: ContextMenuEvent) => void;
}

/** The context menu return type */
export interface UseContextMenuReturn {
  /** The context menu opened state */
  opened: boolean;
  /** The context menu position */
  position?: ContextMenuPosition;
  /** Close the context menu */
  close: () => void;
  /** Open the context menu */
  open: (position: ContextMenuPosition, event?: ContextMenuEvent) => void;
}

export interface UseContextMenu {
  (target: HookTarget, callback?: UseContextMenuCallback): UseContextMenuReturn;

  (target: HookTarget, options?: UseContextMenuOptions): UseContextMenuReturn;

  <Target extends Element>(
    callback?: UseContextMenuCallback,
    target?: never
  ): UseContextMenuReturn & { ref: StateRef<Target> };

  <Target extends Element>(
    options?: UseContextMenuOptions,
    target?: never
  ): UseContextMenuReturn & { ref: StateRef<Target> };
}

const DEFAULT_DELAY = 500;

/**
 * @name useContextMenu
 * @description - Hook that handles custom context menus on desktop and long press on touch devices
 * @category Elements
 * @usage low
 *
 * @overload
 * @param {HookTarget} target The target element for context menu handling
 * @param {UseContextMenuCallback} [callback] The callback function to be invoked when the menu opens
 * @returns {UseContextMenuReturn}
 *
 * @example
 * const menu = useContextMenu(ref, (position) => console.log(position));
 *
 * @overload
 * @param {HookTarget} target The target element for context menu handling
 * @param {number} [options.delay=500] The long press delay on touch devices in milliseconds
 * @param {boolean} [options.enabled=true] The enabled state of the hook
 * @param {UseContextMenuCallback} [options.onOpen] The callback function to be invoked when the menu opens
 * @param {() => void} [options.onClose] The callback function to be invoked when the menu closes
 * @param {(event: ContextMenuEvent) => void} [options.onStart] The callback function to be invoked when the interaction starts
 * @param {(event: ContextMenuEvent) => void} [options.onEnd] The callback function to be invoked when the interaction ends
 * @returns {UseContextMenuReturn}
 *
 * @example
 * const menu = useContextMenu(ref, options);
 *
 * @overload
 * @template Target The target element
 * @param {UseContextMenuCallback} [callback] The callback function to be invoked when the menu opens
 * @returns {UseContextMenuReturn & { ref: StateRef<Target> }} A React ref to attach to the target element
 *
 * @example
 * const { ref, opened, position } = useContextMenu((position) => console.log(position));
 *
 * @overload
 * @template Target The target element
 * @param {number} [options.delay=500] The long press delay on touch devices in milliseconds
 * @param {boolean} [options.enabled=true] The enabled state of the hook
 * @param {UseContextMenuCallback} [options.onOpen] The callback function to be invoked when the menu opens
 * @param {() => void} [options.onClose] The callback function to be invoked when the menu closes
 * @param {(event: ContextMenuEvent) => void} [options.onStart] The callback function to be invoked when the interaction starts
 * @param {(event: ContextMenuEvent) => void} [options.onEnd] The callback function to be invoked when the interaction ends
 * @returns {UseContextMenuReturn & { ref: StateRef<Target> }} A React ref to attach to the target element
 *
 * @example
 * const { ref, opened, position } = useContextMenu(options);
 */
export const useContextMenu = ((...params: any[]) => {
  const target = (isTarget(params[0]) ? params[0] : undefined) as HookTarget | undefined;

  const options = (
    target
      ? typeof params[1] === 'object'
        ? params[1]
        : { onOpen: params[1] }
      : typeof params[0] === 'object'
        ? params[0]
        : { onOpen: params[0] }
  ) as UseContextMenuOptions | undefined;

  const enabled = options?.enabled ?? true;

  const [opened, setOpened] = useState(false);
  const [position, setPosition] = useState<ContextMenuPosition>();

  const internalRef = useRefState<Element>();
  const internalOptionsRef = useRef(options);
  internalOptionsRef.current = options;

  const close = () => {
    setOpened(false);
    setPosition(undefined);
    internalOptionsRef.current?.onClose?.();
  };

  const open = (position: ContextMenuPosition, event?: ContextMenuEvent) => {
    setPosition(position);
    setOpened(true);
    if (event) internalOptionsRef.current?.onOpen?.(position, event);
  };

  useEffect(() => {
    if (!enabled || (!target && !internalRef.state)) return;

    const element = (target ? isTarget.getElement(target) : internalRef.current) as Element;
    if (!element) return;

    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    let startX = 0;
    let startY = 0;

    const clear = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = undefined;
      }
    };

    const onContextMenu = (event: Event) => {
      const mouseEvent = event as MouseEvent;
      mouseEvent.preventDefault();
      internalOptionsRef.current?.onStart?.(mouseEvent);
      open({ x: mouseEvent.clientX, y: mouseEvent.clientY }, mouseEvent);
      internalOptionsRef.current?.onEnd?.(mouseEvent);
    };

    const onTouchStart = (event: Event) => {
      const touchEvent = event as TouchEvent;
      const touch = touchEvent.touches[0];
      if (!touch) return;

      startX = touch.clientX;
      startY = touch.clientY;
      internalOptionsRef.current?.onStart?.(touchEvent);

      const delay = internalOptionsRef.current?.delay ?? DEFAULT_DELAY;
      timeoutId = setTimeout(() => {
        timeoutId = undefined;
        open({ x: startX, y: startY }, touchEvent);
      }, delay);
    };

    const onTouchEnd = (event: Event) => {
      clear();
      internalOptionsRef.current?.onEnd?.(event as TouchEvent);
    };

    element.addEventListener('contextmenu', onContextMenu);
    element.addEventListener('touchstart', onTouchStart);
    element.addEventListener('touchend', onTouchEnd);
    element.addEventListener('touchcancel', onTouchEnd);

    return () => {
      clear();
      element.removeEventListener('contextmenu', onContextMenu);
      element.removeEventListener('touchstart', onTouchStart);
      element.removeEventListener('touchend', onTouchEnd);
      element.removeEventListener('touchcancel', onTouchEnd);
    };
  }, [enabled, target && isTarget.getRawElement(target), internalRef.state]);

  if (target)
    return {
      close,
      open,
      opened,
      position
    };
  return {
    ref: internalRef,
    close,
    open,
    opened,
    position
  };
}) as UseContextMenu;
```

Update the import paths to match your project setup.

## Usage

```tsx
const menu = useContextMenu(ref, (position) => console.log(position));
// or
const menu = useContextMenu(ref, options);
// or
const { ref, opened, position } = useContextMenu((position) => console.log(position));
// or
const { ref, opened, position } = useContextMenu(options);
```

## Type Declarations

```tsx
import type { HookTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

export type ContextMenuEvent = MouseEvent | TouchEvent;

export interface ContextMenuPosition {
  /** The x coordinate of the event */
  x: number;
  /** The y coordinate of the event */
  y: number;
}

export type UseContextMenuCallback = (
  position: ContextMenuPosition,
  event: ContextMenuEvent
) => void;

export interface UseContextMenuOptions {
  /** The long press delay on touch devices in milliseconds */
  delay?: number;
  /** The enabled state of the hook */
  enabled?: boolean;
  /** The callback function to be invoked when the menu opens */
  onOpen?: UseContextMenuCallback;
  /** The callback function to be invoked when the menu closes */
  onClose?: () => void;
  /** The callback function to be invoked when the interaction ends */
  onEnd?: (event: ContextMenuEvent) => void;
  /** The callback function to be invoked when the interaction starts */
  onStart?: (event: ContextMenuEvent) => void;
}

export interface UseContextMenuReturn {
  /** The context menu opened state */
  opened: boolean;
  /** The context menu position */
  position?: ContextMenuPosition;
  /** Close the context menu */
  close: () => void;
  /** Open the context menu */
  open: (position: ContextMenuPosition, event?: ContextMenuEvent) => void;
}

export interface UseContextMenu {
  (target: HookTarget, callback?: UseContextMenuCallback): UseContextMenuReturn;

  (target: HookTarget, options?: UseContextMenuOptions): UseContextMenuReturn;

  <Target extends Element>(
    callback?: UseContextMenuCallback,
    target?: never
  ): UseContextMenuReturn & { ref: StateRef<Target> };

  <Target extends Element>(
    options?: UseContextMenuOptions,
    target?: never
  ): UseContextMenuReturn & { ref: StateRef<Target> };
}
```

## API

### Overload 1

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| target | `HookTarget` | - | The target element for context menu handling |
| callback | `UseContextMenuCallback` | - | The callback function to be invoked when the menu opens |

#### Returns

`UseContextMenuReturn`

### Overload 2

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| target | `HookTarget` | - | The target element for context menu handling |
| options.delay | `number` | 500 | The long press delay on touch devices in milliseconds |
| options.enabled | `boolean` | true | The enabled state of the hook |
| options.onOpen | `UseContextMenuCallback` | - | The callback function to be invoked when the menu opens |
| options.onClose | `() => void` | - | The callback function to be invoked when the menu closes |
| options.onStart | `(event: ContextMenuEvent) => void` | - | The callback function to be invoked when the interaction starts |
| options.onEnd | `(event: ContextMenuEvent) => void` | - | The callback function to be invoked when the interaction ends |

#### Returns

`UseContextMenuReturn`

### Overload 3

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| callback | `UseContextMenuCallback` | - | The callback function to be invoked when the menu opens |

#### Returns

`UseContextMenuReturn & { ref: StateRef<Target> }` - A React ref to attach to the target element

### Overload 4

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| options.delay | `number` | 500 | The long press delay on touch devices in milliseconds |
| options.enabled | `boolean` | true | The enabled state of the hook |
| options.onOpen | `UseContextMenuCallback` | - | The callback function to be invoked when the menu opens |
| options.onClose | `() => void` | - | The callback function to be invoked when the menu closes |
| options.onStart | `(event: ContextMenuEvent) => void` | - | The callback function to be invoked when the interaction starts |
| options.onEnd | `(event: ContextMenuEvent) => void` | - | The callback function to be invoked when the interaction ends |

#### Returns

`UseContextMenuReturn & { ref: StateRef<Target> }` - A React ref to attach to the target element
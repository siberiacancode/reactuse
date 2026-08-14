---
title: usePictureInPicture
description: Hook that provides Picture-in-Picture functionality for video elements
category: browser
usage: low
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1781981977000
---

# usePictureInPicture

Hook that provides Picture-in-Picture functionality for video elements

## Demo

```tsx
import { useClickOutside, useDisclosure, usePictureInPicture } from '@siberiacancode/reactuse';
import { FlagIcon, MoreHorizontalIcon, PictureInPicture2Icon, Share2Icon } from 'lucide-react';

const Demo = () => {
  const pictureInPicture = usePictureInPicture();
  const menu = useDisclosure();
  const menuRef = useClickOutside<HTMLDivElement>(() => menu.close());

  const onPictureInPicture = () => {
    menu.close();
    void pictureInPicture.toggle();
  };

  return (
    <section className='flex w-full max-w-md flex-col gap-3 p-4'>
      <div className='border-border relative overflow-hidden rounded-xl border'>
        <video
          controls
          ref={pictureInPicture.ref}
          className='aspect-video w-full'
          src='/videos/waves.mp4'
        />
      </div>

      <h3 className='text-foreground text-sm leading-snug font-semibold'>
        Building open-source React hooks - the reactuse demo reel
      </h3>

      <div className='flex items-center justify-between gap-3'>
        <div className='flex items-center gap-2'>
          <div className='flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-neutral-700 to-neutral-900 text-xs font-semibold text-white'>
            SC
          </div>
          <div className='flex flex-col'>
            <span className='text-foreground text-sm font-medium'>siberiacancode</span>
            <span className='text-muted-foreground text-xs'>12.4K subscribers</span>
          </div>
        </div>

        <div ref={menuRef} className='relative'>
          <button
            aria-label='More'
            className='rounded-full!'
            data-size='icon-sm'
            data-variant='secondary'
            type='button'
            onClick={() => menu.toggle()}
          >
            <MoreHorizontalIcon className='size-4' />
          </button>

          {menu.opened && (
            <div
              className='absolute right-0 bottom-full mb-1.5 w-44'
              data-slot='dropdown-menu-content'
            >
              {pictureInPicture.supported && (
                <div data-slot='dropdown-menu-item' onClick={onPictureInPicture}>
                  <PictureInPicture2Icon />
                  {pictureInPicture.opened ? 'Exit Picture-in-Picture' : 'Picture-in-Picture'}
                </div>
              )}
              <div data-slot='dropdown-menu-item' onClick={menu.close}>
                <Share2Icon />
                Share
              </div>
              <div data-slot='dropdown-menu-item' data-variant='destructive' onClick={menu.close}>
                <FlagIcon />
                Report
              </div>
            </div>
          )}
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
npx useverse@latest add usePictureInPicture
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useEffect, useRef, useState } from 'react';

import type { HookTarget } from '@/utils/helpers';

import { isTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

import { useRefState } from '../useRefState/useRefState';

/** The use picture in picture options type */
export interface UsePictureInPictureOptions {
  /** The callback when Picture-in-Picture mode is entered */
  onEnter?: () => void;
  /** The callback when Picture-in-Picture mode is exited */
  onExit?: () => void;
}

/** The use picture in picture return type */
export interface UsePictureInPictureReturn {
  /** Whether Picture-in-Picture mode is currently active */
  opened: boolean;
  /** Whether Picture-in-Picture mode is supported by the browser */
  supported: boolean;
  /** Request to enter Picture-in-Picture mode */
  enter: () => Promise<void>;
  /** Request to exit Picture-in-Picture mode */
  exit: () => Promise<void>;
  /** Toggle Picture-in-Picture mode */
  toggle: () => Promise<void>;
}

export interface UsePictureInPicture {
  (target: HookTarget, options?: UsePictureInPictureOptions): UsePictureInPictureReturn;

  (options?: UsePictureInPictureOptions): UsePictureInPictureReturn & {
    ref: StateRef<HTMLVideoElement>;
  };
}

/**
 * @name usePictureInPicture
 * @description - Hook that provides Picture-in-Picture functionality for video elements
 * @category Browser
 * @usage low
 *
 * @browserapi window.PictureInPicture https://developer.mozilla.org/en-US/docs/Web/API/Picture-in-Picture_API
 *
 * @overload
 * @param {HookTarget} target The target video element
 * @param {() => void} [options.onEnter] Callback when Picture-in-Picture mode is entered
 * @param {() => void} [options.onExit] Callback when Picture-in-Picture mode is exited
 * @returns {UsePictureInPictureReturn} An object containing Picture-in-Picture state and controls
 *
 * @example
 * const { open, supported, enter, exit, toggle } = usePictureInPicture(videoRef);
 *
 * @overload
 * @param {() => void} [options.onEnter] Callback when Picture-in-Picture mode is entered
 * @param {() => void} [options.onExit] Callback when Picture-in-Picture mode is exited
 * @returns {UsePictureInPictureReturn & { ref: StateRef<HTMLVideoElement> }} An object containing Picture-in-Picture state, controls and ref
 *
 * @example
 * const { ref, open, supported, enter, exit, toggle } = usePictureInPicture();
 */
export const usePictureInPicture = ((...params: any[]) => {
  const supported =
    typeof document !== 'undefined' &&
    'pictureInPictureEnabled' in document &&
    !!document.pictureInPictureEnabled &&
    'exitPictureInPicture' in document &&
    !!document.exitPictureInPicture;

  const target = (isTarget(params[0]) ? params[0] : undefined) as HookTarget | undefined;
  const options = ((target ? params[1] : params[0]) as UsePictureInPictureOptions) ?? {};

  const [opened, setOpened] = useState(false);

  const internalRef = useRefState<HTMLVideoElement>();
  const elementRef = useRef<HTMLVideoElement>(null);
  const onOptionsRef = useRef<UsePictureInPictureOptions>(options);
  onOptionsRef.current = options;

  const enter = async () => {
    if (!supported) return;

    if (!elementRef.current) return;

    await elementRef.current.requestPictureInPicture();
    setOpened(true);

    options.onEnter?.();
  };

  const exit = async () => {
    if (!supported) return;

    await document.exitPictureInPicture();
    setOpened(false);
    options.onExit?.();
  };

  useEffect(() => {
    const element = target
      ? (isTarget.getElement(target) as HTMLVideoElement)
      : internalRef.current;
    if (!element) return;

    elementRef.current = element;

    const onEnterPictureInPicture = () => {
      setOpened(true);
      onOptionsRef.current.onEnter?.();
    };

    const onLeavePictureInPicture = () => {
      setOpened(false);
      onOptionsRef.current.onExit?.();
    };

    element.addEventListener('enterpictureinpicture', onEnterPictureInPicture);
    element.addEventListener('leavepictureinpicture', onLeavePictureInPicture);

    return () => {
      element.removeEventListener('enterpictureinpicture', onEnterPictureInPicture);
      element.removeEventListener('leavepictureinpicture', onLeavePictureInPicture);
    };
  }, [target && isTarget.getRawElement(target), internalRef.state]);

  const toggle = async () => {
    if (opened) await exit();
    else await enter();
  };

  const value = {
    opened,
    supported,
    enter,
    exit,
    toggle
  };

  if (target) return value;
  return { ...value, ref: internalRef };
}) as UsePictureInPicture;
```

Update the import paths to match your project setup.

## Usage

```tsx
const { open, supported, enter, exit, toggle } = usePictureInPicture(videoRef);
// or
const { ref, open, supported, enter, exit, toggle } = usePictureInPicture();
```

## Type Declarations

```tsx
import type { HookTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

export interface UsePictureInPictureOptions {
  /** The callback when Picture-in-Picture mode is entered */
  onEnter?: () => void;
  /** The callback when Picture-in-Picture mode is exited */
  onExit?: () => void;
}

export interface UsePictureInPictureReturn {
  /** Whether Picture-in-Picture mode is currently active */
  opened: boolean;
  /** Whether Picture-in-Picture mode is supported by the browser */
  supported: boolean;
  /** Request to enter Picture-in-Picture mode */
  enter: () => Promise<void>;
  /** Request to exit Picture-in-Picture mode */
  exit: () => Promise<void>;
  /** Toggle Picture-in-Picture mode */
  toggle: () => Promise<void>;
}

export interface UsePictureInPicture {
  (target: HookTarget, options?: UsePictureInPictureOptions): UsePictureInPictureReturn;

  (options?: UsePictureInPictureOptions): UsePictureInPictureReturn & {
    ref: StateRef<HTMLVideoElement>;
  };
}
```

## API

### Overload 1

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| target | `HookTarget` | - | The target video element |
| options.onEnter | `() => void` | - | Callback when Picture-in-Picture mode is entered |
| options.onExit | `() => void` | - | Callback when Picture-in-Picture mode is exited |

#### Returns

`UsePictureInPictureReturn` - An object containing Picture-in-Picture state and controls

### Overload 2

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| options.onEnter | `() => void` | - | Callback when Picture-in-Picture mode is entered |
| options.onExit | `() => void` | - | Callback when Picture-in-Picture mode is exited |

#### Returns

`UsePictureInPictureReturn & { ref: StateRef<HTMLVideoElement> }` - An object containing Picture-in-Picture state, controls and ref
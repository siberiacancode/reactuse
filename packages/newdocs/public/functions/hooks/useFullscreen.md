---
title: useFullscreen
description: Hook to handle fullscreen events
category: browser
usage: low
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1779823596000
---

# useFullscreen

Hook to handle fullscreen events

## Demo

```tsx
import { useFullscreen, useMediaControls } from '@siberiacancode/reactuse';
import { MaximizeIcon, PauseIcon, PlayIcon, Volume2Icon, VolumeXIcon } from 'lucide-react';

const VOLUME = 0.1;

const Demo = () => {
  const fullscreen = useFullscreen<HTMLDivElement>();
  const media = useMediaControls<HTMLVideoElement>('/videos/waves.mp4');

  const onMute = () => {
    if (media.muted) {
      media.unmute();
      media.changeVolume(VOLUME);
      return;
    }
    media.mute();
  };

  return (
    <section className='flex w-full max-w-md flex-col p-4'>
      <div
        ref={fullscreen.ref}
        className='border-border group relative overflow-hidden rounded-xl border bg-black'
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          ref={media.ref}
          className='aspect-video w-full bg-black object-cover'
          preload='metadata'
        />

        <div className='pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100' />

        <div className='absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 p-3 opacity-0 transition-opacity group-hover:opacity-100'>
          <div className='flex items-center gap-1'>
            <button
              aria-label={media.playing ? 'Pause' : 'Play'}
              className='bg-white/15 text-white backdrop-blur-md hover:bg-white/25'
              data-size='icon-sm'
              data-variant='unstyled'
              type='button'
              onClick={() => media.toggle()}
            >
              {media.playing ? (
                <PauseIcon className='size-3.5' />
              ) : (
                <PlayIcon className='size-3.5' />
              )}
            </button>
            <button
              aria-label={media.muted ? 'Unmute' : 'Mute'}
              className='bg-white/15 text-white backdrop-blur-md hover:bg-white/25'
              data-size='icon-sm'
              data-variant='unstyled'
              type='button'
              onClick={onMute}
            >
              {media.muted ? (
                <VolumeXIcon className='size-3.5' />
              ) : (
                <Volume2Icon className='size-3.5' />
              )}
            </button>
          </div>

          <button
            aria-label={fullscreen.value ? 'Exit fullscreen' : 'Enter fullscreen'}
            className='bg-white/15 text-white backdrop-blur-md hover:bg-white/25'
            data-size='icon-sm'
            data-variant='unstyled'
            type='button'
            onClick={fullscreen.toggle}
          >
            <MaximizeIcon className='size-3.5' />
          </button>
        </div>
      </div>

      <div className='mt-3 flex flex-col gap-0.5'>
        <h2 className='text-foreground text-sm font-semibold'>Ocean waves at sunset</h2>
        <p className='text-muted-foreground text-xs'>
          A calm, slow-motion clip of waves rolling in over the open sea.
        </p>
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
npx useverse@latest add useFullscreen
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useEffect, useRef, useState } from 'react';

import type { HookTarget } from '@/utils/helpers';

import { isTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

import { useRefState } from '../useRefState/useRefState';

/** The use fullscreen options type */
export interface UseFullScreenOptions {
  /** initial value */
  initialValue?: boolean;
  /** on enter fullscreen */
  onEnter?: () => void;
  /** on exit fullscreen */
  onExit?: () => void;
}

/** The use fullscreen return type */
export interface UseFullScreenReturn {
  /** The fullscreen state */
  value: boolean;
  /** The fullscreen enter method */
  enter: () => void;
  /** The fullscreen exit method */
  exit: () => void;
  /** The fullscreen toggle method */
  toggle: () => void;
}

export interface UseFullScreen {
  (target: HookTarget, options?: UseFullScreenOptions): UseFullScreenReturn;

  <Target extends Element>(
    options?: UseFullScreenOptions,
    target?: never
  ): UseFullScreenReturn & { ref: StateRef<Target> };
}

/**
 * @name useFullscreen
 * @description - Hook to handle fullscreen events
 * @category Browser
 * @usage low
 *
 * @browserapi Fullscreen API https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API
 *
 * @overload
 * @param {HookTarget} target The target element for fullscreen
 * @param {boolean} [options.initialValue=false] initial value of fullscreen
 * @param {() => void} [options.onEnter] on enter fullscreen
 * @param {() => void} [options.onExit] on exit fullscreen
 * @returns {UseFullScreenReturn} An object with the fullscreen state and methods
 *
 * @example
 * const { enter, exit, toggle, value } = useFullscreen(ref);
 *
 * @overload
 * @template Target The target element for fullscreen
 * @param {boolean} [options.initialValue=false] initial value of fullscreen
 * @param {() => void} [options.onEnter] on enter fullscreen
 * @param {() => void} [options.onExit] on exit fullscreen
 * @returns {UseFullScreenReturn & { ref: RefObject<Target> }} An object with the fullscreen state and methods
 *
 * @example
 * const { ref, enter, exit, toggle, value } = useFullscreen();
 */
export const useFullscreen = ((...params: any[]) => {
  const target = (isTarget(params[0]) ? params[0] : undefined) as HookTarget | undefined;
  const options = (target ? params[1] : params[0]) as UseFullScreenOptions | undefined;

  const [value, setValue] = useState(options?.initialValue ?? false);
  const internalRef = useRefState<Element>();
  const elementRef = useRef<Element>(null);
  const optionsRef = useRef<UseFullScreenOptions | undefined>(options);
  optionsRef.current = options;

  const enter = () => {
    const element = elementRef.current;
    if (!element) return;
    element.requestFullscreen();
  };

  const exit = () => {
    if (!document.fullscreenElement) return;
    document.exitFullscreen();
  };

  const toggle = () => {
    if (value) return exit();
    enter();
  };

  useEffect(() => {
    const element = (target ? isTarget.getElement(target) : internalRef.current) as Element;
    if (!element) return;

    elementRef.current = element;

    const onChange = () => {
      const active = document.fullscreenElement === elementRef.current;

      setValue((currentValue) => {
        if (!currentValue && active) optionsRef.current?.onEnter?.();
        if (currentValue && !active) optionsRef.current?.onExit?.();
        return active;
      });
    };

    document.addEventListener('fullscreenchange', onChange);

    return () => document.removeEventListener('fullscreenchange', onChange);
  }, [target && isTarget.getRawElement(target), internalRef.state]);

  if (target) return { enter, exit, toggle, value };
  return { ref: internalRef, enter, exit, toggle, value };
}) as UseFullScreen;
```

Update the import paths to match your project setup.

## Usage

```tsx
const { enter, exit, toggle, value } = useFullscreen(ref);
// or
const { ref, enter, exit, toggle, value } = useFullscreen();
```

## Type Declarations

```tsx
import type { HookTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

export interface UseFullScreenOptions {
  /** initial value */
  initialValue?: boolean;
  /** on enter fullscreen */
  onEnter?: () => void;
  /** on exit fullscreen */
  onExit?: () => void;
}

export interface UseFullScreenReturn {
  /** The fullscreen state */
  value: boolean;
  /** The fullscreen enter method */
  enter: () => void;
  /** The fullscreen exit method */
  exit: () => void;
  /** The fullscreen toggle method */
  toggle: () => void;
}

export interface UseFullScreen {
  (target: HookTarget, options?: UseFullScreenOptions): UseFullScreenReturn;

  <Target extends Element>(
    options?: UseFullScreenOptions,
    target?: never
  ): UseFullScreenReturn & { ref: StateRef<Target> };
}
```

## API

### Overload 1

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| target | `HookTarget` | - | The target element for fullscreen |
| options.initialValue | `boolean` | false | initial value of fullscreen |
| options.onEnter | `() => void` | - | on enter fullscreen |
| options.onExit | `() => void` | - | on exit fullscreen |

#### Returns

`UseFullScreenReturn` - An object with the fullscreen state and methods

### Overload 2

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| options.initialValue | `boolean` | false | initial value of fullscreen |
| options.onEnter | `() => void` | - | on enter fullscreen |
| options.onExit | `() => void` | - | on exit fullscreen |

#### Returns

`UseFullScreenReturn & { ref: RefObject<Target> }` - An object with the fullscreen state and methods
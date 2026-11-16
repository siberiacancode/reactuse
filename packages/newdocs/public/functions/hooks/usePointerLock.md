---
title: usePointerLock
description: Hook that provides reactive pointer lock
category: browser
usage: low
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1781981977000
---

# usePointerLock

Hook that provides reactive pointer lock

## Demo

```tsx
import type { CSSProperties } from 'react';

import { useEventListener, usePointerLock } from '@siberiacancode/reactuse';
import { useRef } from 'react';

import { cn } from '@/utils/lib';

const getSideStyles = (index: number) =>
  ({
    '--i': index,
    transform: 'rotateY(calc(90deg * var(--i))) translateZ(50px)'
  }) as CSSProperties;

const getBaseStyles = (index: number) =>
  ({
    '--i': index,
    transform: 'rotateX(calc(90deg * var(--i))) translateZ(50px)'
  }) as CSSProperties;

const face = 'backface-hidden absolute top-0 left-0 h-full w-full border-2 border-black bg-white';

const Demo = () => {
  const pointerLock = usePointerLock();
  const positionRef = useRef({ x: 0, y: -45 });

  useEventListener(
    'mousemove',
    (event) => {
      if (!pointerLock.element) return;
      const cube = pointerLock.element as HTMLElement;
      positionRef.current.x -= event.movementY / 2;
      positionRef.current.y += event.movementX / 2;
      cube.style.transform = `rotateY(calc(${positionRef.current.y} * 1deg)) rotateX(calc(${positionRef.current.x} * 1deg))`;
    },
    { passive: true }
  );

  if (!pointerLock.supported)
    return (
      <p>
        Api not supported, make sure to check for compatibility with different browsers when using
        this{' '}
        <a
          href='https://developer.mozilla.org/en-US/docs/Web/API/Pointer_Lock_API'
          rel='noreferrer'
          target='_blank'
        >
          api
        </a>
      </p>
    );

  return (
    <section className='flex flex-col items-center gap-6 p-6 select-none'>
      <div className='flex h-40 items-center justify-center perspective-normal'>
        <div
          className='relative size-[100px] cursor-grab transform-3d active:cursor-grabbing'
          style={{ transform: 'rotateY(calc(-45 * 1deg))' }}
          onMouseDownCapture={pointerLock.lock}
          onMouseUpCapture={pointerLock.unlock}
        >
          <div className={face} style={getBaseStyles(1)} />
          <div className={face} style={getBaseStyles(-1)} />
          <div
            className={cn(face, 'flex items-center justify-center text-sm font-medium text-black')}
            style={getSideStyles(0)}
          >
            move me
          </div>
          <div className={face} style={getSideStyles(1)} />
          <div className={face} style={getSideStyles(2)} />
          <div className={face} style={getSideStyles(3)} />
        </div>
      </div>

      <p className='text-muted-foreground text-center text-sm'>
        Press and hold the cube, then move your mouse to rotate it in 3D.
      </p>
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
npx useverse@latest add usePointerLock
```

### Manual

Copy and paste the following code into your project.

```tsx
import type { MouseEvent } from 'react';

import { useEffect, useState } from 'react';

/** The use pointer lock return type */
interface UsePointerLockReturn {
  /** The pointer lock element */
  element?: Element;
  /** Whether the pointer lock is supported */
  supported: boolean;
  /** Lock the pointer lock */
  lock: (event: MouseEvent) => void;
  /** Unlock the pointer lock */
  unlock: () => boolean;
}

/**
 * @name usePointerLock
 * @description - Hook that provides reactive pointer lock
 * @category Browser
 * @usage low
 *
 * @browserapi pointerLockElement https://developer.mozilla.org/en-US/docs/Web/API/Document/pointerLockElement
 *
 * @returns {UsePointerLockReturn} An object containing the pointer lock element and functions to interact with the pointer lock
 *
 * @example
 * const { supported, lock, unlock, element } = usePointerLock();
 */
export const usePointerLock = (): UsePointerLockReturn => {
  const supported =
    typeof document !== 'undefined' &&
    'pointerLockElement' in document &&
    'exitPointerLock' in document &&
    !!document.exitPointerLock;
  const [element, setElement] = useState<Element>();

  useEffect(() => {
    if (!supported) return;

    const onPointerLockChange = () => {
      if (!supported) return;

      const currentElement = document.pointerLockElement ?? element;

      if (currentElement && currentElement === element) {
        setElement(document.pointerLockElement as Element);
      }
    };
    const onPointerLockError = () => {
      if (!supported) return;

      const currentElement = document.pointerLockElement ?? element;

      if (currentElement && currentElement === element) {
        const action = document.pointerLockElement ? 'release' : 'acquire';

        throw new Error(`Failed to ${action} pointer lock.`);
      }
    };

    document.addEventListener('pointerlockchange', onPointerLockChange);
    document.addEventListener('pointerlockerror', onPointerLockError);

    return () => {
      document.removeEventListener('pointerlockchange', onPointerLockChange);
      document.removeEventListener('pointerlockerror', onPointerLockError);
    };
  }, []);

  const lock = (event: MouseEvent) => {
    if (!supported) return false;

    if (!(event.currentTarget instanceof Element)) return false;

    event.currentTarget.requestPointerLock();

    setElement(event.currentTarget);
    return true;
  };

  const unlock = () => {
    if (!supported) return false;

    if (!element) return false;

    document.exitPointerLock();
    setElement(undefined);

    return true;
  };

  return {
    supported,
    element,
    lock,
    unlock
  };
};
```

Update the import paths to match your project setup.

## Usage

```tsx
const { supported, lock, unlock, element } = usePointerLock();
```

## Type Declarations

```tsx
import type { MouseEvent } from 'react';

interface UsePointerLockReturn {
  /** The pointer lock element */
  element?: Element;
  /** Whether the pointer lock is supported */
  supported: boolean;
  /** Lock the pointer lock */
  lock: (event: MouseEvent) => void;
  /** Unlock the pointer lock */
  unlock: () => boolean;
}
```

## API

### Returns

`UsePointerLockReturn` - An object containing the pointer lock element and functions to interact with the pointer lock
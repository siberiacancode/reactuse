---
title: useDocumentVisibility
description: Hook that provides the current visibility state of the document
category: browser
usage: low
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1779453143000
---

# useDocumentVisibility

Hook that provides the current visibility state of the document

## Demo

```tsx
import { useDocumentVisibility, useInterval } from '@siberiacancode/reactuse';
import { PauseIcon, PlayIcon, RotateCcwIcon } from 'lucide-react';
import { useState } from 'react';

const SESSION_DURATION = 25 * 60;

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remaining).padStart(2, '0')}`;
};

const Demo = () => {
  const [secondsLeft, setSecondsLeft] = useState(SESSION_DURATION);
  const interval = useInterval(() => setSecondsLeft((value) => Math.max(0, value - 1)), 1000, {
    immediately: false
  });

  const documentVisibility = useDocumentVisibility((documentVisibility) => {
    if (documentVisibility === 'hidden') {
      interval.pause();
    }
  });

  const finished = secondsLeft === 0;
  const ticking = interval.active && !finished && documentVisibility === 'visible';

  const onToggle = () => {
    if (finished) return;
    interval.toggle();
  };

  const onReset = () => {
    interval.pause();
    setSecondsLeft(SESSION_DURATION);
  };

  return (
    <section className='flex flex-col items-center gap-3 p-8'>
      <div className='flex items-center gap-4'>
        <span className='text-3xl'>🍅</span>

        <span className='text-foreground font-mono text-3xl font-semibold tabular-nums'>
          {formatTime(secondsLeft)}
        </span>

        <div className='flex items-center gap-2'>
          <button data-variant='secondary' type='button' onClick={onReset}>
            <RotateCcwIcon className='size-4' />
          </button>
          <button data-variant='default' type='button' onClick={onToggle}>
            {ticking ? <PauseIcon className='size-4' /> : <PlayIcon className='size-4' />}
            {ticking ? 'Pause' : finished ? 'Done' : 'Start'}
          </button>
        </div>
      </div>

      <p className='text-muted-foreground text-xs'>Pauses automatically when you switch tabs</p>
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
npx useverse@latest add useDocumentVisibility
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useRef, useSyncExternalStore } from 'react';

const getSnapshot = () => document.visibilityState;
const getServerSnapshot = () => 'hidden' as const;

/**
 * @name useDocumentVisibility
 * @description – Hook that provides the current visibility state of the document
 * @category Browser
 * @usage low
 *
 * @param {(state: DocumentVisibilityState) => void} [callback] The callback to execute when the visibility state changes
 * @returns {DocumentVisibilityState} The current visibility state of the document, which can be 'visible' or 'hidden'
 *
 * @example
 * const visibilityState = useDocumentVisibility();
 *
 * @example
 * const visibilityState = useDocumentVisibility((state) => {
 *   if (state === 'hidden') console.log('user left the tab');
 * });
 */
export const useDocumentVisibility = (callback?: (state: DocumentVisibilityState) => void) => {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  const subscribe = (onStoreChange: () => void) => {
    const handler = () => {
      callbackRef.current?.(document.visibilityState);
      onStoreChange();
    };
    document.addEventListener('visibilitychange', handler);
    return () => {
      document.removeEventListener('visibilitychange', handler);
    };
  };

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
};
```

Update the import paths to match your project setup.

## Usage

```tsx
const visibilityState = useDocumentVisibility();
// or
const visibilityState = useDocumentVisibility((state) => { if (state === 'hidden') console.log('user left the tab'); });
```

## API

### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| callback | `(state: DocumentVisibilityState) => void` | - | The callback to execute when the visibility state changes |

### Returns

`DocumentVisibilityState` - The current visibility state of the document, which can be 'visible' or 'hidden'
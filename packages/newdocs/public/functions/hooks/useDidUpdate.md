---
title: useDidUpdate
description: Hook that triggers the effect callback on updates
category: lifecycle
usage: necessary
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1768590847000
---

# useDidUpdate

Hook that triggers the effect callback on updates

## Demo

```tsx
import { useDidUpdate } from '@siberiacancode/reactuse';
import { CheckIcon, LoaderIcon } from 'lucide-react';
import { useState } from 'react';

type SaveStatus = 'idle' | 'saved' | 'saving';

const Demo = () => {
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<SaveStatus>('idle');

  useDidUpdate(() => {
    setStatus('saving');

    const timeout = setTimeout(() => {
      setStatus('saved');
    }, 600);

    return () => clearTimeout(timeout);
  }, [content]);

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  return (
    <section className='flex w-full max-w-md min-w-0 flex-col gap-2'>
      <textarea
        className='border-border bg-card text-foreground placeholder:text-muted-foreground w-full resize-none overflow-hidden rounded-lg border p-3 text-sm outline-none'
        placeholder='Start typing...'
        rows={10}
        value={content}
        onChange={(event) => setContent(event.target.value)}
      />

      <div className='flex flex-wrap items-center justify-between gap-2'>
        {status === 'idle' && <span className='text-muted-foreground text-xs'>Not saved yet</span>}

        {status === 'saving' && (
          <span className='text-muted-foreground flex items-center gap-1.5 text-xs'>
            <LoaderIcon className='size-3 animate-spin' />
            Saving...
          </span>
        )}

        {status === 'saved' && (
          <span className='flex items-center gap-1.5 text-xs text-green-600 dark:text-green-500'>
            <CheckIcon className='size-3' />
            Saved
          </span>
        )}

        <span className='text-muted-foreground text-xs tabular-nums'>
          {wordCount} {wordCount === 1 ? 'word' : 'words'} · {content.length} chars
        </span>
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
npx useverse@latest add useDidUpdate
```

### Manual

Copy and paste the following code into your project.

```tsx
import type { DependencyList, EffectCallback } from 'react';

import { useRef } from 'react';

import { useIsomorphicLayoutEffect } from '../useIsomorphicLayoutEffect/useIsomorphicLayoutEffect';

/**
 * @name useDidUpdate
 * @description – Hook that triggers the effect callback on updates
 * @category Lifecycle
 * @usage necessary

 * @param {EffectCallback} effect The effect callback
 * @param {DependencyList} [deps] The dependencies list for the effect
 *
 * @example
 * useDidUpdate(() => console.log("effect runs on updates"), deps);
 */
export const useDidUpdate = (effect: EffectCallback, deps?: DependencyList) => {
  const mountedRef = useRef(false);

  useIsomorphicLayoutEffect(
    () => () => {
      mountedRef.current = false;
    },
    []
  );

  useIsomorphicLayoutEffect(() => {
    if (mountedRef.current) {
      return effect();
    }

    mountedRef.current = true;
    return undefined;
  }, deps);
};
```

Update the import paths to match your project setup.

## Usage

```tsx
useDidUpdate(() => console.log("effect runs on updates"), deps);
```

## Type Declarations

```tsx
import type { DependencyList, EffectCallback } from 'react';
```

## API

### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| effect | `EffectCallback` | - | The effect callback |
| deps | `DependencyList` | - | The dependencies list for the effect |
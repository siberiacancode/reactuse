---
title: useLogger
description: Hook for debugging lifecycle
category: debug
usage: low
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1754977987000
---

# useLogger

Hook for debugging lifecycle

## Demo

```tsx
import {
  useAutoScroll,
  useCounter,
  useDidUpdate,
  useLogger,
  useMount
} from '@siberiacancode/reactuse';
import { useState } from 'react';

import { cn } from '@/utils/lib';

interface LogEntry {
  count: number;
  id: string;
  timestamp: number;
  type: 'mount' | 'update';
}

const formatTime = (timestamp: number) => {
  const date = new Date(timestamp);
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
};

const TYPE_COLOR = {
  mount: 'text-green-600 dark:text-green-500',
  update: 'text-blue-600 dark:text-blue-400'
} as const;

const Demo = () => {
  const counter = useCounter(0);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const scrollRef = useAutoScroll<HTMLDivElement>();

  useLogger('Counter', [counter.value]);

  useMount(() => {
    setLogs((current) => [
      ...current,
      { id: crypto.randomUUID(), type: 'mount', count: counter.value, timestamp: Date.now() }
    ]);
  });

  useDidUpdate(() => {
    setLogs((current) => [
      ...current,
      { id: crypto.randomUUID(), type: 'update', count: counter.value, timestamp: Date.now() }
    ]);
  }, [counter.value]);

  return (
    <section className='bg-card flex w-full max-w-md flex-col gap-3 rounded-lg p-4'>
      <div className='flex h-[220px] flex-col'>
        <div className='flex items-center justify-between'>
          <span className='text-foreground text-[10px] font-semibold tracking-wider uppercase'>
            Console
          </span>
          <div className='flex items-center gap-1'>
            <button data-size='sm' data-variant='ghost' type='button' onClick={() => counter.inc()}>
              Log
            </button>
            <button
              data-size='sm'
              data-variant='ghost'
              disabled={!logs.length}
              type='button'
              onClick={() => setLogs([])}
            >
              Clear
            </button>
          </div>
        </div>

        <div ref={scrollRef} className='no-scrollbar flex-1 overflow-y-auto'>
          {logs.map((entry) => (
            <div
              key={entry.id}
              className='animate-in fade-in flex items-center gap-2 py-1 font-mono text-[10px]'
            >
              <span className='text-muted-foreground tabular-nums'>
                {formatTime(entry.timestamp)}
              </span>
              <span
                className={cn('font-semibold tracking-wider uppercase', TYPE_COLOR[entry.type])}
              >
                {entry.type}
              </span>
              <span className='text-foreground'>[{entry.count}]</span>
            </div>
          ))}
        </div>
      </div>

      <span className='text-muted-foreground px-1 text-[10px]'>
        These logs are also printed to your browser console.
      </span>
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
npx useverse@latest add useLogger
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useEffect } from 'react';

import { useDidUpdate } from '../useDidUpdate/useDidUpdate';

/**
 * @name useLogger
 * @description - Hook for debugging lifecycle
 * @category Debug
 * @usage low
 *
 * @param {string} name The name or identifier for the logger
 * @param {unknown[]} params Additional arguments to be logged
 *
 * @example
 * useLogger('Component', [1, 2, 3]);
 */
export const useLogger = (name: string, params: unknown[]) => {
  useEffect(() => {
    console.log(`${name} mounted`, ...params);
    return () => console.log(`${name} unmounted`);
  }, []);

  useDidUpdate(() => {
    console.log(`${name} updated`, ...params);
  }, params);
};
```

Update the import paths to match your project setup.

## Usage

```tsx
useLogger('Component', [1, 2, 3]);
```

## API

### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| name | `string` | - | The name or identifier for the logger |
| params | `unknown[]` | - | Additional arguments to be logged |
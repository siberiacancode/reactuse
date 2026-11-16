---
title: useWebWorkerCallback
description: Hook that runs a callback in a web worker without a separate worker file
category: browser
usage: low
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1784301938000
---

# useWebWorkerCallback

Hook that runs a callback in a web worker without a separate worker file

## Demo

```tsx
import { useBoolean, useTime, useWebWorkerCallback } from '@siberiacancode/reactuse';
import { CpuIcon } from 'lucide-react';
import { useState } from 'react';

import { cn } from '@/utils/lib';

const heavyTask = () => {
  const numbers = Array.from({ length: 5_000_000 }, () => Math.trunc(Math.random() * 500_000));
  numbers.sort((a, b) => a - b);
  return numbers.slice(0, 5);
};

const Demo = () => {
  const [result, setResult] = useState<number[]>();
  const [thread, setThread] = useState<'main' | 'worker'>();
  const [blocking, toggleBlocking] = useBoolean();

  const time = useTime();
  const worker = useWebWorkerCallback(heavyTask);

  const runMain = () => {
    setResult(undefined);
    setThread('main');
    toggleBlocking(true);

    requestAnimationFrame(() => {
      setResult(heavyTask());
      toggleBlocking(false);
    });
  };

  const runWorker = async () => {
    setResult(undefined);
    setThread('worker');
    setResult(await worker.run());
  };

  const clock = [time.hours, time.minutes, time.seconds]
    .map((value) => String(value).padStart(2, '0'))
    .join(':');

  const running = blocking || worker.pending;

  return (
    <section className='flex w-full max-w-sm flex-col p-4'>
      <div className='bg-card flex flex-col gap-4 rounded-xl p-5 shadow-sm'>
        <div className='flex items-start gap-3'>
          <div className='bg-primary/15 text-primary flex size-10 shrink-0 items-center justify-center rounded-full'>
            <CpuIcon className='size-5' />
          </div>

          <div className='flex min-w-0 flex-1 flex-col gap-1 leading-tight'>
            <span className='text-foreground text-sm font-semibold'>Sorting 5M numbers</span>
            <span className='text-muted-foreground text-xs leading-relaxed'>
              The clock keeps ticking while the worker sorts, but freezes when the main thread does
              the same job.
            </span>
          </div>
        </div>

        <div className='border-border grid grid-cols-2 gap-3 border-t pt-3'>
          <div className='flex flex-col leading-tight'>
            <span className='text-muted-foreground text-[10px] tracking-wider uppercase'>
              Clock
            </span>
            <span className='text-foreground font-mono text-lg font-semibold tabular-nums'>
              {clock}
            </span>
          </div>

          <div className='flex flex-col leading-tight'>
            <span className='text-muted-foreground text-[10px] tracking-wider uppercase'>
              Thread
            </span>
            <span
              className={cn(
                'font-mono text-lg font-semibold',
                thread === 'main' ? 'text-destructive' : 'text-foreground'
              )}
            >
              {thread ?? 'idle'}
            </span>
          </div>
        </div>

        <div className='border-border flex items-center justify-between border-t pt-3'>
          <div className='flex min-w-0 flex-col leading-tight'>
            <span className='text-muted-foreground text-[10px] tracking-wider uppercase'>
              Lowest values
            </span>
            <span className='text-foreground truncate font-mono text-lg font-semibold tabular-nums'>
              {result ? result.join(', ') : '—'}
            </span>
          </div>

          <div className='flex shrink-0 gap-2'>
            <button
              data-size='sm'
              data-variant='outline'
              disabled={running}
              type='button'
              onClick={runMain}
            >
              Main
            </button>
            <button
              data-size='sm'
              data-variant={worker.pending ? 'destructive' : 'default'}
              disabled={blocking}
              type='button'
              onClick={worker.pending ? worker.terminate : () => void runWorker()}
            >
              {worker.pending ? 'Terminate' : 'Worker'}
            </button>
          </div>
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
npx useverse@latest add useWebWorkerCallback
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useEffect, useRef, useState } from 'react';

/** The use web worker callback return type */
export interface UseWebWorkerCallbackReturn<Callback extends (...args: any[]) => any> {
  /** Whether the callback is currently running */
  pending: boolean;
  /** Function to run the callback in a web worker */
  run: (...args: Parameters<Callback>) => Promise<Awaited<ReturnType<Callback>>>;
  /** Function to stop the worker */
  terminate: () => void;
}

type WorkerResponse<Result> = ['ERROR', unknown] | ['SUCCESS', Result];

const createSource = (callback: string) => `
const callback = (${callback});

self.addEventListener('message', (event) => {
  Promise.resolve(callback(...event.data))
    .then((result) => {
      self.postMessage(['SUCCESS', result]);
    })
    .catch((error) => {
      self.postMessage(['ERROR', error]);
    });
});
`;

/**
 * @name useWebWorkerCallback
 * @description - Hook that runs a callback in a web worker without a separate worker file
 * @category Browser
 * @usage low
 *
 * @browserapi Worker https://developer.mozilla.org/en-US/docs/Web/API/Worker
 *
 * @template Callback The callback type
 * @param {Callback} callback The self-contained callback to run in a web worker. Closures are not available, so its arguments and result must be structured-cloneable
 * @returns {UseWebWorkerCallbackReturn<Callback>} An object with the run function and controls
 *
 * @example
 * const { run, pending, terminate } = useWebWorkerCallback(() => {});
 */
export const useWebWorkerCallback = <Callback extends (...args: any[]) => any>(
  callback: Callback
): UseWebWorkerCallbackReturn<Callback> => {
  const [pending, setPending] = useState(false);

  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  const workerRef = useRef<Worker>(undefined);
  const urlRef = useRef<string>(undefined);

  const cleanup = () => {
    workerRef.current?.terminate();
    workerRef.current = undefined;

    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
      urlRef.current = undefined;
    }
  };

  const terminate = () => {
    cleanup();
    setPending(false);
  };

  const run = (...args: Parameters<Callback>) =>
    new Promise<Awaited<ReturnType<Callback>>>((resolve, reject) => {
      if (workerRef.current) {
        reject(new Error('The web worker callback is already running'));
        return;
      }

      const blob = new Blob([createSource(callbackRef.current.toString())], {
        type: 'text/javascript'
      });

      const url = URL.createObjectURL(blob);
      const worker = new Worker(url);

      workerRef.current = worker;
      urlRef.current = url;

      setPending(true);

      const settle = () => {
        if (workerRef.current !== worker) return false;

        cleanup();
        setPending(false);

        return true;
      };

      worker.addEventListener(
        'message',
        (event: MessageEvent<WorkerResponse<Awaited<ReturnType<Callback>>>>) => {
          if (!settle()) return;

          const [status, result] = event.data;

          if (status === 'SUCCESS') {
            resolve(result);
            return;
          }

          reject(result);
        }
      );

      worker.addEventListener('error', (event) => {
        event.preventDefault();

        if (!settle()) return;

        reject(event);
      });

      worker.postMessage(args);
    });

  useEffect(() => cleanup, []);

  return {
    pending,
    run,
    terminate
  };
};
```

Update the import paths to match your project setup.

## Usage

```tsx
const { run, pending, terminate } = useWebWorkerCallback(() => {});
```

## Type Declarations

```tsx
export interface UseWebWorkerCallbackReturn<Callback extends (...args: any[]) => any> {
  /** Whether the callback is currently running */
  pending: boolean;
  /** Function to run the callback in a web worker */
  run: (...args: Parameters<Callback>) => Promise<Awaited<ReturnType<Callback>>>;
  /** Function to stop the worker */
  terminate: () => void;
}

type WorkerResponse<Result> = ['ERROR', unknown] | ['SUCCESS', Result];
```

## API

### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| callback | `Callback` | - | The self-contained callback to run in a web worker. Closures are not available, so its arguments and result must be structured-cloneable |

### Returns

`UseWebWorkerCallbackReturn<Callback>` - An object with the run function and controls
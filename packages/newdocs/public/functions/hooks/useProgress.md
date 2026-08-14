---
title: useProgress
description: Hook that creates a lightweight progress bar
category: time
usage: medium
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1779190580000
---

# useProgress

Hook that creates a lightweight progress bar

## Demo

```tsx
import { useDisclosure, useProgress, useQuery } from '@siberiacancode/reactuse';
import { ChevronLeftIcon, CircleDotIcon, GitForkIcon, StarIcon } from 'lucide-react';
import { useState } from 'react';

interface Repo {
  description: string;
  forks: number;
  fullName: string;
  issues: number;
  language: string;
  languageColor: string;
  name: string;
  stars: number;
}

const REPOS: Repo[] = [
  {
    name: 'reactuse',
    fullName: 'siberiacancode/reactuse',
    description: 'The largest and most useful hook library for your react projects',
    language: 'TypeScript',
    languageColor: '#3178c6',
    stars: 1834,
    forks: 92,
    issues: 14
  },
  {
    name: 'mock-config',
    fullName: 'siberiacancode/mock-config',
    description: 'Powerful and flexible mocking of your API requests during development',
    language: 'TypeScript',
    languageColor: '#3178c6',
    stars: 218,
    forks: 11,
    issues: 5
  },
  {
    name: 'agent-skills',
    fullName: 'siberiacancode/agent-skills',
    description: 'A collection of reusable skills and tools for building AI agents',
    language: 'MDX',
    languageColor: '#fcb32c',
    stars: 96,
    forks: 7,
    issues: 3
  }
];

const fetchRepos = async () => {
  await new Promise((resolve) => setTimeout(resolve, 700));
  return REPOS;
};

const fetchRepo = async (fullName: string) => {
  await new Promise((resolve) => setTimeout(resolve, 900));
  return REPOS.find((repo) => repo.fullName === fullName)!;
};

const formatCount = (count: number) => {
  if (count < 1000) return count.toString();
  return `${(count / 1000).toFixed(1)}k`;
};

const Demo = () => {
  const progress = useProgress(0, { speed: 250 });
  const details = useDisclosure();
  const [selected, setSelected] = useState<string>();

  const reposQuery = useQuery(fetchRepos, {
    placeholderData: REPOS
  });

  const repoQuery = useQuery(() => fetchRepo(selected!), {
    keys: [selected],
    enabled: !!selected,
    onSuccess: () => {
      progress.done();
      details.open();
    }
  });

  const onOpen = (fullName: string) => {
    setSelected(fullName);
    progress.start();
  };

  const onBack = () => {
    details.close();
    setSelected(undefined);
  };

  const percent = Math.round(progress.value * 100);
  const repo = repoQuery.data;
  const repos = reposQuery.data ?? [];

  return (
    <section className='flex max-w-xl flex-col p-6'>
      {!!progress.active && (
        <div className='bg-primary/20 fixed top-0 right-0 left-0 z-[9999] h-1'>
          <div
            className='bg-primary h-full transition-[width] duration-200 ease-out'
            style={{ width: `${percent}%` }}
          />
        </div>
      )}

      {!details.opened && (
        <div className='flex flex-col gap-5'>
          <div className='flex items-center gap-4'>
            <div
              className='bg-gradient-to-br from-neutral-700 to-neutral-900 font-semibold text-white'
              data-size='xl'
              data-slot='avatar'
            >
              <span data-slot='avatar-fallback'>SC</span>
            </div>
            <div className='flex flex-col'>
              <h2 className='text-2xl!'>siberiacancode</h2>
              <span className='text-muted-foreground text-sm'>
                Open-source tools and libraries for developers
              </span>
            </div>
          </div>

          <div className='flex flex-col gap-3'>
            {repos.map((item) => (
              <div
                key={item.fullName}
                className='border-border bg-card text-card-foreground hover:bg-muted/40 cursor-pointer rounded-xl border p-4 text-sm transition-colors'
                onClick={() => onOpen(item.fullName)}
              >
                <div className='flex flex-col gap-2'>
                  <span className='text-primary text-sm font-semibold'>{item.name}</span>
                  <span className='text-muted-foreground text-xs leading-relaxed'>
                    {item.description}
                  </span>
                  <div className='text-muted-foreground mt-1 flex items-center gap-4 text-xs'>
                    <span className='flex items-center gap-1'>
                      <span
                        className='size-2.5 rounded-full'
                        style={{ backgroundColor: item.languageColor }}
                      />
                      {item.language}
                    </span>
                    <span className='flex items-center gap-1'>
                      <StarIcon className='size-3.5' />
                      {formatCount(item.stars)}
                    </span>
                    <span className='flex items-center gap-1'>
                      <GitForkIcon className='size-3.5' />
                      {formatCount(item.forks)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {details.opened && repo && (
        <div className='flex flex-col gap-5'>
          <div className='flex justify-start'>
            <button data-variant='ghost' type='button' onClick={onBack}>
              <ChevronLeftIcon className='size-4' />
              Back
            </button>
          </div>

          <div className='flex flex-col gap-2'>
            <h2 className='text-2xl!'>{repo.name}</h2>
            <span className='text-muted-foreground text-sm'>{repo.fullName}</span>
            <p className='text-foreground text-sm leading-relaxed'>{repo.description}</p>
          </div>

          <div className='flex items-center gap-2'>
            <span className='size-3 rounded-full' style={{ backgroundColor: repo.languageColor }} />
            <span className='text-muted-foreground text-sm'>{repo.language}</span>
          </div>

          <div className='border-border grid grid-cols-3 gap-3 border-t pt-4'>
            <div className='flex flex-col gap-1'>
              <span className='text-muted-foreground flex items-center gap-1.5 text-xs'>
                <StarIcon className='size-3.5' />
                Stars
              </span>
              <span className='text-foreground text-lg font-semibold tabular-nums'>
                {formatCount(repo.stars)}
              </span>
            </div>
            <div className='flex flex-col gap-1'>
              <span className='text-muted-foreground flex items-center gap-1.5 text-xs'>
                <GitForkIcon className='size-3.5' />
                Forks
              </span>
              <span className='text-foreground text-lg font-semibold tabular-nums'>
                {formatCount(repo.forks)}
              </span>
            </div>
            <div className='flex flex-col gap-1'>
              <span className='text-muted-foreground flex items-center gap-1.5 text-xs'>
                <CircleDotIcon className='size-3.5' />
                Issues
              </span>
              <span className='text-foreground text-lg font-semibold tabular-nums'>
                {formatCount(repo.issues)}
              </span>
            </div>
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
npx useverse@latest add useProgress
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useEffect, useRef, useState } from 'react';

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const resolveAutoIncrement = (progress: number, trickleRate: number) => {
  if (progress < 0.25) return 0.12 + trickleRate * Math.random();
  if (progress < 0.5) return 0.08 + trickleRate * Math.random();
  if (progress < 0.8) return 0.03 + trickleRate * Math.random();
  if (progress < 0.95) return 0.01 + (trickleRate / 2) * Math.random();
  if (progress < 0.99) return 0.005 * Math.random();
  return 0;
};

/** The use progress options type */
export interface UseProgressOptions {
  /** Delay before reset to null after done */
  delay?: number;
  /** Start progress immediately */
  immediately?: boolean;
  /** Maximum progress value */
  maximum?: number;
  /** Additional random amount for each auto increment */
  rate?: number;
  /** Auto-increment frequency in milliseconds */
  speed?: number;
}

/** The use progress return type */
export interface UseProgressReturn {
  /** Whether progress is currently active */
  active: boolean;
  /** Current progress value in range 0..1, null means hidden */
  value: number;
  /** Complete progress to 100% */
  done: (force?: boolean) => number | null;
  /** Increment progress with easing behavior */
  inc: (amount?: number) => number | null;
  /** Remove progress and stop timers */
  remove: () => void;
  /** Start progress and auto incrementing */
  start: (from?: number | null) => number;
}

/**
 * @name useProgress
 * @description - Hook that creates a lightweight progress bar
 * @category Time
 * @usage medium
 *
 * @param {number} [initialProgress] Initial progress value in range 0..1
 * @param {boolean} [options.active] Controls progress externally (true -> start, false -> done)
 * @param {number} [options.maximum=0.95] Maximum value when progress starts
 * @param {number} [options.speed=250] Auto increment interval in milliseconds
 * @param {number} [options.rate=0.02] Additional random increment amount on each tick
 * @param {number} [options.delay=250] Delay before reset to null after done
 * @returns {UseProgressReturn} Current progress state and control methods
 *
 * @example
 * const { value, active, start, done, inc, set, remove } = useProgress(0.2);
 */
export const useProgress = (initialValue: number = 0, options: UseProgressOptions = {}) => {
  const speed = Math.max(options.speed ?? 250, 16);
  const rate = clamp(options.rate ?? 0.02, 0, 0.3);
  const maximum = options.maximum ?? 0.98;
  const delay = options.delay ?? 250;

  const [value, setValue] = useState(initialValue);
  const [active, setActive] = useState(!!options.immediately);
  const [internalActive, setInternalActive] = useState(active);

  const intervalIdRef = useRef<ReturnType<typeof setInterval>>(undefined);

  const done = () => {
    setValue(1);
    setInternalActive(false);
    setTimeout(setActive, delay, false);
  };

  const inc = (amount: number = resolveAutoIncrement(value, rate)) =>
    setValue((currentValue) => clamp(currentValue + amount, initialValue, maximum));

  const start = (from: number = initialValue) => {
    setActive(true);
    setInternalActive(true);
    setValue(from);
  };

  const remove = () => {
    setActive(false);
    setInternalActive(false);
    setValue(0);
  };

  useEffect(() => {
    if (!internalActive) return;
    intervalIdRef.current = setInterval(inc, speed);
    return () => clearInterval(intervalIdRef.current);
  }, [internalActive, speed, rate]);

  return {
    value,
    active,
    start,
    done,
    inc,
    remove
  };
};
```

Update the import paths to match your project setup.

## Usage

```tsx
const { value, active, start, done, inc, set, remove } = useProgress(0.2);
```

## Type Declarations

```tsx
export interface UseProgressOptions {
  /** Delay before reset to null after done */
  delay?: number;
  /** Start progress immediately */
  immediately?: boolean;
  /** Maximum progress value */
  maximum?: number;
  /** Additional random amount for each auto increment */
  rate?: number;
  /** Auto-increment frequency in milliseconds */
  speed?: number;
}

export interface UseProgressReturn {
  /** Whether progress is currently active */
  active: boolean;
  /** Current progress value in range 0..1, null means hidden */
  value: number;
  /** Complete progress to 100% */
  done: (force?: boolean) => number | null;
  /** Increment progress with easing behavior */
  inc: (amount?: number) => number | null;
  /** Remove progress and stop timers */
  remove: () => void;
  /** Start progress and auto incrementing */
  start: (from?: number | null) => number;
}
```

## API

### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| initialProgress | `number` | - | Initial progress value in range 0..1 |
| options.active | `boolean` | - | Controls progress externally (true -> start, false -> done) |
| options.maximum | `number` | 0.95 | Maximum value when progress starts |
| options.speed | `number` | 250 | Auto increment interval in milliseconds |
| options.rate | `number` | 0.02 | Additional random increment amount on each tick |
| options.delay | `number` | 250 | Delay before reset to null after done |

### Returns

`UseProgressReturn` - Current progress state and control methods
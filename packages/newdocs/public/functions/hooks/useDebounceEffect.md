---
title: useDebounceEffect
description: Hook that runs an effect after a delay when dependencies change
category: utilities
usage: high
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1768590847000
---

# useDebounceEffect

Hook that runs an effect after a delay when dependencies change

## Demo

```tsx
import {
  useAsync,
  useClickOutside,
  useDebounceEffect,
  useDisclosure
} from '@siberiacancode/reactuse';
import { CheckIcon, ChevronDownIcon, Loader2Icon, SearchIcon } from 'lucide-react';
import { useState } from 'react';

import { cn } from '@/utils/lib';

interface Animal {
  emoji: string;
  name: string;
}

const ANIMALS: Animal[] = [
  { emoji: '\u{1F436}', name: 'Dog' },
  { emoji: '\u{1F431}', name: 'Cat' },
  { emoji: '\u{1F438}', name: 'Frog' },
  { emoji: '\u{1F419}', name: 'Octopus' },
  { emoji: '\u{1F980}', name: 'Crab' },
  { emoji: '\u{1F420}', name: 'Fish' },
  { emoji: '\u{1F427}', name: 'Penguin' },
  { emoji: '\u{1F985}', name: 'Eagle' },
  { emoji: '\u{1F986}', name: 'Duck' }
];

const searchAnimals = (query: string): Promise<Animal[]> =>
  new Promise((resolve) => {
    setTimeout(
      () =>
        resolve(
          ANIMALS.filter((animal) => animal.name.toLowerCase().includes(query.toLowerCase()))
        ),
      300
    );
  });

const Demo = () => {
  const [search, setSearch] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selected, setSelected] = useState<Animal | null>(null);

  const dropdown = useDisclosure();
  const dropdownRef = useClickOutside<HTMLDivElement>(() => dropdown.close());

  const animalsQuery = useAsync(() => searchAnimals(debouncedQuery), [debouncedQuery]);

  useDebounceEffect(
    () => {
      setDebouncedQuery(search);
    },
    500,
    [search]
  );

  const onSelect = (animal: Animal) => {
    setSelected(animal);
    dropdown.close();
    setSearch('');
    setDebouncedQuery('');
  };

  const results = animalsQuery.data ?? ANIMALS;
  const isLoading = animalsQuery.isLoading || search !== debouncedQuery;

  return (
    <section className='flex w-full max-w-sm flex-col gap-4 p-4'>
      <div className='flex flex-col gap-2'>
        <h3>Find your spirit animal</h3>
        <p className='text-muted-foreground text-sm'>
          The search waits <b>delay</b> after you stop typing before firing a request - no spam, no
          jank.
        </p>
      </div>

      <div ref={dropdownRef} className='relative'>
        <div
          className='border-input bg-background flex h-10 w-full cursor-pointer items-center justify-between rounded-full border px-3 text-sm transition-colors'
          onClick={() => dropdown.toggle()}
        >
          {selected ? (
            <span className='flex items-center gap-2'>
              <span className='text-lg leading-none'>{selected.emoji}</span>
              <span>{selected.name}</span>
            </span>
          ) : (
            <span className='text-muted-foreground'>Select an animal...</span>
          )}
          <ChevronDownIcon
            className={cn('text-muted-foreground size-4', dropdown.opened && 'rotate-180')}
          />
        </div>

        {dropdown.opened && (
          <div className='bg-popover text-popover-foreground absolute top-full right-0 left-0 z-50 mt-2 overflow-hidden rounded-lg border shadow-md'>
            <div className='relative p-1'>
              <SearchIcon className='text-muted-foreground pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2' />
              <input
                autoFocus
                className='h-10! w-full rounded-full! border-0! bg-inherit! pl-9! focus-visible:ring-0!'
                placeholder='Search animals...'
                type='text'
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              {isLoading && (
                <Loader2Icon className='text-muted-foreground pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 animate-spin' />
              )}
            </div>

            <div className='no-scrollbar max-h-60 overflow-y-auto p-1'>
              {!results.length && !isLoading && (
                <p className='text-muted-foreground py-6 text-center text-sm'>No animals found</p>
              )}

              {results.map((animal) => {
                const isSelected = selected?.name === animal.name;
                return (
                  <div
                    key={animal.name}
                    className='hover:bg-accent hover:text-accent-foreground flex cursor-pointer items-center justify-between gap-3 rounded-md px-2 py-1.5 text-sm'
                    onClick={() => onSelect(animal)}
                  >
                    <span className='flex items-center gap-2'>
                      <span className='text-lg leading-none'>{animal.emoji}</span>
                      <span>{animal.name}</span>
                    </span>
                    {isSelected && <CheckIcon className='size-4' />}
                  </div>
                );
              })}
            </div>
          </div>
        )}
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
npx useverse@latest add useDebounceEffect
```

### Manual

Copy and paste the following code into your project.

```tsx
import type { DependencyList, EffectCallback } from 'react';

import { useEffect, useRef } from 'react';

/**
 * @name useDebounceEffect
 * @description – Hook that runs an effect after a delay when dependencies change
 * @category Utilities
 * @usage high
 *
 * @param {EffectCallback} effect The effect callback to run
 * @param {number} delay The delay in milliseconds
 * @param {DependencyList} deps The dependencies list for the effect
 *
 * @example
 * useDebounceEffect(() => console.log('effect'), 500, [value]);
 */
export const useDebounceEffect = (effect: EffectCallback, delay: number, deps?: DependencyList) => {
  const mountedRef = useRef(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cleanupRef = useRef<ReturnType<EffectCallback>>(undefined);
  const effectRef = useRef(effect);
  const delayRef = useRef(delay);

  effectRef.current = effect;
  delayRef.current = delay;

  useEffect(() => {
    if (mountedRef.current) {
      mountedRef.current = false;
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    timeoutRef.current = setTimeout(() => {
      cleanupRef.current = effectRef.current();
    }, delayRef.current);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
      if (typeof cleanupRef.current === 'function') cleanupRef.current();
    };
  }, deps);
};
```

Update the import paths to match your project setup.

## Usage

```tsx
useDebounceEffect(() => console.log('effect'), 500, [value]);
```

## Type Declarations

```tsx
import type { DependencyList, EffectCallback } from 'react';
```

## API

### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| effect | `EffectCallback` | - | The effect callback to run |
| delay | `number` | - | The delay in milliseconds |
| deps | `DependencyList` | - | The dependencies list for the effect |
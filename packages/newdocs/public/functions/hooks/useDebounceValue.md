---
title: useDebounceValue
description: Hook that creates a debounced value
category: utilities
usage: high
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1754977987000
---

# useDebounceValue

Hook that creates a debounced value

## Demo

```tsx
import { useDebounceValue, useField } from '@siberiacancode/reactuse';
import { SearchIcon } from 'lucide-react';
import { useMemo } from 'react';

const ANIMALS = [
  { emoji: '🦊', name: 'Red Fox', habitat: 'Forest', region: 'Eurasia' },
  { emoji: '🐼', name: 'Giant Panda', habitat: 'Bamboo forest', region: 'China' },
  { emoji: '🦁', name: 'Lion', habitat: 'Savanna', region: 'Africa' },
  { emoji: '🐧', name: 'Penguin', habitat: 'Coast', region: 'Antarctica' },
  { emoji: '🦉', name: 'Snowy Owl', habitat: 'Tundra', region: 'Arctic' },
  { emoji: '🐢', name: 'Sea Turtle', habitat: 'Ocean', region: 'Tropics' },
  { emoji: '🦒', name: 'Giraffe', habitat: 'Savanna', region: 'Africa' },
  { emoji: '🦦', name: 'Sea Otter', habitat: 'Coast', region: 'Pacific' },
  { emoji: '🦘', name: 'Kangaroo', habitat: 'Grassland', region: 'Australia' },
  { emoji: '🐨', name: 'Koala', habitat: 'Eucalyptus forest', region: 'Australia' }
];

const Demo = () => {
  const searchField = useField('');
  const search = searchField.watch();

  const debouncedSearch = useDebounceValue(search, 500);

  const results = useMemo(() => {
    const query = debouncedSearch.toLowerCase().trim();
    if (!query) return ANIMALS;
    return ANIMALS.filter(
      (animal) =>
        animal.name.toLowerCase().includes(query) ||
        animal.habitat.toLowerCase().includes(query) ||
        animal.region.toLowerCase().includes(query)
    );
  }, [debouncedSearch]);

  return (
    <section className='flex w-full max-w-md flex-col gap-4 p-4'>
      <div className='flex flex-col gap-1'>
        <h3 className='text-foreground text-base font-semibold'>Wildlife explorer</h3>
        <p className='text-muted-foreground text-sm'>
          Search across species — results settle in shortly after you stop typing.
        </p>
      </div>

      <div className='relative w-full'>
        <SearchIcon className='text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2' />
        <input
          className='rounded-full! pl-9!'
          placeholder='Search animals'
          type='text'
          {...searchField.register()}
        />
      </div>

      <div className='no-scrollbar flex max-h-72 flex-col gap-2 overflow-y-auto'>
        {!results.length && (
          <p className='text-muted-foreground py-6 text-center text-sm'>No animals match</p>
        )}

        {results.map((animal) => (
          <div
            key={animal.name}
            className='bg-muted/40 hover:bg-muted/70 flex items-center gap-3 rounded-lg p-3 transition-colors'
          >
            <div data-size='lg' data-slot='avatar'>
              <span data-slot='avatar-fallback'> {animal.emoji}</span>
            </div>

            <div className='flex min-w-0 flex-1 flex-col'>
              <span className='truncate text-sm font-medium'>{animal.name}</span>
              <span className='text-muted-foreground truncate text-xs'>
                {animal.habitat} · {animal.region}
              </span>
            </div>
          </div>
        ))}
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
npx useverse@latest add useDebounceValue
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useEffect, useRef, useState } from 'react';

import { useDebounceCallback } from '../useDebounceCallback/useDebounceCallback';

/**
 * @name useDebounceValue
 * @description - Hook that creates a debounced value
 * @category Utilities
 * @usage high

 * @template Value The type of the value
 * @param {Value} value The value to be debounced
 * @param {number} delay The delay in milliseconds
 * @returns {Value} The debounced value
 *
 * @example
 * const debouncedValue = useDebounceValue(value, 500);
 */
export const useDebounceValue = <Value>(value: Value, delay: number) => {
  const previousValueRef = useRef(value);
  const [debouncedValue, setDebounceValue] = useState(value);

  const debouncedSetState = useDebounceCallback(setDebounceValue, delay);

  useEffect(() => {
    if (previousValueRef.current === value) return;
    debouncedSetState(value);
    previousValueRef.current = value;
  }, [value]);

  return debouncedValue;
};
```

Update the import paths to match your project setup.

## Usage

```tsx
const debouncedValue = useDebounceValue(value, 500);
```

## API

### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| value | `Value` | - | The value to be debounced |
| delay | `number` | - | The delay in milliseconds |

### Returns

`Value` - The debounced value
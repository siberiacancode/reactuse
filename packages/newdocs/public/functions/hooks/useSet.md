---
title: useSet
description: Hook that manages a set structure
category: state
usage: medium
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1754977987000
---

# useSet

Hook that manages a set structure

## Demo

```tsx
import { useClickOutside, useDisclosure, useMergedRef, useSet } from '@siberiacancode/reactuse';
import { CheckIcon, ChevronDownIcon, XIcon } from 'lucide-react';

import { cn } from '@/utils/lib';

const FRAMEWORKS = [
  { value: 'react', label: 'React', logo: 'react' },
  { value: 'vue', label: 'Vue', logo: 'vuedotjs' },
  { value: 'svelte', label: 'Svelte', logo: 'svelte' },
  { value: 'angular', label: 'Angular', logo: 'angular' },
  { value: 'solid', label: 'SolidJS', logo: 'solid' },
  { value: 'qwik', label: 'Qwik', logo: 'qwik' }
];

const Demo = () => {
  const dropdownMenu = useDisclosure();
  const selected = useSet<string>(['react']);

  const clickOutsideRef = useClickOutside<HTMLDivElement>(() => dropdownMenu.close());
  const panelRef = useMergedRef(clickOutsideRef);

  const selectedItems = FRAMEWORKS.filter((framework) => selected.has(framework.value));

  return (
    <section className='flex flex-col items-center'>
      <div className='flex w-full max-w-xs flex-col gap-1.5'>
        <label className='text-foreground text-sm font-medium' id='framework-label'>
          Frameworks
        </label>

        <div className='relative w-[250px]'>
          <div
            aria-expanded={dropdownMenu.opened}
            aria-haspopup='listbox'
            aria-labelledby='framework-label'
            className='border-border bg-card hover:bg-accent flex w-full cursor-pointer items-center justify-between gap-2 rounded-lg border px-3 py-2 transition-colors'
            onClick={() => dropdownMenu.toggle()}
          >
            <span className='flex min-w-0 flex-1 flex-wrap items-center gap-1.5'>
              {selectedItems.length === 0 && (
                <span className='text-muted-foreground text-sm'>Select frameworks</span>
              )}
              {selectedItems.map((framework) => (
                <span
                  key={framework.value}
                  data-slot='badge'
                  data-variant='secondary'
                  onClick={(event) => {
                    event.stopPropagation();
                    selected.remove(framework.value);
                  }}
                >
                  <img
                    alt=''
                    className='size-3 dark:invert'
                    src={`https://cdn.simpleicons.org/${framework.logo}/000000`}
                  />
                  {framework.label}
                  <XIcon className='size-3' />
                </span>
              ))}
            </span>

            <ChevronDownIcon
              className={cn(
                'text-muted-foreground size-4 shrink-0 transition-transform',
                dropdownMenu.opened && 'rotate-180'
              )}
            />
          </div>

          {dropdownMenu.opened && (
            <div
              ref={panelRef}
              className='absolute top-full right-0 left-0 mt-2'
              data-slot='dropdown-menu-content'
            >
              {FRAMEWORKS.map((framework) => (
                <div
                  key={framework.value}
                  data-slot='dropdown-menu-item'
                  onClick={() => selected.toggle(framework.value)}
                >
                  <img
                    alt=''
                    className='size-4 dark:invert'
                    src={`https://cdn.simpleicons.org/${framework.logo}/000000`}
                  />
                  {framework.label}
                  {selected.has(framework.value) && <CheckIcon className='ml-auto size-4' />}
                </div>
              ))}
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
npx useverse@latest add useSet
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useState } from 'react';

/** The use set return type */
interface UseSetReturn<Value> {
  /** The size of the set */
  size: number;
  /** The current set */
  value: Set<Value>;
  /** Function to add a value to the set */
  add: (value: Value) => void;
  /** Function to clear the set */
  clear: () => void;
  /** Function to get the symmetric difference of two sets */
  difference: (other: Set<Value>) => void;
  /** Function to check if a value exists in the set */
  has: (value: Value) => boolean;
  /** Function to get the difference of two sets */
  intersection: (other: Set<Value>) => void;
  /** Function to remove a value from the set */
  remove: (value: Value) => void;
  /** Function to toggle a value in the set */
  reset: () => void;
  /** Function to get the symmetric difference of two sets */
  symmetricDifference: (other: Set<Value>) => void;
  /** Function to toggle a value in the set */
  toggle: (value: Value) => void;
  /** Function to get the union of two sets */
  union: (other: Set<Value>) => void;
}

/**
 * @name useSet
 * @description - Hook that manages a set structure
 * @category State
 * @usage medium
 *
 * @template Value The type of the value
 * @param {Value[]} [values] The initial array of the set
 * @returns {UseSetReturn<Value>} An object containing the current set and functions to interact with the set
 *
 * @example
 * const { value, add, remove, clear, reset, toggle, union, intersection, difference, symmetricDifference, size, has } = useSet([1, 2, 3]);
 */
export const useSet = <Value>(values?: Value[]): UseSetReturn<Value> => {
  const [set, setSet] = useState(new Set(values));

  const add = (value: Value) => setSet((prevSet) => new Set(prevSet).add(value));
  const remove = (value: Value) =>
    setSet((prevSet) => {
      if (!prevSet.has(value)) return prevSet;
      const newSet = new Set(prevSet);
      newSet.delete(value);
      return newSet;
    });
  const clear = () => setSet(new Set());
  const reset = () => setSet(new Set(values));
  const toggle = (value: Value) =>
    setSet((prevSet) => {
      if (!prevSet.has(value)) return new Set(prevSet).add(value);
      const newSet = new Set(prevSet);
      newSet.delete(value);
      return newSet;
    });
  const union = (other: Set<Value>) => setSet(set.union(other));
  const difference = (other: Set<Value>) => setSet(set.difference(other));
  const symmetricDifference = (other: Set<Value>) => setSet(set.symmetricDifference(other));
  const intersection = (other: Set<Value>) => setSet(set.intersection(other));
  const has = (value: Value) => set.has(value);

  return {
    value: set,
    size: set.size,
    has,
    add,
    remove,
    clear,
    reset,
    toggle,
    union,
    difference,
    symmetricDifference,
    intersection
  };
};
```

Update the import paths to match your project setup.

## Usage

```tsx
const { value, add, remove, clear, reset, toggle, union, intersection, difference, symmetricDifference, size, has } = useSet([1, 2, 3]);
```

## Type Declarations

```tsx
interface UseSetReturn<Value> {
  /** The size of the set */
  size: number;
  /** The current set */
  value: Set<Value>;
  /** Function to add a value to the set */
  add: (value: Value) => void;
  /** Function to clear the set */
  clear: () => void;
  /** Function to get the symmetric difference of two sets */
  difference: (other: Set<Value>) => void;
  /** Function to check if a value exists in the set */
  has: (value: Value) => boolean;
  /** Function to get the difference of two sets */
  intersection: (other: Set<Value>) => void;
  /** Function to remove a value from the set */
  remove: (value: Value) => void;
  /** Function to toggle a value in the set */
  reset: () => void;
  /** Function to get the symmetric difference of two sets */
  symmetricDifference: (other: Set<Value>) => void;
  /** Function to toggle a value in the set */
  toggle: (value: Value) => void;
  /** Function to get the union of two sets */
  union: (other: Set<Value>) => void;
}
```

## API

### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| values | `Value[]` | - | The initial array of the set |

### Returns

`UseSetReturn<Value>` - An object containing the current set and functions to interact with the set
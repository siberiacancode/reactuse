---
title: useLocalStorage
description: Hook that manages local storage value
category: state
usage: high
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1754977987000
---

# useLocalStorage

Hook that manages local storage value

## Demo

```tsx
import { useLocalStorage } from '@siberiacancode/reactuse';
import { BellIcon, ChevronDownIcon } from 'lucide-react';

const FREQUENCY_OPTIONS = [
  { value: 'live', label: 'Real-time' },
  { value: 'daily', label: 'Daily digest' },
  { value: 'weekly', label: 'Weekly summary' },
  { value: 'off', label: 'Off' }
];

const Demo = () => {
  const settingLocalStorage = useLocalStorage('reactuse-demo-notify', 'daily');

  return (
    <section className='border-border flex w-full max-w-sm min-w-0 flex-col gap-2 rounded-xl border p-2 md:max-w-md'>
      <div className='flex w-full min-w-0 flex-col gap-4 p-4 sm:flex-row sm:items-start sm:justify-between'>
        <div className='flex min-w-0 items-center gap-3'>
          <BellIcon className='text-muted-foreground size-6 shrink-0' />
          <div className='flex min-w-0 flex-col gap-0.5'>
            <span className='text-sm font-medium'>Email notifications</span>
            <span className='text-muted-foreground text-xs'>How often you get updates</span>
          </div>
        </div>

        <div className='relative w-full sm:w-auto'>
          <select
            className='w-full sm:min-w-44'
            value={settingLocalStorage.value}
            onChange={(event) => settingLocalStorage.set(event.target.value)}
          >
            {FREQUENCY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDownIcon className='text-muted-foreground pointer-events-none absolute top-1/2 right-2 size-4 -translate-y-1/2' />
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
npx useverse@latest add useLocalStorage
```

### Manual

Copy and paste the following code into your project.

```tsx
import type { UseStorageInitialValue, UseStorageOptions } from '../useStorage/useStorage';

import { useStorage } from '../useStorage/useStorage';

/**
 * @name useLocalStorage
 * @description - Hook that manages local storage value
 * @category State
 * @usage high
 *
 * @browserapi localStorage https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
 *
 * @template Value The type of the value
 * @param {string} key The key of the storage
 * @param {UseStorageInitialValue<Value>} [initialValue] The initial value of the storage
 * @param {UseStorageOptions<Value>} [options] The options of the storage
 *
 * @example
 * const { value, set, remove } = useLocalStorage('key', 'value');
 */
export const useLocalStorage = <Value>(
  key: string,
  initialValue?: UseStorageInitialValue<Value>,
  options?: Omit<UseStorageOptions<Value>, 'initialValue' | 'storage'>
) =>
  useStorage(key, {
    ...options,
    initialValue,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined
  });
```

Update the import paths to match your project setup.

## Usage

```tsx
const { value, set, remove } = useLocalStorage('key', 'value');
```

## Type Declarations

```tsx
import type { UseStorageInitialValue, UseStorageOptions } from '../useStorage/useStorage';
```

## API

### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| key | `string` | - | The key of the storage |
| initialValue | `UseStorageInitialValue<Value>` | - | The initial value of the storage |
| options | `UseStorageOptions<Value>` | - | The options of the storage |
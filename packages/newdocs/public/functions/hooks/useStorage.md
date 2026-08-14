---
title: useStorage
description: Hook that manages storage value
category: state
usage: high
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1767164032000
---

# useStorage

Hook that manages storage value

## Demo

```tsx
import { useStorage } from '@siberiacancode/reactuse';
import { SaveIcon } from 'lucide-react';

const Demo = () => {
  const autoSaveStorage = useStorage('reactuse-demo-autosave', true);

  return (
    <section className='border-border flex w-full max-w-sm min-w-0 flex-col gap-2 rounded-xl border p-2 md:max-w-md'>
      <div className='flex w-full min-w-0 items-center justify-between gap-4 p-4'>
        <div className='flex min-w-0 items-center gap-3'>
          <SaveIcon className='text-muted-foreground size-6 shrink-0' />
          <div className='flex min-w-0 flex-col gap-0.5'>
            <span className='text-sm font-medium'>Auto-save</span>
            <span className='text-muted-foreground text-xs break-words'>
              Automatically save your changes as you work
            </span>
          </div>
        </div>

        <input
          checked={autoSaveStorage.value}
          role='switch'
          type='checkbox'
          onChange={(event) => autoSaveStorage.set(event.target.checked)}
        />
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
npx useverse@latest add useStorage
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useEffect, useState } from 'react';

/* The use storage initial value type */
export type UseStorageInitialValue<Value> = (() => Value) | Value;

/* The use storage options type */
export interface UseStorageOptions<Value> {
  /* The initial value of the storage */
  initialValue?: UseStorageInitialValue<Value>;
  /* The storage to be used */
  storage?: Storage;
  /* The deserializer function to be invoked */
  deserializer?: (value: string) => Value;
  /* The serializer function to be invoked */
  serializer?: (value: Value) => string;
}

/* The use storage return type */
export interface UseStorageReturn<Value> {
  /* The value of the storage */
  value: Value;
  /* The error state of the storage */
  remove: () => void;
  /* The loading state of the storage */
  set: (value: Value) => void;
}

export interface UseStorage {
  <Value>(key: string, options?: UseStorageOptions<Value>): UseStorageReturn<Value | undefined>;

  <Value>(
    key: string,
    initialValue?: UseStorageInitialValue<Value>
  ): UseStorageReturn<Value | undefined>;
}

export const STORAGE_EVENT = 'reactuse-storage';

export const dispatchStorageEvent = (params: Partial<StorageEvent>) =>
  window.dispatchEvent(new StorageEvent(STORAGE_EVENT, params));

const setStorageItem = (storage: Storage, key: string, value: string) => {
  const oldValue = storage.getItem(key);

  storage.setItem(key, value);
  dispatchStorageEvent({
    key,
    oldValue,
    newValue: value,
    storageArea: storage
  });
};

const removeStorageItem = (storage: Storage, key: string) => {
  const oldValue = storage.getItem(key);

  storage.removeItem(key);
  dispatchStorageEvent({ key, oldValue, newValue: null, storageArea: storage });
};

const getStorageItem = (storage: Storage, key: string) => {
  const value = storage.getItem(key);
  if (!value) return undefined;
  return value;
};

/**
 * @name useStorage
 * @description - Hook that manages storage value
 * @category State
 * @usage high
 *
 * @overload
 * @param {string} key The key of the storage
 * @param {UseStorageInitialValue<Value>} [initialValue] The initial value of the storage
 * @returns {UseStorageReturn<Value>} The value and the set function
 *
 * @overload
 * @param {string} key The key of the storage
 * @param {(value: Value) => string} [params.serializer] The serializer function
 * @param {(value: string) => Value} [params.deserializer] The deserializer function
 * @param {Storage} [params.storage] The storage
 * @param {UseStorageInitialValue<Value>} [params.initialValue] The initial value of the storage
 * @returns {UseStorageReturn<Value>} The value and the set function
 *
 * @example
 * const { value, set, remove } = useStorage('key', 'value');
 */
export const useStorage = (<Value>(key: string, params?: any): UseStorageReturn<Value> => {
  const options = (
    typeof params === 'object' &&
    params &&
    ('serializer' in params ||
      'deserializer' in params ||
      'initialValue' in params ||
      'storage' in params)
      ? params
      : undefined
  ) as UseStorageOptions<Value>;

  const initialValue = (options ? options?.initialValue : params) as UseStorageInitialValue<Value>;

  if (typeof window === 'undefined') {
    const value = typeof initialValue === 'function' ? (initialValue as () => any)() : initialValue;
    return {
      value,
      set: () => {},
      remove: () => {}
    };
  }

  const serializer = (value: Value) => {
    if (options?.serializer) return options.serializer(value);
    if (typeof value === 'string') return value;
    return JSON.stringify(value);
  };

  const storage = options?.storage ?? window?.localStorage;

  const set = (value: Value) => setStorageItem(storage, key, serializer(value));
  const remove = () => removeStorageItem(storage, key);

  const deserializer = (value: string) => {
    if (options?.deserializer) return options.deserializer(value);
    if (value === 'undefined') return undefined as unknown as Value;

    try {
      return JSON.parse(value) as Value;
    } catch {
      return value as Value;
    }
  };

  const [value, setValue] = useState<Value | undefined>(() => {
    const storageValue = getStorageItem(storage, key);
    if (storageValue === undefined && initialValue !== undefined) {
      const value =
        typeof initialValue === 'function' ? (initialValue as () => Value)() : initialValue;
      setStorageItem(storage, key, serializer(value));
      return value;
    }
    return storageValue ? deserializer(storageValue) : undefined;
  });

  useEffect(() => {
    const onChange = (event?: StorageEvent) => {
      if (event && event.storageArea !== storage) return;
      if (event && event.key !== key) return;

      const storageValue = getStorageItem(storage, key);
      setValue(storageValue ? deserializer(storageValue) : undefined);
    };

    window.addEventListener(STORAGE_EVENT, onChange as EventListener);
    window.addEventListener('storage', onChange, { passive: true });

    return () => {
      window.removeEventListener(STORAGE_EVENT, onChange as EventListener);
      window.removeEventListener('storage', onChange);
    };
  }, [key, storage]);

  return {
    value: value as Value,
    set,
    remove
  };
}) as UseStorage;
```

Update the import paths to match your project setup.

## Usage

```tsx
const { value, set, remove } = useStorage('key', 'value');
```

## Type Declarations

```tsx
export type UseStorageInitialValue<Value> = (() => Value) | Value;

export interface UseStorageOptions<Value> {
  /* The initial value of the storage */
  initialValue?: UseStorageInitialValue<Value>;
  /* The storage to be used */
  storage?: Storage;
  /* The deserializer function to be invoked */
  deserializer?: (value: string) => Value;
  /* The serializer function to be invoked */
  serializer?: (value: Value) => string;
}

export interface UseStorageReturn<Value> {
  /* The value of the storage */
  value: Value;
  /* The error state of the storage */
  remove: () => void;
  /* The loading state of the storage */
  set: (value: Value) => void;
}

export interface UseStorage {
  <Value>(key: string, options?: UseStorageOptions<Value>): UseStorageReturn<Value | undefined>;

  <Value>(
    key: string,
    initialValue?: UseStorageInitialValue<Value>
  ): UseStorageReturn<Value | undefined>;
}
```

## API

### Overload 1

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| key | `string` | - | The key of the storage |
| initialValue | `UseStorageInitialValue<Value>` | - | The initial value of the storage |

#### Returns

`UseStorageReturn<Value>` - The value and the set function

### Overload 2

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| key | `string` | - | The key of the storage |
| params.serializer | `(value: Value) => string` | - | The serializer function |
| params.deserializer | `(value: string) => Value` | - | The deserializer function |
| params.storage | `Storage` | - | The storage |
| params.initialValue | `UseStorageInitialValue<Value>` | - | The initial value of the storage |

#### Returns

`UseStorageReturn<Value>` - The value and the set function
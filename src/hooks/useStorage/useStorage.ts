import React from 'react';

import { useIsomorphicLayoutEffect } from '../useIsomorphicLayoutEffect/useIsomorphicLayoutEffect';

export type UseStorageInitialValue<Value> = Value | (() => Value);
export interface UseStorageOptions<Value> {
  serializer?: (value: Value) => string;
  deserializer?: (value: string) => Value;
  storage?: Storage;
  initialValue?: UseStorageInitialValue<Value>;
}

export type UseStorageReturn<Value> = [
  value: Value,
  set: (value: Value) => void,
  remove: () => void
];

export const dispatchStorageEvent = (params: Partial<StorageEvent>) =>
  window.dispatchEvent(new StorageEvent('storage', params));

const setStorageItem = (storage: Storage, key: string, value: string) => {
  const oldValue = storage.getItem(key);

  storage.setItem(key, value);
  dispatchStorageEvent({ key, oldValue, newValue: value, storageArea: storage });
};

const removeStorageItem = (storage: Storage, key: string) => {
  const oldValue = storage.getItem(key);

  storage.removeItem(key);
  dispatchStorageEvent({ key, oldValue, newValue: null, storageArea: storage });
};

const getStorageItem = <Value>(
  storage: Storage,
  key: string,
  deserializer: (value: string) => Value
) => {
  const value = storage.getItem(key);
  if (!value) return undefined;
  return deserializer(value);
};

const storageSubscribe = (callback: () => void) => {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
};

const getStorageServerSnapshot = <Value>(initialValue: UseStorageInitialValue<Value>) =>
  initialValue instanceof Function ? initialValue() : initialValue;

export const useStorage = <Value>(
  key: string,
  params?: UseStorageInitialValue<Value> | UseStorageOptions<Value>
) => {
  const options = (typeof params === 'object' ? params : undefined) as UseStorageOptions<Value>;
  const initialValue = (options ? options?.initialValue : params) as UseStorageInitialValue<Value>;

  const storage = options?.storage ?? window.localStorage;
  const serializer = (value: Value) => {
    if (options?.serializer) return options.serializer(value);
    return JSON.stringify(value);
  };

  const deserializer = (value: string) => {
    if (options?.deserializer) return options.deserializer(value);

    if (value === 'undefined') {
      return undefined as unknown as Value;
    }

    try {
      return JSON.parse(value) as Value;
    } catch (error) {
      return value as Value;
    }
  };

  const getSnapshot = () => getStorageItem<Value>(storage, key, deserializer) as Value;
  const getServerSnapshot = () => getStorageServerSnapshot(initialValue);
  const store = React.useSyncExternalStore(storageSubscribe, getSnapshot, getServerSnapshot);

  const set = (value: Value) => {
    if (value === null) return removeStorageItem(storage, key);
    setStorageItem(storage, key, serializer(value));
  };

  useIsomorphicLayoutEffect(() => {
    const value = getStorageItem<Value>(storage, key, deserializer);
    if (value !== undefined && !initialValue) return;

    setStorageItem(
      storage,
      key,
      serializer(initialValue instanceof Function ? initialValue() : initialValue)
    );
  }, [key]);

  const remove = () => removeStorageItem(storage, key);

  return [store, set, remove] as const;
};

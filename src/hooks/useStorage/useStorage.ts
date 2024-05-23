import React from 'react';

export type UseStorageInitialValue<Value> = Value | (() => Value);
export interface UseStorageOptions<Value> {
  serializer?: (value: Value) => string;
  deserializer?: (value: string) => Value;
  storage: Storage;
}

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
  if (!value) return null;
  return deserializer(value);
};

const storageSubscribe = (callback: () => void) => {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
};

const getStorageServerSnapshot = <Value>(initialValue: UseStorageInitialValue<Value>) =>
  initialValue instanceof Function ? initialValue() : initialValue;

/**
 * @name useStorage
 * @description - Hook that manages a counter with increment, decrement, reset, and set functionalities
 *
 * @example
 * text
 */
export function useStorage<Value = string | null>(
  key: string,
  initialValue?: UseStorageInitialValue<Value>,
  options?: UseStorageOptions<Value>
) {
  const storage = options?.storage ?? window.localStorage;
  const serializer = React.useCallback<(value: Value) => string>(
    (value) => {
      if (options?.serializer) return options.serializer(value);
      return JSON.stringify(value);
    },
    [options?.serializer]
  );

  const deserializer = React.useCallback<(value: string) => Value>(
    (value) => {
      if (options?.deserializer) return options.deserializer(value);

      if (value === 'undefined') {
        return undefined as unknown as Value;
      }

      try {
        return JSON.parse(value) as Value;
      } catch (error) {
        return value as Value;
      }
    },
    [options, initialValue]
  );

  const getSnapshot = () => getStorageItem<Value>(storage, key, deserializer);
  const getServerSnapshot = () => getStorageServerSnapshot(initialValue);
  const store = React.useSyncExternalStore(storageSubscribe, getSnapshot, getServerSnapshot);

  const setState = React.useCallback(
    (value: Value) => {
      if (value === undefined || value === null) {
        return removeStorageItem(storage, key);
      }

      setStorageItem(storage, key, serializer(value));
    },
    [key, store]
  );

  React.useEffect(() => {
    const value = getStorageItem<Value>(storage, key, deserializer);
    if (value !== null || !initialValue) return;

    setStorageItem(
      storage,
      key,
      serializer(initialValue instanceof Function ? initialValue() : initialValue)
    );
  }, [key]);

  return {
    value:
      store ??
      ((initialValue
        ? initialValue instanceof Function
          ? initialValue()
          : initialValue
        : null) as Value),
    set: setState,
    clear: () => removeStorageItem(storage, key)
  };
}

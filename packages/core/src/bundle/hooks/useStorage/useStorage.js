import { useSyncExternalStore } from 'react';
import { useIsomorphicLayoutEffect } from '../useIsomorphicLayoutEffect/useIsomorphicLayoutEffect';
export const dispatchStorageEvent = (params) => window.dispatchEvent(new StorageEvent('storage', params));
const setStorageItem = (storage, key, value) => {
    const oldValue = storage.getItem(key);
    storage.setItem(key, value);
    dispatchStorageEvent({ key, oldValue, newValue: value, storageArea: storage });
};
const removeStorageItem = (storage, key) => {
    const oldValue = storage.getItem(key);
    storage.removeItem(key);
    dispatchStorageEvent({ key, oldValue, newValue: null, storageArea: storage });
};
const getStorageItem = (storage, key) => {
    const value = storage.getItem(key);
    if (!value)
        return undefined;
    return value;
};
const storageSubscribe = (callback) => {
    window.addEventListener('storage', callback);
    return () => window.removeEventListener('storage', callback);
};
const getServerSnapshot = () => undefined;
/**
 * @name useStorage
 * @description - Hook that manages storage value
 * @category Utilities
 *
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
export const useStorage = (key, params) => {
    const options = (typeof params === 'object' ? params : undefined);
    const initialValue = (options ? options?.initialValue : params);
    const serializer = (value) => {
        if (options?.serializer)
            return options.serializer(value);
        return JSON.stringify(value);
    };
    const storage = options?.storage ?? window?.localStorage;
    const set = (value) => {
        if (value === null)
            return removeStorageItem(storage, key);
        setStorageItem(storage, key, serializer(value));
    };
    const remove = () => removeStorageItem(storage, key);
    const deserializer = (value) => {
        if (options?.deserializer)
            return options.deserializer(value);
        if (value === 'undefined') {
            return undefined;
        }
        try {
            return JSON.parse(value);
        }
        catch {
            return value;
        }
    };
    const getSnapshot = () => getStorageItem(storage, key);
    const store = useSyncExternalStore(storageSubscribe, getSnapshot, getServerSnapshot);
    useIsomorphicLayoutEffect(() => {
        const value = getStorageItem(storage, key);
        if (value === undefined && initialValue !== undefined) {
            setStorageItem(storage, key, serializer(initialValue instanceof Function ? initialValue() : initialValue));
        }
    }, [key]);
    if (typeof window === 'undefined')
        return {
            value: initialValue instanceof Function ? initialValue() : initialValue,
            set,
            remove
        };
    return {
        value: store ? deserializer(store) : undefined,
        set,
        remove
    };
};

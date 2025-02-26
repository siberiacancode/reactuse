import { useEffect, useSyncExternalStore } from 'react';
export const STORAGE_EVENT = 'reactuse-storage';
export const dispatchStorageEvent = (params) => window.dispatchEvent(new StorageEvent(STORAGE_EVENT, params));
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
    window.addEventListener(STORAGE_EVENT, callback);
    return () => window.removeEventListener(STORAGE_EVENT, callback);
};
const getServerSnapshot = () => undefined;
/**
 * @name useStorage
 * @description - Hook that manages storage value
 * @category Browser
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
export const useStorage = (key, params) => {
    const options = (typeof params === 'object' &&
        params &&
        ('serializer' in params ||
            'deserializer' in params ||
            'initialValue' in params ||
            'storage' in params)
        ? params
        : undefined);
    const initialValue = (options ? options?.initialValue : params);
    if (typeof window === 'undefined')
        return {
            value: initialValue instanceof Function ? initialValue() : initialValue
        };
    const serializer = (value) => {
        if (options?.serializer)
            return options.serializer(value);
        return JSON.stringify(value);
    };
    const storage = options?.storage ?? window?.localStorage;
    const set = (value) => setStorageItem(storage, key, serializer(value));
    const remove = () => removeStorageItem(storage, key);
    const deserializer = (value) => {
        if (options?.deserializer)
            return options.deserializer(value);
        if (value === 'undefined')
            return undefined;
        try {
            return JSON.parse(value);
        }
        catch {
            return value;
        }
    };
    const getSnapshot = () => getStorageItem(storage, key);
    const store = useSyncExternalStore(storageSubscribe, getSnapshot, getServerSnapshot);
    useEffect(() => {
        const value = getStorageItem(storage, key);
        if (value === undefined && initialValue !== undefined) {
            setStorageItem(storage, key, serializer(initialValue instanceof Function ? initialValue() : initialValue));
        }
    }, [key]);
    return {
        value: store ? deserializer(store) : undefined,
        set,
        remove
    };
};

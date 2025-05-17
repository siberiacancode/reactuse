import type { UseStorageInitialValue, UseStorageOptions } from '../useStorage/useStorage';

import { useStorage } from '../useStorage/useStorage';

/**
 * @name useLocalStorage
 * @description - Hook that manages local storage value
 * @category Browser
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

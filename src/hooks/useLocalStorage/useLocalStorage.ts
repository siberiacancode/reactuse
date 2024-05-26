import type { UseStorageInitialValue, UseStorageOptions } from '../useStorage/useStorage';
import { useStorage } from '../useStorage/useStorage';

export const useLocalStorage = <Value>(
  key: string,
  initialValue?: UseStorageInitialValue<Value>,
  options?: UseStorageOptions<Value>
) => useStorage(key, { initialValue, storage: window.localStorage, ...options });

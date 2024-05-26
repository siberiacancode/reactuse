import type { UseStorageInitialValue, UseStorageOptions } from '../useStorage/useStorage';
import { useStorage } from '../useStorage/useStorage';

export const useSessionStorage = <Value>(
  key: string,
  initialValue?: UseStorageInitialValue<Value>,
  options?: UseStorageOptions<Value>
) => useStorage(key, { initialValue, storage: window.sessionStorage, ...options });

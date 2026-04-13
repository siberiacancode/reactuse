import { useEffect, useRef, useState } from 'react';

export const getHash = () => decodeURIComponent(window.location.hash.replace('#', ''));

/** The use hash options type */
export interface UseHashOptions {
  /** The enabled state of the hook */
  enabled?: boolean;
  /** The mode of hash setting */
  mode?: 'initial' | 'replace';
  /** Callback function called when hash changes */
  onChange?: (hash: string) => void;
}

/** The use hash return type */
type UseHashReturn = [string, (value: string) => void];

export interface UseHash {
  (initialValue?: string, options?: UseHashOptions): UseHashReturn;

  (options?: UseHashOptions): UseHashReturn;

  (initialValue?: string, callback?: (hash: string) => void): UseHashReturn;

  (callback?: (hash: string) => void): UseHashReturn;
}
/**
 * @name useHash
 * @description - Hook that manages the hash value
 * @category State
 * @usage low
 *
 * @param {string | UseHashOptions | ((hash: string) => void)} [arg1]
 * Initial hash value, options object, or change callback.
 *
 * @param {UseHashOptions | ((hash: string) => void)} [arg2]
 * Options object or change callback.
 *
 * @returns {[string, (value: string) => void]}
 * A tuple containing the current hash value and a function to update it.
 *
 * @example
 * const [value, set] = useHash("initial");
 *
 * @example
 * const [value, set] = useHash("initial", (newHash) => {
 *   console.log(newHash);
 * });
 *
 * @example
 * const [value, set] = useHash({
 *   enabled: true,
 *   mode: "replace",
 *   onChange: (hash) => console.log(hash),
 * });
 *
 * @example
 * const [value, set] = useHash((newHash) => {
 *   console.log(newHash);
 * });
 */
export const useHash = ((...params: any[]) => {
  const initialValue = typeof params[0] === 'string' ? params[0] : '';
  const options =
    typeof params[1] === 'object'
      ? params[1]
      : typeof params[1] === 'function'
        ? { onChange: params[1] }
        : typeof params[0] === 'object'
          ? params[0]
          : {};

  const enabled = options?.enabled ?? true;
  const mode = options?.mode ?? 'replace';

  const [hash, setHash] = useState(() => {
    if (typeof window === 'undefined') return initialValue;
    return getHash() || initialValue;
  });

  const optionsRef = useRef(options);
  optionsRef.current = options;

  const set = (value: string) => {
    window.location.hash = value;
    setHash(value);
    optionsRef.current?.onChange?.(value);
  };

  useEffect(() => {
    if (!enabled) return;

    if (mode === 'replace') window.location.hash = hash;

    const onHashChange = () => {
      const newHash = getHash();
      setHash(newHash);
      optionsRef.current?.onChange?.(newHash);
    };

    window.addEventListener('hashchange', onHashChange);
    return () => {
      window.removeEventListener('hashchange', onHashChange);
    };
  }, [enabled, mode]);

  return [hash, set];
}) as UseHash;

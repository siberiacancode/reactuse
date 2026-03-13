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
interface UseHashReturn {
  /** The hash value */
  value: string;
  /** The function to set the hash value */
  set: (value: string) => void;
}

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
 * @overload
 * @param {string} [initialValue] The initial hash value if no hash exists
 * @param {UseHashOptions} [options] Configuration options
 * @param {boolean} [options.enabled] The enabled state of the hook
 * @param {'initial' | 'replace'} [options.mode] The mode of hash setting
 * @param {(hash: string) => void} [options.onChange] Callback function called when hash changes
 * @returns {UseHashReturn} An array containing the hash value and a function to set the hash value
 *
 * @example
 * const { value, set } = useHash("initial");
 *
 * @overload
 * @param {string} [initialValue] The initial hash value if no hash exists
 * @param {(hash: string) => void} [callback] Callback function called when hash changes
 * @returns {UseHashReturn} An array containing the hash value and a function to set the hash value
 *
 * @example
 * const { value, set } = useHash("initial", (newHash) => console.log('callback'));
 *
 * @overload
 * @param {UseHashOptions} [options] Configuration options
 * @param {boolean} [options.enabled] The enabled state of the hook
 * @param {'initial' | 'replace'} [options.mode] The mode of hash setting
 * @param {(hash: string) => void} [options.onChange] Callback function called when hash changes
 * @returns {UseHashReturn} An array containing the hash value and a function to set the hash value
 *
 * @example
 * const { value, set } = useHash();
 *
 * @overload
 * @param {(hash: string) => void} [callback] Callback function called when hash changes
 * @returns {UseHashReturn} An array containing the hash value and a function to set the hash value
 *
 * @example
 * const { value, set } = useHash((newHash) => console.log('callback'));
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

  return {
    value: hash,
    set
  };
}) as UseHash;

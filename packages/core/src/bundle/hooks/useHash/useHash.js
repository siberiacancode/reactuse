import { useEffect, useRef, useState } from 'react';
export const getHash = () => decodeURIComponent(window.location.hash.replace('#', ''));
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
 * const [hash, setHash] = useHash("initial", {
 *   enabled: true,
 *   mode: "replace",
 *   onChange: (newHash) => console.log('Hash changed:', newHash)
 * });
 *
 * @overload
 * @param {string} [initialValue] The initial hash value if no hash exists
 * @param {(hash: string) => void} [callback] Callback function called when hash changes
 * @returns {UseHashReturn} An array containing the hash value and a function to set the hash value
 *
 * @example
 * const [hash, setHash] = useHash("initial", (newHash) => console.log('Hash changed:', newHash));
 */
export const useHash = (...params) => {
  const [initialValue = '', param] = params;
  const options = typeof param === 'function' ? { onChange: param } : param;
  const enabled = options?.enabled ?? true;
  const mode = options?.mode ?? 'replace';
  const [hash, setHash] = useState(() => {
    if (typeof window === 'undefined') return initialValue;
    return getHash() || initialValue;
  });
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const set = (value) => {
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
};

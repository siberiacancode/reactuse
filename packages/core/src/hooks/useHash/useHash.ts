import { useEffect, useState } from 'react';

const getHash = () => decodeURIComponent(window.location.hash.replace('#', ''));

/** The use hash return type */
type UseHashReturn = [string, (value: string) => void];

/**
 * @name useHash
 * @description - Hook that manages the hash value
 * @category Browser
 *
 * @param {string} [initialValue] The initial hash value if no hash exists
 * @returns {UseHashReturn} An array containing the hash value and a function to set the hash value
 *
 * @example
 * const [hash, setHash] = useHash("initial");
 */
export const useHash = (
  initialValue = '',
  mode: 'initial' | 'replace' = 'replace'
): UseHashReturn => {
  const [hash, setHash] = useState(() => {
    if (typeof window === 'undefined') return initialValue;
    return getHash() || initialValue;
  });

  const set = (value: string) => {
    window.location.hash = value;
    setHash(value);
  };

  useEffect(() => {
    if (mode === 'replace') window.location.hash = hash;

    const onHashChange = () => setHash(getHash());
    window.addEventListener('hashchange', onHashChange);
    return () => {
      window.removeEventListener('hashchange', onHashChange);
    };
  }, []);

  return [hash, set] as const;
};

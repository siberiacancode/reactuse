import { useEffect, useState } from 'react';
const getHash = () => decodeURIComponent(window.location.hash.replace('#', ''));
/**
 * @name useHash
 * @description - Hook that manages the hash value
 * @category State
 * @usage low
 *
 * @param {string} [initialValue] The initial hash value if no hash exists
 * @returns {UseHashReturn} An array containing the hash value and a function to set the hash value
 *
 * @example
 * const [hash, setHash] = useHash("initial");
 */
export const useHash = (initialValue = '', mode = 'replace') => {
  const [hash, setHash] = useState(() => {
    if (typeof window === 'undefined') return initialValue;
    return getHash() || initialValue;
  });
  const set = (value) => {
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
  return [hash, set];
};

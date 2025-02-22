import { useEffect, useState } from 'react';
const getHash = () => decodeURIComponent(window.location.hash.replace('#', ''));
/**
 * @name useHash
 * @description - Hook that manages the hash value
 * @category Browser
 *
 * @returns {UseHashReturn} An array containing the hash value and a function to set the hash value
 *
 * @example
 * const [hash, setHash] = useHash();
 */
export const useHash = () => {
  const [hash, setHash] = useState(window ? getHash() : '');
  const set = (value) => {
    window.location.hash = value;
    setHash(value);
  };
  useEffect(() => {
    const onHashChange = () => setHash(getHash());
    window.addEventListener('hashchange', onHashChange);
    return () => {
      window.removeEventListener('hashchange', onHashChange);
    };
  });
  return [hash, set];
};

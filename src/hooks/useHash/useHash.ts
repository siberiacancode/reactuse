import React from 'react';

const getHash = () => decodeURIComponent(window.location.hash.replace('#', ''));

/** The use hash return type */
type UseHashReturn = [string, (value: string) => void];

/**
 * @name useHash
 * @description - Hook that manages the hash value
 *
 * @returns {UseHashReturn} An array containing the hash value and a function to set the hash value
 *
 * @example
 * const [hash, setHash] = useHash();
 */
export const useHash = (): UseHashReturn => {
  const [hash, setHash] = React.useState<string>(window ? getHash() : '');

  const set = (value: string) => {
    window.location.hash = value;
    setHash(value);
  };

  React.useEffect(() => {
    const onHashChange = () => setHash(getHash());
    window.addEventListener('hashchange', onHashChange);
    return () => {
      window.removeEventListener('hashchange', onHashChange);
    };
  });

  return [hash, set] as const;
};

import React from 'react';

import { useWindowEvent } from '../useWindowEvent/useWindowEvent';

const getHash = () => decodeURIComponent(window.location.hash.replace('#', ''));

/** The use hash return type */
type UseHashReturn = [string, (value: string) => void];

/**
 * @name useHash
 * @description - Hook that manages the hash value
 *
 * @returns {UseHashReturn} An array containing the hash value and a function to set the hash value
 */
export const useHash = (): UseHashReturn => {
  const [hash, setHash] = React.useState<string>(window ? getHash() : '');

  const set = (value: string) => {
    window.location.hash = value;
    setHash(value);
  };

  useWindowEvent('hashchange', () => {
    if (hash !== window.location.hash) setHash(window.location.hash);
  });

  return [hash, set] as const;
};

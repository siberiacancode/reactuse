import React from 'react';

import { useWindowEvent } from '../useWindowEvent/useWindowEvent';

const getHash = () => decodeURIComponent(window.location.hash.replace('#', ''));

export const useHash = () => {
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

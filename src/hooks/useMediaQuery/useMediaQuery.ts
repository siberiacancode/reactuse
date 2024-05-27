import React from 'react';

const getServerSnapshot = () => false;

export const useMediaQuery = (query: string) => {
  const subscribe = React.useCallback(
    (callback: () => void) => {
      const matchMedia = window.matchMedia(query);

      matchMedia.addEventListener('change', callback);
      return () => {
        matchMedia.removeEventListener('change', callback);
      };
    },
    [query]
  );

  const getSnapshot = () => window.matchMedia(query).matches;

  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
};

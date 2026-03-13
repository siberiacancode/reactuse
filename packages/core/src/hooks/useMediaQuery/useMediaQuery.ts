import { useCallback, useSyncExternalStore } from 'react';

const getServerSnapshot = () => false;

/**
 * @name useMediaQuery
 * @description - Hook that manages a media query
 * @category Browser
 * @usage medium
 *
 * @browserapi window.matchMedia https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia
 *
 * @param {string} query The media query string
 * @returns {boolean} A boolean indicating if the media query matches
 *
 * @example
 * const matches = useMediaQuery('(max-width: 768px)');
 */
export const useMediaQuery = (query: string) => {
  const subscribe = useCallback(
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

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
};

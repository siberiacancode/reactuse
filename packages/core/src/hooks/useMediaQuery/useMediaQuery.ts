import { useSyncExternalStore } from 'react';

const getServerSnapshot = () => false;

interface MediaQueryListExternalStore {
  getSnapshot: () => boolean;
  subscribe: (onStoreChange: () => void) => () => void;
}

/**
 * Module-level cache mapping media query strings to their external stores.
 * Ensures a single store instance (and a single `matchMedia` listener) per unique query.
 */
const mediaQueryListExternalStore = new Map<string, MediaQueryListExternalStore>();

/**
 * Creates a new `MediaQueryListStore` for the given query, registers it in the cache,
 * and wires up a single `change` listener on the underlying `MediaQueryList`.
 *
 * The `change` listener is added lazily (on first subscriber) and removed eagerly
 * (when the last subscriber unsubscribes), avoiding unnecessary background work.
 *
 * @param {string} query - The media query string (e.g. `'(max-width: 768px)'`)
 * @returns {MediaQueryListStore} A newly created store registered in `mediaQueryListExternalStore`
 */
const createMediaQueryExternalStore = (query: string): MediaQueryListExternalStore => {
  const mediaQueryList = window.matchMedia(query);
  const listeners = new Set<() => void>();

  const onChange = () => {
    listeners.forEach((listener) => listener());
  };

  const store: MediaQueryListExternalStore = {
    subscribe: (onStoreChange) => {
      listeners.add(onStoreChange);

      // Attach the native listener only when the first subscriber arrives,
      // so queries with no active consumers never run background work
      if (listeners.size === 1) {
        mediaQueryList.addEventListener('change', onChange);
      }

      return () => {
        listeners.delete(onStoreChange);

        // Detach the native listener as soon as the last subscriber leaves,
        // allowing the MediaQueryList to be garbage collected if needed
        if (listeners.size === 0) {
          mediaQueryList.removeEventListener('change', onChange);
        }
      };
    },
    // Read directly from the retained instance rather than calling
    // `window.matchMedia(query)` again, which would create a throwaway object
    getSnapshot: () => mediaQueryList.matches
  };

  mediaQueryListExternalStore.set(query, store);

  return store;
};

/**
 * Returns an existing store for the given query from the cache, or creates and caches a new one.
 * Guarantees that `subscribe` and `getSnapshot` always have stable references across re-renders,
 * since the store object is created once and reused for the lifetime of the query.
 */
const getMediaQueryExternalStore = (query: string) => {
  return mediaQueryListExternalStore.get(query) ?? createMediaQueryExternalStore(query);
};

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
  const store = getMediaQueryExternalStore(query);

  return useSyncExternalStore(store.subscribe, store.getSnapshot, getServerSnapshot);
};

import { useSyncExternalStore } from 'react';
const getSnapshot = () => navigator.onLine;
const getServerSnapshot = () => false;
const subscribe = (callback) => {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
};
/**
 * @name useOnline
 * @description - Hook that manages if the user is online
 * @category Browser
 * @usage medium
 *
 * @browserapi navigator.onLine https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine
 *
 * @returns {boolean} A boolean indicating if the user is online
 *
 * @example
 * const online = useOnline();
 */
export const useOnline = () => useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

import React from 'react';

const getSnapshot = () => navigator.onLine;
const getServerSnapshot = () => false;
const subscribe = (callback: () => void) => {
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
 *
 * @returns {boolean} A boolean indicating if the user is online
 *
 * @example
 * const online = useOnline();
 */
export const useOnline = () =>
  React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

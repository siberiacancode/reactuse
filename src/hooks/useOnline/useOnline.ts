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

export const useOnline = () =>
  React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

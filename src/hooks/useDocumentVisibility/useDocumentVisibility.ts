import React from 'react';

const getSnapshot = () => document.visibilityState;
const getServerSnapshot = (): DocumentVisibilityState => 'hidden';
const subscribe = (callback: () => void) => {
  window.addEventListener('visibilitychange', callback);
  return () => {
    window.removeEventListener('visibilitychange', callback);
  };
};

export const useDocumentVisibility = () =>
  React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

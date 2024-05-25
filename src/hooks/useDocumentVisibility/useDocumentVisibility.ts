import React from 'react';

const getSnapshot = () => document.visibilityState;
const getServerSnapshot = (): DocumentVisibilityState => 'hidden';
const subscribe = (callback: () => void) => {
  window.addEventListener('visibilitychange', callback);
  return () => {
    window.removeEventListener('visibilitychange', callback);
  };
};

/**
 * @name useDocumentVisibility
 * @description – Hook that provides the current visibility state of the document via document.visibilityState
 *
 * @returns {DocumentVisibilityState} The current visibility state of the document, which can be 'visible' or 'hidden'
 *
 * @example
 * const visibilityState = useDocumentVisibility();
 */
export const useDocumentVisibility = () =>
  React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

import { useSyncExternalStore } from 'react';
const getSnapshot = () => document.visibilityState;
const getServerSnapshot = () => 'hidden';
const subscribe = (callback) => {
  document.addEventListener('visibilitychange', callback);
  return () => {
    document.removeEventListener('visibilitychange', callback);
  };
};
/**
 * @name useDocumentVisibility
 * @description – Hook that provides the current visibility state of the document
 * @category Browser
 * @usage low

 * @returns {DocumentVisibilityState} The current visibility state of the document, which can be 'visible' or 'hidden'
 *
 * @example
 * const visibilityState = useDocumentVisibility();
 */
export const useDocumentVisibility = () =>
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

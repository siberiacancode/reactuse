import { useRef, useSyncExternalStore } from 'react';

const getSnapshot = () => document.visibilityState;
const getServerSnapshot = () => 'hidden' as const;

/**
 * @name useDocumentVisibility
 * @description – Hook that provides the current visibility state of the document
 * @category Browser
 * @usage low
 *
 * @param {(state: DocumentVisibilityState) => void} [callback] The callback to execute when the visibility state changes
 * @returns {DocumentVisibilityState} The current visibility state of the document, which can be 'visible' or 'hidden'
 *
 * @example
 * const visibilityState = useDocumentVisibility();
 *
 * @example
 * const visibilityState = useDocumentVisibility((state) => {
 *   if (state === 'hidden') console.log('user left the tab');
 * });
 */
export const useDocumentVisibility = (callback?: (state: DocumentVisibilityState) => void) => {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  const subscribe = (onStoreChange: () => void) => {
    const handler = () => {
      callbackRef.current?.(document.visibilityState);
      onStoreChange();
    };
    document.addEventListener('visibilitychange', handler);
    return () => {
      document.removeEventListener('visibilitychange', handler);
    };
  };

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
};

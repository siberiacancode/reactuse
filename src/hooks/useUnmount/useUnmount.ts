import { useEffect, useRef } from 'react';

/**
 * @name useUnmount
 * @description - Hook that defines the logic when unmounting a component
 * @category Component
 *
 * @param {() => void} callback The callback function to be invoked on component unmount
 * @returns {void}
 *
 * @example
 * useUnmount(() => console.log('This effect runs on component unmount'));
 */

export const useUnmount = (callback: () => void) => {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(
    () => () => {
      callbackRef.current();
    },
    []
  );
};

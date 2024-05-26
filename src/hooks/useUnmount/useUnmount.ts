import React from 'react';

/**
 * @name useUnmount
 * @description - Hook that defines the logic when unmounting a component
 *
 * @param {() => void} callback The callback function to be invoked on component unmount
 * @returns {void}
 *
 * @example
 * useUnmount(() => console.log('Component unmounted'));
 */

export const useUnmount = (callback: () => void) => {
  const callbackRef = React.useRef(callback);
  callbackRef.current = callback;

  React.useEffect(
    () => () => {
      callbackRef.current();
    },
    []
  );
};

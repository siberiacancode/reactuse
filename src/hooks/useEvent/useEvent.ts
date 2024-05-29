import React from 'react';

import { useIsomorphicLayoutEffect } from '../useIsomorphicLayoutEffect/useIsomorphicLayoutEffect';

export const useEvent = <Params extends unknown[], Return>(
  callback: (...args: Params) => Return
): ((...args: Params) => Return) => {
  const callbackRef = React.useRef<typeof callback>(callback);

  useIsomorphicLayoutEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return React.useCallback((...args) => {
    const fn = callbackRef.current;
    return fn(...args);
  }, []);
};

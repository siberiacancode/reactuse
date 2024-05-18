import React from 'react';

import { useIsomorphicLayoutEffect } from '../useIsomorphicLayoutEffect/useIsomorphicLayoutEffect';

export function useTimeout(callback: () => void, delay: number) {
  const [ready, setReady] = React.useState(false);
  const internalCallbackRef = React.useRef(callback);
  const timeoutRef = React.useRef<NodeJS.Timeout>();

  useIsomorphicLayoutEffect(() => {
    internalCallbackRef.current = callback;
  }, [callback]);

  React.useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      internalCallbackRef.current();
      setReady(true);
    }, delay);

    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, [delay]);

  const clear = () => {
    clearTimeout(timeoutRef.current);
    setReady(true);
  };

  return { ready, clear };
}

import { useCallback, useRef } from 'react';

export function useEvent<T extends (...args: any[]) => any>(callback: T): T {
  const callbackRef = useRef(callback);

  callbackRef.current = callback;

  return useCallback(function (this: any, ...args: any[]) {
    return callbackRef.current.apply(this, args);
  }, []) as T;
}

import { useCallback, useEffect, useMemo, useRef } from 'react';

import type { DebouncedCallback } from '@/utils/helpers';

import { debounce } from '@/utils/helpers';

import { useEvent } from '../useEvent/useEvent';

/**
 * @name useDebounceCallback
 * @description - Hook that creates a debounced callback
 * @category Utilities
 *
 * @template Params The type of the params
 * @template Return The type of the return
 * @param {(...args: Params) => Return} callback The callback function
 * @param {number} delay The delay in milliseconds
 * @returns {(...args: Params) => Return} The callback with debounce
 *
 * @example
 * const debouncedCallback = useDebounceCallback(() => console.log('callback'), 500);
 */
export const useDebounceCallback = <Params extends unknown[], Return>(
  callback: (...args: Params) => Return,
  delay: number
) => {
  const mounted = useRef<boolean>(false);
  const lastDebounced = useRef<DebouncedCallback<Params> | null>(null);

  const internalCallback = useEvent(callback);
  const debounced = useMemo(() => debounce(internalCallback, delay), [internalCallback, delay]);
  const safeDebounced = useCallback(
    (...args: Params) => {
      lastDebounced.current?.cancel();
      debounced(...args);
    },
    [debounced]
  );

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(
    () => () => {
      if (mounted.current) {
        lastDebounced.current = debounced;
      }
    },
    [debounced]
  );

  return safeDebounced;
};

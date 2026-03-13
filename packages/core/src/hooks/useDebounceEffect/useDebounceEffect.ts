import type { DependencyList, EffectCallback } from 'react';

import { useEffect, useRef } from 'react';

/**
 * @name useDebounceEffect
 * @description – Hook that runs an effect after a delay when dependencies change
 * @category Utilities
 * @usage high
 *
 * @param {EffectCallback} effect The effect callback to run
 * @param {number} delay The delay in milliseconds
 * @param {DependencyList} deps The dependencies list for the effect
 *
 * @example
 * useDebounceEffect(() => console.log('effect'), 500, [value]);
 */
export const useDebounceEffect = (effect: EffectCallback, delay: number, deps?: DependencyList) => {
  const mountedRef = useRef(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cleanupRef = useRef<ReturnType<EffectCallback>>(undefined);
  const effectRef = useRef(effect);
  const delayRef = useRef(delay);

  effectRef.current = effect;
  delayRef.current = delay;

  useEffect(() => {
    if (mountedRef.current) {
      mountedRef.current = false;
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    timeoutRef.current = setTimeout(() => {
      cleanupRef.current = effectRef.current();
    }, delayRef.current);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
      if (typeof cleanupRef.current === 'function') cleanupRef.current();
    };
  }, deps);
};

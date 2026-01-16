import type { DependencyList, EffectCallback } from 'react';

import { useEffect, useRef } from 'react';

/**
 * @name useThrottleEffect
 * @description – Hook that runs an effect at most once per delay period when dependencies change
 * @category Utilities
 * @usage medium
 *
 * @param {EffectCallback} effect The effect callback to run
 * @param {number} delay The delay in milliseconds
 * @param {DependencyList} deps The dependencies list for the effect
 *
 * @example
 * useThrottleEffect(() => console.log('effect'), 500, [value]);
 */
export const useThrottleEffect = (effect: EffectCallback, delay: number, deps?: DependencyList) => {
  const mountedRef = useRef(true);
  const cleanupRef = useRef<ReturnType<EffectCallback>>(undefined);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isCalledRef = useRef(false);

  const effectRef = useRef(effect);
  const delayRef = useRef(delay);

  effectRef.current = effect;
  delayRef.current = delay;

  useEffect(() => {
    if (mountedRef.current) {
      mountedRef.current = false;
      return;
    }

    if (isCalledRef.current) return;

    cleanupRef.current = effectRef.current();
    isCalledRef.current = true;

    setTimeout(() => {
      isCalledRef.current = false;

      timeoutRef.current = setTimeout(() => {
        cleanupRef.current = effectRef.current();
      }, delayRef.current);
    }, delayRef.current);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
      if (typeof cleanupRef.current === 'function') cleanupRef.current();
    };
  }, deps);
};

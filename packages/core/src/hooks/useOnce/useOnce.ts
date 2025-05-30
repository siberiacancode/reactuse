import type { EffectCallback } from 'react';

import { useEffect, useRef } from 'react';

/**
 * @name useEffectOnce
 * @description - Hook that runs an effect only once. Please do not use it in production code!
 * @category Humor
 *
 * @warning - This hook will run effect only once even in strict mode. Please do not use it in production code!
 *
 * @param {EffectCallback} effect The effect to run
 *
 * @example
 * useOnce(() => console.log('effect once'));
 */
export function useOnce(effect: EffectCallback) {
  const cleanupRef = useRef<ReturnType<EffectCallback>>(undefined);
  const hasRunRef = useRef(false);
  const hasRenderedAfterRun = useRef(false);

  if (hasRunRef.current) {
    hasRenderedAfterRun.current = true;
  }

  useEffect(() => {
    if (hasRunRef.current) return;

    hasRunRef.current = true;
    cleanupRef.current = effect();

    return () => {
      if (!hasRenderedAfterRun.current) return;

      if (typeof cleanupRef.current === 'function') {
        cleanupRef.current();
      }
    };
  }, []);
}

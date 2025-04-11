import { useRef } from 'react';
import { useIsomorphicLayoutEffect } from '../useIsomorphicLayoutEffect/useIsomorphicLayoutEffect';
/**
 * @name useDidUpdate
 * @description – Hook that triggers the effect callback on updates
 * @category Lifecycle
 *
 * @param {EffectCallback} effect The effect callback
 * @param {DependencyList} [deps] The dependencies list for the effect
 *
 * @example
 * useDidUpdate(() => console.log("effect runs on updates"), deps);
 */
export const useDidUpdate = (effect, deps) => {
  const hasRunRef = useRef(false);
  const hasRenderedAfterRun = useRef(false);
  if (hasRunRef.current) {
    hasRenderedAfterRun.current = true;
  }
  useIsomorphicLayoutEffect(() => {
    hasRunRef.current = true;
  }, []);
  useIsomorphicLayoutEffect(() => {
    if (!hasRenderedAfterRun.current) {
      return;
    }
    const effectReturns = effect();
    if (effectReturns && typeof effectReturns === 'function') {
      return effectReturns;
    }
  }, deps);
};

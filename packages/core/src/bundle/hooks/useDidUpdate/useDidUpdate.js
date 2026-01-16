import { useRef } from 'react';
import { useIsomorphicLayoutEffect } from '../useIsomorphicLayoutEffect/useIsomorphicLayoutEffect';
/**
 * @name useDidUpdate
 * @description – Hook that triggers the effect callback on updates
 * @category Lifecycle
 * @usage necessary

 * @param {EffectCallback} effect The effect callback
 * @param {DependencyList} [deps] The dependencies list for the effect
 *
 * @example
 * useDidUpdate(() => console.log("effect runs on updates"), deps);
 */
export const useDidUpdate = (effect, deps) => {
  const mountedRef = useRef(false);
  useIsomorphicLayoutEffect(
    () => () => {
      mountedRef.current = false;
    },
    []
  );
  useIsomorphicLayoutEffect(() => {
    if (mountedRef.current) {
      return effect();
    }
    mountedRef.current = true;
    return undefined;
  }, deps);
};

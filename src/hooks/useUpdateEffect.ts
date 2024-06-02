import { useEffect, useRef } from 'react';

/**
 * @name useUpdateEffect
 * @description - Hook that runs an effect only on subsequent renders
 *
 * @param {EffectCallback} effect The effect function to run
 * @param {DependencyList} dependencies The dependencies to watch for changes
 *
 * @example
 * useUpdateEffect(() => {
 *   // Code to run on subsequent renders
 * }, [dependencies]);
 */
export const useUpdateEffect: typeof useEffect = (effect, dependencies) => {
  const isMounted = useRef(false);

  useEffect(() => {
    if (isMounted.current) {
      effect();
    } else {
      isMounted.current = true;
    }
  }, dependencies);
};

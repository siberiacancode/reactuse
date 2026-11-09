import { useEffect, useRef } from 'react';
import { deepEqual } from '@/helpers/deepEqual/deepEqual';
/**
 * @name useCompareEffect
 * @description - Hook that executes an effect only when the compare function reports a dependency as changed
 * @category Lifecycle
 * @usage low
 *
 * @param {EffectCallback} effect The effect callback
 * @param {DependencyList} [deps] The dependencies list for the effect
 * @param {CompareFunction} [compare=deepEqual] The function that returns `true` when a dependency is equal to its previous value
 *
 * @example
 * useCompareEffect(() => console.log("effect"), [user]);
 */
export const useCompareEffect = (effect, deps, compare = deepEqual) => {
  const committedRef = useRef(undefined);
  const committed = committedRef.current;
  const committedDeps = committed?.deps;
  const equal =
    !!deps &&
    !!committedDeps &&
    deps.length === committedDeps.length &&
    deps.every((dep, index) => compare(dep, committedDeps[index]));
  const signal = (committed?.signal ?? 0) + (equal ? 0 : 1);
  useEffect(() => {
    committedRef.current = { deps, signal };
    return effect();
  }, [signal]);
};

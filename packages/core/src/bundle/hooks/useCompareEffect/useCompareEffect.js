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
 * @warning - The compare function is called for each dependency separately, not for the whole list
 *
 * @example
 * useCompareEffect(() => console.log("effect"), [user]);
 *
 * @example
 * useCompareEffect(() => console.log("effect"), [user], shallowEqual);
 *
 * @example
 * useCompareEffect(() => console.log("effect"), [user], (user, prevUser) => user.id === prevUser.id);
 */
export const useCompareEffect = (effect, deps, compare = deepEqual) => {
  const depsRef = useRef(undefined);
  const signalRef = useRef(0);
  const prevDeps = depsRef.current;
  const equal =
    !!deps &&
    !!prevDeps &&
    deps.length === prevDeps.length &&
    deps.every((dep, index) => compare(dep, prevDeps[index]));
  if (!equal) signalRef.current += 1;
  depsRef.current = deps;
  useEffect(effect, [signalRef.current]);
};

import type { DependencyList, EffectCallback } from 'react';

import { useEffect, useRef } from 'react';

export const deepEqual = (a: any, b: any): boolean => {
  if (a === b) return true;
  if (a == null || b == null) return a === b;
  if (typeof a !== typeof b) return false;
  if (typeof a !== 'object') return a === b;
  if (Array.isArray(a) !== Array.isArray(b)) return false;

  if (Array.isArray(a))
    return a.length === b.length && a.every((value, index) => deepEqual(value, b[index]));

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!keysB.includes(key)) return false;
    if (!deepEqual(a[key], b[key])) return false;
  }

  return true;
};

/**
 * @name useShallowEffect
 * @description - Hook that executes an effect only when dependencies change shallowly or deeply.
 * @category Lifecycle
 *
 * @param {EffectCallback} effect The effect callback
 * @param {DependencyList} [deps] The dependencies list for the effect
 *
 * @example
 * useShallowEffect(() => console.log("effect"), [user]);
 */
export const useShallowEffect = (effect: EffectCallback, deps?: DependencyList) => {
  const depsRef = useRef<DependencyList>(deps);

  if (!depsRef.current || !deepEqual(deps, depsRef.current)) {
    depsRef.current = deps;
  }

  useEffect(effect, depsRef.current);
};

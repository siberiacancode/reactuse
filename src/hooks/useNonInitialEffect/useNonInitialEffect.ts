import React from 'react';

import { useIsomorphicLayoutEffect } from '../useIsomorphicLayoutEffect/useIsomorphicLayoutEffect';

/**
 * @name useNonInitialEffect
 * @description – Hook that behaves like useEffect, but skips the effect on the initial render
 *
 * @param {React.EffectCallback} effect Similar to the effect callback in useEffect
 * @param {React.DependencyList} [deps] Similar to the dependencies list in useEffect
 *
 * @example
 * useNonInitialEffect(() => {
 *   console.log('This effect runs after the initial render');
 * });
 */
export const useNonInitialEffect = (effect: React.EffectCallback, deps?: React.DependencyList) => {
  const initialRender = React.useRef(true);

  useIsomorphicLayoutEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }

    const effectReturns = effect();
    if (effectReturns && typeof effectReturns === 'function') {
      return effectReturns;
    }
  }, deps);
};

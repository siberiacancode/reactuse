import React from 'react';

import { useIsomorphicLayoutEffect } from '../useIsomorphicLayoutEffect/useIsomorphicLayoutEffect';

/**
 * @name useDidUpdate
 * @description – Hook that behaves like useEffect, but skips the effect on the initial render
 *
 * @param {React.EffectCallback} effect The effect callback
 * @param {React.DependencyList} [deps] The dependencies list for the effect
 *
 * @example
 * useDidUpdate(() => console.log('Won't be called when mounted'), [deps]);
 */
export const useDidUpdate = (effect: React.EffectCallback, deps?: React.DependencyList) => {
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

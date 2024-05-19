import React from 'react';

import { useIsomorphicLayoutEffect } from '../useIsomorphicLayoutEffect/useIsomorphicLayoutEffect';

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

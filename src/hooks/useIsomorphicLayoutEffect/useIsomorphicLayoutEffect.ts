import { useEffect, useLayoutEffect } from 'react';

import { isClient } from '@/utils/helpers';

/**
 * @name useIsomorphicLayoutEffect
 * @description - Hook conditionally selects either `useLayoutEffect` or `useEffect` based on the environment
 * @category Lifecycle
 *
 * @example
 * useIsomorphicLayoutEffect(() => console.log('effect'), [])
 */
export const useIsomorphicLayoutEffect = isClient ? useLayoutEffect : useEffect;

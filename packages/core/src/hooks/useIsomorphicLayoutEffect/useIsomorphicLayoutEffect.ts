import { useEffect, useLayoutEffect } from 'react';

/**
 * @name useIsomorphicLayoutEffect
 * @description - Hook conditionally selects either `useLayoutEffect` or `useEffect` based on the environment
 * @category Lifecycle
 *
 * @example
 * useIsomorphicLayoutEffect(() => console.log('effect'), [])
 */
export const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

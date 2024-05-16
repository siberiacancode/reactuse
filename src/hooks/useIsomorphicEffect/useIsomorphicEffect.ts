import React from 'react';

/**
 * Hook conditionally selects either `useLayoutEffect` or `useEffect` based on the environment
 */
export const useIsomorphicEffect =
  typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;

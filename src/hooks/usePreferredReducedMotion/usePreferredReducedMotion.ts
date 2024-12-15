import { useMediaQuery } from '../useMediaQuery/useMediaQuery';

/** The use preferred reduced motion return type */
export type UsePreferredReducedMotionReturn = 'reduce' | 'no-preference';

/**
 * @name usePreferredReducedMotion
 * @description - Hook that returns the reduced motion preference
 * @category Browser
 *
 * @returns {UsePreferredReducedMotionReturn} The reduced motion preference
 *
 * @example
 * const reduced = usePreferredReducedMotion();
 */
export const usePreferredReducedMotion = (): UsePreferredReducedMotionReturn => {
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  return reduced ? 'reduce' : 'no-preference';
};

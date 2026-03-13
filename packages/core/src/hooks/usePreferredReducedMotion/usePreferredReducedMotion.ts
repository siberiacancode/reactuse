import { useMediaQuery } from '../useMediaQuery/useMediaQuery';

/** The use preferred reduced motion return type */
export type UsePreferredReducedMotionReturn = 'no-preference' | 'reduce';

/**
 * @name usePreferredReducedMotion
 * @description - Hook that returns the reduced motion preference
 * @category User
 * @usage low
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

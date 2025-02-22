import { useMediaQuery } from '../useMediaQuery/useMediaQuery';
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
export const usePreferredReducedMotion = () => {
    const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');
    return reduced ? 'reduce' : 'no-preference';
};

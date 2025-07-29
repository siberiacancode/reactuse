import { useMediaQuery } from '../useMediaQuery/useMediaQuery';

/** The use preferred contrast return type */
export type UsePreferredContrastReturn = 'custom' | 'less' | 'more' | 'no-preference';

/**
 * @name usePreferredContrast
 * @description - Hook that returns the contrast preference
 * @category User
 *
 * @returns {UsePreferredContrastReturn} The contrast preference
 *
 * @example
 * const contrast = usePreferredContrast();
 */
export const usePreferredContrast = (): UsePreferredContrastReturn => {
  const more = useMediaQuery('(prefers-contrast: more)');
  const less = useMediaQuery('(prefers-contrast: less)');
  const custom = useMediaQuery('(prefers-contrast: custom)');
  return more ? 'more' : less ? 'less' : custom ? 'custom' : 'no-preference';
};

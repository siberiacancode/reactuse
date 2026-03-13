import { useMediaQuery } from '../useMediaQuery/useMediaQuery';
/**
 * @name usePreferredContrast
 * @description - Hook that returns the contrast preference
 * @category User
 * @usage medium
 *
 * @returns {UsePreferredContrastReturn} The contrast preference
 *
 * @example
 * const contrast = usePreferredContrast();
 */
export const usePreferredContrast = () => {
  const more = useMediaQuery('(prefers-contrast: more)');
  const less = useMediaQuery('(prefers-contrast: less)');
  const custom = useMediaQuery('(prefers-contrast: custom)');
  return more ? 'more' : less ? 'less' : custom ? 'custom' : 'no-preference';
};

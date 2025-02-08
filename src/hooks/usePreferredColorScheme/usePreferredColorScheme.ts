import { useMediaQuery } from '../useMediaQuery/useMediaQuery';

/** The use preferred color scheme return type */
export type UsePreferredColorSchemeReturn = 'dark' | 'light' | 'no-preference';

/**
 * @name usePreferredColorScheme
 * @description - Hook that returns user preferred color scheme
 * @category Browser
 *
 * @returns {UsePreferredColorSchemeReturn} String of preferred color scheme
 *
 * @example
 * const colorScheme = usePreferredColorScheme();
 */
export const usePreferredColorScheme = (): UsePreferredColorSchemeReturn => {
  const isLight = useMediaQuery('(prefers-color-scheme: light)');
  const isDark = useMediaQuery('(prefers-color-scheme: dark)');

  if (isLight) return 'light';
  if (isDark) return 'dark';
  return 'no-preference';
};

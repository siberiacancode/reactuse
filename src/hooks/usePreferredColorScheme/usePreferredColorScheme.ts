import { useRef } from 'react';

import { useMediaQuery } from '../useMediaQuery/useMediaQuery';

/** The color scheme type */
export type ColorSchemeType = 'dark' | 'light' | 'no-preference';

/**
 * @name usePreferredColorScheme
 * @description - Hook that returns user preferred color scheme
 *
 * @returns {ColorSchemeType} String of preferred color scheme
 *
 * @example
 * const colorScheme = usePreferredColorScheme();
 */
export const usePreferredColorScheme = (): ColorSchemeType => {
  const isLight = useRef(useMediaQuery('(prefers-color-scheme: light)'));
  const isDark = useRef(useMediaQuery('(prefers-color-scheme: dark)'));

  if (isLight.current) return 'light';
  if (isDark.current) return 'dark';
  return 'no-preference';
};

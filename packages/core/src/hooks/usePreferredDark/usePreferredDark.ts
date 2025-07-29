import { useMediaQuery } from '../useMediaQuery/useMediaQuery';

/**
 * @name usePreferredDark
 * @description - Hook that returns if the user prefers dark mode
 * @category User
 *
 * @example
 * const isDark = usePreferredDark();
 */
export const usePreferredDark = () => useMediaQuery('(prefers-color-scheme: dark)');

import { useMediaQuery } from '../useMediaQuery/useMediaQuery';

export const usePreferredContrast = () => {
  const more = useMediaQuery('(prefers-contrast: more)');
  const less = useMediaQuery('(prefers-contrast: less)');
  const custom = useMediaQuery('(prefers-contrast: custom)');
  return more ? 'more' : less ? 'less' : custom ? 'custom' : 'no-preference';
};

import { useMediaQuery } from '../useMediaQuery/useMediaQuery';

export const usePreferredReducedMotion = () => {
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  return reduced ? 'reduce' : 'no-preference';
};

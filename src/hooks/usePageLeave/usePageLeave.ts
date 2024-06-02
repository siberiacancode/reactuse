import { useEventListener } from '@/hooks';

/**
 * @name usePageLeave
 * @description - Hook what calls given function when mouse leaves the page
 *
 * @param {() => void} onPageLeave The callback function what calls then mouse leaves the page
 *
 * @example
 * usePageLeave(() => console.log('on leave'))
 */
export const usePageLeave = (onPageLeave: () => void) =>
  useEventListener(document, 'mouseleave', onPageLeave);

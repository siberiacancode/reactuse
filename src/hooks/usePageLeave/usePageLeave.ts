import { useEventListener } from '@/hooks';

/**
 * @name usePageLeave
 * @description - Hook what calls given function when mouse leaves the page
 *
 * @param {() => void} callback The callback function what calls then mouse leaves the page
 *
 * @example
 * usePageLeave(() => console.log('on leave'))
 */
export const usePageLeave = (callback: () => void) =>
  useEventListener(document, 'mouseleave', callback);

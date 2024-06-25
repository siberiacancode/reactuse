import { useRef } from 'react';

const OPTIONS_DEFAULT: ScrollIntoViewOptions = {
  /**
   * Defines the transition animation.
   * One of 'auto' or 'smooth'.
   *
   * @default 'smooth'
   */
  behavior: 'smooth',
  /**
   * Defines vertical alignment.
   * One of `'start'`, `'center'`, `'end'`, or `'nearest'`
   *
   * @default 'nearest'
   */
  block: 'nearest',
  /**
   * Defines horizontal alignment.
   * One of `start`, `center`, `end`, or `nearest`. Defaults to nearest.
   *
   * @default 'nearest'
   */
  inline: 'nearest'
};

interface UseScrollToReturn<T extends HTMLElement> {
  targetToScroll: React.RefObject<T>;
  scrollToTarget: () => void;
}

/**
 * @name useScrollTo
 * @description Hook that provides a function to smoothly scroll to a target element.
 *
 * @param {ScrollIntoViewOptions} [options=OPTIONS_DEFAULT] - Options for the scrollIntoView method.
 *
 * @returns {Object} An object containing the reference to the target element and the function to scroll to it.
 * @returns {React.RefObject<T | null>} targetToScroll - The ref object to be attached to the element you want to scroll to.
 * @returns {function} scrollToTarget - The function to call to scroll to the target element.
 *
 * @example
 * const { targetToScroll, scrollToTarget } = useScrollTo();
 */
export const useScrollTo = <T extends HTMLElement>(
  options: ScrollIntoViewOptions = OPTIONS_DEFAULT
): UseScrollToReturn<T> => {
  const targetToScroll = useRef<T | null>(null);

  const scrollToTarget = () => {
    if (!targetToScroll.current) return;
    targetToScroll.current.scrollIntoView(options);
  };

  return { targetToScroll, scrollToTarget };
};

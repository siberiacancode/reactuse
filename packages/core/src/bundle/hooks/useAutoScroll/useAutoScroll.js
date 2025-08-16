import { useEffect, useRef } from 'react';
import { getElement, isTarget } from '@/utils/helpers';
import { useRefState } from '../useRefState/useRefState';
/**
 * @name useAutoScroll
 * @description - Hook that automatically scrolls a list element to the bottom
 * @category Elements
 * @usage low
 *
 * @overload
 * @param {HookTarget} target The target element to auto-scroll
 * @param {boolean} [options.enabled] Whether auto-scrolling is enabled
 * @returns {void}
 *
 * @example
 * useAutoScroll(ref);
 *
 * @overload
 * @template Target
 * @param {boolean} [options.enabled] Whether auto-scrolling is enabled
 * @returns {StateRef<Target>} A React ref to attach to the list element
 *
 * @example
 * const ref = useAutoScroll();
 */
export const useAutoScroll = (...params) => {
  const target = isTarget(params[0]) ? params[0] : undefined;
  const options = params[1] || (typeof params[0] === 'object' ? params[0] : {});
  const { enabled = true } = options;
  const internalRef = useRefState();
  const internalOptionsRef = useRef(options);
  internalOptionsRef.current = options;
  useEffect(() => {
    if (!enabled || (!target && !internalRef.state)) return;
    const element = target ? getElement(target) : internalRef.state;
    if (!element) return;
    let shouldAutoScroll = true;
    let touchStartY = 0;
    let lastScrollTop = 0;
    const onCheckScrollPosition = () => {
      if (internalOptionsRef.current.force) return;
      const { scrollHeight, clientHeight, scrollTop } = element;
      const maxScrollHeight = scrollHeight - clientHeight;
      const scrollThreshold = maxScrollHeight / 2;
      if (scrollTop < lastScrollTop) shouldAutoScroll = false;
      else if (maxScrollHeight - scrollTop <= scrollThreshold) shouldAutoScroll = true;
      lastScrollTop = scrollTop;
    };
    const onWheel = (event) => {
      if (internalOptionsRef.current.force) return;
      if (event.deltaY < 0) shouldAutoScroll = false;
      else onCheckScrollPosition();
    };
    const onTouchStart = (event) => {
      if (internalOptionsRef.current.force) return;
      touchStartY = event.touches[0].clientY;
    };
    const onTouchMove = (event) => {
      if (internalOptionsRef.current.force) return;
      const touchEndY = event.touches[0].clientY;
      const deltaY = touchStartY - touchEndY;
      if (deltaY < 0) shouldAutoScroll = false;
      else onCheckScrollPosition();
      touchStartY = touchEndY;
    };
    const onMutation = () => {
      if (!shouldAutoScroll && !internalOptionsRef.current.force) return;
      element.scrollTo({ top: element.scrollHeight });
    };
    element.addEventListener('wheel', onWheel);
    element.addEventListener('touchstart', onTouchStart);
    element.addEventListener('touchmove', onTouchMove);
    const observer = new MutationObserver(onMutation);
    observer.observe(element, {
      childList: true,
      subtree: true,
      characterData: true
    });
    return () => {
      observer.disconnect();
      element.removeEventListener('wheel', onWheel);
      element.removeEventListener('touchstart', onTouchStart);
      element.removeEventListener('touchmove', onTouchMove);
    };
  }, [enabled, target, internalRef.state]);
  if (target) return;
  return internalRef;
};

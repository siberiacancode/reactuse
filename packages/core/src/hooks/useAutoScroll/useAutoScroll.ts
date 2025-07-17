import { useEffect } from 'react';

import type { HookTarget } from '@/utils/helpers';

import { getElement } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

import { useRefState } from '../useRefState/useRefState';

/** The use auto scroll options type */
export interface UseAutoScrollOptions {
  /** Whether auto-scrolling is enabled */
  enabled?: boolean;
}

export interface UseAutoScroll {
  (target: HookTarget, options?: UseAutoScrollOptions): void;

  <Target extends HTMLElement>(options?: UseAutoScrollOptions): StateRef<Target>;
}

/**
 * @name useAutoScroll
 * @description - Hook that automatically scrolls a list element to the bottom
 * @category Sensors
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
export const useAutoScroll = ((...params: any[]) => {
  const target = (
    typeof params[0] !== 'object' || 'current' in params[0] ? params[0] : undefined
  ) as HookTarget | undefined;
  const options = (params[1] ||
    (typeof params[0] === 'object' ? params[0] : {})) as UseAutoScrollOptions;
  const { enabled = true } = options;

  const internalRef = useRefState<HTMLElement>();

  useEffect(() => {
    if (!enabled || (!target && !internalRef.state)) return;

    const element = (target ? getElement(target) : internalRef.state) as HTMLElement;

    if (!element) return;

    let shouldAutoScroll = true;
    let touchStartY = 0;
    let lastScrollTop = 0;

    const onCheckScrollPosition = () => {
      const { scrollHeight, clientHeight, scrollTop } = element;
      const maxScrollHeight = scrollHeight - clientHeight;
      const scrollThreshold = maxScrollHeight / 2;

      if (scrollTop < lastScrollTop) shouldAutoScroll = false;
      else if (maxScrollHeight - scrollTop <= scrollThreshold) shouldAutoScroll = true;

      lastScrollTop = scrollTop;
    };

    const onWheel = (event: WheelEvent) => {
      if (event.deltaY < 0) shouldAutoScroll = false;
      else onCheckScrollPosition();
    };

    const onTouchStart = (event: TouchEvent) => {
      touchStartY = event.touches[0].clientY;
    };

    const onTouchMove = (event: TouchEvent) => {
      const touchEndY = event.touches[0].clientY;
      const deltaY = touchStartY - touchEndY;

      if (deltaY < 0) shouldAutoScroll = false;
      else onCheckScrollPosition();

      touchStartY = touchEndY;
    };

    const onMutation = () => {
      if (!shouldAutoScroll) return;
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
}) as UseAutoScroll;

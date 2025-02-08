import { type RefObject, useEffect, useRef, useState } from 'react';

import { debounce as DebounceFn, throttle as ThrottleFn } from '@/utils/helpers';

import { useEvent } from '../useEvent/useEvent';
import { useEventListener } from '../useEventListener/useEventListener';

interface UseScrollOptions {
  /** Behavior of scrolling */
  behavior?: ScrollBehavior;

  /**  Listener options for scroll event. */
  eventListenerOptions?: boolean | AddEventListenerOptions;

  /** The check time when scrolling ends. */
  idle?: number;

  /** Throttle time for scroll event, it’s disabled by default. */
  throttle?: number;

  /** The initial x position. */
  x?: number;

  /** The initial y position. */
  y?: number;

  /** On error callback. */
  onError?: (error: unknown) => void;

  /** Trigger it when scrolling. */
  onScroll?: (e: Event) => void;

  /** Trigger it when scrolling ends. */
  onStop?: (e: Event) => void;

  /** Offset arrived states by x pixels. */
  offset?: {
    left?: number;
    right?: number;
    top?: number;
    bottom?: number;
  };
}

interface useScrollReturn {
  /** State of scrolling. */
  isScrolling: boolean;

  /** The initial x position. */
  x: number;

  /** The initial y position. */
  y: number;

  /** State of arrived scroll. */
  arrivedState: {
    left: boolean;
    right: boolean;
    top: boolean;
    bottom: boolean;
  };

  /** State of scroll direction. */
  directions: {
    left: boolean;
    right: boolean;
    top: boolean;
    bottom: boolean;
  };
}

/**
 * @name useScroll
 * @category Sensors
 *
 * @description Reactive scroll position and state.
 *
 * @param {RefObject<HTMLElement>} ref - React ref object pointing to a scrollable element.
 * @param {UseScrollOptions} [options] - Optional configuration options for the hook.
 *
 * @returns {useScrollReturn} An object containing the current scroll position, scrolling state, and scroll direction.
 *
 * @example
 * const { x, y, isScrolling, arrivedState, directions } = useScroll(ref);
 */

const ARRIVED_STATE_THRESHOLD_PIXELS = 1;

export const useScroll = (
  element: RefObject<HTMLElement>,
  options?: UseScrollOptions
): useScrollReturn => {
  const {
    throttle = 0,
    idle = 200,
    x = 0,
    y = 0,
    onStop = () => {},
    onScroll = () => {},
    offset = {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    },
    eventListenerOptions = {
      capture: false,
      passive: true
    },
    behavior = 'auto',
    onError = (e: unknown) => {
      console.error(e);
    }
  } = options ?? {};

  const [scrollX, setScrollX] = useState(x);
  const [scrollY, setScrollY] = useState(y);

  const [isScrolling, setIsScrolling] = useState(false);
  const lastScrollTime = useRef<number>(Date.now());

  const [arrivedState, setArrivedState] = useState({
    left: true,
    right: false,
    top: true,
    bottom: false
  });

  const [directions, setDirections] = useState({
    left: false,
    right: false,
    top: false,
    bottom: false
  });

  useEffect(() => {
    if (element.current) {
      element.current.scrollTo({
        left: x,
        top: y,
        behavior
      });
    }
  }, [x, y, element, behavior]);

  const onScrollEnd = DebounceFn((e: Event) => {
    const currentTime = Date.now();
    if (currentTime - lastScrollTime.current >= idle) {
      setIsScrolling(false);
      setDirections({ left: false, right: false, top: false, bottom: false });
      onStop(e);
    }
  }, throttle + idle);

  const onScrollHandler = useEvent((e: Event) => {
    try {
      const eventTarget = (
        e.target === document ? (e.target as Document).documentElement : e.target
      ) as HTMLElement;
      const scrollLeft = eventTarget.scrollLeft;
      let scrollTop = eventTarget.scrollTop;

      if (e.target === document && !scrollTop) scrollTop = document.body.scrollTop;

      setScrollX(scrollLeft);
      setScrollY(scrollTop);
      setDirections({
        left: scrollLeft < scrollX,
        right: scrollLeft > scrollX,
        top: scrollTop < scrollY,
        bottom: scrollTop > scrollY
      });
      setArrivedState({
        left: scrollLeft <= 0 + (offset.left || 0),
        right:
          scrollLeft + eventTarget.clientWidth >=
          eventTarget.scrollWidth - (offset.right || 0) - ARRIVED_STATE_THRESHOLD_PIXELS,
        top: scrollTop <= 0 + (offset.top || 0),
        bottom:
          scrollTop + eventTarget.clientHeight >=
          eventTarget.scrollHeight - (offset.bottom || 0) - ARRIVED_STATE_THRESHOLD_PIXELS
      });
      setIsScrolling(true);
      lastScrollTime.current = Date.now();
      onScrollEnd(e);
      onScroll(e);
    } catch (error) {
      onError(error);
    }
  });

  const throttleOnScroll = ThrottleFn(onScrollHandler, throttle);

  useEventListener(
    element,
    'scroll',
    throttle ? throttleOnScroll : onScrollHandler,
    eventListenerOptions
  );

  return { x: scrollX, y: scrollY, isScrolling, arrivedState, directions };
};

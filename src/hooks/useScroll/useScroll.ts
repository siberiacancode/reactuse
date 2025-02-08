import type { RefObject } from 'react';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';

import { getElement, isTarget } from '@/utils/helpers';

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

interface UseScrollReturn {
  /** State of scrolling */
  scrolling: boolean;
  /** The element x position */
  x: number;
  /** The element y position */
  y: number;
  /** State of scroll arrived */
  arrived: {
    left: boolean;
    right: boolean;
    top: boolean;
    bottom: boolean;
  };
  /** State of scroll direction */
  directions: {
    left: boolean;
    right: boolean;
    top: boolean;
    bottom: boolean;
  };
}

/** The use scroll target element type */
export type UseScrollTarget =
  | (() => Element)
  | string
  | Document
  | Element
  | RefObject<Element | null | undefined>
  | Window;

export interface UseScroll {
  <Target extends UseScrollTarget>(target: Target, options?: UseScrollOptions): UseScrollReturn;

  <Target extends UseScrollTarget>(
    options?: UseScrollOptions,
    target?: never
  ): { ref: (node: Target) => void } & UseScrollReturn;
}

/**
 * @name useScroll
 * @description - Hook that allows you to control scroll a element
 * @category Sensors
 *
 * @param {RefObject<HTMLElement>} ref - React ref object pointing to a scrollable element.
 * @param {UseScrollOptions} [options] - Optional configuration options for the hook.
 * @returns {useScrollReturn} An object containing the current scroll position, scrolling state, and scroll direction.
 *
 * @example
 * const { x, y, isScrolling, arrivedState, directions } = useScroll(ref);
 */
const ARRIVED_STATE_THRESHOLD_PIXELS = 1;

export const useScroll = ((...params: any[]) => {
  const target = (isTarget(params[0]) ? params[0] : undefined) as UseScrollTarget | undefined;
  const options = (target ? params[1] : params[0]) as UseScrollOptions | undefined;
  const [internalRef, setInternalRef] = useState<Element>();
  const internalOptionsRef = useRef(options);
  internalOptionsRef.current = options;

  const { x = 0, y = 0, behavior = 'auto' } = options ?? {};

  const [scroll, setScroll] = useState({
    x,
    y,
    arrived: {
      left: true,
      right: false,
      top: true,
      bottom: false
    },
    directions: {
      left: false,
      right: false,
      top: false,
      bottom: false
    }
  });

  const [scrolling, setScrolling] = useState(false);
  const lastScrollTime = useRef<number>(Date.now());

  useLayoutEffect(() => {
    if (!target && !internalRef) return;
    const element = (target ? getElement(target) : internalRef) as Element;

    if (!element) return;

    element.scrollTo({
      left: x,
      top: y,
      behavior
    });
  }, [x, y]);

  // const onScrollEnd = DebounceFn((e: Event) => {
  //   const currentTime = Date.now();
  //   if (currentTime - lastScrollTime.current >= idle) {
  //     setIsScrolling(false);
  //     setDirections({ left: false, right: false, top: false, bottom: false });
  //     onStop(e);
  //   }
  // }, throttle + idle);

  // const throttleOnScroll = throttle(onScrollHandler, throttle);

  useEffect(() => {
    if (!target && !internalRef) return;
    const element = (target ? getElement(target) : internalRef) as Element;

    if (!element) return;

    const onScrollEnd = (event: Event) => {
      setScrolling(false);
      setScroll((prevScroll) => ({
        ...prevScroll,
        directions: {
          left: false,
          right: false,
          top: false,
          bottom: false
        }
      }));
      options?.onStop?.(event);
    };

    const onScroll = (event: Event) => {
      try {
        const target = (
          event.target === document ? (event.target as Document).documentElement : event.target
        ) as HTMLElement;

        const { display, flexDirection, direction } = target.style;
        const directionMultipler = direction === 'rtl' ? -1 : 1;

        const scrollLeft = target.scrollLeft;
        let scrollTop = target.scrollTop;
        if (target === window.document && !scrollTop) scrollTop = window.document.body.scrollTop;

        const offset = internalOptionsRef.current?.offset;
        const left = scrollLeft * directionMultipler <= (offset?.left ?? 0);
        const right =
          scrollLeft * directionMultipler + target.clientWidth >=
          target.scrollWidth - (offset?.right ?? 0) - ARRIVED_STATE_THRESHOLD_PIXELS;
        const top = scrollTop <= (offset?.top ?? 0);
        const bottom =
          scrollTop + target.clientHeight >=
          target.scrollHeight - (offset?.bottom ?? 0) - ARRIVED_STATE_THRESHOLD_PIXELS;

        const isColumnReverse = display === 'flex' && flexDirection === 'column-reverse';
        const isRowReverse = display === 'flex' && flexDirection === 'column-reverse';

        setScrolling(true);
        setScroll((prevScroll) => ({
          x: scrollLeft,
          y: scrollTop,
          directions: {
            left: scrollLeft < prevScroll.x,
            right: scrollLeft > prevScroll.x,
            top: scrollTop < prevScroll.y,
            bottom: scrollTop > prevScroll.y
          },
          arrived: {
            left: isRowReverse ? right : left,
            right: isRowReverse ? left : right,
            top: isColumnReverse ? bottom : top,
            bottom: isColumnReverse ? top : bottom
          }
        }));

        lastScrollTime.current = Date.now();
        internalOptionsRef.current?.onScroll?.(event);
      } catch (error) {
        internalOptionsRef.current?.onError?.(error);
      }
    };

    element.addEventListener('scroll', onScroll);
    element.addEventListener('scrollend', onScrollEnd);

    return () => {
      element.removeEventListener('scroll', onScroll);
      element.removeEventListener('scrollend', onScrollEnd);
    };
  }, [target, internalRef]);

  if (target) return { ...scroll, scrolling };
  return { ref: setInternalRef, ...scroll, scrolling };
}) as UseScroll;

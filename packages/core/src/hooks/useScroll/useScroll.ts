import type { RefObject } from 'react';

import { useEffect, useRef, useState } from 'react';

import { getElement, isTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

import { useRefState } from '../useRefState/useRefState';

const ARRIVED_STATE_THRESHOLD_PIXELS = 1;

/** The use scroll target element type */
export type UseScrollTarget =
  | string
  | Document
  | Element
  | RefObject<Element | null | undefined>
  | Window;

export interface UseScrollOptions {
  /** The on scroll callback */
  onScroll?: (params: UseScrollCallbackParams, event: Event) => void;

  /** The on end scroll callback */
  onStop?: (event: Event) => void;

  /** Offset arrived states by x pixels. */
  offset?: {
    left?: number;
    right?: number;
    top?: number;
    bottom?: number;
  };
}

export interface UseScrollCallbackParams {
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

export interface UseScroll {
  <Target extends UseScrollTarget>(
    target: Target,
    callback?: (params: UseScrollCallbackParams, event: Event) => void
  ): boolean;

  <Target extends UseScrollTarget>(target: Target, options?: UseScrollOptions): boolean;

  <Target extends UseScrollTarget>(
    callback?: (params: UseScrollCallbackParams, event: Event) => void,
    target?: never
  ): [StateRef<Target>, boolean];

  <Target extends UseScrollTarget>(
    options?: UseScrollOptions,
    target?: never
  ): [StateRef<Target>, boolean];
}

/**
 * @name useScroll
 * @description - Hook that allows you to control scroll a element
 * @category Sensors
 *
 * @overload
 * @template Target The target element
 * @param {ScrollBehavior} [options.behavior=auto] The behavior of scrolling
 * @param {number} [options.offset.left=0] The left offset for arrived states
 * @param {number} [options.offset.right=0]  The right offset for arrived states
 * @param {number} [options.offset.top=0] The top offset for arrived states
 * @param {number} [options.offset.bottom=0] The bottom offset for arrived states
 * @param {(params: UseScrollCallbackParams, event: Event) => void} [options.onScroll] The callback function to be invoked on scroll
 * @param {(event: Event) => void} [options.onStop] The callback function to be invoked on scroll end
 * @returns {boolean} The state of scrolling
 *
 * @example
 * const scrolling = useScroll(ref, options);
 *
 * @overload
 * @template Target The target element
 * @param {(params: UseScrollCallbackParams, event: Event) => void} [callback] The callback function to be invoked on scroll
 * @returns {boolean} The state of scrolling
 *
 * @example
 * const scrolling = useScroll(ref, () => console.log('callback'));
 *
 * @overload
 * @template Target The target element
 * @param {Target} target The target element to scroll
 * @param {ScrollBehavior} [options.behavior=auto] The behavior of scrolling
 * @param {number} [options.offset.left=0] The left offset for arrived states
 * @param {number} [options.offset.right=0]  The right offset for arrived states
 * @param {number} [options.offset.top=0] The top offset for arrived states
 * @param {number} [options.offset.bottom=0] The bottom offset for arrived states
 * @param {(params: UseScrollCallbackParams, event: Event) => void} [options.onScroll] The callback function to be invoked on scroll
 * @param {(event: Event) => void} [options.onStop] The callback function to be invoked on scroll end
 * @returns {[StateRef<Target>, boolean]} The state of scrolling
 *
 * @example
 * const [ref, scrolling] = useScroll(options);
 *
 * @overload
 * @template Target The target element
 * @param {Target} target The target element to scroll
 * @param {(params: UseScrollCallbackParams, event: Event) => void} [callback] The callback function to be invoked on scroll
 * @returns {[StateRef<Target>, boolean]} The state of scrolling
 *
 * @example
 * const [ref, scrolling] = useScroll(() => console.log('callback'));
 */
export const useScroll = ((...params: any[]) => {
  const target = (isTarget(params[0]) ? params[0] : undefined) as UseScrollTarget | undefined;
  const options = (
    target
      ? typeof params[1] === 'object'
        ? params[1]
        : { onScroll: params[1] }
      : typeof params[0] === 'object'
        ? params[0]
        : { onScroll: params[0] }
  ) as UseScrollOptions | undefined;

  const internalRef = useRefState<Element>();
  const internalOptionsRef = useRef(options);
  internalOptionsRef.current = options;

  const [scrolling, setScrolling] = useState(false);
  const scrollPositionRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!target && !internalRef.state) return;
    const element = (target ? getElement(target) : internalRef.current) as Element;

    if (!element) return;

    const onScrollEnd = (event: Event) => {
      setScrolling(false);
      options?.onStop?.(event);
    };

    const onScroll = (event: Event) => {
      setScrolling(true);
      const target = (
        event.target === document ? (event.target as Document).documentElement : event.target
      ) as HTMLElement;

      const { display, flexDirection, direction } = target.style;
      const directionMultiplier = direction === 'rtl' ? -1 : 1;

      const scrollLeft = target.scrollLeft;
      let scrollTop = target.scrollTop;
      if (target instanceof Document && !scrollTop) scrollTop = window.document.body.scrollTop;

      const offset = internalOptionsRef.current?.offset;
      const left = scrollLeft * directionMultiplier <= (offset?.left ?? 0);
      const right =
        scrollLeft * directionMultiplier + target.clientWidth >=
        target.scrollWidth - (offset?.right ?? 0) - ARRIVED_STATE_THRESHOLD_PIXELS;
      const top = scrollTop <= (offset?.top ?? 0);
      const bottom =
        scrollTop + target.clientHeight >=
        target.scrollHeight - (offset?.bottom ?? 0) - ARRIVED_STATE_THRESHOLD_PIXELS;

      const isColumnReverse = display === 'flex' && flexDirection === 'column-reverse';
      const isRowReverse = display === 'flex' && flexDirection === 'column-reverse';

      const params = {
        x: scrollLeft,
        y: scrollTop,
        directions: {
          left: scrollLeft < scrollPositionRef.current.x,
          right: scrollLeft > scrollPositionRef.current.x,
          top: scrollTop < scrollPositionRef.current.y,
          bottom: scrollTop > scrollPositionRef.current.y
        },
        arrived: {
          left: isRowReverse ? right : left,
          right: isRowReverse ? left : right,
          top: isColumnReverse ? bottom : top,
          bottom: isColumnReverse ? top : bottom
        }
      };

      scrollPositionRef.current = { x: scrollLeft, y: scrollTop };
      internalOptionsRef.current?.onScroll?.(params, event);
    };

    element.addEventListener('scroll', onScroll);
    element.addEventListener('scrollend', onScrollEnd);

    return () => {
      element.removeEventListener('scroll', onScroll);
      element.removeEventListener('scrollend', onScrollEnd);
    };
  }, [target, internalRef.state]);

  if (target) return scrolling;
  return [internalRef, scrolling];
}) as UseScroll;

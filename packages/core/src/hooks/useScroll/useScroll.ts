import { useEffect, useRef } from 'react';

import type { HookTarget } from '@/utils/helpers';

import { isTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

import { useRefState } from '../useRefState/useRefState';
import { useRerender } from '../useRerender/useRerender';

const ARRIVED_STATE_THRESHOLD_PIXELS = 1;

export interface UseScrollOptions {
  /** Offset arrived states by x pixels. */
  offset?: {
    left?: number;
    right?: number;
    top?: number;
    bottom?: number;
  };

  /** The on scroll callback */
  onScroll?: (params: UseScrollCallbackParams, event: Event) => void;

  /** The on end scroll callback */
  onStop?: (event: Event) => void;
}

export interface UseScrollCallbackParams {
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
  /** The element x position */
  x: number;
  /** The element y position */
  y: number;
}

/** The scroll into view params type */
export interface ScrollIntoViewParams {
  behavior?: ScrollBehavior;
  block?: ScrollLogicalPosition;
  inline?: ScrollLogicalPosition;
}
/** The scroll to params type */
export interface ScrollToParams {
  behavior?: ScrollBehavior;
  x: number;
  y: number;
}

/** The use scroll return type */
export interface UseScrollReturn {
  /** The latest scroll value snapshot */
  snapshot: UseScrollCallbackParams;
  /** Function to scroll element into view */
  scrollIntoView: (params?: ScrollIntoViewParams) => void;
  /** Function to scroll element to a specific position */
  scrollTo: (params?: ScrollToParams) => void;
  /** Function to enable subscriptions and rerender on next updates */
  watch: () => UseScrollCallbackParams;
}

export interface UseScroll {
  (
    target?: HookTarget,
    callback?: (params: UseScrollCallbackParams, event: Event) => void
  ): UseScrollReturn;

  (target: HookTarget, options?: UseScrollOptions): UseScrollReturn;

  <Target extends Element>(
    callback?: (params: UseScrollCallbackParams, event: Event) => void,
    target?: never
  ): UseScrollReturn & { ref: StateRef<Target> };

  <Target extends Element>(
    options?: UseScrollOptions,
    target?: never
  ): UseScrollReturn & {
    ref: StateRef<Target>;
  };
}

/**
 * @name useScroll
 * @description - Hook that allows you to control scroll a element
 * @category Sensors
 * @usage low
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
 * @returns {UseScrollReturn} The state of scrolling
 *
 * @example
 * const { scrolling, scrollIntoView, scrollTo} = useScroll(ref, options);
 *
 * @overload
 * @template Target The target element
 * @param {(params: UseScrollCallbackParams, event: Event) => void} [callback] The callback function to be invoked on scroll
 * @returns {UseScrollReturn} The state of scrolling
 *
 * @example
 * const { scrolling, scrollIntoView, scrollTo} = useScroll(ref, () => console.log('callback'));
 *
 * @overload
 * @template Target The target element
 * @param {Target} [target=window] The target element to scroll
 * @param {ScrollBehavior} [options.behavior=auto] The behavior of scrolling
 * @param {number} [options.offset.left=0] The left offset for arrived states
 * @param {number} [options.offset.right=0]  The right offset for arrived states
 * @param {number} [options.offset.top=0] The top offset for arrived states
 * @param {number} [options.offset.bottom=0] The bottom offset for arrived states
 * @param {(params: UseScrollCallbackParams, event: Event) => void} [options.onScroll] The callback function to be invoked on scroll
 * @param {(event: Event) => void} [options.onStop] The callback function to be invoked on scroll end
 * @returns {UseScrollReturn & { ref: StateRef<Target> }} The state of scrolling
 *
 * @example
 * const { ref, scrolling, scrollIntoView, scrollTo} = useScroll(options);
 *
 * @overload
 * @template Target The target element
 * @param {Target} target The target element to scroll
 * @param {(params: UseScrollCallbackParams, event: Event) => void} [callback] The callback function to be invoked on scroll
 * @returns {UseScrollReturn & { ref: StateRef<Target> }} The state of scrolling
 *
 * @example
 * const { ref, scrolling, scrollIntoView, scrollTo} = useScroll(() => console.log('callback'));
 */
export const useScroll = ((...params: any[]) => {
  const target = (isTarget(params[0]) ? params[0] : undefined) as HookTarget | undefined;
  const options = (
    target
      ? typeof params[1] === 'function'
        ? { ...params[2], onScroll: params[1] }
        : params[1]
      : typeof params[0] === 'object'
        ? params[0]
        : typeof params[0] === 'function'
          ? { ...params[1], onScroll: params[0] }
          : undefined
  ) as UseScrollOptions | undefined;

  const internalRef = useRefState<Element>();
  const internalOptionsRef = useRef(options);
  const elementRef = useRef<Element>(null);
  const snapshotRef = useRef<UseScrollCallbackParams>({
    x: 0,
    y: 0,
    directions: {
      left: false,
      right: false,
      top: false,
      bottom: false
    },
    arrived: {
      left: true,
      right: false,
      top: true,
      bottom: false
    }
  });
  const watchingRef = useRef(false);
  const rerender = useRerender();
  internalOptionsRef.current = options;

  const watch = () => {
    watchingRef.current = true;
    return snapshotRef.current;
  };
  const updateValue = (value: UseScrollCallbackParams) => {
    snapshotRef.current = value;
    if (watchingRef.current) rerender();
  };

  useEffect(() => {
    if (!target && !internalRef.state) return;
    const element =
      ((target ? isTarget.getElement(target) : internalRef.current) as Element) ?? window;

    elementRef.current = element;

    const onScrollEnd = (event: Event) => {
      internalOptionsRef.current?.onStop?.(event);
    };

    const onScroll = (event: Event) => {
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
      const isRowReverse = display === 'flex' && flexDirection === 'row-reverse';

      const updatedValue: UseScrollCallbackParams = {
        x: scrollLeft,
        y: scrollTop,
        directions: {
          left: scrollLeft < snapshotRef.current.x,
          right: scrollLeft > snapshotRef.current.x,
          top: scrollTop < snapshotRef.current.y,
          bottom: scrollTop > snapshotRef.current.y
        },
        arrived: {
          left: isRowReverse ? right : left,
          right: isRowReverse ? left : right,
          top: isColumnReverse ? bottom : top,
          bottom: isColumnReverse ? top : bottom
        }
      };

      updateValue(updatedValue);
      internalOptionsRef.current?.onScroll?.(updatedValue, event);
    };

    element.addEventListener('scroll', onScroll);
    element.addEventListener('scrollend', onScrollEnd);

    return () => {
      element.removeEventListener('scroll', onScroll);
      element.removeEventListener('scrollend', onScrollEnd);
    };
  }, [target && isTarget.getRawElement(target), internalRef.state]);

  const scrollIntoView = (params?: {
    behavior?: ScrollBehavior;
    block?: ScrollLogicalPosition;
    inline?: ScrollLogicalPosition;
  }) => {
    if (!elementRef.current) return;

    const { behavior, block, inline } = params ?? {};

    elementRef.current.scrollIntoView({
      behavior,
      block,
      inline
    });
  };

  const scrollTo = (params?: { x: number; y: number; behavior?: ScrollBehavior }) => {
    if (!elementRef.current) return;
    const { x, y, behavior } = params ?? {};

    elementRef.current.scrollTo({ left: x, top: y, behavior });
  };

  if (target) return { scrollIntoView, scrollTo, snapshot: snapshotRef.current, watch };
  return {
    ref: internalRef,
    snapshot: snapshotRef.current,
    watch,
    scrollIntoView,
    scrollTo
  };
}) as UseScroll;

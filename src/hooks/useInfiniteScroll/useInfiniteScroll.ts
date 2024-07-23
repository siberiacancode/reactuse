import type { RefObject } from 'react';
import { useEffect, useRef, useState } from 'react';

import { useEvent } from '../useEvent/useEvent';
import { useRerender } from '../useRerender/useRerender';

/** The use infinite scroll target element type */
export type UseInfiniteScrollTarget = RefObject<Element | null> | (() => Element) | Element;

const getElement = (target: UseInfiniteScrollTarget) => {
  if (typeof target === 'function') {
    return target();
  }

  if (target instanceof Element) {
    return target;
  }

  return target.current;
};

/** The use infinite scroll options type */
export interface UseInfiniteScrollOptions {
  /** The distance in pixels to trigger the callback */
  distance?: number;
  /** The direction to trigger the callback */
  direction?: 'top' | 'bottom' | 'left' | 'right';
}

export type UseInfiniteScroll = {
  <Target extends UseInfiniteScrollTarget>(
    target: Target,
    callback: (event: Event) => void,
    options?: UseInfiniteScrollOptions
  ): boolean;

  <Target extends UseInfiniteScrollTarget>(
    callback: (event: Event) => void,
    options?: UseInfiniteScrollOptions,
    target?: never
  ): {
    ref: (node: Target) => void;
    isLoading: boolean;
  };
};

/**
 * @name useInfiniteScroll
 * @description - Hook that defines the logic for infinite scroll
 * @category Sensors
 *
 * @overload
 * @template Target The target element
 * @param {(event: Event) => void} callback The callback to execute when a click outside the target is detected
 * @param {number} [options.distance=10] The distance in pixels to trigger the callback
 * @param {string} [options.direction='bottom'] The direction to trigger the callback
 * @returns {{ ref: (node: Target) => void; isLoading: boolean }} An object containing the ref and isLoading
 *
 * @example
 * const { ref, isLoading } = useInfiniteScroll(() => console.log('infinite scroll'));
 *
 * @overload
 * @template Target The target element
 * @param {Target} target The target element to detect infinite scroll for
 * @param {(event: Event) => void} callback The callback to execute when a click outside the target is detected
 * @param {number} [options.distance=10] The distance in pixels to trigger the callback
 * @param {string} [options.direction='bottom'] The direction to trigger the callback
 * @returns {boolean} A loading indicator of the infinite scroll
 *
 * @example
 * const isLoading = useInfiniteScroll(ref, () => console.log('infinite scroll'));
 */
export const useInfiniteScroll = ((...params) => {
  const rerender = useRerender();
  const target = params[1] instanceof Function ? (params[0] as UseInfiniteScrollTarget) : undefined;
  const callback = params[1] instanceof Function ? params[1] : (params[0] as () => void);
  const options = (
    params[1] instanceof Function ? params[2] : params[1]
  ) as UseInfiniteScrollOptions;

  const direction = options?.direction ?? 'bottom';
  const distance = options?.distance ?? 10;

  const [isLoading, setIsLoading] = useState(false);
  const internalRef = useRef<Element>();
  const internalCallbackRef = useRef(callback);
  internalCallbackRef.current = callback;

  const onLoadMore = useEvent(async (event: Event) => {
    if (isLoading) return;
    const { clientHeight, scrollHeight, scrollTop, clientWidth, scrollWidth, scrollLeft } =
      event.target as Element;
    const scrollBottom = scrollHeight - (scrollTop + clientHeight);
    const scrollRight = scrollWidth - (scrollLeft + clientWidth);

    const distances = {
      bottom: scrollBottom,
      top: scrollTop,
      right: scrollRight,
      left: scrollLeft
    };

    if (distances[direction] <= distance) {
      setIsLoading(true);
      await internalCallbackRef.current(event);
      setIsLoading(false);
    }
  });

  useEffect(() => {
    const element = target ? getElement(target) : internalRef.current;
    if (!element) return;

    element.addEventListener('scroll', onLoadMore);

    return () => {
      element.removeEventListener('scroll', onLoadMore);
    };
  }, [internalRef.current, target, direction, distance]);

  if (target) return isLoading;
  return {
    ref: (node: Element) => {
      if (!internalRef.current) {
        internalRef.current = node;
        rerender.update();
      }
    },
    isLoading
  };
}) as UseInfiniteScroll;

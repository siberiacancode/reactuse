import { useEffect, useRef, useState } from 'react';

import { getElement, isTarget } from '@/utils/helpers';

import { useEvent } from '../useEvent/useEvent';
import { useRefState } from '../useRefState/useRefState';
/**
 * @name useInfiniteScroll
 * @description - Hook that defines the logic for infinite scroll
 * @category Sensors
 *
 * @overload
 * @template Target The target element
 * @param {(event: Event) => void} callback The callback to execute when a click outside the target is detected
 * @param {number} [options.distance] The distance in pixels to trigger the callback
 * @param {string} [options.direction] The direction to trigger the callback
 * @returns {{ ref: StateRef<Target>, loading: boolean }} An object containing the ref and loading
 *
 * @example
 * const { ref, loading } = useInfiniteScroll(() => console.log('infinite scroll'));
 *
 * @overload
 * @template Target The target element
 * @param {Target} target The target element to detect infinite scroll for
 * @param {(event: Event) => void} callback The callback to execute when a click outside the target is detected
 * @param {number} [options.distance] The distance in pixels to trigger the callback
 * @param {string} [options.direction] The direction to trigger the callback
 * @returns {boolean} A loading indicator of the infinite scroll
 *
 * @example
 * const loading = useInfiniteScroll(ref, () => console.log('infinite scroll'));
 */
export const useInfiniteScroll = (...params) => {
  const target = isTarget(params[0]) ? params[0] : undefined;
  const callback = target ? params[1] : params[0];
  const options = target ? params[2] : params[1];
  const direction = options?.direction ?? 'bottom';
  const distance = options?.distance ?? 10;
  const [loading, setIsLoading] = useState(false);
  const internalRef = useRefState();
  const internalCallbackRef = useRef(callback);
  internalCallbackRef.current = callback;
  const onLoadMore = useEvent(async (event) => {
    if (loading) return;
    const { clientHeight, scrollHeight, scrollTop, clientWidth, scrollWidth, scrollLeft } =
      event.target;
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
    if (!target && !internalRef.state) return;
    const element = target ? getElement(target) : internalRef.current;
    if (!element) return;
    element.addEventListener('scroll', onLoadMore);
    return () => {
      element.removeEventListener('scroll', onLoadMore);
    };
  }, [target, internalRef.state, direction, distance]);
  if (target) return loading;
  return {
    ref: internalRef,
    loading
  };
};

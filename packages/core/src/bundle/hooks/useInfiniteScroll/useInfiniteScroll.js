import { useEffect, useRef, useState } from 'react';
import { isTarget } from '@/utils/helpers';
import { useRefState } from '../useRefState/useRefState';
/**
 * @name useInfiniteScroll
 * @description - Hook that defines the logic for infinite scroll
 * @category Sensors
 * @usage medium
 *
 * @overload
 * @template Target The target element
 * @param {(event?: Event) => void | Promise<void>} callback The callback to execute when the scroll reaches the configured threshold
 * @param {number} [options.distance=10] The distance in pixels to trigger the callback
 * @param {string} [options.direction='bottom'] The direction to trigger the callback
 * @param {boolean} [options.hasMore=true] Whether there is more content to load
 * @param {boolean} [options.immediately=false] Whether to keep loading while the content doesn't overflow the viewport
 * @returns {UseInfiniteScrollReturn & { ref: StateRef<Target> }} An object containing the ref and loading
 *
 * @example
 * const { ref, loading } = useInfiniteScroll(() => console.log('infinite scroll'));
 *
 * @overload
 * @param {HookTarget} target The target element to detect infinite scroll for
 * @param {(event?: Event) => void | Promise<void>} callback The callback to execute when the scroll reaches the configured threshold
 * @param {number} [options.distance=10] The distance in pixels to trigger the callback
 * @param {string} [options.direction='bottom'] The direction to trigger the callback
 * @param {boolean} [options.hasMore=true] Whether there is more content to load
 * @param {boolean} [options.immediately=false] Whether to keep loading while the content doesn't overflow the viewport
 * @returns {UseInfiniteScrollReturn} An object containing the ref and loading
 *
 * @example
 * const { loading } = useInfiniteScroll(ref, () => console.log('infinite scroll'));
 */
export const useInfiniteScroll = (...params) => {
  const target = isTarget(params[0]) ? params[0] : undefined;
  const callback = target ? params[1] : params[0];
  const options = target ? params[2] : params[1];
  const direction = options?.direction ?? 'bottom';
  const distance = options?.distance ?? 10;
  const hasMore = options?.hasMore ?? true;
  const immediately = options?.immediately ?? false;
  const isReverse = direction === 'top' || direction === 'left';
  const isVertical = direction === 'top' || direction === 'bottom';
  const [loading, setLoading] = useState(false);
  const internalRef = useRefState();
  const internalCallbackRef = useRef(callback);
  internalCallbackRef.current = callback;
  const internalLoadingRef = useRef(loading);
  internalLoadingRef.current = loading;
  const internalHasMoreRef = useRef(hasMore);
  internalHasMoreRef.current = hasMore;
  const prevSizeRef = useRef(null);
  useEffect(() => {
    if (!target && !internalRef.state) return;
    const element = target ? isTarget.getElement(target) : internalRef.current;
    if (!element) return;
    const getEdgeDistance = () => {
      const { clientHeight, scrollHeight, scrollTop, clientWidth, scrollWidth, scrollLeft } =
        element;
      switch (direction) {
        case 'bottom':
          return scrollHeight - (scrollTop + clientHeight);
        case 'top':
          return scrollTop;
        case 'right':
          return scrollWidth - (scrollLeft + clientWidth);
        case 'left':
          return scrollLeft;
      }
    };
    const getSize = () => (isVertical ? element.scrollHeight : element.scrollWidth);
    const getOverflowing = () =>
      isVertical
        ? element.scrollHeight > element.clientHeight
        : element.scrollWidth > element.clientWidth;
    const trigger = async (event) => {
      if (internalLoadingRef.current || !internalHasMoreRef.current) return;
      internalLoadingRef.current = true;
      setLoading(true);
      try {
        await internalCallbackRef.current(event);
      } finally {
        internalLoadingRef.current = false;
        setLoading(false);
      }
    };
    const onLoadMore = (event) => {
      if (getEdgeDistance() <= distance) trigger(event);
    };
    element.addEventListener('scroll', onLoadMore);
    prevSizeRef.current = getSize();
    if (immediately && !getOverflowing()) trigger();
    const observer = new MutationObserver(() => {
      if (isReverse) {
        const previous = prevSizeRef.current;
        const size = getSize();
        if (!!previous && size > previous) {
          const delta = size - previous;
          const previousBehavior = element.style.scrollBehavior;
          element.style.scrollBehavior = 'auto';
          if (isVertical) element.scrollTop += delta;
          else element.scrollLeft += delta;
          element.style.scrollBehavior = previousBehavior;
        }
        prevSizeRef.current = size;
      }
      if (immediately && !getOverflowing()) trigger();
    });
    observer.observe(element, { childList: true });
    return () => {
      element.removeEventListener('scroll', onLoadMore);
      observer.disconnect();
    };
  }, [target && isTarget.getRawElement(target), internalRef.state, direction, distance]);
  if (target) return { loading };
  return {
    ref: internalRef,
    loading
  };
};

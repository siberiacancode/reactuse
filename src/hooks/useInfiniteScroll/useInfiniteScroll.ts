import React from 'react';

export type UseInfiniteScrollTarget = React.RefObject<Element | null> | (() => Element) | Element;

const getElement = (target: UseInfiniteScrollTarget) => {
  if (typeof target === 'function') {
    return target();
  }

  if (target instanceof Element) {
    return target;
  }

  return target.current;
};

export interface UseInfiniteScrollOptions {
  distance?: number;
  direction?: 'top' | 'bottom' | 'left' | 'right';
}

export type UseInfiniteScrollReturn<Target extends UseInfiniteScrollTarget> =
  React.RefObject<Target>;

export type UseInfiniteScroll = {
  <Target extends UseInfiniteScrollTarget>(
    target: Target,
    callback: (event: Event) => void,
    options?: UseInfiniteScrollOptions
  ): void;

  <Target extends UseInfiniteScrollTarget>(
    callback: (event: Event) => void,
    options?: UseInfiniteScrollOptions,
    target?: never
  ): UseInfiniteScrollReturn<Target>;
};

export const useInfiniteScroll = ((...params) => {
  const target = params[1] instanceof Function ? (params[0] as UseInfiniteScrollTarget) : undefined;
  const callback = params[1] instanceof Function ? params[1] : (params[0] as () => void);
  const { direction = 'bottom', distance = 10 } =
    (params[1] instanceof Function ? params[2] : params[1]) ?? {};

  const internalRef = React.useRef<Element>(null);
  const internalCallbackRef = React.useRef(callback);

  React.useEffect(() => {
    internalCallbackRef.current = callback;
  }, [callback]);

  React.useEffect(() => {
    const element = target ? getElement(target) : internalRef.current;

    const onLoadMore = (event: Event) => {
      if (!element) return;

      const { clientHeight, scrollHeight, scrollTop, clientWidth, scrollWidth, scrollLeft } =
        element;
      const scrollBottom = scrollHeight - (scrollTop + clientHeight);
      const scrollRight = scrollWidth - (scrollLeft + clientWidth);

      const distances = {
        bottom: scrollBottom,
        top: scrollTop,
        right: scrollRight,
        left: scrollLeft
      };

      if (distances[direction] <= distance) {
        internalCallbackRef.current(event);
      }
    };

    element?.addEventListener('scroll', onLoadMore);

    return () => {
      element?.removeEventListener('scroll', onLoadMore);
    };
  }, [direction, distance]);

  if (target) return;
  return internalRef;
}) as UseInfiniteScroll;

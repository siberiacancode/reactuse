import type { RefObject } from 'react';
import { useEffect, useRef, useState } from 'react';

import { useRerender } from '../useRerender/useRerender';

/** The intersection observer target element type */
export type UseIntersectionObserverTarget =
  | RefObject<Element | null | undefined>
  | (() => Element)
  | Element;

/** The intersection observer options type */
export interface UseIntersectionObserverOptions extends Omit<IntersectionObserverInit, 'root'> {
  enabled?: boolean;
  onChange?: (entry: IntersectionObserverEntry) => void;
  root?: IntersectionObserverInit['root'] | RefObject<Element | null | undefined>;
}

const getTargetElement = (target: UseIntersectionObserverTarget) => {
  if (typeof target === 'function') {
    return target();
  }

  if (target instanceof Element) {
    return target;
  }

  return target.current;
};

const getRootElement = (root: UseIntersectionObserverOptions['root']) => {
  if (!root) return document;

  if (root instanceof Element) {
    return root;
  }

  if (root instanceof Document) {
    return root;
  }

  return root.current;
};

/** The intersection observer return type */
export interface UseIntersectionObserverReturn {
  inView: boolean;
  entry?: IntersectionObserverEntry;
}

export type UseIntersectionObserver = {
  <Target extends UseIntersectionObserverTarget>(
    target: Target,
    options?: UseIntersectionObserverOptions
  ): UseIntersectionObserverReturn;

  <Target extends UseIntersectionObserverTarget>(
    options?: UseIntersectionObserverOptions,
    target?: never
  ): UseIntersectionObserverReturn & { ref: (node: Target) => void };
};

/**
 * @name useIntersectionObserver
 * @description - Hook that gives you intersection observer state
 * @category Browser
 *
 * @overload
 * @template Target The target element
 * @param {Target} target The target element to detect intersection
 * @param {boolean} [options.enabled=true] The IntersectionObserver options
 * @param {((entries: IntersectionObserverEntry[], observer: IntersectionObserver) => void) | undefined} [options.onChange] The callback to execute when intersection is detected
 * @param {IntersectionObserverInit['root'] | RefObject<Element | null | undefined>} [options.root] The root element to observe
 * @returns {UseIntersectionObserverReturn} An object containing the state and the supported status
 *
 * @example
 * const { ref, entry, inView } = useIntersectionObserver();
 *
 * @overload
 * @template Target The target element
 * @param {boolean} [options.enabled=true] The IntersectionObserver options
 * @param {((entries: IntersectionObserverEntry[], observer: IntersectionObserver) => void) | undefined} [options.onChange] The callback to execute when intersection is detected
 * @param {IntersectionObserverInit['root'] | RefObject<Element | null | undefined>} [options.root] The root element to observe
 * @returns {UseIntersectionObserverReturn & { ref: (node: Target) => void }} A React ref to attach to the target element
 *
 * @example
 * const { entry, inView } = useIntersectionObserver(ref);
 */
export const useIntersectionObserver = ((...params: any[]) => {
  const rerender = useRerender();
  const target = (
    typeof params[0] === 'object' && !('current' in params[0]) ? undefined : params[0]
  ) as UseIntersectionObserverTarget | undefined;
  const options = (target ? params[1] : params[0]) as UseIntersectionObserverOptions | undefined;
  const enabled = options?.enabled ?? true;

  const [entry, setEntry] = useState<IntersectionObserverEntry>();

  const internalRef = useRef<Element>();
  const internalOnChangeRef = useRef<UseIntersectionObserverOptions['onChange']>();
  internalOnChangeRef.current = options?.onChange;

  useEffect(() => {
    if (!enabled || !internalRef.current) return;
    const element = target ? getTargetElement(target) : internalRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setEntry(entry);
        internalOnChangeRef.current?.(entry);
      },
      {
        ...options,
        root: getRootElement(options?.root)
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [
    internalRef.current,
    target,
    options?.rootMargin,
    options?.threshold,
    options?.root,
    enabled
  ]);

  if (target) return { entry, inView: !!entry?.isIntersecting };
  return {
    ref: (node: Element) => {
      if (!internalRef.current) {
        internalRef.current = node;
        rerender.update();
      }
    },
    entry,
    inView: !!entry?.isIntersecting
  };
}) as UseIntersectionObserver;

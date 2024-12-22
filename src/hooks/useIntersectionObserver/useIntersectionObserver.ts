import type { RefObject } from 'react';

import { useEffect, useRef, useState } from 'react';

import { getElement } from '@/utils/helpers';

/** The intersection observer target element type */
export type UseIntersectionObserverTarget =
  | (() => Element)
  | Element
  | RefObject<Element | null | undefined>;

/** The intersection observer options type */
export interface UseIntersectionObserverOptions extends Omit<IntersectionObserverInit, 'root'> {
  enabled?: boolean;
  root?: IntersectionObserverInit['root'] | RefObject<Element | null | undefined>;
  onChange?: (entry: IntersectionObserverEntry) => void;
}

/** The intersection observer return type */
export interface UseIntersectionObserverReturn {
  entry?: IntersectionObserverEntry;
  inView: boolean;
}

export interface UseIntersectionObserver {
  <Target extends UseIntersectionObserverTarget>(
    options?: UseIntersectionObserverOptions,
    target?: never
  ): UseIntersectionObserverReturn & { ref: (node: Target) => void };

  <Target extends UseIntersectionObserverTarget>(
    target: Target,
    options?: UseIntersectionObserverOptions
  ): UseIntersectionObserverReturn;
}

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
  const target = (
    typeof params[0] === 'object' && !('current' in params[0]) ? undefined : params[0]
  ) as UseIntersectionObserverTarget | undefined;
  const options = (target ? params[1] : params[0]) as UseIntersectionObserverOptions | undefined;
  const enabled = options?.enabled ?? true;

  const [entry, setEntry] = useState<IntersectionObserverEntry>();

  const [internalRef, setInternalRef] = useState<Element>();
  const internalOnChangeRef = useRef<UseIntersectionObserverOptions['onChange']>();
  internalOnChangeRef.current = options?.onChange;

  useEffect(() => {
    if (!enabled && !target && !internalRef) return;
    const element = target ? getElement(target) : internalRef;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setEntry(entry);
        internalOnChangeRef.current?.(entry);
      },
      {
        ...options,
        root: options?.root ? (getElement(options?.root) as Document | Element) : document
      }
    );

    observer.observe(element as Element);

    return () => {
      observer.disconnect();
    };
  }, [target, internalRef, options?.rootMargin, options?.threshold, options?.root, enabled]);

  if (target) return { entry, inView: !!entry?.isIntersecting };
  return {
    ref: setInternalRef,
    entry,
    inView: !!entry?.isIntersecting
  };
}) as UseIntersectionObserver;

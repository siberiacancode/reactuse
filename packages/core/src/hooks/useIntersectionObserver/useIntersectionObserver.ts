import { useEffect, useRef, useState } from 'react';

import type { HookTarget } from '@/utils/helpers';

import { getElement, isTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

import { useRefState } from '../useRefState/useRefState';

/** The intersection observer options type */
export interface UseIntersectionObserverOptions extends Omit<IntersectionObserverInit, 'root'> {
  enabled?: boolean;
  root?: HookTarget;
  onChange?: (entry: IntersectionObserverEntry) => void;
}

/** The intersection observer return type */
export interface UseIntersectionObserverReturn {
  entry?: IntersectionObserverEntry;
  inView: boolean;
}

export interface UseIntersectionObserver {
  <Target extends Element>(
    options?: UseIntersectionObserverOptions,
    target?: never
  ): UseIntersectionObserverReturn & { ref: StateRef<Target> };

  (target: HookTarget, options?: UseIntersectionObserverOptions): UseIntersectionObserverReturn;
}

/**
 * @name useIntersectionObserver
 * @description - Hook that gives you intersection observer state
 * @category Browser
 *
 * @browserapi IntersectionObserver https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver
 *
 * @overload
 * @param {HookTarget} target The target element to detect intersection
 * @param {boolean} [options.enabled=true] The IntersectionObserver options
 * @param {((entries: IntersectionObserverEntry[], observer: IntersectionObserver) => void) | undefined} [options.onChange] The callback to execute when intersection is detected
 * @param {HookTarget} [options.root] The root element to observe
 * @returns {UseIntersectionObserverReturn} An object containing the state
 *
 * @example
 * const { ref, entry, inView } = useIntersectionObserver();
 *
 * @overload
 * @template Target The target element
 * @param {boolean} [options.enabled=true] The IntersectionObserver options
 * @param {((entries: IntersectionObserverEntry[], observer: IntersectionObserver) => void) | undefined} [options.onChange] The callback to execute when intersection is detected
 * @param {HookTarget} [options.root] The root element to observe
 * @returns {UseIntersectionObserverReturn & { ref: StateRef<Target> }} A React ref to attach to the target element
 *
 * @example
 * const { entry, inView } = useIntersectionObserver(ref);
 */
export const useIntersectionObserver = ((...params: any[]) => {
  const target = (isTarget(params[0]) ? params[0] : undefined) as HookTarget | undefined;
  const options = (target ? params[1] : params[0]) as UseIntersectionObserverOptions | undefined;
  const enabled = options?.enabled ?? true;

  const [entry, setEntry] = useState<IntersectionObserverEntry>();

  const internalRef = useRefState<Element>();
  const internalOnChangeRef = useRef<UseIntersectionObserverOptions['onChange']>(options?.onChange);
  internalOnChangeRef.current = options?.onChange;

  useEffect(() => {
    if (!enabled && !target && !internalRef.state) return;

    const element = target ? getElement(target) : internalRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setEntry(entry);
        internalOnChangeRef.current?.(entry);
      },
      {
        ...options,
        root: options?.root ? (getElement(options.root) as Document | Element) : document
      }
    );

    observer.observe(element as Element);

    return () => {
      observer.disconnect();
    };
  }, [target, internalRef.state, options?.rootMargin, options?.threshold, options?.root, enabled]);

  if (target) return { entry, inView: !!entry?.isIntersecting };
  return {
    ref: internalRef,
    entry,
    inView: !!entry?.isIntersecting
  };
}) as UseIntersectionObserver;

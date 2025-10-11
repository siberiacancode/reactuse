import { useEffect, useRef, useState } from 'react';

import type { HookTarget } from '@/utils/helpers';

import { isTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

import { useRefState } from '../useRefState/useRefState';

/** The intersection observer callback type */
export type UseIntersectionObserverCallback = (
  entries: IntersectionObserverEntry[],
  observer: IntersectionObserver
) => void;

/** The intersection observer options type */
export interface UseIntersectionObserverOptions extends Omit<IntersectionObserverInit, 'root'> {
  /** The enabled state of the intersection observer */
  enabled?: boolean;
  /** The callback to execute when intersection is detected */
  onChange?: UseIntersectionObserverCallback;
  /** The root element to observe */
  root?: HookTarget;
}

/** The intersection observer return type */
export interface UseIntersectionObserverReturn {
  /** The intersection observer entry */
  entries?: IntersectionObserverEntry[];
  /** The intersection observer instance */
  observer?: IntersectionObserver;
}

export interface UseIntersectionObserver {
  <Target extends Element>(
    options?: UseIntersectionObserverOptions,
    target?: never
  ): UseIntersectionObserverReturn & { ref: StateRef<Target> };

  (target: HookTarget, options?: UseIntersectionObserverOptions): UseIntersectionObserverReturn;

  <Target extends Element>(
    callback: UseIntersectionObserverCallback,
    target?: never
  ): UseIntersectionObserverReturn & { ref: StateRef<Target> };

  (target: HookTarget, callback: UseIntersectionObserverCallback): UseIntersectionObserverReturn;
}

/**
 * @name useIntersectionObserver
 * @description - Hook that gives you intersection observer state
 * @category Sensors
 * @usage medium
 *
 * @browserapi IntersectionObserver https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver
 *
 * @overload
 * @param {HookTarget} target The target element to detect intersection
 * @param {boolean} [options.enabled=true] The IntersectionObserver options
 * @param {((entries: IntersectionObserverEntry[], observer: IntersectionObserver) => void) | undefined} [options.onChange] The callback to execute when intersection is detected
 * @param {HookTarget} [options.root=document] The root element to observe
 * @returns {UseIntersectionObserverReturn} An object containing the state
 *
 * @example
 * const { ref, entries, observer } = useIntersectionObserver();
 *
 * @overload
 * @template Target The target element
 * @param {boolean} [options.enabled=true] The IntersectionObserver options
 * @param {((entries: IntersectionObserverEntry[], observer: IntersectionObserver) => void) | undefined} [options.onChange] The callback to execute when intersection is detected
 * @param {HookTarget} [options.root=document] The root element to observe
 * @returns {UseIntersectionObserverReturn & { ref: StateRef<Target> }} A React ref to attach to the target element
 *
 * @example
 * const { entries, observer } = useIntersectionObserver(ref);
 *
 * @overload
 * @template Target The target element
 * @param {UseIntersectionObserverCallback} callback The callback to execute when intersection is detected
 * @returns {UseIntersectionObserverReturn & { ref: StateRef<Target> }} A React ref to attach to the target element
 *
 * @example
 * const { ref, entries, observer } = useIntersectionObserver(() => console.log('callback'));
 *
 * @overload
 * @param {UseIntersectionObserverCallback} callback The callback to execute when intersection is detected
 * @param {HookTarget} target The target element to detect intersection
 * @returns {UseIntersectionObserverReturn} An object containing the state
 *
 * @example
 * const { entries, observer } = useIntersectionObserver(ref, () => console.log('callback'));
 */
export const useIntersectionObserver = ((...params: any[]) => {
  const target = (isTarget(params[0]) ? params[0] : undefined) as HookTarget | undefined;

  const options = (
    target
      ? typeof params[1] === 'object'
        ? params[1]
        : { onChange: params[1] }
      : typeof params[0] === 'object'
        ? params[0]
        : { onChange: params[0] }
  ) as UseIntersectionObserverOptions | undefined;

  const callback = options?.onChange;
  const enabled = options?.enabled ?? true;

  const [observer, setObserver] = useState<IntersectionObserver>();
  const [entries, setEntries] = useState<IntersectionObserverEntry[]>();

  const internalRef = useRefState<Element>();
  const internalCallbackRef = useRef(callback);
  internalCallbackRef.current = callback;

  useEffect(() => {
    if (!enabled || (!target && !internalRef.state)) return;

    const element = target ? isTarget.getElement(target) : internalRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries, observer) => {
        setEntries(entries);
        internalCallbackRef.current?.(entries, observer);
      },
      {
        ...options,
        root: options?.root ? (isTarget.getElement(options.root) as Document | Element) : document
      }
    );

    setObserver(observer);
    observer.observe(element as Element);

    return () => {
      observer.disconnect();
    };
  }, [target, internalRef.state, options?.rootMargin, options?.threshold, options?.root, enabled]);

  if (target) return { observer, entries };
  return {
    observer,
    ref: internalRef,
    entries
  };
}) as UseIntersectionObserver;

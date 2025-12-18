import { useEffect, useRef, useState } from 'react';

import type { HookTarget } from '@/utils/helpers';

import { isTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

import { useRefState } from '../useRefState/useRefState';

/** The visibility callback type */
export type UseVisibilityCallback = (
  entry: IntersectionObserverEntry,
  observer: IntersectionObserver
) => void;

/** The visibility options type */
export interface UseVisibilityOptions extends Omit<IntersectionObserverInit, 'root'> {
  /** The enabled state of the intersection */
  enabled?: boolean;
  /** The callback to execute when intersection is detected */
  onChange?: UseVisibilityCallback;
  /** The root element to observe */
  root?: HookTarget;
}

/** The intersection observer return type */
export interface UseVisibilityReturn {
  /** The intersection observer entry */
  entry?: IntersectionObserverEntry;
  /** The intersection observer in view */
  inView?: boolean;

  /** The intersection observer instance */
  observer?: IntersectionObserver;
}

export interface UseVisibility {
  <Target extends Element>(
    options?: UseVisibilityOptions,
    target?: never
  ): UseVisibilityReturn & { ref: StateRef<Target> };

  (target: HookTarget, options?: UseVisibilityOptions): UseVisibilityReturn;

  <Target extends Element>(
    callback: UseVisibilityCallback,
    target?: never
  ): UseVisibilityReturn & { ref: StateRef<Target> };

  (target: HookTarget, callback: UseVisibilityCallback): UseVisibilityReturn;
}

/**
 * @name useVisibility
 * @description - Hook that gives you visibility observer state
 * @category Sensors
 * @usage medium
 *
 * @browserapi IntersectionObserver https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver
 *
 * @overload
 * @param {HookTarget} target The target element to detect intersection
 * @param {boolean} [options.enabled=true] The Intersection options
 * @param {((entries: IntersectionEntry[], observer: Intersection) => void) | undefined} [options.onChange] The callback to execute when intersection is detected
 * @param {HookTarget} [options.root=document] The root element to observe
 * @returns {UseVisibilityReturn} An object containing the state
 *
 * @example
 * const { ref, entries, observer } = useVisibility();
 *
 * @overload
 * @template Target The target element
 * @param {boolean} [options.enabled=true] The Intersection options
 * @param {((entries: IntersectionEntry[], observer: Intersection) => void) | undefined} [options.onChange] The callback to execute when intersection is detected
 * @param {HookTarget} [options.root=document] The root element to observe
 * @returns {UseVisibilityReturn & { ref: StateRef<Target> }} A React ref to attach to the target element
 *
 * @example
 * const { entries, observer } = useVisibility(ref);
 *
 * @overload
 * @template Target The target element
 * @param {UseVisibilityCallback} callback The callback to execute when intersection is detected
 * @returns {UseVisibilityReturn & { ref: StateRef<Target> }} A React ref to attach to the target element
 *
 * @example
 * const { ref, entries, observer } = useVisibility(() => console.log('callback'));
 *
 * @overload
 * @param {UseVisibilityCallback} callback The callback to execute when intersection is detected
 * @param {HookTarget} target The target element to detect intersection
 * @returns {UseVisibilityReturn} An object containing the state
 *
 * @example
 * const { entries, observer } = useVisibility(ref, () => console.log('callback'));
 */
export const useVisibility = ((...params: any[]) => {
  const target = (isTarget(params[0]) ? params[0] : undefined) as HookTarget | undefined;

  const options = (
    target
      ? typeof params[1] === 'object'
        ? params[1]
        : { onChange: params[1] }
      : typeof params[0] === 'object'
        ? params[0]
        : { onChange: params[0] }
  ) as UseVisibilityOptions | undefined;

  const callback = options?.onChange;
  const enabled = options?.enabled ?? true;

  const [observer, setObserver] = useState<IntersectionObserver>();
  const [entry, setEntry] = useState<IntersectionObserverEntry>();

  const internalRef = useRefState<Element>();
  const internalCallbackRef = useRef(callback);
  internalCallbackRef.current = callback;

  useEffect(() => {
    if (!enabled || (!target && !internalRef.state)) return;

    const element = target ? isTarget.getElement(target) : internalRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
        const entry = entries.pop()!;
        setEntry(entry);
        internalCallbackRef.current?.(entry, observer);
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
  }, [
    target,
    internalRef.state,
    isTarget.getRefState(target),
    options?.rootMargin,
    options?.threshold,
    options?.root,
    enabled
  ]);

  if (target) return { observer, entry, inView: !!entry?.isIntersecting };
  return {
    observer,
    ref: internalRef,
    entry,
    inView: !!entry?.isIntersecting
  };
}) as UseVisibility;

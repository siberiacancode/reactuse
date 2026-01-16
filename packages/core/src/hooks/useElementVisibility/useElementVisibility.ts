import { useEffect, useRef, useState } from 'react';

import type { HookTarget } from '@/utils/helpers';

import { isTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

import { useRefState } from '../useRefState/useRefState';

/** The element visibility options type */
export interface UseElementVisibilityOptions extends Omit<IntersectionObserverInit, 'root'> {
  /** The enabled state of the intersection observer */
  enabled?: boolean;
  /** The root element to observe */
  root?: HookTarget;
  /** The callback to execute when visibility changes */
  onChange?: (entry: IntersectionObserverEntry, observer: IntersectionObserver) => void;
}

/** The element visibility return type */
export interface UseElementVisibilityReturn {
  /** The intersection observer entry */
  entry?: IntersectionObserverEntry;
  /** Whether the element is in view */
  inView: boolean;
}

export interface UseElementVisibility {
  <Target extends Element>(
    options?: UseElementVisibilityOptions,
    target?: never
  ): UseElementVisibilityReturn & { ref: StateRef<Target> };

  (target: HookTarget, options?: UseElementVisibilityOptions): UseElementVisibilityReturn;

  <Target extends Element>(
    callback: (entry: IntersectionObserverEntry, observer: IntersectionObserver) => void,
    target?: never
  ): UseElementVisibilityReturn & { ref: StateRef<Target> };

  (
    target: HookTarget,
    callback: (entry: IntersectionObserverEntry, observer: IntersectionObserver) => void
  ): UseElementVisibilityReturn;
}

/**
 * @name useElementVisibility
 * @description – Hook that tracks element visibility using IntersectionObserver
 * @category Sensors
 * @usage medium
 *
 * @browserapi IntersectionObserver https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver
 *
 * @overload
 * @template Target The target element type
 * @param {UseElementVisibilityOptions} [options] The IntersectionObserver options
 * @returns {UseElementVisibilityReturn & { ref: StateRef<Target> }} An object containing the visibility state and a ref to attach to the target element
 *
 * @example
 * const { ref, entry, inView } = useElementVisibility();
 *
 * @overload
 * @param {HookTarget} target The target element to detect visibility
 * @param {UseElementVisibilityOptions} [options] The IntersectionObserver options
 * @returns {UseElementVisibilityReturn} An object containing the visibility state
 *
 * @example
 * const { entry, inView } = useElementVisibility(ref);
 *
 * @overload
 * @template Target The target element type
 * @param {((entry: IntersectionObserverEntry, observer: IntersectionObserver) => void)} callback The callback to execute when visibility changes
 * @returns {UseElementVisibilityReturn & { ref: StateRef<Target> }} An object containing the visibility state and a ref to attach to the target element
 *
 * @example
 * const { ref, entry, inView } = useElementVisibility((entry) => console.log('visible:', entry.isIntersecting));
 *
 * @overload
 * @param {HookTarget} target The target element to detect visibility
 * @param {((entry: IntersectionObserverEntry, observer: IntersectionObserver) => void)} callback The callback to execute when visibility changes
 * @returns {UseElementVisibilityReturn} An object containing the visibility state
 *
 * @example
 * const { entry, inView } = useElementVisibility(ref, (entry) => console.log('visible:', entry.isIntersecting));
 */
export const useElementVisibility = ((...params: any[]) => {
  const target = (isTarget(params[0]) ? params[0] : undefined) as HookTarget | undefined;

  const options = (
    target
      ? typeof params[1] === 'object'
        ? params[1]
        : { onChange: params[1] }
      : typeof params[0] === 'object'
        ? params[0]
        : { onChange: params[0] }
  ) as UseElementVisibilityOptions | undefined;

  const callback = options?.onChange;
  const enabled = options?.enabled ?? true;

  const [entry, setEntry] = useState<IntersectionObserverEntry>();
  const inView = entry?.isIntersecting ?? false;

  const internalRef = useRefState<Element>();
  const internalCallbackRef = useRef(callback);
  internalCallbackRef.current = callback;

  useEffect(() => {
    if (!enabled || (!target && !internalRef.state)) return;

    const element = target ? isTarget.getElement(target) : internalRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (firstEntry) {
          setEntry(firstEntry);
          internalCallbackRef.current?.(firstEntry, observer);
        }
      },
      {
        ...options,
        root: options?.root ? (isTarget.getElement(options.root) as Document | Element) : document
      }
    );

    observer.observe(element as Element);

    return () => {
      observer.disconnect();
    };
  }, [
    target && isTarget.getRawElement(target),
    internalRef.state,
    options?.rootMargin,
    options?.threshold,
    options?.root,
    enabled
  ]);

  if (target) return { entry, inView };
  return {
    entry,
    inView,
    ref: internalRef
  };
}) as UseElementVisibility;

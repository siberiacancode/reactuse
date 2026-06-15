import { useEffect, useRef } from 'react';

import type { HookTarget } from '@/utils/helpers';

import { isTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

import { useRefState } from '../useRefState/useRefState';
import { useRerender } from '../useRerender/useRerender';

/** The measure value type */
export type UseMeasureValue = Pick<
  DOMRectReadOnly,
  'bottom' | 'height' | 'left' | 'right' | 'top' | 'width' | 'x' | 'y'
>;

/** The use measure return type */
export interface UseMeasureReturn {
  /** The latest measure value snapshot */
  snapshot: UseMeasureValue;
  /** Function to enable subscriptions and rerender on next updates */
  watch: () => UseMeasureValue;
}

export type UseMeasureCallback = (
  value: UseMeasureValue,
  entry: ResizeObserverEntry,
  observer: ResizeObserver
) => void;

export interface UseMeasure {
  (target: HookTarget, callback?: UseMeasureCallback): UseMeasureReturn;

  <Target extends Element>(
    callback?: UseMeasureCallback,
    target?: never
  ): UseMeasureReturn & {
    ref: StateRef<Target>;
  };
}

/**
 * @name useMeasure
 * @description - Hook to measure the size and position of an element
 * @category Browser
 * @usage low
 *
 * @overload
 * @param {HookTarget} target The element to measure
 * @param {(value: UseMeasureValue, entry: ResizeObserverEntry, observer: ResizeObserver) => void} [callback] The callback to invoke on measure updates
 * @returns {UseMeasureReturn} The element's size and position controls
 *
 * @example
 * const { snapshot, watch } = useMeasure(ref);
 *
 * @overload
 * @template Target The element to measure
 * @param {(value: UseMeasureValue, entry: ResizeObserverEntry, observer: ResizeObserver) => void} [callback] The callback to invoke on measure updates
 * @returns {UseMeasureReturn & { ref: StateRef<Target> }} The element's size and position controls
 *
 * @example
 * const { ref, snapshot, watch } = useMeasure();
 */
export const useMeasure = ((...params: any[]) => {
  const target = (isTarget(params[0]) ? params[0] : undefined) as HookTarget | undefined;
  const callback = (target ? params[1] : params[0]) as UseMeasureCallback | undefined;

  const internalRef = useRefState<Element>();
  const internalCallbackRef = useRef(callback);
  const snapshotRef = useRef<UseMeasureValue>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  });
  const watchingRef = useRef(false);
  const rerender = useRerender();

  internalCallbackRef.current = callback;

  const watch = () => {
    watchingRef.current = true;
    return snapshotRef.current;
  };

  const updateValue = (
    value: UseMeasureValue,
    entry: ResizeObserverEntry,
    observer: ResizeObserver
  ) => {
    snapshotRef.current = value;
    internalCallbackRef.current?.(value, entry, observer);
    if (watchingRef.current) rerender();
  };

  useEffect(() => {
    if (!target && !internalRef.state) return;

    const element = (target ? isTarget.getElement(target) : internalRef.current) as Element;
    if (!element) return;

    const resizeObserver = new ResizeObserver((entries, observer) => {
      const entry = entries[0];
      if (!entry) return;

      const { x, y, width, height, top, left, bottom, right } = entry.contentRect;
      updateValue({ x, y, width, height, top, left, bottom, right }, entry, observer);
    });

    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, [target && isTarget.getRawElement(target), internalRef.state]);

  if (target) return { snapshot: snapshotRef.current, watch };
  return { ref: internalRef, snapshot: snapshotRef.current, watch };
}) as UseMeasure;

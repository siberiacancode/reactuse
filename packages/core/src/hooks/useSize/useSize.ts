import { useRef } from 'react';

import type { HookTarget } from '@/utils/helpers';

import { isTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

import { useIsomorphicLayoutEffect } from '../useIsomorphicLayoutEffect/useIsomorphicLayoutEffect';
import { useRefState } from '../useRefState/useRefState';
import { useRerender } from '../useRerender/useRerender';

/** The size value type */
export interface UseSizeValue {
  /** The element's height */
  height: number;
  /** The element's width */
  width: number;
}

/** The use size return type */
export interface UseSizeReturn {
  /** The resize observer instance */
  observer?: ResizeObserver;
  /** The latest size value snapshot */
  snapshot: UseSizeValue;
  /** Function to enable subscriptions and rerender on next updates */
  watch: () => UseSizeValue;
}

export type UseSizeCallback = (value: UseSizeValue, observer: ResizeObserver) => void;

export interface UseSize {
  (target: HookTarget, callback?: UseSizeCallback): UseSizeReturn;

  <Target extends Element>(
    callback?: UseSizeCallback,
    target?: never
  ): {
    ref: StateRef<Target>;
  } & UseSizeReturn;
}

/**
 * @name useSize
 * @description - Hook that observes and returns the width and height of element
 * @category Elements
 * @usage low
 *
 * @overload
 * @param {HookTarget} target The target element to observe
 * @param {(value: UseSizeValue, observer: ResizeObserver) => void} [callback] The callback to invoke on size updates
 * @returns {UseSizeReturn} An object containing the resize observer and latest width and height snapshot
 *
 * @example
 * const { snapshot, watch, observer } = useSize(ref);
 *
 * @overload
 * @template Target The target element type
 * @param {(value: UseSizeValue, observer: ResizeObserver) => void} [callback] The callback to invoke on size updates
 * @returns { { ref: StateRef<Target> } & UseSizeReturn } An object containing the resize observer and latest width and height snapshot
 *
 * @example
 * const { ref, snapshot, watch, observer } = useSize();
 */
export const useSize = ((...params: any[]) => {
  const target = (isTarget(params[0]) ? params[0] : undefined) as HookTarget | undefined;
  const callback = (target ? params[1] : params[0]) as UseSizeCallback | undefined;

  const snapshotRef = useRef({ width: 0, height: 0 });
  const observerRef = useRef<ResizeObserver>(undefined);
  const internalCallbackRef = useRef(callback);
  const watchingRef = useRef(false);
  const rerender = useRerender();
  const internalRef = useRefState<Element>();

  internalCallbackRef.current = callback;

  const watch = () => {
    watchingRef.current = true;
    return snapshotRef.current;
  };

  const updateValue = (value: UseSizeValue, observer: ResizeObserver) => {
    snapshotRef.current = value;
    internalCallbackRef.current?.(value, observer);
    if (watchingRef.current) rerender();
  };

  useIsomorphicLayoutEffect(() => {
    const element = (target ? isTarget.getElement(target) : internalRef.current) as Element;

    if (!element) return;

    const updateSize = (observer: ResizeObserver) => {
      const { width, height } = element.getBoundingClientRect();
      updateValue({ width, height }, observer);
    };

    const observer = new ResizeObserver(() => {
      updateSize(observer);
    });

    observerRef.current = observer;
    updateSize(observer);
    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [internalRef.state, target && isTarget.getRawElement(target)]);

  if (target) return { observer: observerRef.current, snapshot: snapshotRef.current, watch };
  return {
    observer: observerRef.current,
    ref: internalRef,
    snapshot: snapshotRef.current,
    watch
  };
}) as UseSize;

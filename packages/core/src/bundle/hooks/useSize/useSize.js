import { useRef } from 'react';
import { isTarget } from '@/utils/helpers';
import { useIsomorphicLayoutEffect } from '../useIsomorphicLayoutEffect/useIsomorphicLayoutEffect';
import { useRefState } from '../useRefState/useRefState';
import { useRerender } from '../useRerender/useRerender';
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
export const useSize = (...params) => {
  const target = isTarget(params[0]) ? params[0] : undefined;
  const callback = target ? params[1] : params[0];
  const snapshotRef = useRef({ width: 0, height: 0 });
  const observerRef = useRef(undefined);
  const internalCallbackRef = useRef(callback);
  const watchingRef = useRef(false);
  const rerender = useRerender();
  const internalRef = useRefState();
  internalCallbackRef.current = callback;
  const watch = () => {
    watchingRef.current = true;
    return snapshotRef.current;
  };
  const updateValue = (value, observer) => {
    snapshotRef.current = value;
    internalCallbackRef.current?.(value, observer);
    if (watchingRef.current) rerender();
  };
  useIsomorphicLayoutEffect(() => {
    const element = target ? isTarget.getElement(target) : internalRef.current;
    if (!element) return;
    const updateSize = (observer) => {
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
};

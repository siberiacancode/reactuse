import { useEffect, useRef } from 'react';

import type { HookTarget } from '@/utils/helpers';

import { isTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

import { useRefState } from '../useRefState/useRefState';
import { useRerender } from '../useRerender/useRerender';

/** The use mouse return type */
export interface UseMouseReturn {
  /** The latest mouse value snapshot */
  snapshot: UseMouseValue;
  /** Function to enable subscriptions and rerender on next updates */
  watch: () => UseMouseValue;
}

/** The use mouse value type */
export interface UseMouseValue {
  /** The current mouse client x position */
  clientX: number;
  /** The current mouse client y position */
  clientY: number;
  /** The current element position x */
  elementPositionX: number;
  /** The current element position y */
  elementPositionY: number;
  /** The current element x position */
  elementX: number;
  /** The current element y position */
  elementY: number;
  /** The current mouse x position */
  x: number;
  /** The current mouse y position */
  y: number;
}

export type UseMouseCallback = (value: UseMouseValue, event: Event) => void;

export interface UseMouse {
  (target: HookTarget, callback?: UseMouseCallback): UseMouseReturn;

  <Target extends Element>(
    callback?: UseMouseCallback,
    target?: never
  ): UseMouseReturn & {
    ref: StateRef<Target>;
  };

  (target?: Window, callback?: UseMouseCallback): UseMouseReturn;
}

/**
 * @name useMouse
 * @description - Hook that manages a mouse position
 * @category Sensors
 * @usage low
 *
 * @overload
 * @param {HookTarget} [target=window] The target element to manage the mouse position for
 * @param {(value: UseMouseValue, event: Event) => void} [callback] The callback to invoke on mouse updates
 * @returns {UseMouseReturn} An object with mouse value controls
 *
 * @example
 * const mouse = useMouse(ref);
 *
 * @overload
 * @template Target The target element
 * @param {(value: UseMouseValue, event: Event) => void} [callback] The callback to invoke on mouse updates
 * @returns {UseMouseReturn & { ref: StateRef<Target> }} An object with mouse value controls and a ref
 *
 * @example
 * const mouse = useMouse<HTMLDivElement>();
 */
export const useMouse = ((...params: any[]) => {
  const target = isTarget(params[0]) ? params[0] : undefined;
  const callback = (target ? params[1] : params[0]) as UseMouseCallback | undefined;

  const snapshotRef = useRef<UseMouseValue>({
    x: 0,
    y: 0,
    elementX: 0,
    elementY: 0,
    elementPositionX: 0,
    elementPositionY: 0,
    clientX: 0,
    clientY: 0
  });
  const internalCallbackRef = useRef(callback);
  internalCallbackRef.current = callback;
  const watchingRef = useRef(false);
  const rerender = useRerender();

  const internalRef = useRefState<Element>();

  const updateValue = (nextValue: UseMouseValue, event: Event) => {
    snapshotRef.current = nextValue;
    internalCallbackRef.current?.(nextValue, event);
    if (watchingRef.current) rerender();
  };

  const watch = () => {
    watchingRef.current = true;
    return snapshotRef.current;
  };

  useEffect(() => {
    const onMouseMove = (event: MouseEvent) => {
      const element = (target ? isTarget.getElement(target) : internalRef.current) as
        | Element
        | undefined;

      const updatedValue: UseMouseValue = {
        x: event.pageX,
        y: event.pageY,
        clientX: event.clientX,
        clientY: event.clientY,
        elementX: event.pageX,
        elementY: event.pageY,
        elementPositionX: 0,
        elementPositionY: 0
      };

      if (element) {
        const { left, top } = element.getBoundingClientRect();
        const elementPositionX = left + window.scrollX;
        const elementPositionY = top + window.scrollY;
        const elementX = event.pageX - elementPositionX;
        const elementY = event.pageY - elementPositionY;

        updatedValue.elementX = elementX;
        updatedValue.elementY = elementY;
        updatedValue.elementPositionX = elementPositionX;
        updatedValue.elementPositionY = elementPositionY;
      }

      updateValue(updatedValue, event);
    };

    const onScroll = (event: Event) => {
      const updatedValue: UseMouseValue = {
        ...snapshotRef.current,
        x: snapshotRef.current.x + window.scrollX - snapshotRef.current.elementPositionX,
        y: snapshotRef.current.y + window.scrollY - snapshotRef.current.elementPositionY,
        elementPositionX: window.scrollX,
        elementPositionY: window.scrollY
      };
      updateValue(updatedValue, event);
    };

    document.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('mousemove', onMouseMove);
    return () => {
      document.removeEventListener('scroll', onScroll);
      document.removeEventListener('mousemove', onMouseMove);
    };
  }, [internalRef.state, target && isTarget.getRawElement(target)]);

  if (target) return { snapshot: snapshotRef.current, watch };
  return {
    ref: internalRef,
    snapshot: snapshotRef.current,
    watch
  };
}) as UseMouse;

import { useEffect, useRef, useState } from 'react';

import type { HookTarget } from '@/utils/helpers';

import { isTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

import { useRefState } from '../useRefState/useRefState';
import { useRerender } from '../useRerender/useRerender';

export type SwipeDirection = 'down' | 'left' | 'none' | 'right' | 'up';
export type SwipeEvent = PointerEvent | TouchEvent;
export type UseSwipeCallback = (value: UseSwipeValue, event: SwipeEvent) => void;

export interface UseSwipeOptions {
  /** Called when swipe moves */
  onMove?: UseSwipeCallback;
  /** Minimal distance in px to resolve direction */
  threshold?: number;
  /** Called when swipe ends */
  onEnd?: (value: UseSwipeValue, event: SwipeEvent) => void;
  /** Called when swipe starts */
  onStart?: (value: UseSwipeValue, event: SwipeEvent) => void;
}

export interface UseSwipeValue {
  /** Current swipe direction */
  direction: SwipeDirection;
  /** Horizontal swipe length */
  lengthX: number;
  /** Vertical swipe length */
  lengthY: number;
}

export interface UseSwipeReturn {
  /** The latest swipe value snapshot */
  snapshot: UseSwipeValue;
  /** Is swipe currently active */
  swiping: boolean;
  /** Function to enable subscriptions and rerender on next updates */
  watch: () => UseSwipeValue;
}

export interface UseSwipe {
  (target: HookTarget, callback?: UseSwipeCallback): UseSwipeReturn;
  (target: HookTarget, options?: UseSwipeOptions): UseSwipeReturn;

  <Target extends Element>(
    callback?: UseSwipeCallback,
    target?: never
  ): UseSwipeReturn & {
    ref: StateRef<Target>;
  };

  <Target extends Element>(
    options?: UseSwipeOptions,
    target?: never
  ): UseSwipeReturn & {
    ref: StateRef<Target>;
  };
}

const DEFAULT_SWIPE_THRESHOLD = 50;
interface Coords {
  x: number;
  y: number;
}

const getCoords = (event: SwipeEvent): Coords | undefined => {
  if ('touches' in event) {
    const touch = event.touches[0] ?? event.changedTouches[0];
    if (!touch) return;

    return {
      x: touch.clientX,
      y: touch.clientY
    };
  }

  return {
    x: event.clientX,
    y: event.clientY
  };
};

/**
 * @name useSwipe
 * @description - Hook that tracks swipe gestures for touch and pointer events
 * @category Sensors
 * @usage low
 *
 * @overload
 * @param {HookTarget} target The target element to track swipe on
 * @param {UseSwipeCallback} [callback] Swipe move callback
 * @returns {UseSwipeReturn} Swipe state
 *
 * @example
 * const swipe = useSwipe(ref, (value) => console.log(value.direction));
 *
 * @overload
 * @template Target The target element
 * @param {UseSwipeCallback} [callback] Swipe move callback
 * @returns {UseSwipeReturn & { ref: StateRef<Target> }} Swipe state and ref
 *
 * @example
 * const swipe = useSwipe<HTMLDivElement>((value) => console.log(value.direction));
 *
 * @overload
 * @param {HookTarget} target The target element to track swipe on
 * @param {UseSwipeOptions} [options] Swipe options
 * @returns {UseSwipeReturn} Swipe state
 *
 * @example
 * const swipe = useSwipe(ref);
 *
 * @overload
 * @template Target The target element
 * @param {UseSwipeOptions} [options] Swipe options
 * @returns {UseSwipeReturn & { ref: StateRef<Target> }} Swipe state and ref
 *
 * @example
 * const swipe = useSwipe<HTMLDivElement>();
 */
export const useSwipe = ((...params: any[]) => {
  const target = (isTarget(params[0]) ? params[0] : undefined) as HookTarget | undefined;
  const options = (
    target
      ? typeof params[1] === 'function'
        ? { ...params[2], onMove: params[1] }
        : params[1]
      : typeof params[0] === 'function'
        ? { ...params[1], onMove: params[0] }
        : params[0]
  ) as UseSwipeOptions | undefined;

  const [swiping, setSwiping] = useState(false);
  const internalRef = useRefState<Element>();
  const snapshotRef = useRef<UseSwipeValue>({
    direction: 'none',
    lengthX: 0,
    lengthY: 0
  });
  const swipingRef = useRef(false);
  const watchingRef = useRef(false);
  const rerender = useRerender();
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const watch = () => {
    watchingRef.current = true;
    return snapshotRef.current;
  };

  useEffect(() => {
    if (!target && !internalRef.state) return;

    const element = target ? isTarget.getElement(target) : internalRef.current;
    if (!element) return;

    let start: Coords | undefined;

    const getCurrentDirection = (x: number, y: number) => {
      const absX = Math.abs(x);
      const absY = Math.abs(y);
      const maxLength = Math.max(absX, absY);
      const threshold = optionsRef.current?.threshold ?? DEFAULT_SWIPE_THRESHOLD;

      if (maxLength < threshold) return 'none';

      if (absX > absY) return x > 0 ? 'left' : 'right';
      return y > 0 ? 'up' : 'down';
    };

    const onStart = (event: SwipeEvent) => {
      if (swipingRef.current) return;

      const coords = getCoords(event);
      if (!coords) return;

      start = coords;
      const nextValue: UseSwipeValue = {
        direction: 'none',
        lengthX: 0,
        lengthY: 0
      };
      swipingRef.current = true;
      setSwiping(true);
      snapshotRef.current = nextValue;
      optionsRef.current?.onStart?.(nextValue, event);
      if (watchingRef.current) rerender();
    };

    const onMove = (event: SwipeEvent) => {
      if (!swipingRef.current || !start) return;

      const coords = getCoords(event);
      if (!coords) return;

      const nextLengthX = start.x - coords.x;
      const nextLengthY = start.y - coords.y;

      snapshotRef.current = {
        direction: getCurrentDirection(nextLengthX, nextLengthY),
        lengthX: nextLengthX,
        lengthY: nextLengthY
      };
      optionsRef.current?.onMove?.(snapshotRef.current, event);
      if (watchingRef.current) rerender();
    };

    const onEnd = (event: SwipeEvent) => {
      if (!swipingRef.current || !start) return;

      const coords = getCoords(event);
      const x = coords ? start.x - coords.x : snapshotRef.current.lengthX;
      const y = coords ? start.y - coords.y : snapshotRef.current.lengthY;
      const nextValue: UseSwipeValue = {
        direction: getCurrentDirection(x, y),
        lengthX: x,
        lengthY: y
      };
      swipingRef.current = false;
      setSwiping(false);
      snapshotRef.current = nextValue;
      optionsRef.current?.onEnd?.(nextValue, event);
      if (watchingRef.current) rerender();

      start = undefined;
    };

    const onPointerStart = (event: PointerEvent) => {
      if (!event.isPrimary) return;
      onStart(event);
    };

    const onPointerMove = (event: PointerEvent) => onMove(event);
    const onPointerEnd = (event: PointerEvent) => onEnd(event);

    const onTouchStart = (event: TouchEvent) => onStart(event);
    const onTouchMove = (event: TouchEvent) => onMove(event);
    const onTouchEnd = (event: TouchEvent) => onEnd(event);

    element.addEventListener('pointerdown', onPointerStart as EventListener);
    window.addEventListener('pointermove', onPointerMove as EventListener);
    window.addEventListener('pointerup', onPointerEnd as EventListener);
    window.addEventListener('pointercancel', onPointerEnd as EventListener);

    element.addEventListener('touchstart', onTouchStart as EventListener);
    window.addEventListener('touchmove', onTouchMove as EventListener);
    window.addEventListener('touchend', onTouchEnd as EventListener);
    window.addEventListener('touchcancel', onTouchEnd as EventListener);

    return () => {
      element.removeEventListener('pointerdown', onPointerStart as EventListener);
      window.removeEventListener('pointermove', onPointerMove as EventListener);
      window.removeEventListener('pointerup', onPointerEnd as EventListener);
      window.removeEventListener('pointercancel', onPointerEnd as EventListener);

      element.removeEventListener('touchstart', onTouchStart as EventListener);
      window.removeEventListener('touchmove', onTouchMove as EventListener);
      window.removeEventListener('touchend', onTouchEnd as EventListener);
      window.removeEventListener('touchcancel', onTouchEnd as EventListener);
    };
  }, [target && isTarget.getRawElement(target), internalRef.state]);

  if (target) return { swiping, snapshot: snapshotRef.current, watch };
  return { ref: internalRef, swiping, snapshot: snapshotRef.current, watch };
}) as UseSwipe;

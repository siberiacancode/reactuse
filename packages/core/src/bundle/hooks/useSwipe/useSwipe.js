import { useEffect, useRef, useState } from 'react';
import { isTarget } from '@/utils/helpers';
import { useRefState } from '../useRefState/useRefState';
import { useRerender } from '../useRerender/useRerender';
const DEFAULT_SWIPE_THRESHOLD = 50;
const getCoords = (event) => {
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
export const useSwipe = (...params) => {
  const target = isTarget(params[0]) ? params[0] : undefined;
  const options = target
    ? typeof params[1] === 'function'
      ? { ...params[2], onMove: params[1] }
      : params[1]
    : typeof params[0] === 'function'
      ? { ...params[1], onMove: params[0] }
      : params[0];
  const [swiping, setSwiping] = useState(false);
  const internalRef = useRefState();
  const snapshotRef = useRef({
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
    let start;
    const getCurrentDirection = (x, y) => {
      const absX = Math.abs(x);
      const absY = Math.abs(y);
      const maxLength = Math.max(absX, absY);
      const threshold = optionsRef.current?.threshold ?? DEFAULT_SWIPE_THRESHOLD;
      if (maxLength < threshold) return 'none';
      if (absX > absY) return x > 0 ? 'left' : 'right';
      return y > 0 ? 'up' : 'down';
    };
    const onStart = (event) => {
      if (swipingRef.current) return;
      const coords = getCoords(event);
      if (!coords) return;
      start = coords;
      const nextValue = {
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
    const onMove = (event) => {
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
    const onEnd = (event) => {
      if (!swipingRef.current || !start) return;
      const coords = getCoords(event);
      const x = coords ? start.x - coords.x : snapshotRef.current.lengthX;
      const y = coords ? start.y - coords.y : snapshotRef.current.lengthY;
      const nextValue = {
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
    const onPointerStart = (event) => {
      if (!event.isPrimary) return;
      onStart(event);
    };
    const onPointerMove = (event) => onMove(event);
    const onPointerEnd = (event) => onEnd(event);
    const onTouchStart = (event) => onStart(event);
    const onTouchMove = (event) => onMove(event);
    const onTouchEnd = (event) => onEnd(event);
    element.addEventListener('pointerdown', onPointerStart);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerEnd);
    window.addEventListener('pointercancel', onPointerEnd);
    element.addEventListener('touchstart', onTouchStart);
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onTouchEnd);
    window.addEventListener('touchcancel', onTouchEnd);
    return () => {
      element.removeEventListener('pointerdown', onPointerStart);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerEnd);
      window.removeEventListener('pointercancel', onPointerEnd);
      element.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', onTouchEnd);
    };
  }, [target && isTarget.getRawElement(target), internalRef.state]);
  if (target) return { swiping, snapshot: snapshotRef.current, watch };
  return { ref: internalRef, swiping, snapshot: snapshotRef.current, watch };
};

import { useEffect, useRef, useState } from 'react';

import type { HookTarget } from '@/utils/helpers';

import { isTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

import { useRefState } from '../useRefState/useRefState';
import { useRerender } from '../useRerender/useRerender';

/** The position type */
export interface UseDraggablePosition {
  /** The x coordinate */
  x: number;
  /** The y coordinate */
  y: number;
}

/** The use draggable event type */
export interface UseDraggableEvent {
  /** The delta offset from the drag start point (suitable for transform: translate) */
  delta: UseDraggablePosition;
  /** The original pointer event */
  event: PointerEvent;
  /** The absolute position (suitable for left/top with fixed positioning) */
  position: UseDraggablePosition;
}

/** The use draggable options type */
export interface UseDraggableOptions {
  /** The axis to drag on */
  axis?: 'both' | 'x' | 'y';
  /** The enabled state of the draggable */
  enabled?: boolean;
  /** The initial position of the element */
  initialValue?: UseDraggablePosition;
  /** The callback when dragging ends */
  onEnd?: (params: UseDraggableEvent) => void;
  /** The callback during dragging */
  onMove?: (params: UseDraggableEvent) => void;
  /** The callback when dragging starts. Return `false` to prevent dragging */
  onStart?: (params: UseDraggableEvent) => false | void;
}

/** The use draggable return type */
export interface UseDraggableReturn {
  /** Whether the element is currently being dragged */
  dragging: boolean;
  /** The latest position snapshot */
  snapshot: UseDraggablePosition;
  /** Function to set the position programmatically */
  set: (position: UseDraggablePosition) => void;
  /** Function to enable subscriptions and rerender on next updates */
  watch: () => UseDraggablePosition;
}

export interface UseDraggable {
  (target: HookTarget, options?: UseDraggableOptions): UseDraggableReturn;

  <Target extends Element>(
    options?: UseDraggableOptions,
    target?: never
  ): UseDraggableReturn & {
    ref: StateRef<Target>;
  };
}

/**
 * @name useDraggable
 * @description - Hook that makes an element draggable
 * @category Elements
 * @usage low
 *
 * @overload
 * @param {HookTarget} target The target element to make draggable
 * @param {boolean} [options.enabled=true] The enabled state of the draggable
 * @param {'x' | 'y' | 'both'} [options.axis='both'] The axis to drag on
 * @param {UseDraggablePosition} [options.initialValue] The initial position of the element
 * @returns {UseDraggableReturn} An object with draggable controls
 *
 * @example
 * const { snapshot, watch, dragging, set } = useDraggable(ref);
 *
 * @overload
 * @template Target The target element
 * @param {boolean} [options.enabled=true] The enabled state of the draggable
 * @param {'x' | 'y' | 'both'} [options.axis='both'] The axis to drag on
 * @param {UseDraggablePosition} [options.initialValue] The initial position of the element
 * @returns {UseDraggableReturn & { ref: StateRef<Target> }} An object with draggable controls and a ref
 *
 * @example
 * const { ref, snapshot, watch, dragging, set } = useDraggable<HTMLDivElement>();
 */
export const useDraggable = ((...params: any[]) => {
  const target = (isTarget(params[0]) ? params[0] : undefined) as HookTarget | undefined;
  const options = (target ? params[1] : params[0]) as UseDraggableOptions | undefined;

  const { axis = 'both', initialValue } = options ?? {};
  const enabled = options?.enabled ?? true;

  const snapshotRef = useRef<UseDraggablePosition>(initialValue ?? { x: 0, y: 0 });
  const pressedDeltaRef = useRef<UseDraggablePosition | undefined>(undefined);
  const startPointerRef = useRef<UseDraggablePosition>({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);

  const internalOptionsRef = useRef(options);
  internalOptionsRef.current = options;
  const watchingRef = useRef(false);
  const rerender = useRerender();

  const internalRef = useRefState<Element>();

  useEffect(() => {
    if (!enabled || (!target && !internalRef.state)) return;

    const element = (target ? isTarget.getElement(target) : internalRef.current) as
      | Element
      | undefined;
    if (!element) return;

    const onPointerDown = (event: PointerEvent) => {
      const currentOptions = internalOptionsRef.current ?? {};

      const rect = element.getBoundingClientRect();
      const pressed = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      };
      const position = { ...snapshotRef.current };

      if (currentOptions.onStart?.({ position, delta: { x: 0, y: 0 }, event }) === false) return;

      pressedDeltaRef.current = pressed;
      startPointerRef.current = { x: event.clientX, y: event.clientY };
      setDragging((currentDragging) => currentDragging || true);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!pressedDeltaRef.current) return;
      const currentOptions = internalOptionsRef.current ?? {};

      const currentAxis = currentOptions.axis ?? axis;
      let { x, y } = snapshotRef.current;
      if (currentAxis === 'x' || currentAxis === 'both')
        x = event.clientX - pressedDeltaRef.current.x;
      if (currentAxis === 'y' || currentAxis === 'both')
        y = event.clientY - pressedDeltaRef.current.y;

      const position = { x, y };
      const delta = {
        x: event.clientX - startPointerRef.current.x,
        y: event.clientY - startPointerRef.current.y
      };

      snapshotRef.current = position;
      currentOptions.onMove?.({ position, delta, event });
      if (watchingRef.current) rerender();
    };

    const onPointerUp = (event: PointerEvent) => {
      if (!pressedDeltaRef.current) return;
      const currentOptions = internalOptionsRef.current ?? {};

      const position = { ...snapshotRef.current };
      const delta = {
        x: event.clientX - startPointerRef.current.x,
        y: event.clientY - startPointerRef.current.y
      };

      pressedDeltaRef.current = undefined;
      setDragging((currentDragging) => (currentDragging ? false : currentDragging));
      currentOptions.onEnd?.({ position, delta, event });
    };

    element.addEventListener('pointerdown', onPointerDown as EventListener);
    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp);
    return () => {
      element.removeEventListener('pointerdown', onPointerDown as EventListener);
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerup', onPointerUp);
    };
  }, [target && isTarget.getRawElement(target), internalRef.state, enabled]);

  const set = (position: UseDraggablePosition) => {
    snapshotRef.current = position;
    rerender();
  };

  const watch = () => {
    watchingRef.current = true;
    return snapshotRef.current;
  };

  if (target) return { snapshot: snapshotRef.current, dragging, set, watch };
  return {
    ref: internalRef,
    snapshot: snapshotRef.current,
    dragging,
    set,
    watch
  };
}) as UseDraggable;

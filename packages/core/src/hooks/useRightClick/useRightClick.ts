import { useEffect, useRef } from 'react';

import type { HookTarget } from '@/utils/helpers';

import { getElement, isTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

import { useRefState } from '../useRefState/useRefState';

export type RightClickEvent = MouseEvent | TouchEvent;
export interface RightClickPositions {
  x: number;
  y: number;
}

export interface UseRightClickOptions {
  // * The callback function to be invoked on right click end
  onEnd?: (event: RightClickEvent) => void;
  // * The callback function to be invoked on right click start
  onStart?: (event: RightClickEvent) => void;
}

export interface UseRightClick {
  (target: HookTarget, callback: (event: Event) => void, options?: UseRightClickOptions): void;

  <Target extends Element>(
    callback: (positions: RightClickPositions, event: Event) => void,
    options?: UseRightClickOptions,
    target?: never
  ): StateRef<Target>;
}

/**
 * @name useRightClick
 * @description - Hook that handles right-click events and long press on mobile devices
 * @category Elements
 *
 * @overload
 * @param {HookTarget} target The target element for right-click handling
 * @param {(event: RightClickEvents) => void} callback The callback function to be invoked on right click
 * @returns {void}
 *
 * @example
 * useRightClick(ref, () => console.log('clicked'));
 *
 * @overload
 * @template Target The target element
 * @param {(event: RightClickEvents) => void} callback The callback function to be invoked on right click
 * @returns {StateRef<Target>} Ref to attach to the element
 *
 * @example
 * const ref = useRightClick(() => console.log('clicked'));
 */
export const useRightClick = ((...params: any[]): any => {
  const target = (isTarget(params[0]) ? params[0] : undefined) as HookTarget | undefined;
  const callback = (target ? params[1] : params[0]) as (
    positions: RightClickPositions,
    event: RightClickEvent
  ) => void;
  const options = (target ? params[2] : params[1]) as UseRightClickOptions;

  const internalRef = useRefState<Element>();
  const internalCallbackRef = useRef(callback);
  internalCallbackRef.current = callback;
  const internalOptionsRef = useRef(options);
  internalOptionsRef.current = options;

  useEffect(() => {
    if (!target && !internalRef.state) return;

    const element = target ? getElement(target) : internalRef.current;
    if (!element) return;

    const onContextMenu = (event: RightClickEvent) => {
      event.preventDefault();
      internalOptionsRef.current?.onStart?.(event);
      const mouseEvent = event as MouseEvent;
      internalCallbackRef.current({ x: mouseEvent.clientX, y: mouseEvent.clientY }, event);
    };

    const onTouchStart = (event: RightClickEvent) => {
      event.preventDefault();
      internalOptionsRef.current?.onStart?.(event);
      const touchEvent = event as TouchEvent;
      internalCallbackRef.current(
        { x: touchEvent.touches[0].clientX, y: touchEvent.touches[0].clientY },
        event
      );
    };

    const onTouchEnd = (event: RightClickEvent) => {
      event.preventDefault();
      internalOptionsRef.current?.onEnd?.(event);
    };

    element.addEventListener('contextmenu', onContextMenu as EventListener);

    element.addEventListener('touchstart', onTouchStart as EventListener);
    element.addEventListener('touchend', onTouchEnd as EventListener);

    return () => {
      element.removeEventListener('contextmenu', onContextMenu as EventListener);

      element.removeEventListener('touchstart', onTouchStart as EventListener);
      element.removeEventListener('touchend', onTouchEnd as EventListener);
    };
  }, [target, internalRef.state]);

  if (target) return;
  return internalRef;
}) as UseRightClick;

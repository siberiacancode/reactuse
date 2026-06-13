import { useEffect, useRef, useState } from 'react';

import type { HookTarget } from '@/utils/helpers';

import { isTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

import { useRefState } from '../useRefState/useRefState';

/** The context menu event type */
export type ContextMenuEvent = MouseEvent | TouchEvent;

/** The context menu position type */
export interface ContextMenuPosition {
  /** The x coordinate of the event */
  x: number;
  /** The y coordinate of the event */
  y: number;
}

/** The context menu callback type */
export type UseContextMenuCallback = (
  position: ContextMenuPosition,
  event: ContextMenuEvent
) => void;

/** The context menu options type */
export interface UseContextMenuOptions {
  /** The long press delay on touch devices in milliseconds */
  delay?: number;
  /** The enabled state of the hook */
  enabled?: boolean;
  /** The callback function to be invoked when the menu opens */
  onOpen?: UseContextMenuCallback;
  /** The callback function to be invoked when the menu closes */
  onClose?: () => void;
  /** The callback function to be invoked when the interaction ends */
  onEnd?: (event: ContextMenuEvent) => void;
  /** The callback function to be invoked when the interaction starts */
  onStart?: (event: ContextMenuEvent) => void;
}

/** The context menu return type */
export interface UseContextMenuReturn {
  /** The context menu opened state */
  opened: boolean;
  /** The context menu position */
  position?: ContextMenuPosition;
  /** Close the context menu */
  close: () => void;
  /** Open the context menu */
  open: (position: ContextMenuPosition, event?: ContextMenuEvent) => void;
}

export interface UseContextMenu {
  (target: HookTarget, callback?: UseContextMenuCallback): UseContextMenuReturn;

  (target: HookTarget, options?: UseContextMenuOptions): UseContextMenuReturn;

  <Target extends Element>(
    callback?: UseContextMenuCallback,
    target?: never
  ): UseContextMenuReturn & { ref: StateRef<Target> };

  <Target extends Element>(
    options?: UseContextMenuOptions,
    target?: never
  ): UseContextMenuReturn & { ref: StateRef<Target> };
}

const DEFAULT_DELAY = 500;

/**
 * @name useContextMenu
 * @description - Hook that handles custom context menus on desktop and long press on touch devices
 * @category Elements
 * @usage low
 *
 * @overload
 * @param {HookTarget} target The target element for context menu handling
 * @param {UseContextMenuCallback} [callback] The callback function to be invoked when the menu opens
 * @returns {UseContextMenuReturn}
 *
 * @example
 * const menu = useContextMenu(ref, (position) => console.log(position));
 *
 * @overload
 * @param {HookTarget} target The target element for context menu handling
 * @param {number} [options.delay=500] The long press delay on touch devices in milliseconds
 * @param {boolean} [options.enabled=true] The enabled state of the hook
 * @param {UseContextMenuCallback} [options.onOpen] The callback function to be invoked when the menu opens
 * @param {() => void} [options.onClose] The callback function to be invoked when the menu closes
 * @param {(event: ContextMenuEvent) => void} [options.onStart] The callback function to be invoked when the interaction starts
 * @param {(event: ContextMenuEvent) => void} [options.onEnd] The callback function to be invoked when the interaction ends
 * @returns {UseContextMenuReturn}
 *
 * @example
 * const menu = useContextMenu(ref, options);
 *
 * @overload
 * @template Target The target element
 * @param {UseContextMenuCallback} [callback] The callback function to be invoked when the menu opens
 * @returns {UseContextMenuReturn & { ref: StateRef<Target> }} A React ref to attach to the target element
 *
 * @example
 * const { ref, opened, position } = useContextMenu((position) => console.log(position));
 *
 * @overload
 * @template Target The target element
 * @param {number} [options.delay=500] The long press delay on touch devices in milliseconds
 * @param {boolean} [options.enabled=true] The enabled state of the hook
 * @param {UseContextMenuCallback} [options.onOpen] The callback function to be invoked when the menu opens
 * @param {() => void} [options.onClose] The callback function to be invoked when the menu closes
 * @param {(event: ContextMenuEvent) => void} [options.onStart] The callback function to be invoked when the interaction starts
 * @param {(event: ContextMenuEvent) => void} [options.onEnd] The callback function to be invoked when the interaction ends
 * @returns {UseContextMenuReturn & { ref: StateRef<Target> }} A React ref to attach to the target element
 *
 * @example
 * const { ref, opened, position } = useContextMenu(options);
 */
export const useContextMenu = ((...params: any[]) => {
  const target = (isTarget(params[0]) ? params[0] : undefined) as HookTarget | undefined;

  const options = (
    target
      ? typeof params[1] === 'object'
        ? params[1]
        : { onOpen: params[1] }
      : typeof params[0] === 'object'
        ? params[0]
        : { onOpen: params[0] }
  ) as UseContextMenuOptions | undefined;

  const enabled = options?.enabled ?? true;

  const [opened, setOpened] = useState(false);
  const [position, setPosition] = useState<ContextMenuPosition>();

  const internalRef = useRefState<Element>();
  const internalOptionsRef = useRef(options);
  internalOptionsRef.current = options;

  const close = () => {
    setOpened(false);
    setPosition(undefined);
    internalOptionsRef.current?.onClose?.();
  };

  const open = (position: ContextMenuPosition, event?: ContextMenuEvent) => {
    setPosition(position);
    setOpened(true);
    if (event) internalOptionsRef.current?.onOpen?.(position, event);
  };

  useEffect(() => {
    if (!enabled || (!target && !internalRef.state)) return;

    const element = (target ? isTarget.getElement(target) : internalRef.current) as Element;
    if (!element) return;

    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    let startX = 0;
    let startY = 0;

    const clear = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = undefined;
      }
    };

    const onContextMenu = (event: Event) => {
      const mouseEvent = event as MouseEvent;
      mouseEvent.preventDefault();
      internalOptionsRef.current?.onStart?.(mouseEvent);
      open({ x: mouseEvent.clientX, y: mouseEvent.clientY }, mouseEvent);
      internalOptionsRef.current?.onEnd?.(mouseEvent);
    };

    const onTouchStart = (event: Event) => {
      const touchEvent = event as TouchEvent;
      const touch = touchEvent.touches[0];
      if (!touch) return;

      startX = touch.clientX;
      startY = touch.clientY;
      internalOptionsRef.current?.onStart?.(touchEvent);

      const delay = internalOptionsRef.current?.delay ?? DEFAULT_DELAY;
      timeoutId = setTimeout(() => {
        timeoutId = undefined;
        open({ x: startX, y: startY }, touchEvent);
      }, delay);
    };

    const onTouchEnd = (event: Event) => {
      clear();
      internalOptionsRef.current?.onEnd?.(event as TouchEvent);
    };

    element.addEventListener('contextmenu', onContextMenu);
    element.addEventListener('touchstart', onTouchStart);
    element.addEventListener('touchend', onTouchEnd);
    element.addEventListener('touchcancel', onTouchEnd);

    return () => {
      clear();
      element.removeEventListener('contextmenu', onContextMenu);
      element.removeEventListener('touchstart', onTouchStart);
      element.removeEventListener('touchend', onTouchEnd);
      element.removeEventListener('touchcancel', onTouchEnd);
    };
  }, [enabled, target && isTarget.getRawElement(target), internalRef.state]);

  if (target)
    return {
      close,
      open,
      opened,
      position
    };
  return {
    ref: internalRef,
    close,
    open,
    opened,
    position
  };
}) as UseContextMenu;

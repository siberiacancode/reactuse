import { useEffect, useRef, useState } from 'react';
import { isTarget } from '@/utils/helpers';
import { useRefState } from '../useRefState/useRefState';
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
export const useContextMenu = (...params) => {
  const target = isTarget(params[0]) ? params[0] : undefined;
  const options = target
    ? typeof params[1] === 'object'
      ? params[1]
      : { onOpen: params[1] }
    : typeof params[0] === 'object'
      ? params[0]
      : { onOpen: params[0] };
  const enabled = options?.enabled ?? true;
  const [opened, setOpened] = useState(false);
  const [position, setPosition] = useState();
  const internalRef = useRefState();
  const internalOptionsRef = useRef(options);
  internalOptionsRef.current = options;
  const close = () => {
    setOpened(false);
    setPosition(undefined);
    internalOptionsRef.current?.onClose?.();
  };
  const open = (position, event) => {
    setPosition(position);
    setOpened(true);
    if (event) internalOptionsRef.current?.onOpen?.(position, event);
  };
  useEffect(() => {
    if (!enabled || (!target && !internalRef.state)) return;
    const element = target ? isTarget.getElement(target) : internalRef.current;
    if (!element) return;
    let timeoutId;
    let startX = 0;
    let startY = 0;
    const clear = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = undefined;
      }
    };
    const onContextMenu = (event) => {
      const mouseEvent = event;
      mouseEvent.preventDefault();
      internalOptionsRef.current?.onStart?.(mouseEvent);
      open({ x: mouseEvent.clientX, y: mouseEvent.clientY }, mouseEvent);
      internalOptionsRef.current?.onEnd?.(mouseEvent);
    };
    const onTouchStart = (event) => {
      const touchEvent = event;
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
    const onTouchEnd = (event) => {
      clear();
      internalOptionsRef.current?.onEnd?.(event);
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
};

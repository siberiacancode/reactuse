import { useEffect, useRef } from 'react';
import { isTarget } from '@/utils/helpers';
import { useRefState } from '../useRefState/useRefState';
/**
 * @name useRightClick
 * @description - Hook that handles right-click events and long press on mobile devices
 * @category Elements
 * @usage low
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
export const useRightClick = (...params) => {
  const target = isTarget(params[0]) ? params[0] : undefined;
  const callback = target ? params[1] : params[0];
  const options = target ? params[2] : params[1];
  const internalRef = useRefState();
  const internalCallbackRef = useRef(callback);
  internalCallbackRef.current = callback;
  const internalOptionsRef = useRef(options);
  internalOptionsRef.current = options;
  useEffect(() => {
    if (!target && !internalRef.state) return;
    const element = target ? isTarget.getElement(target) : internalRef.current;
    if (!element) return;
    const onContextMenu = (event) => {
      event.preventDefault();
      internalOptionsRef.current?.onStart?.(event);
      const mouseEvent = event;
      internalCallbackRef.current({ x: mouseEvent.clientX, y: mouseEvent.clientY }, event);
    };
    const onTouchStart = (event) => {
      event.preventDefault();
      internalOptionsRef.current?.onStart?.(event);
      const touchEvent = event;
      internalCallbackRef.current(
        { x: touchEvent.touches[0].clientX, y: touchEvent.touches[0].clientY },
        event
      );
    };
    const onTouchEnd = (event) => {
      event.preventDefault();
      internalOptionsRef.current?.onEnd?.(event);
    };
    element.addEventListener('contextmenu', onContextMenu);
    element.addEventListener('touchstart', onTouchStart);
    element.addEventListener('touchend', onTouchEnd);
    return () => {
      element.removeEventListener('contextmenu', onContextMenu);
      element.removeEventListener('touchstart', onTouchStart);
      element.removeEventListener('touchend', onTouchEnd);
    };
  }, [target, internalRef.state]);
  if (target) return;
  return internalRef;
};

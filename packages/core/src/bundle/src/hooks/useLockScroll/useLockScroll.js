import { useRef, useState } from 'react';
import { isTarget } from '@/utils/helpers';
import { useIsomorphicLayoutEffect } from '../useIsomorphicLayoutEffect/useIsomorphicLayoutEffect';
import { useRefState } from '../useRefState/useRefState';
/**
 * @name useLockScroll
 * @description - Hook that locks scroll on an element or document body
 * @category Elements
 * @usage medium
 *
 * @overload
 * @param {HookTarget} [target=document.body] The target element to lock scroll on
 * @param {UseLockScrollOptions} [options] The options for scroll locking
 * @returns {void}
 *
 * @example
 * const { lock, unlock, value, toggle } = useLockScroll(ref);
 *
 * @overload
 * @template Target The target element
 * @param {UseLockScrollOptions} [options] The options for scroll locking
 * @returns {StateRef<Target>} Ref to attach to element, or locks body scroll by default
 *
 * @example
 * const { ref, lock, unlock, value, toggle } = useLockScroll();
 */
export const useLockScroll = (...params) => {
  const target = isTarget(params[0]) ? params[0] : undefined;
  const options = target ? params[1] : params[0];
  const enabled = options?.enabled ?? true;
  const [locked, setLocked] = useState(enabled);
  const internalRef = useRefState();
  const elementRef = useRef(null);
  useIsomorphicLayoutEffect(() => {
    const element = (target ? isTarget.getElement(target) : internalRef.current) ?? document.body;
    if (!(element instanceof HTMLElement)) return;
    elementRef.current = element;
    if (!enabled) return;
    const originalStyle = window.getComputedStyle(element).overflow;
    elementRef.current.__originalOverflow = originalStyle;
    element.style.overflow = 'hidden';
    return () => {
      element.style.overflow = originalStyle;
      elementRef.current = null;
    };
  }, [target && isTarget.getRawElement(target), internalRef.state, enabled]);
  const lock = () => {
    if (!elementRef.current) return;
    const element = elementRef.current;
    elementRef.current.__originalOverflow = window.getComputedStyle(element).overflow;
    element.style.overflow = 'hidden';
    setLocked(true);
  };
  const unlock = () => {
    if (!elementRef.current) return;
    const element = elementRef.current;
    element.style.overflow = elementRef.current.__originalOverflow;
    setLocked(false);
  };
  const toggle = (value = !locked) => {
    if (value) return lock();
    return unlock();
  };
  if (target)
    return {
      value: locked,
      lock,
      unlock,
      toggle
    };
  return {
    ref: internalRef,
    value: locked,
    lock,
    unlock,
    toggle
  };
};

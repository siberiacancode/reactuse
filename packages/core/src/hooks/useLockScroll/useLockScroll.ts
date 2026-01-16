import { useRef, useState } from 'react';

import type { HookTarget } from '@/utils/helpers';

import { isTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

import { useIsomorphicLayoutEffect } from '../useIsomorphicLayoutEffect/useIsomorphicLayoutEffect';
import { useRefState } from '../useRefState/useRefState';

/** The use lock scroll options type */
export interface UseLockScrollOptions {
  /** Enable or disable scroll locking. Default: true */
  enabled?: boolean;
}

/** The use lock scroll return type */
export interface UseLockScrollReturn<Target extends Element> {
  /** The ref to attach to the element */
  ref: StateRef<Target>;
  /** The value of the lock state */
  value: boolean;
  /** Lock the scroll */
  lock: () => void;
  /** Toggle the scroll lock */
  toggle: (value?: boolean) => void;
  /** Unlock the scroll */
  unlock: () => void;
}

export interface UseLockScroll {
  (target: HookTarget, options?: UseLockScrollOptions): UseLockScrollReturn<Element>;

  <Target extends Element>(
    options?: UseLockScrollOptions,
    target?: never
  ): UseLockScrollReturn<Target> & { ref: StateRef<Target> };
}

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
export const useLockScroll = ((...params: any[]): any => {
  const target = (isTarget(params[0]) ? params[0] : undefined) as HookTarget | undefined;
  const options = (target ? params[1] : params[0]) as UseLockScrollOptions | undefined;

  const enabled = options?.enabled ?? true;
  const [locked, setLocked] = useState(enabled);

  const internalRef = useRefState<Element>();
  const elementRef = useRef<Element>(null);

  useIsomorphicLayoutEffect(() => {
    const element =
      ((target ? isTarget.getElement(target) : internalRef.current) as Element) ?? document.body;

    if (!(element instanceof HTMLElement)) return;

    elementRef.current = element;

    if (!enabled) return;

    const originalStyle = window.getComputedStyle(element).overflow;
    (elementRef.current as any).__originalOverflow = originalStyle;
    element.style.overflow = 'hidden';

    return () => {
      element.style.overflow = originalStyle;
      elementRef.current = null;
    };
  }, [target && isTarget.getRawElement(target), internalRef.state, enabled]);

  const lock = () => {
    if (!elementRef.current) return;
    const element = elementRef.current as HTMLElement;
    (elementRef.current as any).__originalOverflow = window.getComputedStyle(element).overflow;
    element.style.overflow = 'hidden';
    setLocked(true);
  };

  const unlock = () => {
    if (!elementRef.current) return;
    const element = elementRef.current as HTMLElement;
    element.style.overflow = (elementRef.current as any).__originalOverflow;
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
}) as UseLockScroll;

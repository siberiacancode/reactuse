import { useRef } from 'react';
import { isTarget } from '@/utils/helpers';
import { useIsomorphicLayoutEffect } from '../useIsomorphicLayoutEffect/useIsomorphicLayoutEffect';
import { useRefState } from '../useRefState/useRefState';
/**
 * @name useScrollTo
 * @description - Hook for scrolling to a specific element
 * @category Sensors
 * @usage low
 *
 * @overload
 * @param {HookTarget} [target=window] The target element for scrolling to
 * @param {boolean} [options.immediately=true] Whether to scroll immediately
 * @param {number} [options.x] The horizontal position to scroll to
 * @param {number} [options.y] The vertical position to scroll to
 * @param {ScrollBehavior} [options.behavior=auto] The scrolling behavior
 * @returns {UseScrollToReturn} The scroll trigger function
 *
 * @example
 * const trigger = useScrollTo(ref, options);
 *
 * @overload
 * @template Target The target element
 * @param {boolean} [options.immediately=true] Whether to scroll immediately
 * @param {number} [options.x] The horizontal position to scroll to
 * @param {number} [options.y] The vertical position to scroll to
 * @param {ScrollBehavior} [options.behavior=auto] The scrolling behavior
 * @returns {UseScrollToReturn & { ref: StateRef<Target> }} The scroll trigger function and ref
 *
 * @example
 * const { ref, trigger } = useScrollTo(options);
 */
export const useScrollTo = (...params) => {
  const target = isTarget(params[0]) ? params[0] : undefined;
  const options = target ? params[1] : params[0];
  const { x, y, behavior = 'auto', immediately = true } = options ?? {};
  const internalRef = useRefState();
  const elementRef = useRef(null);
  useIsomorphicLayoutEffect(() => {
    if (!immediately) return;
    if (!target && !internalRef.state) return;
    const element = (target ? isTarget.getElement(target) : internalRef.current) ?? window;
    elementRef.current = element;
    element.scrollTo({ top: y, left: x, behavior });
  }, [target, internalRef.state]);
  const trigger = (params) => {
    if (!elementRef.current) return;
    const { x, y, behavior } = params ?? {};
    elementRef.current.scrollTo({ left: x, top: y, behavior });
  };
  if (target) return { trigger };
  return { ref: internalRef, trigger };
};

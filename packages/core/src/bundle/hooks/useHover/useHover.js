import { useEffect, useRef, useState } from 'react';
import { isTarget } from '@/utils/helpers';
import { useRefState } from '../useRefState/useRefState';
/**
 * @name useHover
 * @description - Hook that defines the logic when hovering an element
 * @category Elements
 * @usage medium
 *
 * @overload
 * @param {HookTarget} target The target element to be hovered
 * @param {(event: Event) => void} [callback] The callback function to be invoked on mouse enter
 * @returns {boolean} The value of the hover
 *
 * @example
 * const hovering = useHover(ref, () => console.log('callback'));
 *
 * @overload
 * @param {HookTarget} target The target element to be hovered
 * @param {(event: Event) => void} [options.onEntry] The callback function to be invoked on mouse enter
 * @param {(event: Event) => void} [options.onLeave] The callback function to be invoked on mouse leave
 * @returns {boolean} The value of the hover
 *
 * @example
 * const hovering = useHover(ref, options);
 *
 * @overload
 * @template Target The target element
 * @param {(event: Event) => void} [callback] The callback function to be invoked on mouse enter
 * @returns {{ ref: StateRef<Target> } & UseHoverReturn} The object with the ref and the value of the hover
 *
 * @example
 * const { ref, value } = useHover(() => console.log('callback'));
 *
 * @overload
 * @template Target The target element
 * @param {(event: Event) => void} [options.onEntry] The callback function to be invoked on mouse enter
 * @param {(event: Event) => void} [options.onLeave] The callback function to be invoked on mouse leave
 * @returns {{ ref: StateRef<Target> } & UseHoverReturn} The object with the ref and the value of the hover
 *
 * @example
 * const { ref, value } = useHover(options);
 */
export const useHover = (...params) => {
  const target = isTarget(params[0]) ? params[0] : undefined;
  const options = target
    ? typeof params[1] === 'object'
      ? params[1]
      : { onEntry: params[1] }
    : typeof params[0] === 'object'
      ? params[0]
      : { onEntry: params[0] };
  const enabled = options?.enabled ?? true;
  const [hovering, setHovering] = useState(false);
  const internalRef = useRefState();
  const internalOptionsRef = useRef(options);
  internalOptionsRef.current = options;
  useEffect(() => {
    if (!enabled || (!target && !internalRef.state)) return;
    const element = target ? isTarget.getElement(target) : internalRef.current;
    if (!element) return;
    const onMouseEnter = (event) => {
      internalOptionsRef.current?.onEntry?.(event);
      setHovering(true);
    };
    const onMouseLeave = (event) => {
      internalOptionsRef.current?.onLeave?.(event);
      setHovering(false);
    };
    element.addEventListener('mouseenter', onMouseEnter);
    element.addEventListener('mouseleave', onMouseLeave);
    return () => {
      element.removeEventListener('mouseenter', onMouseEnter);
      element.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [enabled, target, internalRef.state, isTarget.getRefState(target)]);
  if (target) return hovering;
  return {
    ref: internalRef,
    value: hovering
  };
};

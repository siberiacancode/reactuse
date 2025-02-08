import type { RefObject } from 'react';

import { useEffect, useRef, useState } from 'react';

import { getElement, isTarget } from '@/utils/helpers';

//* The use hover target type */
export type UseHoverTarget = string | Element | RefObject<Element | null | undefined>;

//* The use hover options type */
export interface UseHoverOptions {
  //* The on entry callback */
  onEntry?: (event: Event) => void;
  //* The on leave callback */
  onLeave?: (event: Event) => void;
}

export interface UseHover {
  <Target extends UseHoverTarget>(target: Target, callback?: (event: Event) => void): boolean;

  <Target extends UseHoverTarget>(target: Target, options?: UseHoverOptions): boolean;

  <Target extends UseHoverTarget>(
    callback?: (event: Event) => void,
    target?: never
  ): [(node: Target) => void, boolean];

  <Target extends UseHoverTarget>(
    options?: UseHoverOptions,
    target?: never
  ): [(node: Target) => void, boolean];
}

/**
 * @name useHover
 * @description - Hook that defines the logic when hovering an element
 * @category Sensors
 *
 * @overload
 * @template Target The target element
 * @param {Target} target The target element to be hovered
 * @param {(event: Event) => void} [callback] The callback function to be invoked on mouse enter
 * @returns {boolean} The state of the hover
 *
 * @example
 * const hovering = useHover(ref, () => console.log('callback'));
 *
 * @overload
 * @template Target The target element
 * @param {Target} target The target element to be hovered
 * @param {(event: Event) => void} [options.onEntry] The callback function to be invoked on mouse enter
 * @param {(event: Event) => void} [options.onLeave] The callback function to be invoked on mouse leave
 * @returns {boolean} The state of the hover
 *
 * @example
 * const hovering = useHover(ref, options);
 *
 * @overload
 * @template Target The target element
 * @param {(event: Event) => void} [callback] The callback function to be invoked on mouse enter
 * @returns {UseHoverReturn<Target>} The state of the hover
 *
 * @example
 * const [ref, hovering] = useHover(() => console.log('callback'));
 *
 * @overload
 * @template Target The target element
 * @param {(event: Event) => void} [options.onEntry] The callback function to be invoked on mouse enter
 * @param {(event: Event) => void} [options.onLeave] The callback function to be invoked on mouse leave
 * @returns {UseHoverReturn<Target>} The state of the hover
 *
 * @example
 * const [ref, hovering] = useHover(options);
 */
export const useHover = ((...params: any[]) => {
  const target = (isTarget(params[0]) ? params[0] : undefined) as UseHoverTarget | undefined;

  const options = (
    target
      ? typeof params[1] === 'object'
        ? params[1]
        : { onEntry: params[1] }
      : typeof params[0] === 'object'
        ? params[0]
        : { onEntry: params[0] }
  ) as UseHoverOptions | undefined;

  const [hovering, setHovering] = useState(false);
  const [internalRef, setInternalRef] = useState<Element>();
  const internalOptionsRef = useRef(options);
  internalOptionsRef.current = options;

  useEffect(() => {
    if (!target && !internalRef) return;
    const element = (target ? getElement(target) : internalRef) as Element;

    if (!element) return;

    const onMouseEnter = (event: Event) => {
      internalOptionsRef.current?.onEntry?.(event);
      setHovering(true);
    };

    const onMouseLeave = (event: Event) => {
      internalOptionsRef.current?.onLeave?.(event);
      setHovering(false);
    };

    element.addEventListener('mouseenter', onMouseEnter);
    element.addEventListener('mouseleave', onMouseLeave);

    return () => {
      element.removeEventListener('mouseenter', onMouseEnter);
      element.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [target, internalRef]);

  if (target) return hovering;
  return [setInternalRef, hovering] as const;
}) as UseHover;

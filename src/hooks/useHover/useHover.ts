import React from 'react';

import { useEventListener } from '../useEventListener/useEventListener';

//* The use hover options */
export interface UseHoverOptions {
  //* The on entry callback */
  onEntry?: () => void;
  //* The on leave callback */
  onLeave?: () => void;
}

//* The use hover target type */
export type UseHoverTarget = React.RefObject<Element | null> | Element;
//* The use hover return type */
export type UseHoverReturn<Target extends UseHoverTarget = any> = [
  React.RefObject<Target>,
  boolean
];

export type UseHover = {
  <Target extends UseHoverTarget>(target: Target, callback?: () => void): boolean;

  <Target extends UseHoverTarget>(target: Target, options?: UseHoverOptions): boolean;

  <Target extends UseHoverTarget>(callback?: () => void, target?: never): UseHoverReturn<Target>;

  <Target extends UseHoverTarget>(
    options?: UseHoverOptions,
    target?: never
  ): UseHoverReturn<Target>;
};

/**
 * @name useHover
 * @description - Hook that defines the logic when hovering an element
 *
 * @overload
 * @template Target The target element
 * @param {Target} target The target element to be hovered
 * @param {() => void} [callback] The callback function to be invoked on mouse enter
 * @returns {boolean} The state of the hover
 *
 * @example
 * const hovering = useHover(ref, () => console.log('callback'));
 *
 * @overload
 * @template Target The target element
 * @param {Target} target The target element to be hovered
 * @param {() => void} [options.onEntry] The callback function to be invoked on mouse enter
 * @param {() => void} [options.onLeave] The callback function to be invoked on mouse leave
 * @returns {boolean} The state of the hover
 *
 * @example
 * const hovering = useHover(ref, {
 *   onEntry: () => console.log('onEntry'),
 *   onLeave: () => console.log('onLeave'),
 * });
 *
 * @overload
 * @template Target The target element
 * @param {() => void} [callback] The callback function to be invoked on mouse enter
 * @returns {UseHoverReturn<Target>} The state of the hover
 *
 * @example
 * const [ref, hovering] = useHover(() => console.log('callback'));
 *
 * @overload
 * @template Target The target element
 * @param {() => void} [options.onEntry] The callback function to be invoked on mouse enter
 * @param {() => void} [options.onLeave] The callback function to be invoked on mouse leave
 * @returns {UseHoverReturn<Target>} The state of the hover
 *
 * @example
 * const [ref, hovering] = useHover({
 *   onEntry: () => console.log('onEntry'),
 *   onLeave: () => console.log('onLeave'),
 * });
 */
export const useHover = ((...params: any[]) => {
  const target = (
    params[0] instanceof Function || !('current' in params[0]) ? undefined : params[0]
  ) as UseHoverTarget | undefined;

  const options = (
    target
      ? typeof params[1] === 'object'
        ? params[1]
        : { onEntry: params[1] }
      : typeof params[0] === 'object'
        ? params[0]
        : { onEntry: params[0] }
  ) as UseHoverOptions | undefined;

  const [hovering, setHovering] = React.useState(false);
  const internalRef = React.useRef<Element>(null);

  const onMouseEnter = () => {
    options?.onEntry?.();
    setHovering(true);
  };

  const onMouseLeave = () => {
    options?.onLeave?.();
    setHovering(false);
  };

  useEventListener(target ?? internalRef, 'mouseenter', onMouseEnter);
  useEventListener(target ?? internalRef, 'mouseleave', onMouseLeave);

  if (target) return hovering;
  return [internalRef, hovering] as const;
}) as UseHover;

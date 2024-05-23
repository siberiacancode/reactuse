import React from 'react';

import { useEventListener } from '../useEventListener/useEventListener';

export type UseHoverTarget = React.RefObject<Element | null> | Element;
export type UseHoverReturn<Target extends UseHoverTarget = any> = [
  React.RefObject<Target>,
  boolean
];

export type UseHover = {
  <Target extends UseHoverTarget>(target: Target, callback?: () => void): boolean;

  <Target extends UseHoverTarget>(callback?: () => void, target?: never): UseHoverReturn<Target>;
};

/**
 * @name useHover
 * @description - Hook that manages a counter with increment, decrement, reset, and set functionalities
 *
 * @example
 * const { count, dec, inc, reset, set } = useCounter(5);
 */
export const useHover = ((...params: any[]) => {
  const target = (params[0] instanceof Function ? null : params[0]) as UseHoverTarget | undefined;
  const callback = (target ? params[1] : params[0]) as ((...arg: any[]) => any) | undefined;

  const [hovering, setHovering] = React.useState(false);
  const internalRef = React.useRef<Element>(null);

  const oMouseEnter = () => {
    callback?.();
    setHovering(true);
  };
  const onMouseLeave = () => setHovering(false);

  useEventListener(target ?? internalRef, 'mouseenter', oMouseEnter);
  useEventListener(target ?? internalRef, 'mouseleave', onMouseLeave);

  if (target) return hovering;
  return [internalRef, hovering] as const;
}) as UseHover;

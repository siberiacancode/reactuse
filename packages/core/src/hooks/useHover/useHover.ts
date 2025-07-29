import { useEffect, useRef, useState } from 'react';

import type { HookTarget } from '@/utils/helpers';

import { getElement, isTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

import { useRefState } from '../useRefState/useRefState';

/** The use hover options type */
export interface UseHoverOptions {
  /** The on entry callback */
  onEntry?: (event: Event) => void;
  /** The on leave callback */
  onLeave?: (event: Event) => void;
}

export interface UseHoverReturn {
  value: boolean;
}

export interface UseHover {
  (target: HookTarget, callback?: (event: Event) => void): boolean;

  (target: HookTarget, options?: UseHoverOptions): boolean;

  <Target extends Element>(
    callback?: (event: Event) => void,
    target?: never
  ): {
    ref: StateRef<Target>;
  } & UseHoverReturn;

  <Target extends Element>(
    options?: UseHoverOptions,
    target?: never
  ): {
    ref: StateRef<Target>;
  } & UseHoverReturn;
}

/**
 * @name useHover
 * @description - Hook that defines the logic when hovering an element
 * @category Elements
 *
 * @overload
 * @param {HookTarget} target The target element to be hovered
 * @param {(event: Event) => void} [callback] The callback function to be invoked on mouse enter
 * @returns {boolean} The state of the hover
 *
 * @example
 * const hovering = useHover(ref, () => console.log('callback'));
 *
 * @overload
 * @param {HookTarget} target The target element to be hovered
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
 * @returns {{ ref: StateRef<Target> } & UseHoverReturn} The state of the hover
 *
 * @example
 * const [ref, hovering] = useHover(() => console.log('callback'));
 *
 * @overload
 * @template Target The target element
 * @param {(event: Event) => void} [options.onEntry] The callback function to be invoked on mouse enter
 * @param {(event: Event) => void} [options.onLeave] The callback function to be invoked on mouse leave
 * @returns {{ ref: StateRef<Target> } & UseHoverReturn} The state of the hover
 *
 * @example
 * const [ref, hovering] = useHover(options);
 */
export const useHover = ((...params: any[]) => {
  const target = (isTarget(params[0]) ? params[0] : undefined) as HookTarget | undefined;

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
  const internalRef = useRefState<Element>();
  const internalOptionsRef = useRef(options);
  internalOptionsRef.current = options;

  useEffect(() => {
    if (!target && !internalRef.state) return;
    const element = (target ? getElement(target) : internalRef.current) as Element;

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
  }, [target, internalRef.state]);

  if (target) return hovering;
  return {
    ref: internalRef,
    value: hovering
  } as const;
}) as UseHover;

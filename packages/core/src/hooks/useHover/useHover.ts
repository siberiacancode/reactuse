import { useEffect, useRef, useState } from 'react';

import type { HookTarget } from '@/utils/helpers';

import { isTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

import { useRefState } from '../useRefState/useRefState';

/** The use hover options type */
export interface UseHoverOptions {
  /** The enabled state of the hook */
  enabled?: boolean;
  /** The on entry callback */
  onEntry?: (event: Event) => void;
  /** The on leave callback */
  onLeave?: (event: Event) => void;
}

/** The use hover return type */
export interface UseHoverReturn {
  /** The value of the hover */
  value: boolean;
}

export interface UseHover {
  (target: HookTarget, callback?: (event: Event) => void): UseHoverReturn;

  (target: HookTarget, options?: UseHoverOptions): UseHoverReturn;

  <Target extends Element>(
    callback?: (event: Event) => void,
    target?: never
  ): UseHoverReturn & { ref: StateRef<Target> };

  <Target extends Element>(
    options?: UseHoverOptions,
    target?: never
  ): UseHoverReturn & { ref: StateRef<Target> };
}

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

  const enabled = options?.enabled ?? true;

  const [hovering, setHovering] = useState(false);
  const internalRef = useRefState<Element>();
  const internalOptionsRef = useRef(options);
  internalOptionsRef.current = options;

  useEffect(() => {
    if (!enabled || (!target && !internalRef.state)) return;

    const element = (target ? isTarget.getElement(target) : internalRef.current) as Element;

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
  }, [enabled, target && isTarget.getRawElement(target), internalRef.state]);

  if (target) return { value: hovering };
  return {
    ref: internalRef,
    value: hovering
  } as const;
}) as UseHover;

import type { RefObject } from 'react';

import { useLayoutEffect, useState } from 'react';

import { getElement, isTarget } from '@/utils/helpers';

/** The use scroll target element type */
export type UseScrollToTarget =
  | string
  | Document
  | Element
  | RefObject<Element | null | undefined>
  | Window;

/** The use scroll to options type */
export interface UseScrollToOptions {
  behavior?: ScrollBehavior;
  x: number;
  y: number;
}

export interface UseScrollToReturn {
  trigger: (params: { x: number; y: number; behavior?: ScrollBehavior }) => void;
}

export interface UseScrollTo {
  <Target extends UseScrollToTarget>(target: Target): UseScrollToReturn;

  <Target extends UseScrollToTarget>(
    options?: UseScrollToOptions
  ): UseScrollToReturn & { ref: (ref: Target) => void };
}

/**
 * @name useScrollTo
 * @description - Hook for scrolling to a specific element
 * @category Sensors
 *
 * @overload
 * @template Target The target element(s)
 * @param {Target} target The target element for scrolling to
 * @param {number} options.x The horizontal position to scroll to
 * @param {number} options.y The vertical position to scroll to
 * @param {ScrollBehavior} [options.behavior = 'auto'] The scrolling behavior
 * @returns {boolean} The state of scrolling
 *
 * @example
 * const ref = useScrollTo(ref, options);
 *
 * @overload
 * @template Target The target element(s)
 * @param {number} options.x The horizontal position to scroll to
 * @param {number} options.y The vertical position to scroll to
 * @param {ScrollBehavior} [options.behavior = 'auto'] The scrolling behavior
 * @returns {(node: Target) => void} The state of scrolling
 *
 * @example
 * const { ref, trigger } = useScrollTo(options);
 */
export const useScrollTo = ((...params: any[]) => {
  const target = (isTarget(params[0]) ? params[0] : undefined) as UseScrollToTarget | undefined;
  const options = ((target ? params[1] : params[0]) as UseScrollToOptions) ?? {};
  const { x, y, behavior = 'auto' } = options;
  const [internalRef, setInternalRef] = useState<Element>();

  useLayoutEffect(() => {
    if (!target && !internalRef) return;
    const element = (target ? getElement(target) : internalRef) as Element;
    if (!element) return;

    element.scrollTo({ top: y, left: x, behavior });
  }, [x, y, behavior, target, internalRef]);

  const trigger = ({ x, y, behavior }: UseScrollToOptions) => {
    const element = (target ? getElement(target) : internalRef) as Element;
    element.scrollTo({ left: x, top: y, behavior });
  };

  if (target) return trigger;
  return { ref: setInternalRef, trigger };
}) as UseScrollTo;

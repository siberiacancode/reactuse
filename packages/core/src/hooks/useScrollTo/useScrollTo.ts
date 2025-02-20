import type { RefObject } from 'react';

import { useLayoutEffect } from 'react';

import { getElement, isTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

import { useRefState } from '../useRefState/useRefState';

/** The use scroll target element type */
export type UseScrollToTarget =
  | string
  | Document
  | Element
  | RefObject<Element | null | undefined>
  | Window;

/** The use scroll to options type */
export interface UseScrollToOptions {
  /** The scrolling behavior */
  behavior?: ScrollBehavior;
  /** Whether to enable the scroll to */
  enabled?: boolean;
  /** The horizontal position to scroll to */
  x: number;
  /** The vertical position to scroll to */
  y: number;
}

/** The use scroll to return type */
export interface UseScrollToReturn {
  /** The state of scrolling */
  trigger: (params?: { x: number; y: number; behavior?: ScrollBehavior }) => void;
}

export interface UseScrollTo {
  <Target extends UseScrollToTarget>(target: Target): UseScrollToReturn;

  <Target extends UseScrollToTarget>(
    options?: UseScrollToOptions
  ): UseScrollToReturn & { ref: StateRef<Target> };
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
 * const trigger = useScrollTo(ref, options);
 *
 * @overload
 * @template Target The target element(s)
 * @param {number} options.x The horizontal position to scroll to
 * @param {number} options.y The vertical position to scroll to
 * @param {ScrollBehavior} [options.behavior = 'auto'] The scrolling behavior
 * @returns {StateRef<Target>} The state of scrolling
 *
 * @example
 * const { ref, trigger } = useScrollTo(options);
 */
export const useScrollTo = ((...params: any[]) => {
  const target = (isTarget(params[0]) ? params[0] : undefined) as UseScrollToTarget | undefined;
  const options = ((target ? params[1] : params[0]) as UseScrollToOptions) ?? {};
  const { x, y, behavior = 'auto', enabled = true } = options;
  const internalRef = useRefState<Element>();

  useLayoutEffect(() => {
    if (!enabled) return;
    if (!target && !internalRef.state) return;

    const element = (target ? getElement(target) : internalRef.current) as Element;
    if (!element) return;

    element.scrollTo({ top: y, left: x, behavior });
  }, [target, internalRef.state]);

  const trigger = (params?: { x: number; y: number; behavior?: ScrollBehavior }) => {
    const element = (target ? getElement(target) : internalRef.current) as Element;
    if (!element) return;
    const { x, y, behavior } = params ?? {};

    element.scrollTo({ left: x, top: y, behavior });
  };

  if (target) return trigger;
  return { ref: internalRef, trigger };
}) as UseScrollTo;

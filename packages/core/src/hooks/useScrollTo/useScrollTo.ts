import { useLayoutEffect } from 'react';

import type { HookTarget } from '@/utils/helpers';

import { getElement, isTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

import { useRefState } from '../useRefState/useRefState';

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
  <Target extends Element>(
    options?: UseScrollToOptions,
    target?: never
  ): UseScrollToReturn & { ref: StateRef<Target> };

  (target: HookTarget, options?: UseScrollToOptions): UseScrollToReturn;
}

/**
 * @name useScrollTo
 * @description - Hook for scrolling to a specific element
 * @category Sensors
 *
 * @overload
 * @param {HookTarget} target The target element for scrolling to
 * @param {UseScrollToOptions} [options] The scroll options
 * @returns {UseScrollToReturn} The scroll trigger function
 *
 * @example
 * const trigger = useScrollTo(ref, options);
 *
 * @overload
 * @template Target The target element
 * @param {UseScrollToOptions} [options] The scroll options
 * @returns {UseScrollToReturn & { ref: StateRef<Target> }} The scroll trigger function and ref
 *
 * @example
 * const { ref, trigger } = useScrollTo(options);
 */
export const useScrollTo = ((...params: any[]) => {
  const target = (isTarget(params[0]) ? params[0] : undefined) as HookTarget | undefined;
  const options = (target ? params[1] : params[0]) as UseScrollToOptions | undefined;
  const { x, y, behavior = 'auto', enabled = true } = options ?? {};
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

  if (target) return { trigger };
  return { ref: internalRef, trigger };
}) as UseScrollTo;

import type { RefObject } from 'react';

import { useEffect } from 'react';

import { getElement } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

import { useRefState } from '../useRefState/useRefState';

/** The scroll into view options type */
export interface UseScrollIntoViewOptions extends ScrollIntoViewOptions {
  /** Whether to enable the scroll into view */
  enabled?: boolean;
}

/** The scroll into view target type */
export type UseScrollIntoViewTarget = string | Element | RefObject<Element | null | undefined>;

/** The scroll into view return type */
export interface UseScrollIntoViewReturn {
  /** Function to scroll element into view */
  trigger: (params?: {
    behavior?: ScrollBehavior;
    block?: ScrollLogicalPosition;
    inline?: ScrollLogicalPosition;
  }) => void;
}

export interface UseScrollIntoViewOverload {
  <Target extends UseScrollIntoViewTarget>(
    target: Target,
    options?: UseScrollIntoViewOptions
  ): UseScrollIntoViewReturn;

  <Target extends UseScrollIntoViewTarget>(
    options?: UseScrollIntoViewOptions,
    target?: never
  ): { ref: StateRef<Target> } & UseScrollIntoViewReturn;
}

/**
 * @name useScrollIntoView
 * @description - Hook that provides functionality to scroll an element into view
 * @category Sensors
 *
 * @overload
 * @template Target The target element
 * @param {Target} target The target element to scroll into view
 * @param {ScrollBehavior} [options.behavior='smooth'] The scrolling behavior
 * @param {ScrollLogicalPosition} [options.block='start'] The vertical alignment
 * @param {ScrollLogicalPosition} [options.inline='nearest'] The horizontal alignment
 * @returns {UseScrollIntoViewReturn} Object containing scroll function
 *
 * @example
 * const { trigger } = useScrollIntoView(ref);
 *
 * @overload
 * @template Target The target element
 * @param {ScrollBehavior} [options.behavior='smooth'] The scrolling behavior
 * @param {ScrollLogicalPosition} [options.block='start'] The vertical alignment
 * @param {ScrollLogicalPosition} [options.inline='nearest'] The horizontal alignment
 * @returns {UseScrollIntoViewReturn & { ref: StateRef<Target> }} Object containing scroll function and ref
 *
 * @example
 * const { ref, trigger } = useScrollIntoView<HTMLDivElement>();
 */
export const useScrollIntoView = ((...params: any[]) => {
  const target = (
    typeof params[0] !== 'object' || 'current' in params[0] || params[0] instanceof Element
      ? params[0]
      : undefined
  ) as UseScrollIntoViewTarget | undefined;
  const options = (target ? params[1] : params[0]) as UseScrollIntoViewOptions | undefined;

  const internalRef = useRefState<Element>();
  const {
    behavior = 'smooth',
    block = 'start',
    inline = 'nearest',
    enabled = true
  } = options ?? {};

  useEffect(() => {
    if (!enabled) return;
    if (!target && !internalRef.state) return;

    const element = (target ? getElement(target) : internalRef.current) as Element;
    if (!element) return;

    element.scrollIntoView({
      behavior,
      block,
      inline
    });
  }, [target, internalRef.state, enabled]);

  const trigger = (params?: {
    behavior?: ScrollBehavior;
    block?: ScrollLogicalPosition;
    inline?: ScrollLogicalPosition;
  }) => {
    const element = (target ? getElement(target) : internalRef.current) as Element;
    if (!element) return;

    const { behavior, block, inline } = params ?? {};

    element.scrollIntoView({
      behavior,
      block,
      inline
    });
  };

  if (target) return { trigger };
  return { ref: internalRef, trigger };
}) as UseScrollIntoViewOverload;

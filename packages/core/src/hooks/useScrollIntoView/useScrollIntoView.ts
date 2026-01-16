import { useRef } from 'react';

import type { HookTarget } from '@/utils/helpers';

import { isTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

import { useIsomorphicLayoutEffect } from '../useIsomorphicLayoutEffect/useIsomorphicLayoutEffect';
import { useRefState } from '../useRefState/useRefState';

/** The scroll into view options type */
export interface UseScrollIntoViewOptions extends ScrollIntoViewOptions {
  /** Whether to immediately the scroll into view */
  immediately?: boolean;
}

/** The scroll into view return type */
export interface UseScrollIntoViewReturn {
  /** Function to scroll element into view */
  trigger: (params?: {
    behavior?: ScrollBehavior;
    block?: ScrollLogicalPosition;
    inline?: ScrollLogicalPosition;
  }) => void;
}

export interface UseScrollIntoView {
  <Target extends Element>(
    options?: UseScrollIntoViewOptions,
    target?: never
  ): UseScrollIntoViewReturn & { ref: StateRef<Target> };

  (target?: HookTarget, options?: UseScrollIntoViewOptions): UseScrollIntoViewReturn;
}

/**
 * @name useScrollIntoView
 * @description - Hook that provides functionality to scroll an element into view
 * @category Sensors
 * @usage low
 *
 * @overload
 * @param {HookTarget} [target=window] The target element to scroll into view
 * @param {boolean} [options.immediately=true] Whether to scroll immediately
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
 * @param {boolean} [options.immediately=true] Whether to scroll immediately
 * @param {ScrollBehavior} [options.behavior='smooth'] The scrolling behavior
 * @param {ScrollLogicalPosition} [options.block='start'] The vertical alignment
 * @param {ScrollLogicalPosition} [options.inline='nearest'] The horizontal alignment
 * @returns {UseScrollIntoViewReturn & { ref: StateRef<Target> }} Object containing scroll function and ref
 *
 * @example
 * const { ref, trigger } = useScrollIntoView<HTMLDivElement>();
 */
export const useScrollIntoView = ((...params: any[]) => {
  const target = (isTarget(params[0]) ? params[0] : undefined) as HookTarget | undefined;
  const options = (target ? params[1] : params[0]) as UseScrollIntoViewOptions | undefined;

  const internalRef = useRefState<Element>();
  const {
    behavior = 'smooth',
    block = 'start',
    inline = 'nearest',
    immediately = true
  } = options ?? {};
  const elementRef = useRef<Element>(null);

  useIsomorphicLayoutEffect(() => {
    if (!immediately) return;
    if (!target && !internalRef.state) return;

    const element =
      ((target ? isTarget.getElement(target) : internalRef.current) as Element) ?? window;

    elementRef.current = element;

    element.scrollIntoView({
      behavior,
      block,
      inline
    });
  }, [target && isTarget.getRawElement(target), internalRef.state]);

  const trigger = (params?: {
    behavior?: ScrollBehavior;
    block?: ScrollLogicalPosition;
    inline?: ScrollLogicalPosition;
  }) => {
    if (!elementRef.current) return;

    const { behavior, block, inline } = params ?? {};

    elementRef.current.scrollIntoView({
      behavior,
      block,
      inline
    });
  };

  if (target) return { trigger };
  return { ref: internalRef, trigger };
}) as UseScrollIntoView;

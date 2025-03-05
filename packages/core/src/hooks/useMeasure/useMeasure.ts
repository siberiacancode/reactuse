import { useEffect, useState } from 'react';

import type { HookTarget } from '@/utils/helpers';

import { getElement, isTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

import { useRefState } from '../useRefState/useRefState';

/** The use measure return type */
export type UseMeasureReturn = Pick<
  DOMRectReadOnly,
  'bottom' | 'height' | 'left' | 'right' | 'top' | 'width' | 'x' | 'y'
>;

export interface UseMeasure {
  (target: HookTarget): UseMeasureReturn;

  <Target extends Element>(
    target?: never
  ): UseMeasureReturn & {
    ref: StateRef<Target>;
  };
}

/**
 * @name useMeasure
 * @description - Hook to measure the size and position of an element
 * @category Browser
 *
 * @overload
 * @param {HookTarget} target The element to measure
 * @returns {UseMeasureReturn} The element's size and position
 *
 * @example
 * const { x, y, width, height, top, left, bottom, right } = useMeasure(ref);
 *
 * @overload
 * @template Target The element to measure
 * @returns {UseMeasureReturn & { ref: StateRef<Target> }} The element's size and position
 *
 * @example
 * const { ref, x, y, width, height, top, left, bottom, right } = useMeasure();
 */
export const useMeasure = ((...params: any[]) => {
  const target = (isTarget(params[0]) ? params[0] : undefined) as HookTarget | undefined;

  const internalRef = useRefState<Element>();
  const [rect, setRect] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  });

  useEffect(() => {
    if (!target && !internalRef.state) return;

    const element = (target ? getElement(target) : internalRef.current) as Element;
    if (!element) return;

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;

      const { x, y, width, height, top, left, bottom, right } = entry.contentRect;
      setRect({ x, y, width, height, top, left, bottom, right });
    });

    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, [target, internalRef.state]);

  if (target) return rect;
  return { ref: internalRef, ...rect };
}) as UseMeasure;

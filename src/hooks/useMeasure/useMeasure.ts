import type { RefObject } from 'react';
import { useRef, useState } from 'react';

import { useResizeObserver } from '../useResizeObserver/useResizeObserver';

/** The use measure target element type */
export type UseMeasureTarget = RefObject<Element | null | undefined> | (() => Element) | Element;

/** The use measure return type */
export type UseMeasureReturn = Pick<
  DOMRectReadOnly,
  'x' | 'y' | 'top' | 'left' | 'right' | 'bottom' | 'height' | 'width'
>;

export type UseMeasureScreen = {
  <Target extends UseMeasureTarget>(target: Target): UseMeasureReturn;

  <Target extends UseMeasureTarget>(target?: never): UseMeasureReturn & { ref: RefObject<Target> };
};

/**
 * @name useMeasure
 * @description - Hook to measure the size and position of an element
 * @category Browser
 *
 * @overload
 * @template Target The element to measure
 * @param {Target} [target] The element to measure
 * @returns {UseMeasureReturn} The element's size and position
 *
 * @example
 * const { x, y, width, height, top, left, bottom, right } = useMeasure(ref);
 *
 * @overload
 * @template Target The element to measure
 * @returns {UseMeasureReturn & { ref: RefObject<Target> }} The element's size and position
 *
 * @example
 * const { ref, x, y, width, height, top, left, bottom, right } = useMeasure();
 */
export const useMeasure = (<Target extends UseMeasureTarget>(target?: Target) => {
  const internalRef = useRef<Element>();
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

  useResizeObserver(target ?? internalRef, {
    onChange: ([entry]) => {
      if (!entry) return;

      const { x, y, width, height, top, left, bottom, right } = entry.contentRect;
      setRect({ x, y, width, height, top, left, bottom, right });
    }
  });

  if (target) return rect;
  return { ref: internalRef, ...rect };
}) as UseMeasureScreen;

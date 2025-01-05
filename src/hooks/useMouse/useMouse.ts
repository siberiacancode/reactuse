import type { RefObject } from 'react';

import { useEffect, useState } from 'react';

import { getElement } from '@/utils/helpers';

/** The use mouse target element type */
export type UseMouseTarget =
  | (() => Element)
  | string
  | Element
  | RefObject<Element | null | undefined>;

/** The use mouse return type */
export interface UseMouseReturn {
  /** The current element */
  element: Element;
  /** The current element position x */
  elementPositionX: number;
  /** The current element position y */
  elementPositionY: number;
  /** The current element x position */
  elementX: number;
  /** The current element y position */
  elementY: number;
  /** The current mouse x position */
  x: number;
  /** The current mouse y position */
  y: number;
}

export interface UseMouse {
  <Target extends UseMouseTarget>(target: Target): UseMouseReturn;

  <Target extends UseMouseTarget>(target?: never): UseMouseReturn & { ref: (node: Target) => void };
}

/**
 * @name useMouse
 * @description - Hook that manages a mouse position
 * @category Sensors
 *
 * @overload
 * @template Target The target element
 * @param {Target} target The target element to manage the mouse position for
 * @returns {UseMouseReturn} An object with the current mouse position
 *
 * @example
 * const { x, y, elementX, elementY, elementPositionX, elementPositionY } = useMouse(target);
 *
 * @overload
 * @template Target The target element
 * @returns {UseMouseReturn & { ref: (node: Target) => void }} An object with the current mouse position and a ref
 *
 * @example
 * const { ref, x, y, elementX, elementY, elementPositionX, elementPositionY } = useMouse();
 */
export const useMouse = ((target) => {
  const [value, setValue] = useState({
    x: 0,
    y: 0,
    elementX: 0,
    elementY: 0,
    elementPositionX: 0,
    elementPositionY: 0
  });

  const [internalRef, setInternalRef] = useState<Element>();

  useEffect(() => {
    if (!target && !internalRef) return;
    const onMouseMove = (event: MouseEvent) => {
      const element = (target ? getElement(target) : internalRef) as Element;
      if (!element) return;

      const updatedValue = {
        x: event.pageX,
        y: event.pageY
      } as typeof value;

      const { left, top } = element.getBoundingClientRect();
      const elementPositionX = left + window.scrollX;
      const elementPositionY = top + window.scrollY;
      const elementX = event.pageX - elementPositionX;
      const elementY = event.pageY - elementPositionY;

      updatedValue.elementX = elementX;
      updatedValue.elementY = elementY;
      updatedValue.elementPositionX = elementPositionX;
      updatedValue.elementPositionY = elementPositionY;

      setValue((prevValue) => ({
        ...prevValue,
        ...updatedValue
      }));
    };

    document.addEventListener('mousemove', onMouseMove);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
    };
  }, [internalRef, target]);

  if (target) return { ...value, element: target ?? internalRef };
  return {
    ref: setInternalRef,
    ...value,
    element: target ?? internalRef
  };
}) as UseMouse;

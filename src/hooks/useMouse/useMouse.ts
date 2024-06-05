import React from 'react';

import { useIsomorphicLayoutEffect } from '../useIsomorphicLayoutEffect/useIsomorphicLayoutEffect';

/** The use mouse target element type */
type UseMouseTarget = React.RefObject<Element | null> | (() => Element) | Element;

/** Function to get target element based on its type */
const getElement = (target: UseMouseTarget) => {
  if (typeof target === 'function') {
    return target();
  }

  if (target instanceof Element) {
    return target;
  }

  return target.current;
};

/** The use mouse return type */
export interface UseMouseReturn {
  /** The current mouse x position */
  x: number;
  /** The current mouse y position */
  y: number;
  /** The current element x position */
  elementX: number;
  /** The current element y position */
  elementY: number;
  /** The current element position x */
  elementPositionX: number;
  /** The current element position y */
  elementPositionY: number;
}

export type UseMouse = {
  <Target extends UseMouseTarget>(target: Target): UseMouseReturn;

  <Target extends UseMouseTarget>(
    target?: never
  ): UseMouseReturn & { ref: React.RefObject<Target> };
};

/**
 * @name useMouse
 * @description - Hook that manages a mouse position
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
 * @returns {UseMouseReturn & { ref: React.RefObject<Target> }} An object with the current mouse position and a ref
 *
 * @example
 * const { ref, x, y, elementX, elementY, elementPositionX, elementPositionY } = useMouse();
 */
export const useMouse = ((...params: any[]) => {
  const target = params[0] as UseMouseTarget | undefined;
  console.log('@', target);

  const [value, setValue] = React.useState({
    x: 0,
    y: 0,
    elementX: 0,
    elementY: 0,
    elementPositionX: 0,
    elementPositionY: 0
  });

  const internalRef = React.useRef<Element>(null);

  useIsomorphicLayoutEffect(() => {
    const onMouseMove = (event: MouseEvent) => {
      const element = target ? getElement(target) : internalRef.current;
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
  }, []);

  if (target) return value;
  return { ...value, ref: internalRef };
}) as UseMouse;

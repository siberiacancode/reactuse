import { useEffect, useState } from 'react';

import type { HookTarget } from '@/utils/helpers';

import { isTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

import { useRefState } from '../useRefState/useRefState';

/** The use mouse return type */
export interface UseMouseReturn {
  /** The current mouse client x position */
  clientX: number;
  /** The current mouse client y position */
  clientY: number;
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
  (target: HookTarget): UseMouseReturn;

  <Target extends Element>(
    target?: never
  ): UseMouseReturn & {
    ref: StateRef<Target>;
  };

  (target?: Window): UseMouseReturn;
}

/**
 * @name useMouse
 * @description - Hook that manages a mouse position
 * @category Sensors
 * @usage low
 *
 * @overload
 * @param {HookTarget} [target=window] The target element to manage the mouse position for
 * @returns {UseMouseReturn} An object with the current mouse position
 *
 * @example
 * const { x, y, clientX, clientY, elementX, elementY, elementPositionX, elementPositionY } = useMouse(ref);
 *
 * @overload
 * @template Target The target element
 * @returns {UseMouseReturn & { ref: StateRef<Target> }} An object with the current mouse position and a ref
 *
 * @example
 * const { ref, x, y, clientX, clientY, elementX, elementY, elementPositionX, elementPositionY } = useMouse();
 */
export const useMouse = ((...params: any[]) => {
  const target = isTarget(params[0]) ? params[0] : undefined;

  const [value, setValue] = useState<UseMouseReturn>({
    x: 0,
    y: 0,
    elementX: 0,
    elementY: 0,
    elementPositionX: 0,
    elementPositionY: 0,
    clientX: 0,
    clientY: 0
  });

  const internalRef = useRefState<Element>();

  useEffect(() => {
    const onMouseMove = (event: MouseEvent) => {
      const element = (target ? isTarget.getElement(target) : internalRef.current) as
        | Element
        | undefined;

      const updatedValue = {
        x: event.pageX,
        y: event.pageY,
        clientX: event.clientX,
        clientY: event.clientY
      } as typeof value;

      if (element) {
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
      } else {
        updatedValue.elementX = event.pageX;
        updatedValue.elementY = event.pageY;
        updatedValue.elementPositionX = 0;
        updatedValue.elementPositionY = 0;

        setValue((prevValue) => ({
          ...prevValue,
          ...updatedValue
        }));
      }
    };

    const onScroll = () => {
      setValue((prevValue) => ({
        ...prevValue,
        x: prevValue.x + window.scrollX - prevValue.elementPositionX,
        y: prevValue.y + window.scrollY - prevValue.elementPositionY,
        elementPositionX: window.scrollX,
        elementPositionY: window.scrollY
      }));
    };

    document.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('mousemove', onMouseMove);
    return () => {
      document.removeEventListener('scroll', onScroll);
      document.removeEventListener('mousemove', onMouseMove);
    };
  }, [internalRef.state, target && isTarget.getRawElement(target)]);

  if (target) return value;
  return {
    ref: internalRef,
    ...value
  };
}) as UseMouse;

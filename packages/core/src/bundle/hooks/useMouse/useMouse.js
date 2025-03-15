import { useEffect, useState } from 'react';
import { getElement, isTarget } from '@/utils/helpers';
import { useRefState } from '../useRefState/useRefState';
/**
 * @name useMouse
 * @description - Hook that manages a mouse position
 * @category Sensors
 *
 * @overload
 * @param {HookTarget} target The target element to manage the mouse position for
 * @returns {UseMouseReturn} An object with the current mouse position
 *
 * @example
 * const { x, y, elementX, elementY, elementPositionX, elementPositionY } = useMouse(ref);
 *
 * @overload
 * @template Target The target element
 * @returns {UseMouseReturn & { ref: StateRef<Target> }} An object with the current mouse position and a ref
 *
 * @example
 * const { ref, x, y, elementX, elementY, elementPositionX, elementPositionY } = useMouse();
 */
export const useMouse = (...params) => {
  const target = isTarget(params[0]) ? params[0] : undefined;
  const [value, setValue] = useState({
    x: 0,
    y: 0,
    element: undefined,
    elementX: 0,
    elementY: 0,
    elementPositionX: 0,
    elementPositionY: 0
  });
  const internalRef = useRefState();
  useEffect(() => {
    if (!target && !internalRef.state) return;
    const onMouseMove = (event) => {
      const element = target ? getElement(target) : internalRef.current;
      if (!element) return;
      const updatedValue = {
        x: event.pageX,
        y: event.pageY
      };
      const { left, top } = element.getBoundingClientRect();
      const elementPositionX = left + window.scrollX;
      const elementPositionY = top + window.scrollY;
      const elementX = event.pageX - elementPositionX;
      const elementY = event.pageY - elementPositionY;
      updatedValue.element = element;
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
  }, [internalRef.state, target]);
  if (target) return value;
  return {
    ref: internalRef,
    ...value
  };
};

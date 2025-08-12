import { useEffect, useState } from 'react';
import { getElement, isTarget } from '@/utils/helpers';
import { useRefState } from '../useRefState/useRefState';
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
export const useMouse = (...params) => {
  const target = isTarget(params[0]) ? params[0] : undefined;
  const [value, setValue] = useState({
    x: 0,
    y: 0,
    elementX: 0,
    elementY: 0,
    elementPositionX: 0,
    elementPositionY: 0,
    clientX: 0,
    clientY: 0
  });
  const internalRef = useRefState();
  useEffect(() => {
    const onMouseMove = (event) => {
      const element = target ? getElement(target) : internalRef.current;
      const updatedValue = {
        x: event.pageX,
        y: event.pageY,
        clientX: event.clientX,
        clientY: event.clientY
      };
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
  }, [internalRef.state, target]);
  if (target) return value;
  return {
    ref: internalRef,
    ...value
  };
};

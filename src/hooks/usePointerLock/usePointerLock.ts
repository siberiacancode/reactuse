import type { MouseEvent, RefObject } from 'react';
import { useEffect, useState } from 'react';

type UsePointerLockTarget = RefObject<Element | null | undefined>;

interface UsePointerLockReturn {
  element?: Element;
  supported: boolean;
  lock: (event: Event | MouseEvent<Element>) => void;
  unlock: () => boolean;
}

/**
 * @name usePointerLock
 * @description - Hook that provides reactive pointer lock
 * @category Sensors
 *
 * @param {UsePointerLockTarget} target The target element for the pointer lock
 * @returns {UsePointerLockReturn} An object containing the pointer lock element and functions to interact with the pointer lock
 *
 * @example
 * const { supported, lock, unlock, element } = usePointerLock();
 */

export const usePointerLock = (target?: UsePointerLockTarget): UsePointerLockReturn => {
  const supported = !!document && 'pointerLockElement' in document;

  const [element, setElement] = useState<Element>();

  useEffect(() => {
    if (!supported) return;

    const handlePointerLockChange = () => {
      if (!supported) return;

      const currentElement = document.pointerLockElement ?? element;

      if (currentElement && currentElement === element) {
        setElement(document.pointerLockElement as Element);
      }
    };
    const handlePointerLockError = () => {
      if (!supported) return;

      const currentElement = document.pointerLockElement ?? element;

      if (currentElement && currentElement === element) {
        const action = document.pointerLockElement ? 'release' : 'acquire';

        throw new Error(`Failed to ${action} pointer lock.`);
      }
    };

    document.addEventListener('pointerlockchange', handlePointerLockChange);
    document.addEventListener('pointerlockerror', handlePointerLockError);

    return () => {
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
      document.removeEventListener('pointerlockerror', handlePointerLockError);
    };
  }, [supported, element]);

  const lock = (event: Event | MouseEvent<Element>) => {
    if (!supported) return;

    const element = event instanceof Event ? target?.current : event.currentTarget;

    if (!element) return;

    element.requestPointerLock();

    setElement(element);
  };

  const unlock = () => {
    if (!element) return false;

    document.exitPointerLock();

    setElement(undefined);

    return true;
  };

  return {
    supported,
    element,
    lock,
    unlock
  };
};

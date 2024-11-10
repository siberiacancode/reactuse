import type { MouseEvent, RefObject } from 'react';
import { useEffect, useState } from 'react';

type UsePointerLockTarget = RefObject<Element | undefined | null>;

interface UsePointerLockReturn {
  supported: boolean;
  element?: Element;
  lock: (event: MouseEvent<Element> | Event) => void;
  unlock: () => boolean;
}

/**
 * @name usePointerLock
 * @description - Reactive pointer lock
 * @category Sensors
 *
 * @param {RefObject<Element>} target
 * @returns {UsePointerLockReturn} An object containing the current pointer lock element and functions to interact with the pointer lock
 *
 * @example
 * const { supported, lock, unlock, element } = usePointerLock();
 */

export const usePointerLock = (target?: UsePointerLockTarget): UsePointerLockReturn => {
  const supported = !!document && 'pointerLockElement' in document;

  const [element, setElement] = useState<Element>();

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

  useEffect(() => {
    if (!supported) return;

    document.addEventListener('pointerlockchange', handlePointerLockChange);
    document.addEventListener('pointerlockerror', handlePointerLockError);

    return () => {
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
      document.removeEventListener('pointerlockerror', handlePointerLockError);
    };
  }, [supported, element]);

  const lock = (event: MouseEvent<Element> | Event) => {
    if (!supported) return;

    const targetElement = event instanceof Event ? target?.current : event.currentTarget;

    if (!targetElement) return;

    targetElement.requestPointerLock();

    setElement(targetElement);
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

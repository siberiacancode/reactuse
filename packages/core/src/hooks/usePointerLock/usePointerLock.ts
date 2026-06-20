import type { MouseEvent } from 'react';

import { useEffect, useState } from 'react';

/** The use pointer lock return type */
interface UsePointerLockReturn {
  /** The pointer lock element */
  element?: Element;
  /** Whether the pointer lock is supported */
  supported: boolean;
  /** Lock the pointer lock */
  lock: (event: MouseEvent) => void;
  /** Unlock the pointer lock */
  unlock: () => boolean;
}

/**
 * @name usePointerLock
 * @description - Hook that provides reactive pointer lock
 * @category Browser
 * @usage low
 *
 * @browserapi pointerLockElement https://developer.mozilla.org/en-US/docs/Web/API/Document/pointerLockElement
 *
 * @returns {UsePointerLockReturn} An object containing the pointer lock element and functions to interact with the pointer lock
 *
 * @example
 * const { supported, lock, unlock, element } = usePointerLock();
 */
export const usePointerLock = (): UsePointerLockReturn => {
  const supported =
    typeof document !== 'undefined' &&
    'pointerLockElement' in document &&
    'exitPointerLock' in document &&
    !!document.exitPointerLock;
  const [element, setElement] = useState<Element>();

  useEffect(() => {
    if (!supported) return;

    const onPointerLockChange = () => {
      if (!supported) return;

      const currentElement = document.pointerLockElement ?? element;

      if (currentElement && currentElement === element) {
        setElement(document.pointerLockElement as Element);
      }
    };
    const onPointerLockError = () => {
      if (!supported) return;

      const currentElement = document.pointerLockElement ?? element;

      if (currentElement && currentElement === element) {
        const action = document.pointerLockElement ? 'release' : 'acquire';

        throw new Error(`Failed to ${action} pointer lock.`);
      }
    };

    document.addEventListener('pointerlockchange', onPointerLockChange);
    document.addEventListener('pointerlockerror', onPointerLockError);

    return () => {
      document.removeEventListener('pointerlockchange', onPointerLockChange);
      document.removeEventListener('pointerlockerror', onPointerLockError);
    };
  }, []);

  const lock = (event: MouseEvent) => {
    if (!supported) return false;

    if (!(event.currentTarget instanceof Element)) return false;

    event.currentTarget.requestPointerLock();

    setElement(event.currentTarget);
    return true;
  };

  const unlock = () => {
    if (!supported) return false;

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

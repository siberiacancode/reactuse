import type { MouseEvent, MutableRefObject, RefObject } from 'react';
import { useRef, useState } from 'react';

import { useEventListener } from '../useEventListener/useEventListener';

type MaybeHTMLElement = HTMLElement | undefined | null;
type MaybeElementRef<T> = RefObject<T | null | undefined>;

interface UsePointerLockOptions {
  document?: Document;
}

interface UsePointerLockReturn {
  isSupported: boolean;
  triggerElement: MutableRefObject<MaybeHTMLElement>;
  element: MaybeHTMLElement;
  lock: (event: MouseEvent<HTMLDivElement> | Event) => void;
  unlock: () => boolean;
}

/**
 * @name usePointerLock
 * @description - Reactive pointer lock
 * @category Sensors
 *
 * @param {MaybeElementRef<MaybeHTMLElement>} target
 * @param {Document} [options.document = window.document]
 * @returns {UsePointerLockReturn} An object containing the current pointer lock element and functions to interact with the pointer lock
 *
 * @example
 * const { isSupported, lock, unlock, element, triggerElement } = usePointerLock();
 */

export const usePointerLock = (
  target?: MaybeElementRef<MaybeHTMLElement>,
  options: UsePointerLockOptions = {}
): UsePointerLockReturn => {
  const { document = window.document } = options;
  const isSupported = !!document && 'pointerLockElement' in document;

  const [element, setElement] = useState<MaybeHTMLElement>();
  const triggerElement = useRef<MaybeHTMLElement>();
  const targetElement = useRef<MaybeHTMLElement>();

  useEventListener(document, 'pointerlockchange', () => {
    if (!isSupported) return;

    const currentElement = document!.pointerLockElement ?? element;

    if (targetElement && currentElement === targetElement.current) {
      setElement(document.pointerLockElement as MaybeHTMLElement);
      if (!element) {
        targetElement.current = triggerElement.current = null;
      }
    }
  });

  useEventListener(document, 'pointerlockerror', () => {
    if (!isSupported) return;

    const currentElement = document!.pointerLockElement ?? element;

    if (currentElement === (target?.current || triggerElement.current)) {
      const action = document!.pointerLockElement ? 'release' : 'acquire';

      throw new Error(`Failed to ${action} pointer lock.`);
    }
  });

  const lock = (event: MouseEvent<HTMLDivElement> | Event) => {
    if (!isSupported) throw new Error('Pointer Lock API is not supported by your browser.');

    triggerElement.current = event instanceof Event ? (event.currentTarget as HTMLElement) : null;

    targetElement.current =
      event instanceof Event ? (target?.current ?? triggerElement.current) : event.currentTarget;

    if (!targetElement) throw new Error('Target element undefined.');

    targetElement.current?.requestPointerLock();

    setElement(targetElement.current);
  };

  const unlock = () => {
    if (!element) return false;

    document.exitPointerLock();

    setElement(null);

    return true;
  };

  return {
    isSupported,
    triggerElement,
    element,
    lock,
    unlock
  };
};

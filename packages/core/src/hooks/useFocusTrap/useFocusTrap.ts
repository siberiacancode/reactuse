import { useState } from 'react';

import type { HookTarget } from '@/utils/helpers';

import { isTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

import { useIsomorphicLayoutEffect } from '../useIsomorphicLayoutEffect/useIsomorphicLayoutEffect';
import { useRefState } from '../useRefState/useRefState';

export const FOCUS_SELECTOR = 'a, input, select, textarea, button, object, [tabindex]';

const getFocusableElements = (element: HTMLElement) => {
  const elements = Array.from(element.querySelectorAll(FOCUS_SELECTOR));
  return elements.filter((element) => {
    const htmlEl = element as HTMLElement;
    return htmlEl.tabIndex !== -1 && !htmlEl.hidden && htmlEl.style.display !== 'none';
  }) as HTMLElement[];
};

const focusElement = (element: HTMLElement) => {
  const autofocusElement = element.querySelector('[data-autofocus]') as HTMLElement;
  if (autofocusElement) return autofocusElement.focus();
  const focusableElements = getFocusableElements(element);
  if (focusableElements.length) focusableElements[0].focus();
};

/** The use focus trap return type */
export interface UseFocusTrapReturn {
  /** Whether focus trap is active */
  active: boolean;
  /** Disable focus trap */
  disable: () => void;
  /** Enable focus trap */
  enable: () => void;
  /** Toggle focus trap */
  toggle: () => void;
}

export interface UseFocusTrap {
  (target: HookTarget, active?: boolean): UseFocusTrapReturn;

  <Target extends HTMLElement>(
    active?: boolean,
    target?: never
  ): UseFocusTrapReturn & {
    ref: StateRef<Target>;
  };
}

/**
 * @name useFocusTrap
 * @description - Hook that traps focus within a given element
 * @category Elements
 * @usage medium
 *
 * @overload
 * @param {HookTarget} target The target element for focus trap
 * @param {boolean} [active=true] Whether focus trap is active
 * @returns {UseFocusTrapReturn} Object with control methods and state
 *
 * @example
 * const { active, disable, toggle, enable } = useFocusTrap(ref, true);
 *
 * @overload
 * @template Target The target element type
 * @param {boolean} [active=true] Whether focus trap is active
 * @returns {UseFocusTrapReturn & { ref: StateRef<Target> }} Object with ref and controls
 *
 * @example
 * const { ref, active, disable, toggle, enable } = useFocusTrap(true);
 */
export const useFocusTrap = ((...params: any[]) => {
  const target = (isTarget(params[0]) ? params[0] : undefined) as HookTarget | undefined;
  const initialActive = target ? params[1] : params[0];

  const [active, setActive] = useState(initialActive);
  const internalRef = useRefState<HTMLElement>();

  const enable = () => setActive(true);
  const disable = () => setActive(false);
  const toggle = () => setActive((prevActive: boolean) => !prevActive);

  useIsomorphicLayoutEffect(() => {
    if (!active) return;

    const element = target ? isTarget.getElement(target) : internalRef.current;
    if (!element) return;

    const htmlElement = element as HTMLElement;
    focusElement(htmlElement);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      const [firstElement, ...restElements] = getFocusableElements(htmlElement);
      if (!restElements.length) return;

      const lastElement = restElements.at(-1)!;

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }

      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [active, target, internalRef.state, isTarget.getRefState(target)]);

  if (target) return { active, enable, disable, toggle };
  return { active, enable, disable, toggle, ref: internalRef };
}) as UseFocusTrap;

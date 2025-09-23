import { useState } from 'react';
import { getElement, isTarget } from '@/utils/helpers';
import { useIsomorphicLayoutEffect } from '../useIsomorphicLayoutEffect/useIsomorphicLayoutEffect';
import { useRefState } from '../useRefState/useRefState';
const FOCUSABLE_ELEMENTS_SELECTOR = [
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'button:not([disabled])',
  'a[href]',
  'area[href]',
  'summary',
  'iframe',
  'object',
  'embed',
  'audio[controls]',
  'video[controls]',
  '[contenteditable]',
  '[tabindex]:not([tabindex^="-"])'
].join(',');
const getFocusableElements = (element) => {
  const elements = Array.from(element.querySelectorAll(FOCUSABLE_ELEMENTS_SELECTOR));
  return elements.filter((el) => {
    const htmlEl = el;
    return htmlEl.tabIndex !== -1 && !htmlEl.hidden && htmlEl.style.display !== 'none';
  });
};
const focusElement = (element) => {
  const autofocusElement = element.querySelector('[data-autofocus]');
  if (autofocusElement) return autofocusElement.focus();
  const focusableElements = getFocusableElements(element);
  if (focusableElements.length > 0) {
    focusableElements[0].focus();
  }
};
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
export const useFocusTrap = (...params) => {
  const target = isTarget(params[0]) ? params[0] : undefined;
  const initialActive = target ? params[1] : params[0];
  const [active, setActive] = useState(initialActive);
  const internalRef = useRefState();
  const enable = () => setActive(true);
  const disable = () => setActive(false);
  const toggle = () => setActive((prevActive) => !prevActive);
  useIsomorphicLayoutEffect(() => {
    if (!active) return;
    const element = target ? getElement(target) : internalRef.current;
    if (!element) return;
    const htmlElement = element;
    focusElement(htmlElement);
    const onKeyDown = (event) => {
      if (event.key !== 'Tab') return;
      const [firstElement, ...restElements] = getFocusableElements(htmlElement);
      if (!restElements.length) return;
      const lastElement = restElements.at(-1);
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
  }, [active, target, internalRef.state]);
  if (target) return { active, enable, disable, toggle };
  return { active, enable, disable, toggle, ref: internalRef };
};

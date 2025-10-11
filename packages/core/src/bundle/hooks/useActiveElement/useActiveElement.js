import { useEffect, useState } from 'react';
import { isTarget } from '@/utils/helpers';
import { useRefState } from '../useRefState/useRefState';
/**
 * @name useActiveElement
 * @description - Hook that returns the active element
 * @category Elements
 * @usage low
 *
 * @overload
 * @param {HookTarget} [target=window] The target element to observe active element changes
 * @returns {ActiveElement | null} The active element
 *
 * @example
 * const activeElement = useActiveElement(ref);
 *
 * @overload
 * @template ActiveElement The active element type
 * @returns {{ ref: StateRef<Element>; activeElement: ActiveElement | null }} An object containing the ref and active element
 *
 * @example
 * const { ref, value } = useActiveElement();
 *
 * @see {@link https://siberiacancode.github.io/reactuse/functions/hooks/useActiveElement.html}
 */
export const useActiveElement = (...params) => {
  const target = isTarget(params[0]) ? params[0] : undefined;
  const [value, setValue] = useState(null);
  const internalRef = useRefState();
  useEffect(() => {
    const element = (target ? isTarget.getElement(target) : internalRef.current) ?? window;
    const observer = new MutationObserver((mutations) => {
      mutations
        .filter((mutation) => mutation.removedNodes.length)
        .map((mutation) => Array.from(mutation.removedNodes))
        .flat()
        .forEach((node) => {
          setValue((prevActiveElement) => {
            if (node === prevActiveElement) return document.activeElement;
            return prevActiveElement;
          });
        });
    });
    observer.observe(element, {
      childList: true,
      subtree: true
    });
    const onActiveElementChange = () => setValue(document?.activeElement);
    element.addEventListener('focus', onActiveElementChange, true);
    element.addEventListener('blur', onActiveElementChange, true);
    return () => {
      observer.disconnect();
      element.removeEventListener('focus', onActiveElementChange, true);
      element.removeEventListener('blur', onActiveElementChange, true);
    };
  }, [target, internalRef.state]);
  if (target) return value;
  return {
    ref: internalRef,
    value
  };
};

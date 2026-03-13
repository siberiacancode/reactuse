import { useEffect, useRef, useState } from 'react';
import { isTarget } from '@/utils/helpers';
import { useRefState } from '../useRefState/useRefState';
/**
 * @name useTextDirection
 * @description - Hook that can get and set the direction of the element
 * @category Elements
 * @usage medium
 *
 * @overload
 * @param {HookTarget} [target=document.querySelector('html')] The target element to observe
 * @param {UseTextDirectionValue} [initialValue = 'ltr'] The initial direction of the element
 * @returns {UseTextDirectionReturn} An object containing the current text direction of the element
 *
 * @example
 * const { value, set, remove } = useTextDirection(ref);
 *
 * @overload
 * @template Target The target element type
 * @param {UseTextDirectionValue} [initialValue = 'ltr'] The initial direction of the element
 * @returns { { ref: StateRef<Target> } & UseTextDirectionReturn } An object containing the current text direction of the element
 *
 * @example
 * const { ref, value, set, remove } = useTextDirection();
 */
export const useTextDirection = (...params) => {
  const target = isTarget(params[0]) ? params[0] : undefined;
  const initialValue = (target ? params[1] : params[0]) ?? 'ltr';
  const internalRef = useRefState();
  const elementRef = useRef(null);
  const getDirection = () => {
    if (typeof window === 'undefined') return initialValue;
    const element = target ? isTarget.getElement(target) : internalRef.current;
    return element?.getAttribute('dir') ?? initialValue;
  };
  const [value, setValue] = useState(getDirection());
  const remove = () => {
    if (!elementRef.current) return;
    elementRef.current?.removeAttribute('dir');
  };
  const set = (value) => {
    if (!elementRef.current) return;
    setValue(value);
    elementRef.current.setAttribute('dir', value);
  };
  useEffect(() => {
    if (!target && !internalRef.state) return;
    const element =
      (target ? isTarget.getElement(target) : internalRef.current) ??
      document.querySelector('html');
    if (!element) return;
    elementRef.current = element;
    const direction = getDirection();
    element.setAttribute('dir', direction);
    setValue(direction);
    const observer = new MutationObserver(() => setValue(getDirection()));
    observer.observe(element, { attributes: true });
    return () => {
      observer.disconnect();
    };
  }, [internalRef.state, target && isTarget.getRawElement(target)]);
  if (target) return { value, set, remove };
  return {
    ref: internalRef,
    value,
    set,
    remove
  };
};

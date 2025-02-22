import { useState } from 'react';

import { getElement } from '@/utils/helpers';

import { useIsomorphicLayoutEffect } from '../useIsomorphicLayoutEffect/useIsomorphicLayoutEffect';
import { useRefState } from '../useRefState/useRefState';
/**
 * @name useTextDirection
 * @description - Hook that can get and set the direction of the element
 * @category Browser
 *
 * @overload
 * @template Target The target element type.
 * @param {UseTextDirectionTarget} target The target element to observe.
 * @param {UseTextDirectionValue} [initialValue] The initial direction of the element.
 * @returns {UseTextDirectionReturn} An object containing the current text direction of the element.
 *
 * @example
 * const { value, set, remove } = useTextDirection(ref);
 *
 * @overload
 * @template Target The target element type.
 * @param {UseTextDirectionValue} [initialValue] The initial direction of the element.
 * @returns { { ref: StateRef<Target> } & UseTextDirectionReturn } An object containing the current text direction of the element.
 *
 * @example
 * const { ref, value, set, remove } = useTextDirection();
 */
export const useTextDirection = (...params) => {
  const target =
    typeof params[0] !== 'string' || !['auto', 'ltr', 'rtl'].includes(params[0])
      ? params[0]
      : undefined;
  const initialValue = (target ? params[1] : params[0]) ?? 'ltr';
  const internalRef = useRefState();
  const getDirection = () => {
    const element = target ? getElement(target) : internalRef.current;
    return element?.getAttribute('dir') ?? initialValue;
  };
  const [value, setValue] = useState(getDirection());
  const remove = () => {
    const element = target ? getElement(target) : internalRef.current;
    if (!element) return;
    element?.removeAttribute('dir');
  };
  const set = (value) => {
    const element = target ? getElement(target) : internalRef.current;
    if (!element) return;
    setValue(value);
    element.setAttribute('dir', value);
  };
  useIsomorphicLayoutEffect(() => {
    if (!target && !internalRef) return;
    const element = target ? getElement(target) : internalRef.current;
    if (!element) return;
    const direction = getDirection();
    element.setAttribute('dir', direction);
    setValue(direction);
    const observer = new MutationObserver(getDirection);
    observer.observe(element, { attributes: true });
    return () => {
      observer.disconnect();
    };
  }, [internalRef.current, target]);
  if (target) return { value, set, remove };
  return {
    ref: internalRef,
    value,
    set,
    remove
  };
};

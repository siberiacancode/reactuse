import type { RefObject } from 'react';

import { useState } from 'react';

import { getElement } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

import { useIsomorphicLayoutEffect } from '../useIsomorphicLayoutEffect/useIsomorphicLayoutEffect';
import { useRefState } from '../useRefState/useRefState';

/** The use text direction target element type */
export type UseTextDirectionTarget = string | Element | RefObject<Element | null | undefined>;

/** The use text direction value type */
export type UseTextDirectionValue = 'auto' | 'ltr' | 'rtl';

/** The use text direction return type */
export interface UseTextDirectionReturn {
  /** The current direction */
  value: UseTextDirectionValue;
  /*** The function to remove the direction */
  remove: () => void;
  /*** The function to set the direction */
  set: (value: UseTextDirectionValue | null) => void;
}

export interface UseTextDirection {
  <Target extends UseTextDirectionTarget>(
    target: Target,
    initialValue?: UseTextDirectionValue
  ): UseTextDirectionReturn;

  <Target extends UseTextDirectionTarget>(
    initialValue?: UseTextDirectionValue,
    target?: never
  ): UseTextDirectionReturn & { ref: StateRef<Target> };
}

/**
 * @name useTextDirection
 * @description - Hook that can get and set the direction of the element
 * @category Browser
 *
 * @overload
 * @template Target The target element type.
 * @param {UseTextDirectionTarget} target The target element to observe.
 * @param {UseTextDirectionValue} [initialValue = 'ltr'] The initial direction of the element.
 * @returns {UseTextDirectionReturn} An object containing the current text direction of the element.
 *
 * @example
 * const { value, set, remove } = useTextDirection(ref);
 *
 * @overload
 * @template Target The target element type.
 * @param {UseTextDirectionValue} [initialValue = 'ltr'] The initial direction of the element.
 * @returns { { ref: StateRef<Target> } & UseTextDirectionReturn } An object containing the current text direction of the element.
 *
 * @example
 * const { ref, value, set, remove } = useTextDirection();
 */
export const useTextDirection = ((...params: any[]) => {
  const target = (
    typeof params[0] !== 'string' || !['auto', 'ltr', 'rtl'].includes(params[0])
      ? params[0]
      : undefined
  ) as UseTextDirectionTarget | undefined;
  const initialValue = ((target ? params[1] : params[0]) as UseTextDirectionValue) ?? 'ltr';

  const internalRef = useRefState<Element>();

  const getDirection = () => {
    const element = (target ? getElement(target) : internalRef.current) as Element;
    return (element?.getAttribute('dir') as UseTextDirectionValue) ?? initialValue;
  };

  const [value, setValue] = useState<UseTextDirectionValue>(getDirection());

  const remove = () => {
    const element = (target ? getElement(target) : internalRef.current) as Element;
    if (!element) return;

    element?.removeAttribute('dir');
  };

  const set = (value: UseTextDirectionValue) => {
    const element = (target ? getElement(target) : internalRef.current) as Element;
    if (!element) return;

    setValue(value);
    element.setAttribute('dir', value);
  };

  useIsomorphicLayoutEffect(() => {
    if (!target && !internalRef) return;

    const element = (target ? getElement(target) : internalRef.current) as Element;
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
}) as UseTextDirection;

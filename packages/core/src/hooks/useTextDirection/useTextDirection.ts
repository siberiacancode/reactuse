import { useEffect, useRef, useState } from 'react';

import type { HookTarget } from '@/utils/helpers';

import { isTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

import { useRefState } from '../useRefState/useRefState';

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
  (target: HookTarget, initialValue?: UseTextDirectionValue): UseTextDirectionReturn;

  <Target extends Element>(
    initialValue?: UseTextDirectionValue,
    target?: never
  ): UseTextDirectionReturn & { ref: StateRef<Target> };
}

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
export const useTextDirection = ((...params: any[]) => {
  const target = (isTarget(params[0]) ? params[0] : undefined) as HookTarget | undefined;
  const initialValue = ((target ? params[1] : params[0]) as UseTextDirectionValue) ?? 'ltr';

  const internalRef = useRefState();
  const elementRef = useRef<Element>(null);

  const getDirection = () => {
    if (typeof window === 'undefined') return initialValue;
    const element = (target ? isTarget.getElement(target) : internalRef.current) as Element;
    return (element?.getAttribute('dir') as UseTextDirectionValue) ?? initialValue;
  };

  const [value, setValue] = useState<UseTextDirectionValue>(getDirection());

  const remove = () => {
    if (!elementRef.current) return;

    elementRef.current?.removeAttribute('dir');
  };

  const set = (value: UseTextDirectionValue) => {
    if (!elementRef.current) return;

    setValue(value);
    elementRef.current.setAttribute('dir', value);
  };

  useEffect(() => {
    if (!target && !internalRef.state) return;

    const element =
      ((target ? isTarget.getElement(target) : internalRef.current) as Element) ??
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
  }, [internalRef.state, target]);

  if (target) return { value, set, remove };
  return {
    ref: internalRef,
    value,
    set,
    remove
  };
}) as UseTextDirection;

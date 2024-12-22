import type { RefObject } from 'react';

import { useEffect, useRef, useState } from 'react';

import { getElement } from '@/utils/helpers';

/** The use focus target type */
export type UseFocusTarget = (() => Element) | Element | RefObject<Element | null | undefined>;

/** The use focus options type */
export interface UseFocusOptions {
  /** The initial focus state of the target */
  initialValue?: boolean;
}

/** The use focus return type */
export interface UseFocusReturn {
  /** The boolean state value of the target */
  focused: boolean;
  /** Is the target focused */
  blur: () => void;
  /** Is the target focused */
  focus: () => void;
}

export interface UseFocus {
  <Target extends UseFocusTarget>(
    options?: UseFocusOptions
  ): UseFocusReturn & { ref: (node: Target) => void };

  <Target extends UseFocusTarget>(target: Target, options?: UseFocusOptions): UseFocusReturn;
}

/**
 * @name useFocus
 * @description - Hook that allows you to focus on a specific element
 * @category Browser
 *
 * @overload
 * @template Target The target element
 * @param {Target} target The target element to focus
 * @param {boolean} [options.initialValue=false] The initial focus state of the target
 * @returns {UseFocusReturn} An object with a `focus` boolean state value
 *
 * @example
 * const { focus, blur, focused } = useFocus(target);
 *
 * @overload
 * @param {boolean} [options.initialValue=false] The initial focus state of the target
 * @returns {UseFocusReturn} An object with a `focus` boolean state value
 *
 * @example
 * const { ref, focus, blur, focused } = useFocus();
 */
export const useFocus = ((...params: any[]) => {
  const target =
    (params[0] && 'current' in params[0]) || params[0] instanceof Element ? params[0] : undefined;
  const options = ((target ? params[1] : params[0]) as UseFocusOptions) ?? {};
  const initialValue = options.initialValue ?? false;

  const [focused, setFocused] = useState(initialValue);
  const [internalRef, setInternalRef] = useState<Element>();

  const elementRef = useRef<HTMLElement>();

  const focus = () => elementRef.current?.focus();
  const blur = () => elementRef.current?.blur();

  useEffect(() => {
    const element = (target ? getElement(target) : internalRef) as HTMLElement;
    if (!element) return;
    elementRef.current = element;

    const onFocus = (event: Event) => {
      if (!focus || (event.target as HTMLElement).matches?.(':focus-visible')) setFocused(true);
    };
    const onBlur = () => setFocused(false);
    if (initialValue) element.focus();

    element.addEventListener('focus', onFocus);
    element.addEventListener('blur', onBlur);

    return () => {
      element.removeEventListener('focus', onFocus);
      element.removeEventListener('blur', onBlur);
    };
  }, [internalRef, target]);

  if (target) return { focus, blur, focused };
  return {
    ref: setInternalRef,
    focus,
    blur,
    focused
  };
}) as UseFocus;

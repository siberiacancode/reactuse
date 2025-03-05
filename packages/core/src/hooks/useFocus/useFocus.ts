import { useEffect, useRef, useState } from 'react';

import type { HookTarget } from '@/utils/helpers';

import { getElement, isTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

import { useRefState } from '../useRefState/useRefState';

/** The use focus options type */
export interface UseFocusOptions {
  /** The initial focus state of the target */
  initialValue?: boolean;
  /** The on blur callback */
  onBlur?: (event: FocusEvent) => void;
  /** The on focus callback */
  onFocus?: (event: FocusEvent) => void;
}

/** The use focus return type */
export interface UseFocusReturn {
  /** The boolean state value of the target */
  focused: boolean;
  /** Blur the target */
  blur: () => void;
  /** Focus the target */
  focus: () => void;
}

export interface UseFocus {
  (target: HookTarget, options?: UseFocusOptions): UseFocusReturn;

  <Target extends Element>(
    options?: UseFocusOptions,
    target?: never
  ): UseFocusReturn & { ref: StateRef<Target> };
}

/**
 * @name useFocus
 * @description - Hook that allows you to focus on a specific element
 * @category Browser
 *
 * @overload
 * @param {HookTarget} target The target element to focus
 * @param {boolean} [options.initialValue=false] The initial focus state of the target
 * @param {(event: FocusEvent) => void} [options.onFocus] The callback function to be invoked on focus
 * @param {(event: FocusEvent) => void} [options.onBlur] The callback function to be invoked on blur
 * @returns {UseFocusReturn} An object with focus state and methods
 *
 * @example
 * const { focus, blur, focused } = useFocus(ref);
 *
 * @overload
 * @template Target The target element
 * @param {boolean} [options.initialValue=false] The initial focus state of the target
 * @param {(event: FocusEvent) => void} [options.onFocus] The callback function to be invoked on focus
 * @param {(event: FocusEvent) => void} [options.onBlur] The callback function to be invoked on blur
 * @returns {UseFocusReturn & { ref: StateRef<Target> }} An object with focus state, methods and ref
 *
 * @example
 * const { ref, focus, blur, focused } = useFocus();
 */
export const useFocus = ((...params: any[]) => {
  const target = (isTarget(params[0]) ? params[0] : undefined) as HookTarget | undefined;
  const options = ((target ? params[1] : params[0]) as UseFocusOptions) ?? {};
  const initialValue = options.initialValue ?? false;

  const [focused, setFocused] = useState(initialValue);
  const internalRef = useRefState<Element>();
  const internalOptionsRef = useRef(options);
  internalOptionsRef.current = options;

  const elementRef = useRef<HTMLElement | null>(null);

  const focus = () => elementRef.current?.focus();
  const blur = () => elementRef.current?.blur();

  useEffect(() => {
    if (!target && !internalRef.state) return;
    const element = (target ? getElement(target) : internalRef.current) as HTMLElement;
    if (!element) return;

    elementRef.current = element;

    const onFocus = (event: FocusEvent) => {
      internalOptionsRef.current?.onFocus?.(event);
      if (!focus || (event.target as HTMLElement).matches?.(':focus-visible')) setFocused(true);
    };

    const onBlur = (event: FocusEvent) => {
      internalOptionsRef.current?.onBlur?.(event);
      setFocused(false);
    };

    if (initialValue) element.focus();

    element.addEventListener('focus', onFocus);
    element.addEventListener('blur', onBlur);

    return () => {
      element.removeEventListener('focus', onFocus);
      element.removeEventListener('blur', onBlur);
    };
  }, [target, internalRef.state]);

  if (target) return { focus, blur, focused };
  return {
    ref: internalRef,
    focus,
    blur,
    focused
  };
}) as UseFocus;

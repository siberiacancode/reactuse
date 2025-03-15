import { useEffect, useRef, useState } from 'react';
import { getElement, isTarget } from '@/utils/helpers';
import { useRefState } from '../useRefState/useRefState';
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
export const useFocus = (...params) => {
  const target = isTarget(params[0]) ? params[0] : undefined;
  const options = (target ? params[1] : params[0]) ?? {};
  const initialValue = options.initialValue ?? false;
  const [focused, setFocused] = useState(initialValue);
  const internalRef = useRefState();
  const internalOptionsRef = useRef(options);
  internalOptionsRef.current = options;
  const elementRef = useRef(null);
  const focus = () => elementRef.current?.focus();
  const blur = () => elementRef.current?.blur();
  useEffect(() => {
    if (!target && !internalRef.state) return;
    const element = target ? getElement(target) : internalRef.current;
    if (!element) return;
    elementRef.current = element;
    const onFocus = (event) => {
      internalOptionsRef.current?.onFocus?.(event);
      if (!focus || event.target.matches?.(':focus-visible')) setFocused(true);
    };
    const onBlur = (event) => {
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
};

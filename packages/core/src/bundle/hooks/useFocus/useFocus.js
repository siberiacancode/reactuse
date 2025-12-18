import { useEffect, useRef, useState } from 'react';
import { isTarget } from '@/utils/helpers';
import { useRefState } from '../useRefState/useRefState';
/**
 * @name useFocus
 * @description - Hook that allows you to focus on a specific element
 * @category Elements
 * @usage medium
 *
 * @overload
 * @param {HookTarget} target The target element to focus
 * @param {(event: FocusEvent) => void} [callback] The callback function to be invoked on focus
 * @returns {UseFocusReturn} An object with focus state and methods
 *
 * @example
 * const { focus, blur, focused } = useFocus(ref, () => console.log('focused'));
 *
 * @overload
 * @param {HookTarget} target The target element to focus
 * @param {boolean} [options.enabled=true] The enabled state of the focus hook
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
 * @param {(event: FocusEvent) => void} [callback] The callback function to be invoked on focus
 * @returns {UseFocusReturn & { ref: StateRef<Target> }} An object with focus state, methods and ref
 *
 * @example
 * const { ref, focus, blur, focused } = useFocus(() => console.log('focused'));
 *
 * @overload
 * @template Target The target element
 * @param {boolean} [options.enabled=true] The enabled state of the focus hook
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
  const options = target
    ? typeof params[1] === 'object'
      ? params[1]
      : { onFocus: params[1] }
    : typeof params[0] === 'object'
      ? params[0]
      : { onFocus: params[0] };
  const enabled = options?.enabled ?? true;
  const initialValue = options?.initialValue ?? false;
  const [focused, setFocused] = useState(initialValue);
  const internalRef = useRefState();
  const internalOptionsRef = useRef(options);
  internalOptionsRef.current = options;
  const elementRef = useRef(null);
  const focus = () => {
    if (!elementRef.current) return;
    elementRef.current.focus();
    setFocused(true);
  };
  const blur = () => {
    if (!elementRef.current) return;
    elementRef.current.blur();
    setFocused(false);
  };
  useEffect(() => {
    if (!enabled || (!target && !internalRef.state)) return;
    const element = target ? isTarget.getElement(target) : internalRef.current;
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
  }, [target, internalRef.state, enabled, isTarget.getRefState(target)]);
  if (target) return { focus, blur, focused };
  return {
    ref: internalRef,
    focus,
    blur,
    focused
  };
};

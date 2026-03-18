import { useRef, useState } from 'react';
import { useRerender } from '../useRerender/useRerender';
/**
 * @name useField
 * @description - Hook to manage a form field
 * @category State
 * @usage medium
 *
 * @template Value The input value
 * @template Type The input value type
 * @param {Value} [params.initialValue = ""] Initial value
 * @param {boolean} [params.initialTouched=false] Initial touched state
 * @param {boolean} [params.autoFocus=false] Auto focus
 * @param {boolean} [params.validateOnChange=false] Validate on change
 * @param {boolean} [params.validateOnBlur=false] Validate on blur
 * @param {boolean} [params.validateOnMount=false] Validate on mount
 * @returns {UseFieldReturn<Value>} An object containing input information
 *
 * @example
 * const { register, getValue, setValue, reset, dirty, error, setError, clearError, touched, focus, watch } = useField();
 */
export const useField = (initialValue = '', options) => {
  const inputRef = useRef(null);
  const watchingRef = useRef(false);
  const rerender = useRerender();
  const [dirty, setDirty] = useState(false);
  const [touched, setTouched] = useState(options?.initialTouched ?? false);
  const [error, setError] = useState(undefined);
  const getValue = () => {
    if (inputRef.current?.type === 'radio' || inputRef.current?.type === 'checkbox')
      return inputRef.current.checked;
    return inputRef.current?.value ?? initialValue;
  };
  const setValue = (value) => {
    if (inputRef.current?.type === 'radio' || inputRef.current?.type === 'checkbox') {
      inputRef.current.checked = value;
      if (watchingRef.current) return rerender();
      return;
    }
    inputRef.current.value = value;
    if (watchingRef.current) return rerender();
  };
  const reset = () => {
    setValue(initialValue);
    setDirty(false);
    setTouched(false);
    setError(undefined);
  };
  const focus = () => inputRef.current.focus();
  const validate = (params) => {
    if (params.required && !inputRef.current.value) {
      return setError(params.required);
    }
    if (params.minLength && inputRef.current.value.length < params.minLength.value) {
      return setError(params.minLength.message);
    }
    if (params.maxLength && inputRef.current.value.length > params.maxLength.value) {
      return setError(params.maxLength.message);
    }
    if (params.min && Number(inputRef.current.value) < params.min.value) {
      return setError(params.min.message);
    }
    if (params.max && Number(inputRef.current.value) > params.max.value) {
      return setError(params.max.message);
    }
    if (params.pattern && !params.pattern.value.test(inputRef.current.value)) {
      return setError(params.pattern.message);
    }
    if (params.validate) {
      const error = params.validate(inputRef.current.value);
      if (typeof error === 'string') return setError(error);
    }
    setError(undefined);
  };
  const register = (registerParams) => ({
    ref: (node) => {
      if (!inputRef.current && node) {
        if (options?.autoFocus) node.focus();
        inputRef.current = node;
        if (inputRef.current.type === 'radio') {
          inputRef.current.defaultChecked = initialValue === node.value;
          return;
        }
        if (inputRef.current.type === 'checkbox') {
          inputRef.current.defaultChecked = !!initialValue;
          return;
        }
        inputRef.current.defaultValue = String(initialValue);
        if (registerParams && options?.validateOnMount) validate(registerParams);
      }
    },
    onChange: async () => {
      if (watchingRef.current) return rerender();
      if (inputRef.current.value !== initialValue) setDirty(true);
      if (dirty && inputRef.current.value === initialValue) setDirty(false);
      if (registerParams && options?.validateOnChange) await validate(registerParams);
      if (registerParams && options?.validateOnBlur) setError(undefined);
    },
    onBlur: async () => {
      if (registerParams && options?.validateOnBlur) await validate(registerParams);
      setTouched(true);
    }
  });
  const watch = () => {
    watchingRef.current = true;
    return getValue();
  };
  const clearError = () => setError(undefined);
  return {
    register,
    dirty,
    touched,
    error,
    setError,
    clearError,
    getValue,
    setValue,
    reset,
    watch,
    focus,
    ref: inputRef
  };
};

import type { ChangeEventHandler, FocusEventHandler, RefObject } from 'react';

import { useRef, useState } from 'react';

import { useRerender } from '../useRerender/useRerender';

/** The use field element type */
type UseFieldElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

/** The use field register params type */
export interface UseFieldRegisterParams {
  /** The min value validation */
  max?: {
    value: number;
    message: string;
  };
  /** The max length validation */
  maxLength?: {
    value: number;
    message: string;
  };
  /** The max value validation */
  min?: {
    value: number;
    message: string;
  };
  /** The min length validation */
  minLength?: {
    value: number;
    message: string;
  };
  /** The blur event handler */
  onBlur?: FocusEventHandler<UseFieldElement>;
  /** The change event handler */
  onChange?: ChangeEventHandler<UseFieldElement>;
  /** The pattern validation */
  pattern?: {
    value: RegExp;
    message: string;
  };
  /** The required validation */
  required?: string;
  /** The custom validation */
  validate?: (value: string) => string | true | Promise<string | true>;
}

/** The use field params type */
export interface UseFieldOptions extends UseFieldRegisterParams {
  /** The auto focus */
  autoFocus?: boolean;
  /** The initial touched */
  initialTouched?: boolean;
  /** The validate on blur */
  validateOnBlur?: boolean;
  /** The validate on change */
  validateOnChange?: boolean;
  /** The validate on mount */
  validateOnMount?: boolean;
}

/** The use field return type */
export interface UseFieldReturn<Value> {
  /** The dirty state */
  dirty: boolean;
  /** The error state */
  error?: string;
  /** The input ref */
  ref: RefObject<UseFieldElement | null>;
  /** The touched state */
  touched: boolean;
  /** The clear error function */
  clearError: () => void;
  /** The focus function */
  focus: () => void;
  /** The get value function */
  getValue: () => Value;
  /** The register function */
  register: (params?: UseFieldRegisterParams) => {
    onBlur: FocusEventHandler<UseFieldElement>;
    onChange: ChangeEventHandler<UseFieldElement>;
    ref: (node: UseFieldElement | null | undefined) => void;
  };
  /** The reset function */
  reset: () => void;
  /** The set error function */
  setError: (error: string) => void;
  /** The set value function */
  setValue: (value: Value) => void;
  /** The watch function */
  watch: () => Value;
}

/**
 * @name useField
 * @description - Hook to manage a form field
 * @category State
 * @usage medium
 *
 * @template Value The input value
 * @template Type The input value type
 * @param {Value} [initialValue = ""] Initial value
 * @param {boolean} [options.initialTouched=false] Initial touched state
 * @param {boolean} [options.autoFocus=false] Auto focus
 * @param {boolean} [options.validateOnChange=false] Validate on change
 * @param {boolean} [options.validateOnBlur=false] Validate on blur
 * @param {boolean} [options.validateOnMount=false] Validate on mount
 * @param {string} [options.required] Required validation message
 * @param {object} [options.min] Min value validation
 * @param {object} [options.max] Max value validation
 * @param {object} [options.minLength] Min length validation
 * @param {object} [options.maxLength] Max length validation
 * @param {object} [options.pattern] Pattern validation
 * @param {Function} [options.validate] Custom validation
 * @returns {UseFieldReturn<Value>} An object containing input information
 *
 * @example
 * const { register, getValue, setValue, reset, dirty, error, setError, clearError, touched, focus, watch } = useField();
 */
export const useField = <
  Value extends boolean | number | string | unknown = string,
  Type = Value extends string ? string : Value extends boolean ? boolean : number
>(
  initialValue = '' as Value,
  options?: UseFieldOptions
): UseFieldReturn<Type> => {
  const inputRef = useRef<UseFieldElement | null>(null);
  const initializedRef = useRef<UseFieldElement | null>(null);
  const watchingRef = useRef(false);
  const rerender = useRerender();

  const [dirty, setDirty] = useState(false);
  const [touched, setTouched] = useState(options?.initialTouched ?? false);
  const [error, setError] = useState<string | undefined>(undefined);

  const optionsRef = useRef(options);
  optionsRef.current = options;

  const getValue = () => {
    if (
      inputRef.current &&
      'checked' in inputRef.current &&
      (inputRef.current.type === 'radio' || inputRef.current.type === 'checkbox')
    )
      return inputRef.current.checked as Type;
    return (inputRef.current?.value ?? initialValue) as Type;
  };

  const setValue = (value: Type) => {
    if (
      inputRef.current &&
      'checked' in inputRef.current &&
      (inputRef.current.type === 'radio' || inputRef.current.type === 'checkbox')
    ) {
      inputRef.current.checked = value as boolean;
      if (watchingRef.current) return rerender();
      return;
    }

    inputRef.current!.value = value as string;
    if (watchingRef.current) return rerender();
  };

  const reset = () => {
    setValue(initialValue as unknown as Type);
    setDirty(false);
    setTouched(false);
    setError(undefined);
  };

  const focus = () => inputRef.current!.focus();

  const validate = async (params: UseFieldRegisterParams) => {
    const hasRules =
      params.required ||
      params.min ||
      params.max ||
      params.minLength ||
      params.maxLength ||
      params.pattern ||
      params.validate;

    if (!hasRules) return;

    const value = inputRef.current!.value;

    if (params.required && !value) return setError(params.required);
    if (params.min && Number(value) < params.min.value) return setError(params.min.message);
    if (params.max && Number(value) > params.max.value) return setError(params.max.message);
    if (params.minLength && value.length < params.minLength.value)
      return setError(params.minLength.message);
    if (params.maxLength && value.length > params.maxLength.value)
      return setError(params.maxLength.message);
    if (params.pattern && !params.pattern.value.test(value))
      return setError(params.pattern.message);

    if (params.validate) {
      const result = await params.validate(value);
      if (typeof result === 'string') return setError(result);
    }

    setError(undefined);
  };

  const register = (params?: UseFieldRegisterParams) => ({
    ref: (node: UseFieldElement | null | undefined) => {
      const registerParams = { ...optionsRef.current, ...params };

      if (!node) {
        inputRef.current = null;
        return;
      }

      inputRef.current = node;

      if (initializedRef.current === node) return;
      initializedRef.current = node;

      if (registerParams.autoFocus) node.focus();
      if (registerParams.validateOnMount) validate(registerParams);

      if (node instanceof HTMLInputElement) {
        if (node.type === 'radio') {
          node.defaultChecked = initialValue === node.value;
          return;
        }
        if (node.type === 'checkbox') {
          node.defaultChecked = Boolean(initialValue);
          return;
        }
        node.defaultValue = String(initialValue);
        return;
      }

      node.value = String(initialValue);
    },
    onChange: (async (event) => {
      const registerParams = { ...optionsRef.current, ...params };

      if (watchingRef.current) rerender();
      setDirty(getValue() !== (initialValue as unknown as Type));

      if (registerParams.validateOnChange) await validate(registerParams);
      if (registerParams.validateOnBlur) setError(undefined);

      registerParams.onChange?.(event);
    }) as ChangeEventHandler<UseFieldElement>,
    onBlur: (async (event) => {
      const registerParams = { ...optionsRef.current, ...params };

      if (registerParams.validateOnBlur) await validate(registerParams);
      setTouched(true);

      registerParams.onBlur?.(event);
    }) as FocusEventHandler<UseFieldElement>
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

import { useRef, useState } from 'react';

import { useRerender } from '../useRerender/useRerender';

/** The use field params type */
export interface UseFieldParams<Value> {
  /** The auto focus */
  autoFocus?: boolean;
  /** The initial touched */
  initialTouched?: boolean;
  /** The initial value */
  initialValue?: Value;
  /** The validate on blur */
  validateOnBlur?: boolean;
  /** The validate on mount */
  validateOnChange?: boolean;
  /** The validate on mount */
  validateOnMount?: boolean;
}

/** The use field register params type */
export interface UseFieldRegisterParams {
  /** The required validation */
  required?: string;
  /** The custom validation */
  validate?: (value: string) => Promise<string | true>;
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
  /** The pattern validation */
  pattern?: {
    value: RegExp;
    message: string;
  };
}

/** The use field return type */
export interface UseFieldReturn<Value> {
  /** The dirty state */
  dirty: boolean;
  /** The error state */
  error?: string;
  /** The set error function */
  touched: boolean;
  /** The set error function */
  clearError: () => void;
  /** The focus function */
  focus: () => void;
  /** The get value function */
  getValue: () => Value;
  /** The register function */
  register: (params?: UseFieldRegisterParams) => {
    onBlur: () => void;
    onChange: () => void;
    ref: (
      node: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null | undefined
    ) => void;
  };
  /** The reset function */
  reset: () => void;
  /** The set error function */
  setError: (error: string) => void;
  /** The  set value function */
  setValue: (value: Value) => void;
  /** The watch function */
  watch: () => Value;
}

/**
 * @name useField
 * @description - Hook to manage a form field
 * @category Utilities
 *
 * @template Value The input value
 * @template Type The input value type
 * @param {Value} [params.initialValue] Initial value
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
export const useField = <
  Value extends boolean | number | string = string,
  Type = Value extends string ? string : Value extends boolean ? boolean : number
>(
  params?: UseFieldParams<Value>
): UseFieldReturn<Type> => {
  const initialValue = (params?.initialValue ?? '') as Value;

  const inputRef = useRef<HTMLInputElement | null>(null);
  const watchingRef = useRef(false);
  const rerender = useRerender();

  const [dirty, setDirty] = useState(false);
  const [touched, setTouched] = useState(params?.initialTouched ?? false);
  const [error, setError] = useState<string | undefined>(undefined);

  const getValue = () => {
    if (inputRef.current?.type === 'radio' || inputRef.current?.type === 'checkbox')
      return inputRef.current.checked as Type;
    return (inputRef.current?.value ?? initialValue) as Type;
  };

  const setValue = (value: Type) => {
    if (inputRef.current?.type === 'radio' || inputRef.current?.type === 'checkbox') {
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

  const focus = () => {
    inputRef.current!.focus();
  };

  const validate = (params: UseFieldRegisterParams) => {
    if (params.required && !inputRef.current!.value) {
      return setError(params.required);
    }

    if (params.minLength && inputRef.current!.value.length < params.minLength.value) {
      return setError(params.minLength.message);
    }

    if (params.maxLength && inputRef.current!.value.length > params.maxLength.value) {
      return setError(params.maxLength.message);
    }

    if (params.min && Number(inputRef.current!.value) < params.min.value) {
      return setError(params.min.message);
    }

    if (params.max && Number(inputRef.current!.value) > params.max.value) {
      return setError(params.max.message);
    }

    if (params.pattern && !params.pattern.value.test(inputRef.current!.value)) {
      return setError(params.pattern.message);
    }

    if (params.validate) {
      const error = params.validate(inputRef.current!.value);
      if (typeof error === 'string') return setError(error);
    }

    setError(undefined);
  };

  const register = (registerParams?: UseFieldRegisterParams) => ({
    ref: (node: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null | undefined) => {
      if (!inputRef.current && node) {
        if (params?.autoFocus) node.focus();
        inputRef.current = node as HTMLInputElement;
        if (inputRef.current.type === 'radio') {
          inputRef.current.defaultChecked = params?.initialValue === node.value;
          return;
        }
        if (inputRef.current.type === 'checkbox') {
          inputRef.current.defaultChecked = !!params?.initialValue;
          return;
        }
        inputRef.current.defaultValue = String(initialValue);

        if (registerParams && params?.validateOnMount) validate(registerParams);
      }
    },
    onChange: async () => {
      if (watchingRef.current) return rerender();
      if (inputRef.current!.value !== initialValue) setDirty(true);
      if (dirty && inputRef.current!.value === initialValue) setDirty(false);
      if (registerParams && params?.validateOnChange) await validate(registerParams);
      if (registerParams && params?.validateOnBlur) setError(undefined);
    },
    onBlur: async () => {
      if (registerParams && params?.validateOnBlur) await validate(registerParams);
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
    focus
  };
};

import React from 'react';

import { useRerender } from '../useRerender/useRerender';

export interface UseInputParams {
  initialValue?: string;
  validateMode?: 'onChange' | 'onBlur';
}

export interface UseInputRegisterParams {
  required?: string;
  max?: {
    value: number;
    message: string;
  };
  min?: {
    value: number;
    message: string;
  };
  maxLength?: {
    value: number;
    message: string;
  };
  minLength?: {
    value: number;
    message: string;
  };
  pattern?: {
    value: RegExp;
    message: string;
  };
  validate?: (value: string) => string | true;
}

export interface UseInputReturn {
  register: (params: UseInputRegisterParams) => void;
  getValue: () => string;
  clear: () => void;
  dirty: boolean;
  error: string;
  touched: boolean;
  focus: () => void;
  watch: () => string;
}

/**
 * @name useInput
 * @description - Hook for input validation
 *
 * @param {string} [params.initialValue] Initial value
 * @param {'onChange' | 'onBlur'} [params.validateMode] Validate mode
 * @returns {UseInputParams} An object containing input information
 *
 * @example
 * const { register, getValue, setValue, reset, dirty, error, setError, clearError, touched, focus, watch } = useInput();
 */
export const useInput = (params?: UseInputParams) => {
  const initialValue = params?.initialValue ?? '';
  const validateMode = params?.validateMode ?? 'onChange';

  const inputRef = React.useRef<HTMLInputElement>();
  const watchingRef = React.useRef(false);
  const rerender = useRerender();

  const [dirty, setDirty] = React.useState(false);
  const [touched, setTouched] = React.useState(false);
  const [error, setError] = React.useState<string | undefined>(undefined);

  const getValue = () => inputRef.current!.value;
  const setValue = (value: string) => {
    inputRef.current!.value = value;
  };
  const reset = () => {
    inputRef.current!.value = initialValue;
    setDirty(false);
    setTouched(false);
    setError(undefined);
  };

  const focus = () => {
    inputRef.current!.focus();
  };

  const validate = (params: UseInputRegisterParams) => {
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

  const register = (registerParams?: UseInputRegisterParams) => ({
    ref: (node: HTMLInputElement) => {
      if (inputRef.current) return;
      inputRef.current = node;
      inputRef.current.value = initialValue;
    },
    onChange: () => {
      if (watchingRef.current) return rerender.update();
      if (inputRef.current!.value !== initialValue) setDirty(true);
      if (registerParams && validateMode === 'onChange') validate(registerParams);
    },
    onBlur: () => {
      setTouched(true);
      if (registerParams && validateMode === 'onBlur') validate(registerParams);
    }
  });

  const watch = () => {
    watchingRef.current = true;
    return inputRef.current?.value;
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

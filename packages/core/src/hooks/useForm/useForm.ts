import type { BaseSyntheticEvent, ChangeEventHandler, FocusEventHandler } from 'react';

import { useRef, useState } from 'react';

import { useRerender } from '../useRerender/useRerender';

/** The use form element type */
type UseFormElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

/** The use form errors type */
export type UseFormErrors<Values> = Partial<Record<keyof Values, string>>;

/** The use form resolver result type */
export interface UseFormResolverResult<Values> {
  /** The errors map keyed by field name */
  errors: UseFormErrors<Values>;
  /** The parsed values, empty object when validation fails */
  values: Values;
}

/** The use form trigger options type */
export interface UseFormTriggerOptions {
  /** Focus the first invalid field */
  shouldFocus?: boolean;
}

/** The use form resolver type */
export type UseFormResolver<Values> = (
  values: Values
) => Promise<UseFormResolverResult<Values>> | UseFormResolverResult<Values>;

/** The use form register params type */
export interface UseFormRegisterParams<Values = any> {
  /** The max value validation */
  max?: {
    value: number;
    message: string;
  };
  /** The max length validation */
  maxLength?: {
    value: number;
    message: string;
  };
  /** The min value validation */
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
  onBlur?: FocusEventHandler<UseFormElement>;
  /** The change event handler */
  onChange?: ChangeEventHandler<UseFormElement>;
  /** The pattern validation */
  pattern?: {
    value: RegExp;
    message: string;
  };
  /** The required validation */
  required?: string;
  /** The custom validation */
  validate?: (value: any, values: Values) => string | true | Promise<string | true>;
}

/** The use form options type */
export interface UseFormOptions<Values> {
  /** The field to focus on mount */
  autoFocus?: keyof Values;
  /** The initial values */
  initialValues: Values;
  /** The schema resolver, takes precedence over register params */
  resolver?: UseFormResolver<Values>;
  /** The validate on blur */
  validateOnBlur?: boolean;
  /** The validate on change */
  validateOnChange?: boolean;
  /** The validate on mount */
  validateOnMount?: boolean;
}

/** The use form return type */
export interface UseFormReturn<Values extends Record<string, any>> {
  /** The dirty state per field */
  dirty: Partial<Record<keyof Values, boolean>>;
  /** The errors state per field */
  errors: UseFormErrors<Values>;
  /** The submitting state */
  submitting: boolean;
  /** The touched state per field */
  touched: Partial<Record<keyof Values, boolean>>;
  /** The clear errors function */
  clearErrors: (name?: keyof Values) => void;
  /** The focus function */
  focus: (name: keyof Values) => void;
  /** The get value function */
  getValue: <Name extends keyof Values>(name: Name) => Values[Name];
  /** The get values function */
  getValues: () => Values;
  /** The submit handler factory */
  handleSubmit: (
    onValid: (values: Values, event?: BaseSyntheticEvent) => any,
    onInvalid?: (errors: UseFormErrors<Values>, event?: BaseSyntheticEvent) => any
  ) => (event?: BaseSyntheticEvent) => Promise<void>;
  /** The register function */
  register: (
    name: keyof Values,
    params?: UseFormRegisterParams<Values>
  ) => {
    name: string;
    onBlur: FocusEventHandler<UseFormElement>;
    onChange: ChangeEventHandler<UseFormElement>;
    ref: (node: UseFormElement | null | undefined) => void;
  };
  /** The reset function */
  reset: (values?: Partial<Values>) => void;
  /** The set error function */
  setError: (name: keyof Values, error: string) => void;
  /** The set value function */
  setValue: <Name extends keyof Values>(name: Name, value: Values[Name]) => void;
  /** The validate function */
  trigger: (
    name?: (keyof Values)[] | keyof Values,
    options?: UseFormTriggerOptions
  ) => Promise<boolean>;
  /** The watch function */
  watch: () => Values;
}

/**
 * @name useForm
 * @description - Hook to manage a form
 * @category State
 * @usage medium
 *
 * @template Values The form values
 * @param {Values} options.initialValues Initial values
 * @param {UseFormResolver<Values>} [options.resolver] Schema resolver
 * @param {keyof Values} [options.autoFocus] Field to focus on mount
 * @param {boolean} [options.validateOnChange=false] Validate on change
 * @param {boolean} [options.validateOnBlur=false] Validate on blur
 * @param {boolean} [options.validateOnMount=false] Validate on mount
 * @returns {UseFormReturn<Values>} An object containing form information
 *
 * @example
 * const form = useForm({ initialValues: { email: '' } });
 */
export const useForm = <Values extends Record<string, any>>(
  options: UseFormOptions<Values>
): UseFormReturn<Values> => {
  const { initialValues, autoFocus, resolver, validateOnBlur, validateOnChange, validateOnMount } =
    options;

  const nodesRef = useRef(new Map<keyof Values, UseFormElement>());
  const initializedRef = useRef(new Map<keyof Values, UseFormElement>());
  const paramsRef = useRef(new Map<keyof Values, UseFormRegisterParams<Values> | undefined>());
  const initialRef = useRef(initialValues);
  const watchingRef = useRef(false);
  const rerender = useRerender();

  const [dirty, setDirty] = useState<Partial<Record<keyof Values, boolean>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof Values, boolean>>>({});
  const [errors, setErrors] = useState<UseFormErrors<Values>>({});
  const [submitting, setSubmitting] = useState(false);

  const read = <Name extends keyof Values>(name: keyof Values) => {
    const node = nodesRef.current.get(name);
    if (!node) return initialRef.current[name] as Values[Name];

    if ('checked' in node && (node.type === 'radio' || node.type === 'checkbox'))
      return node.checked as Values[Name];

    return node.value as Values[Name];
  };

  const getValues = () =>
    Object.keys(initialRef.current).reduce((acc, key) => {
      acc[key as keyof Values] = read(key);
      return acc;
    }, {} as Values);

  const setValue = <Name extends keyof Values>(name: Name, value: Values[Name]) => {
    const node = nodesRef.current.get(name);
    if (!node) return;

    if ('checked' in node && (node.type === 'radio' || node.type === 'checkbox')) {
      node.checked = value as boolean;
      if (watchingRef.current) rerender();
      return;
    }

    node.value = String(value);
    if (watchingRef.current) rerender();
  };

  const focus = (name: keyof Values) => nodesRef.current.get(name)?.focus();

  const validate = async (name: keyof Values) => {
    const params = paramsRef.current.get(name);
    if (!params) return undefined;

    const value = read(name);
    const string = typeof value === 'string' ? value : String(value ?? '');

    if (params.required && (value === false || string === '')) return params.required;
    if (params.min && Number(value) < params.min.value) return params.min.message;
    if (params.max && Number(value) > params.max.value) return params.max.message;
    if (params.minLength && string.length < params.minLength.value) return params.minLength.message;
    if (params.maxLength && string.length > params.maxLength.value) return params.maxLength.message;
    if (params.pattern && !params.pattern.value.test(string)) return params.pattern.message;

    if (params.validate) {
      const result = await params.validate(value, getValues());
      if (typeof result === 'string') return result;
    }

    return undefined;
  };

  const setError = (name: keyof Values, error: string) =>
    setErrors((currentErrors) => ({ ...currentErrors, [name]: error }));

  const reset = (values?: Partial<Values>) => {
    initialRef.current = { ...initialRef.current, ...values };
    nodesRef.current.forEach((_, name) => setValue(name, initialRef.current[name]));
    setDirty({});
    setTouched({});
    setErrors({});
    rerender();
  };

  const clearErrors = (name?: keyof Values) =>
    setErrors((currentErrors) => {
      if (!name) return {};
      const next = { ...currentErrors };
      delete next[name];
      return next;
    });

  const watch = () => {
    watchingRef.current = true;
    return getValues();
  };

  const runValidation = async (name?: (keyof Values)[] | keyof Values) => {
    if (resolver) {
      const result = await resolver(getValues());
      const resolved = result.errors ?? {};

      if (!name) {
        setErrors(resolved);
        return resolved;
      }

      const names = Array.isArray(name) ? name : [name];

      const next = names.reduce((acc, key) => {
        if (resolved[key]) acc[key] = resolved[key];
        return acc;
      }, {} as UseFormErrors<Values>);

      setErrors((currentErrors) => {
        const cleared = { ...currentErrors };
        names.forEach((key) => delete cleared[key]);
        return { ...cleared, ...next };
      });

      return next;
    }

    const names = name ? (Array.isArray(name) ? name : [name]) : [...paramsRef.current.keys()];

    const results = await Promise.all(names.map(validate));

    const next = names.reduce((acc, key, index) => {
      if (results[index]) acc[key] = results[index]!;
      return acc;
    }, {} as UseFormErrors<Values>);

    setErrors((currentErrors) => {
      const cleared = { ...currentErrors };
      names.forEach((key) => delete cleared[key]);
      return { ...cleared, ...next };
    });

    return next;
  };

  const trigger = async (
    name?: (keyof Values)[] | keyof Values,
    options?: UseFormTriggerOptions
  ) => {
    const validationErrors = await runValidation(name);
    const names = Object.keys(validationErrors) as (keyof Values)[];

    if (options?.shouldFocus && names.length) focus(names[0]);

    return !names.length;
  };

  const register = (name: keyof Values, params?: UseFormRegisterParams<Values>) => {
    paramsRef.current.set(name, params);

    return {
      name: String(name),
      ref: (node: UseFormElement | null | undefined) => {
        if (!node) {
          nodesRef.current.delete(name);
          return;
        }

        nodesRef.current.set(name, node);

        if (initializedRef.current.get(name) === node) return;
        initializedRef.current.set(name, node);

        const initial = initialRef.current[name];

        if (autoFocus === name) node.focus();
        if (validateOnMount) runValidation();

        if (node instanceof HTMLInputElement) {
          if (node.type === 'radio') {
            node.defaultChecked = initial === node.value;
            return;
          }
          if (node.type === 'checkbox') {
            node.defaultChecked = Boolean(initial);
            return;
          }
          node.defaultValue = String(initial ?? '');
          return;
        }

        if (node instanceof HTMLTextAreaElement || node instanceof HTMLSelectElement) {
          node.value = String(initial ?? '');
        }
      },
      onChange: (async (event) => {
        if (watchingRef.current) rerender();

        const isDirty = read(name) !== initialRef.current[name];
        setDirty((currentDirty) =>
          currentDirty[name] === isDirty ? currentDirty : { ...currentDirty, [name]: isDirty }
        );

        if (validateOnChange) await runValidation(name);
        else if (validateOnBlur) clearErrors(name);

        params?.onChange?.(event);
      }) as ChangeEventHandler<UseFormElement>,
      onBlur: (async (event) => {
        if (validateOnBlur) await runValidation(name);
        setTouched((currentTouched) =>
          currentTouched[name] ? currentTouched : { ...currentTouched, [name]: true }
        );

        params?.onBlur?.(event);
      }) as FocusEventHandler<UseFormElement>
    };
  };

  const handleSubmit =
    (
      onValid: (values: Values, event?: BaseSyntheticEvent) => any,
      onInvalid?: (errors: UseFormErrors<Values>, event?: BaseSyntheticEvent) => any
    ) =>
    async (event?: BaseSyntheticEvent) => {
      event?.preventDefault();
      setSubmitting(true);

      const names = resolver
        ? (Object.keys(initialRef.current) as (keyof Values)[])
        : [...paramsRef.current.keys()];
      setTouched(names.reduce((acc, key) => ({ ...acc, [key]: true }), {}));

      try {
        const errors = await runValidation();

        if (Object.keys(errors).length) {
          onInvalid?.(errors, event);
          return;
        }

        const values = resolver ? (await resolver(getValues())).values : getValues();
        await onValid(values, event);
      } finally {
        setSubmitting(false);
      }
    };

  return {
    register,
    handleSubmit,
    dirty,
    errors,
    submitting,
    touched,
    clearErrors,
    focus,
    getValue: read,
    getValues,
    reset,
    setError,
    setValue,
    trigger,
    watch
  };
};

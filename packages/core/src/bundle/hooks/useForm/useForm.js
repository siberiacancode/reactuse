import { useRef, useState } from 'react';
import { useRerender } from '../useRerender/useRerender';
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
export const useForm = (options) => {
  const { initialValues, autoFocus, resolver, validateOnBlur, validateOnChange, validateOnMount } =
    options;
  const nodesRef = useRef(new Map());
  const initializedRef = useRef(new Map());
  const paramsRef = useRef(new Map());
  const initialRef = useRef(initialValues);
  const watchingRef = useRef(false);
  const rerender = useRerender();
  const [dirty, setDirty] = useState({});
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const read = (name) => {
    const node = nodesRef.current.get(name);
    if (!node) return initialRef.current[name];
    if ('checked' in node && (node.type === 'radio' || node.type === 'checkbox'))
      return node.checked;
    return node.value;
  };
  const getValues = () =>
    Object.keys(initialRef.current).reduce((acc, key) => {
      acc[key] = read(key);
      return acc;
    }, {});
  const setValue = (name, value) => {
    const node = nodesRef.current.get(name);
    if (!node) return;
    if ('checked' in node && (node.type === 'radio' || node.type === 'checkbox')) {
      node.checked = value;
      if (watchingRef.current) rerender();
      return;
    }
    node.value = String(value);
    if (watchingRef.current) rerender();
  };
  const focus = (name) => nodesRef.current.get(name)?.focus();
  const validate = async (name) => {
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
  const setError = (name, error) =>
    setErrors((currentErrors) => ({ ...currentErrors, [name]: error }));
  const reset = (values) => {
    initialRef.current = { ...initialRef.current, ...values };
    nodesRef.current.forEach((_, name) => setValue(name, initialRef.current[name]));
    setDirty({});
    setTouched({});
    setErrors({});
    rerender();
  };
  const clearErrors = (name) =>
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
  const runValidation = async (name) => {
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
      }, {});
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
      if (results[index]) acc[key] = results[index];
      return acc;
    }, {});
    setErrors((currentErrors) => {
      const cleared = { ...currentErrors };
      names.forEach((key) => delete cleared[key]);
      return { ...cleared, ...next };
    });
    return next;
  };
  const trigger = async (name, options) => {
    const validationErrors = await runValidation(name);
    const names = Object.keys(validationErrors);
    if (options?.shouldFocus && names.length) focus(names[0]);
    return !names.length;
  };
  const register = (name, params) => {
    paramsRef.current.set(name, params);
    return {
      name: String(name),
      ref: (node) => {
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
      onChange: async (event) => {
        if (watchingRef.current) rerender();
        const isDirty = read(name) !== initialRef.current[name];
        setDirty((currentDirty) =>
          currentDirty[name] === isDirty ? currentDirty : { ...currentDirty, [name]: isDirty }
        );
        if (validateOnChange) await runValidation(name);
        else if (validateOnBlur) clearErrors(name);
        params?.onChange?.(event);
      },
      onBlur: async (event) => {
        if (validateOnBlur) await runValidation(name);
        setTouched((currentTouched) =>
          currentTouched[name] ? currentTouched : { ...currentTouched, [name]: true }
        );
        params?.onBlur?.(event);
      }
    };
  };
  const handleSubmit = (onValid, onInvalid) => async (event) => {
    event?.preventDefault();
    setSubmitting(true);
    const names = resolver ? Object.keys(initialRef.current) : [...paramsRef.current.keys()];
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

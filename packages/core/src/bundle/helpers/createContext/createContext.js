import { jsx as _jsx } from 'react/jsx-runtime';
import { createContext as createReactContext, use, useMemo, useState } from 'react';
/**
 * @name createContext
 * @description - Creates a typed context with additional utilities
 * @category Helpers
 *
 * @template Value - The type of value that will be stored in the context
 * @param {Value | undefined} [defaultValue] - Default value for the context
 * @param {CreateContextOptions<Value>} [options] - Additional options for context creation
 * @returns {CreateContextReturn<Value>} Object containing context utilities and components
 *
 * @example
 * const { useSelect, instance, Provider } = createContext<number>(0);
 */
export const createContext = (defaultValue = undefined, options = {}) => {
  const Context = createReactContext({
    value: defaultValue,
    set: () => {}
  });
  Context.displayName = options.name;
  function useSelect(selector) {
    const context = use(Context);
    if (!context && options.strict) {
      throw new Error(`Context hook ${options.name} must be used inside a Provider`);
    }
    if (!selector) {
      return context;
    }
    return selector(context.value);
  }
  const Provider = ({ children, initialValue }) => {
    const [profile, setProfile] = useState(initialValue ?? defaultValue);
    const value = useMemo(
      () => ({
        value: profile,
        set: setProfile
      }),
      [profile]
    );
    return _jsx(Context, { value: value, children: children });
  };
  return {
    useSelect,
    instance: Context,
    Provider
  };
};

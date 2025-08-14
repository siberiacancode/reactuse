import type { JSX, ReactNode } from 'react';

import { createContext as createReactContext, useContext, useMemo, useState } from 'react';

/** The create context options type */
export interface CreateContextOptions {
  /** Display name for the context (useful for debugging) */
  name?: string;
  /** Whether to throw an error if context is used outside of Provider */
  strict?: boolean;
}

/** The context value type */
export interface ContextValue<Value> {
  /** The context value */
  value: Value | undefined;
  /** The context set function */
  set: (value: Value) => void;
}

/** The provider props type */
export interface ProviderProps<Value> {
  /** The children */
  children?: ReactNode;
  /** The initial value */
  initialValue?: Value;
}

/** The create context return type */
export interface CreateContextReturn<Value> {
  /** The context instance */
  instance: React.Context<ContextValue<Value>>;
  /** The provider component */
  Provider: (props: ProviderProps<Value>) => JSX.Element;
  /** The selector hook */
  useSelect: {
    <Selected>(selector: (value: Value) => Selected): Selected;
    (): ContextValue<Value>;
  };
}

/**
 * @name createContext
 * @description - Creates a typed context with additional utilities
 * @category Helpers
 * @usage high
 *
 * @template Value - The type of value that will be stored in the context
 * @param {Value | undefined} [defaultValue] - Default value for the context
 * @param {CreateContextOptions<Value>} [options] - Additional options for context creation
 * @returns {CreateContextReturn<Value>} Object containing context utilities and components
 *
 * @example
 * const { useSelect, instance, Provider } = createContext<number>(0);
 */
export const createContext = <Value,>(
  defaultValue: Value | undefined = undefined,
  options: CreateContextOptions = {}
): CreateContextReturn<Value> => {
  const Context = createReactContext<{
    value: Value | undefined;
    set: (value: Value) => void;
  }>({
    value: defaultValue,
    set: () => {}
  });

  Context.displayName = options.name;

  function useSelect(): ContextValue<Value>;
  function useSelect<Selected>(selector: (value: Value) => Selected): Selected;
  function useSelect<Selected>(selector?: (value: Value) => Selected) {
    const context = useContext(Context);

    if (!context && options.strict) {
      throw new Error(`Context hook ${options.name} must be used inside a Provider`);
    }

    if (!selector) {
      return context;
    }

    return selector(context.value as Value);
  }

  const Provider = ({ children, initialValue }: ProviderProps<Value>) => {
    const [profile, setProfile] = useState<Value | undefined>(initialValue ?? defaultValue);

    const value = useMemo(
      () => ({
        value: profile,
        set: setProfile
      }),
      [profile]
    );

    return <Context value={value}>{children}</Context>;
  };

  return {
    useSelect,
    instance: Context,
    Provider
  } as const;
};

import React from 'react';

import { useEvent, useIsomorphicLayoutEffect } from '@/hooks';

/** The options for the context */
export interface CreateContextSelectorOptions {
  /** The display name for the context */
  displayName: string;
  /** Whether to throw an error if the context is not found */
  strict?: boolean;
}

/** The return type for the createContextSelector function */
export interface CreateContextSelectorReturn<Value> {
  /** The Provider component for the context */
  Provider: React.Provider<Value>;
  /** A hook to check if the context is available in the component tree */
  useHasContext: () => boolean;
  /** A hook to select a part of the context state */
  useSelector: <SelectedValue>(selector?: (state: Value) => SelectedValue) => SelectedValue;
  /** A hook to select a part of the context state with strict mode */
  useStrictSelector: <SelectedValue>(selector?: (state: Value) => SelectedValue) => SelectedValue;
}

type ContextListener<T> = (value: T) => void;

interface ContextValue<Value> {
  listeners: Set<ContextListener<Value>>;
  marker: boolean;
  value: React.RefObject<Value>;
}

type Context<T> = React.Context<T>;

const createProvider = <T>(
  originalProvider: React.Provider<ContextValue<T>>,
  displayName?: string
) => {
  const Provider: React.FC<React.ProviderProps<T>> = (props) => {
    const valueRef = React.useRef(props.value);
    const contextValue = React.useRef<ContextValue<T>>({
      value: valueRef,
      listeners: new Set(),
      marker: true // true if the context is being used
    });

    useIsomorphicLayoutEffect(() => {
      if (!Object.is(valueRef.current, props.value)) {
        valueRef.current = props.value;

        React.startTransition(() => {
          contextValue.current.listeners.forEach((listener) => {
            listener(valueRef.current);
          });
        });
      }
    }, [props.value]);

    return React.createElement(originalProvider, { value: contextValue.current }, props.children);
  };

  if (displayName) Provider.displayName = displayName;

  return Provider as unknown as React.Provider<ContextValue<T>>;
};

const useContextSelector = <Value, SelectedValue>(
  context: Context<Value>,
  selector: (state: Value) => SelectedValue,
  options: CreateContextSelectorOptions
) => {
  // eslint-disable-next-line react/no-use-context
  const contextValue = React.useContext(context as unknown as Context<ContextValue<Value>>);

  const {
    value: { current: value },
    listeners,
    marker
  } = contextValue;
  const selected = selector(value);
  if (options.strict && !marker) {
    throw new Error(`Context ${options.displayName} not found`);
  }

  const [state, setState] = React.useState({ value, selected });
  const dispatch = useEvent((newValue: Value) => {
    setState((prev) => {
      if (Object.is(prev.value, newValue)) return prev;

      const newSelected = selector(newValue);
      if (Object.is(prev.selected, newSelected)) return prev;

      return { value: newValue, selected: newSelected };
    });
  });

  useIsomorphicLayoutEffect(() => {
    listeners.add(dispatch);
    return () => {
      listeners.delete(dispatch);
    };
  }, [listeners]);

  return state.selected;
};

/**
 * @name createContextSelector
 * @description - Creates a typed context selector with optimized updates for state selection
 * @category Helpers
 *
 * @template Value - The type of value that will be stored in the context
 * @param {Value | undefined} [defaultValue] - Default value for the context
 * @param {CreateContextSelectorOptions<Value>} [options] - Additional options for context creation
 * @returns {CreateContextSelectorReturn<Value>} Object containing context utilities and components
 *
 * @example
 * const { Provider, useSelector, useStrictSelector, useHasContext } = createContextSelector<number>(0);
 */
export const createContextSelector = <Value>(
  defaultValue: Value | undefined = undefined,
  options: CreateContextSelectorOptions = { displayName: 'ContextSelector', strict: false }
) => {
  const context = React.createContext<ContextValue<Value>>({
    value: { current: defaultValue as Value },
    listeners: new Set(),
    marker: false
  });

  const Provider = createProvider(context.Provider, options.displayName) as React.Provider<Value>;

  function useHasContext(): boolean;
  function useHasContext() {
    // eslint-disable-next-line react/no-use-context
    const contextValue = React.useContext(context);
    return contextValue.marker;
  }

  function useSelector(): Value;
  function useSelector<SelectedValue>(selector: (state: Value) => SelectedValue): SelectedValue;
  function useSelector<SelectedValue>(selector?: (state: Value) => SelectedValue) {
    return useContextSelector(
      context as unknown as Context<Value>,
      selector ?? ((state) => state as unknown as SelectedValue),
      options
    );
  }

  return { Provider, useSelector, useHasContext };
};

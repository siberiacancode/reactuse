import React from 'react';

/**
 * Options for the context
 * @typedef {object} ContextOptions
 * @property {string} displayName - Display name for the context
 * @property {boolean} strict - Enable strict mode for context existence checking
 */
interface ContextOptions {
  displayName: string;
  strict: boolean;
}

/**
 * Listener function for context value changes
 * @template T - Type of the context value
 * @typedef {Function} ContextListener
 * @param {T} value - New context value
 */
type ContextListener<T> = (value: T) => void;

/**
 * Internal representation of the context value
 * @template T - Type of the context value
 * @typedef {object} ContextValue
 * @property {React.RefObject<T>} value - Reference to the current value
 * @property {Set<ContextListener<T>>} listeners - Set of change listeners
 * @property {boolean} marker - Flag indicating if the context is being used
 */
interface ContextValue<T> {
  listeners: Set<ContextListener<T>>;
  marker: boolean;
  value: React.RefObject<T>;
}

/**
 * React Context type
 * @template T - Type of the context value
 */
type Context<T> = React.Context<T>;

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;

const useEventCallback = <Args extends unknown[], Return>(
  fn: (...args: Args) => Return
): ((...args: Args) => Return) => {
  const ref = React.useRef(fn);
  return React.useCallback((...args: Args) => ref.current(...args), []);
};

/**
 * Creates a Provider for context with optimized updates
 * @template T - Type of the context value
 * @param {React.Provider<ContextValue<T>>} originalProvider - Original context Provider
 * @returns {React.Provider<T>} - Optimized Provider
 */
const createProvider = <T>(originalProvider: React.Provider<ContextValue<T>>) => {
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

  return Provider as unknown as React.Provider<ContextValue<T>>;
};

/**
 * Hook for selecting part of a context state with re-render optimization
 * @template Value - Type of the full context value
 * @template SelectedValue - Type of the selected value
 * @param {Context<Value>} context - Context object
 * @param {Function} selector - State selection function
 * @returns {SelectedValue} - Selected part of the state
 */
const useContextSelector = <Value, SelectedValue>(
  context: Context<Value>,
  selector: (state: Value) => SelectedValue
) => {
  const contextValue = React.use(context as unknown as Context<ContextValue<Value>>);

  const {
    value: { current: value },
    listeners
  } = contextValue;
  const selected = selector(value);

  const [state, setState] = React.useState({ value, selected });
  const dispatch = useEventCallback((newValue: Value) => {
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
 * Creates a set of tools for working with a context optimized for state selection
 * @template T - Type of the context value
 * @param {T} defaultValue - Default context value
 * @param {ContextOptions} options - Options for configuring the context
 * @returns {object} - Object with Provider, useSelector and useHasContext
 */
export const createContextSelector = <T>(
  defaultValue: T,
  options: ContextOptions = { displayName: 'Context', strict: false }
) => {
  const context = React.createContext<ContextValue<T>>({
    value: { current: defaultValue },
    listeners: new Set(),
    marker: false
  });

  const Provider = createProvider(context.Provider) as React.Provider<T>;

  /**
   * Hook for checking if Provider exists in the component tree
   * @returns {boolean} - true if Provider is found
   */
  const useHasContext = () => {
    const contextValue = React.use(context);
    return contextValue.marker;
  };

  /**
   * Hook for selecting part of context state
   * @template SelectedValue - Type of the selected value
   * @param {Function} selector - State selection function
   * @returns {SelectedValue} - Selected part of the state
   * @throws {Error} - Error if Provider is not found in strict mode
   */
  const useSelector = <SelectedValue>(selector: (state: T) => SelectedValue) => {
    if (options?.strict) {
      const contextValue = React.use(context);
      if (!contextValue.marker) {
        throw new Error(`Context ${options?.displayName} not found`);
      }
    }

    return useContextSelector(context as unknown as Context<T>, selector);
  };

  return {
    Provider,
    useSelector,
    useHasContext
  };
};

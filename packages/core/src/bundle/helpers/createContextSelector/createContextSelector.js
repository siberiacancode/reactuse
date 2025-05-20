import React from 'react';
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;
const useEventCallback = (fn) => {
  const ref = React.useRef(fn);
  return React.useCallback((...args) => ref.current(...args), []);
};
/**
 * Creates a Provider for context with optimized updates
 * @template T - Type of the context value
 * @param {React.Provider<ContextValue<T>>} originalProvider - Original context Provider
 * @returns {React.Provider<T>} - Optimized Provider
 */
const createProvider = (originalProvider) => {
  const Provider = (props) => {
    const valueRef = React.useRef(props.value);
    const contextValue = React.useRef({
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
  return Provider;
};
/**
 * Hook for selecting part of a context state with re-render optimization
 * @template Value - Type of the full context value
 * @template SelectedValue - Type of the selected value
 * @param {Context<Value>} context - Context object
 * @param {Function} selector - State selection function
 * @returns {SelectedValue} - Selected part of the state
 */
const useContextSelector = (context, selector) => {
  const contextValue = React.use(context);
  const {
    value: { current: value },
    listeners
  } = contextValue;
  const selected = selector(value);
  const [state, setState] = React.useState({ value, selected });
  const dispatch = useEventCallback((newValue) => {
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
export const createContextSelector = (
  defaultValue,
  options = { displayName: 'Context', strict: false }
) => {
  const context = React.createContext({
    value: { current: defaultValue },
    listeners: new Set(),
    marker: false
  });
  const Provider = createProvider(context.Provider);
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
  const useSelector = (selector) => {
    if (options?.strict) {
      const contextValue = React.use(context);
      if (!contextValue.marker) {
        throw new Error(`Context ${options?.displayName} not found`);
      }
    }
    return useContextSelector(context, selector);
  };
  return {
    Provider,
    useSelector,
    useHasContext
  };
};

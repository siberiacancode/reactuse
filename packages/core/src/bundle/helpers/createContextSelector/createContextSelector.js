import React from 'react';
import { useEvent, useIsomorphicLayoutEffect } from '@/hooks';
const createProvider = (originalProvider, displayName) => {
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
  if (displayName) Provider.displayName = displayName;
  return Provider;
};
const useContextSelector = (context, selector, options) => {
  // eslint-disable-next-line react/no-use-context
  const contextValue = React.useContext(context);
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
  const dispatch = useEvent((newValue) => {
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
export const createContextSelector = (
  defaultValue = undefined,
  options = { displayName: 'ContextSelector', strict: false }
) => {
  const context = React.createContext({
    value: { current: defaultValue },
    listeners: new Set(),
    marker: false
  });
  const Provider = createProvider(context.Provider, options.displayName);
  function useHasContext() {
    // eslint-disable-next-line react/no-use-context
    const contextValue = React.useContext(context);
    return contextValue.marker;
  }
  function useSelector(selector) {
    return useContextSelector(context, selector ?? ((state) => state), options);
  }
  return { Provider, useSelector, useHasContext };
};

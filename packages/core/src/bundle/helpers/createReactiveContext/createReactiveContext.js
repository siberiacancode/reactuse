import {
  createContext,
  createElement,
  startTransition,
  use,
  useMemo,
  useRef,
  useState
} from 'react';
import { useEvent, useIsomorphicLayoutEffect } from '@/hooks';
const createProvider = (originalProvider) => {
  const Provider = (props) => {
    const valueRef = useRef(props.value);
    const contextValue = useMemo(
      () => ({
        value: valueRef,
        listeners: new Set()
      }),
      []
    );
    useIsomorphicLayoutEffect(() => {
      if (!Object.is(valueRef.current, props.value)) {
        valueRef.current = props.value;
        startTransition(() => {
          contextValue.listeners.forEach((listener) => {
            listener(valueRef.current);
          });
        });
      }
    }, [props.value]);
    return createElement(originalProvider, { value: contextValue }, props.children);
  };
  return Provider;
};
const createReactiveContextSelector = (Context, selector, options = {}) => {
  const context = use(Context);
  if (!context && options.strict) {
    throw new Error(`Context hook ${options.name} must be used inside a Provider`);
  }
  const [value, setValue] = useState({
    selected: selector(context.value.current),
    value: context.value.current
  });
  const dispatch = useEvent((newValue) => {
    setValue((prevValue) => {
      if (Object.is(prevValue.value, newValue)) return prevValue;
      const newSelected = selector(newValue);
      if (Object.is(prevValue.selected, newSelected)) return prevValue;
      return { value: newValue, selected: newSelected };
    });
  });
  useIsomorphicLayoutEffect(() => {
    context.listeners.add(dispatch);
    return () => {
      context.listeners.delete(dispatch);
    };
  }, [context.listeners]);
  return value.selected;
};
/**
 * @name createReactiveContext
 * @description - Creates a typed context selector with optimized updates for state selection
 * @category Helpers
 *
 * @template Value - The type of value that will be stored in the context
 * @param {Value | undefined} [defaultValue] - Default value for the context
 * @param {CreateReactiveContextOptions<Value>} [options] - Additional options for context creation
 * @returns {CreateReactiveContextReturn<Value>} Object containing context utilities and components
 *
 * @example
 * const { Provider, useSelector, instance } = createReactiveContext<number>(0);
 */
export const createReactiveContext = (defaultValue = undefined, options = {}) => {
  const Context = createContext({
    value: { current: defaultValue },
    listeners: new Set()
  });
  const Provider = createProvider(Context.Provider);
  Context.displayName = options.name;
  function useSelector(selector) {
    return createReactiveContextSelector(Context, selector ?? ((state) => state), options);
  }
  return { instance: Context, Provider, useSelector };
};

import type { Context, FC, Provider, ProviderProps, RefObject } from 'react';

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

/** The create reactive context options type */
export interface CreateReactiveContextOptions {
  /** Display name for the context (useful for debugging) */
  name?: string;
  /** Whether to throw an error if context is used outside of Provider */
  strict?: boolean;
}

/** The create reactive context return type */
export interface CreateReactiveContextReturn<Value> {
  /** The context instance */
  instance: Context<ReactiveContextValue<Value>>;
  /** The Provider component for the context */
  Provider: Provider<Value>;
  /** A hook to select a part of the context state */
  useSelector: <Selected>(selector?: (state: Value) => Selected) => Selected;
}

type ContextListener<Value> = (value: Value) => void;

interface ReactiveContextValue<Value> {
  /** The listeners for the context */
  listeners: Set<ContextListener<Value>>;
  /** The value for the context */
  value: RefObject<Value>;
}

const createProvider = <Value>(originalProvider: Provider<ReactiveContextValue<Value>>) => {
  const Provider: FC<ProviderProps<Value>> = (props) => {
    const valueRef = useRef(props.value);
    const contextValue = useMemo<ReactiveContextValue<Value>>(
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

  return Provider as unknown as Provider<ReactiveContextValue<Value>>;
};

const createReactiveContextSelector = <Value, Selected>(
  Context: Context<ReactiveContextValue<Value>>,
  selector: (state: Value) => Selected,
  options: CreateReactiveContextOptions = {}
) => {
  const context = use(Context);

  if (!context && options.strict) {
    throw new Error(`Context hook ${options.name} must be used inside a Provider`);
  }

  const [value, setValue] = useState({
    selected: selector(context.value.current),
    value: context.value.current
  });

  const dispatch = useEvent((newValue: Value) => {
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
 * @returns {CreateContextSelectorReturn<Value>} Object containing context utilities and components
 *
 * @example
 * const { Provider, useSelector, instance } = createReactiveContext<number>(0);
 */
export const createReactiveContext = <Value extends Record<string, any>>(
  defaultValue: Value | undefined = undefined,
  options: CreateReactiveContextOptions = {}
) => {
  const Context = createContext<ReactiveContextValue<Value>>({
    value: { current: defaultValue as Value },
    listeners: new Set()
  });

  const Provider = createProvider(Context.Provider) as unknown as Provider<Value>;

  Context.displayName = options.name;

  function useSelector(): Value;
  function useSelector<SelectedValue>(selector: (state: Value) => SelectedValue): SelectedValue;
  function useSelector<SelectedValue>(selector?: (state: Value) => SelectedValue) {
    return createReactiveContextSelector(
      Context as unknown as Context<ReactiveContextValue<Value>>,
      selector ?? ((state) => state as unknown as SelectedValue),
      options
    );
  }

  return { instance: Context, Provider, useSelector };
};
